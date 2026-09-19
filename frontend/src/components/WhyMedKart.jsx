import { ShieldCheck, Truck, BadgeIndianRupee, HeadphonesIcon } from "lucide-react";

const REASONS = [
  { icon: ShieldCheck, title: "100% Genuine Medicines", desc: "Sourced directly from licensed manufacturers and verified suppliers." },
  { icon: Truck, title: "Fast, Reliable Delivery", desc: "Most orders reach you within 2–3 days, tracked every step of the way." },
  { icon: BadgeIndianRupee, title: "Transparent Pricing", desc: "No hidden fees — the price you see at checkout is what you pay." },
  { icon: HeadphonesIcon, title: "Pharmacist Support", desc: "Our team verifies prescriptions and is available for any questions." },
];

const WhyMedKart = () => {
  return (
    <div className="bg-white dark:bg-slate-800/50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-accent-600 dark:text-accent-400 font-semibold text-sm">Why MedKart</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink dark:text-slate-100 mt-1">Healthcare you can trust</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REASONS.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.title} className="text-center px-2">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-slate-700 text-brand-600 dark:text-brand-300 flex items-center justify-center mx-auto mb-4">
                  <Icon size={26} />
                </div>
                <h3 className="font-semibold text-ink dark:text-slate-100 mb-1">{r.title}</h3>
                <p className="text-sm text-ink/60 dark:text-slate-400 leading-relaxed">{r.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WhyMedKart;
