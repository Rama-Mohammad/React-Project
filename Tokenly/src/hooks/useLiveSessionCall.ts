import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type ConnectionStatus = "idle" | "joining" | "waiting" | "connecting" | "connected" | "error";

type SignalPayload =
  | { type: "join"; from: string }
  | { type: "ready"; from: string }
  | { type: "offer"; from: string; description: RTCSessionDescriptionInit }
  | { type: "answer"; from: string; description: RTCSessionDescriptionInit }
  | { type: "candidate"; from: string; candidate: RTCIceCandidateInit }
  | { type: "leave"; from: string };

type UseLiveSessionCallOptions = {
  sessionId: string;
  userId: string;
  enabled: boolean;
  isInitiator: boolean;
};

type LegacyNavigator = Navigator & {
  getUserMedia?: (
    constraints: MediaStreamConstraints,
    successCallback: (stream: MediaStream) => void,
    errorCallback: (error: DOMException) => void
  ) => void;
  webkitGetUserMedia?: (
    constraints: MediaStreamConstraints,
    successCallback: (stream: MediaStream) => void,
    errorCallback: (error: DOMException) => void
  ) => void;
  mozGetUserMedia?: (
    constraints: MediaStreamConstraints,
    successCallback: (stream: MediaStream) => void,
    errorCallback: (error: DOMException) => void
  ) => void;
};

