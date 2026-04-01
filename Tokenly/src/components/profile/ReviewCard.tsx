// src/components/profile/ReviewCard.tsx
import React from 'react';
import RatingStars from '../common/RatingStars';
import Badge from '../common/Badge';

interface ReviewCardProps {
  review: {
    id: string;
    reviewerName: string;
    date: string;
    rating: number;
    comment: string;
    skillCategory: string;
    sessionTopic: string;
  };
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-gray-900">{review.reviewerName}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <span>{review.date}</span>
            <span>•</span>
            <RatingStars rating={review.rating} size="sm" />
          </div>
        </div>
        <Badge variant="default">
          {review.skillCategory}
        </Badge>
      </div>
      <p className="text-gray-700 text-sm italic mb-2">“{review.comment}”</p>
      <p className="text-xs text-gray-400">Session: {review.sessionTopic}</p>
    </div>
  );
};

export default ReviewCard;