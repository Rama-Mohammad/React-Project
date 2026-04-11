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
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Received Ratings</h2>
          <p className="text-xs text-slate-500">{totalReviews} reviews</p>
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
          className="w-40"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[0.75fr_1.25fr]">
        <div className="text-center md:text-left">
          <div className="text-5xl font-bold leading-none text-slate-900">{averageRating}</div>
          <div className="mt-2 flex justify-center md:justify-start">
            <RatingStars value={roundedAverage} />
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
                  <div className="flex w-14 items-center justify-end font-medium text-slate-600">{stars} stars</div>
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

