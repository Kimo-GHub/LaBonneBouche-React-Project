import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../Firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import Header from '../../components/Header-Footer/Header';
import Footer from '../../components/Header-Footer/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import './Home.css';
import aboutusBG from '../../images/Home-images/aboutusBG.png';
import brownieImage from '../../images/Home-images/brownie pic.png';
import { useCart } from '../../context/CartContext';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  // State and ref for the subscription popup
  const [showSubscribePopup, setShowSubscribePopup] = useState(false);
  const subscribeFormRef = useRef();

  // Fetch featured products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const featuredQuery = query(
          collection(db, 'products'),
          where('category', '==', 'featured')
        );
        const featuredSnapshot = await getDocs(featuredQuery);
        const products = featuredSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper function to render unit information
  const renderProductUnit = (product) => {
    const { displayUnit, pieces, serves, weight } = product;
    if (displayUnit === 'pieces' && pieces) {
      return pieces;
    } else if (displayUnit === 'serves' && serves) {
      return `👤x${serves}`;
    } else if (displayUnit === 'weight' && weight) {
      return weight;
    }
    return '';
  };

  // Toggle function for the subscription popup
  const toggleSubscribePopup = () =>
    setShowSubscribePopup((prev) => !prev);

  // Handle submission of the subscription form using async/await
  const handleSubscribeSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await emailjs.sendForm(
        'service_82cjjku',        // Replace with your actual Service ID
        'template_tuq42aj',        // Replace with your actual Template ID
        subscribeFormRef.current,
        'juQtlDEQIxJsv-7xu'        // Replace with your actual Public Key (User ID)
      );
      console.log('EmailJS Success:', result.text);
      alert('Subscription successful!');
      toggleSubscribePopup();
      subscribeFormRef.current.reset();
    } catch (error) {
      console.error('EmailJS Error:', error);
      alert('Failed to subscribe. Please try again later.');
    }
  };

  return (
    <div>
      <Header />
      <main id="main-Home">
        {/* About Us Section */}
        <section id="about-us" style={{ backgroundImage: `url(${aboutusBG})` }}>
          <div id="about-us-heading"></div>
          <div id="about-us-content">
            <p>
              Our nostalgic patisserie began three years ago in a cozy home kitchen,
              <br />
              where a passion for baking turned into a love affair with sweets.
            </p>
            <a href="/about-us" className="home-read-more-btn">
              Read More
            </a>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="home-category-section" style={{ marginTop: '5rem' }}>
          <h2 className="featured-products-title">Featured Products</h2>
          <h3 className="sweetest-selections-subtitle">Our Sweetest Selections</h3>

          <div className="home-section-heading-wrapper">
            <p className="home-section-paragraph">
              Discover a world of flavor and nostalgia in our carefully curated selection of Featured Products.
            </p>
          </div>

          {isLoading ? (
            <p style={{ textAlign: 'center', color: '#aaa' }}>
              Loading featured products...
            </p>
          ) : featuredProducts.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={4}
              navigation
              pagination={{ clickable: true }}
              loop
              breakpoints={{
                320: { slidesPerView: 1 },
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
            >
              {featuredProducts.map((product) => {
                const { id, name, imageUrl, description, price, originalPrice } = product;
                return (
                  <SwiperSlide key={id}>
                    <div className="home-product-card">
                      <div className="home-image-wrapper">
                        <img
                          src={imageUrl}
                          alt={name}
                          className="home-product-image"
                        />
                      </div>
                      <h3 className="home-product-name">{name}</h3>
                      <p className="home-product-description">
                        {description}
                      </p>
                      <p className="home-product-price-line">
                        {price != null ? (
                          <>
                            <span className="home-original-price">
                              ${originalPrice}
                            </span>
                            <strong className="home-product-price">
                              ${price}
                            </strong>
                          </>
                        ) : (
                          <strong className="home-product-price">
                            ${originalPrice}
                          </strong>
                        )}
                        <span className="home-divider"> / </span>
                        <span className="home-product-unit">
                          {renderProductUnit(product)}
                        </span>
                      </p>
                      <button
                        className="home-add-to-cart-btn"
                        onClick={() =>
                          addToCart({
                            id,
                            name,
                            imageUrl,
                            price: price ?? originalPrice,
                            quantity: 1,
                          })
                        }
                      >
                        Add To Cart
                      </button>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <p style={{ textAlign: 'center', color: '#aaa' }}>
              No featured products available at the moment.
            </p>
          )}

          {/* Show More Button */}
          <div className="home-show-more-wrapper">
            <a href="/products" className="home-show-more-btn">
              Show More
            </a>
          </div>
        </section>

        {/* Today's Treat Section */}
        <section className="brownie-section">
          <div className="todays-treat-text">
            <h2 className="todays-treat-title">Today's Treat</h2>
            <h3 className="todays-treat-subtitle">Sweet Sensation</h3>
          </div>
          <div className="brownie-image-container">
            <img
              src={brownieImage}
              alt="Decadent Brownie Delight"
              className="brownie-image"
            />
            <div className="brownie-text-container">
              <h2 className="brownie-title">Decadent Brownie Delight</h2>
              <button className="brownie-order-btn">Order Now</button>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="newsletter-section">
          <h2 className="newsletter-heading">Stay Sweetened</h2>
          <h3 className="newsletter-subtitle">
            Be a Part of the Sweetness
          </h3>
          <p className="newsletter-text">
            Subscribe to our newsletter and be the first to know about new
            treats, exclusive offers, and behind-the-scenes updates from La Bonne Bouche.
          </p>
          <button className="newsletter-btn" onClick={toggleSubscribePopup}>
            Subscribe Now
          </button>
        </section>

        {/* Subscription Popup */}
        {showSubscribePopup && (
          <div className="subscription-popup">
            <div className="subscription-form">
              <h3>Subscribe to Newsletter</h3>
              <form ref={subscribeFormRef} onSubmit={handleSubscribeSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                />
                <div className="subscription-buttons">
                  <button type="submit">Subscribe</button>
                  <button
                    type="button"
                    onClick={toggleSubscribePopup}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Home;
