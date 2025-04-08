const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// ✅ CREATE USER WITH ROLE FUNCTION
exports.createUserWithRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Only authenticated users can create accounts.'
    );
  }

  const { email, password, firstName, lastName, role } = data;

  if (!email || !password || !firstName || !lastName || !role) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required user information.'
    );
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email,
      firstName,
      lastName,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { message: 'User created successfully!' };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ✅ SET UP NODEMAILER TRANSPORT
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'Mohammadfawzi004@email.com',        // ✅ Replace with your Gmail address
    pass: 'dkfd dbrb wghc aayq' // ✅ Use an App Password, not your Gmail password
  }
});

// ✅ SEND ORDER STATUS EMAIL FUNCTION
exports.sendOrderStatusEmail = functions.https.onCall(async (data, context) => {
  const { email, orderId, status } = data;

  if (!email || !orderId || !status) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters.');
  }

  const mailOptions = {
    from: 'La Bonne Bouche <Mohammadfawzi004@email.com>', // ✅ Update your brand name & email
    to: email,
    subject: `Order ${orderId} Status Update`,
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 16px;">
        <p>Hello,</p>
        <p>Your order <strong>#${orderId}</strong> status has been updated to:</p>
        <h2 style="color: #091A45;">${status.toUpperCase()}</h2>
        <p>Thank you for ordering from La Bonne Bouche!</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new functions.https.HttpsError("internal", "Failed to send email.");
  }
});
