export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  bio?: string;
  profile_image_url?: string;
  cover_image_url?: string;
  credit_balance: number;
  avg_rating: number;
  created_at: string;
  email: string;
  title?: string;
  institution?: string;
  location?: string;
  website?: string;
}

export type PortfolioType = "Project" | "Article" | "Contribution";
export type ProfileSkillLevel = "Expert" | "Advanced" | "Intermediate" | "Beginner";
export type ReviewSortBy = "newest" | "oldest" | "highest" | "lowest";

export type ProfileHeaderStats = {
  totalSessions: number;
  creditsEarned: number;
  skillsTaught: number;
};

export type ProfileHeaderUser = {
  name: string;
  title: string;
  location: string;
  memberSince: string;
  bio: string;
  avatarInitials: string;
  profileImageUrl?: string;
  rating?: number;
  totalRatings?: number;
  website?: string;
  coverImage?: string;
  stats: ProfileHeaderStats;
};

export interface ProfileHeaderProps {
  user: ProfileHeaderUser;
  onEdit: () => void;
}

export type ProfileSkill = {
  id: string;
  name: string;
  category: string;
  level: ProfileSkillLevel;
  sessions: number;
  description?: string;
};

export interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (skill: Omit<ProfileSkill, "id">) => void | Promise<void>;
  onUpdate?: (skill: ProfileSkill) => void | Promise<void>;
  editSkill?: ProfileSkill | null;
  isEditMode?: boolean;
}

export interface ProfileSkillCardProps {
  skill: ProfileSkill;
  onDelete?: (id: string) => void;
  onEdit?: (skill: ProfileSkill) => void;
}

export type EditProfileUserInput = {
  name: string;
  title: string;
  location: string;
  bio: string;
  website?: string;
  profileImageUrl?: string;
  coverImage?: string;
};

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: EditProfileUserInput;
  userId: string;
  onSave: (updatedUser: EditProfileUserInput) => void | Promise<void>;
}

export type PortfolioItemData = {
  id: string;
  type: PortfolioType;
  title: string;
  date: string;
  description: string;
  tags: string[];
};

export type AddPortfolioItemInput = Omit<PortfolioItemData, "id">;

export interface AddPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: AddPortfolioItemInput) => void | Promise<void>;
  onUpdate?: (item: PortfolioItemData) => void | Promise<void>;
  editItem?: PortfolioItemData | null;
  isEditMode?: boolean;
}

export type PortfolioForm = {
  type: PortfolioType;
  title: string;
  date: string;
  description: string;
  tags: string;
};

export interface PortfolioItemProps {
  item: PortfolioItemData;
  onView?: (id: string) => void;
  onEdit?: (item: PortfolioItemData) => void;
  onDelete?: (id: string) => void;
}

export type ReviewItem = {
  id: string;
  reviewerName: string;
  date: string;
  rating: number;
  comment: string;
  skillCategory: string;
  sessionTopic: string;
};

export interface ReviewCardProps {
  review: ReviewItem;
}

export interface RatingsSummaryProps {
  reviews: Array<{ rating: number }>;
  embedded?: boolean;
  sortBy?: ReviewSortBy;
  onSortChange?: (value: ReviewSortBy) => void;
}
