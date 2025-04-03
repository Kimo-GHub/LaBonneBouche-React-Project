import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import '../../styles/Profile/PaymentMethod.css';

const stripePromise = loadStripe(
  'pk_test_51R9pzqIyKDuyNPl5x1DuXLb3C0ZUCDLvEGeGycdfDEvIlM61bpa5J4B6kzuD2wgCaD7hV70x1Rs6I8dMfiBmNz3W00TJQP9D2i'
);

const PaymentForm = ({ fetchPaymentMethods }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setMessage('❌ Stripe not ready');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: user?.displayName || 'Customer',
          email: user?.email,
        }
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      const res = await axios.post('http://localhost:5000/api/payment-method', {
        paymentMethodId: paymentMethod.id,
        uid: user.uid,
        email: user.email,
        name: user.displayName || "Customer",
      });

      if (res.data.success) {
        setMessage('✅ Card added!');
        fetchPaymentMethods();
      } else {
        setMessage(`⚠️ ${res.data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage(`❌ Backend error: ${err.response?.data?.message || 'Unknown'}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h2>Add Payment Method</h2>
      <CardElement className="card-element" />
      <button type="submit" disabled={!stripe || loading} className="payment-submit-btn">
        {loading ? 'Processing...' : 'Save Card'}
      </button>
      {message && <p className="payment-message">{message}</p>}
    </form>
  );
};

const SavedCards = ({ customerId, fetchPaymentMethods }) => {
  const [cards, setCards] = useState([]);
  const [defaultCardId, setDefaultCardId] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [message, setMessage] = useState('');
  const auth = getAuth();
  const db = getFirestore();

  const fetchCards = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/payment-methods/${customerId}`);
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const snap = await getDoc(userRef);
      setCards(res.data.methods);
      setDefaultCardId(snap.data()?.defaultPaymentMethodId || '');
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const setAsDefault = async (id) => {
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        defaultPaymentMethodId: id,
      });
      setDefaultCardId(id);
      setMessage('✅ Default card set!');
    } catch (err) {
      console.error('Set default error:', err);
      setMessage('❌ Failed to set default');
    }
  };

  const deleteCard = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/payment-method/${id}`);
      setMessage('✅ Card deleted');
      setConfirmId(null);
      fetchPaymentMethods();
    } catch (err) {
      console.error('Delete error:', err);
      setMessage('❌ Could not delete card');
    }
  };

  useEffect(() => {
    if (customerId) fetchCards();
  }, [customerId]);

  return (
    <div className="saved-cards">
      {cards.length > 0 && <h3>Saved Cards</h3>}
      {cards.map((card) => (
        <div key={card.id} className="card-item">
          <img
            src={`/icons/${card.card.brand}.svg`}
            alt={card.card.brand}
            className="card-icon"
          />
          **** {card.card.last4} — Expires {card.card.exp_month}/{card.card.exp_year}
          {defaultCardId === card.id ? (
            <span className="default-badge">✅ Default</span>
          ) : (
            <button onClick={() => setAsDefault(card.id)}>Set as Default</button>
          )}
          <button onClick={() => setConfirmId(card.id)}>Delete</button>
          {confirmId === card.id && (
            <div className="delete-modal">
              <p>Are you sure you want to delete this card?</p>
              <button onClick={() => deleteCard(card.id)}>Yes</button>
              <button onClick={() => setConfirmId(null)}>Cancel</button>
            </div>
          )}
        </div>
      ))}
      {message && <p className="payment-message">{message}</p>}
    </div>
  );
};

const PaymentMethod = () => {
  const [customerId, setCustomerId] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const auth = getAuth();
  const db = getFirestore();

  const fetchCustomerId = async () => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const snap = await getDoc(userRef);
      setCustomerId(snap.data()?.customerId || '');
    } catch (err) {
      console.error('Fetch customerId error:', err);
    }
  };

  const fetchPaymentMethods = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    fetchCustomerId();
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm fetchPaymentMethods={fetchPaymentMethods} />
      {customerId && (
        <SavedCards
          customerId={customerId}
          fetchPaymentMethods={fetchPaymentMethods}
          key={refreshTrigger}
        />
      )}
    </Elements>
  );
};

export default PaymentMethod;
