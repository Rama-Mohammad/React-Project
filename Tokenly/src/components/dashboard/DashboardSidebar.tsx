import {
  Activity,
  BarChart3,
  BellRing,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Sparkles,
  X,
} from "lucide-react";

export type DashboardSectionId =
  | "overview"
  | "analytics"
  | "sessions"
  | "inbox"
  | "requests"
  | "activity";

type DashboardSidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
  activeSection: DashboardSectionId;
  onSectionSelect: (sectionId: DashboardSectionId) => void;
  stretchOnDesktop?: boolean;
};

const sectionNav: Array<{
  id: DashboardSectionId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "sessions", label: "Sessions", icon: Activity },
  { id: "inbox", label: "Requests", icon: BellRing },
  { id: "requests", label: "Open Requests", icon: ClipboardList },
  { id: "activity", label: "Activity", icon: Sparkles },
];

function SectionLink({
  id,
  label,
  icon: Icon,
  isActive,
  onSelect,
}: {
  id: DashboardSectionId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isActive: boolean;
  onSelect: (sectionId: DashboardSectionId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={[
        "group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition",
        isActive
          ? "bg-[linear-gradient(135deg,#6477ff_0%,#7789ff_100%)] text-white shadow-[0_18px_28px_-22px_rgba(100,119,255,0.82)]"
          : "text-slate-500 hover:bg-indigo-50/70 hover:text-slate-900",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-9 w-9 items-center justify-center rounded-xl transition",
          isActive ? "bg-white/18 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-indigo-600",
        ].join(" ")}
      >
        <Icon size={17} />
      </span>
      <span>{label}</span>
    </button>
  );
}

function SidebarContent({
  activeSection,
  onSectionSelect,
  onNavigate,
}: {
  activeSection: DashboardSectionId;
  onSectionSelect: (sectionId: DashboardSectionId) => void;
  onNavigate?: () => void;
}) {
  const handleSectionSelect = (sectionId: DashboardSectionId) => {
    onSectionSelect(sectionId);
    onNavigate?.();
  };

  return (
    <div className="flex flex-col">
      <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        Sections
      </p>
      <nav className="mt-3 space-y-1.5">
        {sectionNav.map((item) => (
          <SectionLink
            key={item.id}
            {...item}
            isActive={activeSection === item.id}
            onSelect={handleSectionSelect}
          />
        ))}
      </nav>
    </div>
  );
}

export default function DashboardSidebar({
  mobileOpen,
  onClose,
  activeSection,
  onSectionSelect,
  stretchOnDesktop = false,
}: DashboardSidebarProps) {
  return (
    <>
      <aside className="hidden xl:block xl:w-72">
        <div
          className={[
            "rounded-[34px] border border-[#e4e9ff] bg-[linear-gradient(180deg,#ffffff_0%,#f8faff_100%)] p-5 shadow-[0_24px_56px_-40px_rgba(99,102,241,0.18)]",
            stretchOnDesktop ? "xl:h-full" : "",
          ].join(" ")}
        >
          <SidebarContent
            activeSection={activeSection}
            onSectionSelect={onSectionSelect}
          />
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
            aria-label="Close dashboard navigation"
          />
          <div className="relative h-full w-[86vw] max-w-sm border-r border-indigo-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8faff_100%)] p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-950">Menu</p>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarContent
              activeSection={activeSection}
              onSectionSelect={onSectionSelect}
              onNavigate={onClose}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

export function DashboardSidebarToggle({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm xl:hidden"
      aria-label="Open dashboard navigation"
    >
      <Menu size={18} />
    </button>
  );
}
