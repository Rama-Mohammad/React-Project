import { BookOpen, FileText, Send, Users } from "lucide-react";
import type { CategoryTabsProps } from "../../types/explore";

export default function CategoryTabs({
  activeTab,
  onChange,
  counts,
  countsLoading,
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
        {!countsLoading.requests ? (
          <span className={badgeClass(activeTab === "requests")}>{counts.requests}</span>
        ) : null}
      </button>

      <button
        type="button"
        onClick={() => onChange("helpers")}
        className={tabClass(activeTab === "helpers")}
      >
        <Users size={16} />
        Helpers
        {!countsLoading.helpers ? (
          <span className={badgeClass(activeTab === "helpers")}>{counts.helpers}</span>
        ) : null}
      </button>

      <button
        type="button"
        onClick={() => onChange("skills")}
        className={tabClass(activeTab === "skills")}
      >
        <BookOpen size={16} />
        Skills
        {!countsLoading.skills ? (
          <span className={badgeClass(activeTab === "skills")}>{counts.skills}</span>
        ) : null}
      </button>

      <button
        type="button"
        onClick={() => onChange("offers")}
        className={tabClass(activeTab === "offers")}
      >
        <Send size={16} />
        Offers
        {!countsLoading.offers ? (
          <span className={badgeClass(activeTab === "offers")}>{counts.offers}</span>
        ) : null}
      </button>
    </div>
  );
}

