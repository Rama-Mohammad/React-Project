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
    <article className="rounded-2xl border border-[#e4e9f5] bg-white/78 p-4 shadow-[0_12px_30px_-28px_rgba(79,70,229,0.28)] transition-all duration-200 hover:border-indigo-100 hover:bg-white hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Avatar
            name={review.reviewerName}
            imageUrl={review.reviewerImageUrl}
            className="mt-0.5 h-9 w-9 rounded-xl"
            imageClassName="rounded-xl"
            fallbackClassName="bg-gradient-to-br from-indigo-500 to-sky-500 text-xs font-bold text-white"
          />

          <div>
            <h3 className="text-sm font-semibold text-slate-950">{review.reviewerName}</h3>
            <div className="mt-1 flex items-center gap-1 text-amber-400">
              <RatingStars value={review.rating} />
              <span className="ml-2 text-xs text-slate-400">{review.sessionTopic}</span>
            </div>
          </div>
        </div>

        <span className="text-xs text-slate-400">{formattedDate}</span>
      </div>

      <p className="text-sm leading-7 text-slate-600">{review.comment}</p>

      <span className="mt-3 inline-flex rounded-full bg-slate-100/80 px-2.5 py-1 text-xs text-slate-500 ring-1 ring-slate-200/70">
        {review.skillCategory}
      </span>
    </article>
  );
};

export default ReviewCard;


