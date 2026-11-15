import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ name: "", phone: "", street: "", city: "", pincode: "" });
  const [method, setMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const change = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fullAddress = `${address.name}, ${address.phone}, ${address.street}, ${address.city} - ${address.pincode}`;
      await api.post("/orders", {
        items: cart.map((i) => ({ product: i._id, qty: i.qty })),
        address: fullAddress,
        paymentMethod: "COD",
      });
      clearCart();
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Order failed");
          toast.error("Order failed!");
    } finally {
        toast.success("Order placed successfully!");
      setLoading(false);
    }
  };

  if (cart.length === 0) return <p className="py-20 text-center text-gray-400">Cart is empty</p>;

  const inputClass = "w-full rounded-lg border p-3 outline-none focus:border-indigo-500";

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-3">
      <form onSubmit={placeOrder} className="space-y-4 rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
        <h1 className="text-2xl font-bold">Shipping Address</h1>
        {error && <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}
        <input name="name" placeholder="Full name" onChange={change} className={inputClass} required />
        <input name="phone" placeholder="Phone" onChange={change} className={inputClass} required />
        <input name="street" placeholder="Street / Door no" onChange={change} className={inputClass} required />
        <div className="grid grid-cols-2 gap-4">
          <input name="city" placeholder="City" onChange={change} className={inputClass} required />
          <input name="pincode" placeholder="Pincode" onChange={change} className={inputClass} required />
        </div>

        <h2 className="pt-2 text-lg font-bold">Payment Method</h2>
        <label className="flex items-center gap-3 rounded-lg border p-3">
          <input type="radio" checked={method === "COD"} onChange={() => setMethod("COD")} />
          Cash on Delivery
        </label>
        <label className="flex items-center gap-3 rounded-lg border bg-gray-50 p-3 text-gray-400">
          <input type="radio" disabled /> Online Payment (Razorpay) - Coming soon
        </label>

        <button disabled={loading} className="w-full rounded-lg bg-indigo-600 py-3 text-white hover:bg-indigo-700 disabled:opacity-60">
          {loading ? "Placing order..." : `Place Order · ₹${total}`}
        </button>
      </form>

      <div className="h-fit rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
        {cart.map((i) => (
          <div key={i._id} className="flex justify-between py-1 text-sm">
            <span>{i.name} × {i.qty}</span>
            <span>₹{i.price * i.qty}</span>
          </div>
        ))}
        <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>
    </div>
  );
}