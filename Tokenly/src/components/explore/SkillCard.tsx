import { ArrowRight, Sparkles, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { SkillItem } from "../../types/explore";

interface SkillCardProps {
  item: SkillItem;
}

const levelStyles: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-amber-50 text-amber-700",
  Advanced: "bg-rose-50 text-rose-700",
};

export default function SkillCard({ item }: SkillCardProps) {
  return (
    <article className="explore-glass flex h-full flex-col overflow-hidden rounded-xl border border-white/60 bg-white/85 backdrop-blur transition duration-300 hover:border-white/80 hover:shadow-md">
      <div className="flex-1 p-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 via-sky-100 to-purple-100 text-indigo-500">
            <Sparkles size={18} />
          </div>

          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              levelStyles[item.level] || "bg-slate-100 text-slate-700"
            }`}
          >
            {item.level}
          </span>
        </div>

        <h3 className="text-base font-semibold leading-snug tracking-tight text-slate-900">
          {item.name}
        </h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {item.category}
        </p>

        <p className="mt-2.5 line-clamp-3 text-sm leading-6 text-slate-600">
          {item.description}
        </p>
      </div>

      <div className="mt-auto border-t border-slate-100/90 p-4">
        <div className="mb-4 flex items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Users size={14} />
            {item.helpers} helpers
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            {item.avgRating.toFixed(1)}
          </span>
          <span>{item.sessions} sessions</span>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            {item.topHelpers.slice(0, 3).map((helper) => (
              <div
                key={`${item.id}-${helper.initials}`}
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-slate-800 ${helper.avatarBg}`}
              >
                {helper.initials}
              </div>
            ))}
          </div>
          <span className="text-xs text-slate-500">Top helpers</span>
        </div>

        <Link
          to={`/skills/${item.id}/helpers`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-500 transition duration-300 hover:gap-2 hover:text-indigo-600"
        >
          Find helpers
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
