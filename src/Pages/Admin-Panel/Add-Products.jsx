import React, { useState, useEffect } from "react";
import { db } from "../../Firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { supabase } from "../../Firebase/supabaseClient";
import "../../styles/Admin/AddProducts.css";

const bucketName = "la-bonne-bouche";
const folderName = "product-images";

export default function AddProducts() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [pieces, setPieces] = useState("");
  const [serves, setServes] = useState("");
  const [displayUnit, setDisplayUnit] = useState("weight");
  const [calories, setCalories] = useState("");
  const [category, setCategory] = useState("cookies");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const formatWeight = (value) => {
    const numeric = parseFloat(value);
    if (isNaN(numeric)) return "";
    return numeric >= 1000 ? `${(numeric / 1000).toFixed(2)}KG` : `${numeric}G`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage("");

    if (!imageFile) {
      setMessage("Please upload an image.");
      setUploading(false);
      return;
    }

    const fileName = `${Date.now()}-${imageFile.name}`;
    const fullPath = `${folderName}/${fileName}`;

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fullPath, imageFile, { upsert: true });

    if (error) {
      setMessage("Failed to upload image.");
      console.error(error);
      setUploading(false);
      return;
    }

    const imageUrl = `https://pfczymmhgubmkalctpqc.supabase.co/storage/v1/object/public/${bucketName}/${fullPath}`;

    await addDoc(collection(db, "products"), {
      name,
      description,
      originalPrice:
        isBanner ? null : parseFloat(originalPrice),
      price: isBanner ? null : price ? parseFloat(price) : null,
      weight: isBanner ? null : formatWeight(weight),
      pieces: isBanner ? null : pieces ? `${pieces} PCS` : null,
      serves: isBanner ? null : serves ? parseInt(serves) : null,
      displayUnit: isBanner ? null : displayUnit,
      calories: isBanner ? null : calories,
      category,
      imageUrl,
      createdAt: serverTimestamp(),
    });

    setMessage("Product added successfully!");
    setName("");
    setDescription("");
    setPrice("");
    setOriginalPrice("");
    setWeight("");
    setPieces("");
    setServes("");
    setDisplayUnit("weight");
    setCalories("");
    setCategory("cookies");
    setImageFile(null);
    setImagePreview(null);
    setUploading(false);
  };

  const isBanner = category === "taste-of-the-season" || category === "todays-treat";

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      {message && <p className="message">{message}</p>}

      <form className="product-form" onSubmit={handleSubmit}>
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="preview-image" />
        )}

        <label>Product Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <label>Product Name</label>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Description / Ingredients</label>
        <textarea
          placeholder="Description / Ingredients"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {!isBanner && (
          <>
            <label>Original Price</label>
            <input
              type="number"
              step="0.01"
              placeholder="Original Price"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              required
            />

            <label>New Price (optional)</label>
            <input
              type="number"
              step="0.01"
              placeholder="New Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <label>Weight (grams)</label>
            <input
              type="number"
              placeholder="e.g. 120"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />

            <label>Pieces</label>
            <input
              type="number"
              placeholder="e.g. 6"
              value={pieces}
              onChange={(e) => setPieces(e.target.value)}
            />

            <label>Number of People (Serves)</label>
            <input
              type="number"
              placeholder="e.g. 4"
              value={serves}
              onChange={(e) => setServes(e.target.value)}
            />

            <label>Show on shop as:</label>
            <select
              value={displayUnit}
              onChange={(e) => setDisplayUnit(e.target.value)}
            >
              <option value="weight">Weight</option>
              <option value="pieces">Pieces</option>
              <option value="serves">Serves</option>
            </select>

            <label>Calories</label>
            <input
              type="text"
              placeholder="Calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </>
        )}

        <label>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="cookies">Cookies</option>
          <option value="cakes">Cakes</option>
          <option value="bites-of-happiness">Bites of Happiness</option>
          <option value="taste-of-the-season">A Taste of the Season</option>
          <option value="todays-treat">Today's Treat</option>
          <option value="featured">Featured Products</option>
        </select>

        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
