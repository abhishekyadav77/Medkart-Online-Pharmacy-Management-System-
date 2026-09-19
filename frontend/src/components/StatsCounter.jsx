import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, Package, Star, Truck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { icon: Users, value: 12000, suffix: "+", label: "Happy Customers" },
  { icon: Package, value: 500, suffix: "+", label: "Medicines Listed" },
  { icon: Star, value: 4.8, suffix: "/5", label: "Average Rating", decimal: true },
  { icon: Truck, value: 24, suffix: "hr", label: "Fastest Delivery" },
];

const StatsCounter = () => {
  const sectionRef = useRef(null);
  const numberRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      numberRefs.current.forEach((el, i) => {
        if (!el) return;
        const stat = STATS[i];
        const counter = { val: 0 };
        gsap.to(counter, {
          val: stat.value,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = stat.decimal ? counter.val.toFixed(1) : Math.floor(counter.val).toLocaleString("en-IN");
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="bg-brand-700 dark:bg-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="text-center">
              <Icon className="mx-auto mb-2 text-accent-400" size={26} />
              <p className="text-3xl font-bold font-display">
                <span ref={(el) => (numberRefs.current[i] = el)}>0</span>
                {stat.suffix}
              </p>
              <p className="text-sm text-white/70 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsCounter;
