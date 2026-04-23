import {
  Camera,
  Clock3,
  Code2,
  Coins,
  Eye,
  Flame,
  Gauge,
  Globe2,
  Leaf,
  MessageCircle,
  Palette,
  Sparkles,
  Tag,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import RatingStars from "../common/RatingStars";
import Avatar from "../common/Avatar";
import type { RequestCardProps } from "../../types/explore";

const categoryColors: Record<string, string> = {
  "Data Science": "bg-sky-50 text-sky-700",
  "Programming": "bg-indigo-50 text-indigo-700",
  "Design": "bg-sky-50 text-sky-700",
  "Math & Science": "bg-emerald-50 text-emerald-700",
  "Languages": "bg-amber-50 text-amber-700",
  "Finance": "bg-rose-50 text-rose-700",
  "Music": "bg-indigo-50 text-indigo-700",
  "Writing": "bg-sky-50 text-sky-700",
  "Career & Biz": "bg-violet-50 text-violet-700",
  "Photography": "bg-orange-50 text-orange-700",
  "Marketing": "bg-sky-50 text-sky-700",
  "Public Speaking": "bg-violet-50 text-violet-700",
};

const urgencyColors: Record<string, string> = {
  High: "bg-rose-50 text-rose-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-emerald-50 text-emerald-600",
};

function getCategoryIcon(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("design")) return <Palette size={14} />;
  if (normalized.includes("programming") || normalized.includes("web") || normalized.includes("code")) return <Code2 size={14} />;
  if (normalized.includes("photo")) return <Camera size={14} />;
  if (normalized.includes("language")) return <Globe2 size={14} />;
  if (normalized.includes("all")) return <Sparkles size={14} />;
  return <Tag size={14} />;
}

function getUrgencyIcon(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("high")) return <Flame size={14} />;
  if (normalized.includes("medium")) return <Gauge size={14} />;
  return <Leaf size={14} />;
}

export default function RequestCard({ item }: RequestCardProps) {
  const { isAuthenticated, authRedirectState } = useAuthRedirect();
  const ctaLink = isAuthenticated ? `/requests/${item.id}` : "/auth?mode=signin";

  return (
    <article className="explore-soft-card min-w-0 flex h-full flex-col overflow-hidden rounded-[28px] border border-[#dfe6f5] bg-white/94 transition duration-300 hover:-translate-y-0.5 hover:border-indigo-100 hover:bg-white">
      <div className="flex-1 p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2.5 sm:gap-3">
          <span
            className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-white/70 sm:px-3.5 ${
              categoryColors[item.category] || "bg-slate-100 text-slate-700"
            }`}
          >
            {getCategoryIcon(item.category)}
            <span className="truncate">{item.category}</span>
          </span>

          <span
            className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-white/70 sm:px-3.5 ${
              urgencyColors[item.urgency]
            }`}
          >
            {getUrgencyIcon(item.urgency)}
            <span className="truncate">{item.urgency} urgency</span>
          </span>
        </div>

        <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-slate-900">
          {item.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-500">
          {item.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e7ebf5] bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-500"
            >
              {getCategoryIcon(tag)}
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-[#edf1f8] bg-white/62 p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={14} />
            {item.duration} min
          </span>

          <span className="inline-flex items-center gap-1.5">
            <MessageCircle size={14} />
            {item.offers} offers
          </span>

          <span className="ml-auto">{item.postedAgo}</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar
              name={item.author.name}
              imageUrl={item.author.profileImageUrl}
              className="h-10 w-10 rounded-full"
              imageClassName="rounded-full"
              fallbackClassName={`${item.author.avatarBg} text-xs font-bold text-slate-800`}
            />

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-slate-800">
                {item.author.name}
              </div>
              <div className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500">
                <RatingStars value={item.author.rating ?? 0} />
                {item.author.rating?.toFixed(1)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:ml-auto sm:flex-nowrap">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/80 px-3.5 py-2 text-sm font-semibold text-indigo-600">
              <Coins size={14} />
              {item.credits}
            </div>

            <Link
              to={ctaLink}
              state={!isAuthenticated ? authRedirectState : undefined}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#dfe6f5] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:border-indigo-100 hover:bg-slate-50"
            >
              <Eye size={15} />
              View
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
