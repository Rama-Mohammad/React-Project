import React, { useState, useEffect, useRef } from 'react';
import type { VideoPlaceholderProps } from '../../../types/session';

const VideoPlaceholder: React.FC<VideoPlaceholderProps> = ({
  isVideoEnabled,
  participantCount,
  onToggleVideo,
  onToggleAudio,
  onShareScreen,
}) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<'connecting' | 'live'>('connecting');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get camera & microphone
  useEffect(() => {
    const startLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStatus('live');
      } catch (err) {
        console.error('Error accessing camera/mic', err);
        setStatus('connecting');
      }
    };

    startLocalStream();

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleToggleAudio = () => {
    if (!localStream) return;
    const audioTracks = localStream.getAudioTracks();
    audioTracks.forEach(track => (track.enabled = !isAudioEnabled));
    setIsAudioEnabled(!isAudioEnabled);
    onToggleAudio();
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden relative shadow-lg">
      {/* LIVE indicator */}
      {status === 'live' && (
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded font-semibold z-10">
          LIVE
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-500 rounded-xl ${
          !isVideoEnabled ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Placeholder when video off */}
      {!isVideoEnabled && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 rounded-xl">
          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-3">
            <span className="text-xl text-gray-300 font-bold">Camera Off</span>
          </div>
          <p className="text-gray-400 text-sm">{participantCount} participants</p>
        </div>
      )}

      {/* Controls overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-gray-800 rounded-lg p-2">
        <button
          onClick={onToggleVideo}
          className={`p-2 rounded-lg transition-colors ${
            isVideoEnabled
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          Video
        </button>
        <button
          onClick={handleToggleAudio}
          className={`p-2 rounded-lg transition-colors ${
            isAudioEnabled
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {isAudioEnabled ? 'Mic On' : 'Mic Off'}
        </button>
        <button
          onClick={onShareScreen}
          className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Share Screen
        </button>
      </div>

      {/* Connecting status */}
      {status === 'connecting' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 rounded-xl">
          <p className="text-gray-300 text-sm animate-pulse">Connecting...</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlaceholder;