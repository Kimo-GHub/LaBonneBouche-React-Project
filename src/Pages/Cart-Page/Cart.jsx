import React, { useState } from 'react';
import Header from '../../components/Header-Footer/Header';
import Footer from '../../components/Header-Footer/Footer';
import { useCart } from '../../context/CartContext'; // Update if your CartContext is in a different path
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
  } = useCart();

  const [inputCode, setInputCode] = useState('');

  const handlePromoApply = () => {
    applyPromoCode(inputCode);
    setInputCode('');
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
            {/* Left: Cart Items */}
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

            {/* Right: Cart Summary */}
            <div className="cart-summary">
              <h2 className="summary-title">Cart Summary</h2>

              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="promo-section">
                <input
                  type="text"
                  placeholder="Promo code"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                />
                <button onClick={handlePromoApply}>Apply</button>
                {promoMessage && <p className="promo-message">{promoMessage}</p>}
              </div>

              {discount > 0 && (
                <div className="summary-row">
                  <span>Discount:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row total-row">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button className="checkout-btn">Proceed to Checkout</button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Cart;
