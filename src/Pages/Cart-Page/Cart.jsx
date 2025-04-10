import React, { useEffect, useState } from 'react';
import Header from '../../components/Header-Footer/Header';
import Footer from '../../components/Header-Footer/Footer';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../Firebase/firebase';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import './cart.css';

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    promoCode,
    applyPromoCode,
    promoMessage,
    discount,
    subtotal,
    total,
    usedCoupons,
    clearCart,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('card');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [localPromoMessage, setLocalPromoMessage] = useState('');
  const navigate = useNavigate();

  const shippingCost = shippingMethod === 'cod' ? 3 : 0;
  const finalTotal = total + shippingCost;

  useEffect(() => {
    if (promoMessage) {
      setLocalPromoMessage(promoMessage);
      const timer = setTimeout(() => {
        setLocalPromoMessage('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [promoMessage]);

  const handlePromoApply = async () => {
    if (!inputCode.trim()) return;
    setApplyingPromo(true);
    await applyPromoCode(inputCode);
    setApplyingPromo(false);
  };

  const handlePlaceOrder = async () => {
    const user = auth.currentUser;
    if (!user) return navigate('/login');

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const phone = userDoc.exists() ? userDoc.data().phoneNumber || 'N/A' : 'N/A';

      const orderData = {
        customerName: user.displayName || 'N/A',
        customerEmail: user.email,
        customerPhone: phone,
        items: cartItems,
        total: finalTotal,
        discount,
        deliveryMethod:
          shippingMethod === 'cod'
            ? 'Cash on Delivery'
            : shippingMethod === 'pickup'
            ? 'Local Pickup'
            : 'Card',
        status: 'in progress',
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      setShowConfirmModal(false);
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 3000);
    } catch (error) {
      console.error('❌ Error saving order:', error);
    }
  };

  return (
    <div>
      <Header />
      <main className="cart-main">
        <h1 className="cart-title">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="cart-content-placeholder">Your cart is empty.</p>
        ) : (
          <div className="cart-container">
            <div className="cart-page">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.imageUrl} alt={item.name} />
                  <div className="cart-item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-price">
                      ${item.price || item.originalPrice} x {item.quantity}
                    </p>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>X</button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2 className="summary-title">Cart Summary</h2>

              <div className="summary-row">
                <span>Subtotal:</span><span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="promo-section">
                <input
                  type="text"
                  placeholder="Promo code"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                />
                <button onClick={handlePromoApply} disabled={!inputCode || applyingPromo}>
                  {applyingPromo ? 'Applying...' : 'Apply'}
                </button>
                {localPromoMessage && <p className="promo-message">{localPromoMessage}</p>}
              </div>

              {discount > 0 && (
                <div className="summary-row">
                  <span>Discount:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              {usedCoupons.length > 0 && (
                <div className="used-coupons-section">
                  <p style={{ fontWeight: 'bold', marginTop: '20px' }}>Used Promo Codes:</p>
                  <ul className="used-coupon-list">
                    {usedCoupons.map((c, i) => (
                      <li key={i}>
                        <strong>{c.code}</strong> — {c.type === 'flat' ? `$${c.amount}` : `${c.amount}%`} off
                        (Saved: <strong>${c.valueApplied}</strong>)
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="shipping-section">
                <p style={{ marginBottom: '8px', fontWeight: '500' }}>Shipping Method:</p>
                <label>
                  <input
                    type="radio"
                    value="cod"
                    checked={shippingMethod === 'cod'}
                    onChange={() => setShippingMethod('cod')}
                  /> Cash on Delivery (+$3)
                </label>
                <label>
                  <input
                    type="radio"
                    value="card"
                    checked={shippingMethod === 'card'}
                    onChange={() => setShippingMethod('card')}
                  /> Pay by Card (Free)
                </label>
                <label>
                  <input
                    type="radio"
                    value="pickup"
                    checked={shippingMethod === 'pickup'}
                    onChange={() => setShippingMethod('pickup')}
                  /> Local Pickup (Free)
                </label>
              </div>

              <div className="summary-row">
                <span>Shipping:</span><span>${shippingCost.toFixed(2)}</span>
              </div>

              <div className="summary-row total-row">
                <span>Total:</span><span>${finalTotal.toFixed(2)}</span>
              </div>

              <button className="checkout-btn" onClick={() => setShowConfirmModal(true)}>
                Place Order
              </button>
            </div>
          </div>
        )}

        {/* ✅ Order Success Toast */}
        {orderSuccess && (
          <div className="order-success-toast">
            🎉 Your order has been placed successfully!
          </div>
        )}

        {/* ✅ Confirmation Modal */}
        {showConfirmModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Confirm Your Order</h3>
              <p>Are you sure you want to place your order?</p>
              <p style={{ fontSize: '0.9rem' }}>💡 Don't forget to apply your promo code!</p>
              <div className="modal-buttons">
                <button className="confirm-btn" onClick={handlePlaceOrder}>Yes, Place Order</button>
                <button className="cancel-btn" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Cart;
