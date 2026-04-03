import type { RatingStarsProps } from "../../types/common";

export default function RatingStars({
  value,
  sizeClassName = "text-sm",
  wrapperClassName = "inline-flex items-center gap-0.5",
  filledClassName = "text-amber-400",
  emptyClassName = "text-slate-300",
}: RatingStarsProps) {
  const rounded = Math.round(value);
  return (
    <span className={wrapperClassName} aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`${sizeClassName} leading-none ${n <= rounded ? filledClassName : emptyClassName}`}
        >
          ★
        </span>
      ))}
    </span>
  );
}

