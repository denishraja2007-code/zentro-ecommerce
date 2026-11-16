import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogOut,
  Heart,
  Moon,
  Sun,
  Home as HomeIcon,
  Languages,
  Package,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useLang } from "../context/LanguageContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { wishlist } = useWishlist();
  const { lang, t, toggleLang } = useLang();
  const navigate = useNavigate();
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const themeBtn = (
    <button
      onClick={() => setDark(!dark)}
      className="text-gray-500 transition hover:rotate-12 hover:text-indigo-600"
      title="Toggle theme"
    >
      {dark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );

  const langBtn = (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1 rounded-md border px-1.5 py-1 text-xs font-semibold text-gray-600 transition hover:border-indigo-600 hover:text-indigo-600"
      title="Language"
    >
      <Languages size={14} className="hidden sm:block" /> {lang === "en" ? "தமிழ்" : "EN"}
    </button>
  );

  const nameLink = user && (
    <Link to="/profile" className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600" title="Profile">
      <User size={19} className="sm:size-4" />
      <span className="hidden sm:inline">{user.name}</span>
    </Link>
  );

  const link = "nav-link flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-indigo-600";

  const homeLink = (
    <NavLink
      to="/"
      end
      className={({ isActive }) =>
        `nav-link flex items-center gap-1 text-sm font-medium hover:text-indigo-600 ${
          isActive ? "text-indigo-600" : "text-gray-600"
        }`
      }
    >
      <HomeIcon size={19} />
      <span className="hidden sm:inline">{t("home")}</span>
    </NavLink>
  );

  const logoutBtn = (
    <button onClick={handleLogout} className="text-gray-500 hover:text-red-500" title="Logout">
      <LogOut size={19} />
    </button>
  );

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? "bg-white/85 shadow-md backdrop-blur-md" : "bg-white"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 transition-all duration-300 sm:px-4 ${
          scrolled ? "py-2.5" : "py-3.5"
        }`}
      >
        <Link to="/" className="group flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-lg font-extrabold text-amber-300 transition group-hover:rotate-6">
            Z
          </span>
          <span className="hidden text-xl font-extrabold tracking-tight text-indigo-600 min-[400px]:inline">
            Zentro
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          {!user ? (
            <>
              {langBtn}
              {themeBtn}
            </>
          ) : user.role === "admin" ? (
            <>
              {homeLink}
              <Link to="/admin" className={link} title={t("dashboard")}>
                <LayoutDashboard size={19} />
                <span className="hidden sm:inline">{t("dashboard")}</span>
              </Link>
              {langBtn}
              {themeBtn}
              {nameLink}
              {logoutBtn}
            </>
          ) : (
            <>
              {homeLink}
              <Link to="/products" className={link} title={t("products")}>
                <Package size={19} />
                <span className="hidden sm:inline">{t("products")}</span>
              </Link>

              <Link to="/wishlist" className="relative text-gray-600 transition hover:scale-110 hover:text-indigo-600">
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span
                    key={wishlist.length}
                    className="pop absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white"
                  >
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative text-gray-600 transition hover:scale-110 hover:text-indigo-600">
                <ShoppingCart size={20} />
                {count > 0 && (
                  <span
                    key={count}
                    className="pop absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white"
                  >
                    {count}
                  </span>
                )}
              </Link>

              {langBtn}
              {themeBtn}
              <Link to="/orders" className={link} title={t("orders")}>
                <ClipboardList size={19} />
                <span className="hidden sm:inline">{t("orders")}</span>
              </Link>
              {nameLink}
              {logoutBtn}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}