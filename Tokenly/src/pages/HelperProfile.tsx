import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Star, Clock3, Coins, Sparkles, Globe } from "lucide-react";
import Avatar from "../components/common/Avatar";
import { supabase } from "../lib/supabaseClient";
import { getPublicHelperProfileCore, getHelperOpenOffers } from "../services/profileService";

const levelStyle: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-700",
  intermediate: "bg-amber-50 text-amber-700",
  advanced: "bg-rose-50 text-rose-700",
  expert: "bg-indigo-50 text-indigo-700",
};

const urgencyStyle: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-rose-50 text-rose-600",
};

function normalizeWebsiteUrl(value?: string | null) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export default function HelperProfile() {
  const { helperId } = useParams<{ helperId: string }>();

  const [profile, setProfile] = useState<{
    id: string;
    full_name: string | null;
    username: string | null;
    bio: string | null;
    avg_rating: number | null;
    profile_image_url: string | null;
    cover_image_url: string | null;
    title: string | null;
    location: string | null;
    website: string | null;
    created_at: string;
  } | null>(null);
  const [skills, setSkills] = useState<Array<{ id: string; name: string; category: string; level: string; sessions_count: number; description?: string | null }>>([]);
  const [reviews, setReviews] = useState<Array<{ id: string; rating: number; comment: string | null; created_at: string; reviewer: { full_name: string | null; username: string | null; profile_image_url?: string | null } | null }>>([]);
  const [helpOffers, setHelpOffers] = useState<Array<{ id: string; title: string; description: string; category: string | null; urgency: string | null; duration_minutes: number | null; credit_cost: number; status: string; created_at: string }>>([]);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load current user to determine if viewing own profile
  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (!helperId) { setError("Helper not found."); setLoading(false); return; }
    let mounted = true;
    setLoading(true);

    void getPublicHelperProfileCore(helperId).then((result) => {
      if (!mounted) return;
      if (result.error || !result.profile) {
        setError(result.error?.message ?? "Helper not found.");
        setLoading(false);
        return;
      }
      setProfile(result.profile as typeof profile);
      setSkills(result.skills as typeof skills);
      setReviews(result.reviews as unknown as typeof reviews);
      setLoading(false);
    });

    void getHelperOpenOffers(helperId).then(({ data }) => {
      if (!mounted) return;
      setHelpOffers((data ?? []) as typeof helpOffers);
    });

    return () => { mounted = false; };
  }, [helperId]);

  const helperName = profile?.full_name ?? profile?.username ?? "Helper";
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";
  const websiteUrl = normalizeWebsiteUrl(profile?.website);

  const avgRating = useMemo(() => {
    if (profile?.avg_rating) return Number(profile.avg_rating).toFixed(1);
    if (reviews.length === 0) return null;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return avg.toFixed(1);
  }, [profile?.avg_rating, reviews]);

  const isOwnProfile = currentUserId === helperId;

  if (loading) {
    return (
      <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)]">
        <main className="mx-auto max-w-4xl px-4 py-10 text-sm text-slate-500">Loading profile...</main>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)]">
        <main className="mx-auto max-w-4xl px-4 py-10 text-sm text-rose-600">{error || "Helper not found."}</main>
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
          to="/explore?tab=helpers"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={15} />
          Back to Helpers
        </Link>

        {/* Profile header */}
        <section className="mt-4 rounded-3xl border border-white/55 bg-white/80 p-5 shadow-sm backdrop-blur-xl md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <Avatar
                name={helperName}
                imageUrl={profile.profile_image_url}
                className="h-16 w-16 shrink-0 rounded-2xl"
                imageClassName="rounded-2xl"
                fallbackClassName="bg-indigo-100 text-xl font-bold text-indigo-700"
              />

              <div>
                <h1 className="text-xl font-bold text-slate-900">{helperName}</h1>
                {profile.title ? <p className="text-sm text-slate-500">{profile.title}</p> : null}

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  {profile.location ? (
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={11} />
                      {profile.location}
                    </span>
                  ) : null}
                  {memberSince ? (
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={11} />
                      Joined {memberSince}
                    </span>
                  ) : null}
                  {avgRating ? (
                    <span className="inline-flex items-center gap-1">
                      <Star size={11} className="text-amber-400" />
                      {avgRating} · {reviews.length} reviews
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            {/* CTA — only if not viewing own profile and signed in */}
            {!isOwnProfile ? (
              <div className="flex flex-col gap-2 sm:items-end">
                {/* Flow 3: send a direct request to this specific helper */}
                <Link
                  to={`/helpers/${helperId}/request`}
                  className="inline-flex h-10 items-center rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-4 text-sm font-semibold text-white transition hover:brightness-105"
                >
                  Request directly
                </Link>
                {helpOffers.length > 0 ? (
                  <p className="text-xs text-slate-500">or browse their open offers below</p>
                ) : null}
              </div>
            ) : (
              <Link
                to="/profile"
                className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Edit Profile
              </Link>
            )}
          </div>

          {profile.bio ? (
            <p className="mt-4 text-sm leading-7 text-slate-600">{profile.bio}</p>
          ) : null}

          {profile.website ? (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100 hover:text-sky-800"
            >
              <Globe size={14} />
              {profile.website}
            </a>
          ) : null}
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
          {/* Left: skills + reviews */}
          <div className="space-y-5">
            {/* Skills */}
            {skills.length > 0 ? (
              <section className="rounded-3xl border border-white/55 bg-white/80 p-5 shadow-sm backdrop-blur-xl md:p-6">
                <h2 className="mb-4 text-base font-semibold text-slate-900">
                  Skills
                  <span className="ml-2 text-xs font-normal text-slate-400">{skills.length} listed</span>
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">{skill.name}</p>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${levelStyle[skill.level] ?? "bg-slate-100 text-slate-600"}`}>
                          {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{skill.category}</p>
                      {skill.sessions_count > 0 ? (
                        <p className="mt-1 text-xs text-indigo-600">{skill.sessions_count} sessions</p>
                      ) : null}
                      {skill.description ? (
                        <p className="mt-2 text-xs leading-5 text-slate-600 line-clamp-2">{skill.description}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Reviews */}
            {reviews.length > 0 ? (
              <section className="rounded-3xl border border-white/55 bg-white/80 p-5 shadow-sm backdrop-blur-xl md:p-6">
                <h2 className="mb-4 text-base font-semibold text-slate-900">
                  Reviews
                  <span className="ml-2 text-xs font-normal text-slate-400">{reviews.length} total</span>
                </h2>
                <div className="space-y-4">
                  {reviews.map((review) => {
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
                          <div className="flex items-center gap-0.5">
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

          {/* Right: open help_offers */}
          <div>
            {helpOffers.length > 0 ? (
              <section className="rounded-3xl border border-white/55 bg-white/80 p-5 shadow-sm backdrop-blur-xl md:p-6">
                <h2 className="mb-4 text-base font-semibold text-slate-900">Open Offers</h2>
                <div className="space-y-3">
                  {helpOffers.map((offer) => (
                    <div key={offer.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {offer.category ? (
                          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                            {offer.category}
                          </span>
                        ) : null}
                        {offer.urgency ? (
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${urgencyStyle[offer.urgency] ?? ""}`}>
                            {offer.urgency.charAt(0).toUpperCase() + offer.urgency.slice(1)}
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2 text-sm font-semibold text-slate-900">{offer.title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600 line-clamp-2">{offer.description}</p>

                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                        {offer.duration_minutes ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock3 size={11} />
                            {offer.duration_minutes} min
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1 text-indigo-600 font-medium">
                          <Coins size={11} />
                          {offer.credit_cost} credits
                        </span>
                      </div>

                      {/* Link to the public booking page — Flow 2 entry point */}
                      <Link
                        to={`/offers/${offer.id}`}
                        className="mt-3 inline-flex h-8 w-full items-center justify-center rounded-xl bg-indigo-600 text-xs font-semibold text-white transition hover:bg-indigo-700"
                      >
                        Book this offer
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <section className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-5 text-center">
                <Sparkles size={20} className="mx-auto text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">No open offers right now.</p>
                {!isOwnProfile ? (
                  <Link
                    to={`/helpers/${helperId}/request`}
                    className="mt-3 inline-flex text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Request them directly →
                  </Link>
                ) : null}
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
