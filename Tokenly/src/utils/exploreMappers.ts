import type { Request } from "../types/request";
import type { RequestItem, SkillItem } from "../types/explore";

type RequestWithRelations = Request & {
  requester?: {
    full_name?: string;
    username?: string;
    avg_rating?: number;
    profile_image_url?: string;
  } | null;
  offers?: Array<unknown> | null;
  request_skills?: Array<{
    skill?: {
      name?: string;
    } | null;
  }> | null;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getAvatarBg(name: string) {
  const classes = [
    "bg-sky-200",
    "bg-violet-200",
    "bg-amber-200",
    "bg-rose-200",
    "bg-cyan-200",
    "bg-lime-200",
    "bg-orange-200",
    "bg-fuchsia-200",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash += name.charCodeAt(i);
  }

  return classes[hash % classes.length];
}

function getPostedAgo(dateString: string) {
  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now.getTime() - created.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function mapRequestToExploreItem(request: RequestWithRelations): RequestItem {
  const authorName =
    request.requester?.full_name ||
    request.requester?.username ||
    "Unknown User";

  return {
    id: request.id,
    category: request.category || "Other",
    urgency:
      request.urgency === "high"
        ? "High"
        : request.urgency === "medium"
        ? "Medium"
        : "Low",
    title: request.title,
    description: request.description,
    tags:
      request.request_skills?.map((item) => item.skill?.name).filter(Boolean) as string[] || [],
    duration: request.duration_minutes ?? 30,
    offers: request.offers?.length ?? 0,
    credits: request.credit_cost,
    postedAgo: getPostedAgo(request.created_at),
    author: {
      name: authorName,
      initials: getInitials(authorName),
      avatarBg: getAvatarBg(authorName),
      rating: request.requester?.avg_rating ?? 0,
    },
  };
}

export type SkillWithRelations = {
  id: string;
  name: string;
  category?: string | null;
  level: string;
  description?: string | null;
  sessions_count?: number | null;
  user_id: string;
  profile?:
    | {
        full_name?: string | null;
        username?: string | null;
        avg_rating?: number | null;
      }
    | Array<{
        full_name?: string | null;
        username?: string | null;
        avg_rating?: number | null;
      }>
    | null;
};

function toExploreSkillLevel(level: string): SkillItem["level"] {
  if (level === "advanced") return "Advanced";
  if (level === "intermediate") return "Intermediate";
  return "Beginner";
}

export function mapSkillToExploreItem(skill: SkillWithRelations): SkillItem {
  const profile = Array.isArray(skill.profile) ? (skill.profile[0] ?? null) : skill.profile ?? null;
  const ownerName =
    profile?.full_name?.trim() ||
    profile?.username?.trim() ||
    "Unknown";

  return {
    id: skill.id,
    name: skill.name,
    category: skill.category || "Other",
    level: toExploreSkillLevel(skill.level),
    description: skill.description || "No description provided yet.",
    helpers: 1,
    avgRating: profile?.avg_rating ?? 0,
    sessions: skill.sessions_count ?? 0,
    topHelpers: [
      {
        name: ownerName,
        rating: profile?.avg_rating ?? 0,
        initials: getInitials(ownerName),
        avatarBg: getAvatarBg(ownerName),
      },
    ],
  };
}
