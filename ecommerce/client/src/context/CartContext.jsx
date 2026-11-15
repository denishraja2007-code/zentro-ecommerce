import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart") || "[]"));

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    if (product.stock <= 0) {
      toast.error("Out of stock");
      return;
    }
    const existing = cart.find((i) => i._id === product._id);
    const current = existing ? existing.qty : 0;
    if (current + qty > product.stock) {
      toast.error(`Only ${product.stock} in stock`);
      return;
    }
    setCart((prev) =>
      existing
        ? prev.map((i) => (i._id === product._id ? { ...i, qty: i.qty + qty } : i))
        : [...prev, { ...product, qty }]
    );
    toast.success("Added to cart");
  };

  const updateQty = (id, qty) => {
    const item = cart.find((i) => i._id === id);
    if (item && qty > item.stock) {
      toast.error(`Only ${item.stock} in stock`);
      return;
    }
    setCart((prev) => prev.map((i) => (i._id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
    toast("Removed from cart");
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);