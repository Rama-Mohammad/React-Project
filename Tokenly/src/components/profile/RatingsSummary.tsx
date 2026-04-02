import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

interface RatingsSummaryProps {
  reviews: Array<{ rating: number }>;
}

const RatingsSummary: React.FC<RatingsSummaryProps> = ({ reviews }) => {
  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingDistribution[review.rating - 1]++;
    }
  });
  
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const totalReviews = reviews.length;

  // Helper function to render stars using Font Awesome
const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex gap-0.5 text-yellow-400">
      {[...Array(fullStars)].map((_, i) => (
        <FontAwesomeIcon key={`full-${i}`} icon={solidStar} />
      ))}

      {hasHalfStar && (
        <FontAwesomeIcon icon={faStarHalfAlt} />
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <FontAwesomeIcon key={`empty-${i}`} icon={regularStar} />
      ))}
    </div>
  );
};

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Received Ratings</h2>
        <span className="text-sm text-gray-500">{totalReviews} reviews</span>
      </div>

      <div className="flex items-start gap-8 mb-6">
        {/* Left side - Average rating */}
        <div className="text-center min-w-[120px]">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {averageRating}
          </div>
          <div className="flex justify-center mb-2">
            {renderStars(parseFloat(averageRating))}
          </div>
          <div className="text-sm text-gray-500">
            {totalReviews} {totalReviews === 1 ? 'rating' : 'ratings'}
          </div>
        </div>

        {/* Right side - Rating bars */}
        <div className="flex-1 space-y-2">
          {ratingDistribution.map((count, i) => {
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            const stars = 5 - i;
            return (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-gray-600">{stars}</span>
                  <FontAwesomeIcon icon={solidStar} className="text-xs text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-gray-500 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingsSummary;