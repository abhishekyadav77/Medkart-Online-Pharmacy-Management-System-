import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "Do I need to upload a prescription?", a: "Only for medicines marked 'Rx'. Uploading it during checkout is optional, but our pharmacist may reach out to verify it before your order ships." },
  { q: "How long does delivery take?", a: "Most orders are delivered within 2–3 days depending on your location. You can track live status from the Orders page." },
  { q: "What payment methods are supported?", a: "We currently support Cash on Delivery (COD) and Online Payment at checkout." },
  { q: "Can I return a medicine?", a: "Due to safety regulations, medicines generally cannot be returned once delivered. Contact support for damaged or incorrect items." },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <span className="text-accent-600 dark:text-accent-400 font-semibold text-sm">FAQ</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-ink dark:text-slate-100 mt-1">Frequently asked questions</h2>
      </div>

      <div className="space-y-3">
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.q} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-medium text-ink dark:text-slate-100 text-sm">{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-brand-600 dark:text-brand-300 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className="grid transition-all duration-300 ease-in-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm text-ink/60 dark:text-slate-400 leading-relaxed">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
