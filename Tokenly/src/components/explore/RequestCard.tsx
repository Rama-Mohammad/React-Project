import React from 'react';
import { Request } from '../../../types';
import Badge from '../common/Badge';
import Avatar from '../common/Avatar';
import RatingStars from '../common/RatingStars';
import { formatDistanceToNow } from '../../../utils/dateHelpers';

interface RequestCardProps {
  request: Request;
  onClick: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onClick }) => {
  const urgencyColors = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={request.urgency.toLowerCase() as any}>
              {request.urgency} urgency
            </Badge>
            <span className="text-xs text-gray-500">{request.category}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {request.title}
          </h3>
        </div>
        <Badge variant="default" className="ml-2">
          {request.duration} min
        </Badge>
      </div>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {request.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {request.skill.split(',').map((skill, idx) => (
          <span
            key={idx}
            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
          >
            {skill.trim()}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Avatar src={request.requester.avatar} name={request.requester.name} size="sm" />
          <span className="text-sm font-medium text-gray-700">
            {request.requester.name}
          </span>
          <RatingStars rating={request.requester.rating} size="small" />
        </div>
        <div className="text-xs text-gray-500">
          {request.offerCount} {request.offerCount === 1 ? 'offer' : 'offers'} •{' '}
          {formatDistanceToNow(request.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;