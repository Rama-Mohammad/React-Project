import React, { useState, useEffect, useRef } from "react";
import { LogIn, Mic, MicOff, MonitorUp, Video, VideoOff, Wifi, WifiOff } from "lucide-react";
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
  isInCall,
  connectionStatus,
  errorMessage,
  isVideoEnabled,
  isAudioEnabled,
  isScreenSharing,
  participantCount,
  onJoinCall,
  onToggleVideo,
  onToggleAudio,
  onShareScreen,
}) => {
  const isMobile = useIsMobile();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const attachStream = (video: HTMLVideoElement | null, stream: MediaStream | null, muted = false) => {
    if (!video) return;

    video.srcObject = stream ?? null;
    video.muted = muted;
    video.defaultMuted = muted;
    video.autoplay = true;
    video.playsInline = true;

    if (stream) {
      const tryPlay = () => {
        void video.play().catch(() => {
          // Mobile browsers can delay autoplay until the media element is ready.
        });
      };

      if (video.readyState >= 1) {
        tryPlay();
      } else {
        video.onloadedmetadata = () => {
          tryPlay();
        };
      }
    }
  };

  function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

  useEffect(() => {
    attachStream(localVideoRef.current, localStream ?? null, true);
  }, [localStream, isVideoEnabled]);

  useEffect(() => {
    attachStream(remoteVideoRef.current, remoteStream ?? null);
  }, [remoteStream]);

  return (
<div className="relative flex w-full h-[100vh] sm:h-auto sm:aspect-video overflow-hidden rounded-none sm:rounded-2xl ...">    
 <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2">

        {/* LEFT */}
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${statusTone[connectionStatus]}`}>
            {statusLabel[connectionStatus]}
          </span>

          <span className="rounded-full bg-slate-900/70 px-3 py-1 text-xs text-slate-200">
            {participantCount} participant{participantCount === 1 ? "" : "s"}
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-slate-900/70 px-3 py-1 text-xs text-slate-200">
            {isScreenSharing ? "Sharing screen" : "Camera view"}
          </div>

          {isInCall ? null : (
            <button
              onClick={onJoinCall}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs text-white"
            >
              <LogIn size={13} />
              Join
            </button>
          )}
        </div>
      </div>

      <div className="relative h-full w-full flex-1 overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          {!isInCall ? (
            <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top,#334155_0%,#0f172a_55%,#020617_100%)] p-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 text-2xl font-semibold text-slate-100">
                {(selfLabel ?? "You").slice(0, 2).toUpperCase()}
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-100">Ready to join the call?</p>
              <p className="mt-2 max-w-md text-sm text-slate-300">
                Your camera and microphone will only start after you press join.
              </p>
              <button
                type="button"
                onClick={onJoinCall}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <LogIn size={16} />
                Join call
              </button>
            </div>
          ) : remoteStream ? (
            <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
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
                  ? "The room is ready. As soon as the other person joins, their video will appear here."
                  : connectionStatus === "connecting" || connectionStatus === "joining"
                    ? "Connecting to the other participant now."
                    : "The remote participant will appear here once the call is established."}
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

        <div className={`absolute right-3 top-14 z-20 h-28 w-20 overflow-hidden rounded-2xl border border-white/15 bg-slate-950/90 shadow-[0_18px_35px_-20px_rgba(15,23,42,0.95)] backdrop-blur sm:right-4 sm:top-16 sm:h-36 sm:w-24 md:h-44 md:w-32 ${isInCall ? "" : "hidden"}`}>
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
            <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top,#312e81_0%,#111827_55%,#020617_100%)] p-3 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-semibold text-indigo-100 sm:h-12 sm:w-12 sm:text-base">
                {(selfLabel ?? "You").slice(0, 2).toUpperCase()}
              </div>
              <p className="mt-2 text-[11px] font-semibold text-slate-100 sm:text-xs">{selfLabel ?? "You"}</p>
              <p className="mt-1 text-[10px] text-slate-300 sm:text-[11px]">
                {isVideoEnabled ? "Live" : "Camera off"}
              </p>
            </div>
          )}

          <div className="absolute bottom-2 left-2 rounded-full bg-slate-900/75 px-2 py-1 text-[10px] font-medium text-slate-100 sm:bottom-3 sm:left-3 sm:text-[11px]">
            {selfLabel ?? "You"}
          </div>
        </div>
      </div>

      {isInCall ? (
        <div className="absolute bottom-3 left-1/2 z-20 flex w-[calc(100%-1.5rem)] max-w-max -translate-x-1/2 flex-wrap justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/85 p-2 shadow-lg backdrop-blur sm:bottom-4 sm:w-auto">
          <button
            type="button"
            onClick={onToggleVideo}
            className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-white transition sm:text-sm ${
              isVideoEnabled ? "bg-slate-700 hover:bg-slate-600" : "bg-rose-600 hover:bg-rose-700"
            }`}
          >
            {isVideoEnabled ? <Video size={16} /> : <VideoOff size={16} />}
            {isVideoEnabled ? "Camera on" : "Camera off"}
          </button>
          <button
            type="button"
            onClick={onToggleAudio}
            className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-white transition sm:text-sm ${
              isAudioEnabled ? "bg-slate-700 hover:bg-slate-600" : "bg-rose-600 hover:bg-rose-700"
            }`}
          >
            {isAudioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
            {isAudioEnabled ? "Mic on" : "Mic off"}
          </button>
          {!isMobile && (
  <button
    type="button"
    onClick={onShareScreen}
    className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-white transition sm:text-sm ${
      isScreenSharing ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"
    }`}
  >
    <MonitorUp size={16} />
    {isScreenSharing ? "Stop share" : "Share screen"}
  </button>
)}
        </div>
      ) : null}

      <div className={`absolute right-3 z-20 rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-[11px] text-slate-200 backdrop-blur sm:right-4 sm:text-xs ${isInCall ? "bottom-[7.5rem] sm:bottom-24" : "bottom-4"}`}>
        <div className="flex items-center gap-2">
          {connectionStatus === "connected" ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{statusLabel[connectionStatus]}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlaceholder;
