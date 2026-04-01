import React from 'react';
import Badge from '../common/Badge';

interface SkillCardProps {
  skill: {
    id: string;
    name: string;
    category: string;
    level: 'Expert' | 'Advanced' | 'Intermediate';
    sessions: number;
  };
  onDelete?: (id: string) => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onDelete }) => {
  const getLevelVariant = (level: string) => {
    switch(level) {
      case 'Expert': return 'info';
      case 'Advanced': return 'primary';
      case 'Intermediate': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:shadow-sm transition-shadow">
      <div>
        <p className="font-semibold text-gray-900">{skill.name}</p>
        <p className="text-sm text-gray-500">{skill.category}</p>
      </div>
      <div className="text-right">
        <Badge variant={getLevelVariant(skill.level)}>
          {skill.level}
        </Badge>
        <p className="text-xs text-gray-400 mt-1">{skill.sessions} sessions</p>
      </div>
    </div>
  );
};

export default SkillCard;