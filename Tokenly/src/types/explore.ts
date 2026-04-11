export type ExploreTab = "requests" | "helpers" | "skills" | "offers";

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
    name?: string;
    rating?: number;
    initials: string;
    avatarBg: string;
  }[];
}

export interface OfferItem {
  id: string;
  source: "request" | "independent";
  helperId: string;
  requestId: string;
  createdAt: string;
  requestTitle: string;
  category: string;
  helperName: string;
  message: string;
  availability: string;
  status: string;
  credits: number;
  duration: number;
  submittedAgo: string;
}

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

export interface StatsHeroProps {
  stats: ExploreStats;
  defaultHelperId?: string;
  openHowItWorks?: boolean;
}
