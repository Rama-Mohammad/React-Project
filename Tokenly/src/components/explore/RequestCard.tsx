import { Clock3, MessageCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { RequestItem } from "../../types/explore";

interface RequestCardProps {
  item: RequestItem;
}

const categoryColors: Record<string, string> = {
  "Data Science": "bg-cyan-50 text-cyan-700",
  Algorithms: "bg-indigo-50 text-indigo-700",
  Programming: "bg-violet-50 text-violet-700",
  "Web Development": "bg-orange-50 text-orange-700",
  "Machine Learning": "bg-fuchsia-50 text-fuchsia-700",
  "System Design": "bg-teal-50 text-teal-700",
  Database: "bg-amber-50 text-amber-700",
  Statistics: "bg-lime-50 text-lime-700",
  Mathematics: "bg-purple-50 text-purple-700",
  Writing: "bg-pink-50 text-pink-700",
};

const urgencyColors: Record<string, string> = {
  High: "bg-rose-50 text-rose-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-emerald-50 text-emerald-600",
};

export default function RequestCard({ item }: RequestCardProps) {
  return (
    <article className="explore-glass overflow-hidden rounded-xl border border-white/60 bg-white/80 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="p-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              categoryColors[item.category] || "bg-slate-100 text-slate-700"
            }`}
          >
            {item.category}
          </span>

          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              urgencyColors[item.urgency]
            }`}
          >
            {item.urgency} urgency
          </span>
        </div>

        <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-slate-950">
          {item.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
          {item.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 p-4">
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

        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${item.author.avatarBg} text-xs font-bold text-slate-800`}
          >
            {item.author.initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-800">
              {item.author.name}
            </div>
            <div className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              {item.author.rating?.toFixed(1)}
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-600">
            {item.credits}
          </div>

          <Link
            to={`/requests/${item.id}`}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-50"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
