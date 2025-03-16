import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home-Page/home';
import AboutUs from './components/AboutUs-Page/AboutUs';
import Products from './components/Products-Page/Products';
import Cart from './components/Cart-Page/Cart';
import ContactUs from './components/ContactUs-Page/ContactUs';
import ScrollToTopButton from './components/ScrollToTopButton';

const App = () => {
  return (
    <Router>
      <>
        {/* Your floating scroll-to-top button */}
        <ScrollToTopButton />

        {/* Main App Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact-us" element={<ContactUs />} />
        </Routes>
      </>
    </Router>
  );
};

export default App;
