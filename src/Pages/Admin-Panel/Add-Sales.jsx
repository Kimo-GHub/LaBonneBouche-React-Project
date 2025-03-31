import React, { useState, useEffect } from "react";
import { db } from "../../Firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import "../../styles/Admin/AddSales.css";

export default function AddSales() {
  const [code, setCode] = useState("");
  const [type, setType] = useState("flat");
  const [amount, setAmount] = useState("");
  const [expiry, setExpiry] = useState("");
  const [permanent, setPermanent] = useState(false);
  const [message, setMessage] = useState("");
  const [coupons, setCoupons] = useState([]);

  const fetchCoupons = async () => {
    const snapshot = await getDocs(collection(db, "coupons"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCoupons(list);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!code || !amount) {
      setMessage("Please fill all required fields.");
      return;
    }

    const newCoupon = {
      code: code.toUpperCase(),
      type,
      amount: parseFloat(amount),
      expiry: permanent ? null : (expiry ? new Date(expiry) : null),
      permanent,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "coupons"), newCoupon);
    setMessage("Coupon added!");
    setCode("");
    setType("flat");
    setAmount("");
    setExpiry("");
    setPermanent(false);
    fetchCoupons();
    setTimeout(() => setMessage(""), 2000);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "coupons", id));
    fetchCoupons();
  };

  return (
    <div className="add-sales-container">
      <h2>Add Coupon</h2>
      {message && <p className="message">{message}</p>}

      <form className="coupon-form" onSubmit={handleAddCoupon}>
        <input
          type="text"
          placeholder="Coupon Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="flat">Flat ($)</option>
          <option value="percent">Percentage (%)</option>
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <input
          type="date"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          disabled={permanent}
        />

        <label className="permanent-checkbox">
          <input
            type="checkbox"
            checked={permanent}
            onChange={(e) => setPermanent(e.target.checked)}
          />
          Permanent (no expiry)
        </label>

        <button type="submit">Add Coupon</button>
      </form>

      <h3>Current Coupons</h3>
      <ul className="coupon-list">
        {coupons.map((c) => (
          <li key={c.id}>
            <strong>{c.code}</strong> - {c.type === "flat" ? `$${c.amount}` : `${c.amount}%`}{" "}
            {c.permanent
              ? "(Permanent)"
              : c.expiry
              ? `(expires on ${new Date(c.expiry.seconds * 1000).toLocaleDateString()})`
              : ""}
            <button onClick={() => handleDelete(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
