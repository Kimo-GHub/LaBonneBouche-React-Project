import React from 'react';
import '../../styles/home/Footer.css';
import logo2 from '../../images/Home-images/logo2.png';
import facebookIcon from '../../images/Home-images/facebook-icon.png';
import instagramIcon from '../../images/Home-images/instagram-icon.png';
import tiktokIcon from '../../images/Home-images/tiktok-icon.png';
import footerLine from '../../images/Home-images/Footer-line.png';  // the line image

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logo2} alt="La Bonne Bouche" />
        </div>

        <div className="footer-section">
          <p className="footer-title">About us</p>
          <p className="footer-text">Products</p>
          <p className="footer-text">Newsletter</p>
        </div>

        <div className="footer-section">
          <p className="footer-title">Loyalty Program</p>
          <p className="footer-text">Customized Cake</p>
          <p className="footer-text">Review</p>
        </div>

        <div className="footer-section">
          <p className="footer-title">Location</p>
          <p className="footer-text">Ashrafieh, Beirut</p>
        </div>

        <div className="footer-socials">
          <p className="footer-title">Follow us</p>
          <div className="footer-social-icons">
            <img src={facebookIcon} alt="Facebook" />
            <img src={instagramIcon} alt="Instagram" />
            <img src={tiktokIcon} alt="TikTok" />
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="footer-line-container">
        <img src={footerLine} alt="Divider" className="footer-line" />
      </div>

      <div className="footer-copyright">
        <p>Copyright © All rights reserved | labonnebouche</p>
      </div>
    </footer>
  );
}

export default Footer;
