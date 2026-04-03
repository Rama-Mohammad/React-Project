import React from 'react';
import { format } from '../../utils/dateHelpers';
import Button from '../common/Button';
import type { MiniSessionCardProps } from '../../types/dashboard';

const MiniSessionCard: React.FC<MiniSessionCardProps> = ({ sessions, onJoinSession }) => {
  const upcomingSessions = sessions.filter(s => s.status === 'scheduled');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h2>
      </div>
      <div className="p-6">
        {upcomingSessions.length > 0 ? (
          <div className="space-y-4">
            {upcomingSessions.slice(0, 3).map((session) => (
              <div key={session.id} className="pb-3 border-b border-gray-100 last:border-0">
                <p className="font-medium text-gray-900">Session #{session.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {format(session.scheduledTime, 'PPP')} at{' '}
                  {format(session.scheduledTime, 'p')}
                </p>
                <Button
                  onClick={() => onJoinSession(session.id)}
                  className="mt-2"
                >
                  Join Session
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">
            No upcoming sessions scheduled
          </p>
        )}
        <Button
          variant="primary"
          className="w-full mt-4"
          onClick={() => (window.location.href = '/create-request')}
        >
          + Create New Request
        </Button>
      </div>
    </div>
  );
};

export default MiniSessionCard;

