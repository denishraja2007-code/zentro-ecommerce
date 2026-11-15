import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0)
    return (
      <div className="py-20 text-center">
        <Heart size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="mb-4 text-xl text-gray-500">Your wishlist is empty</p>
        <Link to="/products" className="rounded-lg bg-indigo-600 px-6 py-3 text-white">
          Browse Products
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">My Wishlist</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {wishlist.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}