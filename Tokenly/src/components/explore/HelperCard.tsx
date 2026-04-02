import { BadgeCheck, MessageCircle, ShieldCheck, Star, Zap } from "lucide-react";
import type { HelperItem } from "../../types/explore";

interface HelperCardProps {
  item: HelperItem;
}

function BadgePill({ label }: { label: string }) {
  const styles: Record<string, string> = {
    "Top Rated": "bg-amber-50 text-amber-700",
    "Fast Responder": "bg-indigo-50 text-indigo-600",
    Expert: "bg-violet-50 text-violet-700",
    "Verified Student": "bg-purple-50 text-purple-600",
  };

  const icons: Record<string, React.ReactNode> = {
    "Top Rated": <Star size={13} className="fill-current" />,
    "Fast Responder": <Zap size={13} />,
    Expert: <BadgeCheck size={13} />,
    "Verified Student": <ShieldCheck size={13} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[label] || "bg-slate-100 text-slate-700"
      }`}
    >
      {icons[label]}
      {label}
    </span>
  );
}

export default function HelperCard({ item }: HelperCardProps) {
  return (
    <article className="explore-glass overflow-hidden rounded-xl border border-white/60 bg-white/80 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full ${item.avatarBg} text-sm font-bold text-slate-800`}
            >
              {item.initials}
            </div>
            {item.online && (
              <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                  {item.name}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  {item.online && <span className="text-indigo-500">Online now</span>}
                  <span>Responds {item.responseTime}</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1 text-base font-bold text-slate-800">
                <Star size={15} className="fill-amber-400 text-amber-400" />
                {item.rating.toFixed(1)}
              </div>
            </div>

            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
              {item.bio}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {item.badges.map((badge) => (
                <BadgePill key={badge} label={badge} />
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {item.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700"
                >
                  {category}
                </span>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {item.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-xs text-slate-500">
            <span className="font-semibold text-slate-800">{item.sessions}</span> sessions
          </div>

          <div className="text-xs text-slate-500">
            <span className="font-semibold text-slate-800">{item.successRate}%</span>
          </div>

          <div className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-600">
            {item.creditsPerHour} /hr
          </div>

          <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-50">
            <MessageCircle size={14} />
            Request
          </button>
        </div>
      </div>
    </article>
  );
}
