import type { Session, Transaction } from ".";

export interface ActivityFeedProps {
  transactions: Transaction[];
  onViewAll: () => void;
}

export interface CreditBalanceCardProps {
  balance: number;
  onViewHistory: () => void;
}

export interface MiniSessionCardProps {
  sessions: Session[];
  onJoinSession: (sessionId: string) => void;
}

export type SessionTabLabel = "All" | "Upcoming" | "Active" | "Completed";

export type DashboardSessionItem = {
  id: string;
  topic: string;
  skill: string;
  status: "Upcoming" | "Active Now" | "Completed";
  role: "Helping" | "Receiving help";
  person: string;
  date: string;
  duration: string;
  credits: number;
  action?: string;
  rating?: number;
};

export type DashboardRequestItem = {
  id: string;
  title: string;
  urgency: string;
  offers: number;
  age: string;
  credits: number;
};

export type DashboardOfferItem = {
  id: string;
  title: string;
  status: "Accepted" | "Pending";
  user: string;
  age: string;
  credits: number;
};
