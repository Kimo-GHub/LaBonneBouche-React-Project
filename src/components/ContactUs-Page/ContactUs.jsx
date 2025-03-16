import React from 'react';
//import './styles/ContactUsPage.css'; 
// import logo from './assets/images/logo.png';
// import locationIcon from './assets/images/icon.png';
// import phoneIcon from './assets/images/call us.png';
// import messageIcon from './assets/images/message square.png';
// import ownerImage from './assets/images/owner.png';
// import logo2 from './assets/images/logo2.png';
// import facebook from './assets/images/facebook-icon.png';
// import instagram from './assets/images/instagram-icon.png';
// import tiktok from './assets/images/tiktok-icon.png';

function ContactUs () {
  return (
    <div>
      <header id="ContactUs-header">
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
                <li className="nav-item"><a className="link" href="#">Home</a></li>
                <li className="nav-item"><a className="link" href="#">About Us</a></li>
                <li className="nav-item"><a className="link" href="#">Shop</a></li>
                <li className="nav-item"><a className="link" href="#">My Cart</a></li>
                <li className="nav-item"><a className="link active" href="#">Contact Us</a></li>
              </ul>
              <div className="auth-buttons d-flex">
                <button className="login-btn">Login</button>
                <button className="signup-btn">Sign up</button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="w-100">
        <section className="hero d-flex flex-column justify-content-start">
          <h1 id="hero-title">Contact Us</h1>
          <h2 id="hero-subtitle">Let's Connect</h2>
          <div className="d-flex flex-row justify-content-center">
            <span style={{ color: "white", fontSize: "14px" }}>Home</span>
            <span style={{ color: "white", fontSize: "16px" }}>→ Contact Us</span>
          </div>
        </section>

        <div className="background-text-container">
          <div className="background-text">La Bonne Bouche</div>
          <div className="background-text">La Bonne Bouche</div>
          <div className="background-text">La Bonne Bouche</div>
        </div>
        <div className="background-text-container-new">
          <div className="background-text-new">La Bonn&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
          <div className="background-text-new">La Bonn&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
          <div className="background-text-new">La Bonne Bouche</div>
        </div>

        <div className="contact-info">
          <div className="contact-intro-details">
            <h2 className="get-in-touch">Get In Touch!</h2>
            <p className="here-to-help">We’re here to help.</p>
            <div className="contact-description">
              <p>Have a question about our sweet treats or want to place a special order?</p>
              <p>Let us help you create a truly memorable dessert experience.</p>
            </div>
          </div>
        </div>

        <div className="pink-background-limited contact-info">
          <div className="contact-details contact-details-adjusted">
            <div className="contact-item">
              <div className="contact-icon"><img src={locationIcon} alt="Location" /></div>
              <div className="contact-text"><strong>Address</strong><br />Building 15, Georges Haimari Street, Ashrafieh, Beirut, Lebanon</div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><img src={phoneIcon} alt="Phone" /></div>
              <div className="contact-text"><strong>Call Us</strong><br />+961 76 567 599</div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><img src={messageIcon} alt="Message" /></div>
              <div className="contact-text"><strong>Send A Message</strong><br />@labonnebouche</div>
            </div>
          </div>
        </div>

        <div className="vector-container">
          <svg width="466" height="233" viewBox="0 0 466 233" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-37 2C-30.1639 3.36721 -23.7731 10.5292 -17.5765 13.7112C-3.77895 20.7965 10.7468 27.4214 25.2695 32.8491C57.744 44.986 90.3105 48.2736 124.958 48.2736C153.662 48.2736 182.77 45.2715 210.078 55.4146C234.767 64.5846 256.513 82.9632 275.347 100.831C292.652 117.249 312.681 130.829 330.904 146.248C353.126 165.051 370.679 170.087 399.458 174.812C433.545 180.408 453.714 199.047 464.298 230.797"
              stroke="#091A45" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        <div className="owner-image-above">
          <img src={ownerImage} alt="Owner" />
        </div>
      </main>

      <footer className="text-white" style={{ backgroundColor: '#ffffff' }}>
        <div id="footer-content" className="d-flex column align-content-center justify-content-between" style={{ backgroundColor: '#091a45' }}>
          <div id="logo-container"><img src={logo2} alt="LaBonneBouche" id="footer-logo" /></div>
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
              <img src={facebook} alt="Facebook" className="social-icon" />
              <img src={instagram} alt="Instagram" className="social-icon" />
              <img src={tiktok} alt="TikTok" className="social-icon" />
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

export default ContactUs;
