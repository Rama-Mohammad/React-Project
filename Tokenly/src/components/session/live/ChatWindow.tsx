import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import type { ChatWindowProps } from "../../../types/session";

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isActive,
  currentUserId,
}) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || !isActive) return;
    onSendMessage(inputText.trim());
    setInputText("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-indigo-200/70 bg-white/75 shadow-[0_12px_28px_-22px_rgba(99,102,241,0.5)] backdrop-blur">
      <div className="border-b border-indigo-200/70 bg-indigo-50/60 p-3">
        <h3 className="font-semibold text-slate-900">Chat</h3>
        <p className="text-xs text-slate-500">{isActive ? "Connected" : "Reconnecting..."}</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.length === 0 ? (
          <div className="mt-8 text-center text-sm text-slate-400">No messages yet. Start the conversation.</div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} isOwn={message.senderId === currentUserId} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-indigo-200/70 p-3">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isActive}
            placeholder={isActive ? "Type a message..." : "Chat is disabled"}
            rows={2}
            className="flex-1 resize-none rounded-lg border border-indigo-200 bg-indigo-50/40 p-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100 disabled:text-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={!isActive || !inputText.trim()}
            className="self-end rounded-lg bg-[linear-gradient(90deg,#6366f1,#8b5cf6)] px-3 py-2 text-sm font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

