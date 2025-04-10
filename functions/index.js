const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const corsMiddleware = require("cors")({ origin: true }); // Allows CORS from any domain

admin.initializeApp();

// ✅ Gmail App Password Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'Mohammadfawzi005@email.com',  // Your Gmail
    pass: 'aojn pxqv atxq kxou'           // App Password (NOT normal Gmail password)
  }
});

// ✅ Create User With Role (onCall function)
exports.createUserWithRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Only authenticated users can create accounts.');
  }

  const { email, password, firstName, lastName, role } = data;

  if (!email || !password || !firstName || !lastName || !role) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required user info.');
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
    console.error("User creation error:", error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ✅ Send Order Status Email (HTTP with CORS)
exports.sendOrderStatusEmail = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    const { email, orderId, status } = req.body;

    if (!email || !orderId || !status) {
      return res.status(400).json({ error: 'Missing email, orderId or status.' });
    }

    const mailOptions = {
      from: 'La Bonne Bouche <Mohammadfawzi004@email.com>',
      to: email,
      subject: `Order #${orderId} Status Update`,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px;">
          <p>Hello,</p>
          <p>Your order <strong>#${orderId}</strong> status has been updated to:</p>
          <h2 style="color: #091A45;">${status.toUpperCase()}</h2>
          <p>Thank you for ordering from <strong>La Bonne Bouche</strong>!</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("❌ Error sending status email:", error);
      return res.status(500).json({ error: "Failed to send status email." });
    }
  });
});

exports.sendOrderConfirmationEmail = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    const { email, name, orderTotal, deliveryMethod } = req.body;

    if (!email || !name || orderTotal === undefined || !deliveryMethod) {
      return res.status(400).json({ error: 'Missing order confirmation data.' });
    }

    const mailOptions = {
      from: 'La Bonne Bouche <Mohammadfawzi004@email.com>',
      to: email,
      subject: `Thank you for your order!`,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px;">
          <p>Hi ${name},</p>
          <p>We’re happy to confirm that we’ve received your order at <strong>La Bonne Bouche</strong>!</p>
          <p><strong>Total:</strong> $${parseFloat(orderTotal).toFixed(2)}</p>
          <p><strong>Delivery Method:</strong> ${deliveryMethod}</p>
          <br/>
          <p>We’ll begin processing your order right away. 🍰</p>
          <p>Thank you again for shopping with us!</p>
        </div>
      `
    };

    console.log("📤 Email payload:", mailOptions);

    try {
      await transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully");
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("❌ Nodemailer error:", error);
      return res.status(500).json({ error: error.message || "Failed to send confirmation email." });
    }
  });
});


