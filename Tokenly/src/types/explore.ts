export type ExploreTab = "requests" | "helpers" | "skills";

export type Urgency = "High" | "Medium" | "Low";
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

export interface PersonSummary {
  name: string;
  initials: string;
  avatarBg: string;
  rating?: number;
}

export interface RequestItem {
  id: string;
  category: string;
  urgency: Urgency;
  title: string;
  description: string;
  tags: string[];
  duration: number;
  offers: number;
  credits: number;
  postedAgo: string;
  author: PersonSummary;
}

export interface HelperItem {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  rating: number;
  online: boolean;
  responseTime: string;
  bio: string;
  badges: string[];
  categories: string[];
  skills: string[];
  sessions: number;
  successRate: number;
  creditsPerHour: number;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  level: SkillLevel;
  description: string;
  helpers: number;
  avgRating: number;
  sessions: number;
  topHelpers: {
    initials: string;
    avatarBg: string;
  }[];
}

export interface ExploreStats {
  activeRequests: number;
  helpersOnline: number;
  sessionsToday: number;
  creditsExchanged: string;
}