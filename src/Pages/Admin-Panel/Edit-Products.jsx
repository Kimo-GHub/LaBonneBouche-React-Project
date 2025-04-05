import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../Firebase/firebase";
import { supabase } from "../../Firebase/supabaseClient";
import { doc, getDocs, updateDoc, collection } from "firebase/firestore";
import "../../styles/Admin/EditProducts.css";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);

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

  const handleImageChange = (e) => {
    setNewImageFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    let imageUrl = product.imageUrl;

    if (newImageFile) {
      try {
        // Remove old image
        const oldImagePath = imageUrl?.split("/product-images/")[1];
        if (oldImagePath) {
          await supabase.storage.from("la-bonne-bouche").remove([`product-images/${oldImagePath}`]);
        }

        // Upload new image
        const fileName = `${Date.now()}_${newImageFile.name}`;
        const { data, error } = await supabase.storage
          .from("la-bonne-bouche")
          .upload(`product-images/${fileName}`, newImageFile);

        if (error) throw error;

        imageUrl = `https://pfczymmhgubmkalctpqc.supabase.co/storage/v1/object/public/la-bonne-bouche/product-images/${fileName}`;
      } catch (err) {
        console.error("Image upload error:", err);
        setMessage("Image upload failed.");
        return;
      }
    }

    const updatedProduct = {
      ...product,
      imageUrl,
      weight:
        product.weight >= 1000
          ? `${(product.weight / 1000).toFixed(1)}KG`
          : `${product.weight}G`,
    };

    await updateDoc(doc(db, "products", product.id), updatedProduct);
    setMessage("Product updated successfully!");
    setTimeout(() => navigate("/admin-panel/view-products"), 1500);
  };

  if (loading) {
    return (
      <div className="edit-product-spinner-container">
        <div className="edit-product-spinner" />
      </div>
    );
  }

  if (!product) {
    return <div className="edit-product-message">Product not found.</div>;
  }

  return (
    <div className="edit-product-container">
      <h2>Edit Product</h2>
      {message && <p className="edit-product-message">{message}</p>}

      <form className="edit-product-form" onSubmit={handleUpdate}>
    
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="edit-product-image-preview"
          />
        )}

        <label>Change Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

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

        <label>Pieces</label>
        <input
          type="text"
          placeholder="e.g. 6"
          value={product.pieces || ""}
          onChange={(e) => handleChange("pieces", e.target.value)}
        />

        <label>Number of People (Serves)</label>
        <input
          type="text"
          placeholder="e.g. 4"
          value={product.serves || ""}
          onChange={(e) => handleChange("serves", e.target.value)}
        />

        <label>Show on shop as:</label>
        <select
          value={product.displayType || "Weight"}
          onChange={(e) => handleChange("displayType", e.target.value)}
        >
          <option value="Weight">Weight</option>
          <option value="Pieces">Pieces</option>
          <option value="Serves">Serves</option>
        </select>

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
          <option value="todays-treat">Today's Treat</option>
          <option value="featured">Featured Products</option>
        </select>

        <div className="edit-product-form-buttons">
          <button type="submit">Update Product</button>
          <button
            type="button"
            className="edit-product-cancel-btn"
            onClick={() => navigate("/admin-panel/view-products")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
