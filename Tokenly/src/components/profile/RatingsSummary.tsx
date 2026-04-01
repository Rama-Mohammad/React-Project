// src/components/profile/RatingsSummary.tsx
import React from 'react';
import RatingStars from '../common/RatingStars';

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
    : '0';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Received Ratings</h2>
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
        <div className="flex justify-center mt-1">
          <RatingStars rating={parseFloat(averageRating)} size="lg" />
        </div>
        <div className="text-sm text-gray-500 mt-1">{reviews.length} ratings</div>
      </div>
      <div className="space-y-2">
        {ratingDistribution.map((count, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="w-8 text-gray-600">{i + 1}★</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-400 rounded-full"
                style={{ width: `${(count / reviews.length) * 100}%` }}
              />
            </div>
            <span className="w-8 text-gray-500">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingsSummary;