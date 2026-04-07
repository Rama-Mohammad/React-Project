import type { HelperItem } from "../types/explore";
import type {
  ExploreHelpOfferRow,
  ExploreProfileRow,
  ExploreSessionRow,
  ExploreSkillRow,
} from "../services/helperExploreService";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
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
  for (let index = 0; index < name.length; index++) {
    hash += name.charCodeAt(index);
  }

  return classes[hash % classes.length];
}

export function mapProfileToHelperItem(
  profile: ExploreProfileRow,
  allSkills: ExploreSkillRow[],
  allSessions: ExploreSessionRow[],
  allHelpOffers: ExploreHelpOfferRow[]
): HelperItem {
  const name = profile.full_name?.trim() || profile.username?.trim() || "Unknown";

  const helperSkills = allSkills.filter((skill) => skill.user_id === profile.id);
  const helperSessions = allSessions.filter((session) => session.helper_id === profile.id);
  const helperOffers = allHelpOffers.filter((offer) => offer.helper_id === profile.id);

  const categories = Array.from(
    new Set(helperSkills.map((skill) => skill.category).filter(Boolean))
  );
  const skillNames = helperSkills.map((skill) => skill.name).filter(Boolean);

  const offerHourlyRates = helperOffers
    .map((offer) => {
      if (!offer.duration_minutes || offer.duration_minutes <= 0) return null;
      if (offer.credit_cost == null) return null;
      return (offer.credit_cost / offer.duration_minutes) * 60;
    })
    .filter((value): value is number => value !== null && Number.isFinite(value));

  const avgHourlyRate =
    offerHourlyRates.length > 0
      ? Math.round(offerHourlyRates.reduce((sum, rate) => sum + rate, 0) / offerHourlyRates.length)
      : 0;

  const sessions = helperSessions.length;
  const rating = profile.avg_rating ?? 0;

  const badges: string[] = [];
  if (rating >= 4.8) badges.push("Top Rated");
  if (sessions >= 20) badges.push("Experienced");
  if (sessions >= 50) badges.push("Session Pro");

  return {
    id: profile.id,
    name,
    initials: getInitials(name),
    avatarBg: getAvatarBg(name),
    rating,
    online: false,
    responseTime: "N/A",
    bio: profile.bio ?? profile.title ?? "No bio available yet.",
    badges,
    categories,
    skills: skillNames,
    sessions,
    successRate: 95,
    creditsPerHour: avgHourlyRate,
  };
}
