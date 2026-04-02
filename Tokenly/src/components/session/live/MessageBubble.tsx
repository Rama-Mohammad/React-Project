// components/session/live/MessageBubble.tsx
import React from 'react';
import type { Message } from '../../../types/session';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && (
          <p className="text-xs text-gray-500 mb-1 ml-2">{message.senderName}</p>
        )}
        <div
          className={`rounded-lg px-3 py-2 ${
            isOwn
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-900 rounded-bl-none'
          }`}
        >
          <p className="text-sm break-words">{message.text}</p>
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-1 text-xs opacity-75">
              📎 {message.attachments.length} attachment(s)
            </div>
          )}
        </div>
        <p className={`text-xs text-gray-400 mt-1 ${isOwn ? 'text-right' : 'text-left'} mx-2`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;