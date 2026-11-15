import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ className = "" }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className={`group mb-4 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 ${className}`}
    >
      <ArrowLeft size={16} className="transition group-hover:-translate-x-1" /> Back
    </button>
  );
}