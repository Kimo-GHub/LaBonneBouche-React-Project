import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

// Firebase Admin SDK setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Attempt to load local service account file
let serviceAccount;
const serviceAccountPath = path.join(__dirname, 'firebaseServiceAccount.json');

if (fs.existsSync(serviceAccountPath)) {
  try {
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  } catch (err) {
    console.error('Error reading Firebase service account JSON file:', err);
    process.exit(1);
  }
}

// Initialize Firebase Admin using the local service account
// or fallback to GOOGLE_APPLICATION_CREDENTIALS if available.
if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Optionally include projectId if needed:
    // projectId: serviceAccount.project_id,
  });
  console.log('Firebase Admin initialized using local service account file.');
} else {
  // If no local file, ensure GOOGLE_APPLICATION_CREDENTIALS is set in your environment.
  admin.initializeApp();
  console.log('Firebase Admin initialized using GOOGLE_APPLICATION_CREDENTIALS environment variable.');
}

const firestore = admin.firestore();

// Express app setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🟢 Health check endpoint
app.get('/', (req, res) => {
  res.send('✅ Stripe Payment Backend is running');
});

// 🔄 Add or attach payment method endpoint
app.post('/api/payment-method', async (req, res) => {
  const { paymentMethodId, uid, email, name } = req.body;

  if (!paymentMethodId || !uid || !email) {
    return res.status(400).json({ success: false, message: 'Missing paymentMethodId, uid, or email' });
  }

  try {
    const userRef = firestore.collection('users').doc(uid);
    const userSnap = await userRef.get();
    let customerId = userSnap.exists ? userSnap.data().customerId : null;

    if (!customerId) {
      // 🆕 Create a new Stripe customer if one doesn't exist
      const customer = await stripe.customers.create({
        email,
        name: name || 'Customer from LaBonneBouche React App',
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });
      customerId = customer.id;
      await userRef.set(
        {
          customerId,
          defaultPaymentMethodId: paymentMethodId,
        },
        { merge: true }
      );
    } else {
      // 🔁 Attach payment method to an existing customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
      // 🧾 Update the customer to set this as the default payment method
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      // 🔃 Update Firestore with the new default card
      await userRef.set(
        {
          defaultPaymentMethodId: paymentMethodId,
        },
        { merge: true }
      );
    }

    res.status(200).json({ success: true, customerId });
  } catch (err) {
    console.error('❌ Stripe error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📤 Get saved cards for a customer
app.get('/api/payment-methods/:customerId', async (req, res) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: req.params.customerId,
      type: 'card',
    });
    res.status(200).json({ methods: paymentMethods.data });
  } catch (err) {
    console.error('❌ Fetch payment methods error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ❌ Detach a saved card
// Note: Be sure your route names match what your client expects.
app.delete('/api/payment-method/:id', async (req, res) => {
  try {
    const deleted = await stripe.paymentMethods.detach(req.params.id);
    res.status(200).json({ deleted });
  } catch (err) {
    console.error('❌ Detach error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// 🚀 Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
