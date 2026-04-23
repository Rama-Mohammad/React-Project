import { Activity, Coins } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TokenFlowPoint = {
  label: string;
  earned: number;
  spent: number;
  net: number;
};

type WeeklyActivityPoint = {
  label: string;
  completed: number;
  upcoming: number;
};

type AnalyticsSectionProps = {
  tokenFlowData: TokenFlowPoint[];
  weeklyActivityData: WeeklyActivityPoint[];
  sessionSummary?: {
    completed: number;
    upcoming: number;
  };
};

function joinClasses(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function DashboardPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
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

function DashboardPanelHeader({
  title,
  subtitle,
  action,
  badge,
  icon,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
}) {
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

function DashboardEmptyState({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
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

function DashboardGhostAction({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
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

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-white/80 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <div className="mt-2 space-y-1">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-4 text-sm">
            <span className="inline-flex items-center gap-2 text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
            <span className="font-semibold text-slate-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsSection({
  tokenFlowData,
  weeklyActivityData,
  sessionSummary,
}: AnalyticsSectionProps) {
  const hasWeeklySessionData = weeklyActivityData.some((point) => point.completed > 0 || point.upcoming > 0);

  return (
    <section className="grid grid-cols-1 gap-4 xl:h-[30rem] xl:max-h-[30rem] xl:grid-cols-2">
      <DashboardPanel className="flex h-full flex-col overflow-hidden">
        <DashboardPanelHeader
          title="Token Activity"
          subtitle="Balance movement based on recent earned and spent events"
          icon={
            <div className="rounded-2xl bg-indigo-50 p-2.5 text-indigo-700">
              <Coins size={16} />
            </div>
          }
          action={<DashboardGhostAction>Last 7 days</DashboardGhostAction>}
        />
        <div className="min-h-[20rem] flex-1 p-5">
          {tokenFlowData.length === 0 ? (
            <DashboardEmptyState className="h-full">
              No token activity data yet.
            </DashboardEmptyState>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tokenFlowData} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="tokenEarned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="tokenSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} width={34} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="earned"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#tokenEarned)"
                  name="Earned"
                />
                <Area
                  type="monotone"
                  dataKey="spent"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fill="url(#tokenSpent)"
                  name="Spent"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </DashboardPanel>

      <DashboardPanel className="flex h-full flex-col overflow-hidden">
        <DashboardPanelHeader
          title="Weekly Sessions"
          subtitle="Completed and upcoming session volume"
          icon={
            <div className="rounded-2xl bg-sky-50 p-2.5 text-sky-700">
              <Activity size={16} />
            </div>
          }
          action={
            sessionSummary ? (
              <DashboardGhostAction>
                {sessionSummary.completed} completed {"\u00B7"} {sessionSummary.upcoming} upcoming
              </DashboardGhostAction>
            ) : undefined
          }
        />
        <div className="min-h-[20rem] flex-1 p-5">
          {!hasWeeklySessionData ? (
            <DashboardEmptyState className="h-full">No weekly activity data yet.</DashboardEmptyState>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={8}>
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} width={28} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="completed" fill="#6366f1" radius={[10, 10, 4, 4]} name="Completed" />
                <Bar dataKey="upcoming" fill="#c4b5fd" radius={[10, 10, 4, 4]} name="Upcoming" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </DashboardPanel>
    </section>
  );
}

