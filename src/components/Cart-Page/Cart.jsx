import React from 'react';
// import './CartPage.css'; // Include all relevant styles (Cart.css, CartRes.css, etc.)

// import logo from './assets/images/cart/cart-images/logo.png';
// import product1 from './assets/images/cart/cart-images/Chocochips.png';
// import product2 from './assets/images/cart/cart-images/MiniBrownies.png';
// import product3 from './assets/images/cart/cart-images/OrangeCake.png';
// import creditCardImg from './assets/images/cart/cart-images/creditcard.png';
// import cashOnDeliveryImg from './assets/images/cart/cart-images/COD.png';
// import vectorSVG from './assets/images/cart/cart-images/vector-footer.svg'; // save the SVG or inline it
// import footerLogo from './assets/images/cart/cart-images/logo2.png';
// import facebookIcon from './assets/images/cart/cart-images/facebook-icon.png';
// import instagramIcon from './assets/images/cart/cart-images/instagram-icon.png';
// import tiktokIcon from './assets/images/cart/cart-images/tiktok-icon.png';

/*function Cart(){
  return (
    <div>
    */
      {/* Header */}
      /*<header id="Cart-header">
        <nav className="navbar navbar-expand-lg navbar-light pt-5">
          <div className="container-fluid">
            <div className="col-6 col-md-3 logo">
              <a href="#"><img src={logo} alt="La Bonne Bouche" className="img-fluid" /></a>
            </div>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span></span><span></span><span></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item"><a href="/home" className="link">Home</a></li>
                <li className="nav-item"><a href="/about" className="link">About Us</a></li>
                <li className="nav-item"><a href="/products" className="link">Shop</a></li>
                <li className="nav-item"><a href="/cart" className="link active">My Cart</a></li>
                <li className="nav-item"><a href="/contact" className="link">Contact Us</a></li>
              </ul>
              <div className="auth-buttons d-flex">
                <button className="login-btn">Login</button>
                <button className="signup-btn">Sign up</button>
              </div>
            </div>
          </div>
        </nav>
      </header>
*/
      {/* Hero Section */}
      /*
      <main className="w-100">
        <section className="hero d-flex flex-column justify-content-start">
          <h1 id="hero-title">Your Cart</h1>
          <h2 id="hero-subtitle">Your Order Summary</h2>
          <div className="d-flex flex-row justify-content-center">
            <span id="hero-home" style={{ color: "white", fontSize: 14 }}>Home</span>
            <span id="hero-my-cart" style={{ color: "white", fontSize: 16 }}>→ My Cart</span>
          </div>
        </section>
*/
        {/* Cart Section */}
        /*
        <section className="cart-section d-flex justify-content-around">*/
          {/* Cart Items */}
          /*
          <div className="cart-items-container">
            <div className="cart-header">
              <p className="product-header">Product</p>
              <p className="quantity-header">Quantity</p>
              <p className="price-header">Price</p>
            </div>
            <hr className="header-divider" />
*/
            {/* Item 1 */}
            /*
            <div className="cart-item">
              <img src={product1} alt="Chocolate Chip Cookie" className="cart-item-image" />
              <div className="cart-item-details">
                <h3 className="cart-item-title">Chocolate Chips Cookie</h3>
                <p className="cart-item-description">Vanilla cookies filled with dark Belgian chocolate and a pinch of salt</p>
              </div>
              <div className="cart-item-quantity">
                <div className="counter-buttons">
                  <button className="counter-button">-</button>
                  <input type="number" className="quantity-input" defaultValue={1} min="1" />
                  <button className="counter-button">+</button>
                </div>
              </div>
              <p className="cart-item-price">$3.50</p>
            </div>
*/
            {/* Item 2 */}
            /*
            <div className="cart-item">
              <img src={product2} alt="Mini Brownies" className="cart-item-image" />
              <div className="cart-item-details">
                <h3 className="cart-item-title">Mini Brownies</h3>
                <p className="cart-item-description">A dive into your chocolate fantasies, floating in rich and intense flavors</p>
              </div>
              <div className="cart-item-quantity">
                <div className="counter-buttons">
                  <button className="counter-button">-</button>
                  <input type="number" className="quantity-input" defaultValue={1} min="1" />
                  <button className="counter-button">+</button>
                </div>
              </div>
              <p className="cart-item-price">$4.00</p>
            </div>
*/
            {/* Item 3 */}
            /*
            <div className="cart-item">
              <img src={product3} alt="Orange Cake" className="cart-item-image" />
              <div className="cart-item-details">
                <h3 className="cart-item-title">Orange Cake</h3>
                <p className="cart-item-description">Made with fresh orange juice, zest, and caramelized sliced orange topping</p>
              </div>
              <div className="cart-item-quantity">
                <div className="counter-buttons">
                  <button className="counter-button">-</button>
                  <input type="number" className="quantity-input" defaultValue={1} min="1" />
                  <button className="counter-button">+</button>
                </div>
              </div>
              <p className="cart-item-price">$30.00</p>
            </div>
*/
            {/* Cart Summary */}
            /*
            <div className="cart-summary">
              <p><span className="label">Subtotal</span><strong>$37.50</strong></p>
              <p><span className="label">Delivery</span><strong>Free</strong></p>
              <p className="total"><span className="label">Total:</span><strong>$37.50</strong></p>
            </div>
          </div>
*/
          {/* Checkout Section */}
          /*
          <div className="checkout-container">
            <h2 className="checkout-title">You’re Almost There!</h2>
            <form className="checkout-form">
              <label>Address</label>
              <input type="text" className="checkout-input" value="Building 5, 4th Floor, Hamra Street, Beirut, Lebanon" readOnly />

              <div className="line-divider"></div>

              <label>Payment Method</label>
              <div className="payment-options">
                <div className="payment-option">
                  <input type="radio" id="credit-card" name="payment" defaultChecked />
                  <img src={creditCardImg} alt="Credit Card" />
                  <label htmlFor="credit-card">Credit Card</label>
                </div>
                <div className="payment-option">
                  <input type="radio" id="cash-on-delivery" name="payment" />
                  <img src={cashOnDeliveryImg} alt="Cash On Delivery" />
                  <label htmlFor="cash-on-delivery">On Delivery</label>
                </div>
              </div>

              <div className="line-divider"></div>

              <label>Name On Card</label>
              <input type="text" className="checkout-input" value="Lina Khoury" readOnly />

              <div className="line-divider"></div>

              <label>Card Number</label>
              <input type="text" className="checkout-input" value="**** **** **** 2341" readOnly />

              <div className="line-divider"></div>

              <div className="card-details">
                <div className="expiration-date-container">
                  <label>Expiration Date</label>
                  <div className="expiration-date-input">
                    <select className="dropdown">
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1}>{String(i + 1).padStart(2, '0')}</option>
                      ))}
                    </select>
                    <select className="dropdown">
                      {[2024, 2025, 2026, 2027, 2028].map(year => (
                        <option key={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="cvv-container">
                  <label htmlFor="cvv">CVV</label>
                  <input type="text" id="cvv" className="checkout-input" value="135" readOnly />
                </div>
              </div>

              <div className="line-divider"></div>
              <button type="button" className="checkout-button">CHECK OUT</button>
            </form>
          </div>
        </section>
      </main>
*/
      {/* SVG Vector Above Footer */}
      /*
      <div className="vector-above-footer">
      */
        {/* Optionally inline the SVG directly here */}
        /*
        <img src={vectorSVG} alt="Vector Design" />
        
      </div>
*/
      {/* Footer */}
      /*
      <footer className="text-white" style={{ backgroundColor: '#ffffff' }}>
        <div id="footer-content" className="d-flex column align-content-center justify-content-between" style={{ backgroundColor: '#091a45' }}>
          <div id="logo-container"><img src={footerLogo} alt="LaBonneBouche" id="footer-logo" /></div>
          <ul className="footer-list" id="list1">
            <li className="footer-text">About Us</li>
            <li className="footer-text">Products</li>
            <li className="footer-text">Newsletter</li>
          </ul>
          <ul className="footer-list" id="list2">
            <li className="footer-text">Loyalty Program</li>
            <li className="footer-text">Customized Cake</li>
            <li className="footer-text">Review</li>
          </ul>
          <div id="list3">
            <li className="footer-text" id="location-text">Location</li>
            <li className="footer-text">Ashrafieh, Beirut</li>
          </div>
          <div id="socials">
            <p id="follow-text">Follow us</p>
            <div className="social-icons">
              <img src={facebookIcon} alt="Facebook" className="social-icon" />
              <img src={instagramIcon} alt="Instagram" className="social-icon" />
              <img src={tiktokIcon} alt="TikTok" className="social-icon" />
            </div>
          </div>
        </div>
        <div id="copyright-cont" className="d-flex justify-content-center">
          <p id="copyright-text">Copyright © All rights reserved | LaBonneBouche</p>
        </div>
      </footer>
    </div>
  );
};

export default Cart;
*/