import React, { useState } from 'react';
import Badge from '../common/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolder,
  faFileAlt,
  faHandsHelping
} from '@fortawesome/free-solid-svg-icons';

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

const PortfolioItem: React.FC<PortfolioItemProps> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Project':
        return faFolder;
      case 'Article':
        return faFileAlt;
      case 'Contribution':
        return faHandsHelping;
      default:
        return faFileAlt;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Project':
        return 'bg-blue-100 text-blue-700';
      case 'Article':
        return 'bg-green-100 text-green-700';
      case 'Contribution':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const shortDescription =
    item.description.length > 120
      ? item.description.slice(0, 120) + '...'
      : item.description;

  return (
    <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
      <div className="flex items-start gap-3">
        
        {/* ICON */}
        <FontAwesomeIcon
          icon={getTypeIcon(item.type)}
          className="text-xl text-gray-500 mt-1"
        />

        <div className="flex-1">
          
          {/* HEADER */}
          <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h3>

              {/* TYPE BADGE */}
              <span
                className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                  item.type
                )}`}
              >
                {item.type}
              </span>
            </div>

            <span className="text-sm text-gray-400">{item.date}</span>
          </div>

         {/* DESCRIPTION */}
<p className="text-gray-600 text-sm">
  {expanded ? item.description : shortDescription}
</p>

{/* TAGS */}
<div className="flex flex-wrap gap-2 mt-3">
  {(expanded ? item.tags : item.tags.slice(0, 3)).map(tag => (
    <span
      key={tag}
      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
    >
      {tag}
    </span>
  ))}

  {!expanded && item.tags.length > 3 && (
    <span className="text-xs text-gray-400 px-2 py-1">
      +{item.tags.length - 3} more
    </span>
  )}
</div>

{/* SHOW MORE / LESS */}
{(item.description.length > 120 || item.tags.length > 3) && (
  <button
    onClick={() => setExpanded(!expanded)}
    className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
  >
    {expanded ? 'Show Less ↑' : 'Show More ↓'}
  </button>
)}

        </div>
      </div>
    </div>
  );
};

export default PortfolioItem;