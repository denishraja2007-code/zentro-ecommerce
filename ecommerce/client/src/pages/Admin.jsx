import { useEffect, useState } from "react";
import { Trash2, Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "../api/axios";
import { productImage } from "../utils/productImage";
import AdminOffers from "../components/AdminOffers";

const emptyForm = { name: "", price: "", category: "electronics", image: "", description: "", stock: 10 };
const statusColors = {
  Pending: "#eab308",
  Shipped: "#3b82f6",
  Delivered: "#22c55e",
  Cancelled: "#ef4444",
};

export default function Admin() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadProducts = () => api.get("/products").then((r) => setProducts(r.data));
  const loadOrders = () => api.get("/orders").then((r) => setOrders(r.data));

  useEffect(() => {
    loadProducts();
    loadOrders();
    const timer = setInterval(loadOrders, 10000);
    return () => clearInterval(timer);
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image || "",
      description: p.description || "",
      stock: p.stock,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product added");
      }
      cancelEdit();
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    toast.success("Product deleted");
    if (editingId === id) cancelEdit();
    loadProducts();
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success(`Order marked ${status}`);
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const input = "w-full rounded-lg border p-2.5 outline-none focus:border-indigo-500";
  const revenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((s, o) => s + o.totalPrice, 0);

  // Chart data: last 7 days sales
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const salesData = days.map((d) => ({
    day: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    revenue: orders
      .filter((o) => o.status !== "Cancelled" && new Date(o.createdAt).toDateString() === d.toDateString())
      .reduce((s, o) => s + o.totalPrice, 0),
  }));

  // Chart data: orders by status
  const statusData = ["Pending", "Shipped", "Delivered", "Cancelled"]
    .map((s) => ({ name: s, value: orders.filter((o) => o.status === s).length }))
    .filter((x) => x.value > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-400">Products</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-400">Orders</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-400">Revenue</p>
          <p className="text-2xl font-bold">₹{revenue}</p>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 font-bold">Sales (last 7 days)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b855" />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(v) => `₹${v}`} />
                <Bar dataKey="revenue" fill="#8f1d1d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-bold">Orders by status</h2>
          <div className="h-64">
            {statusData.length === 0 ? (
              <p className="pt-24 text-center text-sm text-gray-400">No orders yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {statusData.map((s) => (
                      <Cell key={s.name} fill={statusColors[s.name]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        {["products", "orders", "offers"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-sm capitalize ${
              tab === t ? "bg-indigo-600 text-white" : "bg-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <form onSubmit={saveProduct} className="h-fit space-y-3 rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">{editingId ? "Edit Product" : "Add Product"}</h2>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              )}
            </div>
            <input name="name" placeholder="Name" value={form.name} onChange={change} className={input} required />
            <input name="price" type="number" placeholder="Price" value={form.price} onChange={change} className={input} required />
            <select name="category" value={form.category} onChange={change} className={input}>
              <option>electronics</option>
              <option>fashion</option>
              <option>home</option>
              <option>sports</option>
            </select>
            <input name="image" placeholder="Image URL" value={form.image} onChange={change} className={input} />
            <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={change} className={input} />
            <textarea name="description" placeholder="Description" value={form.description} onChange={change} className={input} rows={3} />
            <button className="w-full rounded-lg bg-indigo-600 py-2.5 text-white hover:bg-indigo-700">
              {editingId ? "Update Product" : "Add Product"}
            </button>
          </form>

          <div className="space-y-3 lg:col-span-2">
            {products.map((p) => (
              <div key={p._id} className="flex items-center gap-4 rounded-xl bg-white p-3 shadow-sm">
                <img src={productImage(p)} alt={p.name} className="h-14 w-14 rounded object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-400">
                    {p.category} · ₹{p.price} ·{" "}
                    <span className={p.stock <= 0 ? "font-semibold text-red-500" : ""}>
                      Stock: {p.stock}
                    </span>
                  </p>
                </div>
                <button onClick={() => startEdit(p)} className="text-indigo-500 hover:text-indigo-700">
                  <Pencil size={20} />
                </button>
                <button onClick={() => deleteProduct(p._id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-3">
          {orders.length === 0 && <p className="text-gray-400">No orders yet</p>}
          {orders.map((o) => (
            <div
              key={o._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-medium">
                  #{o._id.slice(-6).toUpperCase()} · {o.user?.name}
                </p>
                <p className="text-sm text-gray-400">
                  {o.items.length} items · ₹{o.totalPrice} · {o.paymentMethod}
                </p>
                <p className="text-xs text-gray-400">{o.address}</p>
              </div>
              {o.status === "Cancelled" ? (
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                  Cancelled
                </span>
              ) : (
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                  className="rounded-lg border bg-white px-3 py-2 text-sm"
                >
                  <option>Pending</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "offers" && <AdminOffers />}
    </div>
  );
}