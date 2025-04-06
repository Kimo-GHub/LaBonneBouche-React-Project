import React, { useEffect, useState, useContext } from 'react';
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
import featuredVector from '../../images/Home-images/FeaturedProducts.png';
import TodaysTreat from '../../images/Home-images/treatBG.png';
import { CartContext } from '../../App'; // ✅ Import CartContext

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [todaysTreat, setTodaysTreat] = useState(null);
  const { addToCart } = useContext(CartContext); // ✅ Access addToCart

  useEffect(() => {
    const fetchProducts = async () => {
      const featuredQuery = query(collection(db, 'products'), where('category', '==', 'featured'));
      const featuredSnapshot = await getDocs(featuredQuery);
      setFeaturedProducts(featuredSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const treatQuery = query(collection(db, 'products'), where('category', '==', 'todays-treat'));
      const treatSnapshot = await getDocs(treatQuery);
      const treats = treatSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTodaysTreat(treats.length > 0 ? treats[0] : null);
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

        {/* Featured Products */}
        <div className="home-featured-vector-wrapper">
          <img src={featuredVector} alt="Featured Products" className="home-featured-vector" />
        </div>
        <section className="home-category-section">
          <div className="home-section-heading-wrapper">
            <p className="home-section-paragraph">
              Discover a world of flavor and nostalgia in our carefully curated selection of featured products.
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

        {/* Today's Treat */}
        <div className="home-featured-vector-wrapper">
          <img src={TodaysTreat} alt="Featured Products" className="home-Todays-Treat" />
        </div>
        {todaysTreat && (
          <section className="home-banner-section">
            <div className="home-season-banner">
              <img
                src={todaysTreat.imageUrl}
                alt={todaysTreat.name}
                className="home-banner-image"
              />
              <div className="home-banner-overlay">
                <h3 className="home-banner-title">{todaysTreat.name}</h3>
                <button
                  className="home-banner-cta"
                  onClick={() =>
                    addToCart({
                      id: todaysTreat.id,
                      name: todaysTreat.name,
                      imageUrl: todaysTreat.imageUrl,
                      price: todaysTreat.price ?? todaysTreat.originalPrice,
                      quantity: 1,
                    })
                  }
                >
                  Order Now
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Home;
