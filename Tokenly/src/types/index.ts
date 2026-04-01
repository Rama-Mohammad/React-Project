// src/types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  creditBalance: number;
  role: 'user' | 'admin';
  skills: string[];
  rating: number;
  bio?: string;
  portfolio?: PortfolioItem[];
  createdAt: Date;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
}

export interface Request {
  id: string;
  title: string;
  skill: string;
  category: string;
  description: string;
  duration: number;
  urgency: 'High' | 'Medium' | 'Low';
  requesterId: string;
  requester: {
    id: string;
    name: string;
    rating: number;
    avatar?: string;
  };
  createdAt: Date;
  offerCount: number;
  status: 'open' | 'in-progress' | 'completed';
  offers?: Offer[];
}

export interface Offer {
  id: string;
  requestId: string;
  helperId: string;
  helper: {
    id: string;
    name: string;
    rating: number;
    skills: string[];
  };
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

// Make sure Session is exported
export interface Session {
  id: string;
  requestId: string;
  helperId: string;
  requesterId: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledTime: Date;
  duration: number;
  notes?: string;
  creditAmount: number;
  goals?: SessionGoal[];
  messages?: Message[];
  checklist?: ChecklistItem[];
  title?: string; // Add this for display purposes
}

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

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earned' | 'spent';
  description: string;
  sessionId?: string;
  createdAt: Date;
}