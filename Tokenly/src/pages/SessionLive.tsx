import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import VideoPlaceholder from '../components/session/live/VideoPlaceHolder';
import ChatWindow from '../components/session/live/ChatWindow';
import FileManager from '../components/session/live/FileManager';
import Checklist from '../components/session/live/Checklist';
import type { Message, ChecklistItem, FileAttachment } from '../types/session';

const SessionLivePage: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: '1', text: 'Introduction and goal setting', completed: false },
    { id: '2', text: 'Main topic discussion', completed: false },
    { id: '3', text: 'Q&A and clarification', completed: false },
    { id: '4', text: 'Action items and next steps', completed: false },
  ]);
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isActive, setIsActive] = useState(true);

  // Mock current user
  const currentUserId = 'current-user-123';

  useEffect(() => {
    // Mock initial messages
    setMessages([
      {
        id: '1',
        text: 'Hi! Ready to start the session?',
        senderId: 'other-user',
        senderName: 'Alex Chen',
        timestamp: new Date(),
      },
      {
        id: '2',
        text: "Yes, let's get started! I have some questions about TypeScript generics.",
        senderId: currentUserId,
        senderName: 'You',
        timestamp: new Date(Date.now() - 5 * 60000),
      },
    ]);
  }, []);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      senderId: currentUserId,
      senderName: 'You',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleToggleItem = (itemId: string) => {
    setChecklistItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAddItem = (text: string) => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    setChecklistItems(prev => [...prev, newItem]);
  };

  const handleFileUpload = async (file: File) => {
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newFile: FileAttachment = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedBy: 'You',
      uploadedAt: new Date(),
    };
    setFiles(prev => [...prev, newFile]);
  };

  const handleDownload = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      window.open(file.url, '_blank');
    }
  };

  const handleLeaveSession = () => {
    navigate('/sessions');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <h1 className="text-lg font-semibold text-gray-900">
          Live Session: TypeScript Generics
        </h1>
        <p className="text-sm text-gray-500">With Alex Chen • 30 min session</p>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <VideoPlaceholder
            isVideoEnabled={isVideoEnabled}
            participantCount={2}
            onToggleVideo={() => setIsVideoEnabled(!isVideoEnabled)}
            onToggleAudio={() => console.log('Toggle audio')}
            onShareScreen={() => console.log('Share screen')}
          />
          <FileManager
            sessionId={sessionId || ''}
            onFileUpload={handleFileUpload}
            files={files}
            onDownload={handleDownload}
          />
        </div>

        <div className="w-96 flex flex-col gap-4">
          <div className="flex-1">
            <ChatWindow
              sessionId={sessionId || ''}
              messages={messages}
              onSendMessage={handleSendMessage}
              isActive={isActive}
              currentUserId={currentUserId}
            />
          </div>
          <Checklist
            items={checklistItems}
            onToggleItem={handleToggleItem}
            onAddItem={handleAddItem}
            isEditable={true}
          />
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 px-6 py-3 flex justify-center">
        <button
          onClick={handleLeaveSession}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Leave Session
        </button>
      </div>
    </div>
  );
};

export default SessionLivePage;