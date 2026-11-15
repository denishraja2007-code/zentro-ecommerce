import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Truck, ShieldCheck, RotateCcw, Headphones, Smartphone, Shirt, Home as HomeIcon, Dumbbell, ArrowRight } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import OfferStrip from "../components/OfferStrip";

const categories = [
  { key: "electronics", icon: Smartphone },
  { key: "fashion", icon: Shirt },
  { key: "homeCat", icon: HomeIcon },
  { key: "sports", icon: Dumbbell },
];

const perks = [
  { icon: Truck, title: "perk1", text: "perk1t" },
  { icon: ShieldCheck, title: "perk2", text: "perk2t" },
  { icon: RotateCcw, title: "perk3", text: "perk3t" },
  { icon: Headphones, title: "perk4", text: "perk4t" },
];

export default function Home() {
  const { user } = useAuth();
  const { t } = useLang();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data.slice(0, 8)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <OfferStrip />

      {/* Hero */}
      <section className="hero-bg relative overflow-hidden text-white">
        <div className="floaty absolute -right-16 top-6 h-72 w-72 rounded-full bg-amber-400/10" />
        <div className="floaty absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-white/5" style={{ animationDelay: "2s" }} />
        <div className="floaty absolute right-1/3 top-1/2 h-20 w-20 rounded-full bg-amber-300/10" style={{ animationDelay: "4s" }} />

        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-32">
          <p className="fade-up text-lg font-medium text-amber-300" style={{ animationDelay: "0.1s" }}>
            {t("hello")}, {user?.name}
          </p>
          <h1 className="fade-up mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-6xl" style={{ animationDelay: "0.25s" }}>
            {t("heroA")} <span className="text-amber-300">{t("heroB")}</span>
          </h1>
          <p className="fade-up mt-5 max-w-xl text-red-100" style={{ animationDelay: "0.4s" }}>
            {t("heroSub")}
          </p>
          <div className="fade-up mt-9 flex flex-wrap gap-4" style={{ animationDelay: "0.55s" }}>
            <Link
              to="/products"
              className="shine glow group flex items-center gap-2 rounded-lg bg-amber-400 px-8 py-3 text-sm font-semibold text-red-950 transition hover:bg-amber-300"
            >
              {t("shopNow")} <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="fade-up mt-14 flex flex-wrap gap-12" style={{ animationDelay: "0.7s" }}>
            <div>
              <p className="text-3xl font-bold text-amber-300"><CountUp end={20} suffix="+" /></p>
              <p className="text-sm text-red-200">{t("statProducts")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-300"><CountUp end={4} /></p>
              <p className="text-sm text-red-200">{t("statCategories")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-300"><CountUp end={100} suffix="%" /></p>
              <p className="text-sm text-red-200">{t("statSecure")}</p>
            </div>
          </div>
        </div>
        <div className="gold-line" />
      </section>

      {/* Perks */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 100}>
              <div className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-white hover:shadow-md">
                <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t(title)}</p>
                  <p className="text-xs text-gray-400">{t(text)}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 pb-14">
        <Reveal>
          <h2 className="title-line mb-8 text-2xl font-semibold">{t("shopByCategory")}</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map(({ key, icon: Icon }, i) => (
            <Reveal key={key} delay={i * 100}>
              <Link
                to="/products"
                className="group flex flex-col items-center gap-3 rounded-xl border bg-white py-9 transition duration-300 hover:-translate-y-1.5 hover:bg-indigo-600 hover:shadow-xl"
              >
                <Icon size={32} className="text-indigo-600 transition duration-300 group-hover:rotate-12 group-hover:scale-125 group-hover:text-amber-300" />
                <span className="text-sm font-medium transition group-hover:text-white">{t(key)}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4">
        <Reveal>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="title-line text-2xl font-semibold">{t("featured")}</h2>
            <Link to="/products" className="nav-link text-sm font-medium text-indigo-600">
              {t("viewAll")}
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : products.map((p, i) => (
                <Reveal key={p._id} delay={(i % 4) * 100}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
        </div>
      </section>
    </div>
  );
}