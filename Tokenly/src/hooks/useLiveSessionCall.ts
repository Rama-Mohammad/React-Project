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
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);
  const remoteJoinedRef = useRef(false);
  const makingOfferRef = useRef(false);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const offerRetryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled || !sessionId || !userId) return;

    let isMounted = true;

    const sendSignal = async (payload: SignalPayload) => {
      const channel = channelRef.current;
      if (!channel) return;

      await channel.send({
        type: "broadcast",
        event: "signal",
        payload,
      });
    };

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
        const [stream] = event.streams;
        if (stream && isMounted) {
          setRemoteStream(stream);
        }
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

        if (state === "failed" || state === "disconnected") {
          setConnectionStatus("error");
          setErrorMessage(
            "The call connection dropped. If this keeps happening across devices, add TURN credentials in .env."
          );
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
      if (!isInitiator || !remoteJoinedRef.current) return;

      const peer = buildPeer();
      if (makingOfferRef.current || peer.signalingState !== "stable") return;
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
      const hasRemoteParticipant = participantIds.some((id) => id !== userId);

      remoteJoinedRef.current = hasRemoteParticipant;
      if (isMounted) {
        setParticipantCount(Math.max(participantIds.length, 1));
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
        remoteJoinedRef.current = true;
        if (isMounted && peerRef.current?.connectionState !== "connected") {
          setParticipantCount(2);
          setConnectionStatus("connecting");
        }
        if (payload.type === "join") {
          await sendSignal({ type: "ready", from: userId });
        }
        await maybeCreateOffer();
        return;
      }

      if (payload.type === "offer") {
        remoteJoinedRef.current = true;
        setConnectionStatus("connecting");
        await peer.setRemoteDescription(new RTCSessionDescription(payload.description));
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
        await peer.setRemoteDescription(new RTCSessionDescription(payload.description));
        await flushPendingCandidates(peer);
        setConnectionStatus("connecting");
        return;
      }

      if (payload.type === "candidate") {
        if (peer.remoteDescription) {
          await peer.addIceCandidate(new RTCIceCandidate(payload.candidate));
        } else {
          pendingCandidatesRef.current.push(payload.candidate);
        }
        return;
      }

      if (payload.type === "leave") {
        remoteJoinedRef.current = false;
        if (isMounted) {
          setParticipantCount(1);
          setRemoteStream(null);
          setConnectionStatus("waiting");
        }
      }
    };

    const start = async () => {
      try {
        setConnectionStatus("joining");
        const mediaDevices = typeof navigator !== "undefined" ? navigator.mediaDevices : undefined;
        if (!mediaDevices?.getUserMedia) {
          throw new Error("This browser does not support camera and microphone access.");
        }

        const mediaStream = await mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: true,
        });

        if (!isMounted) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        cameraStreamRef.current = mediaStream;
        localStreamRef.current = mediaStream;
        setLocalStream(mediaStream);
        setIsAudioEnabled(mediaStream.getAudioTracks().some((track) => track.enabled));
        setIsVideoEnabled(mediaStream.getVideoTracks().some((track) => track.enabled));
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

        channel.subscribe(async (status) => {
          if (status !== "SUBSCRIBED") return;
          await channel.track({
            userId,
            joinedAt: new Date().toISOString(),
          });
          await sendSignal({ type: "join", from: userId });
          offerRetryTimerRef.current = setInterval(() => {
            if (remoteJoinedRef.current) {
              void maybeCreateOffer();
            }
          }, 2500);
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
      void sendSignal({ type: "leave", from: userId });
      channelRef.current?.unsubscribe();
      channelRef.current = null;
      peerRef.current?.close();
      peerRef.current = null;
      pendingCandidatesRef.current = [];
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

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      await stopScreenShare();
      return;
    }

    try {
      const mediaDevices = typeof navigator !== "undefined" ? navigator.mediaDevices : undefined;
      if (!mediaDevices?.getDisplayMedia) {
        throw new Error("Screen sharing is not supported on this device or browser.");
      }

      const displayStream = await mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = displayStream.getVideoTracks()[0];
      if (!screenTrack) return;

      screenTrackRef.current = screenTrack;
      await replaceActiveVideoTrack(screenTrack);
      setIsScreenSharing(true);

      screenTrack.onended = () => {
        void stopScreenShare();
      };
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not start screen sharing.");
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
  };
}
