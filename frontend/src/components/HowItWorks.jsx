import { Search, ShoppingCart, FileCheck, PackageCheck } from "lucide-react";

const STEPS = [
  { icon: Search, title: "Search & Browse", desc: "Find medicines by name, brand, or category." },
  { icon: ShoppingCart, title: "Add to Cart", desc: "Pick quantities and review your order." },
  { icon: FileCheck, title: "Checkout", desc: "Share address and, if needed, your prescription." },
  { icon: PackageCheck, title: "Track & Receive", desc: "Follow your order status until it's delivered." },
];

const HowItWorks = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <span className="text-accent-600 dark:text-accent-400 font-semibold text-sm">How It Works</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-ink dark:text-slate-100 mt-1">Ordering in four simple steps</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="relative text-center">
              <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center mx-auto mb-4 relative z-10 font-bold text-lg">
                {i + 1}
              </div>
              <Icon className="mx-auto mb-2 text-brand-500 dark:text-brand-300" size={22} />
              <h3 className="font-semibold text-ink dark:text-slate-100 mb-1">{step.title}</h3>
              <p className="text-sm text-ink/60 dark:text-slate-400">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HowItWorks;
