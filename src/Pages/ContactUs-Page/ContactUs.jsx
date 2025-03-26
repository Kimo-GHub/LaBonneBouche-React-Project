import React, { useState } from 'react';
import Header from '../../components/Header-Footer/Header';
import Footer from '../../components/Header-Footer/Footer';
import './ContactUs.css';
import locationIcon from '../../images/ContactUs-images/icon.png';
import phoneIcon from '../../images/ContactUs-images/call us.png';
import messageIcon from '../../images/ContactUs-images/message square.png';
import ownerImage from '../../images/ContactUs-images/owner.png';

function ContactUs() {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const togglePopup = () => setShowPopup(!showPopup);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Fake email sending logic – replace with real API later
    alert(`Email sent to mohammadfawzi004@gmail.com!\n\n${JSON.stringify(formData, null, 2)}`);
    setShowPopup(false);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div>
      <Header />

      <main className="contact-main">
        <section className="contact-hero">
          <div className="hero-left">
            <h1 className="get-in-touch-title">Get In Touch!</h1>
            <h2 className="here-to-help-subtitle">We're here to help.</h2>
            <p className="contact-prompt">
              Have a question about our sweet treats or want to place a special order?<br />
              Let us help you create a truly memorable dessert experience.
            </p>
            <div className="contact-box">
              <div className="contact-info-block">
                <img src={locationIcon} alt="Location" className="contact-icon-img" />
                <div>
                  <strong>Address</strong><br />
                  Building 15, Georges Haimari Street, Ashrafieh, Beirut, Lebanon
                </div>
              </div>
              <div className="contact-info-block">
                <img src={phoneIcon} alt="Phone" className="contact-icon-img" />
                <div>
                  <strong>Call Us</strong><br />
                  +961 76 567 599
                </div>
              </div>
              <div className="contact-info-block">
                <img src={messageIcon} alt="Message" className="contact-icon-img" />
                <div>
                  <strong>Send A Message</strong><br />
                  @labonnebouche
                </div>
              </div>
              <button className="email-btn" onClick={togglePopup}>Email Us</button>
            </div>
          </div>

          <div className="hero-right">
            <div className="overlay-text">
              <p>La Bonn</p>
              <p>La Bonn</p>
              <p>La Bonne Bouche</p>
            </div>
            <img src={ownerImage} alt="Owner smiling with baked goods" className="owner-img" />
          </div>
        </section>
      </main>

      {showPopup && (
        <div className="email-popup">
          <div className="email-form">
            <h3>Email Us</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
              <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required />
              <div className="email-buttons">
                <button type="submit">Send</button>
                <button type="button" onClick={togglePopup}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ContactUs;
