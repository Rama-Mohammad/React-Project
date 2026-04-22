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
  accent: "indigo" | "violet";
  actionLoadingId: string | null;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
};

export default function InboxSection({
  title,
  count,
  items,
  accent,
  actionLoadingId,
  onAccept,
  onReject,
}: InboxSectionProps) {
  const theme =
    accent === "violet"
      ? {
          sectionBorder: "border-violet-200/70",
          headerBorder: "border-violet-200/70",
          badge: "border-violet-200 bg-violet-50 text-violet-700",
          avatarFallback: "bg-violet-100 text-xs font-semibold text-violet-700",
          acceptButton:
            "bg-[linear-gradient(135deg,#7c3aed_0%,#8b5cf6_100%)] text-white hover:brightness-105",
        }
      : {
          sectionBorder: "border-indigo-200/70",
          headerBorder: "border-indigo-200/70",
          badge: "border-indigo-200 bg-indigo-50 text-indigo-700",
          avatarFallback: "bg-indigo-100 text-xs font-semibold text-indigo-700",
          acceptButton:
            "bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] text-white hover:brightness-105",
        };

  return (
    <section className={`mt-4 rounded-3xl border bg-transparent shadow-none ${theme.sectionBorder}`}>
      <div className={`flex items-center justify-between p-4 ${theme.headerBorder} border-b`}>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${theme.badge}`}>
            {count} pending
          </span>
        </div>
      </div>

      <div className="space-y-2 p-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-300/80 bg-transparent p-4">
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
                  <p className="text-base font-semibold leading-tight text-slate-900">{item.title}</p>
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

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                disabled={actionLoadingId === item.id}
                onClick={() => onAccept(item.id)}
                className={`inline-flex h-8 items-center rounded-xl px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${theme.acceptButton}`}
              >
                {actionLoadingId === item.id ? "Accepting..." : "Accept"}
              </button>
              <button
                type="button"
                disabled={actionLoadingId === item.id}
                onClick={() => onReject(item.id)}
                className="inline-flex h-8 items-center rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
