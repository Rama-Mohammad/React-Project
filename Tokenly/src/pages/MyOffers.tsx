import { Clock3, MessageSquareText, Sparkles } from "lucide-react";
import { BriefcaseBusiness, Coins, Eye, FolderOpen, Send, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";
import Loader from "../components/common/Loader";
import { supabase } from "../lib/supabaseClient";
import { getOffersForHelper } from "../services/offerService";
import type { OfferForHelperRow } from "../types/offer";

type IndependentOfferRow = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  urgency: string | null;
  duration_minutes: number | null;
  credit_cost: number | null;
  status: string;
  created_at: string;
};

export default function MyOffers() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [requestOffers, setRequestOffers] = useState<OfferForHelperRow[]>([]);
  const [independentOffers, setIndependentOffers] = useState<IndependentOfferRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingRequestOfferId, setDeletingRequestOfferId] = useState<string | null>(null);
  const [deletingIndependentOfferId, setDeletingIndependentOfferId] = useState<string | null>(null);
  const [pendingDeleteRequestOfferId, setPendingDeleteRequestOfferId] = useState<string | null>(null);
  const [pendingDeleteIndependentOfferId, setPendingDeleteIndependentOfferId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    void (async () => {
      setLoading(true);
      setError("");

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (!mounted) return;

      if (authError || !authData.user?.id) {
        setCurrentUserId(null);
        setRequestOffers([]);
        setIndependentOffers([]);
        setError("Please sign in to view your offers.");
        setLoading(false);
        return;
      }
      setCurrentUserId(authData.user.id);

      const [requestOffersResult, independentOffersResult] = await Promise.all([
        getOffersForHelper(authData.user.id),
        supabase
          .from("help_offers")
          .select("id, title, description, category, urgency, duration_minutes, credit_cost, status, created_at")
          .eq("helper_id", authData.user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (!mounted) return;

      if (requestOffersResult.error) {
        setRequestOffers([]);
        setIndependentOffers([]);
        setError(requestOffersResult.error.message ?? "Could not load your request offers.");
        setLoading(false);
        return;
      }

      if (independentOffersResult.error) {
        setRequestOffers(requestOffersResult.data ?? []);
        setIndependentOffers([]);
        setError(independentOffersResult.error.message ?? "Could not load your independent offers.");
        setLoading(false);
        return;
      }

      setRequestOffers(requestOffersResult.data ?? []);
      setIndependentOffers((independentOffersResult.data as IndependentOfferRow[]) ?? []);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleDeleteIndependentOffer = async (offerId: string) => {
    if (!currentUserId) {
      setError("Please sign in first.");
      return;
    }

    setDeletingIndependentOfferId(offerId);
    setError("");
    try {
      const { error: deleteError } = await supabase
        .from("help_offers")
        .delete()
        .eq("id", offerId)
        .eq("helper_id", currentUserId);

      if (deleteError) {
        setError(deleteError.message ?? "Could not delete offer.");
        return;
      }

      setIndependentOffers((prev) => prev.filter((offer) => offer.id !== offerId));
      setPendingDeleteIndependentOfferId(null);
    } finally {
      setDeletingIndependentOfferId(null);
    }
  };

  const handleDeleteRequestOffer = async (offerId: string) => {
    if (!currentUserId) {
      setError("Please sign in first.");
      return;
    }

    setDeletingRequestOfferId(offerId);
    setError("");
    try {
      const { error: deleteError } = await supabase
        .from("offers")
        .delete()
        .eq("id", offerId)
        .eq("helper_id", currentUserId);

      if (deleteError) {
        setError(deleteError.message ?? "Could not delete offer.");
        return;
      }

      setRequestOffers((prev) => prev.filter((offer) => offer.id !== offerId));
      setPendingDeleteRequestOfferId(null);
    } finally {
      setDeletingRequestOfferId(null);
    }
  };

  const pendingIndependentOffer = pendingDeleteIndependentOfferId
    ? independentOffers.find((offer) => offer.id === pendingDeleteIndependentOfferId) ?? null
    : null;

  const pendingRequestOffer = pendingDeleteRequestOfferId
    ? requestOffers.find((offer) => offer.id === pendingDeleteRequestOfferId) ?? null
    : null;

  return (
    <div className="relative min-h-full overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <main className="relative z-10 mx-auto max-w-5xl px-4 py-6 sm:px-5 lg:px-6 lg:py-7">
        <section className="explore-glass rounded-[30px] border border-white/60 bg-white/84 p-6 shadow-[0_28px_70px_-42px_rgba(79,70,229,0.28)] backdrop-blur-xl md:p-7">
          <h1 className="text-[1.9rem] font-bold tracking-tight text-slate-950">My Offers</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Track your independent offers and offers submitted on specific requests.
          </p>

          {loading ? (
            <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white/90 p-4">
              <Loader inline label="Loading your offers..." />
            </div>
          ) : error ? (
            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
              {error}
            </div>
          ) : (
            <div className="mt-6 space-y-7">
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
                      <BriefcaseBusiness size={18} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-950">Independent Offers</h2>
                      <p className="text-xs text-slate-400">Standalone offers you published for the marketplace.</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-indigo-100 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
                    {independentOffers.length}
                  </span>
                </div>

                {independentOffers.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-sm text-slate-600">
                    You have not published independent offers yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {independentOffers.map((offer) => (
                      <article
                        key={offer.id}
                        className="rounded-2xl border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-base font-semibold text-slate-950">{offer.title}</p>
                            <p className="mt-1 text-xs font-medium text-slate-500">
                              {offer.category ?? "General"} • {new Date(offer.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="rounded-full border border-indigo-100 bg-indigo-50/85 px-3 py-1 text-xs font-semibold text-indigo-700">
                            {offer.status}
                          </span>
                        </div>

                        <div className="mt-3 grid gap-2.5 text-sm text-slate-700">
                          <p className="inline-flex items-start gap-2.5 leading-6">
                            <MessageSquareText size={15} className="mt-0.5 shrink-0 text-indigo-500" />
                            <span className="text-slate-600">{offer.description || "No description provided."}</span>
                          </p>
                          <p className="inline-flex items-start gap-2.5 leading-6">
                            <Clock3 size={15} className="mt-0.5 shrink-0 text-indigo-500" />
                            <span className="inline-flex flex-wrap items-center gap-1">
                              {offer.duration_minutes ?? 0} min -
                              <Coins size={14} className="text-indigo-500" />
                              {offer.credit_cost ?? 0} tokens
                            </span>
                          </p>
                          <p className="inline-flex items-start gap-2.5 leading-6">
                            <Sparkles size={15} className="mt-0.5 shrink-0 text-indigo-500" />
                            <span className="text-slate-600">Urgency: {offer.urgency ?? "medium"}</span>
                          </p>
                        </div>

                        <div className="mt-4">
                          <div className="flex gap-2">
                            <Link
                              to={`/my-offers/independent/${offer.id}`}
                              className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-300/70 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-slate-50"
                            >
                              <Eye size={15} />
                              View Offer
                            </Link>
                            <button
                              type="button"
                              onClick={() => setPendingDeleteIndependentOfferId(offer.id)}
                              disabled={deletingIndependentOfferId === offer.id}
                              className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-sm font-semibold shadow-sm transition-all duration-200 ${
                                deletingIndependentOfferId === offer.id
                                  ? "cursor-not-allowed border-rose-200 bg-rose-100 text-rose-400"
                                  : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                              }`}
                            >
                              {deletingIndependentOfferId !== offer.id ? <Trash2 size={15} /> : null}
                              {deletingIndependentOfferId === offer.id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 shadow-sm">
                      <FolderOpen size={18} />
                    </div>
                    <div>
                      <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-950">
                        <Send size={16} className="text-violet-500" />
                        Request-Based Offers
                      </h2>
                      <p className="text-xs text-slate-400">Offers you submitted to existing open requests.</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-violet-100 bg-violet-50/80 px-3 py-1 text-xs font-semibold text-violet-700 shadow-sm">
                    {requestOffers.length}
                  </span>
                </div>

                {requestOffers.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-sm text-slate-600">
                    You have not submitted offers on specific requests yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {requestOffers.map((offer) => {
                      const statusClass =
                        offer.status === "accepted"
                          ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                          : offer.status === "rejected"
                            ? "border border-rose-100 bg-rose-50 text-rose-700"
                            : "border border-amber-100 bg-amber-50 text-amber-700";

                      return (
                        <article
                          key={offer.id}
                          className="rounded-2xl border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-base font-semibold text-slate-950">
                                {offer.request?.title ?? "Unknown request"}
                              </p>
                              <p className="mt-1 text-xs font-medium text-slate-500">
                                {offer.request?.category ?? "General"} • {new Date(offer.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
                              {offer.status}
                            </span>
                          </div>

                          <div className="mt-3 grid gap-2.5 text-sm text-slate-700">
                            <p className="inline-flex items-start gap-2.5 leading-6">
                              <MessageSquareText size={15} className="mt-0.5 shrink-0 text-indigo-500" />
                              <span className="text-slate-600">{offer.message || "No message provided."}</span>
                            </p>
                            <p className="inline-flex items-start gap-2.5 leading-6">
                              <Clock3 size={15} className="mt-0.5 shrink-0 text-indigo-500" />
                              <span className="text-slate-600">{offer.availability || "Availability not provided."}</span>
                            </p>
                            <p className="inline-flex items-start gap-2.5 leading-6">
                              <Sparkles size={15} className="mt-0.5 shrink-0 text-indigo-500" />
                              <span className="inline-flex flex-wrap items-center gap-1">
                                {offer.request?.duration_minutes ?? 0} min -
                                <Coins size={14} className="text-indigo-500" />
                                {offer.request?.credit_cost ?? 0} tokens
                              </span>
                            </p>
                          </div>

                          <div className="mt-4">
                            <div className="flex gap-2">
                              <Link
                                to={`/requests/${offer.request_id}`}
                              className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-300/70 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-slate-50"
                            >
                              <Eye size={15} />
                              View Offer
                            </Link>
                            <button
                              type="button"
                                onClick={() => setPendingDeleteRequestOfferId(offer.id)}
                                disabled={deletingRequestOfferId === offer.id}
                                className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-sm font-semibold shadow-sm transition-all duration-200 ${
                                  deletingRequestOfferId === offer.id
                                    ? "cursor-not-allowed border-rose-200 bg-rose-100 text-rose-400"
                                    : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                                }`}
                              >
                                {deletingRequestOfferId !== offer.id ? <Trash2 size={15} /> : null}
                                {deletingRequestOfferId === offer.id ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          )}
        </section>
      </main>
      <ConfirmDeleteModal
        isOpen={Boolean(pendingIndependentOffer)}
        title="Delete this independent offer?"
        message="This offer will be removed from your public listings."
        itemName={pendingIndependentOffer?.title}
        details={pendingIndependentOffer ? `${pendingIndependentOffer.duration_minutes ?? 0} min - ${pendingIndependentOffer.credit_cost ?? 0} tokens` : undefined}
        confirmLabel="Delete Offer"
        loading={Boolean(pendingIndependentOffer && deletingIndependentOfferId === pendingIndependentOffer.id)}
        onCancel={() => setPendingDeleteIndependentOfferId(null)}
        onConfirm={() => {
          if (!pendingIndependentOffer) return;
          return handleDeleteIndependentOffer(pendingIndependentOffer.id);
        }}
      />
      <ConfirmDeleteModal
        isOpen={Boolean(pendingRequestOffer)}
        title="Delete this request-based offer?"
        message="This submitted offer will be removed from the request."
        itemName={pendingRequestOffer?.request?.title ?? "Unknown request"}
        details={pendingRequestOffer ? `${pendingRequestOffer.request?.duration_minutes ?? 0} min - ${pendingRequestOffer.request?.credit_cost ?? 0} tokens` : undefined}
        confirmLabel="Delete Offer"
        loading={Boolean(pendingRequestOffer && deletingRequestOfferId === pendingRequestOffer.id)}
        onCancel={() => setPendingDeleteRequestOfferId(null)}
        onConfirm={() => {
          if (!pendingRequestOffer) return;
          return handleDeleteRequestOffer(pendingRequestOffer.id);
        }}
      />
    </div>
  );
}






