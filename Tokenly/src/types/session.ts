export type SessionStatus = "upcoming" | "active" | "completed" | "cancelled";
export type ReactionType = 'like' | 'love' | 'laugh' | 'wow';


export type SessionStartInput = {
  helper_id: string;
  requester_id: string;
  scheduled_at?: string;
  duration_minutes?: number;
  request_id?: string;
  offer_id?: string;
  help_offer_request_id?: string;
  direct_request_id?: string;
};


export interface Session {
  id: string;
  title: string;
  category: string;
  status: SessionStatus; 
  role: 'helping' | 'receiving';
  otherParticipant: {
    name: string;
    avatar?: string;
    id?: string; 
  };
  datetime: Date;
  duration: number;
  credits: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  requestId?: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName?: string;
  timestamp: string;
}

export interface SessionMessageDB {
  id: string;
  session_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}



export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  order?: number; 
  createdAt?: Date;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number; 
  type: string; 
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  thumbnailUrl?: string;
  isImage?: boolean;
}

export interface VideoPlaceholderProps {
  roomName: string;
  displayName?: string;
  sessionLabel?: string;
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
  onDelete: (fileId: string) => void;
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

export type UseSessionsResult = {
  session: Session | null;
  sessions: Session[];
  loading: boolean;
  error: string;
  fetchSessionById: (id: string) => Promise<void>;
  fetchSessionsByUser: (user_id: string) => Promise<void>;
  fetchSessionsByStatus: (user_id: string, status: SessionStatus) => Promise<void>;
  startSession: (data: SessionStartInput) => Promise<boolean>;
  changeSessionStatus: (id: string, status: SessionStatus) => Promise<boolean>;
};
