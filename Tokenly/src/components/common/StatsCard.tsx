import React from 'react';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, trend }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-2">
        {icon && <span className="text-2xl">{icon}</span>}
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {trend && (
        <p className={`text-xs mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
        </p>
      )}
    </div>
  );
};

export default StatsCard;