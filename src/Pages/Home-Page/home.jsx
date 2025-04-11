import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Header from '../../components/Header-Footer/Header';
import Footer from '../../components/Header-Footer/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import './Home.css';
import aboutusBG from '../../images/Home-images/aboutusBG.png';
import brownieImage from '../../images/Home-images/brownie pic.png'; // Brownie Image
import { useCart } from '../../context/CartContext';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const featuredQuery = query(collection(db, 'products'), where('category', '==', 'featured'));
      const featuredSnapshot = await getDocs(featuredQuery);
      setFeaturedProducts(featuredSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchProducts();
  }, []);

  const renderProductUnit = (product) => {
    if (product.displayUnit === 'pieces' && product.pieces) {
      return product.pieces;
    } else if (product.displayUnit === 'serves' && product.serves) {
      return `👤x${product.serves || 1}`;
    } else if (product.displayUnit === 'weight' && product.weight) {
      return product.weight;
    } else {
      return '';
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
              Our nostalgic patisserie began three years ago in a cozy home kitchen,<br />
              where a passion for baking turned into a love affair with sweets.
            </p>
            <a href="/about-us" className="read-more-btn">Read More</a>
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

          {featuredProducts.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={4}
              navigation
              pagination={{ clickable: true }}
              loop={true}
              breakpoints={{
                320: { slidesPerView: 1 },
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
            >
              {featuredProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="home-product-card">
                    <div className="home-image-wrapper">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="home-product-image"
                      />
                    </div>
                    <h3 className="home-product-name">{product.name}</h3>
                    <p className="home-product-description">{product.description}</p>
                    <p className="home-product-price-line">
                      {product.price !== null && product.price !== undefined ? (
                        <>
                          <span className="home-original-price">${product.originalPrice}</span>
                          <strong className="home-product-price">${product.price}</strong>
                        </>
                      ) : (
                        <strong className="home-product-price">${product.originalPrice}</strong>
                      )}
                      <span className="home-divider"> / </span>
                      <span className="home-product-unit">{renderProductUnit(product)}</span>
                    </p>
                    <button
                      className="home-add-to-cart-btn"
                      onClick={() =>
                        addToCart({
                          id: product.id,
                          name: product.name,
                          imageUrl: product.imageUrl,
                          price: product.price ?? product.originalPrice,
                          quantity: 1,
                        })
                      }
                    >
                      Add To Cart
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p style={{ textAlign: 'center', color: '#aaa' }}>
              No featured products available at the moment.
            </p>
          )}

          {/* Show More Button */}
          <div className="home-show-more-wrapper">
            <a href="/products" className="home-show-more-btn">Show More</a>
          </div>
        </section>

        {/* Today's Treat Section */}
        <section className="brownie-section">
          <div className="todays-treat-text">
            <h2 className="todays-treat-title">Today's Treat</h2>
            <h3 className="todays-treat-subtitle">Sweet Sensation</h3>
          </div>
          <div className="brownie-image-container">
            <img src={brownieImage} alt="Decadent Brownie Delight" className="brownie-image" />
            <div className="brownie-text-container">
              <h2 className="brownie-title">Decadent Brownie Delight</h2>
              <button className="brownie-order-btn">Order Now</button>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="newsletter-section">
          <h2 className="newsletter-heading">Stay Sweetened</h2>
          <h3 className="newsletter-subtitle">Be a Part of the Sweetness</h3>
          <p className="newsletter-text">
            Subscribe to our newsletter and be the first to know about new treats, exclusive offers, and behind-the-scenes updates from La Bonne Bouche.
          </p>
          <button className="newsletter-btn">Subscribe Now</button>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
