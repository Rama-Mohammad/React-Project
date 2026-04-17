import React, { useEffect, useRef, useState } from "react";
import type { VideoPlaceholderProps } from "../../../types/session";

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (
      domain: string,
      options: {
        roomName: string;
        parentNode: HTMLElement;
        width?: string | number;
        height?: string | number;
        userInfo?: { displayName?: string };
        configOverwrite?: Record<string, unknown>;
        interfaceConfigOverwrite?: Record<string, unknown>;
      }
    ) => {
      dispose: () => void;
      executeCommand?: (command: string, ...args: unknown[]) => void;
      addEventListeners?: (listeners: Record<string, (...args: unknown[]) => void>) => void;
    };
  }
}

const VideoPlaceholder: React.FC<VideoPlaceholderProps> = ({
  roomName,
  displayName,
  sessionLabel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{
    dispose: () => void;
    executeCommand?: (command: string, ...args: unknown[]) => void;
    addEventListeners?: (listeners: Record<string, (...args: unknown[]) => void>) => void;
  } | null>(null);
  const [isShareAvailable, setIsShareAvailable] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const parentNode = containerRef.current;
    const JitsiAPI = window.JitsiMeetExternalAPI;

    if (!parentNode) return;
    if (!JitsiAPI) {
      setLoadError("The video room could not load. Refresh the page and try again.");
      return;
    }

    parentNode.innerHTML = "";
    setLoadError("");

    const api = new JitsiAPI("meet.ffmuc.net", {
      roomName,
      parentNode,
      width: "100%",
      height: "100%",
      userInfo: {
        displayName,
      },
      configOverwrite: {
        prejoinPageEnabled: false,
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        disableModeratorIndicator: true,
        enableWelcomePage: false,
        toolbarButtons: [
          "microphone",
          "camera",
          "desktop",
          "fullscreen",
          "participants-pane",
          "chat",
          "tileview",
          "hangup",
          "settings",
        ],
      },
      interfaceConfigOverwrite: {
        MOBILE_APP_PROMO: false,
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
      },
    });

    apiRef.current = api;
    setIsShareAvailable(Boolean(navigator.mediaDevices?.getDisplayMedia));
    api.addEventListeners?.({
      screenSharingStatusChanged: (event: unknown) => {
        const payload = event as { on?: boolean } | undefined;
        setIsSharingScreen(Boolean(payload?.on));
      },
    });

    return () => {
      apiRef.current?.dispose();
      apiRef.current = null;
      setIsSharingScreen(false);
    };
  }, [displayName, roomName]);

  const handleToggleShareScreen = () => {
    apiRef.current?.executeCommand?.("toggleShareScreen");
  };

  return (
    <div className="relative isolate min-h-[420px] overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.95)] lg:min-h-[560px]">
      <div className="absolute left-4 top-4 z-20 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
        {sessionLabel ?? "Live session"}
      </div>
      {isShareAvailable ? (
        <button
          type="button"
          onClick={handleToggleShareScreen}
          className={`absolute right-4 top-4 z-20 rounded-full px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition ${
            isSharingScreen
              ? "border border-emerald-300/40 bg-emerald-500/80"
              : "border border-white/10 bg-black/35 hover:bg-black/50"
          }`}
        >
          {isSharingScreen ? "Stop sharing" : "Share screen"}
        </button>
      ) : null}
      {loadError ? (
        <div className="absolute inset-x-4 bottom-4 z-20 rounded-2xl border border-rose-300/30 bg-rose-500/90 px-4 py-3 text-sm font-medium text-white shadow-lg backdrop-blur">
          {loadError}
        </div>
      ) : null}
      <div className="absolute inset-0">
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </div>
  );
};

export default VideoPlaceholder;
