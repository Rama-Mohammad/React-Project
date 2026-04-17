import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CircleDot, ClipboardList, Paperclip } from "lucide-react";
import VideoPlaceholder from "../components/session/live/VideoPlaceHolder";
import ChatWindow from "../components/session/live/ChatWindow";
import FileManager from "../components/session/live/FileManager";
import Checklist from "../components/session/live/Checklist";
import { useChat } from "../hooks/useChat";
import { sendMessage } from "../services/chatService";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";
import type { ChecklistItem, FileAttachment } from "../types/session";

type TabType = "agenda" | "files";

const SessionLivePage: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const [activeTab, setActiveTab] = useState<TabType>("agenda");
  const messages = useChat(sessionId ?? "");  
  
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: "1", text: "Confirm goals and expected outcomes", completed: false },
    { id: "2", text: "Work through key blockers together", completed: false },
    { id: "3", text: "Summarize takeaways and next steps", completed: false },
  ]);
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [pendingDeleteFileId, setPendingDeleteFileId] = useState<string | null>(null);

  const currentUserId = "current-user-123";
  const isActive = true;



const handleSendMessage = async (text: string) => {
  if (!sessionId) return;

  await sendMessage(sessionId, currentUserId, text);
};

  const handleToggleItem = (itemId: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddItem = (text: string) => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    setChecklistItems((prev) => [...prev, newItem]);
  };

  const handleFileUpload = async (file: File) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    const newFile: FileAttachment = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedBy: "You",
      uploadedAt: new Date(),
    };
    setFiles((prev) => [...prev, newFile]);
  };

  const handleDownload = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file) window.open(file.url, "_blank");
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
    setPendingDeleteFileId(null);
  };

  const pendingDeleteFile = pendingDeleteFileId
    ? files.find((file) => file.id === pendingDeleteFileId) ?? null
    : null;

  return (
    <div className="flex h-screen flex-col bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_52%,#f3e8ff_100%)] text-slate-900">
      <header className="border-b border-indigo-200/70 bg-white/55 px-5 py-3 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-500">Live Session</p>
            <h1 className="text-lg font-semibold text-slate-900">Session #{sessionId ?? "unknown"}</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-medium text-indigo-700">
            <CircleDot size={13} className="text-indigo-600" />
            Connected
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1600px] flex-1 gap-4 overflow-hidden p-4">
        <section className="flex min-w-0 flex-1 flex-col">
          <VideoPlaceholder
            isVideoEnabled={isVideoEnabled}
            participantCount={2}
            onToggleVideo={() => setIsVideoEnabled((prev) => !prev)}
            onToggleAudio={() => { }}
            onShareScreen={() => { }}
          />
        </section>

        <aside className="flex w-[390px] min-w-[350px] flex-col gap-4">
          <div className="min-h-0 flex-1">
            <ChatWindow
              sessionId={sessionId ?? ""}
              messages={messages}
              onSendMessage={handleSendMessage}
              isActive={isActive}
              currentUserId={currentUserId}
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-indigo-200/70 bg-white/75 shadow-[0_12px_28px_-22px_rgba(99,102,241,0.5)] backdrop-blur">
            <div className="flex border-b border-indigo-200/70 bg-indigo-50/60 p-1">
              <button
                onClick={() => setActiveTab("agenda")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${activeTab === "agenda"
                    ? "bg-[linear-gradient(90deg,#6366f1,#8b5cf6)] text-white shadow-[0_10px_20px_-14px_rgba(99,102,241,0.8)]"
                    : "text-slate-600 hover:bg-indigo-50 hover:text-slate-800"
                  }`}
              >
                <ClipboardList size={15} />
                Agenda
              </button>
              <button
                onClick={() => setActiveTab("files")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${activeTab === "files"
                    ? "bg-[linear-gradient(90deg,#6366f1,#8b5cf6)] text-white shadow-[0_10px_20px_-14px_rgba(99,102,241,0.8)]"
                    : "text-slate-600 hover:bg-indigo-50 hover:text-slate-800"
                  }`}
              >
                <Paperclip size={15} />
                Files ({files.length})
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-4">
              {activeTab === "agenda" ? (
                <Checklist
                  items={checklistItems}
                  onToggleItem={handleToggleItem}
                  onAddItem={handleAddItem}
                  isEditable
                />
              ) : (
                <FileManager
                  sessionId={sessionId ?? ""}
                  onFileUpload={handleFileUpload}
                  files={files}
                  onDownload={handleDownload}
                  onDelete={setPendingDeleteFileId}
                />
              )}
            </div>
          </div>
        </aside>
      </main>

      <footer className="border-t border-indigo-200/70 bg-white/55 px-6 py-3 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1600px] justify-center">
          <button
            onClick={() => navigate("/sessions")}
            className="rounded-lg bg-[linear-gradient(90deg,#ef4444,#f97316)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_22px_-16px_rgba(239,68,68,0.85)] transition hover:opacity-95"
          >
            Leave Session
          </button>
        </div>
      </footer>

      <ConfirmDeleteModal
        isOpen={Boolean(pendingDeleteFile)}
        title="Delete this file?"
        message="This shared file will be removed from the session."
        itemName={pendingDeleteFile?.name}
        details={pendingDeleteFile ? `${pendingDeleteFile.uploadedBy} � ${(pendingDeleteFile.size / 1024).toFixed(1)} KB` : undefined}
        confirmLabel="Delete File"
        onCancel={() => setPendingDeleteFileId(null)}
        onConfirm={() => {
          if (!pendingDeleteFile) return;
          handleDeleteFile(pendingDeleteFile.id);
        }}
      />
    </div>
  );
};

export default SessionLivePage;


