import Avatar from "../common/Avatar";
import type {
  DashboardDirectRequestItem,
  DashboardHelpOfferRequestItem,
} from "../../types/dashboard";

type InboxItem = DashboardDirectRequestItem | DashboardHelpOfferRequestItem;

type InboxSectionProps = {
  title: string;
  count: number;
  items: InboxItem[];
  emptyMessage?: string;
  accent: "indigo" | "violet";
  actionLoadingId: string | null;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
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

export default function InboxSection({
  title,
  count,
  items,
  emptyMessage = "No requests yet.",
  accent,
  actionLoadingId,
  onAccept,
  onReject,
}: InboxSectionProps) {
  const theme =
    accent === "violet"
      ? {
          sectionBorder: "border-violet-100",
          badge: "border-violet-200 bg-violet-50 text-violet-700",
          avatarFallback: "bg-violet-100 text-xs font-semibold text-violet-700",
          acceptButton:
            "bg-[linear-gradient(135deg,#7c3aed_0%,#8b5cf6_100%)] text-white hover:brightness-105",
        }
      : {
          sectionBorder: "border-indigo-100",
          badge: "border-indigo-200 bg-indigo-50 text-indigo-700",
          avatarFallback: "bg-indigo-100 text-xs font-semibold text-indigo-700",
          acceptButton:
            "bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] text-white hover:brightness-105",
        };

  return (
    <DashboardPanel className={`flex h-full flex-col ${theme.sectionBorder}`}>
      <DashboardPanelHeader
        title={title}
        badge={
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${theme.badge}`}>
            {count} pending
          </span>
        }
      />
      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {items.length === 0 ? (
          <DashboardEmptyState>{emptyMessage}</DashboardEmptyState>
        ) : (
          items.map((item) => (
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
                    fallbackClassName={theme.avatarFallback}
                  />
                  <div className="flex-1">
                    <p className="text-base font-semibold leading-tight text-slate-950">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      From {item.personName}
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
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  disabled={actionLoadingId === item.id}
                  onClick={() => onAccept(item.id)}
                  className={`inline-flex h-9 items-center rounded-xl px-3.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${theme.acceptButton}`}
                >
                  {actionLoadingId === item.id ? "Accepting..." : "Accept"}
                </button>
                <button
                  type="button"
                  disabled={actionLoadingId === item.id}
                  onClick={() => onReject(item.id)}
                  className="inline-flex h-9 items-center rounded-xl border border-rose-200 bg-rose-50 px-3.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardPanel>
  );
}
