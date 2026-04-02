import React from 'react';
import Badge from '../common/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

interface SkillCardProps {
  skill: {
    id: string;
    name: string;
    category: string;
    level: 'Expert' | 'Advanced' | 'Intermediate';
    sessions: number;
  };
  onDelete?: (id: string) => void;
  onEdit?: (skill: any) => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onDelete, onEdit }) => {

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'bg-purple-100 text-purple-700';
      case 'Advanced':
        return 'bg-blue-100 text-blue-700';
      case 'Intermediate':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Example max sessions (you can adjust later)
  const maxSessions = 10;
  const progress = Math.min((skill.sessions / maxSessions) * 100, 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
          <span className="text-2xl">⚛️</span>
        </div>

        {/* Level pill */}
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${getLevelColor(skill.level)}`}>
          {skill.level}
        </span>
      </div>

      {/* Skill name */}
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        {skill.name}
      </h3>

      {/* Category pill */}
      <div className="mb-4">
        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
          {skill.category}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Sessions</span>
          <span>{skill.sessions} / {maxSessions}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex justify-end gap-3 mt-2">
        <button
          onClick={() => onEdit?.(skill)}
          className="text-gray-400 hover:text-blue-500 transition-colors"
          aria-label="Edit skill"
        >
          <FontAwesomeIcon icon={faPen} />
        </button>

        <button
          onClick={() => {
            if (onDelete && confirm("Are you sure you want to delete this skill?")) {
              onDelete(skill.id);
            }
          }}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete skill"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

    </div>
  );
};

export default SkillCard;