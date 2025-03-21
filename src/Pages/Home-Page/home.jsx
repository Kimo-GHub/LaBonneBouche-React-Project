import React from 'react';
import Header from '../../components/Header-Footer/Header';
import Footer from '../../components/Header-Footer/Footer';
import './Home.css'; 
import aboutusBG from '../../images/Home-images/aboutusBG.png';

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
