import React, { useEffect, useRef } from "react";
import { Mic, MicOff, MonitorUp, Video, VideoOff, Wifi, WifiOff } from "lucide-react";
import type { VideoPlaceholderProps } from "../../../types/session";

const statusLabel: Record<VideoPlaceholderProps["connectionStatus"], string> = {
  idle: "Idle",
  joining: "Joining",
  waiting: "Waiting for other participant",
  connecting: "Connecting",
  connected: "Connected",
  error: "Connection error",
};

const statusTone: Record<VideoPlaceholderProps["connectionStatus"], string> = {
  idle: "bg-slate-600",
  joining: "bg-amber-500",
  waiting: "bg-sky-500",
  connecting: "bg-indigo-500",
  connected: "bg-emerald-500",
  error: "bg-rose-600",
};

const VideoPlaceholder: React.FC<VideoPlaceholderProps> = ({
  localStream,
  remoteStream,
  remoteParticipantName,
  selfLabel,
  connectionStatus,
  errorMessage,
  isVideoEnabled,
  isAudioEnabled,
  isScreenSharing,
  participantCount,
  onToggleVideo,
  onToggleAudio,
  onShareScreen,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const attachStream = (element: HTMLVideoElement | null, stream: MediaStream | null, muted: boolean) => {
    if (!element) return;

    element.srcObject = stream ?? null;
    element.muted = muted;

    if (!stream) return;

    const tryPlay = () => {
      const playAttempt = element.play();
      if (playAttempt && typeof playAttempt.catch === "function") {
        void playAttempt.catch(() => {});
      }
    };

    if (element.readyState >= 1) {
      tryPlay();
      return;
    }

    element.onloadedmetadata = () => {
      tryPlay();
    };
  };

  useEffect(() => {
    attachStream(localVideoRef.current, localStream ?? null, true);
  }, [localStream]);

  useEffect(() => {
    attachStream(remoteVideoRef.current, remoteStream ?? null, false);
  }, [remoteStream]);

  return (
    <div className="relative flex h-full min-h-[420px] overflow-hidden rounded-2xl border border-indigo-200/70 bg-slate-950 shadow-[0_22px_42px_-30px_rgba(15,23,42,0.9)]">
      <div className="absolute left-3 top-3 z-20 flex items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${statusTone[connectionStatus]}`}>
          {statusLabel[connectionStatus]}
        </span>
        <span className="rounded-full bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-200">
          {participantCount} participant{participantCount === 1 ? "" : "s"}
        </span>
      </div>

      <div className="absolute right-3 top-3 z-20 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-200">
        {isScreenSharing ? "Sharing screen" : "Camera view"}
      </div>

      <div className="grid h-full w-full flex-1 gap-0 md:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative min-h-[320px] overflow-hidden bg-slate-900">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              disablePictureInPicture
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top,#334155_0%,#0f172a_55%,#020617_100%)] p-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 text-2xl font-semibold text-slate-100">
                {(remoteParticipantName ?? "Guest").slice(0, 2).toUpperCase()}
              </div>
              <p className="mt-4 text-base font-semibold text-slate-100">
                {remoteParticipantName ?? "Waiting for the other participant"}
              </p>
              <p className="mt-2 max-w-sm text-sm text-slate-300">
                {connectionStatus === "waiting"
                  ? "The room is ready. As soon as the other person joins, the call will connect."
                  : "The remote stream will appear here once the call is established."}
              </p>
            </div>
          )}

          <div className="absolute bottom-4 left-4 rounded-full bg-slate-900/75 px-3 py-1.5 text-xs font-medium text-slate-100">
            {remoteParticipantName ?? "Remote participant"}
          </div>

          {connectionStatus === "error" ? (
            <div className="absolute inset-x-4 top-16 z-10 rounded-2xl border border-rose-400/40 bg-rose-500/15 p-3 text-sm text-rose-100 backdrop-blur">
              {errorMessage || "The live call hit a connection error."}
            </div>
          ) : null}
        </div>

        <div className="relative border-l border-slate-800 bg-slate-950/70">
          {localStream && isVideoEnabled ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              disablePictureInPicture
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top,#312e81_0%,#111827_55%,#020617_100%)] p-5 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 text-xl font-semibold text-indigo-100">
                {(selfLabel ?? "You").slice(0, 2).toUpperCase()}
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-100">{selfLabel ?? "You"}</p>
              <p className="mt-1 text-xs text-slate-300">
                {isVideoEnabled ? "Starting your camera..." : "Your camera is off"}
              </p>
            </div>
          )}

          <div className="absolute bottom-4 left-4 rounded-full bg-slate-900/75 px-3 py-1.5 text-xs font-medium text-slate-100">
            {selfLabel ?? "You"}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-2xl border border-slate-700 bg-slate-900/85 p-2 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={onToggleVideo}
          className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white transition ${
            isVideoEnabled ? "bg-slate-700 hover:bg-slate-600" : "bg-rose-600 hover:bg-rose-700"
          }`}
        >
          {isVideoEnabled ? <Video size={16} /> : <VideoOff size={16} />}
          {isVideoEnabled ? "Camera on" : "Camera off"}
        </button>
        <button
          type="button"
          onClick={onToggleAudio}
          className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white transition ${
            isAudioEnabled ? "bg-slate-700 hover:bg-slate-600" : "bg-rose-600 hover:bg-rose-700"
          }`}
        >
          {isAudioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
          {isAudioEnabled ? "Mic on" : "Mic off"}
        </button>
        <button
          type="button"
          onClick={onShareScreen}
          className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white transition ${
            isScreenSharing ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          <MonitorUp size={16} />
          {isScreenSharing ? "Stop share" : "Share screen"}
        </button>
      </div>

      <div className="absolute bottom-24 right-4 z-20 rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-200 backdrop-blur">
        <div className="flex items-center gap-2">
          {connectionStatus === "connected" ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{statusLabel[connectionStatus]}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlaceholder;
