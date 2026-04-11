import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faClock,
  faExclamationCircle,
  faPen,
  faLightbulb,
  faCircleCheck,
  faArrowRight,
  faUser,
  faClock as faClockIcon,
  faCheckCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import type { SessionListItemProps } from '../../../types/session';

const SessionListItem: React.FC<SessionListItemProps> = ({
  session,
  onJoin,
  onReview,
  onViewRequest,
  onMarkComplete,
}) => {
  const navigate = useNavigate(); 
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusBadge = () => {
    switch (session.status) {
      case 'upcoming':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            Upcoming
          </span>
        );
      case 'active':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full animate-pulse">
            Active Now
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            Completed
          </span>
        );
      default:
        return null;
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

  const handleMarkCompleteClick = () => {
    setShowConfirmModal(true);
  };

const handleViewRequestClick = () => {
  navigate(`/requests/${session.id}`);
};

const handleConfirm = async () => {
  setIsProcessing(true);

  setTimeout(() => {
    onMarkComplete?.(session.id);

    setShowConfirmModal(false);
    setShowSuccessMsg(true);
    setIsProcessing(false);

  }, 500);
};

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      {showSuccessMsg && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl shadow-lg p-4 min-w-[320px]">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <FontAwesomeIcon 
                  icon={faCheckCircle} 
                  className="text-emerald-500 text-xl"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-emerald-800 mb-1">
                  Session Marked Complete!
                </h4>
                <p className="text-sm text-emerald-700">
                  {session.credits} tokens have been transferred to {session.otherParticipant.name}. Both parties have been notified.
                </p>
              </div>
              <button
                onClick={() => setShowSuccessMsg(false)}
                className="flex-shrink-0 text-emerald-400 hover:text-emerald-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        </div>
      )}

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
            Scheduled for {formatDate(session.datetime)} at{' '}
            {formatTime(session.datetime)}
          </div>
        )}

        <div className="flex gap-3 mt-4 pt-2">
          {session.status === 'upcoming' && (
            <>
              <button
                onClick={handleViewRequestClick}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
              >
                View Request
              </button>
              <button
                onClick={handleMarkCompleteClick}
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
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
            <div className="p-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Mark Session Complete?
                </h2>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                This action will trigger a token transfer
              </p>
            </div>

            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-gray-100 rounded-lg p-2">
                  <FontAwesomeIcon
                    icon={faLightbulb}
                    className="text-gray-600"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {session.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faUser} className="text-xs" />
                      With {session.otherParticipant.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faClockIcon} className="text-xs" />
                      {session.duration} min
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Tokens to be released
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Released from escrow to {session.otherParticipant.name}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-red-500">
                    -{session.credits}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
                <FontAwesomeIcon icon={faExclamationCircle} className="mt-0.5" />
                <span>
                  Once confirmed, this action <strong>cannot be undone</strong>.
                  Both parties will be notified and invited to leave a rating.
                </span>
              </div>
            </div>

            <div className="p-6 flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                disabled={isProcessing}
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm & Transfer
                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default SessionListItem;
