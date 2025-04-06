import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './Pages/Home-Page/home';
import AboutUs from './Pages/AboutUs-Page/AboutUs';
import Products from './Pages/Products-Page/Products';
import Cart from './Pages/Cart-Page/Cart';
import ContactUs from './Pages/ContactUs-Page/ContactUs';
import Login from './components/Auth/LoginPage';
import Signup from './components/Auth/Signup';
import Profile from './components/Profile-Page/Profile';
import AdminPanel from './Pages/Admin-Panel/Admin';
import ScrollToTopButton from './components/ScrollToTopButton';
import { auth, db } from './Firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.exists() ? userDoc.data() : null;

          setUser(currentUser);
          setRole(userData?.role || "customer");
        } catch (error) {
          console.error("Error fetching user role from Firestore:", error);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>; // or splash screen

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

        {/* Protected Admin Route */}
        <Route
          path="/admin-panel/*"
          element={
            user && role === "admin" ? (
              <AdminPanel />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
