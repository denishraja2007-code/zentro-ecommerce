import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { productImage } from "../utils/productImage";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isWished, toggleWishlist } = useWishlist();
  const isAdmin = user?.role === "admin";
  const outOfStock = product.stock <= 0;
  const wished = isWished(product._id);

  return (
    <div className="group overflow-hidden rounded-xl bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative overflow-hidden">
        <Link to={`/products/${product._id}`} className="block">
          <img
            src={productImage(product)}
            alt={product.name}
            className={`h-52 w-full object-cover transition duration-700 group-hover:scale-110 ${
              outOfStock ? "opacity-50" : ""
            }`}
          />
        </Link>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
            Out of Stock
          </span>
        )}
        {!outOfStock && product.stock <= 5 && (
          <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
            Only {product.stock} left
          </span>
        )}

        {!isAdmin && (
          <button
            onClick={() => toggleWishlist(product)}
            className="absolute right-3 top-3 translate-y-[-8px] rounded-full bg-white p-2 opacity-0 shadow transition duration-300 hover:scale-110 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Heart
              size={18}
              className={wished ? "text-red-500" : "text-gray-400"}
              fill={wished ? "currentColor" : "none"}
            />
          </button>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-gray-400">{product.category}</p>
        <Link to={`/products/${product._id}`} className="block font-semibold transition hover:text-indigo-600">
          {product.name}
        </Link>
        <div className="mt-1 flex items-center gap-1 text-sm text-yellow-500">
          <Star size={14} fill="currentColor" /> {product.rating}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold">₹{product.price}</span>
          {!isAdmin && (
            <button
              onClick={() => addToCart(product)}
              disabled={outOfStock}
              className="shine flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white transition hover:bg-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <ShoppingCart size={16} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}