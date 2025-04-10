// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/firebase";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [usedCoupons, setUsedCoupons] = useState(() => {
    const saved = localStorage.getItem("usedCoupons");
    return saved ? JSON.parse(saved) : [];
  });

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.price || item.originalPrice || 0;
    return acc + price * item.quantity;
  }, 0);

  const total = Math.max(0, subtotal - discount);

  // 🔁 Update discount when coupon or subtotal changes
  useEffect(() => {
    if (!coupon) {
      setDiscount(0);
      return;
    }

    if (coupon.type === "flat") {
      setDiscount(coupon.amount);
    } else if (coupon.type === "percent") {
      setDiscount((subtotal * coupon.amount) / 100);
    }
  }, [coupon, subtotal]);

  // 💾 Save cart and clear promo if emptied
  useEffect(() => {
    if (cartItems.length === 0) {
      setCoupon(null);
      setPromoCode("");
      setPromoMessage("");
      setUsedCoupons([]);
      setDiscount(0);
      localStorage.removeItem("cartItems");
      localStorage.removeItem("usedCoupons");
    } else {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // 🏷️ Promo logic
  const applyPromoCode = async (code) => {
    const trimmed = code.trim().toUpperCase();

    if (usedCoupons.find((c) => c.code === trimmed)) {
      setPromoMessage("You’ve already used this promo code.");
      return;
    }

    try {
      const snapshot = await getDocs(collection(db, "coupons"));
      const coupons = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const match = coupons.find((c) => c.code === trimmed);

      if (!match) {
        setPromoMessage("Invalid promo code.");
        return;
      }

      const now = new Date();
      if (!match.permanent && match.expiry?.seconds) {
        const expiryDate = new Date(match.expiry.seconds * 1000);
        if (expiryDate < now) {
          setPromoMessage("Promo code has expired.");
          return;
        }
      }

      // Minimum subtotal rules
      if (match.type === "flat") {
        if (match.amount <= 10 && subtotal < 50) {
          setPromoMessage("This coupon requires a minimum subtotal of $50.");
          return;
        }
        if (match.amount > 10 && subtotal < 100) {
          setPromoMessage("This coupon requires a minimum subtotal of $100.");
          return;
        }
      }

      const valueApplied =
        match.type === "flat"
          ? match.amount
          : parseFloat(((subtotal * match.amount) / 100).toFixed(2));

      const newUsed = [
        ...usedCoupons,
        {
          code: match.code,
          type: match.type,
          amount: match.amount,
          valueApplied,
        },
      ];

      setPromoCode(trimmed);
      setCoupon(match);
      setDiscount(valueApplied);
      setPromoMessage("Promo applied!");
      setUsedCoupons(newUsed);
      localStorage.setItem("usedCoupons", JSON.stringify(newUsed));
    } catch (error) {
      console.error("Error applying promo code:", error);
      setPromoMessage("Something went wrong. Try again.");
    }
  };

  // ➕ Add product
  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      return exists
        ? prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { ...product, quantity: 1 }];
    });
  };

  // ❌ Remove item
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 🔄 Update quantity
  const updateQuantity = (id, amount) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  // 🧹 Full cart + promo clear
  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    setPromoCode("");
    setPromoMessage("");
    setDiscount(0);
    setUsedCoupons([]);
    localStorage.removeItem("cartItems");
    localStorage.removeItem("usedCoupons");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyPromoCode,
        promoCode,
        promoMessage,
        discount,
        subtotal,
        total,
        usedCoupons,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
