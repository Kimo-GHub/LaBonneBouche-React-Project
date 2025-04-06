import { createContext, useContext, useState, useEffect } from "react";
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
  const [coupon, setCoupon] = useState(null); // ✅ store entire coupon object
  const [discount, setDiscount] = useState(0);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.price || item.originalPrice || 0;
    return acc + price * item.quantity;
  }, 0);

  // 🔁 Recalculate discount every time subtotal or coupon changes
  useEffect(() => {
    if (!coupon) return setDiscount(0);
    if (coupon.type === "flat") {
      setDiscount(coupon.amount);
    } else if (coupon.type === "percent") {
      setDiscount((subtotal * coupon.amount) / 100);
    }
  }, [subtotal, coupon]);

  const applyPromoCode = async (code) => {
    const trimmed = code.trim().toUpperCase();
    const snapshot = await getDocs(collection(db, "coupons"));
    const coupons = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const match = coupons.find((c) => c.code === trimmed);

    if (!match) {
      setPromoMessage("Invalid promo code.");
      setCoupon(null);
      setPromoCode("");
      return;
    }

    const now = new Date();
    if (!match.permanent && match.expiry?.seconds) {
      const expiryDate = new Date(match.expiry.seconds * 1000);
      if (expiryDate < now) {
        setPromoMessage("Promo code has expired.");
        setCoupon(null);
        setPromoCode("");
        return;
      }
    }

    setPromoCode(trimmed);
    setCoupon(match); // ✅ this triggers discount recalculation
    setPromoMessage("Promo applied!");
  };

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

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, amount) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const total = Math.max(0, subtotal - discount);

  // 💾 Optional: persist cart
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
