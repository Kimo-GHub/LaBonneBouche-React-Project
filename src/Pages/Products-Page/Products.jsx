import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Header from '../../components/Header-Footer/Header';
import Footer from '../../components/Header-Footer/Footer';
import './products.css';

function Products() {
  const [products, setProducts] = useState([]);

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

  const visibleProducts = products.filter(product => !product.hidden);

  return (
    <div className="products-page">
      <Header />
      <section className="category-section">
      <h2 className="section-title">
         Freshly Baked Delights <span>Crafted with Love</span>
      </h2>

        <div className="product-carousel">
          {visibleProducts.map(product => (
            <div className="product-card" key={product.id}>
              <div className="image-wrapper">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">
                {product.price ? (
                  <>
                    <span className="original-price">${product.originalPrice}</span>
                    <strong>${product.price}</strong>
                  </>
                ) : (
                  <strong>${product.originalPrice}</strong>
                )}
                <span className="product-weight"> / {product.weight}</span>
              </p>
              <button className="add-to-cart-btn">Add To Cart</button>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Products;
