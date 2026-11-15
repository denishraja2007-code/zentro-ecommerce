import axios from "axios";

const base = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: base ? `${base}/api` : "/api",
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export default api;