export function useLiveSessionCall({
  sessionId,
  userId,
  enabled,
  isInitiator,
}: UseLiveSessionCallOptions) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [participantCount, setParticipantCount] = useState(1);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);
  const remoteJoinedRef = useRef(false);
  const remoteSignalSeenRef = useRef(false);
  const makingOfferRef = useRef(false);
  const isApplyingRemoteDescriptionRef = useRef(false);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const offerRetryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const presencePollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const readyHeartbeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isSubscribedRef = useRef(false);

  const getUserMediaCompat = async (constraints: MediaStreamConstraints) => {
    if (typeof navigator === "undefined") {
      throw new Error("Camera and microphone are only available in a browser.");
    }

    if (navigator.mediaDevices?.getUserMedia) {
      return navigator.mediaDevices.getUserMedia(constraints);
    }

    const legacyNavigator = navigator as LegacyNavigator;
    const legacyGetUserMedia =
      legacyNavigator.getUserMedia ??
      legacyNavigator.webkitGetUserMedia ??
      legacyNavigator.mozGetUserMedia;

    if (!legacyGetUserMedia) {
      throw new Error(
        window.isSecureContext
          ? "This browser does not support camera and microphone access."
          : "Camera and microphone need HTTPS on deployed links. Open the secure site or use localhost."
      );
    }

    return new Promise<MediaStream>((resolve, reject) => {
      legacyGetUserMedia.call(legacyNavigator, constraints, resolve, reject);
    });
  };

  const getDisplayMediaCompat = async (constraints: DisplayMediaStreamOptions) => {
    if (typeof navigator === "undefined") {
      throw new Error("Screen sharing is only available in a browser.");
    }

    if (navigator.mediaDevices?.getDisplayMedia) {
      return navigator.mediaDevices.getDisplayMedia(constraints);
    }

    throw new Error("Screen sharing is not supported on this device or browser.");
  };

  const acquireCameraStream = async () => {
    const attempts: MediaStreamConstraints[] = [
      {
        video: {
          facingMode: { ideal: "user" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      },
      {
        video: {
          facingMode: { ideal: "user" },
        },
        audio: true,
      },
      {
        video: true,
        audio: true,
      },
      {
        video: true,
        audio: false,
      },
    ];

    let lastError: unknown = null;

    for (const constraints of attempts) {
      try {
        return await getUserMediaCompat(constraints);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new Error("Camera or microphone access could not be started on this device.");
  };

  const sendSignal = async (payload: SignalPayload) => {
  console.log("📤 SENDING SIGNAL:", payload);
  const channel = channelRef.current;

  if (!channel || !isSubscribedRef.current) return;

  try {
    await channel.send({
      type: "broadcast",
      event: "signal",
      payload,
    });
  } catch (err) {
    console.warn("sendSignal failed:", err);
  }
};

  useEffect(() => {
    if (!enabled || !sessionId || !userId) return;

    let isMounted = true;
    let hasStartedRealtime = false;

    const flushPendingCandidates = async (peer: RTCPeerConnection) => {
      while (pendingCandidatesRef.current.length > 0) {
        const candidate = pendingCandidatesRef.current.shift();
        if (!candidate) continue;
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    const buildPeer = () => {
      if (peerRef.current) return peerRef.current;

      const iceServers: RTCIceServer[] = [
        { urls: "stun:stun.relay.metered.ca:80" },
        {
          urls: "turn:global.relay.metered.ca:80",
          username: "b444aa5228652c4e98ce05be",
          credential: "gNXOQ+F2vZfl38gT",
        },
        {
          urls: "turn:global.relay.metered.ca:80?transport=tcp",
          username: "b444aa5228652c4e98ce05be",
          credential: "gNXOQ+F2vZfl38gT",
        },
        {
          urls: "turn:global.relay.metered.ca:443",
          username: "b444aa5228652c4e98ce05be",
          credential: "gNXOQ+F2vZfl38gT",
        },
        {
          urls: "turns:global.relay.metered.ca:443?transport=tcp",
          username: "b444aa5228652c4e98ce05be",
          credential: "gNXOQ+F2vZfl38gT",
        },
      ];

      const peer = new RTCPeerConnection({
        iceServers,
      });

      peer.onicecandidate = async (event) => {
        if (!event.candidate) return;
        await sendSignal({
          type: "candidate",
          from: userId,
          candidate: event.candidate.toJSON(),
        });
      };

      peer.ontrack = (event) => {
        remoteSignalSeenRef.current = true;
        const stream =
          event.streams[0] ??
          remoteStreamRef.current ??
          new MediaStream();

        if (!remoteStreamRef.current) {
          remoteStreamRef.current = stream;
        }

        if (!event.streams[0]) {
          stream.addTrack(event.track);
        }

        if (isMounted) {
          setRemoteStream(stream);
          setParticipantCount(2);
          if (peer.connectionState !== "connected") {
            setConnectionStatus("connecting");
          }
        }
      };

      peer.onnegotiationneeded = async () => {
        if (!isInitiator) return;
        if (!remoteJoinedRef.current) return;
        await maybeCreateOffer();
      };

      peer.onconnectionstatechange = () => {
        const state = peer.connectionState;
        if (!isMounted) return;

        if (state === "connected") {
          setConnectionStatus("connected");
          setErrorMessage("");
          return;
        }

        if (state === "connecting") {
          setConnectionStatus("connecting");
          return;
        }

        // if (state === "failed" || state === "disconnected") {
        //   setConnectionStatus("error");
        //   setErrorMessage(
        //     "The call connection dropped. If this keeps happening across devices, add TURN credentials in .env."
        //   );
        // }
        if (state === "failed") {
  setConnectionStatus("error");
  setErrorMessage("Connection failed. Please try rejoining the call.");
  return;
}

if (state === "disconnected") {
  // DON'T treat as error — could be user leaving or temporary drop
  if (remoteStreamRef.current) {
    setConnectionStatus("waiting");
    setErrorMessage("");
  }
  return;
}
      };

peer.oniceconnectionstatechange = () => {
  const state = peer.iceConnectionState;

  if (!isMounted) return;

  console.log("ICE STATE:", state);

  if (state === "connected" || state === "completed") {
    setConnectionStatus("connected");
    setErrorMessage("");
    return;
  }

  if (state === "checking" || state === "new") {
    setConnectionStatus("connecting");
    return;
  }

  if (state === "disconnected") {
    // 🔥 IMPORTANT: treat as temporary or peer left
    setConnectionStatus("waiting");
    setErrorMessage("");
    return;
  }

  if (state === "failed") {
    // ❌ DO NOT show error immediately
    setConnectionStatus("waiting");
    setErrorMessage("");
  }
};

      const currentStream = localStreamRef.current;
      if (currentStream) {
        currentStream.getTracks().forEach((track) => {
          peer.addTrack(track, currentStream);
        });
      }

      peerRef.current = peer;
      return peer;
    };

 

    const maybeCreateOffer = async () => {
      if (!isInitiator) return;
      if (!remoteJoinedRef.current) return;

      const peer = buildPeer();
      if (
        makingOfferRef.current ||
        isApplyingRemoteDescriptionRef.current ||
        peer.signalingState !== "stable"
      ) {
        return;
      }
      if (peer.remoteDescription) return;

      makingOfferRef.current = true;
      try {
        setConnectionStatus("connecting");
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        await sendSignal({
          type: "offer",
          from: userId,
          description: offer,
        });
      } catch (error) {
        if (isMounted) {
          setConnectionStatus("error");
          setErrorMessage(error instanceof Error ? error.message : "Could not start the call.");
        }
      } finally {
        makingOfferRef.current = false;
      }
    };

    const updatePresenceState = () => {
      const channel = channelRef.current;
      if (!channel) return;

      const state = channel.presenceState() as Record<string, unknown[]>;
      const participantIds = Object.keys(state);
      const hasRemotePresence = participantIds.some((id) => id !== userId);
      const hasRemoteParticipant =
        hasRemotePresence || remoteSignalSeenRef.current || Boolean(remoteStreamRef.current);

      remoteJoinedRef.current = hasRemoteParticipant;
      if (isMounted) {
        setParticipantCount(hasRemoteParticipant ? Math.max(participantIds.length, 2) : 1);
        if (!hasRemoteParticipant && peerRef.current?.connectionState !== "connected") {
          setConnectionStatus("waiting");
          setRemoteStream(null);
        }
      }

      if (hasRemoteParticipant) {
        void maybeCreateOffer();
      }
    };

    const handleSignal = async (payload: SignalPayload) => {
      if (payload.from === userId) return;

      const peer = buildPeer();

      if (payload.type === "join" || payload.type === "ready") {
        remoteSignalSeenRef.current = true;
        remoteJoinedRef.current = true;
        if (isMounted && peerRef.current?.connectionState !== "connected") {
          setParticipantCount(2);
          setConnectionStatus("connecting");
        }
        if (payload.type === "join") {
          await sendSignal({ type: "ready", from: userId });
        }
        if (isInitiator) {
          await maybeCreateOffer();
        }
        return;
      }

      if (payload.type === "offer") {
        remoteSignalSeenRef.current = true;
        remoteJoinedRef.current = true;
        setParticipantCount(2);
        setConnectionStatus("connecting");
        isApplyingRemoteDescriptionRef.current = true;
        try {
          if (peer.signalingState !== "stable" && peer.localDescription) {
            await peer.setLocalDescription({ type: "rollback" });
          }

          await peer.setRemoteDescription(new RTCSessionDescription(payload.description));
        } finally {
          isApplyingRemoteDescriptionRef.current = false;
        }
        await flushPendingCandidates(peer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        await sendSignal({
          type: "answer",
          from: userId,
          description: answer,
        });
        return;
      }

      if (payload.type === "answer") {
        remoteSignalSeenRef.current = true;
        isApplyingRemoteDescriptionRef.current = true;
        try {
          await peer.setRemoteDescription(new RTCSessionDescription(payload.description));
        } finally {
          isApplyingRemoteDescriptionRef.current = false;
        }
        await flushPendingCandidates(peer);
        setConnectionStatus("connecting");
        return;
      }

      if (payload.type === "candidate") {
        remoteSignalSeenRef.current = true;
        if (peer.remoteDescription) {
          await peer.addIceCandidate(new RTCIceCandidate(payload.candidate));
        } else {
          pendingCandidatesRef.current.push(payload.candidate);
        }
        return;
      }

      // if (payload.type === "leave") {
      //   remoteJoinedRef.current = false;
      //   remoteSignalSeenRef.current = false;
      //   remoteStreamRef.current = null;
      //   if (isMounted) {
      //     setParticipantCount(1);
      //     setRemoteStream(null);
      //     setConnectionStatus("waiting");
      //   }
      // }

      if (payload.type === "leave") {
  remoteJoinedRef.current = false;
  remoteSignalSeenRef.current = false;

  const peer = peerRef.current;

  if (peer) {
    peer.getReceivers().forEach(r => {
      r.track?.stop();
    });
  }

  remoteStreamRef.current = null;

  setRemoteStream(null);
  setParticipantCount(1);
  setConnectionStatus("waiting");

  return;
}
    };

    const start = async () => {
      if (hasStartedRealtime) return;
      hasStartedRealtime = true;

      try {
        setConnectionStatus("joining");
        setErrorMessage("");
        const mediaStream = await acquireCameraStream();

        if (!isMounted) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        cameraStreamRef.current = mediaStream;
        localStreamRef.current = mediaStream;
        setLocalStream(mediaStream);
        setIsAudioEnabled(mediaStream.getAudioTracks().some((track) => track.enabled));
        setIsVideoEnabled(mediaStream.getVideoTracks().some((track) => track.enabled));
        setErrorMessage("");
        setConnectionStatus("waiting");
        setParticipantCount(1);

        buildPeer();

        const channel = supabase.channel(`live-session:${sessionId}`, {
          config: {
            broadcast: { self: false },
            presence: { key: userId },
          },
        });

        channelRef.current = channel;

        channel.on("broadcast", { event: "signal" }, async ({ payload }) => {
            console.log("📩 RECEIVED SIGNAL:", payload);
          try {
            await handleSignal(payload as SignalPayload);
          } catch (error) {
            if (isMounted) {
              setConnectionStatus("error");
              setErrorMessage(
                error instanceof Error ? error.message : "The live session hit a signaling error."
              );
            }
          }
        });

        channel.on("presence", { event: "sync" }, () => {
          updatePresenceState();
        });

        channel.on("presence", { event: "join" }, () => {
          updatePresenceState();
        });

        channel.on("presence", { event: "leave" }, () => {
          updatePresenceState();
        });

        channel.subscribe(async (status) => {
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
            isSubscribedRef.current = false;

            if (readyHeartbeatTimerRef.current) {
              clearInterval(readyHeartbeatTimerRef.current);
              readyHeartbeatTimerRef.current = null;
            }
            if (offerRetryTimerRef.current) {
              clearInterval(offerRetryTimerRef.current);
              offerRetryTimerRef.current = null;
            }
            if (presencePollTimerRef.current) {
              clearInterval(presencePollTimerRef.current);
              presencePollTimerRef.current = null;
            }

            if (!isMounted) return;

            if (reconnectAttemptsRef.current < 3) {
              reconnectAttemptsRef.current += 1;
              setConnectionStatus("connecting");
              setErrorMessage(`Reconnecting to the live session... (${reconnectAttemptsRef.current}/3)`);

              if (channelRef.current) {
                void supabase.removeChannel(channelRef.current);
                channelRef.current = null;
              }

              if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
              }

              reconnectTimerRef.current = setTimeout(() => {
                hasStartedRealtime = false;
                void start();
              }, 1200);
              return;
            }

            setConnectionStatus("error");
            setErrorMessage("The live session realtime channel could not stay connected.");
            return;
          }

          if (status !== "SUBSCRIBED") return;
          reconnectAttemptsRef.current = 0;
          isSubscribedRef.current = true;
          setErrorMessage("");

          try {
            await channel.track({
              userId,
              joinedAt: new Date().toISOString(),
            });
            await sendSignal({ type: "join", from: userId });
            await sendSignal({ type: "ready", from: userId });
          } catch {
            if (isMounted) {
              setConnectionStatus("connecting");
              setErrorMessage("Connected to the room, retrying live session sync...");
            }
          }

          updatePresenceState();
          readyHeartbeatTimerRef.current = setInterval(() => {
            void sendSignal({ type: "ready", from: userId });
          }, 2000);
          offerRetryTimerRef.current = setInterval(() => {
            if (isInitiator && remoteJoinedRef.current) {
              void maybeCreateOffer();
            }
          }, 2500);
          presencePollTimerRef.current = setInterval(() => {
            updatePresenceState();
          }, 1500);
        });
      } catch (error) {
        if (isMounted) {
          setConnectionStatus("error");
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Camera or microphone access is required to join the call."
          );
        }
      }
    };

    void start();

    return () => {
      isMounted = false;
      if (offerRetryTimerRef.current) {
        clearInterval(offerRetryTimerRef.current);
        offerRetryTimerRef.current = null;
      }
      if (presencePollTimerRef.current) {
        clearInterval(presencePollTimerRef.current);
        presencePollTimerRef.current = null;
      }
      if (readyHeartbeatTimerRef.current) {
        clearInterval(readyHeartbeatTimerRef.current);
        readyHeartbeatTimerRef.current = null;
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      isSubscribedRef.current = false;
      reconnectAttemptsRef.current = 0;
      void sendSignal({ type: "leave", from: userId });
      if (channelRef.current) {
        void supabase.removeChannel(channelRef.current);
      }
      channelRef.current = null;
      peerRef.current?.close();
      peerRef.current = null;
      pendingCandidatesRef.current = [];
      remoteJoinedRef.current = false;
      remoteSignalSeenRef.current = false;
      remoteStreamRef.current = null;
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
      screenTrackRef.current?.stop();
      screenTrackRef.current = null;
      setRemoteStream(null);
    };
  }, [enabled, isInitiator, sessionId, userId]);

  const toggleAudio = () => {
    const stream = cameraStreamRef.current ?? localStreamRef.current;
    if (!stream) return;

    const nextEnabled = !isAudioEnabled;
    stream.getAudioTracks().forEach((track) => {
      track.enabled = nextEnabled;
    });
    setIsAudioEnabled(nextEnabled);
  };

  const toggleVideo = () => {
    const videoTrack =
      localStreamRef.current?.getVideoTracks()[0] ?? cameraStreamRef.current?.getVideoTracks()[0] ?? null;
    if (!videoTrack) return;

    const nextEnabled = !isVideoEnabled;
    videoTrack.enabled = nextEnabled;
    setIsVideoEnabled(nextEnabled);
  };

  const replaceActiveVideoTrack = async (track: MediaStreamTrack) => {
    const peer = peerRef.current;
    const sender = peer?.getSenders().find((item) => item.track?.kind === "video");
    if (sender) {
      await sender.replaceTrack(track);
    }

  

    const audioTracks = (cameraStreamRef.current ?? localStreamRef.current)?.getAudioTracks() ?? [];
    const previewStream = new MediaStream([track, ...audioTracks]);
    localStreamRef.current = previewStream;
    setLocalStream(previewStream);
    setIsVideoEnabled(track.enabled);
  };

  const stopScreenShare = async () => {
    const cameraTrack = cameraStreamRef.current?.getVideoTracks()[0];
    if (!cameraTrack) return;

    screenTrackRef.current?.stop();
    screenTrackRef.current = null;
    await replaceActiveVideoTrack(cameraTrack);
    setIsScreenSharing(false);
  };

const leaveCall = async () => {
  try {
    setConnectionStatus("idle");

    if (channelRef.current && isSubscribedRef.current) {
  try {
    await channelRef.current.send({
      type: "broadcast",
      event: "signal",
      payload: { type: "leave", from: userId },
    });
  } catch {}
}

    // peerRef.current?.close();
    // peerRef.current = null;

    const peer = peerRef.current;

if (peer) {
  peer.getSenders().forEach(s => {
    try {
      s.track?.stop();
    } catch {}
  });

  peer.getReceivers().forEach(r => {
    try {
      r.track?.stop();
    } catch {}
  });

  peer.ontrack = null;
  peer.onicecandidate = null;
  peer.onconnectionstatechange = null;
  peer.oniceconnectionstatechange = null;

  peer.close();
}
peerRef.current = null;

    if (channelRef.current) {
      await supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    isSubscribedRef.current = false;

    // 4. Stop media tracks safely
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    cameraStreamRef.current?.getTracks().forEach(t => t.stop());
    screenTrackRef.current?.stop();

    // 5. Clear refs + state
    localStreamRef.current = null;
    cameraStreamRef.current = null;
    screenTrackRef.current = null;

    setLocalStream(null);
    setRemoteStream(null);

  } catch (err) {
    console.error("leaveCall error", err);
  }
};

  const isMobileDevice = () => {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};


  const toggleScreenShare = async () => {
  if (isScreenSharing) {
    await stopScreenShare();
    return;
  }

  if (isMobileDevice()) {
    setErrorMessage("Screen sharing is not supported on mobile devices.");
    return;
  }

  try {
    const displayStream = await getDisplayMediaCompat({ video: true });
    const screenTrack = displayStream.getVideoTracks()[0];
    if (!screenTrack) return;

    screenTrackRef.current = screenTrack;
    await replaceActiveVideoTrack(screenTrack);
    setIsScreenSharing(true);

    screenTrack.onended = () => {
      void stopScreenShare();
    };
  } catch (error) {
    setErrorMessage(
      error instanceof Error ? error.message : "Could not start screen sharing."
    );
  }
};

  return {
    localStream,
    remoteStream,
    connectionStatus,
    participantCount,
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    errorMessage,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    leaveCall,
  };
}
