import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../Firebase/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { supabase } from "../../Firebase/supabaseClient";
import "../../styles/Admin/ViewProducts.css";

export default function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "products"));
    const productList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productList);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const confirmAction = async () => {
    if (!selectedProduct) return;

    if (modalType === "delete") {
      try {
        const baseUrl = "https://pfczymmhgubmkalctpqc.supabase.co/storage/v1/object/public/la-bonne-bouche/product-images/";
        const imagePath = selectedProduct.imageUrl.replace(baseUrl, "");
        if (imagePath) {
          await supabase.storage.from("la-bonne-bouche").remove([`product-images/${imagePath}`]);
        }
        await deleteDoc(doc(db, "products", selectedProduct.id));
      } catch (error) {
        console.error("Error deleting image/product:", error);
      }
    } else if (modalType === "hide") {
      await updateDoc(doc(db, "products", selectedProduct.id), {
        hidden: !selectedProduct.hidden,
      });
    }

    setShowModal(false);
    setSelectedProduct(null);
    setModalType("");
    fetchProducts();
  };

  // 🔍 Filtered list
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="view-products-container">
      <h2>All Products</h2>

      {/* 🔍 Search + Filter */}
      <div className="search-filter-controls">
        <input
          type="text"
          placeholder="Search by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-filter"
        >
          <option value="all">All Categories</option>
          <option value="cookies">Cookies</option>
          <option value="cakes">Cakes</option>
          <option value="bites-of-happiness">Bites of Happiness</option>
          <option value="taste-of-the-season">A Taste of the Season</option>
          <option value="todays-treat">Today's Treat</option>
          <option value="featured">Featured Products</option>
        </select>
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : (
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Original Price</th>
              <th>New Price</th>
              <th>Weight</th>
              <th>Pieces</th>
              <th>Serves</th>
              <th>Calories</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className={product.hidden ? "hidden-product" : ""}
                >
                  <td className="product-image-cell">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="product-thumb"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>${product.originalPrice}</td>
                  <td>{product.price ? `$${product.price}` : "-"}</td>
                  <td>{product.weight || "-"}</td>
                  <td>{product.pieces ? product.pieces : "1 PCS"}</td>
                  <td>{product.serves ? ` ${product.serves}` : "1"}</td>
                  <td>{product.calories}</td>
                  <td>{product.category}</td>
                  <td className="action-buttons">
                    <button
                      className="edit"
                      onClick={() =>
                        navigate(
                          `/admin-panel/edit-product/${product.name
                            .replace(/\s+/g, "-")
                            .toLowerCase()}`
                        )
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="delete"
                      onClick={() => {
                        setSelectedProduct(product);
                        setModalType("delete");
                        setShowModal(true);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="hide"
                      onClick={() => {
                        setSelectedProduct(product);
                        setModalType("hide");
                        setShowModal(true);
                      }}
                    >
                      {product.hidden ? "Unhide" : "Hide"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" style={{ textAlign: "center", padding: "1rem" }}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && selectedProduct && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>
              {modalType === "delete"
                ? `Are you sure you want to delete "${selectedProduct.name}"?`
                : selectedProduct.hidden
                ? `Are you sure you want to unhide "${selectedProduct.name}"?`
                : `Are you sure you want to hide "${selectedProduct.name}"?`}
            </h3>
            <div className="modal-buttons">
              <button className="confirm" onClick={confirmAction}>
                Yes
              </button>
              <button
                className="cancel"
                onClick={() => {
                  setShowModal(false);
                  setSelectedProduct(null);
                  setModalType("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
