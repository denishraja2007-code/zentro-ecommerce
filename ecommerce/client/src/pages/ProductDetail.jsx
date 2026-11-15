import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { productImage } from "../utils/productImage";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <p className="py-20 text-center text-gray-400">Loading...</p>;

  const outOfStock = product.stock <= 0;

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2">
      <img
        src={productImage(product)}
        alt={product.name}
        className="w-full rounded-xl object-cover shadow"
      />

      <div>
        <p className="text-sm uppercase text-gray-400">{product.category}</p>
        <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
        <div className="mt-2 flex items-center gap-1 text-yellow-500">
          <Star size={18} fill="currentColor" /> {product.rating}
        </div>
        <p className="mt-4 text-3xl font-bold text-indigo-600">₹{product.price}</p>
        <p className="mt-4 text-gray-600">{product.description}</p>
        <p className={`mt-3 text-sm font-medium ${outOfStock ? "text-red-500" : "text-green-600"}`}>
          {outOfStock ? "Out of stock" : `In stock: ${product.stock}`}
        </p>

        {user?.role !== "admin" && (
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-lg border bg-white">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={outOfStock}
                className="px-4 py-2 text-lg"
              >
                -
              </button>
              <span className="px-4">{qty}</span>
              <button
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                disabled={outOfStock}
                className="px-4 py-2 text-lg"
              >
                +
              </button>
            </div>
            <button
              onClick={() => addToCart(product, qty)}
              disabled={outOfStock}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <ShoppingCart size={18} /> {outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}