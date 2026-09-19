import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ShieldAlert, ChevronLeft, ShoppingCart } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";

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

const MedicineDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [medicine, setMedicine] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: med }, { data: revs }] = await Promise.all([
        api.get(`/medicines/${id}`),
        api.get(`/medicines/${id}/reviews`),
      ]);
      setMedicine(med);
      setReviews(revs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to leave a review");
    if (newRating === 0) return toast.error("Please select a star rating");

    setSubmitting(true);
    try {
      await api.post(`/medicines/${id}/reviews`, { rating: newRating, comment: newComment });
      toast.success("Thanks for your review!");
      setNewRating(0);
      setNewComment("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center py-16 text-ink/50 dark:text-slate-400">Loading...</p>;
  if (!medicine) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-ink dark:text-slate-100 mb-2">Medicine not found</h2>
        <Link to="/" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Back to Medicines</Link>
      </div>
    );
  }

  const badgeColor = CATEGORY_COLOR[medicine.category] || CATEGORY_COLOR.Other;
  const hasDiscount = medicine.mrp && medicine.mrp > medicine.price;
  const discountPct = hasDiscount ? Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-ink/60 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 mb-6">
        <ChevronLeft size={16} /> Back to Medicines
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>{medicine.category}</span>
          {hasDiscount && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-accent-500 text-white">{discountPct}% OFF</span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-ink dark:text-slate-100">{medicine.name}</h1>
        <p className="text-ink/50 dark:text-slate-400 mb-2">
          {medicine.brand} {medicine.manufacturer && `· ${medicine.manufacturer}`}
        </p>
        <StarRating value={medicine.avgRating || 0} count={medicine.numReviews || 0} size={16} />

        {medicine.requiresPrescription && (
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 text-sm font-medium px-3 py-2 rounded-lg mt-3">
            <ShieldAlert size={16} /> Requires a valid prescription at checkout
          </div>
        )}

        <p className="text-ink/70 dark:text-slate-300 mt-4 leading-relaxed">
          {medicine.description || "No description available."}
        </p>

        <div className="flex items-baseline gap-3 mt-5">
          <span className="text-2xl font-bold text-brand-700 dark:text-brand-300">₹{medicine.price}</span>
          {hasDiscount && <span className="text-base text-ink/40 dark:text-slate-500 line-through">₹{medicine.mrp}</span>}
        </div>
        <p className={`text-sm mt-1 ${medicine.stock === 0 ? "text-red-500" : "text-ink/50 dark:text-slate-400"}`}>
          {medicine.stock === 0 ? "Out of stock" : `${medicine.stock} units in stock`}
        </p>

        <button
          disabled={medicine.stock === 0}
          onClick={() => addToCart(medicine)}
          className="mt-5 w-full sm:w-auto px-8 flex items-center justify-center gap-2 bg-brand-600 disabled:bg-gray-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 transition"
        >
          <ShoppingCart size={16} />
          {medicine.stock === 0 ? "Unavailable" : "Add to Cart"}
        </button>
      </div>

      {/* Reviews */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 mt-6">
        <h2 className="font-display font-semibold text-lg text-ink dark:text-slate-100 mb-4">
          Customer Reviews {medicine.numReviews > 0 && `(${medicine.numReviews})`}
        </h2>

        <form onSubmit={handleSubmitReview} className="border-b dark:border-slate-700 pb-6 mb-6">
          <p className="text-sm font-medium text-ink/70 dark:text-slate-300 mb-2">Rate this product</p>
          <StarRating value={newRating} onChange={setNewRating} size={22} />
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your experience with this medicine (optional)"
            rows={3}
            className="w-full mt-3 px-3 py-2 border dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 bg-brand-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        {reviews.length === 0 ? (
          <p className="text-sm text-ink/50 dark:text-slate-400">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-5">
            {reviews.map((r) => (
              <div key={r._id} className="border-b dark:border-slate-700 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-ink dark:text-slate-100 text-sm">{r.userName}</p>
                  <span className="text-xs text-ink/40 dark:text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <StarRating value={r.rating} size={13} />
                {r.comment && <p className="text-sm text-ink/70 dark:text-slate-300 mt-1">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineDetail;
