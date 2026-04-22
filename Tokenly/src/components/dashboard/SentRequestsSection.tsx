import Avatar from "../common/Avatar";
import type { DashboardDirectRequestItem } from "../../types/dashboard";
import { DashboardEmptyState, DashboardPanel, DashboardPanelHeader } from "./ui";

type SentRequestsSectionProps = {
  items: DashboardDirectRequestItem[];
  emptyMessage?: string;
};

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
    <DashboardPanel className="flex h-full flex-col">
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
                        {item.duration ? ` • ${item.duration} min` : ""}
                        {item.credits ? ` • ${item.credits} credits` : ""}
                        {" • "}
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
