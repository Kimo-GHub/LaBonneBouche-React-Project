import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home-Page/home';
import AboutUs from './Pages/AboutUs-Page/AboutUs';
import Products from './Pages/Products-Page/Products';
import Cart from './Pages/Cart-Page/Cart';
import ContactUs from './Pages/ContactUs-Page/ContactUs';
import Login from './components/Auth/LoginPage';
import Signup from './components/Auth/Signup';
import Profile from './components/Profile-Page/Profile';
import AdminPanel from './Pages/Admin-Panel/Admin-Panel'; 
import ScrollToTopButton from './components/ScrollToTopButton';
import { auth } from './Firebase/firebase'; 
import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';    

function App () {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Fetching the user's custom claims or role from Firebase
          const idTokenResult = await getIdTokenResult(currentUser);
          const userRole = idTokenResult.claims.role || "customer"; 

          setUser(currentUser);
          setRole(userRole);

        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <ScrollToTopButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin Panel - Only accessible if user is admin */}
        <Route
          path="/admin"
          element={role === "admin" ? <AdminPanel /> : <Home />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
