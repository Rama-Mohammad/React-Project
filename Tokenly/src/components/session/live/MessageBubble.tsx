import React from "react";
import type { MessageBubbleProps } from "../../../types/session";

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const formatTime = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);

  return (
    <div className={`mb-3 flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[72%]">
        {!isOwn ? <p className="mb-1 ml-2 text-xs text-slate-500">{message.senderName}</p> : null}
        <div
          className={`rounded-lg px-3 py-2 ${
            isOwn
              ? "rounded-br-none bg-[linear-gradient(90deg,#6366f1,#8b5cf6)] text-white"
              : "rounded-bl-none border border-indigo-100 bg-indigo-50/80 text-slate-900"
          }`}
        >
          <p className="break-words text-sm">{message.text}</p>
          {message.attachments && message.attachments.length > 0 ? (
            <div className="mt-1 text-xs opacity-75">Attachment: {message.attachments.length}</div>
          ) : null}
        </div>
        <p className={`mx-2 mt-1 text-xs text-slate-400 ${isOwn ? "text-right" : "text-left"}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;

