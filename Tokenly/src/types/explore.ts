export type ExploreTab = "requests" | "helpers" | "skills" | "offers";

export type Urgency = "High" | "Medium" | "Low";
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

export interface PersonSummary {
  name: string;
  initials: string;
  avatarBg: string;
  profileImageUrl?: string;
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
  profileImageUrl?: string;      
  rating: number;
  online: boolean;   
  lastSeen?: string; 
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
    name?: string;
    rating?: number;
    initials: string;
    avatarBg: string;
    profileImageUrl?: string;
  }[];
}

export interface HelpOfferItem {
  id: string;
  helperId: string;
  helperName: string;
  helperInitials: string;
  helperAvatarBg: string;
  helperProfileImageUrl?: string;
  helperRating: number;
  title: string;
  description: string;
  category: string;
  urgency: "low" | "medium" | "high" | null;
  durationMinutes: number | null;
  credits: number;
  status: "open" | "closed" | "accepted";
  postedAgo: string;
  createdAt: string;
  skillNames: string[]; 
}

// Kept for backwards compat in components that still reference OfferItem
// Remove this once all consumers are migrated to HelpOfferItem
/** @deprecated Use HelpOfferItem instead */
export type OfferItem = HelpOfferItem;

export interface ExploreStats {
  activeRequests: number;
  helpersOnline: number;
  sessionsToday: number;
  creditsExchanged: string;
}

export interface FilterSideBarProps {
  activeTab: ExploreTab;
  categories: string[];
  urgencyOptions: string[];
  durationOptions: string[];
  ratingOptions: string[];
  levelOptions: string[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  urgency: string;
  onUrgencyChange: (value: string) => void;
  duration: string;
  onDurationChange: (value: string) => void;
  rating: string;
  onRatingChange: (value: string) => void;
  onlineOnly: boolean;
  onOnlineOnlyChange: (value: boolean) => void;
  level: string;
  onLevelChange: (value: string) => void;
  totalCount: number;
}

export interface CategoryTabsProps {
  activeTab: ExploreTab;
  onChange: (tab: ExploreTab) => void;
  counts: {
    requests: number;
    helpers: number;
    skills: number;
    offers: number;
  };
}

export interface SearchBarProps {
  activeTab: ExploreTab;
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export interface HelperCardProps {
  item: HelperItem;
}

export interface RequestCardProps {
  item: RequestItem;
}

export interface ExploreSkillCardProps {
  item: SkillItem;
}

export interface HelpOfferCardProps {
  item: HelpOfferItem;
}

export interface StatsHeroProps {
  stats: ExploreStats;
  defaultHelperId?: string;
  openHowItWorks?: boolean;
}
