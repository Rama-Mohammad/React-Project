import { Coins, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Loader from "../common/Loader";
import type { Transaction } from "../../types/transaction";
import { toRelativeAge, toneClasses } from "../../utils/dashboardUtils";

type ActivitySectionProps = {
  dashLoading: boolean;
  transactions: Transaction[];
  activityPreview: Transaction[];
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
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
          </div>
          {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
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

export default function ActivitySection({
  dashLoading,
  transactions,
  activityPreview,
}: ActivitySectionProps) {
  return (
    <DashboardPanel className="relative flex h-full flex-col overflow-hidden">
      <div>
        <DashboardPanelHeader
          title="Activity"
          subtitle="Recent token events and movement"
          action={
            transactions.length > 3 ? (
              <Link to="/activity">
                <DashboardGhostAction>View more</DashboardGhostAction>
              </Link>
            ) : null
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {dashLoading ? (
          <Loader className="py-8" />
        ) : activityPreview.length === 0 ? (
          <div className="px-5 py-6 text-sm text-slate-500">No activity yet.</div>
        ) : (
          activityPreview.map((item) => (
            <article
              key={item.id}
              className="flex items-center justify-between border-b border-slate-100 px-5 py-5 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-2xl p-3 ${toneClasses(item.type)}`}>
                  {item.type === "earn" || item.type === "bonus" ? <Plus size={15} /> : <Coins size={15} />}
                </div>
                <div>
                  <p className="text-base leading-tight text-slate-950">{item.description ?? "Token transaction"}</p>
                  <p className="mt-1 text-sm text-slate-500">{toRelativeAge(item.created_at)}</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
                  item.type === "earn" || item.type === "bonus"
                    ? "bg-violet-100 text-violet-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                <Coins size={14} />
                {item.type === "earn" || item.type === "bonus" ? `+${item.amount}` : `-${item.amount}`}
              </span>
            </article>
          ))
        )}
      </div>
    </DashboardPanel>
  );
}
