import React from 'react';
import Header from '../../components/Header-Footer/Header';
import Footer from '../../components/Header-Footer/Footer';
import './AboutUs.css'; 
import visualourstory from '../../images/About-us-images/visualourstory.png';
import OurMission1 from '../../images/About-us-images/OurMission1.png';
import OurMission2 from '../../images/About-us-images/OurMission2.png';
import vision1 from '../../images/About-us-images/vision1.png'; 
import vision2 from '../../images/About-us-images/vision2.png'; 
import AboutCelinaImage from '../../images/About-us-images/about-celina.png';
import AboutCTextImage from '../../images/About-us-images/AboutC.png';

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

        {/* Our Vision Section */}
        <div className="our-vision-section">
       
          <div className="vision-content">
            <div className="vision-description">
            <div className="vision-photo">
              <img src={vision2} alt="Our Vision Image" className="vision-photo-image"/>
            </div>
              <p>
                To be a beloved institution, renowned for our exceptional pastries and warm hospitality. We envision a world where our creations inspire joy, comfort, and celebration, leaving a lasting impression on every customer. 
                We aspire to be the go-to destination for those seeking exquisite treats, whether it's a special occasion or a simple indulgence. Through our dedication to quality, innovation, and customer satisfaction, 
                we aim to build a loyal following and become a cherished part of the community.
              </p>
            </div>
         
          </div>
          <div className="vision-title">
            <img src={vision1} alt="Our Vision Title" className="vision-title-image"/>
          </div>
        </div>

        <div className="About-Celine">
  <div className="about1">
    <img
      src={AboutCelinaImage}
      alt="Celina rolling dough"
    />
  </div>
  <div className="about2">
    <img
      src={AboutCTextImage}
      alt="About Celina title"
      className="celina-title-img"
    />
    <p>
      Celina, the heart and soul of our patisserie, is a passionate baker with a lifelong love for sweets.
      Inspired by her family’s culinary traditions, she embarked on a journey to share her passion with the world.
      With each creation, Celina strives to evoke nostalgia and delight, ensuring every bite is a memorable experience.
    </p>
  </div>
</div>



      </main>

      <Footer />
    </div>
  );
}

export default AboutUs;
