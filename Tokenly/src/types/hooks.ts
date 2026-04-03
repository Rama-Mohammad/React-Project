import type { RefObject } from "react";
import type { AuthSession, AuthUser } from "./auth";
import type { Notification } from "./notification";
import type { Offer, OfferStatus } from "./offer";
import type { Profile } from "./profile";
import type { Request, RequestStatus, Urgency } from "./request";
import type { Review } from "./review";
import type { Session, SessionStatus } from "./session";
import type { Skill, SkillCategory, SkillLevel } from "./skill";
import type { Transaction, TransactionType } from "./transaction";

export type UseInViewResult = [RefObject<HTMLDivElement | null>, boolean];

export type UseAuthResult = {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  error: string;
  successMessage: string;
  isAuthenticated: boolean;
  signUp: (
    email: string,
    password: string,
    metadata?: { username?: string; full_name?: string },
  ) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (newPassword: string) => Promise<boolean>;
};

export type UseNotificationsResult = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string;
  fetchNotifications: (user_id: string) => Promise<void>;
  fetchUnread: (user_id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: (user_id: string) => Promise<boolean>;
  removeNotification: (id: string) => Promise<boolean>;
  subscribeToLive: (user_id: string) => () => void;
};

export type UseOffersResult = {
  offer: Offer | null;
  offers: Offer[];
  loading: boolean;
  error: string;
  submitOffer: (request_id: string, helper_id: string, message?: string) => Promise<boolean>;
  fetchOffersByRequest: (request_id: string) => Promise<void>;
  fetchOffersByHelper: (helper_id: string) => Promise<void>;
  changeOfferStatus: (id: string, status: OfferStatus) => Promise<boolean>;
  removeOffer: (id: string) => Promise<boolean>;
};

export type EditProfileInput = {
  username?: string;
  full_name?: string;
  bio?: string;
  profile_image_url?: string;
};

export type UseProfilesResult = {
  profile: Profile | null;
  results: Profile[];
  loading: boolean;
  error: string;
  fetchProfileById: (id: string) => Promise<void>;
  fetchProfileByUsername: (username: string) => Promise<void>;
  editProfile: (id: string, updates: EditProfileInput) => Promise<boolean>;
  search: (query: string) => Promise<void>;
};

export type RequestFilters = {
  category?: string;
  urgency?: Urgency;
  max_duration?: number;
};

export type RequestInput = {
  requester_id: string;
  title: string;
  description: string;
  category?: string;
  urgency: Urgency;
  duration_minutes?: number;
  credit_cost: number;
  tags?: string[];
};

export type UseRequestsResult = {
  request: Request | null;
  requests: Request[];
  loading: boolean;
  error: string;
  fetchRequestById: (id: string) => Promise<void>;
  fetchRequestsByUser: (user_id: string) => Promise<void>;
  fetchOpenRequests: (filters?: RequestFilters) => Promise<void>;
  submitRequest: (data: RequestInput) => Promise<boolean>;
  changeRequestStatus: (id: string, status: RequestStatus) => Promise<boolean>;
  removeRequest: (id: string) => Promise<boolean>;
};

export type ReviewInput = {
  session_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
};

export type UseReviewsResult = {
  review: Review | null;
  reviews: Review[];
  hasReviewed: boolean;
  loading: boolean;
  error: string;
  submitReview: (data: ReviewInput) => Promise<boolean>;
  fetchReviewsByUser: (reviewee_id: string) => Promise<void>;
  fetchReviewBySession: (session_id: string, reviewer_id: string) => Promise<void>;
  checkHasReviewed: (session_id: string, reviewer_id: string) => Promise<void>;
};

export type SessionStartInput = {
  request_id: string;
  offer_id: string;
  helper_id: string;
  requester_id: string;
  scheduled_at?: string;
  duration_minutes?: number;
};

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

export type SkillInput = {
  user_id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  description?: string;
};

export type SkillUpdateInput = {
  name?: string;
  category?: SkillCategory;
  level?: SkillLevel;
  description?: string;
};

export type UseSkillsResult = {
  skills: Skill[];
  loading: boolean;
  error: string;
  fetchSkillsByUser: (user_id: string) => Promise<void>;
  addSkill: (data: SkillInput) => Promise<boolean>;
  editSkill: (id: string, updates: SkillUpdateInput) => Promise<boolean>;
  removeSkill: (id: string) => Promise<boolean>;
};

export type CreditSummary = {
  earned: number;
  spent: number;
  total: number;
};

export type TransactionInput = {
  user_id: string;
  session_id?: string;
  amount: number;
  type: TransactionType;
  description?: string;
};

export type UseTransactionsResult = {
  transactions: Transaction[];
  summary: CreditSummary | null;
  loading: boolean;
  error: string;
  fetchTransactionsByUser: (user_id: string) => Promise<void>;
  fetchTransactionsBySession: (session_id: string) => Promise<void>;
  fetchCreditSummary: (user_id: string) => Promise<void>;
  addTransaction: (data: TransactionInput) => Promise<boolean>;
};
