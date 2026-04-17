import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipboardList, Paperclip } from "lucide-react";
import VideoPlaceholder from "../components/session/live/VideoPlaceHolder";
import ChatWindow from "../components/session/live/ChatWindow";
import FileManager from "../components/session/live/FileManager";
import Checklist from "../components/session/live/Checklist";
import { useChat } from "../hooks/useChat";
import { useSharedChecklist } from "../hooks/useSharedChecklist";
import { getCurrentUser } from "../services/authService";
import { sendMessage } from "../services/chatService";
import { getSessionById } from "../services/sessionService";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";
import type { ChecklistItem, FileAttachment } from "../types/session";

type TabType = "agenda" | "files";

const defaultChecklistItems: ChecklistItem[] = [
  { id: "1", text: "Confirm goals and expected outcomes", completed: false },
  { id: "2", text: "Work through key blockers together", completed: false },
  { id: "3", text: "Summarize takeaways and next steps", completed: false },
];

const SessionLivePage: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const [activeTab, setActiveTab] = useState<TabType>("agenda");
  const messages = useChat(sessionId ?? "");
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUserName, setCurrentUserName] = useState("You");
  const [sessionStatus, setSessionStatus] = useState<"loading" | "ready" | "error">("loading");
  const [sessionError, setSessionError] = useState("");
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [pendingDeleteFileId, setPendingDeleteFileId] = useState<string | null>(null);

  const roomName = useMemo(
    () => (sessionId ? `tokenly-session-${sessionId}` : "tokenly-demo-room"),
    [sessionId]
  );

  const {
    items: checklistItems,
    toggleItem: handleToggleItem,
    addItem: handleAddItem,
  } = useSharedChecklist({
    sessionId: sessionId ?? "",
    userId: currentUserId,
    enabled: sessionStatus === "ready",
    initialItems: defaultChecklistItems,
  });

  useEffect(() => {
    let isMounted = true;

    const loadSessionContext = async () => {
      if (!sessionId) {
        if (isMounted) {
          setSessionStatus("error");
          setSessionError("This live session link is missing a session ID.");
        }
        return;
      }

      setSessionStatus("loading");
      setSessionError("");

      const [{ data: userData, error: userError }, { data: sessionData, error: fetchSessionError }] =
        await Promise.all([getCurrentUser(), getSessionById(sessionId)]);

      if (!isMounted) return;

      if (userError || !userData?.user) {
        setSessionStatus("error");
        setSessionError("Please sign in to join this live session.");
        return;
      }

      if (fetchSessionError || !sessionData) {
        setSessionStatus("error");
        setSessionError(fetchSessionError?.message ?? "We could not load this session.");
        return;
      }

      const isHelper = sessionData.helper_id === userData.user.id;

      setCurrentUserId(userData.user.id);
      setCurrentUserName(
        isHelper
          ? sessionData.helper?.full_name || sessionData.helper?.username || "You"
          : sessionData.requester?.full_name || sessionData.requester?.username || "You"
      );
      setSessionStatus("ready");
    };

    void loadSessionContext();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  const handleSendMessage = async (text: string) => {
    if (!sessionId || !currentUserId || sessionStatus !== "ready") return;

    await sendMessage(sessionId, currentUserId, text);
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
    const file = files.find((item) => item.id === fileId);
    if (file) window.open(file.url, "_blank");
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
    setPendingDeleteFileId(null);
  };

  const pendingDeleteFile = pendingDeleteFileId
    ? files.find((file) => file.id === pendingDeleteFileId) ?? null
    : null;

  if (sessionStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_52%,#f3e8ff_100%)] px-6 text-slate-900">
        <div className="rounded-2xl border border-indigo-200/70 bg-white/80 px-6 py-5 text-center shadow-[0_18px_42px_-28px_rgba(99,102,241,0.55)] backdrop-blur">
          <p className="text-sm font-semibold text-slate-900">Joining live session...</p>
          <p className="mt-1 text-sm text-slate-500">We&apos;re loading your session workspace.</p>
        </div>
      </div>
    );
  }

  if (sessionStatus === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_52%,#f3e8ff_100%)] px-6 text-slate-900">
        <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white/85 p-6 text-center shadow-[0_18px_42px_-28px_rgba(244,63,94,0.3)] backdrop-blur">
          <p className="text-base font-semibold text-slate-900">Unable to open live session</p>
          <p className="mt-2 text-sm text-slate-600">{sessionError}</p>
          <button
            type="button"
            onClick={() => navigate("/sessions")}
            className="mt-4 rounded-lg bg-[linear-gradient(90deg,#6366f1,#8b5cf6)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_52%,#f3e8ff_100%)] text-slate-900">
      <header className="border-b border-indigo-200/70 bg-white/55 px-4 py-3 backdrop-blur-xl sm:px-5">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-500">Live Session</p>
            <h1 className="break-all text-base font-semibold text-slate-900 sm:text-lg">
              Session #{sessionId ?? "unknown"}
            </h1>
          </div>
          <div className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-medium text-emerald-700">
            Meeting ready
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-4 overflow-hidden p-3 sm:p-4">
        <section className="flex min-w-0 shrink-0 flex-col lg:min-h-0 lg:flex-1">
          <VideoPlaceholder
            roomName={roomName}
            displayName={currentUserName}
            sessionLabel={`Room: ${roomName}`}
          />
        </section>

        <aside className="grid w-full min-w-0 gap-4 overflow-hidden lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start">
          <div className="min-h-0 overflow-hidden lg:min-h-[320px]">
            <ChatWindow
              sessionId={sessionId ?? ""}
              messages={messages}
              onSendMessage={handleSendMessage}
              isActive={sessionStatus === "ready"}
              currentUserId={currentUserId}
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-indigo-200/70 bg-white/75 shadow-[0_12px_28px_-22px_rgba(99,102,241,0.5)] backdrop-blur lg:min-h-[320px]">
            <div className="flex border-b border-indigo-200/70 bg-indigo-50/60 p-1">
              <button
                onClick={() => setActiveTab("agenda")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  activeTab === "agenda"
                    ? "bg-[linear-gradient(90deg,#6366f1,#8b5cf6)] text-white shadow-[0_10px_20px_-14px_rgba(99,102,241,0.8)]"
                    : "text-slate-600 hover:bg-indigo-50 hover:text-slate-800"
                }`}
              >
                <ClipboardList size={15} />
                Agenda
              </button>
              <button
                onClick={() => setActiveTab("files")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  activeTab === "files"
                    ? "bg-[linear-gradient(90deg,#6366f1,#8b5cf6)] text-white shadow-[0_10px_20px_-14px_rgba(99,102,241,0.8)]"
                    : "text-slate-600 hover:bg-indigo-50 hover:text-slate-800"
                }`}
              >
                <Paperclip size={15} />
                Files ({files.length})
              </button>
            </div>

            <div className="p-4 lg:max-h-[298px] lg:overflow-y-auto">
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

      <footer className="border-t border-indigo-200/70 bg-white/55 px-4 py-3 backdrop-blur-xl sm:px-6">
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
        details={
          pendingDeleteFile
            ? `${pendingDeleteFile.uploadedBy} • ${(pendingDeleteFile.size / 1024).toFixed(1)} KB`
            : undefined
        }
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
