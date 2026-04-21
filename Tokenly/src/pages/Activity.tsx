import { Calendar, Coins, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/common/Loader";
import useTransactions from "../hooks/useTransactions";
import { supabase } from "../lib/supabaseClient";

function toneClasses(type: string) {
  if (type === "earn" || type === "bonus") return "bg-violet-100 text-violet-700";
  return "bg-rose-100 text-rose-700";
}

function toRelativeAge(dateValue?: string | null) {
  if (!dateValue) return "just now";
  const date = new Date(dateValue);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (!Number.isFinite(diffMs) || diffMs < 0) return "just now";
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 60) return `${Math.max(1, minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Activity() {
  const { transactions, loading, error, fetchTransactionsByUser } = useTransactions();
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let mounted = true;

    void (async () => {
      const { data, error: userError } = await supabase.auth.getUser();
      if (!mounted) return;

      if (userError || !data.user?.id) {
        setAuthError("Please sign in to view your activity.");
        return;
      }

      setAuthError("");
      await fetchTransactionsByUser(data.user.id);
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allActivity = useMemo(() => transactions, [transactions]);

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
                Your full activity history appears here after the dashboard preview.
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
              <div className="px-4 py-5 sm:px-5">
                <Loader inline label="Loading activity..." />
              </div>
            ) : error ? (
              <div className="px-4 py-5 text-sm text-rose-600 sm:px-5">{error}</div>
            ) : allActivity.length === 0 ? (
              <div className="px-4 py-5 text-sm text-slate-500 sm:px-5">No activity yet.</div>
            ) : (
              allActivity.map((item) => (
                <article
                  key={item.id}
                  className="flex items-center justify-between border-b border-indigo-200/70 px-4 py-5 last:border-b-0 sm:px-5"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-3 ${toneClasses(item.type)}`}>
                      {item.type === "earn" || item.type === "bonus" ? (
                        <Plus size={15} />
                      ) : (
                        <Calendar size={15} />
                      )}
                    </div>
                    <div>
                      <p className="text-base leading-tight">{item.description ?? "Token transaction"}</p>
                      <p className="mt-1 text-sm text-slate-500">{toRelativeAge(item.created_at)}</p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
                      item.type === "earn" || item.type === "bonus"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-violet-100 text-violet-700"
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
      </main>
    </div>
  );
}

