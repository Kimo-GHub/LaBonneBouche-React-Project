// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/firebase";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Persist cart items in localStorage
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  // Initialize promo-related state from localStorage if available
  const [promoCode, setPromoCode] = useState(() => localStorage.getItem("promoCode") || "");
  const [promoMessage, setPromoMessage] = useState(() => localStorage.getItem("promoMessage") || "");
  const [coupon, setCoupon] = useState(() => {
    const saved = localStorage.getItem("coupon");
    return saved ? JSON.parse(saved) : null;
  });
  const [discount, setDiscount] = useState(0);
  const [usedCoupons, setUsedCoupons] = useState(() => {
    const saved = localStorage.getItem("usedCoupons");
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate subtotal from cart items
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.price || item.originalPrice || 0;
    return acc + price * item.quantity;
  }, 0);

  // Total is subtotal minus discount (cannot be below zero)
  const total = Math.max(0, subtotal - discount);

  // Recalculate discount whenever coupon or subtotal changes
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

  // Persist cart items whenever they change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist promo-related state changes in localStorage
  useEffect(() => {
    localStorage.setItem("promoCode", promoCode);
  }, [promoCode]);

  useEffect(() => {
    localStorage.setItem("promoMessage", promoMessage);
  }, [promoMessage]);

  useEffect(() => {
    localStorage.setItem("coupon", JSON.stringify(coupon));
  }, [coupon]);

  useEffect(() => {
    localStorage.setItem("usedCoupons", JSON.stringify(usedCoupons));
  }, [usedCoupons]);

  // If the cart is emptied, reset promo data completely
  useEffect(() => {
    if (cartItems.length === 0) {
      setCoupon(null);
      setPromoCode("");
      setPromoMessage("");
      setUsedCoupons([]);
      localStorage.removeItem("cartItems");
      localStorage.removeItem("promoCode");
      localStorage.removeItem("promoMessage");
      localStorage.removeItem("coupon");
      localStorage.removeItem("usedCoupons");
    }
  }, [cartItems]);

  // Apply a promo code by fetching all coupons from Firebase
  const applyPromoCode = async (code) => {
    const trimmed = code.trim().toUpperCase();

    // Check if this promo code has been used already (in this session)
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

      // For flat type, check minimum subtotal conditions
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

      // Calculate the value applied based on type
      const valueApplied =
        match.type === "flat"
          ? match.amount
          : parseFloat(((subtotal * match.amount) / 100).toFixed(2));

      // Append this coupon to the used coupons list
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
    } catch (error) {
      console.error("Error applying promo code:", error);
      setPromoMessage("Something went wrong. Try again.");
    }
  };

  // Add a product to the cart, increase its quantity if it already exists
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

  // Remove a product from the cart by filtering it out
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Update the quantity of a product in the cart (cannot go below 1)
  const updateQuantity = (id, amount) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  // Clear the cart and reset all promo data
  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    setPromoCode("");
    setPromoMessage("");
    setDiscount(0);
    setUsedCoupons([]);
    localStorage.removeItem("cartItems");
    localStorage.removeItem("promoCode");
    localStorage.removeItem("promoMessage");
    localStorage.removeItem("coupon");
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