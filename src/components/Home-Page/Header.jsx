import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../../styles/home/Header.css';
import bannerBg from '../../assets/Home-images/BANNER.png';
import logo from '../../assets/Home-images/logo.png';
import defaultProfilePic from '../../assets/Home-images/DefaultProfile.png'; 

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setProfilePicture(currentUser.photoURL || defaultProfilePic);
      } else {
        setUser(null);
        setProfilePicture(defaultProfilePic);
      }
    });
  }, []);

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

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
              <NavLink to="/" className={({ isActive }) => `link ${isActive ? 'active' : ''}`} onClick={toggleMenu}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about-us" className={({ isActive }) => `link ${isActive ? 'active' : ''}`} onClick={toggleMenu}>About Us</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/products" className={({ isActive }) => `link ${isActive ? 'active' : ''}`} onClick={toggleMenu}>Shop</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/cart" className={({ isActive }) => `link ${isActive ? 'active' : ''}`} onClick={toggleMenu}>My Cart</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact-us" className={({ isActive }) => `link ${isActive ? 'active' : ''}`} onClick={toggleMenu}>Contact Us</NavLink>
            </li>
          </ul>

          <div className="auth-buttons">
            {!user ? (
              <>
                <Link to="/login" onClick={toggleMenu}>
                  <button className="login-btn">Login</button>
                </Link>
                <Link to="/signup" onClick={toggleMenu}>
                  <button className="signup-btn">Sign Up</button>
                </Link>
              </>
            ) : (
              <div className="user-profile" onClick={handleProfileClick}>
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="profile-img"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
