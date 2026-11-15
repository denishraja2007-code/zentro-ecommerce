import { useEffect, useState } from "react";
import { Tag, Clock } from "lucide-react";
import api from "../api/axios";

export default function OfferStrip() {
  const [offers, setOffers] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    api.get("/offers").then((r) => setOffers(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (offers.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % offers.length), 4000);
    return () => clearInterval(timer);
  }, [offers]);

  if (offers.length === 0) return null;
  const o = offers[index % offers.length];

  return (
    <div className="bg-amber-400 text-red-950">
      <div
        key={o._id}
        className="fade-up mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-sm font-medium"
      >
        <span className="flex items-center gap-1.5 font-bold">
          <Tag size={15} /> {o.title}
        </span>
        {o.description && <span>· {o.description}</span>}
        {o.code && (
          <span className="rounded bg-red-950 px-2 py-0.5 text-xs font-bold tracking-wider text-amber-300">
            Code: {o.code}
          </span>
        )}
        {o.expiresAt && (
          <span className="flex items-center gap-1 text-xs">
            <Clock size={13} /> Valid till{" "}
            {new Date(o.expiresAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  );
}