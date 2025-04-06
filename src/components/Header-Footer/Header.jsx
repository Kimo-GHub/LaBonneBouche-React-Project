import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../Firebase/firebase';
import '../../styles/home/Header.css';
import blueLogo from '../../images/Home-images/logo.png';
import whiteLogo from '../../images/Home-images/logo-white.png';
import defaultProfilePic from '../../images/Home-images/DefaultProfile.png';
import homeBackground from '../../images/Home-images/BANNER.png';

const pageDetails = {
  "/contact-us": { title: "Contact Us", subtitle: "Let's Connect" },
  "/cart": { title: "Your Cart", subtitle: "Order Summary" },
  "/about-us": { title: "About Us", subtitle: "Sweet & Simple" },
  "/products": { title: "Our Products", subtitle: "Sweetest Selections" },
  "/": { title: "Welcome", subtitle: "Taste the Best" },
};

function Header() {
  const location = useLocation();
  const { title, subtitle } = pageDetails[location.pathname] || pageDetails["/"];
  const isHomePage = location.pathname === "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setProfilePicture(currentUser.photoURL || defaultProfilePic);

        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.exists() ? userDoc.data() : null;

        const fullName = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim();
        setUserName(fullName || "User");
        setUserRole(userData?.role || "customer");
      } else {
        setUser(null);
        setProfilePicture(defaultProfilePic);
        setUserName("");
        setUserRole("");
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSignOut = async () => {
    await signOut(getAuth());
    setDropdownVisible(false);
    navigate('/');
  };

  return (
    <header
      className="navbar-header"
      style={
        isHomePage
          ? {
              backgroundImage: `url(${homeBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              paddingBottom: "0",
              height: "100vh",
            }
          : {}
      }
    >
      <nav className={`navbar ${isHomePage ? 'home-navbar' : ''}`}>
        <div className="logo">
          <Link to="/">
            <img
              src={isHomePage ? blueLogo : whiteLogo}
              alt="La Bonne Bouche"
              className="nav-logo"
            />
          </Link>
        </div>

        {/* Hamburger for mobile */}
        <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`nav-actions ${menuOpen ? 'menu-open' : ''}`}>
          <ul className="nav-links">
            <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""} onClick={toggleMenu}>Home</NavLink></li>
            <li><NavLink to="/about-us" className={({ isActive }) => isActive ? "active" : ""} onClick={toggleMenu}>About Us</NavLink></li>
            <li><NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""} onClick={toggleMenu}>Shop</NavLink></li>
            <li><NavLink to="/cart" className={({ isActive }) => isActive ? "active" : ""} onClick={toggleMenu}>My Cart</NavLink></li>
            <li><NavLink to="/contact-us" className={({ isActive }) => isActive ? "active" : ""} onClick={toggleMenu}>Contact Us</NavLink></li>
          </ul>

          <div className="auth-buttons">
            {!user ? (
              <>
                <Link to="/login" onClick={toggleMenu}>
                  <button className={`login-btn ${isHomePage ? 'home-login' : ''}`}>Login</button>
                </Link>
                <Link to="/signup" onClick={toggleMenu}>
                  <button className={`signup-btn ${isHomePage ? 'home-signup' : ''}`}>Sign Up</button>
                </Link>
              </>
            ) : (
              <div
                className="user-profile-wrapper"
                onMouseEnter={() => setDropdownVisible(true)}
                onMouseLeave={() => setDropdownVisible(false)}
              >
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="profile-img"
                  onClick={() => {
                    navigate('/profile');
                    setDropdownVisible(false);
                  }}
                  style={{ cursor: 'pointer' }}
                />
                {dropdownVisible && (
                  <div className="profile-dropdown">
                    <img src={profilePicture} alt="User" className="dropdown-img" />
                    <p className="dropdown-name">{userName}</p>
                    {userRole === "admin" && (
                      <button
                        className="dropdown-button"
                        onClick={() => {
                          navigate('/admin-panel');
                          setDropdownVisible(false);
                        }}
                      >
                        Admin Panel
                      </button>
                    )}
                    <button className="dropdown-button" onClick={handleSignOut}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {!isHomePage && (
        <section className="hero">
          <h1 className="hero-title">{title}</h1>
          <h2 className="hero-subtitle">{subtitle}</h2>
        </section>
      )}
    </header>
  );
}

export default Header;
