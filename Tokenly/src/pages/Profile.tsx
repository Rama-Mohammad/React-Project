import React, { useEffect, useMemo, useState } from "react";
import { Plus, Coins, Clock3, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";
import ProfileHeader from "../components/profile/ProfileHeader";
import SkillCard from "../components/profile/SkillCard";
import PortfolioItem from "../components/profile/PortfolioItem";
import ReviewCard from "../components/profile/ReviewCard";
import RatingsSummary from "../components/profile/RatingsSummary";
import EditProfileModal from "../components/profile/EditProfileModal";
import AddSkillModal from "../components/profile/AddSkillModal";
import AddPortfolioModal from "../components/profile/AddPortfolioModal";
import useAuth from "../hooks/useAuth";
import useAuthRedirect from "../hooks/useAuthRedirect";
import usePublicHelperProfile from "../hooks/usePublicHelperProfile";
import usePortfolio from "../hooks/usePortfolio";
import useProfiles from "../hooks/useProfile";
import useSkills from "../hooks/useSkills";
import { resolvePublicProfileIdentifier } from "../services/profileService";
import type { PortfolioEntry, UiReview, UiSkill } from "../types/page";
import type { EditProfileUserInput, ProfileHeaderUser, ReviewSortBy } from "../types/profile";
import tokenlyLogo from "../assets/favicon_tokenly.svg";

const toTitleCase = (value: string) =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}` : value;

const toUiSkillLevel = (value: string): UiSkill["level"] => {
  const normalized = toTitleCase(value);
  if (normalized === "Expert" || normalized === "Advanced" || normalized === "Beginner") {
    return normalized as UiSkill["level"];
  }
  return "Intermediate";
};

const urgencyStyles: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-rose-50 text-rose-600",
};

const Profile: React.FC = () => {
  const { identifier } = useParams<{ identifier?: string }>();
  const { user: authUser, isAuthenticated } = useAuth();
  const { authRedirectState } = useAuthRedirect();
  const {
    profile: liveProfile,
    skills: liveSkills,
    reviews: liveReviews,
    helpOffers,
    loading,
    detailsLoading,
    error,
    fetchProfile,
    fetchOffers,
  } = usePublicHelperProfile();
  const {
    items: livePortfolio,
    loading: portfolioLoading,
    error: portfolioError,
    fetchByUser: fetchPortfolio,
    add: addPortfolioItem,
    edit: editPortfolioItem,
    remove: removePortfolioItem,
  } = usePortfolio();
  const { editProfile } = useProfiles();
  const { addSkill, editSkill: editSkillHook, removeSkill } = useSkills();

  const [resolvedProfileId, setResolvedProfileId] = useState("");
  const [routeLoading, setRouteLoading] = useState(true);
  const [routeError, setRouteError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<UiSkill | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isAddPortfolioModalOpen, setIsAddPortfolioModalOpen] = useState(false);
  const [isPortfolioEditMode, setIsPortfolioEditMode] = useState(false);
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioEntry | null>(null);
  const [pendingPortfolioDeleteId, setPendingPortfolioDeleteId] = useState<string | null>(null);
  const [pendingSkillDeleteId, setPendingSkillDeleteId] = useState<string | null>(null);
  const [reviewSortBy, setReviewSortBy] = useState<ReviewSortBy>("newest");

  useEffect(() => {
    let active = true;

    const resolveTargetProfile = async () => {
      setRouteLoading(true);
      setRouteError("");

      const normalizedIdentifier = identifier?.trim() ?? "";

      if (normalizedIdentifier) {
        if (normalizedIdentifier.includes("-")) {
          setResolvedProfileId(normalizedIdentifier);
          setRouteLoading(false);
          return;
        }

        const result = await resolvePublicProfileIdentifier(normalizedIdentifier);

        if (!active) return;

        if (result.error || !result.data?.id) {
          setResolvedProfileId("");
          setRouteError(result.error?.message ?? "Profile not found.");
          setRouteLoading(false);
          return;
        }

        setResolvedProfileId(result.data.id);
        setRouteLoading(false);
        return;
      }

      if (authUser?.id) {
        setResolvedProfileId(authUser.id);
        setRouteLoading(false);
        return;
      }

      setResolvedProfileId("");
      setRouteError("Profile not found.");
      setRouteLoading(false);
    };

    void resolveTargetProfile();

    return () => {
      active = false;
    };
  }, [authUser?.id, identifier]);

  useEffect(() => {
    const profileId = resolvedProfileId.trim();
    if (!profileId) return;

    void fetchProfile(profileId, {
      includePrivate: authUser?.id === profileId,
    });
    void fetchOffers(profileId, { limit: 3 });
  }, [authUser?.id, fetchOffers, fetchProfile, resolvedProfileId]);

  useEffect(() => {
    const profileId = resolvedProfileId.trim();
    if (!profileId) return;

    void fetchPortfolio(profileId);
  }, [fetchPortfolio, resolvedProfileId]);

  const isOwner = Boolean(authUser?.id && liveProfile?.id && authUser.id === liveProfile.id);
  const pageError = routeError || error;

  const publicProfileIdentifier = useMemo(() => {
    return liveProfile?.id ?? "";
  }, [liveProfile?.id]);

  const publicProfileUrl = useMemo(() => {
    if (!publicProfileIdentifier || typeof window === "undefined") return "";
    return new URL(
      `profile/${encodeURIComponent(publicProfileIdentifier)}`,
      `${window.location.origin}${import.meta.env.BASE_URL}`
    ).toString();
  }, [publicProfileIdentifier]);

  const user: ProfileHeaderUser = useMemo(() => {
    if (!liveProfile) {
      return {
        id: "",
        username: "",
        publicProfileUrl: "",
        name: "",
        title: "",
        location: "",
        memberSince: "",
        bio: "",
        avatarInitials: "",
        profileImageUrl: "",
        rating: 0,
        totalRatings: 0,
        website: "",
        coverImage: "",
        stats: { totalSessions: 0, creditsEarned: 0, skillsTaught: 0 },
      };
    }

    const name = liveProfile.full_name || liveProfile.username || "";
    const initials = name
      .split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    const memberSince = new Date(liveProfile.created_at).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return {
      id: liveProfile.id,
      username: liveProfile.username || "",
      publicProfileUrl,
      name,
      title: liveProfile.title || liveProfile.institution || "",
      location: liveProfile.location || "",
      memberSince,
      bio: liveProfile.bio || "",
      avatarInitials: initials,
      rating: liveProfile.avg_rating ?? 0,
      totalRatings: liveReviews.length,
      website: liveProfile.website || "",
      coverImage: liveProfile.cover_image_url || "",
      profileImageUrl: liveProfile.profile_image_url || "",
      stats: {
        totalSessions: liveSkills.reduce((sum, skill) => sum + (skill.sessions_count ?? 0), 0),
        creditsEarned: isOwner ? liveProfile.credit_balance ?? 0 : liveSkills.length,
        skillsTaught: liveReviews.length,
      },
    };
  }, [isOwner, liveProfile, liveReviews.length, liveSkills, publicProfileUrl]);

  const skills: UiSkill[] = useMemo(() => {
    return liveSkills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      level: toUiSkillLevel(skill.level),
      sessions: skill.sessions_count,
      description: skill.description || "",
    }));
  }, [liveSkills]);

  const portfolio: PortfolioEntry[] = useMemo(() => {
    return livePortfolio.map((item) => ({
      id: item.id,
      type: toTitleCase(item.type) as PortfolioEntry["type"],
      title: item.title,
      date: item.date || "",
      description: item.description || "",
      tags: item.tags || [],
    }));
  }, [livePortfolio]);

  const reviews: UiReview[] = useMemo(() => {
    return liveReviews.map((review: any) => ({
      id: review.id,
      reviewerName: review.reviewer?.full_name || review.reviewer?.username || "Community Member",
      reviewerImageUrl: review.reviewer?.profile_image_url || "",
      date: new Date(review.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      rating: review.rating,
      comment: review.comment || "Great session.",
      skillCategory: "General",
      sessionTopic: "Peer session",
    }));
  }, [liveReviews]);

  const sortedReviews = useMemo(() => {
    const data = [...reviews];
    const getDate = (value: string) => new Date(value).getTime() || 0;

    if (reviewSortBy === "newest") data.sort((a, b) => getDate(b.date) - getDate(a.date));
    if (reviewSortBy === "oldest") data.sort((a, b) => getDate(a.date) - getDate(b.date));
    if (reviewSortBy === "highest") data.sort((a, b) => b.rating - a.rating || getDate(b.date) - getDate(a.date));
    if (reviewSortBy === "lowest") data.sort((a, b) => a.rating - b.rating || getDate(b.date) - getDate(a.date));

    return data;
  }, [reviews, reviewSortBy]);

  const visibleReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3);

  const pendingSkill = pendingSkillDeleteId
    ? skills.find((item) => item.id === pendingSkillDeleteId) ?? null
    : null;

  const pendingPortfolioItem = pendingPortfolioDeleteId
    ? portfolio.find((item) => item.id === pendingPortfolioDeleteId) ?? null
    : null;

  const handleEditProfile = async (updatedUser: EditProfileUserInput) => {
    if (!authUser?.id || !isOwner) return;

    const success = await editProfile(authUser.id, {
      full_name: updatedUser.name,
      title: updatedUser.title,
      location: updatedUser.location,
      bio: updatedUser.bio,
      website: updatedUser.website,
      profile_image_url: updatedUser.profileImageUrl || undefined,
      cover_image_url: updatedUser.coverImage || undefined,
    });

    if (success) {
      await fetchProfile(authUser.id);
    }
  };

  const handleAddSkill = async (newSkill: Omit<UiSkill, "id">) => {
    if (!authUser?.id || !isOwner) return;
    await addSkill({
      user_id: authUser.id,
      name: newSkill.name,
      category: newSkill.category as never,
      level: newSkill.level.toLowerCase() as never,
      description: newSkill.description,
    });
  };

  const handleUpdateSkill = async (updatedSkill: UiSkill) => {
    if (!isOwner) return;
    await editSkillHook(updatedSkill.id, {
      name: updatedSkill.name,
      category: updatedSkill.category as never,
      level: updatedSkill.level.toLowerCase() as never,
      description: updatedSkill.description,
    });
  };

  const handleDeleteSkill = async (id: string) => {
    if (!isOwner) return;
    await removeSkill(id);
    setPendingSkillDeleteId(null);
  };

  const handleEditSkill = (skill: UiSkill) => {
    if (!isOwner) return;
    setSelectedSkill(skill);
    setIsEditMode(true);
    setIsAddSkillModalOpen(true);
  };

  const handleAddPortfolio = async (newItem: Omit<PortfolioEntry, "id">) => {
    if (!authUser?.id || !isOwner) return;
    await addPortfolioItem({
      user_id: authUser.id,
      title: newItem.title,
      description: newItem.description,
      type: newItem.type.toLowerCase(),
      tags: newItem.tags,
      date: newItem.date,
    });
  };

  const handleUpdatePortfolio = async (updatedItem: PortfolioEntry) => {
    if (!isOwner) return;
    await editPortfolioItem(updatedItem.id, {
      title: updatedItem.title,
      description: updatedItem.description,
      type: updatedItem.type.toLowerCase(),
      tags: updatedItem.tags,
      date: updatedItem.date,
    });
  };

  const handleEditPortfolio = (item: PortfolioEntry) => {
    if (!isOwner) return;
    setSelectedPortfolioItem(item);
    setIsPortfolioEditMode(true);
    setIsAddPortfolioModalOpen(true);
  };

  const handleDeletePortfolioRequest = (id: string) => {
    if (!isOwner) return;
    setPendingPortfolioDeleteId(id);
  };

  const handleConfirmDeletePortfolio = async () => {
    if (!pendingPortfolioDeleteId || !isOwner) return;
    await removePortfolioItem(pendingPortfolioDeleteId);
    setPendingPortfolioDeleteId(null);
  };

  const isPageLoading = routeLoading || (loading && !liveProfile);
  const showInteractionPanel = !isOwner && Boolean(liveProfile);

  return (
    <div className="relative min-h-full overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="explore-pulse absolute -left-24 top-20 h-64 w-64 rounded-full bg-indigo-200/24 blur-3xl" />
        <div className="explore-float absolute -right-24 top-44 h-72 w-72 rounded-full bg-sky-200/22 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto min-h-[calc(100vh-76px)] w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6 xl:px-10">
        {pageError ? <p className="mb-3 text-xs text-rose-600">{pageError}</p> : null}

        <ProfileHeader user={user} onEdit={() => setIsEditModalOpen(true)} isOwner={isOwner} />

        {isPageLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <img
              src={tokenlyLogo}
              alt="Loading"
              className="h-10 w-10 animate-spin"
              style={{ animationDuration: "1.2s", animationTimingFunction: "linear" }}
            />
            <p className="text-sm text-slate-400">
              {identifier ? "Loading profile..." : "Loading your profile..."}
            </p>
          </div>
        ) : liveProfile ? (
          <>
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.7fr_1.3fr]">
              <section className="explore-fade-in-up rounded-2xl border border-white/70 bg-white/80 px-5 py-4 backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Offered Skills</h2>
                    <p className="text-xs text-slate-500">{skills.length} skills listed</p>
                  </div>
                  {isOwner ? (
                    <button
                      onClick={() => {
                        setIsEditMode(false);
                        setSelectedSkill(null);
                        setIsAddSkillModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                    >
                      <Plus size={14} />
                      Add Skill
                    </button>
                  ) : null}
                </div>
                <div className="mt-3 grid gap-1 md:grid-cols-2">
                  {detailsLoading ? (
                    <p className="py-4 text-center text-slate-500 md:col-span-2">Loading skills...</p>
                  ) : skills.length > 0 ? (
                    skills.map((skill) => (
                      <SkillCard
                        key={skill.id}
                        skill={skill}
                        onDelete={isOwner ? setPendingSkillDeleteId : undefined}
                        onEdit={isOwner ? handleEditSkill : undefined}
                      />
                    ))
                  ) : (
                    <p className="py-4 text-center text-slate-500">
                      {isOwner ? 'No skills added yet. Click "Add Skill" to get started.' : "No skills listed yet."}
                    </p>
                  )}
                </div>
              </section>

              <section className="explore-fade-in-up rounded-2xl border border-white/70 bg-white/80 px-5 py-4 backdrop-blur-sm">
                <RatingsSummary reviews={reviews} embedded sortBy={reviewSortBy} onSortChange={setReviewSortBy} />
                <div className="mt-4 space-y-3.5 border-t border-slate-200/70 pt-4">
                  {detailsLoading ? (
                    <p className="py-4 text-center text-slate-500">Loading reviews...</p>
                  ) : visibleReviews.length > 0 ? (
                    visibleReviews.map((review) => <ReviewCard key={review.id} review={review} />)
                  ) : (
                    <p className="py-4 text-center text-slate-500">No reviews yet.</p>
                  )}
                </div>
                {reviews.length > 3 ? (
                  <button
                    type="button"
                    onClick={() => setShowAllReviews((value) => !value)}
                    className="mt-3.5 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                  >
                    {showAllReviews ? "Show fewer reviews" : `Show all ${reviews.length} reviews`}
                  </button>
                ) : null}
              </section>
            </div>

            {showInteractionPanel ? (
              <section className="explore-fade-in-up mt-6 rounded-2xl border border-white/70 bg-white/80 px-5 py-4 backdrop-blur-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Connect with {user.name || "this helper"}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Browse their open offers or send a direct request from the same shared profile page.
                    </p>
                  </div>

                  <Link
                    to={isAuthenticated ? `/helpers/${liveProfile.id}/request` : "/auth?mode=signin"}
                    state={!isAuthenticated ? authRedirectState : undefined}
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-4 text-sm font-semibold text-white transition hover:brightness-105"
                  >
                    Request Help
                  </Link>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {helpOffers.length > 0 ? (
                    helpOffers.map((offer) => (
                      <article key={offer.id} className="rounded-2xl border border-slate-100 bg-slate-50/85 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {offer.category ? (
                            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                              {offer.category}
                            </span>
                          ) : null}
                          {offer.urgency ? (
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${urgencyStyles[offer.urgency] ?? "bg-slate-100 text-slate-600"}`}>
                              {offer.urgency.charAt(0).toUpperCase() + offer.urgency.slice(1)}
                            </span>
                          ) : null}
                        </div>

                        <h3 className="mt-3 text-base font-semibold text-slate-900">{offer.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{offer.description}</p>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          {offer.duration_minutes ? (
                            <span className="inline-flex items-center gap-1">
                              <Clock3 size={12} />
                              {offer.duration_minutes} min
                            </span>
                          ) : null}
                          <span className="inline-flex items-center gap-1 font-semibold text-indigo-600">
                            <Coins size={12} />
                            {offer.credit_cost} credits
                          </span>
                        </div>

                        <Link
                          to={isAuthenticated ? `/offers/${offer.id}` : "/auth?mode=signin"}
                          state={!isAuthenticated ? authRedirectState : undefined}
                          className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                          Book this offer
                        </Link>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-center md:col-span-2 xl:col-span-3">
                      <Sparkles size={20} className="mx-auto text-slate-300" />
                      <p className="mt-2 text-sm text-slate-500">No open offers right now.</p>
                      <p className="mt-1 text-xs text-slate-400">You can still send a direct request to start the conversation.</p>
                    </div>
                  )}
                </div>
              </section>
            ) : null}

            <section className="explore-fade-in-up mt-8 border-b border-slate-200/60 pb-8">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Portfolio</h2>
                  <p className="text-xs text-slate-500">{portfolio.length} items</p>
                </div>
                {isOwner ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPortfolioItem(null);
                      setIsPortfolioEditMode(false);
                      setIsAddPortfolioModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                  >
                    <Plus size={14} />
                    Add Item
                  </button>
                ) : null}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {portfolioLoading ? (
                  <div className="rounded-2xl border border-slate-200 bg-white/60 p-8 text-center md:col-span-2">
                    <p className="text-sm text-slate-500">Loading portfolio...</p>
                  </div>
                ) : portfolioError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center md:col-span-2">
                    <p className="text-sm text-rose-600">{portfolioError}</p>
                    <p className="mt-1 text-xs text-rose-500">
                      If this is a visitor profile, your Supabase `portfolio_items` select policy may be blocking public reads.
                    </p>
                  </div>
                ) : portfolio.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center md:col-span-2">
                    <p className="text-sm text-slate-500">No portfolio items yet.</p>
                  </div>
                ) : (
                  portfolio.map((item) => (
                    <PortfolioItem
                      key={item.id}
                      item={item}
                      onEdit={isOwner ? handleEditPortfolio : undefined}
                      onDelete={isOwner ? handleDeletePortfolioRequest : undefined}
                    />
                  ))
                )}
              </div>
            </section>
          </>
        ) : null}
      </main>

      {isOwner ? (
        <>
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            user={{
              name: user.name,
              title: user.title,
              location: user.location,
              bio: user.bio,
              website: user.website,
              profileImageUrl: user.profileImageUrl,
              coverImage: user.coverImage,
            }}
            userId={authUser?.id || ""}
            onSave={handleEditProfile}
          />

          <AddSkillModal
            isOpen={isAddSkillModalOpen}
            onClose={() => {
              setIsAddSkillModalOpen(false);
              setIsEditMode(false);
              setSelectedSkill(null);
            }}
            onAdd={handleAddSkill}
            onUpdate={handleUpdateSkill}
            editSkill={selectedSkill}
            isEditMode={isEditMode}
          />

          <AddPortfolioModal
            isOpen={isAddPortfolioModalOpen}
            onClose={() => {
              setIsAddPortfolioModalOpen(false);
              setIsPortfolioEditMode(false);
              setSelectedPortfolioItem(null);
            }}
            onAdd={handleAddPortfolio}
            onUpdate={handleUpdatePortfolio}
            editItem={selectedPortfolioItem}
            isEditMode={isPortfolioEditMode}
          />

          <ConfirmDeleteModal
            isOpen={Boolean(pendingSkill)}
            title="Delete this skill?"
            message="This skill will be removed from your profile."
            itemName={pendingSkill?.name}
            details={pendingSkill ? `${pendingSkill.level} · ${pendingSkill.category}` : undefined}
            confirmLabel="Delete Skill"
            onCancel={() => setPendingSkillDeleteId(null)}
            onConfirm={() => (pendingSkill ? handleDeleteSkill(pendingSkill.id) : Promise.resolve())}
          />

          <ConfirmDeleteModal
            isOpen={Boolean(pendingPortfolioItem)}
            title="Delete this portfolio item?"
            message="This portfolio entry will be removed from your profile."
            itemName={pendingPortfolioItem?.title}
            details={pendingPortfolioItem ? `${pendingPortfolioItem.type} · ${pendingPortfolioItem.date}` : undefined}
            confirmLabel="Delete Item"
            onCancel={() => setPendingPortfolioDeleteId(null)}
            onConfirm={handleConfirmDeletePortfolio}
          />
        </>
      ) : null}
    </div>
  );
};

export default Profile;
