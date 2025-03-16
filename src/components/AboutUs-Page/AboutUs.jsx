import React from 'react';
import Footer from '../Home-Page/Footer';
import Header from '../Home-Page/Header';
import '../../styles/AboutUs/AboutUs.css';  // Ensure this path is correct
//import logo from '../../assets/About-us-images/logo3.png';
//import headerImage from '../../assets/About-us-images/AboutUsHeader.png';
//import arrowIcon from '../../assets/About-us-images/AArrow.PNG';
//import vector1 from '../../assets/About-us-images/AboutUsVector1.png';
//import storyVisual from '../../assets/About-us-images/visual our story.png';
//import bakedWithLove from '../../assets/About-us-images/Baked with Love.png';
// import vector2 from '../../assets/About-us-images/AboutUsVector2.png';
// import missionImg1 from '../../assets/About-us-images/OurMission1.PNG';
// import missionImg2 from '../../assets/About-us-images/OurMission2.png';
// import visionImg1 from '../../assets/About-us-images/vision2.png';
// import visionImg2 from '../../assets/About-us-images/vision1.PNG';
// import aboutCelina from '../../assets/About-us-images/about-celina.png';
// import aboutC from '../../assets/About-us-images/AboutC.png';

function AboutUs() {
  return (
    <div>
      <Header/>

      {/* <main>
        <div className="OurStory">
          <div className="section1">
            <h1>Our Story</h1>
            <img  alt="Baked with Love" />
            <p>
              Our nostalgic patisserie began three years ago in a cozy home kitchen,<br />
              where a passion for baking turned into a love affair with sweets.
              From <br />
              humble beginnings with homemade cakes, we've grown into a thriving <br />
              bakery dedicated to crafting delectable cookies, cakes, and macarons. <br />
              Each bite tells a story, reflecting our commitment to using the finest <br />
              ingredients and traditional techniques. Join us on a journey through time, <br />
              savoring the flavors and memories that make our pastries truly special.
            </p>
          </div>
          <div className="section2">
            <img src={storyVisual} alt="Our Story Visual" />
          </div>
        </div>

        <div className="vector2A">
          <img src={vector2} alt="Vector2" />
        </div>

        <div className="our-mission">
          <div className="Section1">
            <img src={missionImg1} alt="Mission1" />
          </div>
          <div className="Section2">
            <img src={missionImg2} alt="Mission2" />
            <p className="p1 p">
              To awaken the senses and evoke nostalgia through our handcrafted pastries, <br />
              using the finest ingredients and traditional techniques. We strive to create <br />
              moments of pure indulgence, one bite at a time. By combining classic <br />
              recipes with innovative flavors, we aim to delight our customers and elevate <br />
              the pastry-making experience. We are committed to sourcing sustainable <br />
              ingredients and supporting local businesses, ensuring that our pastries are <br />
            </p>
            <p className="p">not only delicious but also ethical.</p>
          </div>
        </div>

        <div className="our-vision">
          <div className="vision1">
            <img src={visionImg1} alt="Vision1" />
            <p className="p1 p2">
              To be a beloved institution, renowned for our exceptional pastries and warm <br />
              hospitality. We envision a world where our creations inspire joy, comfort, and <br />
              celebration, leaving a lasting impression on every customer. We aspire to be <br />
              the go-to destination for those seeking exquisite treats, whether it's a <br />
              special occasion or a simple indulgence. Through our dedication to quality, <br />
              innovation, and customer satisfaction, we aim to build a loyal following and <br />
            </p>
            <p className="p2">become a cherished part of the community.</p>
          </div>
          <div className="vision2">
            <img src={visionImg2} alt="Vision2" />
          </div>
        </div>

        <section className="section-five">
          <div className="About-Celine">
            <div className="about1">
              <img src={aboutCelina} alt="About Celina" />
            </div>
            <div className="about2">
              <img src={aboutC} alt="About Celina Header" />
              <p>
                Celina, the heart and soul of our patisserie, is a passionate
                baker with a lifelong love for <br />
                sweets. Inspired by her family's culinary traditions, she embarked
                on a journey to share <br />
                her passion with the world. With each creation, Celina strives to
                evoke nostalgia and <br />
                delight, ensuring every bite is a memorable experience.
              </p>
            </div>
          </div>
        </section>
      </main> */}

      {/* Footer component should be placed here */}
      <Footer />
    </div>
  );
}

export default AboutUs;
