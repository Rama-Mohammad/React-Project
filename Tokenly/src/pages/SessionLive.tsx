import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlaceholder from '../components/session/live/VideoPlaceHolder';
import ChatWindow from '../components/session/live/ChatWindow';
import FileManager from '../components/session/live/FileManager';
import Checklist from '../components/session/live/Checklist';
import type { Message, ChecklistItem, FileAttachment } from '../types/session';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faPaperclip } from '@fortawesome/free-solid-svg-icons';

type TabType = 'agenda' | 'files';

const SessionLivePage: React.FC = () => {
    const navigate = useNavigate();
    const { sessionId } = useParams();

    const [activeTab, setActiveTab] = useState<TabType>('agenda');
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

        // Mock files
        setFiles([
            {
                id: '1',
                name: 'session_notes.pdf',
                size: 1024000,
                type: 'application/pdf',
                url: '#',
                uploadedBy: 'Alex Chen',
                uploadedAt: new Date(),
            },
            {
                id: '2',
                name: 'code_examples.zip',
                size: 2048000,
                type: 'application/zip',
                url: '#',
                uploadedBy: 'You',
                uploadedAt: new Date(),
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

    const handleDeleteFile = (fileId: string) => {
        setFiles(prev => prev.filter(file => file.id !== fileId));
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
            {/* Main content */}
            <div className="flex-1 flex overflow-hidden p-4 gap-4">
                {/* Left column - Video */}
                <div className="flex-1 flex flex-col gap-4">
                    <VideoPlaceholder
                        isVideoEnabled={isVideoEnabled}
                        participantCount={2}
                        onToggleVideo={() => setIsVideoEnabled(!isVideoEnabled)}
                        onToggleAudio={() => console.log('Toggle audio')}
                        onShareScreen={() => console.log('Share screen')}
                    />
                </div>

                {/* Right column - Chat and Tabs */}
                <div className="w-96 flex flex-col gap-4">
                    {/* Chat Window */}
                    <div className="flex-1">
                        <ChatWindow
                            sessionId={sessionId || ''}
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            isActive={isActive}
                            currentUserId={currentUserId}
                        />
                    </div>

                    {/* Tabs for Agenda and Files */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        {/* Tab Headers */}
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('agenda')}
                                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'agenda'
                                    ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                                Agenda              </button>
                            <button
                                onClick={() => setActiveTab('files')}
                                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'files'
                                    ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <FontAwesomeIcon icon={faPaperclip} className="mr-2" />
                                Files ({files.length})              </button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-4 max-h-80 overflow-y-auto">
                            {activeTab === 'agenda' ? (
                                <Checklist
                                    items={checklistItems}
                                    onToggleItem={handleToggleItem}
                                    onAddItem={handleAddItem}
                                    isEditable={true}
                                />
                            ) : (
                                <FileManager
                                    sessionId={sessionId || ''}
                                    onFileUpload={handleFileUpload}
                                    files={files}
                                    onDownload={handleDownload}
                                    onDelete={handleDeleteFile}

                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Leave button */}
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