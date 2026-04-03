export type SessionStatus = "upcoming" | "active" | "completed" | "cancelled";

// export type Session = {
//   id: string;
//   request_id: string;
//   offer_id: string;
//   helper_id: string;
//   requester_id: string;
//   scheduled_at?: string;
//   duration_minutes?: number;
//   status: SessionStatus;
//   completed_at?: string;
// }

// export type SessionFile = {
//   id: string;
//   session_id: string;
//   uploader_id: string;
//   file_name: string;
//   file_url: string;
//   file_size_bytes: number;
//   created_at: string;
// };

// export type SessionGoal = {
//   id: string;
//   session_id: string;
//   label: string;
//   is_completed: boolean;
//   created_at: string;
// };

// types/session.ts
export interface Session {
  id: string;
  title: string;
  category: string;
  status: 'upcoming' | 'active' | 'completed';
  role: 'helping' | 'receiving';
  otherParticipant: {
    name: string;
    avatar?: string;
  };
  datetime: Date;
  duration: number; // in minutes
  credits: number; 
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  attachments?: File[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface VideoPlaceholderProps {
  isVideoEnabled: boolean;
  participantCount: number;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onShareScreen: () => void;
}

export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export interface FileManagerProps {
  sessionId: string;
  onFileUpload: (file: File) => void;
  files: FileAttachment[];
  onDownload: (fileId: string) => void;
}

export interface ChecklistProps {
  items: ChecklistItem[];
  onToggleItem: (itemId: string) => void;
  onAddItem: (text: string) => void;
  isEditable: boolean;
}

export interface ChatWindowProps {
  sessionId: string;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isActive: boolean;
  currentUserId: string;
}

export interface SessionListItemProps {
  session: Session;
  onJoin?: (sessionId: string) => void;
  onCancel?: (sessionId: string) => void;
  onReview?: (sessionId: string) => void;
  onViewRequest?: (sessionId: string) => void;
  onMarkComplete?: (sessionId: string) => void;
}

export type SessionFilter = "upcoming" | "active" | "completed" | "all";

export interface SessionFiltersProps {
  activeFilter: SessionFilter;
  onFilterChange: (filter: SessionFilter) => void;
  counts: {
    upcoming: number;
    active: number;
    completed: number;
  };
}
