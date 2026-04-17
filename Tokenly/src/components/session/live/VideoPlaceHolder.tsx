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

    element.srcObject = stream;
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

  const hasRemoteVideo = Boolean(remoteStream);
  const mainLabel = hasRemoteVideo ? remoteParticipantName ?? "Remote participant" : selfLabel ?? "You";

  return (
    <div className="relative isolate min-h-[320px] overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.95)] sm:min-h-[420px] lg:h-full lg:min-h-[560px]">
      {hasRemoteVideo ? (
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          disablePictureInPicture
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#334155_0%,#0f172a_45%,#020617_100%)]" />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.15)_0%,rgba(2,6,23,0)_25%,rgba(2,6,23,0.1)_60%,rgba(2,6,23,0.72)_100%)]" />

      {!hasRemoteVideo ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/10 text-2xl font-semibold text-white backdrop-blur">
            {mainLabel.slice(0, 2).toUpperCase()}
          </div>
          <p className="mt-5 text-lg font-semibold text-white">{mainLabel}</p>
          <p className="mt-2 max-w-md text-sm text-slate-200">
            {connectionStatus === "waiting"
              ? "Your room is ready. The other participant will appear here when they join."
              : "The live video will appear here once the call is established."}
          </p>
        </div>
      ) : null}

      <div className="absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${statusTone[connectionStatus]}`}>
          {statusLabel[connectionStatus]}
        </span>
        <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs font-medium text-slate-100 backdrop-blur">
          {participantCount} participant{participantCount === 1 ? "" : "s"}
        </span>
      </div>

      <div className="absolute bottom-24 left-4 z-20 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
        {mainLabel}
      </div>

      <div className="absolute right-4 top-4 z-20 w-[34vw] max-w-[210px] min-w-[108px] overflow-hidden rounded-2xl border border-white/12 bg-slate-900/90 shadow-[0_18px_40px_-22px_rgba(15,23,42,0.95)] backdrop-blur">
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-900 sm:aspect-[4/3]">
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
            <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top,#312e81_0%,#111827_55%,#020617_100%)] p-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                {(selfLabel ?? "You").slice(0, 2).toUpperCase()}
              </div>
              <p className="mt-2 text-xs font-medium text-white">{selfLabel ?? "You"}</p>
              <p className="mt-1 text-[11px] text-slate-300">
                {isVideoEnabled ? "Starting camera..." : "Camera off"}
              </p>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(2,6,23,0)_0%,rgba(2,6,23,0.72)_100%)] px-3 pb-2 pt-8">
            <span className="rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
              {selfLabel ?? "You"}
            </span>
          </div>
        </div>
      </div>

      {connectionStatus === "error" ? (
        <div className="absolute inset-x-4 top-16 z-20 rounded-2xl border border-rose-400/35 bg-rose-500/15 p-3 text-sm text-rose-100 backdrop-blur">
          {errorMessage || "The live call hit a connection error."}
        </div>
      ) : null}

      <div className="absolute right-4 top-24 z-20 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-xs text-slate-100 backdrop-blur sm:top-auto sm:bottom-24">
        <div className="flex items-center gap-2">
          {connectionStatus === "connected" ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{isScreenSharing ? "Sharing screen" : "Camera view"}</span>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 z-20 flex w-[calc(100%-1.5rem)] max-w-max -translate-x-1/2 flex-wrap justify-center gap-2 rounded-2xl border border-white/10 bg-black/45 p-2 shadow-lg backdrop-blur sm:w-auto">
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
    </div>
  );
};

export default VideoPlaceholder;
