// components/session/live/VideoPlaceholder.tsx
import React, { useState } from 'react';

interface VideoPlaceholderProps {
  isVideoEnabled: boolean;
  participantCount: number;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onShareScreen: () => void;
}

const VideoPlaceholder: React.FC<VideoPlaceholderProps> = ({
  isVideoEnabled,
  participantCount,
  onToggleVideo,
  onToggleAudio,
  onShareScreen,
}) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const handleToggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    onToggleAudio();
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
        {!isVideoEnabled ? (
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🎥</span>
            </div>
            <p className="text-gray-400">Camera is off</p>
            <p className="text-sm text-gray-500">{participantCount} participants</p>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <p className="text-lg">📹 Video Stream Placeholder</p>
            <p className="text-sm mt-2">WebRTC integration would go here</p>
          </div>
        )}

        {/* Controls overlay */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-gray-800 rounded-lg p-2">
          <button
            onClick={onToggleVideo}
            className={`p-2 rounded-lg transition-colors ${
              isVideoEnabled ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isVideoEnabled ? '📹' : '🚫📹'}
          </button>
          <button
            onClick={handleToggleAudio}
            className={`p-2 rounded-lg transition-colors ${
              isAudioEnabled ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isAudioEnabled ? '🎤' : '🔇'}
          </button>
          <button
            onClick={onShareScreen}
            className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            🖥️
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlaceholder;