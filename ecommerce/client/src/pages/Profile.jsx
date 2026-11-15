import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const input = "w-full rounded-lg border p-3 outline-none focus:border-indigo-500";

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put("/auth/profile", {
        name,
        currentPassword: newPassword ? currentPassword : undefined,
        newPassword: newPassword || undefined,
      });
      updateUser(data);
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-xl bg-white p-8 shadow">
      <h1 className="mb-1 text-2xl font-bold">My Profile</h1>
      <p className="mb-6 text-sm capitalize text-gray-400">Role: {user.role}</p>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-gray-500">Email (maatha mudiyaadhu)</label>
          <input value={user.email} disabled className={`${input} opacity-60`} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-500">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={input} required />
        </div>

        <h2 className="pt-2 font-semibold">Change Password (optional)</h2>
        <input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={input}
        />
        <input
          type="password"
          placeholder="New password (min 6 chars)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={input}
          minLength={6}
        />

        <button
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 py-3 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}