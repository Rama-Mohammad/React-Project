import Avatar from "../common/Avatar";
import { Coins } from "lucide-react";
import type { DashboardDirectRequestItem } from "../../types/dashboard";

type SentRequestsSectionProps = {
  items: DashboardDirectRequestItem[];
  emptyMessage?: string;
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
  badge,
}: {
  title: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
            {badge}
          </div>
        </div>
      </div>
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

function getStatusPresentation(status: DashboardDirectRequestItem["status"]) {
  if (status === "accepted") {
    return {
      label: "Accepted",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }

  if (status === "rejected") {
    return {
      label: "Denied",
      className: "bg-rose-50 text-rose-700 border-rose-200",
    };
  }

  if (status === "cancelled") {
    return {
      label: "Cancelled",
      className: "bg-slate-100 text-slate-600 border-slate-200",
    };
  }

  return {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  };
}

export default function SentRequestsSection({
  items,
  emptyMessage = "No sent direct requests yet.",
}: SentRequestsSectionProps) {
  return (
    <DashboardPanel className="flex h-full min-h-0 flex-col xl:h-[30rem] xl:max-h-[30rem]">
      <DashboardPanelHeader
        title="Sent Direct Requests"
        badge={
          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {items.length} total
          </span>
        }
      />
      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {items.length === 0 ? (
          <DashboardEmptyState>{emptyMessage}</DashboardEmptyState>
        ) : (
          items.map((item) => {
            const status = getStatusPresentation(item.status);

            return (
              <div
                key={item.id}
                className="rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] p-4 transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-30px_rgba(15,23,42,0.28)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-1 items-start gap-3">
                    <Avatar
                      name={item.personName}
                      imageUrl={item.personImageUrl}
                      className="h-10 w-10 shrink-0 rounded-full"
                      imageClassName="rounded-full"
                      fallbackClassName="bg-indigo-100 text-xs font-semibold text-indigo-700"
                    />
                    <div className="flex-1">
                      <p className="text-base font-semibold leading-tight text-slate-950">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Sent to {item.personName}
                        {item.duration ? ` \u2022 ${item.duration} min` : ""}
                        {item.credits ? (
                          <>
                            {" \u2022 "}
                            <span className="inline-flex items-center gap-1">
                              <Coins size={13} />
                              {item.credits} credits
                            </span>
                          </>
                        ) : null}
                        {" \u2022 "}
                        {item.age}
                      </p>
                      {item.message ? (
                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.message}</p>
                      ) : null}
                    </div>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardPanel>
  );
}

