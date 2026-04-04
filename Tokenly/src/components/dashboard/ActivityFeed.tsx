import React from 'react';
import { formatDistanceToNow } from '../../utils/dateHelpers';
import type { ActivityFeedProps } from '../../types/dashboard';

const ActivityFeed: React.FC<ActivityFeedProps> = ({ transactions, onViewAll }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {transactions.slice(0, 5).map((transaction) => (
          <div key={transaction.id} className="px-6 py-4 flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{transaction.description}</p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(transaction.createdAt)}
              </p>
            </div>
            <div
              className={`font-semibold ${
                transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {transaction.type === 'earned' ? '+' : '-'}
              {Math.abs(transaction.amount)} credits
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-3 bg-gray-50 rounded-b-xl">
        <button
          onClick={onViewAll}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View all activity →
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;

