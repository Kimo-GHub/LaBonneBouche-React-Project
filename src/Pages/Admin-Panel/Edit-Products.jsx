import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../Firebase/firebase";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import "../../styles/Admin/AddProducts.css";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const matchedDoc = querySnapshot.docs.find(
        (doc) => doc.data().name.replace(/\s+/g, '-').toLowerCase() === id
      );

      if (matchedDoc) {
        const data = matchedDoc.data();
        const weight = parseFloat(data.weight);
        setProduct({ ...data, weight: isNaN(weight) ? "" : weight, id: matchedDoc.id });
      } else {
        setMessage("Product not found.");
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleChange = (field, value) => {
    setProduct({ ...product, [field]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      ...product,
      weight:
        product.weight >= 1000
          ? `${(product.weight / 1000).toFixed(1)}KG`
          : `${product.weight}G`,
    };

    await updateDoc(doc(db, "products", product.id), updatedProduct);
    setMessage("Product updated successfully!");
    setTimeout(() => navigate("/admin/view-products"), 1500);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner" />
      </div>
    );
  }

  if (!product) {
    return <div className="message">Product not found.</div>;
  }

  return (
    <div className="add-product-container">
      <h2>Edit Product</h2>
      {message && <p className="message">{message}</p>}

      <form className="product-form" onSubmit={handleUpdate}>
        <label>Product Name</label>
        <input
          type="text"
          value={product.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />

        <label>Description / Ingredients</label>
        <textarea
          value={product.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          required
        />

        <label>Original Price</label>
        <input
          type="number"
          value={product.originalPrice || ""}
          onChange={(e) => handleChange("originalPrice", e.target.value)}
          step="0.01"
          required
        />

        <label>New Price (optional)</label>
        <input
          type="number"
          value={product.price || ""}
          onChange={(e) => handleChange("price", e.target.value)}
          step="0.01"
        />

        <label>Weight (grams)</label>
        <input
          type="number"
          value={product.weight || ""}
          onChange={(e) => handleChange("weight", e.target.value)}
        />

        <label>Calories per 100g</label>
        <input
          type="text"
          value={product.calories || ""}
          onChange={(e) => handleChange("calories", e.target.value)}
        />

        <label>Category</label>
        <select
          value={product.category || ""}
          onChange={(e) => handleChange("category", e.target.value)}
        >
          <option value="cookies">Cookies</option>
          <option value="cakes">Cakes</option>
          <option value="bites-of-happiness">Bites of Happiness</option>
          <option value="taste-of-the-season">A Taste of the Season</option>
          <option value="featured">Featured Products</option>
        </select>

        <div className="form-buttons">
          <button type="submit">Update Product</button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/admin/view-products")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
