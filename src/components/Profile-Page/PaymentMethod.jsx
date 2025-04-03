import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import '../../styles/Profile/PaymentMethod.css';

// ✅ Use your actual Stripe publishable key here (never use the secret key in frontend!)
const stripePromise = loadStripe('pk_test_51R9pzqIyKDuyNPl5x1DuXLb3C0ZUCDLvEGeGycdfDEvIlM61bpa5J4B6kzuD2wgCaD7hV70x1Rs6I8dMfiBmNz3W00TJQP9D2i');

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setMessage('Stripe has not loaded yet.');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, token } = await stripe.createToken(cardElement);

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    try {
      // ✅ Correct backend URL (make sure your Express server is running on localhost:5000)
      const response = await axios.post('http://localhost:5000/api/payment-method', {
        token: token.id
      });

      if (response.data.success) {
        setMessage('✅ Payment method added successfully!');
      } else {
        setMessage('⚠️ Something went wrong while adding the card.');
      }
    } catch (err) {
      setMessage('❌ Error adding payment method. Is your backend running?');
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h2>Add Payment Method</h2>
      <CardElement className="card-element" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="payment-submit-btn"
      >
        {loading ? 'Processing...' : 'Save Card'}
      </button>
      {message && <p className="payment-message">{message}</p>}
    </form>
  );
};

const PaymentMethod = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default PaymentMethod;
