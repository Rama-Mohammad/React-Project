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
    <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
      <article className="rounded-3xl border border-slate-300/80 bg-transparent shadow-none">
        <div className="flex items-center justify-between border-b border-slate-300/80 p-4">
          <h3 className="text-lg font-semibold">Open Requests</h3>
          <Link to="/request/new" className="text-sm font-semibold text-indigo-700">
            + New
          </Link>
        </div>
        <div className="space-y-2 p-4">
          {requestsLoading ? (
            <Loader className="py-8" />
          ) : requestsError ? (
            <div className="rounded-2xl border border-rose-300/80 bg-rose-50/80 p-4 text-sm text-rose-700">
              {requestsError}
            </div>
          ) : openRequests.length === 0 ? (
            <div className="rounded-2xl border border-slate-300/80 bg-transparent p-4 text-sm text-slate-600">
              You don't have any open requests yet.
            </div>
          ) : (
            openRequests.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-300/80 bg-transparent p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base leading-tight">{item.title}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="rounded-full bg-rose-100 px-3 py-0.5 text-rose-700">
                        {item.urgency}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle size={14} />
                        {item.offers} offers
                      </span>
                      <span>{item.age}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-sm font-semibold text-indigo-700">
                      <Coins size={14} />
                      {item.credits}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteRequest(item.id)}
                      disabled={deletingRequestId === item.id}
                      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
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
        </div>
      </article>

      <article className="rounded-3xl border border-slate-300/80 bg-transparent shadow-none">
        <div className="flex items-center justify-between border-b border-slate-300/80 p-4">
          <h3 className="text-lg font-semibold">Submitted Offers</h3>
          <Link to="/explore?tab=requests#explore-tabs-bar" className="text-sm font-semibold text-indigo-700">
            Browse requests
          </Link>
        </div>
        <div className="space-y-2 p-4">
          {dashLoading ? (
            <Loader className="py-8" />
          ) : submittedOffers.length === 0 ? (
            <div className="rounded-2xl border border-slate-300/80 bg-transparent p-4 text-sm text-slate-600">
              You haven't submitted any offers yet.
            </div>
          ) : (
            submittedOffers.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-300/80 bg-transparent p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base leading-tight">{item.title}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span
                        className={`rounded-full px-3 py-0.5 ${
                          item.status === "Accepted" ? "bg-violet-100 text-violet-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status}
                      </span>
                      <span>by {item.user}</span>
                      <span>{item.age}</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-sm font-semibold text-indigo-700">
                    <Coins size={14} />
                    {item.credits}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
}
