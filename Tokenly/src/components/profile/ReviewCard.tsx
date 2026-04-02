import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

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
 const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);

  return (
    <div className="flex gap-0.5 text-yellow-400 text-sm">
      {[...Array(fullStars)].map((_, i) => (
        <FontAwesomeIcon key={i} icon={faStar} />
      ))}
    </div>
  );
};

  // Format date to look like "Mar 28, 2026"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
      {/* First row: Name on left, Date on right */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 text-base">
          {review.reviewerName}
        </h3>
        <span className="text-xs text-gray-400">
          {formatDate(review.date)}
        </span>
      </div>

      {/* Second row: Stars and session topic */}
      <div className="flex items-center gap-2 mb-3">
        {renderStars(review.rating)}
        <span className="text-xs text-gray-400">·</span>
        <div className="bg-gray-50 rounded-lg px-2 py-0.5">
          <span className="text-xs text-gray-500">
            Session: {review.sessionTopic}
          </span>
        </div>
      </div>

      {/* Comment with quotes */}
      <p className="text-gray-700 text-sm mb-2 leading-relaxed">
        “{review.comment}”
      </p>

      {/* Skill category badge */}
      <div className="bg-gray-100 rounded-full inline-block px-3 py-1">
        <span className="text-xs font-medium text-gray-700">{review.skillCategory}</span>
      </div>
    </div>
  );
};

export default ReviewCard;