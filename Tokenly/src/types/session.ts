// types/session.ts

export type SessionStatus = "upcoming" | "active" | "completed" | "cancelled";

export interface Session {
  id: string;
  title: string;
  category: string;
  status: SessionStatus; // ✅ Use the SessionStatus type here instead of inline
  role: 'helping' | 'receiving';
  otherParticipant: {
    name: string;
    avatar?: string;
    id?: string; // ✅ Added optional id for better user tracking
  };
  datetime: Date;
  duration: number; // in minutes
  credits: number;
  // ✅ Optional fields that might be useful
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  attachments?: FileAttachment[]; // ✅ Should be FileAttachment[], not File[]
  isRead?: boolean; // ✅ Useful for chat features
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  order?: number; // ✅ For sorting checklist items
  createdAt?: Date;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number; // in bytes
  type: string; // MIME type
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  // ✅ Optional fields
  thumbnailUrl?: string;
  isImage?: boolean;
}