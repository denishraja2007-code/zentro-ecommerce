import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem("wishlist") || "[]"));

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const isWished = (id) => wishlist.some((p) => p._id === id);

  const toggleWishlist = (product) => {
    if (isWished(product._id)) {
      setWishlist((prev) => prev.filter((p) => p._id !== product._id));
      toast("Removed from wishlist");
    } else {
      setWishlist((prev) => [...prev, product]);
      toast.success("Added to wishlist");
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isWished, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);