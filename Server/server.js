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

// Stripe setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

// Firebase Admin SDK
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'firebaseServiceAccount.json'))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

// Express app setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🟢 Health check
app.get('/', (req, res) => {
  res.send('✅ Stripe Payment Backend is running');
});

// 🔄 Add or attach payment method
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
      // 🆕 Create customer if one doesn't exist
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
      // 🔁 Attach payment method to existing customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      // 🧾 Set as default payment method for invoices
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // 🔃 Update Firestore with new default card
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
app.delete('/api/payment-method/:id', async (req, res) => {
  try {
    const deleted = await stripe.paymentMethods.detach(req.params.id);
    res.status(200).json({ deleted });
  } catch (err) {
    console.error('❌ Detach error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
