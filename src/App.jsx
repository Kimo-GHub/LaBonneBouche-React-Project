import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home-Page/home';
import AboutUs from './components/AboutUs-Page/AboutUs';
import Products from './components/Products-Page/Products';
import Cart from './components/Cart-Page/Cart';
import ContactUs from './components/ContactUs-Page/ContactUs';
import Login from './components/Auth/LoginPage';
import Signup from './components/Auth/Signup';
import Profile from './components/Profile-Page/Profile'; 
import ScrollToTopButton from './components/ScrollToTopButton';

const App = () => {
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
      </Routes>
    </Router>
  );
};

export default App;
