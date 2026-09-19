import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Ritika Sharma",
    role: "Verified Buyer",
    text: "Ordering my monthly medicines used to be a hassle. MedKart delivers in 2 days and the prices are genuinely lower than my local pharmacy.",
  },
  {
    name: "Aman Verma",
    role: "Verified Buyer",
    text: "The prescription upload made getting my antibiotics so much easier — no need to visit the shop with a physical slip.",
  },
  {
    name: "Priya Nair",
    role: "Verified Buyer",
    text: "Clean interface, easy tracking, and I always know exactly where my order is. Highly recommend for regular medicine orders.",
  },
];

const Testimonials = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <span className="text-accent-600 dark:text-accent-400 font-semibold text-sm">Testimonials</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-ink dark:text-slate-100 mt-1">What our customers say</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 relative"
          >
            <Quote className="text-brand-100 dark:text-slate-700 absolute top-4 right-4" size={32} />
            <p className="text-sm text-ink/70 dark:text-slate-300 leading-relaxed relative z-10">"{t.text}"</p>
            <div className="flex items-center gap-3 mt-5">
              <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-slate-700 text-brand-700 dark:text-brand-300 flex items-center justify-center font-semibold text-sm">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink dark:text-slate-100">{t.name}</p>
                <p className="text-xs text-ink/50 dark:text-slate-400">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
