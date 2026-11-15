import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="gold-line mt-20 bg-[#2b1010] text-red-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="mb-3 text-2xl font-extrabold tracking-tight text-white">
            Zentro<span className="text-amber-400">.</span>
          </p>
          <p className="text-sm text-red-200/70">
            Shop smart. Quality products, fast delivery and easy returns.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Shop</h3>
          <ul className="space-y-2 text-sm text-red-200/80">
            <li><Link to="/products" className="hover:text-white">All Products</Link></li>
            <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
            <li><Link to="/orders" className="hover:text-white">My Orders</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Help</h3>
          <ul className="space-y-2 text-sm text-red-200/80">
            <li>Shipping Policy</li>
            <li>Returns & Refunds</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Contact</h3>
          <ul className="space-y-2 text-sm text-red-200/80">
            <li className="flex items-center gap-2"><Mail size={15} /> support@zentro.com</li>
            <li className="flex items-center gap-2"><Phone size={15} /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><MapPin size={15} /> Chennai, Tamil Nadu</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-red-950 py-4 text-center text-xs text-red-300/60">
        © {new Date().getFullYear()} Zentro. All rights reserved. Made with ❤️ in Tamil Nadu
      </div>
    </footer>
  );
}