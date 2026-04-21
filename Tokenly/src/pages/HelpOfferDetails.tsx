import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock3, Coins, Sparkles, MessageCircle, CheckCircle2, XCircle, Star } from "lucide-react";
import Avatar from "../components/common/Avatar";
import Loader from "../components/common/Loader";
import { supabase } from "../lib/supabaseClient";
import { getHelpOfferById } from "../services/helpOfferService";
import { getRequestsForHelpOffer, acceptHelpOfferRequest, rejectHelpOfferRequest } from "../services/helpOfferService";
import type { HelpOffer, HelpOfferRequest } from "../types/helpOffer";

type IncomingRequest = HelpOfferRequest & {
  requester: {
    id: string;
    full_name: string | null;
    username: string | null;
    avg_rating: number | null;
    profile_image_url: string | null;
  } | null;
};

const urgencyLabel: Record<string, string> = {
  low: "Low urgency",
  medium: "Medium urgency",
  high: "High urgency",
};

const urgencyStyle: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-rose-50 text-rose-600",
};

const statusStyle: Record<string, string> = {
  open: "bg-indigo-50 text-indigo-700",
  closed: "bg-slate-100 text-slate-600",
  accepted: "bg-emerald-50 text-emerald-700",
};

export default function HelpOfferDetails() {
  const { offerId } = useParams<{ offerId: string }>();
  const navigate = useNavigate();

  const [offer, setOffer] = useState<HelpOffer | null>(null);
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  // Load current user
  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  // Load the help_offer
  useEffect(() => {
    if (!offerId) { setError("Offer not found."); setLoading(false); return; }
    let mounted = true;
    setLoading(true);

    void getHelpOfferById(offerId).then(({ data, error }) => {
      if (!mounted) return;
      if (error || !data) { setError(error?.message ?? "Offer not found."); setLoading(false); return; }
      setOffer(data as HelpOffer);
      setLoading(false);
    });

    return () => { mounted = false; };
  }, [offerId]);

  // Load incoming help_offer_requests for this offer
  useEffect(() => {
    if (!offerId) return;
    let mounted = true;
    setRequestsLoading(true);

    void getRequestsForHelpOffer(offerId).then(({ data, error: reqError }) => {
      if (!mounted) return;
      if (reqError) { setRequestsLoading(false); return; }
      setRequests((data ?? []) as unknown as IncomingRequest[]);
      setRequestsLoading(false);
    });

    return () => { mounted = false; };
  }, [offerId]);

  // Guard: only the helper who owns this offer can view this page
  useEffect(() => {
    if (!offer || !currentUserId) return;
    if (offer.helper_id !== currentUserId) {
      navigate("/my-offers", { replace: true });
    }
  }, [offer, currentUserId, navigate]);

  const handleAccept = async (requestId: string) => {
    setActionLoadingId(requestId);
    setActionError("");
    const { error } = await acceptHelpOfferRequest(requestId);
    if (error) { setActionError(error.message); setActionLoadingId(null); return; }
    // Update local state: mark accepted, reject others
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: "accepted" as const }
          : { ...r, status: "rejected" as const }
      )
    );
    setOffer((prev) => prev ? { ...prev, status: "accepted" as const } : prev);
    setActionLoadingId(null);
  };

  const handleReject = async (requestId: string) => {
    setActionLoadingId(requestId);
    setActionError("");
    const { error } = await rejectHelpOfferRequest(requestId);
    if (error) { setActionError(error.message); setActionLoadingId(null); return; }
    setRequests((prev) =>
      prev.map((r) => r.id === requestId ? { ...r, status: "rejected" as const } : r)
    );
    setActionLoadingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)]">
        <main className="mx-auto max-w-3xl px-4 py-10">
          <Loader inline label="Loading offer..." />
        </main>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)]">
        <main className="mx-auto max-w-3xl px-4 py-10 text-sm text-rose-600">{error || "Offer not found."}</main>
      </div>
    );
  }

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const resolvedRequests = requests.filter((r) => r.status !== "pending");

  return (
    <div className="relative min-h-full overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-indigo-200/25 blur-3xl" />
        <div className="absolute -right-20 top-44 h-72 w-72 rounded-full bg-sky-200/20 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-6 sm:px-5 lg:py-8">
        {/* Back */}
        <Link
          to="/my-offers"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={15} />
          My Offers
        </Link>

        {/* Offer card */}
        <section className="mt-4 rounded-3xl border border-white/55 bg-white/80 p-5 shadow-sm backdrop-blur-xl md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  {offer.category ?? "General"}
                </span>
                {offer.urgency ? (
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${urgencyStyle[offer.urgency] ?? ""}`}>
                    {urgencyLabel[offer.urgency]}
                  </span>
                ) : null}
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[offer.status] ?? ""}`}>
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </span>
              </div>
              <h1 className="mt-3 text-xl font-bold tracking-tight text-slate-900">{offer.title}</h1>
            </div>
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-600">{offer.description}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-700">
            {offer.duration_minutes ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} className="text-indigo-500" />
                {offer.duration_minutes} min
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <Coins size={14} className="text-indigo-500" />
              {offer.credit_cost} credits
            </span>
            {offer.urgency ? (
              <span className="inline-flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-500" />
                {urgencyLabel[offer.urgency]}
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Posted {new Date(offer.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </section>

        {/* Incoming requests */}
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">
            Incoming Requests
            <span className="ml-2 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {requests.length}
            </span>
          </h2>

          {actionError ? (
            <p className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-600">{actionError}</p>
          ) : null}

          {requestsLoading ? (
            <Loader className="py-14" />
          ) : requests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-center text-sm text-slate-500">
                No one has requested this offer yet. Share it to get bookings.
              </div>
            ) : (
            <div className="space-y-3">
              {/* Pending first */}
              {pendingRequests.map((req) => {
                const requester = Array.isArray(req.requester) ? req.requester[0] : req.requester;
                const name = requester?.full_name ?? requester?.username ?? "User";
                const isActing = actionLoadingId === req.id;

                return (
                  <article key={req.id} className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={name}
                          imageUrl={requester?.profile_image_url}
                          className="h-9 w-9 rounded-full"
                          imageClassName="rounded-full"
                          fallbackClassName="bg-indigo-100 text-sm font-semibold text-indigo-700"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{name}</p>
                          {requester?.avg_rating ? (
                            <p className="text-xs text-slate-500 inline-flex items-center gap-1">
                              <Star size={11} className="text-amber-400" />
                              {Number(requester.avg_rating).toFixed(1)}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">Pending</span>
                    </div>

                    {req.message ? (
                      <p className="mt-3 inline-flex items-start gap-2 text-sm text-slate-600">
                        <MessageCircle size={14} className="mt-0.5 shrink-0 text-indigo-400" />
                        {req.message}
                      </p>
                    ) : null}

                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        disabled={isActing || offer.status !== "open"}
                        onClick={() => void handleAccept(req.id)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-3 text-xs font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <CheckCircle2 size={13} />
                        {isActing ? "Accepting..." : "Accept"}
                      </button>
                      <button
                        type="button"
                        disabled={isActing || offer.status !== "open"}
                        onClick={() => void handleReject(req.id)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle size={13} />
                        {isActing ? "Rejecting..." : "Reject"}
                      </button>
                    </div>
                  </article>
                );
              })}

              {/* Resolved (accepted/rejected) */}
              {resolvedRequests.map((req) => {
                const requester = Array.isArray(req.requester) ? req.requester[0] : req.requester;
                const name = requester?.full_name ?? requester?.username ?? "User";

                return (
                  <article key={req.id} className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 opacity-75">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={name}
                          imageUrl={requester?.profile_image_url}
                          className="h-8 w-8 rounded-full"
                          imageClassName="rounded-full"
                          fallbackClassName="bg-slate-100 text-xs font-semibold text-slate-600"
                        />
                        <p className="text-sm font-medium text-slate-700">{name}</p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${req.status === "accepted"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-600"
                          }`}
                      >
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </div>
                    {req.message ? (
                      <p className="mt-2 text-xs text-slate-500 line-clamp-2">{req.message}</p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
