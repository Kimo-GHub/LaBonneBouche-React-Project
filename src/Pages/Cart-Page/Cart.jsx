import React, { useEffect, useState } from 'react';
import Header from '../../components/Header-Footer/Header';
import Footer from '../../components/Header-Footer/Footer';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../Firebase/firebase';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import './cart.css';
import trashIcon from '../../images/Cart-images/Icon.png';

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
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [localPromoMessage, setLocalPromoMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    address: '',
    nameOnCard: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const navigate = useNavigate();
  
  // Shipping cost is fixed (you can update as needed)
  const shippingCost = 3.5;
  const finalTotal = total + shippingCost;

  // Hide promo message after 2 seconds
  useEffect(() => {
    if (promoMessage) {
      setLocalPromoMessage(promoMessage);
      const timer = setTimeout(() => setLocalPromoMessage(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [promoMessage]);

  const validateForm = () => {
    const errors = {};
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    if (paymentMethod === 'card') {
      if (!formData.nameOnCard.trim()) {
        errors.nameOnCard = 'Name on card is required';
      }
      if (!formData.cardNumber.trim()) {
        errors.cardNumber = 'Card number is required';
      } else if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData.cardNumber)) {
        errors.cardNumber = 'Invalid card number format';
      }
      if (!formData.expiryDate.trim()) {
        errors.expiryDate = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/.test(formData.expiryDate)) {
        errors.expiryDate = 'Invalid expiry date (MM/YYYY)';
      }
      if (!formData.cvv.trim()) {
        errors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        errors.cvv = 'Invalid CVV (3-4 digits)';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
    if (formErrors.cardNumber) {
      setFormErrors(prev => ({
        ...prev,
        cardNumber: ''
      }));
    }
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 6);
    }
    setFormData(prev => ({
      ...prev,
      expiryDate: value
    }));
    if (formErrors.expiryDate) {
      setFormErrors(prev => ({
        ...prev,
        expiryDate: ''
      }));
    }
  };

  const handlePromoApply = async () => {
    if (!inputCode.trim()) return;
    setApplyingPromo(true);
    await applyPromoCode(inputCode);
    setApplyingPromo(false);
  };

  const handleCheckoutClick = () => {
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    const user = auth.currentUser;
    if (!user) return navigate('/login');

    try {
      setShowConfirmModal(false);
      
      // Process order
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const phone = userDoc.exists() ? userDoc.data().phoneNumber || 'N/A' : 'N/A';

      const orderData = {
        customerName: user.displayName || 'N/A',
        customerEmail: user.email,
        customerPhone: phone,
        customerAddress: formData.address,
        items: cartItems,
        total: finalTotal,
        discount,
        paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery',
        status: 'in progress',
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'orders'), orderData);
      clearCart();

      setOrderSuccess({ 
        message: "🎉 Yay! Your order is confirmed!", 
        isProcessing: false,
        isError: false,
        isCentered: true
      });
      setTimeout(() => setOrderSuccess(null), 4000);
    } catch (error) {
      console.error('❌ Error saving order:', error);
      setOrderSuccess({ 
        message: "❌ Error processing your order", 
        isProcessing: false,
        isError: true,
        isCentered: true
      });
      setTimeout(() => setOrderSuccess(null), 4000);
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
            {/* Cart Items Section */}
            <div className="cart-page">
              <div className="cart-header">
                <span className="header-product">Product</span>
                <span className="header-quantity">Quantity</span>
                <span className="header-price">Price</span>
              </div>
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="product-info">
                    <img src={item.imageUrl} alt={item.name} className="product-image" />
                    <div className="product-details">
                      <p className="item-name">{item.name}</p>
                      <p className="item-description">{item.description}</p>
                    </div>
                  </div>
                  <div className="quantity-section">
                    <div className="quantity-controls">
                      <button className="quantity-btn minus" onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button className="quantity-btn plus" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                  </div>
                  <div className="price-section">
                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      <img src={trashIcon} alt="Remove" className="trash-icon" />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="cart-totals">
                {/* Promo Code Section placed at the top */}
                <div className="promo-code-section">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Enter promo code"
                  />
                  <button onClick={handlePromoApply} disabled={!inputCode || applyingPromo}>
                    {applyingPromo ? 'Applying...' : 'Apply'}
                  </button>
                  {localPromoMessage && <p className="promo-message">{localPromoMessage}</p>}
                </div>
                
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="total-row">
                    <span>Discount:</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="total-row">
                  <span>Delivery:</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Summary / Checkout Form Section */}
            <div className="order-summary">
              <h2 className="summary-title">You're Almost There!</h2>
              
              <div className="form-section">
                <h3 className="form-section-title">Address</h3>
                <div className="form-input-container">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your full address"
                  />
                  {formErrors.address && <span className="error-message">{formErrors.address}</span>}
                </div>
              </div>
              
              <div className="divider"></div>
              
              <div className="form-section">
                <h3 className="form-section-title">Payment Method</h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <span className="payment-label">Credit Card</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <span className="payment-label">Cash on Delivery</span>
                  </label>
                </div>
              </div>
              
              {paymentMethod === 'card' && (
                <>
                  <div className="divider"></div>
                  
                  <div className="form-section">
                    <h3 className="form-section-title">Name On Card</h3>
                    <div className="form-input-container">
                      <input
                        type="text"
                        name="nameOnCard"
                        value={formData.nameOnCard}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Full name on card"
                      />
                      {formErrors.nameOnCard && <span className="error-message">{formErrors.nameOnCard}</span>}
                    </div>
                  </div>
                  
                  <div className="divider"></div>
                  
                  <div className="form-section">
                    <h3 className="form-section-title">Card Number</h3>
                    <div className="form-input-container">
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        className="form-input"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                      {formErrors.cardNumber && <span className="error-message">{formErrors.cardNumber}</span>}
                    </div>
                  </div>
                  
                  <div className="divider"></div>
                  
                  <div className="form-row">
                    <div className="form-section">
                      <h3 className="form-section-title">Expiration Date</h3>
                      <div className="form-input-container">
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleExpiryDateChange}
                          className="form-input"
                          placeholder="MM/YYYY"
                          maxLength="7"
                        />
                        {formErrors.expiryDate && <span className="error-message">{formErrors.expiryDate}</span>}
                      </div>
                    </div>
                    <div className="form-section">
                      <h3 className="form-section-title">CVV</h3>
                      <div className="form-input-container">
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="123"
                          maxLength="4"
                        />
                        {formErrors.cvv && <span className="error-message">{formErrors.cvv}</span>}
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <button className="checkout-btn" onClick={handleCheckoutClick}>
                CHECK OUT
              </button>
            </div>
          </div>
        )}

        {/* Order Status Toast */}
        {orderSuccess && (
          <div className={`order-success-toast 
            ${orderSuccess.isProcessing ? 'processing' : ''} 
            ${orderSuccess.isError ? 'error' : ''} 
            ${orderSuccess.isCentered ? 'centered' : ''}`}>
            {orderSuccess.message}
          </div>
        )}

        {/* Confirmation Modal */}
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
