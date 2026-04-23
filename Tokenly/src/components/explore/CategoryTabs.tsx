import { BookOpen, FileText, Send, Users } from "lucide-react";
import type { CategoryTabsProps } from "../../types/explore";

export default function CategoryTabs({
  activeTab,
  onChange,
  counts,
  countsLoading,
}: CategoryTabsProps) {
  const tabClass = (active: boolean) =>
    `relative inline-flex min-h-[50px] items-center gap-2 rounded-[15px] px-3 py-2 text-sm font-semibold transition duration-300 ${
      active
        ? "bg-white text-slate-950 shadow-[0_16px_36px_-30px_rgba(79,70,229,0.58)] ring-1 ring-indigo-100/70"
        : "bg-transparent text-slate-500 hover:bg-white/72 hover:text-slate-700"
    }`;

  const badgeClass = (active: boolean) =>
    active
      ? "rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600"
      : "rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-slate-400";

  return (
    <div className="explore-fade-in-up inline-flex w-fit max-w-full self-start flex-wrap gap-0 rounded-[22px] border border-white/80 bg-white/72 p-1 shadow-[0_18px_48px_-40px_rgba(79,70,229,0.36)] backdrop-blur-xl sm:flex-nowrap">
      <button
        type="button"
        onClick={() => onChange("requests")}
        className={tabClass(activeTab === "requests")}
      >
        <span className={`flex h-8 w-8 items-center justify-center rounded-[12px] transition ${
          activeTab === "requests" ? "bg-indigo-50 text-indigo-600" : "bg-slate-100/80 text-slate-400"
        }`}>
          <FileText size={16} />
        </span>
        <span className="flex flex-col items-start leading-none">
          <span>Requests</span>
          {activeTab === "requests" ? <span className="mt-1.5 h-0.5 w-7 rounded-full bg-indigo-500" /> : null}
        </span>
        {!countsLoading.requests ? (
          <span className={`ml-auto ${badgeClass(activeTab === "requests")}`}>{counts.requests}</span>
        ) : null}
      </button>

      <button
        type="button"
        onClick={() => onChange("helpers")}
        className={tabClass(activeTab === "helpers")}
      >
        <span className={`flex h-8 w-8 items-center justify-center rounded-[12px] transition ${
          activeTab === "helpers" ? "bg-sky-50 text-sky-600" : "bg-slate-100/80 text-slate-400"
        }`}>
          <Users size={16} />
        </span>
        <span className="flex flex-col items-start leading-none">
          <span>Helpers</span>
          {activeTab === "helpers" ? <span className="mt-1.5 h-0.5 w-7 rounded-full bg-sky-500" /> : null}
        </span>
        {!countsLoading.helpers ? (
          <span className={`ml-auto ${badgeClass(activeTab === "helpers")}`}>{counts.helpers}</span>
        ) : null}
      </button>

      <button
        type="button"
        onClick={() => onChange("skills")}
        className={tabClass(activeTab === "skills")}
      >
        <span className={`flex h-8 w-8 items-center justify-center rounded-[12px] transition ${
          activeTab === "skills" ? "bg-violet-50 text-violet-600" : "bg-slate-100/80 text-slate-400"
        }`}>
          <BookOpen size={16} />
        </span>
        <span className="flex flex-col items-start leading-none">
          <span>Skills</span>
          {activeTab === "skills" ? <span className="mt-1.5 h-0.5 w-7 rounded-full bg-violet-500" /> : null}
        </span>
        {!countsLoading.skills ? (
          <span className={`ml-auto ${badgeClass(activeTab === "skills")}`}>{counts.skills}</span>
        ) : null}
      </button>

      <button
        type="button"
        onClick={() => onChange("offers")}
        className={tabClass(activeTab === "offers")}
      >
        <span className={`flex h-8 w-8 items-center justify-center rounded-[12px] transition ${
          activeTab === "offers" ? "bg-amber-50 text-amber-600" : "bg-slate-100/80 text-slate-400"
        }`}>
          <Send size={16} />
        </span>
        <span className="flex flex-col items-start leading-none">
          <span>Offers</span>
          {activeTab === "offers" ? <span className="mt-1.5 h-0.5 w-7 rounded-full bg-amber-500" /> : null}
        </span>
        {!countsLoading.offers ? (
          <span className={`ml-auto ${badgeClass(activeTab === "offers")}`}>{counts.offers}</span>
        ) : null}
      </button>
    </div>
  );
}


