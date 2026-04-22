import { Coins, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Loader from "../common/Loader";
import type { Transaction } from "../../types/transaction";
import { toRelativeAge, toneClasses } from "../../utils/dashboardUtils";
import { DashboardGhostAction, DashboardPanel, DashboardPanelHeader } from "./ui";

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
