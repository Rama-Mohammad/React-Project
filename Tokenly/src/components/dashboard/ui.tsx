type DashboardPanelProps = {
  children: React.ReactNode;
  className?: string;
};

type DashboardPanelHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
};

type DashboardEmptyStateProps = {
  children: React.ReactNode;
  className?: string;
};

function joinClasses(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export function DashboardPanel({ children, className = "" }: DashboardPanelProps) {
  return (
    <section
      className={joinClasses(
        "rounded-[32px] border border-white/80 bg-white/84 shadow-[0_22px_60px_-38px_rgba(15,23,42,0.26)] backdrop-blur-xl",
        className
      )}
    >
      {children}
    </section>
  );
}

export function DashboardPanelHeader({
  title,
  subtitle,
  action,
  badge,
  icon,
}: DashboardPanelHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
      <div className="flex min-w-0 items-center gap-3">
        {icon ? <div className="shrink-0">{icon}</div> : null}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
            {badge}
          </div>
          {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function DashboardEmptyState({
  children,
  className = "",
}: DashboardEmptyStateProps) {
  return (
    <div
      className={joinClasses(
        "rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DashboardGhostAction({
  children,
  className = "",
}: DashboardPanelProps) {
  return (
    <div
      className={joinClasses(
        "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50",
        className
      )}
    >
      {children}
    </div>
  );
}
