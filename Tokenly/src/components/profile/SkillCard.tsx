import React from "react";
import {
  Brain,
  BriefcaseBusiness,
  Camera,
  FileText,
  Lightbulb,
  Mic,
  Palette,
  PenLine,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { ProfileSkillCardProps } from "../../types/profile";

const SkillCard: React.FC<ProfileSkillCardProps> = ({ skill, onDelete, onEdit }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert":
        return "bg-violet-50 text-violet-700 ring-1 ring-violet-100";
      case "Advanced":
        return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100";
      case "Intermediate":
        return "bg-violet-50 text-violet-700 ring-1 ring-violet-100";
      default:
        return "bg-slate-100 text-slate-600 ring-1 ring-slate-200/70";
    }
  };

  const getSkillIcon = () => {
    const label = `${skill.name} ${skill.category}`.toLowerCase();

    if (label.includes("graphic") || label.includes("design")) return <Palette size={17} />;
    if (label.includes("writing") || label.includes("content")) return <FileText size={17} />;
    if (label.includes("photo")) return <Camera size={17} />;
    if (label.includes("machine") || label.includes("learning") || label.includes("ai")) return <Brain size={17} />;
    if (label.includes("speaking") || label.includes("public")) return <Mic size={17} />;
    if (label.includes("direction") || label.includes("creative")) return <Lightbulb size={17} />;
    if (label.includes("business") || label.includes("career")) return <BriefcaseBusiness size={17} />;
    return <Sparkles size={17} />;
  };

  const description = skill.description || "Practical sessions focused on real use cases and workflows.";

  return (
    <article className="rounded-2xl border border-[#e4e9f5] bg-white/82 p-4 shadow-[0_12px_32px_-30px_rgba(79,70,229,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-100 hover:bg-white hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 ring-1 ring-indigo-100/80">
            {getSkillIcon()}
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-tight text-slate-950">{skill.name}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                {skill.category}
              </span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getLevelColor(skill.level)}`}>
                {skill.level}
              </span>
            </div>
          </div>
        </div>
        {onEdit || onDelete ? (
          <div className="flex items-center gap-1.5">
            {onEdit ? (
              <button onClick={() => onEdit(skill)} className="rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600" aria-label="Edit skill">
                <PenLine size={14} />
              </button>
            ) : null}
            {onDelete ? (
              <button onClick={() => onDelete(skill.id)} className="rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:bg-rose-50 hover:text-rose-500" aria-label="Delete skill">
                <Trash2 size={14} />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      <p className="text-xs leading-6 text-slate-500">{description}</p>
    </article>
  );
};

export default SkillCard;
