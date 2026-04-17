import React, { useEffect, useRef } from "react";
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
    };
  }
}

const VideoPlaceholder: React.FC<VideoPlaceholderProps> = ({
  roomName,
  displayName,
  sessionLabel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ dispose: () => void } | null>(null);

  useEffect(() => {
    const parentNode = containerRef.current;
    const JitsiAPI = window.JitsiMeetExternalAPI;

    if (!parentNode || !JitsiAPI) return;

    parentNode.innerHTML = "";

    const api = new JitsiAPI("meet.jit.si", {
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
      },
      interfaceConfigOverwrite: {
        MOBILE_APP_PROMO: false,
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
      },
    });

    apiRef.current = api;

    return () => {
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, [displayName, roomName]);

  return (
    <div className="relative isolate min-h-[420px] overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.95)] lg:min-h-[560px]">
      <div className="absolute left-4 top-4 z-20 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
        {sessionLabel ?? "Live session"}
      </div>
      <div className="absolute inset-0">
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </div>
  );
};

export default VideoPlaceholder;
