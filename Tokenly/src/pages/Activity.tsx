import { useEffect, useMemo, useState } from "react";
import { Coins } from "lucide-react";
import { Link } from "react-router-dom";
import useTransactions from "../hooks/useTransactions";
import { supabase } from "../lib/supabaseClient";
import { subscribeToTransactionsByUser } from "../services/transactionService";
import {
  getTransactionAppearance,
  mapTransactionFeedItem,
} from "../utils/transactionActivityFeed";
import { toRelativeAge } from "../utils/dashboardUtils";

function ActivityPageSkeleton() {
  return (
    <div className="px-4 py-5 sm:px-5">
      <div className="space-y-4">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 border-b border-indigo-200/70 py-4 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 animate-pulse rounded-full bg-white/70" />
              <div className="space-y-2">
                <div className="h-4 w-48 animate-pulse rounded-full bg-white/70" />
                <div className="h-3 w-64 animate-pulse rounded-full bg-white/70" />
              </div>
            </div>
            <div className="h-7 w-28 animate-pulse rounded-full bg-white/70" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Activity() {
  const { transactions, loading, error, fetchTransactionsByUser } = useTransactions();
  const [authError, setAuthError] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    void (async () => {
      const { data, error: userError } = await supabase.auth.getUser();
      if (!mounted) return;

      if (userError || !data.user?.id) {
        setAuthError("Please sign in to view your activity.");
        setCurrentUserId(null);
        return;
      }

      setAuthError("");
      setCurrentUserId(data.user.id);
      await fetchTransactionsByUser(data.user.id);
    })();

    return () => {
      mounted = false;
    };
  }, [fetchTransactionsByUser]);

  useEffect(() => {
    if (!currentUserId) return;

    const channel = subscribeToTransactionsByUser(currentUserId, () => {
      void fetchTransactionsByUser(currentUserId);
    });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [currentUserId, fetchTransactionsByUser]);

  const allActivity = useMemo(() => transactions.map(mapTransactionFeedItem), [transactions]);

  return (
    <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <main className="mx-auto w-full max-w-275 px-4 py-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-indigo-200/70 bg-[linear-gradient(140deg,rgba(238,242,255,0.95)_0%,rgba(237,233,254,0.92)_45%,rgba(224,231,255,0.95)_100%)] shadow-[0_14px_34px_-26px_rgba(99,102,241,0.45)]">
          <div className="pointer-events-none absolute -top-16 right-6 h-40 w-40 rounded-full bg-indigo-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-10 h-36 w-36 rounded-full bg-violet-300/20 blur-3xl" />

          <div className="relative flex items-center justify-between border-b border-indigo-200/70 p-4 sm:p-5">
            <div>
              <p className="text-sm text-slate-500">Dashboard</p>
              <h1 className="text-2xl font-semibold">All Activity</h1>
              <p className="mt-1 text-sm text-slate-500">
                Your token activity history from credit transactions.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-300/70 bg-white/80 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-white"
            >
              Back to dashboard
            </Link>
          </div>

          <div className="relative">
            {authError ? (
              <div className="px-4 py-5 text-sm text-rose-600 sm:px-5">{authError}</div>
            ) : loading ? (
              <ActivityPageSkeleton />
            ) : error ? (
              <div className="px-4 py-5 text-sm text-rose-600 sm:px-5">{error}</div>
            ) : allActivity.length === 0 ? (
              <div className="px-4 py-5 text-sm text-slate-500 sm:px-5">No recent activity yet</div>
            ) : (
              allActivity.map((item) => {
                const appearance = getTransactionAppearance(item.type);
                const Icon = appearance.icon;

                return (
                  <article
                    key={item.id}
                    className="flex items-center justify-between gap-4 border-b border-indigo-200/70 px-4 py-5 last:border-b-0 sm:px-5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={`rounded-full p-3 ${appearance.toneClass}`}>
                        <Icon size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base leading-tight">{item.displayTitle}</p>
                        {item.displayDescription ? (
                          <p className="mt-1 truncate text-sm text-slate-500">{item.displayDescription}</p>
                        ) : null}
                        <p className="mt-1 text-sm text-slate-500">
                          {toRelativeAge(item.created_at)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm font-semibold ${item.tokenBadgeToneClass}`}
                    >
                      <Coins size={14} />
                      {item.tokenBadgeLabel}
                    </span>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
