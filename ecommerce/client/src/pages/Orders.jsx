import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check } from "lucide-react";
import api from "../api/axios";
import { productImage } from "../utils/productImage";

const steps = ["Pending", "Shipped", "Delivered"];

const statusColor = {
  Pending: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

function Tracker({ status }) {
  const current = steps.indexOf(status);
  return (
    <div className="my-4 flex items-center">
      {steps.map((s, i) => (
        <div key={s} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                i <= current ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-400"
              }`}
            >
              {i <= current ? <Check size={14} /> : i + 1}
            </div>
            <span className={`mt-1 text-xs ${i <= current ? "text-indigo-600" : "text-gray-400"}`}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`mx-2 mb-4 h-1 flex-1 rounded ${i < current ? "bg-indigo-600" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    api
      .get("/orders/mine")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    if (!confirm("Cancel this order?")) return;
    try {
      await api.put(`/orders/${id}/cancel`);
      toast.success("Order cancelled");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    }
  };

  if (loading) return <p className="py-20 text-center text-gray-400">Loading...</p>;
  if (orders.length === 0) return <p className="py-20 text-center text-gray-400">No orders yet</p>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">My Orders</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-gray-400">Order #{o._id.slice(-6).toUpperCase()}</p>
                <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  statusColor[o.status] || "bg-gray-100"
                }`}
              >
                {o.status}
              </span>
            </div>

            {o.status !== "Cancelled" && <Tracker status={o.status} />}

            {o.items.map((i, idx) => (
              <div key={idx} className="flex items-center gap-3 py-2">
                <img
                  src={productImage(i)}
                  alt={i.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = productImage({ name: i.name });
                  }}
                  className="h-14 w-14 rounded object-cover"
                />
                <div className="flex-1 text-sm">
                  <p className="font-medium">{i.name}</p>
                  <p className="text-gray-400">Qty: {i.qty}</p>
                </div>
                <p className="text-sm font-semibold">₹{i.price * i.qty}</p>
              </div>
            ))}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-sm">
              <span className="text-gray-500">
                {o.paymentMethod} · {o.paymentStatus}
              </span>
              <div className="flex items-center gap-4">
                {o.status === "Pending" && (
                  <button onClick={() => cancel(o._id)} className="text-red-500 hover:underline">
                    Cancel order
                  </button>
                )}
                <span className="font-bold">Total ₹{o.totalPrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}