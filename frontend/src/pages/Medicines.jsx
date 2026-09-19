import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from "../api/axios";
import MedicineCard from "../components/MedicineCard";
import StatsCounter from "../components/StatsCounter";
import WhyMedKart from "../components/WhyMedKart";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  "All",
  "Painkiller",
  "Antibiotic",
  "Antiseptic",
  "Vitamin",
  "Diabetes",
  "Cardiac",
  "Skincare",
  "Other",
];

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const heroRef = useRef(null);
  const chipsRef = useRef(null);
  const gridRef = useRef(null);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/medicines", {
        params: { search, category, page },
      });
      setMedicines(data.medicines);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchMedicines, 300); // debounce search
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, page]);

  // Hero entrance animation — runs once on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out", clearProps: "opacity,transform" } });
      tl.fromTo(".hero-heading", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo(".hero-sub", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.35")
        .fromTo(".hero-search", { y: 16, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.5 }, "-=0.3");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Category chip stagger — runs once. clearProps removes GSAP's inline styles once
  // the animation finishes, so nothing is left stuck at a low opacity (a known
  // gotcha when React StrictMode double-invokes effects in development).
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".category-chip",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.4,
          ease: "power2.out",
          delay: 0.2,
          clearProps: "opacity,transform",
        }
      );
    }, chipsRef);
    return () => ctx.revert();
  }, []);

  // Medicine card scroll-reveal — re-runs whenever the list changes
  useEffect(() => {
    if (loading || medicines.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".medicine-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 90%",
          },
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [loading, medicines]);

  return (
    <div>
      {/* Hero */}
      <div ref={heroRef} className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 dark:from-slate-900 dark:via-slate-800 dark:to-brand-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-14 text-center">
          <h1 className="hero-heading text-3xl sm:text-4xl font-bold mb-3">Your trusted online pharmacy</h1>
          <p className="hero-sub text-white/80 max-w-xl mx-auto">
            Order genuine medicines and healthcare essentials, delivered to your doorstep in 2–3 days.
          </p>

          <div className="hero-search relative max-w-xl mx-auto mt-7">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
            <input
              type="text"
              placeholder="Search medicines by name or brand..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-11 pr-4 py-3 rounded-full text-ink focus:outline-none focus:ring-4 focus:ring-accent-400/40 shadow-lg"
            />
          </div>
        </div>
      </div>

      <StatsCounter />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Category chips */}
        <div ref={chipsRef} className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
              className={`category-chip px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                category === c
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {!loading && total > 0 && (
          <p className="text-sm text-ink/50 dark:text-slate-400 mb-4">{total} medicine{total !== 1 ? "s" : ""} found</p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton rounded-xl h-72" />
            ))}
          </div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-ink/60 dark:text-slate-300 font-medium mb-1">No medicines found</p>
            <p className="text-sm text-ink/40 dark:text-slate-500">Try a different search term or category.</p>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {medicines.map((m) => (
              <div key={m._id} className="medicine-card">
                <MedicineCard medicine={m} />
              </div>
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg ${
                  p === page ? "bg-brand-600 text-white" : "bg-white dark:bg-slate-800 text-ink/70 dark:text-slate-300"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <WhyMedKart />
      <HowItWorks />
      <Testimonials />
      <FAQ />
    </div>
  );
};

export default Medicines;
