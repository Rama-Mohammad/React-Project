import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock3, Coins, Sparkles, Star, CheckCircle2 } from "lucide-react";
import Avatar from "../components/common/Avatar";
import { supabase } from "../lib/supabaseClient";
import { getHelpOfferById, submitHelpOfferRequest } from "../services/helpOfferService";
import { getPublicHelperProfileCore } from "../services/profileService";
import type { HelpOffer } from "../types/helpOffer";

const urgencyStyle: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-rose-50 text-rose-600",
};

const levelStyle: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-700",
  intermediate: "bg-amber-50 text-amber-700",
  advanced: "bg-rose-50 text-rose-700",
  expert: "bg-indigo-50 text-indigo-700",
};

export default function HelpOfferBooking() {
  const { offerId } = useParams<{ offerId: string }>();

  const [offer, setOffer] = useState<HelpOffer | null>(null);
  const [helperProfile, setHelperProfile] = useState<{
    full_name: string | null;
    username: string | null;
    bio: string | null;
    avg_rating: number | null;
    profile_image_url: string | null;
    title: string | null;
    location: string | null;
    created_at: string;
  } | null>(null);
  const [helperSkills, setHelperSkills] = useState<Array<{ id: string; name: string; category: string; level: string; sessions_count: number }>>([]);
  const [helperReviews, setHelperReviews] = useState<Array<{ id: string; rating: number; comment: string | null; created_at: string; reviewer: { full_name: string | null; username: string | null; profile_image_url?: string | null } | null }>>([]);
  const [offerSkillNames, setOfferSkillNames] = useState<string[]>([]);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Booking form state
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Load current user
  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  // Load offer + helper profile in parallel
  useEffect(() => {
    if (!offerId) { setError("Offer not found."); setLoading(false); return; }
    let mounted = true;
    setLoading(true);

    void getHelpOfferById(offerId).then(async ({ data, error: offerError }) => {
      if (!mounted) return;
      if (offerError || !data) { setError(offerError?.message ?? "Offer not found."); setLoading(false); return; }

      const offerData = data as HelpOffer & {
        skills?: Array<{ skill?: { name?: string } | null }>;
      };
      setOffer(offerData);

      // Extract skill names from the nested join
      const skillNames = (offerData.skills ?? [])
        .map((s: { skill?: { name?: string } | null }) => s?.skill?.name)
        .filter(Boolean) as string[];
      setOfferSkillNames(skillNames);

      // Now fetch the helper's public profile
      const helperResult = await getPublicHelperProfileCore(offerData.helper_id);
      if (!mounted) return;

      setHelperProfile(helperResult.profile);
      setHelperSkills(helperResult.skills as typeof helperSkills);
      setHelperReviews(helperResult.reviews as unknown as typeof helperReviews);
      setLoading(false);
    });

    return () => { mounted = false; };
  }, [offerId]);

  const canBook = useMemo(() => {
    if (!currentUserId || !offer) return false;
    // Cannot book your own offer
    if (currentUserId === offer.helper_id) return false;
    // Cannot book a non-open offer
    if (offer.status !== "open") return false;
    return true;
  }, [currentUserId, offer]);

  const handleSubmit = async () => {
    if (!currentUserId) { setSubmitError("Please sign in to book this offer."); return; }
    if (!offer) return;
    if (!canBook) { setSubmitError("You cannot book this offer."); return; }

    setSubmitting(true);
    setSubmitError("");

    const { data, error: submitErr } = await submitHelpOfferRequest({
      help_offer_id: offer.id,
      requester_id: currentUserId,
      message: message.trim() || undefined,
    });

    if (submitErr || !data) {
      setSubmitError(submitErr?.message ?? "Failed to send request. Please try again.");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  const helperName = helperProfile?.full_name ?? helperProfile?.username ?? "Helper";
  const memberSince = helperProfile?.created_at
    ? new Date(helperProfile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";

  if (loading) {
    return (
      <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)]">
        <main className="mx-auto max-w-4xl px-4 py-10 text-sm text-slate-500">Loading offer...</main>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)]">
        <main className="mx-auto max-w-4xl px-4 py-10 text-sm text-rose-600">{error || "Offer not found."}</main>
      </div>
    );
  }

  return (
    <div className="relative min-h-full overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-indigo-200/25 blur-3xl" />
        <div className="absolute -right-20 top-44 h-72 w-72 rounded-full bg-sky-200/20 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-6 sm:px-5 lg:py-8">
        {/* Back */}
        <Link
          to="/explore?tab=offers"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={15} />
          Back to Offers
        </Link>

        <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_360px]">
          {/* Left: offer details + helper info */}
          <div className="space-y-5">
            {/* Offer details card */}
            <section className="rounded-3xl border border-white/55 bg-white/80 p-5 shadow-sm backdrop-blur-xl md:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  {offer.category ?? "General"}
                </span>
                {offer.urgency ? (
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${urgencyStyle[offer.urgency] ?? ""}`}>
                    {offer.urgency.charAt(0).toUpperCase() + offer.urgency.slice(1)} urgency
                  </span>
                ) : null}
                {offer.status !== "open" ? (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                    {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{offer.title}</h1>
              <p className="mt-3 text-sm leading-7 text-slate-600">{offer.description}</p>

              {offerSkillNames.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {offerSkillNames.map((skill) => (
                    <span key={skill} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-700">
                {offer.duration_minutes ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={14} className="text-indigo-500" />
                    {offer.duration_minutes} min session
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5">
                  <Coins size={14} className="text-indigo-500" />
                  {offer.credit_cost} credits
                </span>
                {offer.urgency ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles size={14} className="text-indigo-500" />
                    {offer.urgency === "high" ? "Available soon" : offer.urgency === "medium" ? "Flexible timing" : "Very flexible"}
                  </span>
                ) : null}
              </div>
            </section>

            {/* Helper profile snapshot */}
            {helperProfile ? (
              <section className="rounded-3xl border border-white/55 bg-white/80 p-5 shadow-sm backdrop-blur-xl md:p-6">
                <h2 className="mb-4 text-base font-semibold text-slate-900">About the Helper</h2>

                <div className="flex items-start gap-4">
                  <Avatar
                    name={helperName}
                    imageUrl={helperProfile.profile_image_url}
                    className="h-12 w-12 shrink-0 rounded-full"
                    imageClassName="rounded-full"
                    fallbackClassName="bg-indigo-100 text-base font-semibold text-indigo-700"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">{helperName}</p>
                    {helperProfile.title ? (
                      <p className="text-sm text-slate-500">{helperProfile.title}</p>
                    ) : null}
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      {helperProfile.avg_rating ? (
                        <span className="inline-flex items-center gap-1">
                          <Star size={11} className="text-amber-400" />
                          {Number(helperProfile.avg_rating).toFixed(1)} · {helperReviews.length} reviews
                        </span>
                      ) : null}
                      {memberSince ? <span>Joined {memberSince}</span> : null}
                    </div>
                  </div>
                </div>

                {helperProfile.bio ? (
                  <p className="mt-4 text-sm leading-7 text-slate-600">{helperProfile.bio}</p>
                ) : null}

                {/* Helper's skills */}
                {helperSkills.length > 0 ? (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {helperSkills.slice(0, 8).map((skill) => (
                        <span
                          key={skill.id}
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${levelStyle[skill.level] ?? "bg-slate-100 text-slate-600"}`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <Link
                  to={`/helpers/${offer.helper_id}`}
                  className="mt-4 inline-flex text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  View full profile →
                </Link>
              </section>
            ) : null}

            {/* Recent reviews */}
            {helperReviews.length > 0 ? (
              <section className="rounded-3xl border border-white/55 bg-white/80 p-5 shadow-sm backdrop-blur-xl md:p-6">
                <h2 className="mb-4 text-base font-semibold text-slate-900">Recent Reviews</h2>
                <div className="space-y-4">
                  {helperReviews.slice(0, 3).map((review) => {
                    const reviewer = Array.isArray(review.reviewer) ? review.reviewer[0] : review.reviewer;
                    const reviewerName = reviewer?.full_name ?? reviewer?.username ?? "User";
                    return (
                      <div key={review.id} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={reviewerName}
                              imageUrl={reviewer?.profile_image_url}
                              className="h-10 w-10 rounded-full"
                              imageClassName="rounded-full"
                              fallbackClassName="bg-indigo-100 text-xs font-semibold text-indigo-700"
                            />
                            <p className="text-sm font-semibold text-slate-900">{reviewerName}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment ? (
                          <p className="mt-1 text-sm text-slate-600">{review.comment}</p>
                        ) : null}
                        <p className="mt-1 text-xs text-slate-400">
                          {new Date(review.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </div>

          {/* Right: booking form */}
          <aside>
            <div className="sticky top-20 rounded-3xl border border-white/55 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
              {submitted ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <CheckCircle2 size={40} className="text-indigo-500" />
                  <h3 className="mt-3 text-base font-semibold text-slate-900">Request Sent!</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    The helper will review your request and respond soon. You'll get a notification when they accept.
                  </p>
                  <Link
                    to="/explore?tab=offers"
                    className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Browse more offers
                  </Link>
                </div>
              ) : (
                <>
                  <h3 className="text-base font-semibold text-slate-900">Request this offer</h3>

                  <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Duration</span>
                      <span className="font-semibold text-slate-900">{offer.duration_minutes ?? "—"} min</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-slate-600">Credits</span>
                      <span className="font-semibold text-indigo-600">{offer.credit_cost} credits</span>
                    </div>
                  </div>

                  <label className="mt-4 block">
                    <span className="text-sm font-semibold text-slate-800">Message to helper</span>
                    <span className="ml-1 text-xs text-slate-400">(optional)</span>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={500}
                      rows={4}
                      placeholder="Tell the helper what you need, any background context, or when you're available..."
                      className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white/90 p-3 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                    />
                    <p className="mt-1 text-right text-xs text-slate-400">{message.length}/500</p>
                  </label>

                  {!currentUserId ? (
                    <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                      <Link to="/auth" className="font-semibold underline">Sign in</Link> to book this offer.
                    </p>
                  ) : !canBook && offer.status !== "open" ? (
                    <p className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      This offer is no longer available.
                    </p>
                  ) : !canBook ? (
                    <p className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      You cannot book your own offer.
                    </p>
                  ) : null}

                  {submitError ? (
                    <p className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                      {submitError}
                    </p>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => void handleSubmit()}
                    disabled={submitting || !canBook}
                    className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 via-sky-500 to-indigo-500 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Send Request"}
                  </button>

                  <p className="mt-3 text-center text-xs text-slate-400">
                    The helper must accept before a session is created. No credits charged yet.
                  </p>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
