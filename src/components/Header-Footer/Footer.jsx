import React from 'react';
import '../../styles/home/Footer.css';
import logo2 from '../../images/Home-images/logo2.png';
import facebookIcon from '../../images/Home-images/facebook-icon.png';
import instagramIcon from '../../images/Home-images/instagram-icon.png';
import tiktokIcon from '../../images/Home-images/tiktok-icon.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo-container">
          <img src={logo2} alt="La Bonne Bouche" className="footer-logo" />
        </div>

        <ul className="footer-list">
          <li className="footer-text">About Us</li>
          <li className="footer-text">Products</li>
          <li className="footer-text">Newsletter</li>
        </ul>

        <ul className="footer-list">
          <li className="footer-text">Loyalty Program</li>
          <li className="footer-text">Customized Cake</li>
          <li className="footer-text">Review</li>
        </ul>

        <ul className="footer-list">
          <li className="footer-text location-title">Location</li>
          <li className="footer-text">Ashrafieh, Beirut</li>
        </ul>

        <div className="footer-socials">
          <p className="follow-text">Follow us</p>
          <div className="social-icons">
            <img src={facebookIcon} alt="Facebook" className="social-icon" />
            <img src={instagramIcon} alt="Instagram" className="social-icon" />
            <img src={tiktokIcon} alt="TikTok" className="social-icon" />
          </div>
        </div>
      </div>

      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} La Bonne Bouche. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
