import { Layers3 } from "lucide-react";

type DashboardTopBarProps = {
  onOpenMobileNav: () => void;
};

export default function DashboardTopBar({
  onOpenMobileNav,
}: DashboardTopBarProps) {
  return (
    <div className="mb-5 xl:hidden">
      <div className="flex items-center justify-between rounded-[26px] border border-[#e4e9ff] bg-[linear-gradient(180deg,#ffffff_0%,#f8faff_100%)] px-4 py-3 shadow-[0_20px_44px_-34px_rgba(99,102,241,0.2)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#6477ff_0%,#90a2ff_100%)] text-white">
            <Layers3 size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">Tokenly</p>
            <p className="text-xs text-slate-400">Dashboard</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenMobileNav}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-100 bg-white text-slate-700 shadow-sm"
          aria-label="Open dashboard navigation"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current">
            <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 17H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
