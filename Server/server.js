import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import Stripe from 'stripe';

// 🔐 Load .env file
dotenv.config();

// ✅ Initialize Stripe securely using your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

const app = express();

// 🌐 Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('✅ Stripe Payment Backend is running');
});

// 💳 Route to handle payment method token
app.post('/api/payment-method', async (req, res) => {
  const { token } = req.body;

  console.log("📥 Received token from client:", token);

  // Validate the token
  if (!token || typeof token !== 'string') {
    console.warn("⚠️ Invalid or missing token.");
    return res.status(400).json({ success: false, message: 'Invalid or missing token' });
  }

  try {
    // 🔄 Create a new Stripe customer using the token
    const customer = await stripe.customers.create({
      source: token,
      description: 'Customer from LaBonneBouche React App',
    });

    console.log('✅ Stripe customer created successfully:', customer.id);

    // Send success response to frontend
    res.status(200).json({ success: true, customerId: customer.id });

  } catch (error) {
    console.error('❌ Stripe API error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Stripe API error: ' + error.message,
    });
  }
});

// 🚀 Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at: http://localhost:${PORT}`);
});
