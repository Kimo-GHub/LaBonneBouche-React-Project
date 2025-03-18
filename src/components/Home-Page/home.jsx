import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../../styles/home/Home.css'; // Import the CSS
import aboutusBG from '../../assets/Home-images/aboutusBG.png'; // Import the background image

function Home() {
    return (
        <div>
            <Header />
            <main id="main-Home">
                <section id="about-us" style={{ backgroundImage: `url(${aboutusBG})` }}>
                    <div id="about-us-heading">

                    </div>
                    <div id="about-us-content">
                        <p>
                            Our nostalgic patisserie began three years ago in a cozy home kitchen,<br/> where a passion for baking turned into a love affair with sweets.
                        </p>
                        <a href="/about-us" className="read-more-btn">Read More</a>
                    </div>
                </section>
                {/* Add other content for the Home page here */}
            </main>
            <Footer />
        </div>
    );
}

export default Home;
