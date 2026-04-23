import React from "react";
import RatingStars from "../common/RatingStars";
import Avatar from "../common/Avatar";
import type { ReviewCardProps } from "../../types/profile";

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const date = new Date(review.date);
  const formattedDate = Number.isNaN(date.getTime())
    ? review.date
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

  return (
    <article className="border-b border-slate-200/70 pb-4 last:border-b-0">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Avatar
            name={review.reviewerName}
            imageUrl={review.reviewerImageUrl}
            className="mt-0.5 h-9 w-9 rounded-lg"
            imageClassName="rounded-lg"
            fallbackClassName="bg-gradient-to-br from-indigo-500 to-sky-500 text-xs font-bold text-white"
          />

          <div>
            <h3 className="text-sm font-semibold text-slate-900">{review.reviewerName}</h3>
            <div className="mt-1 flex items-center gap-1 text-amber-400">
              <RatingStars value={review.rating} />
              <span className="ml-2 text-xs text-slate-500">{review.sessionTopic}</span>
            </div>
          </div>
        </div>

        <span className="text-xs text-slate-400">{formattedDate}</span>
      </div>

      <p className="text-sm leading-7 text-slate-700">{review.comment}</p>

      <span className="mt-3 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
        {review.skillCategory}
      </span>
    </article>
  );
};

export default ReviewCard;


