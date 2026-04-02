// components/session/list/SessionFilters.tsx
import React from 'react';

interface SessionFiltersProps {
  activeFilter: 'upcoming' | 'active' | 'completed' | 'all';
  onFilterChange: (filter: 'upcoming' | 'active' | 'completed' | 'all') => void;
  counts: {
    upcoming: number;
    active: number;
    completed: number;
  };
}

const SessionFilters: React.FC<SessionFiltersProps> = ({ activeFilter, onFilterChange, counts }) => {
  const filters = [
    { key: 'all' as const, label: 'All Sessions', count: counts.upcoming + counts.active + counts.completed },
    { key: 'upcoming' as const, label: 'Upcoming', count: counts.upcoming },
    { key: 'active' as const, label: 'Active', count: counts.active },
    { key: 'completed' as const, label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="flex gap-2 border-b border-gray-200 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            activeFilter === filter.key
              ? 'text-emerald-600 border-b-2 border-emerald-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {filter.label}
          <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default SessionFilters;