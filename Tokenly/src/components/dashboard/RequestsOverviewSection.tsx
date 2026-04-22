import { Coins, MessageCircle, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Loader from "../common/Loader";
import type { DashboardOfferItem, DashboardRequestItem } from "../../types/dashboard";

type RequestsOverviewSectionProps = {
  requestsLoading: boolean;
  requestsError: string;
  openRequests: DashboardRequestItem[];
  deletingRequestId: string | null;
  onDeleteRequest: (id: string) => void;
  dashLoading: boolean;
  submittedOffers: DashboardOfferItem[];
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

function SectionShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <DashboardPanel className="flex h-full flex-col">
      <DashboardPanelHeader title={title} subtitle={subtitle} action={action} />
      <div className="flex-1 space-y-3 overflow-y-auto p-5">{children}</div>
    </DashboardPanel>
  );
}

export default function RequestsOverviewSection({
  requestsLoading,
  requestsError,
  openRequests,
  deletingRequestId,
  onDeleteRequest,
  dashLoading,
  submittedOffers,
}: RequestsOverviewSectionProps) {
  return (
    <section className="grid grid-cols-1 gap-4 xl:h-full xl:grid-cols-2">
      <SectionShell
        title="Open Requests"
        subtitle="Requests you are still waiting to match"
        action={
          <Link to="/request/new">
            <DashboardGhostAction className="text-sm">+ New</DashboardGhostAction>
          </Link>
        }
      >
        {requestsLoading ? (
          <Loader className="py-8" />
        ) : requestsError ? (
          <div className="rounded-2xl border border-rose-300/80 bg-rose-50/80 p-4 text-sm text-rose-700">
            {requestsError}
          </div>
        ) : openRequests.length === 0 ? (
          <DashboardEmptyState>
            You don't have any open requests yet.
          </DashboardEmptyState>
        ) : (
          openRequests.map((item) => (
            <div key={item.id} className="rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] p-4 transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-30px_rgba(15,23,42,0.28)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold leading-tight text-slate-950">{item.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">{item.urgency}</span>
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle size={14} />
                      {item.offers} offers
                    </span>
                    <span>{item.age}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-sm font-semibold text-slate-700">
                    <Coins size={14} />
                    {item.credits}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteRequest(item.id)}
                    disabled={deletingRequestId === item.id}
                    className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition ${
                      deletingRequestId === item.id
                        ? "cursor-not-allowed border-rose-200 bg-rose-100 text-rose-400"
                        : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                    }`}
                  >
                    <Trash2 size={12} />
                    {deletingRequestId === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </SectionShell>

      <SectionShell
        title="Submitted Offers"
        subtitle="Offers you have sent to open requests"
        action={
          <Link to="/explore?tab=requests#explore-tabs-bar">
            <DashboardGhostAction className="text-sm">Browse requests</DashboardGhostAction>
          </Link>
        }
      >
        {dashLoading ? (
          <Loader className="py-8" />
        ) : submittedOffers.length === 0 ? (
          <DashboardEmptyState>
            You haven't submitted any offers yet.
          </DashboardEmptyState>
        ) : (
          submittedOffers.map((item) => (
            <div key={item.id} className="rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] p-4 transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-30px_rgba(15,23,42,0.28)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold leading-tight text-slate-950">{item.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span
                      className={`rounded-full px-3 py-1 ${
                        item.status === "Accepted" ? "bg-violet-100 text-violet-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.status}
                    </span>
                    <span>by {item.user}</span>
                    <span>{item.age}</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-sm font-semibold text-slate-700">
                  <Coins size={14} />
                  {item.credits}
                </span>
              </div>
            </div>
          ))
        )}
      </SectionShell>
    </section>
  );
}
