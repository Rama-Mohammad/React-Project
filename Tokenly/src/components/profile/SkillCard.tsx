import React from "react";
import { PenLine, Trash2 } from "lucide-react";

interface SkillCardProps {
  skill: {
    id: string;
    name: string;
    category: string;
    level: "Expert" | "Advanced" | "Intermediate";
    sessions: number;
  };
  onDelete?: (id: string) => void;
  onEdit?: (skill: any) => void;
}

const descriptions: Record<string, string> = {
  react: "Hooks, context, performance and component architecture.",
  typescript: "Generics, utility types, strict config and reusable patterns.",
  python: "Data workflows, scripting, OOP and clean backend logic.",
  sql: "Query optimization, joins, window functions and indexing.",
  "system design": "Scalability patterns, API design, queues and caching.",
};

const SkillCard: React.FC<SkillCardProps> = ({ skill, onDelete, onEdit }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert":
        return "bg-indigo-600 text-white";
      case "Advanced":
        return "bg-sky-100 text-sky-700";
      case "Intermediate":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const maxSessions = 10;
  const progress = Math.min((skill.sessions / maxSessions) * 100, 100);
  const key = skill.name.trim().toLowerCase();
  const description = descriptions[key] ?? "Practical sessions focused on real use cases and workflows.";

  return (
    <article className="border-b border-slate-200/70 px-1 py-3 last:border-b-0">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold leading-tight text-slate-900">{skill.name}</h3>
          <span className="mt-1.5 inline-flex rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">
            {skill.category}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit?.(skill)}
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-500"
            aria-label="Edit skill"
          >
            <PenLine size={14} />
          </button>
          <button
            onClick={() => {
              if (onDelete && confirm("Are you sure you want to delete this skill?")) {
                onDelete(skill.id);
              }
            }}
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-rose-500"
            aria-label="Delete skill"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="mb-2 flex items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getLevelColor(skill.level)}`}>
          {skill.level}
        </span>
        <span className="text-xs text-slate-500">
          {skill.sessions} {skill.sessions === 1 ? "session" : "sessions"}
        </span>
      </div>

      <div className="mb-2 h-2 w-full rounded-full bg-slate-200/80">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500" style={{ width: `${progress}%` }} />
      </div>

      <p className="text-xs leading-6 text-slate-600">{description}</p>
    </article>
  );
};

export default SkillCard;
