import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CircleDot, ClipboardList, Paperclip, Star } from "lucide-react";
import VideoPlaceholder from "../components/session/live/VideoPlaceHolder";
import ChatWindow from "../components/session/live/ChatWindow";
import FileManager from "../components/session/live/FileManager";
import Checklist from "../components/session/live/Checklist";
import { useChat } from "../hooks/useChat";
import { useLiveSessionCall } from "../hooks/useLiveSessionCall";
import { getCurrentUser } from "../services/authService";
import { sendMessage } from "../services/chatService";
import { getSessionById, updateSessionStatus } from "../services/sessionService";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";
import type { ChecklistItem, FileAttachment } from "../types/session";
import { useSharedChecklist } from "../hooks/useSharedChecklist";
import { supabase } from "../lib/supabaseClient";
import { uploadSessionFile, deleteSessionFile } from "../services/storageService";
import { createReview, hasUserReviewedSession } from "../services/reviewService";

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
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUserName, setCurrentUserName] = useState("You");
  const [otherParticipantId, setOtherParticipantId] = useState("");
  const [otherParticipantName, setOtherParticipantName] = useState("Remote participant");
  const [isInitiator, setIsInitiator] = useState(false);
  const [hasJoinedCall, setHasJoinedCall] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<"loading" | "ready" | "error">("loading");
  const [sessionError, setSessionError] = useState("");
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [pendingDeleteFileId, setPendingDeleteFileId] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingReview, setHasExistingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [shouldNavigateAfterReview, setShouldNavigateAfterReview] = useState(false);

  const helperId = sessionData?.helper_id ?? "";
  const canReviewHelper = Boolean(currentUserId && helperId && currentUserId !== helperId);

  const resetReviewModalState = () => {
    setShowReviewModal(false);
    setRating(0);
    setReviewText("");
    setIsSubmitting(false);
    setReviewError("");
  };

  const closeReviewModal = () => {
    resetReviewModalState();

    if (shouldNavigateAfterReview) {
      setShouldNavigateAfterReview(false);
      navigate("/sessions");
    }
  };

  const maybeOpenReviewModal = async (options?: { navigateAfterClose?: boolean }) => {
    if (!sessionId || !currentUserId || !helperId || !canReviewHelper) {
      if (options?.navigateAfterClose) {
        navigate("/sessions");
      }
      return;
    }

    const alreadyReviewed = await hasUserReviewedSession(sessionId, currentUserId);
    setHasExistingReview(alreadyReviewed);

    if (alreadyReviewed) {
      if (options?.navigateAfterClose) {
        navigate("/sessions");
      }
      return;
    }

    setReviewError("");
    setShouldNavigateAfterReview(Boolean(options?.navigateAfterClose));
    setShowReviewModal(true);
  };

  const { messages, appendLocalMessage } = useChat({
    sessionId: sessionId ?? "",
    currentUserId,
    currentUserName,
    otherParticipantId,
    otherParticipantName,
  });

  const {
    localStream,
    remoteStream,
    connectionStatus,
    participantCount,
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    errorMessage: callError,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    leaveCall,
  } = useLiveSessionCall({
    sessionId: sessionId ?? "",
    userId: currentUserId,
    enabled: sessionStatus === "ready" && hasJoinedCall,
    isInitiator,
  });

  const {
    items: checklistItems,
    addItem: handleAddItem,
    toggleItem: handleToggleItem,
    editItem: handleEditItem,
    removeItem: handleRemoveItem,
  } = useSharedChecklist({
    sessionId: sessionId ?? "",
    userId: currentUserId,
    enabled: sessionStatus === "ready" && !!currentUserId,
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
      setSessionData(sessionData);

      const isHelper = sessionData.helper_id === userData.user.id;
      const initiatorId = sessionData.helper_id; // Helper initiates the call

      setCurrentUserId(userData.user.id);
      setCurrentUserName(
        isHelper
          ? sessionData.helper?.full_name || sessionData.helper?.username || "You"
          : sessionData.requester?.full_name || sessionData.requester?.username || "You"
      );
      setOtherParticipantName(
        isHelper
          ? sessionData.requester?.full_name || sessionData.requester?.username || "Guest"
          : sessionData.helper?.full_name || sessionData.helper?.username || "Guest"
      );
      setOtherParticipantId(isHelper ? sessionData.requester_id : sessionData.helper_id);
      setIsInitiator(initiatorId === userData.user.id);
      if (sessionData.status === "upcoming") {
        await updateSessionStatus(sessionId, "active");
      }
      setSessionStatus("ready");

      if (userData.user.id !== sessionData.helper_id) {
        const alreadyReviewed = await hasUserReviewedSession(sessionId, userData.user.id);
        if (isMounted) {
          setHasExistingReview(alreadyReviewed);
        }
      }
    };

    void loadSessionContext();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || !currentUserId) return;

    const channel = supabase
      .channel(`session-review-status-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sessions",
          filter: `id=eq.${sessionId}`,
        },
        async (payload) => {
          const nextStatus = payload.new?.status;

          setSessionData((prev: any) => (prev ? { ...prev, ...payload.new } : prev));

          if (
            nextStatus === "completed" &&
            payload.old?.status !== "completed" &&
            payload.new?.helper_id !== currentUserId
          ) {
            await maybeOpenReviewModal();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, sessionId, helperId, canReviewHelper]);

  useEffect(() => {
    if (!sessionId) return;

    const loadFiles = async () => {
      const { data, error } = await supabase
        .from("session_files")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
console.log("INITIAL FILE LOAD", data);
      if (error) {
        console.error(error);
        return;
      }

      setFiles(
        (data || []).map((f) => (
          {
            id: f.id,
            name: f.file_name,
            size: f.file_size_bytes,
            type: f.file_type,
            uploadedBy: f.uploader_id,
            uploadedAt: new Date(f.created_at),
            url: f.file_url,
            path: f.path,
          }
        ))
      );
      
    };

    loadFiles();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`files-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_files",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
              console.log("REALTIME INSERT RECEIVED", payload.new);

            const f = payload.new;

            setFiles((prev) => [
              ...prev,
              {
                id: f.id,
                name: f.file_name,
                size: f.file_size_bytes,
                type: f.file_type,
                uploadedBy: f.uploader_id,
                uploadedAt: new Date(f.created_at),
                url: f.file_url,
                path: f.path,
              },
            ]);
          }

          if (payload.eventType === "DELETE") {
            console.log("REALTIME DELETE RECEIVED", payload.old);
            const f = payload.old;

            setFiles((prev) => prev.filter((x) => x.id !== f.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const handleDeleteFile = async (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    const { error } = await supabase
      .from("session_files")
      .delete()
      .eq("id", fileId);

    if (error) throw error;

    if (file.path) {
      await deleteSessionFile(file.path);
    }
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleSendMessage = async (text: string) => {
    if (!sessionId || !currentUserId || sessionStatus !== "ready") return;

    appendLocalMessage(text);
    await sendMessage(sessionId, currentUserId, text);
  };

  const handleFileUpload = async (file: File) => {
    console.log("📤 UPLOAD START", { sessionId, currentUserId, file });
    if (!sessionId || !currentUserId) {
      console.log("Missing sessionId or currentUserId", {
        sessionId,
        currentUserId,
      });
      return;
    }

    console.log("START FILE UPLOAD:", {
      fileName: file.name,
      fileSize: file.size,
      sessionId,
      currentUserId,
    });

    const { data, error } = await uploadSessionFile(
      sessionId,
      currentUserId,
      file
    );
    console.log(" STORAGE RESULT", { data, error });

    if (error || !data) {
      console.error("Storage upload failed:", error);
      return;
    }


    const { data: inserted, error: dbError } = await supabase
      .from("session_files")
      .insert({
        session_id: sessionId,
        uploader_id: currentUserId,
        file_name: file.name,
        file_url: data.url,
        file_size_bytes: file.size,
        file_type: file.type, 
        path: data.path,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

console.log("DB INSERT RESULT", { inserted, dbError });
    if (dbError) {
      console.error(" DB insert failed:", dbError);
      return;
    }
console.log(" ADDING FILE TO STATE", inserted);
    setFiles((prev) => [
      ...prev,
      {
        id: inserted.id,
        name: inserted.file_name,
        size: inserted.file_size_bytes,
        type: inserted.file_type,
        uploadedBy: currentUserName,
        uploadedAt: new Date(inserted.created_at),
        url: inserted.file_url,
        path: inserted.path,
      }
    ]);

  };

  const handleDownload = (fileId: string) => {
    const file = files.find((item) => item.id === fileId);
    if (file) window.open(file.url, "_blank");
  };

  const handleLeaveSession = async () => {
    await leaveCall();
    setHasJoinedCall(false);
    await maybeOpenReviewModal({ navigateAfterClose: true });
  };

  const handleSubmitReview = async () => {
    if (!sessionId || !currentUserId || !helperId || !rating || hasExistingReview) return;

    setIsSubmitting(true);
    setReviewError("");

    const { error } = await createReview({
      session_id: sessionId,
      reviewer_id: currentUserId,
      reviewee_id: helperId,
      rating,
      comment: reviewText.trim() || undefined,
    });

    if (error) {
      setReviewError(error.message ?? "Could not submit your review.");
      setIsSubmitting(false);
      return;
    }

    setHasExistingReview(true);
    setIsSubmitting(false);
    closeReviewModal();
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
    <div className="flex min-h-screen flex-col bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_52%,#f3e8ff_100%)] text-slate-900">
      <header className="border-b border-indigo-200/70 bg-white/55 px-4 py-3 backdrop-blur-xl sm:px-5">
        <div className="mx-auto flex w-full max-w-400 items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-500">Live Session</p>
            <h1 className="break-all text-base font-semibold text-slate-900 sm:text-lg">
              {sessionData?.title ?? "Session"}
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-medium text-indigo-700">
            <CircleDot size={13} className="text-indigo-600" />
            {connectionStatus === "connected"
              ? "Connected"
              : connectionStatus === "connecting" || connectionStatus === "joining"
                ? "Connecting"
                : connectionStatus === "waiting"
                  ? "Waiting"
                  : connectionStatus === "error"
                    ? "Issue detected"
                    : "Ready"}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-400 flex-1 flex-col gap-4 p-3 pb-28 sm:p-4 sm:pb-32">
        <section className="flex min-w-0 flex-col">
          <VideoPlaceholder
            localStream={localStream}
            remoteStream={remoteStream}
            remoteParticipantName={otherParticipantName}
            selfLabel={currentUserName}
            isInCall={hasJoinedCall}
            connectionStatus={connectionStatus}
            errorMessage={callError}
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
            isScreenSharing={isScreenSharing}
            participantCount={participantCount}
            onJoinCall={() => setHasJoinedCall(true)}
            onLeaveCall={() => setHasJoinedCall(false)}
            onToggleVideo={toggleVideo}
            onToggleAudio={toggleAudio}
            onShareScreen={toggleScreenShare}
          />
        </section>

        <aside className="grid w-full min-w-0 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start">
          <div className="min-h-0 flex-1">
            <ChatWindow
              sessionId={sessionId ?? ""}
              messages={messages}
              onSendMessage={handleSendMessage}
              isActive={sessionStatus === "ready"}
              currentUserId={currentUserId}
            />
          </div>

          <div className="flex h-125 min-h-0 flex-col overflow-hidden rounded-xl border border-indigo-200/70 bg-white/75 shadow-[0_12px_28px_-22px_rgba(99,102,241,0.5)] backdrop-blur">
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

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {activeTab === "agenda" ? (
                <Checklist
                  items={checklistItems}
                  onToggleItem={handleToggleItem}
                  onAddItem={handleAddItem}
                  onEditItem={handleEditItem}
                  onRemoveItem={handleRemoveItem}
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

      <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-indigo-200/70 bg-white/80 px-4 py-3 shadow-[0_-12px_30px_-24px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex w-full max-w-400 justify-center">
          <button
            onClick={() => {
              void handleLeaveSession();
            }}
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
        onConfirm={async () => {
          if (!pendingDeleteFile) return;

          await handleDeleteFile(pendingDeleteFile.id);
          setPendingDeleteFileId(null);
        }}
      />

      {showReviewModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm"
            onClick={closeReviewModal}
          />

          <div className="relative w-full max-w-md rounded-2xl border border-indigo-100 bg-white p-5 shadow-xl">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Rate your helper</h3>
              <p className="mt-1 text-sm text-slate-500">
                Share a quick rating for this session.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {Array.from({ length: 5 }, (_, index) => {
                const starValue = index + 1;
                const active = starValue <= rating;

                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    className="rounded-lg p-1 text-amber-400 transition hover:scale-105"
                    aria-label={`Rate ${starValue} star${starValue === 1 ? "" : "s"}`}
                  >
                    <Star
                      size={28}
                      className={active ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                    />
                  </button>
                );
              })}
            </div>

            <textarea
              value={reviewText}
              onChange={(event) => setReviewText(event.target.value)}
              placeholder="Write an optional review"
              rows={4}
              className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />

            {reviewError ? (
              <p className="mt-3 text-sm text-rose-600">{reviewError}</p>
            ) : null}

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={closeReviewModal}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Not now
              </button>
              <button
                type="button"
                onClick={() => {
                  void handleSubmitReview();
                }}
                disabled={!rating || isSubmitting}
                className={`rounded-xl px-3 py-2 text-sm font-semibold text-white transition ${!rating || isSubmitting
                  ? "cursor-not-allowed bg-indigo-300"
                  : "bg-[linear-gradient(90deg,#6366f1,#8b5cf6)] hover:opacity-95"
                  }`}
              >
                {isSubmitting ? "Submitting..." : "Submit review"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SessionLivePage;
