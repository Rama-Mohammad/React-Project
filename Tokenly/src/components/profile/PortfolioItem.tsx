import React, { useMemo, useState } from "react";
import { Code2, FileText, HandHeart, PenLine, Trash2 } from "lucide-react";

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
  onEdit?: (item: {
    id: string;
    type: "Project" | "Article" | "Contribution";
    title: string;
    date: string;
    description: string;
    tags: string[];
  }) => void;
  onDelete?: (id: string) => void;
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

const PortfolioItem: React.FC<PortfolioItemProps> = ({ item, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const meta = typeMeta[item.type];
  const Icon = meta.icon;

  const shortDescription = useMemo(() => {
    return item.description.length > 140 ? `${item.description.slice(0, 140)}...` : item.description;
  }, [item.description]);

  return (
    <article className="group explore-glass flex h-full flex-col overflow-hidden rounded-xl border border-white/60 bg-white/85 backdrop-blur-sm transition hover:shadow-md">
      <div className="relative h-44 overflow-hidden">
        <div className={`absolute inset-0 ${meta.background}`} />
        <span className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${meta.badge}`}>
          <Icon size={12} />
          {item.type}
        </span>

        <div className="absolute right-3 top-3 flex overflow-hidden rounded-xl border border-white/75 bg-white/90 shadow-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => onEdit?.(item)}
            className="inline-flex h-9 w-9 flex-none items-center justify-center p-0 text-slate-600 transition-colors hover:bg-slate-100 hover:text-indigo-600 focus:outline-none"
            aria-label="Edit portfolio item"
          >
            <PenLine size={15} />
          </button>
          <div className="w-px bg-slate-200" />
          <button
            type="button"
            onClick={() => onDelete?.(item.id)}
            className="inline-flex h-9 w-9 flex-none items-center justify-center p-0 text-slate-500 transition-colors hover:bg-slate-100 hover:text-rose-600 focus:outline-none"
            aria-label="Delete portfolio item"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-tight text-slate-900">{item.title}</h3>
          <span className="shrink-0 text-sm text-slate-400">{item.date}</span>
        </div>

        <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-600">{expanded ? item.description : shortDescription}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {(expanded ? item.tags : item.tags.slice(0, 4)).map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center pt-4">
          {(item.description.length > 140 || item.tags.length > 4) && (
            <button onClick={() => setExpanded((value) => !value)} className="text-xs font-medium text-teal-700 transition hover:text-teal-800">
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default PortfolioItem;
