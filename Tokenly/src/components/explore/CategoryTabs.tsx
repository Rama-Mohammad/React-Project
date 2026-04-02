import { BookOpen, FileText, Users } from "lucide-react";
import type { ExploreTab } from "../../types/explore";

interface CategoryTabsProps {
  activeTab: ExploreTab;
  onChange: (tab: ExploreTab) => void;
  counts: {
    requests: number;
    helpers: number;
    skills: number;
  };
}

export default function CategoryTabs({
  activeTab,
  onChange,
  counts,
}: CategoryTabsProps) {
  const tabClass = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition duration-300 ${
      active
        ? "border border-slate-200 bg-white text-slate-900 shadow-sm ring-1 ring-white/70"
        : "border border-white/40 bg-white/50 text-slate-500 hover:-translate-y-0.5 hover:bg-white/80"
    }`;

  const badgeClass = (active: boolean) =>
    active
      ? "rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
      : "rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-semibold text-slate-500";

  return (
    <div className="explore-fade-in-up flex flex-wrap items-center gap-3">
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
