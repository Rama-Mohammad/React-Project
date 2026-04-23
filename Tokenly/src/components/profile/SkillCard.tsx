import React from "react";
import { PenLine, Trash2 } from "lucide-react";
import type { ProfileSkillCardProps } from "../../types/profile";

const SkillCard: React.FC<ProfileSkillCardProps> = ({ skill, onDelete, onEdit }) => {
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

  const description = skill.description || "Practical sessions focused on real use cases and workflows.";

  return (
    <article className="border-b border-slate-200/70 px-1 py-3 last:border-b-0">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold leading-tight text-slate-900">{skill.name}</h3>
          <span className="mt-1.5 inline-flex rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">
            {skill.category}
          </span>
        </div>
        {onEdit || onDelete ? (
          <div className="flex items-center gap-1">
            {onEdit ? (
              <button onClick={() => onEdit(skill)} className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-500" aria-label="Edit skill">
                <PenLine size={14} />
              </button>
            ) : null}
            {onDelete ? (
              <button onClick={() => onDelete(skill.id)} className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-rose-500" aria-label="Delete skill">
                <Trash2 size={14} />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="mb-2 flex items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getLevelColor(skill.level)}`}>{skill.level}</span>
      </div>
      <p className="text-xs leading-6 text-slate-600">{description}</p>
    </article>
  );
};

export default SkillCard;

