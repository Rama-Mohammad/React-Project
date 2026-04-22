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
import { DashboardEmptyState, DashboardGhostAction, DashboardPanel, DashboardPanelHeader } from "./ui";

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
};

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
}: AnalyticsSectionProps) {
  return (
    <section className="grid grid-cols-1 gap-4 xl:h-full xl:grid-cols-2">
      <DashboardPanel className="flex h-full flex-col overflow-hidden">
        <DashboardPanelHeader
          title="Token Activity"
          subtitle="Balance movement based on recent earned and spent events"
          icon={
            <div className="rounded-2xl bg-indigo-50 p-2.5 text-indigo-700">
              <Coins size={16} />
            </div>
          }
          action={<DashboardGhostAction>Last {tokenFlowData.length} points</DashboardGhostAction>}
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
        />
        <div className="min-h-[20rem] flex-1 p-5">
          {weeklyActivityData.length === 0 ? (
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
