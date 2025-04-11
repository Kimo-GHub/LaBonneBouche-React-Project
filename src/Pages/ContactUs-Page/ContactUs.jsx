import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import Header from '../../components/Header-Footer/Header';
import Footer from '../../components/Header-Footer/Footer';
import './ContactUs.css';
import locationIcon from '../../images/ContactUs-images/icon.png';
import phoneIcon from '../../images/ContactUs-images/call us.png';
import messageIcon from '../../images/ContactUs-images/message-square.png';
import ownerImage from '../../images/ContactUs-images/Owner.png';


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

    emailjs.send(
      'service_82cjjku',     // Replace with your actual Service ID
      'template_tuq42aj',    // Replace with your actual Template ID
      formData,
      'juQtlDEQIxJsv-7xu'      // Replace with your actual Public Key (User ID)
    )
    .then(() => {
      alert('Email successfully sent!');
      setShowPopup(false);
      setFormData({ name: '', email: '', message: '' });
    })
    .catch((error) => {
      console.error('EmailJS Error:', error);
      alert('Failed to send email. Please try again later.');
    });
  };

  return (
    <div>
      <Header />

      

      {/* Content */}
      <main className="contact-main">
        <section className="stacked-hero">
          <div className="content-wrapper">
            <h1 className="get-in-touch-title">Get In Touch!</h1>
            <h2 className="here-to-help-subtitle">We’re here to help.</h2>
            <p className="contact-prompt">
              Have a question about our sweet treats or want to place a special order?<br />
              Let us help you create a truly memorable dessert experience.
            </p>

            {/* Contact Info */}
            <div className="pink-background-under">
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">
                    <img src={locationIcon} alt="Location icon" />
                  </div>
                  <div className="contact-text">
                    <strong>Address</strong><br />
                    Building 15, Georges Haimari Street, Ashrafieh, Beirut, Lebanon
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <img src={phoneIcon} alt="Phone icon" />
                  </div>
                  <div className="contact-text">
                    <strong>Call Us</strong><br />
                    +961 76 567 599
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <img src={messageIcon} alt="Message icon" />
                  </div>
                  <div className="contact-text">
                    <strong>Send A Message</strong><br />
                    @labonnebouche
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay Image */}
          <div className="owner-image-overlay">
            <img src={ownerImage} alt="Owner smiling with baked goods" className="owner-img" />
          </div>
        </section>

        {/* Email Button */}
        <div className="email-btn-wrapper">
          <button className="email-btn" onClick={togglePopup}>
            Email Us
          </button>
        </div>
      </main>

      {/* Email Form Popup */}
      {showPopup && (
        <div className="email-popup">
          <div className="email-form">
            <h3>Email Us</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
              />
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
