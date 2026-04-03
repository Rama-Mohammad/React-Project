import React from 'react';
import type { Session } from '../../../types/session';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faClock,
  faExclamationCircle,
  faPen,
  faLightbulb
} from '@fortawesome/free-solid-svg-icons';

interface SessionListItemProps {
  session: Session;
  onJoin?: (sessionId: string) => void;
  onCancel?: (sessionId: string) => void;
  onReview?: (sessionId: string) => void;
  onViewRequest?: (sessionId: string) => void;
  onMarkComplete?: (sessionId: string) => void;
}

const SessionListItem: React.FC<SessionListItemProps> = ({
  session,
  onJoin,
  onReview,
  onViewRequest,
  onMarkComplete
}) => {

  const getStatusBadge = () => {
    switch (session.status) {
      case 'upcoming':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Upcoming</span>;
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full animate-pulse">Active Now</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Completed</span>;
    }
  };

  const getRoleBadge = () => {
    if (session.role === 'helping') {
      return (
        <div className="flex items-center gap-2">
          <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <FontAwesomeIcon icon={faPen} />
            Helping
          </div>
          <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
            +{session.credits}
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <FontAwesomeIcon icon={faLightbulb} />
            Receiving Help
          </div>
          <div className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
            {session.credits}
          </div>
        </div>
      );
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow mb-4">

      <div className="flex justify-between items-start mb-3">

        <div className="flex items-center gap-2">
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
            {session.category}
          </span>
          {getStatusBadge()}
        </div>

        {getRoleBadge()}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        {session.title}
      </h3>

      <p className="text-sm text-gray-600 mb-3">
        {session.role === 'helping' ? 'Helping' : 'Getting help from'}{' '}
        <span className="font-medium text-gray-900">
          {session.otherParticipant.name}
        </span>
      </p>

      <div className="text-sm text-gray-500 mb-3 space-y-1">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarAlt} />
          {formatDate(session.datetime)}
        </div>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faClock} />
          {formatTime(session.datetime)} • {session.duration} min
        </div>
      </div>

      {session.status === 'upcoming' && (
        <div className="flex items-center gap-2 text-xs text-yellow-600">
          <FontAwesomeIcon icon={faExclamationCircle} />
          Scheduled for {formatDate(session.datetime)} at {formatTime(session.datetime)}
        </div>
      )}

      <div className="flex gap-3 mt-4 pt-2">
        {session.status === 'upcoming' && (
          <>
            <button
              onClick={() => onViewRequest?.(session.id)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
            >
              View Request
            </button>
            <button
              onClick={() => onMarkComplete?.(session.id)}
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700"
            >
              Mark Complete
            </button>
          </>
        )}

        {session.status === 'active' && (
          <button
            onClick={() => onJoin?.(session.id)}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 animate-pulse"
          >
            Resume Session
          </button>
        )}

        {session.status === 'completed' && (
          <button
            onClick={() => onReview?.(session.id)}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
          >
            View Summary
          </button>
        )}
      </div>

    </div>
  );
};

export default SessionListItem;
