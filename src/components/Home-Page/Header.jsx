import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/home/Header.css';
import bannerBg from '../../assets/Home-images/BANNER.png';
import logo from '../../assets/Home-images/logo.png';

function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="header" style={{ backgroundImage: `url(${bannerBg})` }}>
      <div className="container-fluid header-container">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="La Bonne Bouche" className="img-fluid" />
          </Link>
        </div>

        {/* Hamburger Icon */}
        <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`nav-actions ${menuOpen ? 'menu-open' : ''}`}>
          <ul className="navbar-nav nav-links">
            <li className="nav-item">
              <Link to="/" className={`link ${location.pathname === '/' ? 'active' : ''}`} onClick={toggleMenu}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/about-us" className={`link ${location.pathname === '/about-us' ? 'active' : ''}`} onClick={toggleMenu}>About Us</Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className={`link ${location.pathname === '/products' ? 'active' : ''}`} onClick={toggleMenu}>Shop</Link>
            </li>
            <li className="nav-item">
              <Link to="/cart" className={`link ${location.pathname === '/cart' ? 'active' : ''}`} onClick={toggleMenu}>My Cart</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact-us" className={`link ${location.pathname === '/contact-us' ? 'active' : ''}`} onClick={toggleMenu}>Contact Us</Link>
            </li>
          </ul>
          <div className="auth-buttons">
            <button className="login-btn">Login</button>
            <button className="signup-btn">Sign Up</button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
