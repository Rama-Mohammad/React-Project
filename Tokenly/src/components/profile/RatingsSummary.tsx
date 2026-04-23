import React from "react";
import { ArrowDownUp } from "lucide-react";
import ThemedSelect from "../common/ThemedSelect";
import RatingStars from "../common/RatingStars";
import type { RatingsSummaryProps, ReviewSortBy } from "../../types/profile";

const sortLabels: Record<ReviewSortBy, string> = {
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
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-950">Received Ratings</h2>
          <p className="mt-0.5 text-xs text-slate-400">{totalReviews} reviews</p>
        </div>

        <ThemedSelect
          value={sortBy}
          onChange={(value) => onSortChange?.(value)}
          options={(["newest", "oldest", "highest", "lowest"] as const).map((option) => ({
            value: option,
            label: sortLabels[option],
          }))}
          ariaLabel="Ratings sort"
          icon={<ArrowDownUp size={14} />}
          size="sm"
          align="right"
          className="w-40 rounded-xl border-slate-200 bg-white/90 shadow-[0_12px_28px_-24px_rgba(79,70,229,0.45)]"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-2xl border border-indigo-100/70 bg-indigo-50/30 p-4 text-center md:text-left">
          <div className="text-5xl font-bold leading-none tracking-tight text-slate-950">{averageRating}</div>
          <div className="mt-2 flex justify-center md:justify-start">
            <RatingStars value={roundedAverage} />
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            {totalReviews} {totalReviews === 1 ? "rating" : "ratings"}
          </p>
        </div>

        <div className="space-y-2.5 border-l border-slate-200/60 pl-4">
          {[5, 4, 3, 2, 1]
            .map((stars) => ({ count: ratingDistribution[stars - 1], stars }))
            .map(({ count, stars }) => {
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-2 text-xs">
                  <div className="flex w-14 items-center justify-end font-medium text-slate-500">
                    {stars} {stars === 1 ? "star" : "stars"}
                  </div>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/60">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-400" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="w-5 text-right text-slate-400">{count}</span>
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


