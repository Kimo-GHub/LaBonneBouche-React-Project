import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SavedCards = ({ customerId }) => {
  const [cards, setCards] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchCards = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/payment-methods/${customerId}`);
      setCards(res.data.methods);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/payment-method/${id}`);
      setMessage('✅ Card deleted');
      setConfirmDeleteId(null);
      fetchCards();
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
      <h3>Saved Cards</h3>
      {cards.map((card) => (
        <div key={card.id} className="card-item">
          <p>
            💳 **** {card.card.last4} — Expires {card.card.exp_month}/{card.card.exp_year}
          </p>
          <button onClick={() => setConfirmDeleteId(card.id)}>Delete</button>

          {confirmDeleteId === card.id && (
            <div className="delete-modal">
              <p>Are you sure you want to delete this card?</p>
              <button onClick={() => handleDelete(card.id)}>Yes</button>
              <button onClick={() => setConfirmDeleteId(null)}>Cancel</button>
            </div>
          )}
        </div>
      ))}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SavedCards;
