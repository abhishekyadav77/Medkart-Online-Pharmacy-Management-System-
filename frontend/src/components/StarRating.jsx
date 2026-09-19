import { Star } from "lucide-react";

/**
 * Displays a row of stars for a rating value.
 * If `onChange` is passed, stars become interactive (for review forms).
 */
const StarRating = ({ value = 0, size = 16, onChange, count }) => {
  const stars = [1, 2, 3, 4, 5];
  const interactive = typeof onChange === "function";

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {stars.map((s) => (
          <button
            key={s}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange(s)}
            className={interactive ? "cursor-pointer" : "cursor-default"}
          >
            <Star
              size={size}
              fill={s <= Math.round(value) ? "#EC9522" : "none"}
              stroke={s <= Math.round(value) ? "#EC9522" : "#C7C7C7"}
            />
          </button>
        ))}
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-ink/50 dark:text-slate-400">
          {value > 0 ? value.toFixed(1) : "New"} {count > 0 && `(${count})`}
        </span>
      )}
    </div>
  );
};

export default StarRating;
