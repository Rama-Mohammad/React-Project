import React, { useEffect, useRef, useState } from "react";
import type { VideoPlaceholderProps } from "../../../types/session";

const VideoPlaceholder: React.FC<VideoPlaceholderProps> = ({
  isVideoEnabled,
  participantCount,
  onToggleVideo,
  onToggleAudio,
  onShareScreen,
}) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [status, setStatus] = useState<"connecting" | "live" | "error">("connecting");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let mounted = true;

    const startLocalStream = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        if (mounted) setStatus("error");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setStatus("live");
      } catch {
        if (mounted) setStatus("error");
      }
    };

    void startLocalStream();

    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleToggleAudio = () => {
    const stream = streamRef.current;
    if (!stream) return;
    const next = !isAudioEnabled;
    stream.getAudioTracks().forEach((track) => {
      track.enabled = next;
    });
    setIsAudioEnabled(next);
    onToggleAudio();
  };

  return (
    <div className="relative h-full min-h-[420px] overflow-hidden rounded-2xl border border-indigo-200/70 bg-slate-900 shadow-[0_22px_42px_-30px_rgba(15,23,42,0.9)]">
      {status === "live" ? (
        <div className="absolute left-3 top-3 z-10 rounded bg-rose-600 px-2 py-1 text-xs font-semibold text-white">
          LIVE
        </div>
      ) : null}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`h-full w-full rounded-2xl object-cover transition-opacity duration-500 ${
          isVideoEnabled ? "opacity-100" : "opacity-0"
        }`}
      />

      {!isVideoEnabled ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/95">
          <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-slate-700">
            <span className="text-sm font-semibold text-slate-200">Camera Off</span>
          </div>
          <p className="text-sm text-slate-300">{participantCount} participants</p>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/85 p-6 text-center">
          <p className="text-sm font-semibold text-slate-100">Camera/Mic unavailable</p>
          <p className="mt-1 max-w-sm text-xs text-slate-300">
            You can continue with chat and files. Allow browser permissions to enable video.
          </p>
        </div>
      ) : null}

      {status === "connecting" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70">
          <p className="animate-pulse text-sm text-slate-200">Connecting...</p>
        </div>
      ) : null}

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-lg bg-slate-800/90 p-2 backdrop-blur">
        <button
          onClick={onToggleVideo}
          className={`rounded-lg p-2 text-sm text-white transition-colors ${
            isVideoEnabled ? "bg-slate-700 hover:bg-slate-600" : "bg-rose-600 hover:bg-rose-700"
          }`}
        >
          Video
        </button>
        <button
          onClick={handleToggleAudio}
          className={`rounded-lg p-2 text-sm text-white transition-colors ${
            isAudioEnabled ? "bg-slate-700 hover:bg-slate-600" : "bg-rose-600 hover:bg-rose-700"
          }`}
        >
          {isAudioEnabled ? "Mic On" : "Mic Off"}
        </button>
        <button
          onClick={onShareScreen}
          className="rounded-lg bg-indigo-600 p-2 text-sm text-white transition-colors hover:bg-indigo-700"
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default VideoPlaceholder;

