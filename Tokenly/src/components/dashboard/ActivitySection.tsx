import { Coins } from "lucide-react";
import { Link } from "react-router-dom";
import type { TransactionActivityFeedItem } from "../../types/transactionActivity";
import { getTransactionAppearance } from "../../utils/transactionActivityFeed";
import { toRelativeAge } from "../../utils/dashboardUtils";

type ActivitySectionProps = {
  activityLoading: boolean;
  activityError?: string;
  activityPreview: TransactionActivityFeedItem[];
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

function ActivitySkeleton() {
  return (
    <div className="px-5 py-4">
      <div className="space-y-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-100" />
              <div className="space-y-2">
                <div className="h-4 w-40 animate-pulse rounded-full bg-slate-100" />
                <div className="h-3 w-28 animate-pulse rounded-full bg-slate-100" />
              </div>
            </div>
            <div className="h-7 w-24 animate-pulse rounded-full bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ActivitySection({
  activityLoading,
  activityError = "",
  activityPreview,
}: ActivitySectionProps) {
  return (
    <DashboardPanel className="relative flex h-full min-h-0 flex-col overflow-hidden xl:h-[30rem] xl:max-h-[30rem]">
      <div>
        <DashboardPanelHeader
          title="Activity"
          subtitle="Recent account events from your activity feed"
          action={
            activityPreview.length > 0 ? (
              <Link to="/activity">
                <DashboardGhostAction>View more</DashboardGhostAction>
              </Link>
            ) : null
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {activityLoading ? (
          <ActivitySkeleton />
        ) : activityError ? (
          <div className="px-5 py-6 text-sm text-rose-600">{activityError}</div>
        ) : activityPreview.length === 0 ? (
          <div className="px-5 py-6 text-sm text-slate-500">No recent activity yet</div>
        ) : (
          activityPreview.map((item) => {
            const appearance = getTransactionAppearance(item.type);
            const Icon = appearance.icon;

            return (
              <article
                key={item.id}
                className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 last:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`rounded-2xl p-3 ${appearance.toneClass}`}>
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base leading-tight text-slate-950">{item.displayTitle}</p>
                    {item.displayDescription ? (
                      <p className="mt-1 truncate text-sm text-slate-500">{item.displayDescription}</p>
                    ) : null}
                    <p className="mt-1 text-xs text-slate-400">{toRelativeAge(item.created_at)}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${item.tokenBadgeToneClass}`}
                >
                  <Coins size={12} />
                  {item.tokenBadgeLabel}
                </span>
              </article>
            );
          })
        )}
      </div>
    </DashboardPanel>
  );
}
