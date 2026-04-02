import React, { useMemo, useState } from "react";
import { ArrowUpRight, Code2, FileText, HandHeart } from "lucide-react";

interface PortfolioItemProps {
  item: {
    id: string;
    type: "Project" | "Article" | "Contribution";
    title: string;
    date: string;
    description: string;
    tags: string[];
  };
  onView?: (id: string) => void;
}

const typeMeta = {
  Project: {
    icon: Code2,
    badge: "bg-indigo-100 text-indigo-700",
    background:
      "bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.45),rgba(99,102,241,0.28)),linear-gradient(135deg,rgba(99,102,241,0.45),rgba(14,165,233,0.55))]",
  },
  Article: {
    icon: FileText,
    badge: "bg-amber-100 text-amber-700",
    background:
      "bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.4),rgba(14,165,233,0.2)),linear-gradient(135deg,rgba(7,89,133,0.7),rgba(30,64,175,0.9))]",
  },
  Contribution: {
    icon: HandHeart,
    badge: "bg-emerald-100 text-emerald-700",
    background:
      "bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.45),rgba(74,222,128,0.2)),linear-gradient(135deg,rgba(5,150,105,0.7),rgba(8,145,178,0.8))]",
  },
};

const PortfolioItem: React.FC<PortfolioItemProps> = ({ item, onView }) => {
  const [expanded, setExpanded] = useState(false);
  const meta = typeMeta[item.type];
  const Icon = meta.icon;

  const shortDescription = useMemo(() => {
    return item.description.length > 140 ? `${item.description.slice(0, 140)}...` : item.description;
  }, [item.description]);

  return (
    <article className="border-b border-slate-200/70 py-4 last:border-b-0 md:min-h-[360px]">
      <div className="relative mb-3 h-36 overflow-hidden rounded-xl">
        <div className={`absolute inset-0 ${meta.background}`} />
        <span className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${meta.badge}`}>
          <Icon size={12} />
          {item.type}
        </span>
      </div>

      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-tight text-slate-900">{item.title}</h3>
        <span className="shrink-0 text-xs text-slate-400">{item.date}</span>
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-600">{expanded ? item.description : shortDescription}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {(expanded ? item.tags : item.tags.slice(0, 4)).map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        {(item.description.length > 140 || item.tags.length > 4) && (
          <button onClick={() => setExpanded((value) => !value)} className="text-xs font-medium text-teal-700 transition hover:text-teal-800">
            {expanded ? "Show less" : "Show more"}
          </button>
        )}

        <button onClick={() => onView?.(item.id)} className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 transition hover:text-teal-800">
          View
          <ArrowUpRight size={14} />
        </button>
      </div>
    </article>
  );
};

export default PortfolioItem;
