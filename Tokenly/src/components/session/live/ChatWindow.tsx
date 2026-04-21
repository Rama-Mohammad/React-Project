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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const forceScrollRef = useRef(false);

  const isNearBottom = () => {
    const el = messagesContainerRef.current;
    if (!el) return true;

    return el.scrollHeight - el.scrollTop - el.clientHeight < 100;
  };

  const shouldAutoScrollRef = useRef(true);

const handleScroll = () => {
  shouldAutoScrollRef.current = isNearBottom();
};

useEffect(() => {
  if (forceScrollRef.current) {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    forceScrollRef.current = false;
  }
}, [messages]);

const handleSend = () => {
  if (!inputText.trim() || !isActive) return;

  forceScrollRef.current = true; 

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
    <div className="flex h-[500px] flex-col rounded-xl border border-indigo-200/70 bg-white/75 backdrop-blur">
      {/* Header */}
<div className="flex items-center justify-between border-b border-indigo-200/70 bg-indigo-50/60 p-3">
  <div>
    <h3 className="font-semibold text-slate-900">Chat</h3>
    <p className="text-xs text-slate-500">
      {isActive ? "Connected" : "Reconnecting..."}
    </p>
  </div>

</div>
      

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3"
      >
        {messages.length === 0 ? (
          <div className="mt-8 text-center text-sm text-slate-400">
            No messages yet. Start the conversation.
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUserId} />
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-indigo-200/70 p-3">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={!isActive}
            placeholder={isActive ? "Type a message..." : "Chat is disabled"}
            rows={2}
            className="flex-1 resize-none rounded-lg border border-indigo-200 bg-indigo-50/40 p-2 text-sm"
          />

          <button
            onClick={handleSend}
            disabled={!isActive || !inputText.trim()}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white disabled:bg-slate-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatWindow);