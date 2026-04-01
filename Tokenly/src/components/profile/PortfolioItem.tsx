// src/components/profile/PortfolioItem.tsx
import React from 'react';
import Badge from '../common/Badge';

interface PortfolioItemProps {
  item: {
    id: string;
    type: 'Project' | 'Article' | 'Contribution';
    title: string;
    date: string;
    description: string;
    tags: string[];
  };
  onView?: (id: string) => void;
}

const PortfolioItem: React.FC<PortfolioItemProps> = ({ item, onView }) => {
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Project': return '📁';
      case 'Article': return '📝';
      case 'Contribution': return '🤝';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Project': return 'text-blue-600';
      case 'Article': return 'text-green-600';
      case 'Contribution': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{getTypeIcon(item.type)}</span>
        <div className="flex-1">
          <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <span className={`text-xs font-medium ${getTypeColor(item.type)}`}>
                {item.type}
              </span>
            </div>
            <span className="text-sm text-gray-400">{item.date}</span>
          </div>
          <p className="text-gray-600 text-sm mb-3">{item.description}</p>
          <div className="flex flex-wrap gap-2">
            {item.tags.map(tag => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
          {onView && (
            <button 
              onClick={() => onView(item.id)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View Details →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioItem;