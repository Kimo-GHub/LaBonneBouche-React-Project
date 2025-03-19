import React from 'react';
import Header from '../Home-Page/Header';
import Footer from '../Home-Page/Footer';
import '../../styles/AboutUs/AboutUs.css'; 
import visualourstory from '../../assets/About-us-images/visualourstory.png';
import OurMission1 from '../../assets/About-us-images/OurMission1.png';
import OurMission2 from '../../assets/About-us-images/OurMission2.png';

function AboutUs() {
  return (
    <div>
      <Header />

      <main className="about-us-container">
        {/* Our Story Section */}
        <div className="about-us-section">
          <div className="about-us-text">
            <h1 className="about-us-title">Our Story</h1>
            <h2 className="about-us-subtitle">Baked with Love</h2>
            <p className="about-us-description">
              Our nostalgic patisserie began three years ago in a cozy home kitchen, 
              where a passion for baking turned into a love affair with sweets. From humble beginnings with 
              homemade cakes, we've grown into a thriving bakery dedicated to crafting delectable cookies, cakes, and macarons. 
              Each bite tells a story, reflecting our commitment to using the finest ingredients and traditional techniques. 
              Join us on a journey through time, savoring the flavors and memories that make our pastries truly special.
            </p>
          </div>
          <div className="about-us-image">
            <img src={visualourstory} alt="Our Story" className="macaron-image"/>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="our-mission-section">
          <div className="mission-title">
            <img src={OurMission1} alt="Our Mission Title" className="mission-title-image"/>
          </div>
          <div className="mission-content">
            <div className="mission-description">
            <div className="mission-image">
              <img src={OurMission2} alt="Our Mission Image" className="mission-photo"/>
            </div>
              <p>
                To awaken the senses and evoke nostalgia through our handcrafted pastries, using the finest ingredients and traditional techniques. 
                We strive to create moments of pure indulgence, one bite at a time. By combining classic recipes with innovative flavors, we aim to delight our customers and elevate the pastry-making experience. 
                We are committed to sourcing sustainable ingredients and supporting local businesses, ensuring that our pastries are not only delicious but also ethical.
              </p>
            </div>
          
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AboutUs;
