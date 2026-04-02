import React, { useEffect, useRef, useState } from "react";
import { ArrowDownUp, ChevronDown, Star } from "lucide-react";

interface RatingsSummaryProps {
  reviews: Array<{ rating: number }>;
  embedded?: boolean;
  sortBy?: "newest" | "oldest" | "highest" | "lowest";
  onSortChange?: (value: "newest" | "oldest" | "highest" | "lowest") => void;
}

const sortLabels: Record<"newest" | "oldest" | "highest" | "lowest", string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  highest: "Highest rating",
  lowest: "Lowest rating",
};

const RatingsSummary: React.FC<RatingsSummaryProps> = ({
  reviews,
  embedded = false,
  sortBy = "newest",
  onSortChange,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingDistribution[review.rating - 1]++;
    }
  });

  const averageRating =
    reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : "0.0";

  const totalReviews = reviews.length;
  const roundedAverage = Number(averageRating);

  const content = (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Received Ratings</h2>
          <p className="text-xs text-slate-500">{totalReviews} reviews</p>
        </div>

        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsSortOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300"
          >
            <ArrowDownUp size={14} />
            {sortLabels[sortBy]}
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
          </button>

          {isSortOpen ? (
            <div className="absolute right-0 top-[calc(100%+0.35rem)] z-20 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
              {(["newest", "oldest", "highest", "lowest"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onSortChange?.(option);
                    setIsSortOpen(false);
                  }}
                  className={`block w-full px-3 py-2 text-left text-xs font-medium transition ${
                    sortBy === option
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {sortLabels[option]}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[0.75fr_1.25fr]">
        <div className="text-center md:text-left">
          <div className="text-5xl font-bold leading-none text-slate-900">{averageRating}</div>
          <div className="mt-2 flex justify-center gap-1 text-amber-400 md:justify-start">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={15} className={i < Math.round(roundedAverage) ? "fill-amber-400" : ""} />
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {totalReviews} {totalReviews === 1 ? "rating" : "ratings"}
          </p>
        </div>

        <div className="space-y-2 border-l border-slate-200/70 pl-4">
          {ratingDistribution
            .map((count, i) => ({ count, stars: 5 - i }))
            .map(({ count, stars }) => {
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-2 text-xs">
                  <div className="flex w-5 items-center justify-end font-medium text-slate-600">{stars}</div>
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200/90">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="w-5 text-right text-slate-500">{count}</span>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );

  if (embedded) {
    return content;
  }

  return <section>{content}</section>;
};

export default RatingsSummary;
