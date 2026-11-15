import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { productImage } from "../utils/productImage";

export default function Cart() {
  const { cart, updateQty, removeFromCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0)
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-xl text-gray-500">Your cart is empty</p>
        <Link to="/products" className="rounded-lg bg-indigo-600 px-6 py-3 text-white">Shop Now</Link>
      </div>
    );

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        {cart.map((item) => (
          <div key={item._id} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
            <img
              src={productImage(item)}
              alt={item.name}
              className="h-24 w-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-indigo-600">₹{item.price}</p>
              <div className="mt-2 flex items-center gap-3">
                <button onClick={() => updateQty(item._id, item.qty - 1)} className="rounded border px-2">-</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item._id, item.qty + 1)} className="rounded border px-2">+</button>
              </div>
            </div>
            <p className="font-bold">₹{item.price * item.qty}</p>
            <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="h-fit rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
        <div className="flex justify-between border-b pb-3">
          <span>Subtotal</span>
          <span>₹{total}</span>
        </div>
        <div className="flex justify-between py-3 text-lg font-bold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
        <button
          onClick={() => navigate(user ? "/checkout" : "/login")}
          className="w-full rounded-lg bg-indigo-600 py-3 text-white hover:bg-indigo-700"
        >
          {user ? "Proceed to Checkout" : "Login to Checkout"}
        </button>
      </div>
    </div>
  );
}