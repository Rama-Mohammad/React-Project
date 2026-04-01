// src/types/index.ts




export interface SessionGoal {
  id: string;
  description: string;
  completed: boolean;
}

export interface ChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: Date;
}

export interface Message {
  id: string;
  sessionId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'code';
  fileUrl?: string;
}

export interface Rating {
  id: string;
  sessionId: string;
  raterId: string;
  ratedId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface DashboardStats {
  creditBalance: number;
  activeRequests: number;
  completedSessions: number;
  upcomingSessions: number;
  totalHelpGiven: number;
  totalHelpReceived: number;
}
