import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../../styles/home/Header.css';
import bannerBg from '../../assets/Home-images/BANNER.png';
import logo from '../../assets/Home-images/logo.png';
import defaultProfilePic from '../../assets/Home-images/DefaultProfile.png'; 

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate hook

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Check if user is logged in and get their profile picture
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user data when logged in
        setProfilePicture(currentUser.photoURL || defaultProfilePic); // Set profile picture or default one
      } else {
        setUser(null); // If not logged in, set user to null
        setProfilePicture(defaultProfilePic); // Set default profile picture
      }
    });
  }, []);

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile'); // Navigate to profile if logged in
    } else {
      navigate('/login'); // Redirect to login if not logged in
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
              <Link to="/" className={`link`} onClick={toggleMenu}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/about-us" className={`link`} onClick={toggleMenu}>About Us</Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className={`link`} onClick={toggleMenu}>Shop</Link>
            </li>
            <li className="nav-item">
              <Link to="/cart" className={`link`} onClick={toggleMenu}>My Cart</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact-us" className={`link`} onClick={toggleMenu}>Contact Us</Link>
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
