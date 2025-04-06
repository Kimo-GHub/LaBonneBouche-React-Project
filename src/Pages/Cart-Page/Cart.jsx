import React, { useContext } from 'react';
import Header from '../../components/Header-Footer/Header';
import Footer from '../../components/Header-Footer/Footer';
import { CartContext } from '../../App';
import './cart.css';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  return (
    <div>
      <Header />
      <main className="cart-main">
        <h1 className="cart-title">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="cart-content-placeholder">Your cart is empty.</p>
        ) : (
          <div className="cart-page">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.imageUrl} alt={item.name} />
                <div>
                  <p><strong>{item.name}</strong></p>
                  <p>${item.price || item.originalPrice} x {item.quantity}</p>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>X</button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Cart;
