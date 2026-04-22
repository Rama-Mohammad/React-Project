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

export default function ActivitySection({
  dashLoading,
  transactions,
  activityPreview,
}: ActivitySectionProps) {
  return (
    <section className="relative mt-4 overflow-hidden rounded-3xl border border-indigo-200/70 bg-[linear-gradient(140deg,rgba(238,242,255,0.95)_0%,rgba(237,233,254,0.92)_45%,rgba(224,231,255,0.95)_100%)] shadow-[0_14px_34px_-26px_rgba(99,102,241,0.45)]">
      <div className="pointer-events-none absolute -top-16 right-6 h-40 w-40 rounded-full bg-indigo-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-10 h-36 w-36 rounded-full bg-violet-300/20 blur-3xl" />

      <div className="relative flex items-center justify-between border-b border-indigo-200/70 p-4">
        <h3 className="text-lg font-semibold">Activity</h3>
        {transactions.length > 3 ? (
          <Link
            to="/activity"
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-300/70 bg-white/80 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-white"
          >
            View more
          </Link>
        ) : null}
      </div>

      <div className="relative">
        {dashLoading ? (
          <Loader className="py-8" />
        ) : activityPreview.length === 0 ? (
          <div className="px-4 py-5 text-sm text-slate-500">No activity yet.</div>
        ) : (
          activityPreview.map((item) => (
            <article
              key={item.id}
              className="flex items-center justify-between border-b border-indigo-200/70 px-4 py-5 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-3 ${toneClasses(item.type)}`}>
                  {item.type === "earn" || item.type === "bonus" ? <Plus size={15} /> : <Coins size={15} />}
                </div>
                <div>
                  <p className="text-base leading-tight">{item.description ?? "Token transaction"}</p>
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
    </section>
  );
}
