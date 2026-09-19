import { Link } from "react-router-dom";
import { ShieldAlert, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import StarRating from "./StarRating";

// Small badge color per category — no big image/icon tile, just a colored dot + label
const CATEGORY_COLOR = {
  Painkiller: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  Antibiotic: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  Antiseptic: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  Vitamin: "bg-accent-100 text-accent-700 dark:bg-amber-950 dark:text-accent-300",
  Diabetes: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  Cardiac: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  Skincare: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  Other: "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300",
};

const MedicineCard = ({ medicine }) => {
  const { addToCart } = useCart();
  const outOfStock = medicine.stock === 0;
  const badgeColor = CATEGORY_COLOR[medicine.category] || CATEGORY_COLOR.Other;

  const hasDiscount = medicine.mrp && medicine.mrp > medicine.price;
  const discountPct = hasDiscount
    ? Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100)
    : 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 ring-1 ring-transparent hover:ring-brand-200 dark:hover:ring-brand-700 transition-all duration-300 flex flex-col h-full">
      <div className="p-4 flex flex-col flex-1">
        {/* Top row: category badge + discount/Rx badges — fixed height row */}
        <div className="flex items-center justify-between mb-3 h-6">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
            {medicine.category}
          </span>
          <div className="flex items-center gap-1.5">
            {hasDiscount && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent-500 text-white">
                {discountPct}% OFF
              </span>
            )}
            {medicine.requiresPrescription && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 dark:bg-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-full">
                <ShieldAlert size={11} /> Rx
              </span>
            )}
          </div>
        </div>

        {/* Name — clamped to a single line so every card's title takes equal space */}
        <Link to={`/medicine/${medicine._id}`}>
          <h3 className="font-display font-semibold text-base text-ink dark:text-slate-100 leading-snug line-clamp-1 hover:text-brand-600 dark:hover:text-brand-400 transition">
            {medicine.name}
          </h3>
        </Link>
        <p className="text-sm text-ink/50 dark:text-slate-400 mb-1 line-clamp-1">{medicine.brand}</p>

        <StarRating value={medicine.avgRating || 0} count={medicine.numReviews || 0} size={13} />

        {/* Description — fixed 2-line height so it's identical across every card */}
        <p className="text-sm text-ink/70 dark:text-slate-400 mt-2 line-clamp-2 min-h-[2.5rem]">
          {medicine.description}
        </p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-brand-700 dark:text-brand-300">₹{medicine.price}</span>
            {hasDiscount && (
              <span className="text-xs text-ink/40 dark:text-slate-500 line-through">₹{medicine.mrp}</span>
            )}
          </div>
          <span className={`text-xs ${outOfStock ? "text-red-500" : "text-ink/50 dark:text-slate-400"}`}>
            {outOfStock ? "Out of stock" : `${medicine.stock} in stock`}
          </span>
        </div>

        <button
          disabled={outOfStock}
          onClick={() => addToCart(medicine)}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-brand-600 disabled:bg-gray-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-2 rounded-lg font-medium hover:bg-brand-700 active:scale-[0.98] transition"
        >
          <ShoppingCart size={16} />
          {outOfStock ? "Unavailable" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default MedicineCard;
