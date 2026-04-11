import { Clock3, MessageSquareText, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import { supabase } from "../lib/supabaseClient";
import { getOffersForHelper, type OfferForHelperRow } from "../services/offerService";

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
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <Navbar />
      <main className="relative z-10 mx-auto max-w-5xl px-4 py-6 sm:px-5 lg:px-6 lg:py-7">
        <section className="explore-glass rounded-3xl border border-white/50 bg-white/80 p-5 backdrop-blur-xl md:p-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Offers</h1>
          <p className="mt-2 text-sm text-slate-600">
            Track your independent offers and offers submitted on specific requests.
          </p>

          {loading ? (
            <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-sm text-slate-600">
              Loading your offers...
            </div>
          ) : error ? (
            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
              {error}
            </div>
          ) : (
            <div className="mt-5 space-y-6">
              <section>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Independent Offers</h2>
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
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
                        className="rounded-2xl border border-slate-200/80 bg-white/90 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{offer.title}</p>
                            <p className="mt-1 text-xs text-slate-600">
                              {offer.category ?? "General"} - {new Date(offer.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                            {offer.status}
                          </span>
                        </div>

                        <div className="mt-3 grid gap-2 text-sm text-slate-700">
                          <p className="inline-flex items-start gap-2">
                            <MessageSquareText size={15} className="mt-0.5 text-indigo-500" />
                            <span>{offer.description || "No description provided."}</span>
                          </p>
                          <p className="inline-flex items-start gap-2">
                            <Clock3 size={15} className="mt-0.5 text-indigo-500" />
                            <span>{offer.duration_minutes ?? 0} min - {offer.credit_cost ?? 0} tokens</span>
                          </p>
                          <p className="inline-flex items-start gap-2">
                            <Sparkles size={15} className="mt-0.5 text-indigo-500" />
                            <span>Urgency: {offer.urgency ?? "medium"}</span>
                          </p>
                        </div>

                        <div className="mt-4">
                          <div className="flex gap-2">
                            <Link
                              to={`/my-offers/independent/${offer.id}`}
                              className="inline-flex h-9 items-center rounded-xl border border-slate-300/70 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              View Offer
                            </Link>
                            <button
                              type="button"
                              onClick={() => setPendingDeleteIndependentOfferId(offer.id)}
                              disabled={deletingIndependentOfferId === offer.id}
                              className={`inline-flex h-9 items-center rounded-xl border px-3 text-sm font-semibold transition ${
                                deletingIndependentOfferId === offer.id
                                  ? "cursor-not-allowed border-rose-200 bg-rose-100 text-rose-400"
                                  : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                              }`}
                            >
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
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Request-Based Offers</h2>
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
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
                          ? "bg-emerald-50 text-emerald-700"
                          : offer.status === "rejected"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700";

                      return (
                        <article
                          key={offer.id}
                          className="rounded-2xl border border-slate-200/80 bg-white/90 p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {offer.request?.title ?? "Unknown request"}
                              </p>
                              <p className="mt-1 text-xs text-slate-600">
                                {offer.request?.category ?? "General"} - {new Date(offer.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
                              {offer.status}
                            </span>
                          </div>

                          <div className="mt-3 grid gap-2 text-sm text-slate-700">
                            <p className="inline-flex items-start gap-2">
                              <MessageSquareText size={15} className="mt-0.5 text-indigo-500" />
                              <span>{offer.message || "No message provided."}</span>
                            </p>
                            <p className="inline-flex items-start gap-2">
                              <Clock3 size={15} className="mt-0.5 text-indigo-500" />
                              <span>{offer.availability || "Availability not provided."}</span>
                            </p>
                            <p className="inline-flex items-start gap-2">
                              <Sparkles size={15} className="mt-0.5 text-indigo-500" />
                              <span>
                                {offer.request?.duration_minutes ?? 0} min - {offer.request?.credit_cost ?? 0} tokens
                              </span>
                            </p>
                          </div>

                          <div className="mt-4">
                            <div className="flex gap-2">
                              <Link
                                to={`/requests/${offer.request_id}`}
                              className="inline-flex h-9 items-center rounded-xl border border-slate-300/70 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              View Offer
                            </Link>
                            <button
                              type="button"
                                onClick={() => setPendingDeleteRequestOfferId(offer.id)}
                                disabled={deletingRequestOfferId === offer.id}
                                className={`inline-flex h-9 items-center rounded-xl border px-3 text-sm font-semibold transition ${
                                  deletingRequestOfferId === offer.id
                                    ? "cursor-not-allowed border-rose-200 bg-rose-100 text-rose-400"
                                    : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                                }`}
                              >
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
        details={pendingIndependentOffer ? `${pendingIndependentOffer.duration_minutes ?? 0} min Â· ${pendingIndependentOffer.credit_cost ?? 0} tokens` : undefined}
        confirmLabel="Delete Offer"
        loading={Boolean(pendingIndependentOffer && deletingIndependentOfferId === pendingIndependentOffer.id)}
        onCancel={() => setPendingDeleteIndependentOfferId(null)}
        onConfirm={() => pendingIndependentOffer && handleDeleteIndependentOffer(pendingIndependentOffer.id)}
      />
      <ConfirmDeleteModal
        isOpen={Boolean(pendingRequestOffer)}
        title="Delete this request-based offer?"
        message="This submitted offer will be removed from the request."
        itemName={pendingRequestOffer?.request?.title ?? "Unknown request"}
        details={pendingRequestOffer ? `${pendingRequestOffer.request?.duration_minutes ?? 0} min Â· ${pendingRequestOffer.request?.credit_cost ?? 0} tokens` : undefined}
        confirmLabel="Delete Offer"
        loading={Boolean(pendingRequestOffer && deletingRequestOfferId === pendingRequestOffer.id)}
        onCancel={() => setPendingDeleteRequestOfferId(null)}
        onConfirm={() => pendingRequestOffer && handleDeleteRequestOffer(pendingRequestOffer.id)}
      />
      <Footer />
    </div>
  );
}

