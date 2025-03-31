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

  const confirmAction = async () => {
    if (!selectedProduct) return;

    if (modalType === "delete") {
      try {
        const baseUrl = "https://pfczymmhgubmkalctpqc.supabase.co/storage/v1/object/public/la-bonne-bouche/product-images/";
        const imagePath = selectedProduct.imageUrl.replace(baseUrl, "");
        if (imagePath) {
          await supabase.storage.from("la-bonne-bouche").remove([`product-images/${imagePath}`]);
        }
      } catch (error) {
        console.error("Error removing image from Supabase:", error);
      }
      await deleteDoc(doc(db, "products", selectedProduct.id));
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

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="view-products-container">
      <h2>All Products</h2>

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
              <th>New Price</th>
              <th>Original Price</th>
              <th>Weight</th>
              <th>Calories</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className={product.hidden ? "hidden-product" : ""}>
                <td className="product-image-cell">
                  <img src={product.imageUrl} alt={product.name} className="product-thumb" />
                </td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price ? `$${product.price}` : "-"}</td>
                <td>${product.originalPrice}</td>
                <td>{product.weight}</td>
                <td>{product.calories}</td>
                <td>{product.category}</td>
                <td className="action-buttons">
                  <button className="edit" onClick={() => navigate(`/admin/edit-product/${product.id}`)}>
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
            ))}
          </tbody>
        </table>
      )}

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
              <button className="confirm" onClick={confirmAction}>Yes</button>
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
