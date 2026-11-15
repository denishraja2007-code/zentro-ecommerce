import { useEffect, useState } from "react";
import { Trash2, Tag } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const empty = { title: "", description: "", code: "", expiresAt: "" };

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState(empty);

  const load = () => api.get("/offers/all").then((r) => setOffers(r.data));

  useEffect(() => {
    load();
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const add = async (e) => {
    e.preventDefault();
    try {
      await api.post("/offers", { ...form, code: form.code.toUpperCase() });
      toast.success("Offer added");
      setForm(empty);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const toggle = async (id) => {
    await api.put(`/offers/${id}/toggle`);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this offer?")) return;
    await api.delete(`/offers/${id}`);
    toast.success("Offer deleted");
    load();
  };

  const input = "w-full rounded-lg border p-2.5 outline-none focus:border-indigo-500";

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={add} className="h-fit space-y-3 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="font-bold">Add Offer</h2>
        <input name="title" placeholder="Title (e.g. Diwali Sale 20% OFF)" value={form.title} onChange={change} className={input} required />
        <input name="description" placeholder="Short description" value={form.description} onChange={change} className={input} />
        <input name="code" placeholder="Code (optional, e.g. DIWALI20)" value={form.code} onChange={change} className={input} />
        <div>
          <label className="mb-1 block text-xs text-gray-400">Expires on (optional)</label>
          <input name="expiresAt" type="date" value={form.expiresAt} onChange={change} className={input} />
        </div>
        <button className="w-full rounded-lg bg-indigo-600 py-2.5 text-white hover:bg-indigo-700">Add Offer</button>
      </form>

      <div className="space-y-3 lg:col-span-2">
        {offers.length === 0 && <p className="text-gray-400">No offers yet</p>}
        {offers.map((o) => (
          <div key={o._id} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
            <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
              <Tag size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium">{o.title}</p>
              <p className="text-sm text-gray-400">
                {o.description} {o.code && `· Code: ${o.code}`}{" "}
                {o.expiresAt && `· Till ${new Date(o.expiresAt).toLocaleDateString()}`}
              </p>
            </div>
            <button
              onClick={() => toggle(o._id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                o.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
              }`}
            >
              {o.active ? "Active" : "Off"}
            </button>
            <button onClick={() => remove(o._id)} className="text-red-500 hover:text-red-700">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}