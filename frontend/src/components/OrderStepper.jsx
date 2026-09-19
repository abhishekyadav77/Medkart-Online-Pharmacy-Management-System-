import { CheckCircle2, Circle, XCircle } from "lucide-react";

const STEPS = ["Pending", "Confirmed", "Shipped", "Delivered"];

/**
 * Horizontal progress stepper for an order's status.
 * Falls back to a single red "Cancelled" state when status === "Cancelled".
 */
const OrderStepper = ({ status }) => {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
        <XCircle size={18} />
        Order Cancelled
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              {done ? (
                <CheckCircle2 size={20} className="text-brand-600 dark:text-brand-400" />
              ) : (
                <Circle size={20} className="text-ink/20 dark:text-slate-600" />
              )}
              <span className={`text-[11px] whitespace-nowrap ${done ? "text-brand-700 dark:text-brand-400 font-medium" : "text-ink/40 dark:text-slate-500"}`}>
                {step}
              </span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < currentIndex ? "bg-brand-500" : "bg-ink/10 dark:bg-slate-700"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderStepper;
