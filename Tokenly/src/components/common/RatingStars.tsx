import type { RatingStarsProps } from "../../types/common";

export default function RatingStars({ value }: RatingStarsProps) {
  const rounded = Math.round(value);
  return (
    <span className='stars' aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n}>{n <= rounded ? '?' : '?'}</span>
      ))}
    </span>
  );
}

