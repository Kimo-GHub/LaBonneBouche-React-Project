import React from 'react';
// import './ProductsPage.css'; // You can transfer all styles from products_style.css, etc.

// import logo from './assets/images/product-images/logo.png';
// import vectorImg from './assets/images/product-images/product-vector.png';
// import arrowLeft from './assets/images/home/Home-images/arrow-left.png';
// import arrowRight from './assets/images/home/Home-images/arrow-right.png';
// import specialImg from './assets/images/product-images/special-img.png';
// import footerLogo from './assets/images/home/Home-images/logo2.png';
// import facebookIcon from './assets/images/home/Home-images/facebook-icon.png';
// import instagramIcon from './assets/images/home/Home-images/instagram-icon.png';
// import tiktokIcon from './assets/images/home/Home-images/tiktok-icon.png';

function Products(){
  return (
    <div>
      {/* Toast Notification */}
      <div
        id="toast-notification"
        className="toast align-items-center text-white bg-success border-0"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{
          zIndex: 10,
          position: 'fixed',
          top: '20px',
          right: '40%',
          display: 'none'
        }}
      >
        <div className="d-flex">
          <div className="toast-body">The item was added to your cart.</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>

      {/* Header */}
      <header id="product-header">
        <nav className="navbar navbar-expand-lg navbar-light pt-5">
          <div className="container-fluid">
            <div className="col-6 col-md-3 logo">
              <a href="#"><img src={logo} alt="La Bonne Bouche" className="img-fluid" /></a>
            </div>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon" style={{ color: '#fff' }}></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item"><a href="/home" className="link">Home</a></li>
                <li className="nav-item"><a href="/about" className="link">About Us</a></li>
                <li className="nav-item"><a href="/products" className="link active">Shop</a></li>
                <li className="nav-item"><a href="/cart" className="link">My Cart</a></li>
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

      {/* Hero Section */}
      <main className="w-100">
        <section className="hero d-flex flex-column justify-content-start">
          <h1 id="hero-title">Our Products</h1>
          <h2 id="hero-subtitle">Our Sweetest Selections</h2>
          <div className="d-flex flex-row justify-content-center">
            <span style={{ color: 'white', fontSize: 14 }}>Home</span>
            <span style={{ color: 'white', fontSize: 16 }}>→ Shop</span>
          </div>
        </section>

        {/* Cookies Section */}
        <section id="cookies">
          <div id="cookie-header">
            <img id="products-vector" src={vectorImg} alt="Products Vector" />
            <div className="title-container">
              <h2 id="cookie-title">Cookies</h2>
              <h2 id="cookie-subtitle">Crafted with Love</h2>
            </div>
          </div>
          <div id="carousel-container">
            <button className="arrows" id="prev-btn">
              <img src={arrowLeft} alt="Left Arrow" />
            </button>
            <div id="cookie-container">{/* Products from JSON will render here dynamically */}</div>
            <button className="arrows" id="next-btn">
              <img src={arrowRight} alt="Right Arrow" />
            </button>
          </div>
        </section>

        {/* Bites Section */}
        <section id="bites">
          <div id="bites-header">
            <h2 id="bites-title">Bites Of Happiness</h2>
            <h2 id="bites-subtitle">The Bite-Sized Bliss</h2>
          </div>
          <div id="bites-container">{/* Products from JSON will render here dynamically */}</div>
        </section>

        {/* Cakes Section */}
        <section id="cakes">
          <div id="cakes-header">
            <h2 id="cakes-title">Cakes</h2>
            <h2 id="cakes-subtitle">Happiness</h2>
            <p id="cakes-quote">
              Enjoy the taste of freshness. <strong>Preorder your cake 3 hours in advance</strong> to guarantee availability.
            </p>
          </div>
          <div id="cakes-container">{/* Products from JSON will render here dynamically */}</div>
        </section>

        {/* Seasonal Special Section */}
        <section id="special">
          <div id="special-header">
            <h2 id="special-title">A Taste of the Seasons</h2>
            <h2 id="special-subtitle">Seasonal Delights, Baked to Perfection</h2>
          </div>
          <div id="special-img-container">
            <img src={specialImg} alt="Special Cake" id="special-img" />
            <div id="img-content">
              <p id="special-text">Fall's Favorite: Our Warm and Cozy Orange Cake</p>
              <button id="special-btn" className="add-to-cart">Order Now</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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

export default Products;
