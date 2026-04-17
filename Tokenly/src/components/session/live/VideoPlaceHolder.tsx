import React, { useMemo } from "react";
import type { VideoPlaceholderProps } from "../../../types/session";

const VideoPlaceholder: React.FC<VideoPlaceholderProps> = ({
  roomName,
  displayName,
  sessionLabel,
}) => {
  const meetingSrc = useMemo(() => {
    const baseUrl = `https://meet.jit.si/${encodeURIComponent(roomName)}`;
    const configParams = new URLSearchParams({
      "config.prejoinPageEnabled": "false",
      "config.disableDeepLinking": "true",
      "config.startWithAudioMuted": "false",
      "config.startWithVideoMuted": "false",
      "config.enableWelcomePage": "false",
      "interfaceConfig.SHOW_JITSI_WATERMARK": "false",
      "interfaceConfig.SHOW_WATERMARK_FOR_GUESTS": "false",
      "interfaceConfig.MOBILE_APP_PROMO": "false",
    });

    if (displayName?.trim()) {
      configParams.set("userInfo.displayName", displayName.trim());
    }

    return `${baseUrl}#${configParams.toString()}`;
  }, [displayName, roomName]);

  return (
    <div className="relative isolate min-h-[420px] overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.95)] lg:min-h-[560px]">
      <div className="absolute left-4 top-4 z-20 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
        {sessionLabel ?? "Live session"}
      </div>

      <iframe
        title={`Tokenly live session ${roomName}`}
        src={meetingSrc}
        allow="camera; microphone; display-capture; fullscreen; autoplay; clipboard-read; clipboard-write"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
};

export default VideoPlaceholder;
