import { BookOpen, FileText, Users } from "lucide-react";
import type { CategoryTabsProps } from "../../types/explore";

export default function CategoryTabs({
  activeTab,
  onChange,
  counts,
}: CategoryTabsProps) {
  const tabClass = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition duration-200 ${
      active
        ? "border border-slate-200 bg-white text-slate-900 shadow-sm"
        : "border border-transparent bg-transparent text-slate-500 hover:bg-white/80 hover:text-slate-700"
    }`;

  const badgeClass = (active: boolean) =>
    active
      ? "rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
      : "rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-semibold text-slate-500";

  return (
    <div className="explore-fade-in-up inline-flex flex-wrap items-center gap-2 rounded-xl border border-white/50 bg-white/55 p-1.5 backdrop-blur">
      <button
        type="button"
        onClick={() => onChange("requests")}
        className={tabClass(activeTab === "requests")}
      >
        <FileText size={16} />
        Requests
        <span className={badgeClass(activeTab === "requests")}>{counts.requests}</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("helpers")}
        className={tabClass(activeTab === "helpers")}
      >
        <Users size={16} />
        Helpers
        <span className={badgeClass(activeTab === "helpers")}>{counts.helpers}</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("skills")}
        className={tabClass(activeTab === "skills")}
      >
        <BookOpen size={16} />
        Skills
        <span className={badgeClass(activeTab === "skills")}>{counts.skills}</span>
      </button>
    </div>
  );
}

