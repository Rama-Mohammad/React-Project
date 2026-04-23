import { ArrowRight, Camera, Code2, Globe2, Palette, Sparkles, Tag, Users } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import RatingStars from "../common/RatingStars";
import Avatar from "../common/Avatar";
import type { ExploreSkillCardProps } from "../../types/explore";

const levelStyles: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-amber-50 text-amber-700",
  Advanced: "bg-rose-50 text-rose-700",
};

function getCategoryIcon(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("design")) return <Palette size={14} />;
  if (normalized.includes("programming") || normalized.includes("web") || normalized.includes("code")) return <Code2 size={14} />;
  if (normalized.includes("photo")) return <Camera size={14} />;
  if (normalized.includes("language")) return <Globe2 size={14} />;
  return <Tag size={14} />;
}

export default function SkillCard({ item }: ExploreSkillCardProps) {
  const { isAuthenticated, authRedirectState } = useAuthRedirect();
  const ctaLink = isAuthenticated ? `/skills/${item.id}/helpers` : "/auth?mode=signin";

  return (
    <article className="explore-soft-card flex h-full flex-col overflow-hidden rounded-[24px] border border-[#dfe6f5] bg-white/92 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-indigo-100 hover:bg-white">
      <div className="flex-1 p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-50 text-indigo-500 ring-1 ring-white/80">
            <Sparkles size={18} />
          </div>

          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-white/70 ${
              levelStyles[item.level] || "bg-slate-100 text-slate-700"
            }`}
          >
            {item.level}
          </span>
        </div>

        <h3 className="text-base font-semibold leading-snug tracking-tight text-slate-900">
          {item.name}
        </h3>
        <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {getCategoryIcon(item.category)}
          {item.category}
        </p>

        <p className="mt-2.5 line-clamp-3 text-sm leading-6 text-slate-500">
          {item.description}
        </p>
      </div>

      <div className="mt-auto border-t border-slate-100/90 bg-white/62 p-5">
        <div className="mb-4 flex items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Users size={14} />
            {item.helpers} helpers
          </span>
          <span className="inline-flex items-center gap-1.5">
            <RatingStars value={item.avgRating} />
            {item.avgRating.toFixed(1)}
          </span>
          <span>{item.sessions} sessions</span>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            {item.topHelpers.slice(0, 3).map((helper) => (
              <Avatar
                key={`${item.id}-${helper.name ?? helper.initials}`}
                name={helper.name}
                imageUrl={helper.profileImageUrl}
                className="h-8 w-8 rounded-full border-2 border-white"
                imageClassName="rounded-full"
                fallbackClassName={`${helper.avatarBg} text-[10px] font-bold text-slate-800`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400">Top helpers</span>
        </div>

        <Link
          to={ctaLink}
          state={!isAuthenticated ? authRedirectState : undefined}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-500 transition duration-300 hover:gap-2 hover:text-indigo-600"
        >
          Find helpers
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
