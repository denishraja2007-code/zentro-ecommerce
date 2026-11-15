import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackButton from "./components/BackButton";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function BackBar() {
  const { pathname } = useLocation();
  const hide = ["/", "/login", "/register", "/admin"].includes(pathname);
  if (hide) return null;
  return (
    <div className="mx-auto max-w-7xl px-4 pt-5">
      <BackButton className="!mb-0" />
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-800">
      <Toaster position="top-right" />
      <Navbar />
      <main className="flex-1">
        <BackBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute customerOnly><Wishlist /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute customerOnly><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute customerOnly><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute customerOnly><Orders /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
          <Route path="*" element={user ? <NotFound /> : <Navigate to="/login" replace />} />
        </Routes>
      </main>
      {user && <Footer />}
    </div>
  );
}