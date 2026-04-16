import React from "react";
import type { Message } from "../../../types/session";

interface Props {
  message: Message;
  isOwn: boolean;
}

const MessageBubble: React.FC<Props> = ({ message, isOwn }) => {
  const time = new Date(message.timestamp);

  return (
    <div className={`mb-3 flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[72%]">
        {!isOwn && message.senderName && (
          <p className="mb-1 ml-2 text-xs text-slate-500">
            {message.senderName}
          </p>
        )}

        <div
          className={`rounded-lg px-3 py-2 ${
            isOwn
              ? "bg-indigo-600 text-white"
              : "border border-indigo-100 bg-indigo-50 text-slate-900"
          }`}
        >
          <p className="break-words text-sm">{message.text}</p>
        </div>

        <p
          className={`mt-1 text-xs text-slate-400 ${
            isOwn ? "text-right" : "text-left"
          }`}
        >
          {time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;