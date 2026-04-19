import {
  AlertTriangle,
  Clock3,
  Coins,
  Flag,
  MessageCircle,
  Share2,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";
import Avatar from "../components/common/Avatar";
import RatingStars from "../components/common/RatingStars";
import { supabase } from "../lib/supabaseClient";
import {
  acceptOffer,
  createOffer,
  getOffersForRequest,
  rejectOffer,
  type OfferForRequestRow,
} from "../services/offerService";
import {
  getProfileCompletedSessionsCount,
  getProfileCreditBalance,
} from "../services/profileService";
import { deleteRequest, getRequestById } from "../services/requestService";
import { mapRequestToExploreItem } from "../utils/exploreMappers";
import type { RequestItem } from "../types/explore";
import tokenlyLogo from "../assets/favicon_tokenly.svg";

const urgencyStyles: Record<string, string> = {
  High: "bg-rose-50 text-rose-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-emerald-50 text-emerald-600",
};

export default function RequestDetails() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<RequestItem | null>(null);
  const [requestOwnerId, setRequestOwnerId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isDeletingRequest, setIsDeletingRequest] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoadingRequest, setIsLoadingRequest] = useState(true);
  const [requestLoadError, setRequestLoadError] = useState("");
  const [actionFeedback, setActionFeedback] = useState<string>("");
  const [offerMessage, setOfferMessage] = useState("");
  const [availability, setAvailability] = useState("");
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
  const [offerFeedback, setOfferFeedback] = useState("");
  const [offerError, setOfferError] = useState("");
  const [offers, setOffers] = useState<OfferForRequestRow[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offersError, setOffersError] = useState("");
  const [offerActionId, setOfferActionId] = useState<string | null>(null);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const formatAvailabilityValue = (value?: string | null) => {
    if (!value) return "Not provided";

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;

    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(parsed);
  };

  useEffect(() => {
    if (!requestId) {
      setIsLoadingRequest(false);
      return;
    }

    let mounted = true;
    setIsLoadingRequest(true);
    setRequestLoadError("");

    void getRequestById(requestId).then(({ data, error }) => {
      if (!mounted) return;

      if (error || !data) {
        setRequest(null);
        setRequestLoadError(error?.message ?? "Request not found");
        setIsLoadingRequest(false);
        return;
      }

      setRequest(mapRequestToExploreItem(data as never));
      setRequestOwnerId((data as { requester_id?: string | null }).requester_id ?? null);
      setIsLoadingRequest(false);
    });

    return () => {
      mounted = false;
    };
  }, [requestId]);

  useEffect(() => {
    let mounted = true;

    void supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setCurrentUserId(data.user?.id ?? null);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!requestOwnerId) {
      setSessionsCompleted(0);
      return;
    }

    let mounted = true;

    void getProfileCompletedSessionsCount(requestOwnerId).then(({ count }) => {
      if (!mounted) return;
      setSessionsCompleted(count);
    });

    return () => {
      mounted = false;
    };
  }, [requestOwnerId]);

  useEffect(() => {
    if (!request?.id) return;

    let mounted = true;
    setOffersLoading(true);
    setOffersError("");

    void getOffersForRequest(request.id).then(({ data, error }) => {
      if (!mounted) return;

      if (error) {
        setOffers([]);
        setOffersError(error.message ?? "Could not load offers.");
        setOffersLoading(false);
        return;
      }

      setOffers(data ?? []);
      setOffersLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [request?.id]);

  if (isLoadingRequest) {
    return (
<div className="flex flex-col items-center justify-center gap-3 py-14">
  <img
    src={tokenlyLogo}
    alt="Loading"
    className="h-9 w-9 animate-spin"
    style={{
      animationDuration: "1.2s",
      animationTimingFunction: "linear",
    }}
  />
</div>
    );
  }

  // to handle errors
  if (!request) {
    return (
      <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
        <main className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Request not found</h1>
          <p className="mt-2 text-slate-600">
            {requestLoadError || "We couldn't find this request. It may have been removed."}
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Go Back
          </button>
        </main>
      </div>
    );
  }

  const authorSkills = request.tags.slice(0, 3);
  const canSubmitOffer = offerMessage.trim().length > 0 && availability.trim().length > 0 && !isSubmittingOffer;
  const canDeleteRequest = Boolean(currentUserId && requestOwnerId && currentUserId === requestOwnerId);
  const canManageOffers = canDeleteRequest;

  const refreshOffers = async () => {
    if (!request?.id) return;

    setOffersLoading(true);
    setOffersError("");
    const { data, error } = await getOffersForRequest(request.id);
    if (error) {
      setOffersError(error.message ?? "Could not refresh offers.");
      setOffersLoading(false);
      return;
    }

    setOffers(data ?? []);
    setOffersLoading(false);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `${request.title} | Tokenly`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: `Can you help with this request on Tokenly?`,
          url: shareUrl,
        });
        setActionFeedback("Shared successfully.");
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setActionFeedback("Request link copied to clipboard.");
    } catch {
      setActionFeedback("Could not share right now. Please try again.");
    }
  };

  const handleReport = () => {
    const subject = `Report request: ${request.title}`;
    const body = [
      "Hello Tokenly team,",
      "",
      "I want to report this request.",
      `Request ID: ${request.id}`,
      `Request title: ${request.title}`,
      `Request URL: ${window.location.href}`,
      "",
      "Issue details:",
    ].join("\n");

    window.location.href = `mailto:support@tokenly.app?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setActionFeedback("Opened your email app to submit a report.");
  };

  const handleDeleteRequest = async () => {
    if (!canDeleteRequest) {
      setActionFeedback("Only the request creator can delete this request.");
      return;
    }

    setIsDeletingRequest(true);
    try {
      const { error } = await deleteRequest(request.id, currentUserId ?? undefined);
      if (error) {
        setActionFeedback("Could not delete request right now.");
        return;
      }

      navigate("/explore?tab=requests#explore-tabs-bar");
    } finally {
      setIsDeletingRequest(false);
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    if (!currentUserId) {
      setOffersError("Please sign in first.");
      return;
    }

    if (!canManageOffers || !requestOwnerId) {
      setOffersError("Only the requester can accept offers.");
      return;
    }

    if (!request?.id) {
      setOffersError("Request not found.");
      return;
    }

    setOfferActionId(offerId);
    setOffersError("");
    try {
      const { data: profile, error: profileError } = await getProfileCreditBalance(currentUserId);
      if (profileError) {
        setOffersError(profileError.message ?? "Could not verify your token balance.");
        return;
      }

      const currentBalance = Number(profile?.credit_balance ?? 0);
      const requiredTokens = Number(request.credits ?? 0);

      if (currentBalance < requiredTokens) {
        setOffersError("Not enough tokens to accept this offer.");
        navigate(`/tokens/options?required=${requiredTokens}&balance=${currentBalance}`);
        return;
      }

      const { error } = await acceptOffer(offerId, {
        id: request.id,
        requester_id: requestOwnerId,
        duration_minutes: request.duration,
        credit_cost: request.credits,
      });

      if (error) {
        setOffersError(error.message ?? "Could not accept offer.");
        return;
      }

      setOfferFeedback("Offer accepted. Session created successfully.");
      await refreshOffers();
    } finally {
      setOfferActionId(null);
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    if (!currentUserId) {
      setOffersError("Please sign in first.");
      return;
    }

    if (!canManageOffers) {
      setOffersError("Only the requester can reject offers.");
      return;
    }

    setOfferActionId(offerId);
    setOffersError("");
    try {
      const { error } = await rejectOffer(offerId);
      if (error) {
        setOffersError(error.message ?? "Could not reject offer.");
        return;
      }

      setOfferFeedback("Offer rejected.");
      await refreshOffers();
    } finally {
      setOfferActionId(null);
    }
  };

  const handleSubmitOffer = async () => {
    const messageValue = offerMessage.trim();
    const availabilityValue = availability.trim();

    if (!messageValue || !availabilityValue) {
      setOfferError("Please fill in both fields.");
      setOfferFeedback("");
      return;
    }

    if (!request?.id) {
      setOfferError("Request not found.");
      setOfferFeedback("");
      return;
    }

    setOfferError("");
    setOfferFeedback("");
    setIsSubmittingOffer(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        throw userError;
      }

      const helperId = userData.user?.id;
      if (!helperId) {
        setOfferError("You must be signed in to submit an offer.");
        return;
      }

      if (requestOwnerId && helperId === requestOwnerId) {
        setOfferError("You cannot submit an offer on your own request.");
        return;
      }

      if (!requestOwnerId) {
        const { data: requestOwner, error: requestOwnerError } = await supabase
          .from("requests")
          .select("requester_id")
          .eq("id", request.id)
          .maybeSingle();

        if (requestOwnerError) throw requestOwnerError;
        if (requestOwner?.requester_id && requestOwner.requester_id === helperId) {
          setOfferError("You cannot submit an offer on your own request.");
          return;
        }
      }

      const { data: existingOffer, error: duplicateCheckError } = await supabase
        .from("offers")
        .select("id")
        .eq("request_id", request.id)
        .eq("helper_id", helperId)
        .maybeSingle();

      if (duplicateCheckError) throw duplicateCheckError;

      if (existingOffer?.id) {
        setOfferError("You already submitted an offer for this request.");
        return;
      }

      const { error } = await createOffer(request.id, messageValue, availabilityValue);
      if (error) throw error;

      setOfferFeedback("Offer submitted successfully.");
      setOfferMessage("");
      setAvailability("");
      await refreshOffers();
    } catch (error) {
      const detailedMessage =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: string }).message)
          : "Failed to submit offer.";
      console.error("Offer submission failed:", error);
      if (detailedMessage.toLowerCase().includes('infinite recursion detected in policy for relation "offers"')) {
        setOfferError("Offer submission is being blocked by the current Supabase offers policy. The database policy for the offers table needs to be fixed.");
      } else {
        setOfferError(detailedMessage || "Failed to submit offer.");
      }
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="explore-pulse absolute -left-24 top-20 h-64 w-64 rounded-full bg-indigo-200/24 blur-3xl" />
        <div className="explore-float absolute right-[-6rem] top-44 h-72 w-72 rounded-full bg-sky-200/22 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-5 lg:px-6 lg:py-7">
        <div className="mb-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/50 bg-white/75 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur transition hover:bg-white"
          >
            Back
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.9fr_0.8fr]">
          <div className="space-y-5">
            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/50 bg-white/80 p-5 backdrop-blur-xl md:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {request.category}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${urgencyStyles[request.urgency]}`}
                  >
                    {request.urgency} urgency
                  </span>
                </div>
                <span className="text-xs text-slate-500">{request.postedAgo}</span>
              </div>

              <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-[1.9rem]">
                {request.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-700">
                  <Clock3 size={15} />
                  {request.duration} min session
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-sm font-semibold text-indigo-700">
                  <Coins size={15} />
                  {request.credits} tokens offered
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-700">
                  <MessageCircle size={15} />
                  {request.offers} offers received
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-white/60 bg-white/75 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</p>
                <p className="mt-2.5 text-base leading-7 text-slate-600">{request.description}</p>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Skills Required</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {request.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-white/90 px-3.5 py-1 text-sm text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/50 bg-white/80 p-5 backdrop-blur-xl md:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Posted by</p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Avatar
                  name={request.author.name}
                  imageUrl={request.author.profileImageUrl}
                  className="h-16 w-16 rounded-full"
                  imageClassName="rounded-full"
                  fallbackClassName={`${request.author.avatarBg} text-lg font-bold text-slate-800`}
                />

                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{request.author.name}</h3>
                  <p className="mt-1 inline-flex items-center gap-2 text-sm text-slate-600">
                    <RatingStars value={request.author.rating ?? 0} />
                    {request.author.rating?.toFixed(1)}
                    <span className="text-slate-500">
                      {sessionsCompleted} {sessionsCompleted === 1 ? "session" : "sessions"} completed
                    </span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {authorSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-sm text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/50 bg-white/80 p-5 backdrop-blur-xl md:p-6">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Submitted Offers</p>
                <span className="rounded-full border border-slate-200 bg-white/85 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {offers.length}
                </span>
              </div>

              {offersLoading ? (
                <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-sm text-slate-600">
                  Loading offers...
                </div>
              ) : offersError ? (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
                  {offersError}
                </div>
              ) : offers.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-sm text-slate-600">
                  No offers yet. Once helpers submit offers, they will appear here.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {offers.map((offer) => {
                    const helperName =
                      offer.helper?.full_name ??
                      offer.helper?.username ??
                      "Unknown helper";
                    const helperRating = offer.helper?.avg_rating ?? 0;
                    const isPending = offer.status === "pending";
                    const isActionLoading = offerActionId === offer.id;

                    return (
                      <article
                        key={offer.id}
                        className="rounded-2xl border border-slate-200/80 bg-white/90 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={helperName}
                              imageUrl={offer.helper?.profile_image_url}
                              className="h-10 w-10 rounded-full"
                              imageClassName="rounded-full"
                              fallbackClassName="bg-indigo-100 text-xs font-semibold text-indigo-700"
                            />
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{helperName}</p>
                              <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-600">
                                <RatingStars value={helperRating} />
                                {helperRating.toFixed(1)}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              offer.status === "accepted"
                                ? "bg-emerald-50 text-emerald-700"
                                : offer.status === "rejected"
                                  ? "bg-rose-50 text-rose-700"
                                  : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {offer.status}
                          </span>
                        </div>

                        <p className="mt-3 text-sm text-slate-700">{offer.message || "No message provided."}</p>
                        <p className="mt-2 text-xs text-slate-600">
                          <span className="font-semibold text-slate-700">Availability:</span>{" "}
                          {formatAvailabilityValue(offer.availability)}
                        </p>

                        {canManageOffers ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={!isPending || isActionLoading}
                              onClick={() => void handleAcceptOffer(offer.id)}
                              className={`h-9 rounded-xl px-3 text-sm font-semibold text-white transition ${
                                !isPending || isActionLoading
                                  ? "cursor-not-allowed bg-slate-300"
                                  : "bg-gradient-to-r from-indigo-500 to-violet-500 hover:brightness-105"
                              }`}
                            >
                              {isActionLoading ? "Saving..." : "Accept"}
                            </button>
                            <button
                              type="button"
                              disabled={!isPending || isActionLoading}
                              onClick={() => void handleRejectOffer(offer.id)}
                              className={`h-9 rounded-xl border px-3 text-sm font-semibold transition ${
                                !isPending || isActionLoading
                                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                                  : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                              }`}
                            >
                              Reject
                            </button>
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <div className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/78 p-5 backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-slate-900">Can you help?</h3>
              <p className="mt-2 text-base text-slate-600">
                Submit an offer to help with this request. You'll earn{" "}
                <span className="font-semibold text-indigo-600">{request.credits} tokens</span>{" "}
                on completion.
              </p>

              <label className="mt-4 block text-sm font-semibold text-slate-800">
                Your message to the requester
              </label>
              <textarea
                maxLength={500}
                value={offerMessage}
                onChange={(event) => setOfferMessage(event.target.value)}
                placeholder="Explain why you're a good fit and how you'll approach this..."
                className="mt-2 h-24 w-full resize-none rounded-2xl border border-slate-200/80 bg-white/92 p-3 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
              <p className="mt-1 text-right text-xs text-slate-500">{offerMessage.length}/500</p>

              <label className="mt-3 block text-sm font-semibold text-slate-800">
                Your availability
              </label>
              <input
                type="datetime-local"
                value={availability}
                onChange={(event) => setAvailability(event.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200/80 bg-white/92 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="button"
                onClick={handleSubmitOffer}
                disabled={!canSubmitOffer}
                className={`mt-4 h-11 w-full rounded-xl text-sm font-semibold text-white transition ${
                  canSubmitOffer
                    ? "bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500 hover:brightness-105"
                    : "cursor-not-allowed bg-slate-300"
                }`}
              >
                {isSubmittingOffer ? "Submitting..." : "Submit Offer"}
              </button>

              {offerError ? (
                <p className="mt-2 text-sm font-medium text-rose-600">{offerError}</p>
              ) : null}
              {offerFeedback ? (
                <p className="mt-2 text-sm font-medium text-emerald-600">{offerFeedback}</p>
              ) : null}
            </div>

            <div className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/78 p-5 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-slate-900">Session Details</h3>
              <div className="mt-3.5 space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <Clock3 size={15} className="text-indigo-400" />
                    Duration
                  </span>
                  <span className="font-semibold text-slate-800">{request.duration} minutes</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <Coins size={15} className="text-indigo-400" />
                    Tokens earned
                  </span>
                  <span className="font-semibold text-indigo-600">{request.credits} tokens</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <AlertTriangle size={15} className="text-indigo-400" />
                    Urgency
                  </span>
                  <span className="font-semibold text-slate-800">{request.urgency}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck size={15} className="text-indigo-400" />
                    Tokens escrowed
                  </span>
                  <span className="font-semibold text-slate-800">After acceptance</span>
                </div>
              </div>
            </div>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/78 p-4 backdrop-blur-xl">
              <div className={`grid gap-2.5 ${canDeleteRequest ? "grid-cols-3" : "grid-cols-2"}`}>
                <button
                  type="button"
                  onClick={handleShare}
                  className="group flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-300/70 bg-white/70 px-4 text-sm font-semibold text-slate-500 transition hover:bg-white"
                >
                  <Share2 size={14} className="text-slate-500" />
                  <span className="leading-none">Share</span>
                </button>
                <button
                  type="button"
                  onClick={handleReport}
                  className="group flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-300/70 bg-white/70 px-4 text-sm font-semibold text-slate-500 transition hover:bg-white"
                >
                  <Flag size={14} className="text-slate-500" />
                  <span className="leading-none">Report</span>
                </button>
                {canDeleteRequest ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isDeletingRequest}
                    className={`group flex h-11 items-center justify-center gap-2 rounded-2xl border border-rose-200/80 px-4 text-sm font-semibold transition ${
                      isDeletingRequest
                        ? "cursor-not-allowed bg-rose-100/60 text-rose-400"
                        : "bg-rose-50/80 text-rose-600 hover:bg-rose-100"
                    }`}
                  >
                    <Trash2 size={14} className="text-current" />
                    <span className="leading-none">{isDeletingRequest ? "Deleting..." : "Delete"}</span>
                  </button>
                ) : null}
              </div>
              {actionFeedback ? (
                <p className="mt-3 text-center text-sm text-slate-600">{actionFeedback}</p>
              ) : null}
            </section>
          </aside>
        </div>
      </main>

      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        title="Delete this request?"
        message="This request will be removed permanently."
        itemName={request.title}
        details={`${request.offers} offers - ${request.credits} tokens`}
        confirmLabel="Delete Request"
        loading={isDeletingRequest}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={async () => {
          await handleDeleteRequest();
          setShowDeleteConfirm(false);
        }}
      />
    </div>
  );
}






