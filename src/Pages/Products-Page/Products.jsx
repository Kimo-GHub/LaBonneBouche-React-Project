import React, { useEffect, useState, useContext } from 'react';
import { db } from '../../Firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Header from '../../components/Header-Footer/Header';
import Footer from '../../components/Header-Footer/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { CartContext } from '../../App'; // ✅ Import the cart context
import './products.css';
import productVector from '../../images/product-images/product-vector.png';

function Products() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext); // ✅ Destructure addToCart

  const categoryMap = {
    cookies: 'Cookies',
    cakes: 'Cakes',
    'bites-of-happiness': 'Bites of Happiness',
    'taste-of-the-season': 'A Taste of the Season',
  };

  const categories = Object.values(categoryMap);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const productList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productList);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const visibleProducts = products.filter((product) => !product.hidden);

  const groupedProducts = Object.keys(categoryMap).reduce((acc, key) => {
    const label = categoryMap[key];
    acc[label] = visibleProducts.filter((product) => product.category === key);
    return acc;
  }, {});

  const renderProductUnit = (product) => {
    if (product.displayUnit === 'pieces' && product.pieces) {
      return ` / ${product.pieces}`;
    } else if (product.displayUnit === 'serves' && product.serves) {
      return ` / 👤 x ${product.serves || 1}`;
    } else if (product.weight) {
      return ` / ${product.weight}`;
    } else {
      return '';
    }
  };

  const getSubtitle = (category) => {
    switch (category) {
      case 'Cookies':
        return 'Crafted with Love';
      case 'Bites of Happiness':
        return 'The Bite-Sized Bliss';
      case 'Cakes':
        return 'Happiness';
      case 'A Taste of the Season':
        return 'Baked to Perfection';
      default:
        return '';
    }
  };

  return (
    <div className="products-page">
      <Header />

      <div className="vector-wrapper">
        <img
          src={productVector}
          alt="decorative swirl"
          className="section-vector-top-left"
        />
      </div>

      {categories.map((category) => {
        const items = groupedProducts[category] || [];
        const isTasteOfSeason = category === 'A Taste of the Season';

        return (
          <section className="category-section" key={category}>
            <div className="section-heading-wrapper">
              <h2 className="section-title">
                <span className="section-heading-text">{category}</span>
                <span className="section-subtitle">{getSubtitle(category)}</span>
              </h2>
              {category === 'Cakes' && (
                <p className="section-paragraph">
                  Enjoy the taste of freshness.{' '}
                  <strong>Preorder your cake 3 hours in advance</strong> to guarantee availability.
                </p>
              )}
            </div>

            {items.length > 0 ? (
              isTasteOfSeason ? (
                <div className="banner-section">
                  {items.map((product) => (
                    <div className="season-banner" key={product.id}>
                      <img src={product.imageUrl} alt={product.name} className="banner-image" />
                      <div className="banner-overlay">
                        <h3 className="banner-title">{product.name}</h3>
                        <button className="banner-cta">Order Now</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
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
                  {items.map((product) => (
                    <SwiperSlide key={product.id}>
                      <div className="product-card">
                        <div className="image-wrapper">
                          <img src={product.imageUrl} alt={product.name} className="product-image" />
                        </div>
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">
                          {product.price !== null && product.price !== undefined ? (
                            <>
                              <span className="original-price">${product.originalPrice}</span>
                              <strong>${product.price}</strong>
                            </>
                          ) : (
                            <strong>${product.originalPrice}</strong>
                          )}
                          <span className="product-unit">{renderProductUnit(product)}</span>
                        </p>
                        <button
                          className="add-to-cart-btn"
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
              )
            ) : (
              <p style={{ textAlign: 'center', color: '#aaa' }}>
                No products available in this category yet.
              </p>
            )}
          </section>
        );
      })}

      <Footer />
    </div>
  );
}

export default Products;
