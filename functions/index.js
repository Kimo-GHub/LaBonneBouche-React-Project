const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

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
