import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
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
import useProfiles from "../hooks/useProfile";
import useSkills from "../hooks/useSkills";
import useReviews from "../hooks/useReviews";
import usePortfolio from "../hooks/usePortfolio";
import type {
  PortfolioEntry,
  UiReview,
  UiSkill,
} from "../types/page";
import type { EditProfileUserInput, ProfileHeaderUser, ReviewSortBy } from "../types/profile";

const toTitleCase = (value: string) =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}` : value;

const toUiSkillLevel = (value: string): UiSkill["level"] => {
  const normalized = toTitleCase(value);
  if (normalized === "Expert" || normalized === "Advanced" || normalized === "Beginner") return normalized as UiSkill["level"];
  return "Intermediate";
};

const Profile: React.FC = () => {
  const { user: authUser } = useAuth();
  const {
    profile: liveProfile,
    fetchProfileById,
    editProfile,
    loading: profileLoading,
    error: profileError,
  } = useProfiles();
  const {
    skills: liveSkills,
    fetchSkillsByUser,
    addSkill,
    editSkill: editSkillHook,
    removeSkill,
    loading: skillsLoading,
    error: skillsError,
  } = useSkills();
  const {
    reviews: liveReviews,
    fetchReviewsByUser,
    loading: reviewsLoading,
    error: reviewsError,
  } = useReviews();
  const {
    items: livePortfolio,
    fetchByUser: fetchPortfolio,
    add: addPortfolioItem,
    edit: editPortfolioItem,
    remove: removePortfolioItem,
    loading: portfolioLoading,
    error: portfolioError,
  } = usePortfolio();

  // Derived UI state from live data
  const user: ProfileHeaderUser = useMemo(() => {
    if (!liveProfile) {
      return {
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
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    const memberSince = new Date(liveProfile.created_at).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return {
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
        totalSessions: 0, // we'll compute below
        creditsEarned: liveProfile.credit_balance ?? 0,
        skillsTaught: liveReviews.length,
      },
    };
  }, [liveProfile, liveReviews]);

  const skills: UiSkill[] = useMemo(() => {
    return liveSkills.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      level: toUiSkillLevel(s.level),
      sessions: s.sessions_count,
      description: s.description || "",
    }));
  }, [liveSkills]);

  const portfolio: PortfolioEntry[] = useMemo(() => {
    return livePortfolio.map((p) => ({
      id: p.id,
      type: toTitleCase(p.type) as PortfolioEntry["type"],
      title: p.title,
      date: p.date || "",
      description: p.description || "",
      tags: p.tags || [],
    }));
  }, [livePortfolio]);

  const reviews: UiReview[] = useMemo(() => {
    return liveReviews.map((r: any) => ({
      id: r.id,
      reviewerName: r.reviewer?.full_name || r.reviewer?.username || "Community Member",
      date: new Date(r.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      rating: r.rating,
      comment: r.comment || "Great session.",
      skillCategory: "General",
      sessionTopic: "Peer session",
    }));
  }, [liveReviews]);

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

  // Fetch all data on mount
  useEffect(() => {
    if (!authUser?.id) return;
    void fetchProfileById(authUser.id);
    void fetchSkillsByUser(authUser.id);
    void fetchReviewsByUser(authUser.id);
    void fetchPortfolio(authUser.id);
  }, [authUser?.id]);

  const pageError = profileError || skillsError || reviewsError || portfolioError;

  //handlers -> supabaseee

  const handleEditProfile = async (updatedUser: EditProfileUserInput) => {
    if (!authUser?.id) return;
    await editProfile(authUser.id, {
      full_name: updatedUser.name,
      title: updatedUser.title,
      location: updatedUser.location,
      bio: updatedUser.bio,
      website: updatedUser.website,
      profile_image_url: updatedUser.profileImageUrl || undefined,
      cover_image_url: updatedUser.coverImage || undefined,
    });
  };

  const handleAddSkill = async (newSkill: Omit<UiSkill, "id">) => {
    if (!authUser?.id) return;
    await addSkill({
      user_id: authUser.id,
      name: newSkill.name,
      category: newSkill.category as any,
      level: newSkill.level.toLowerCase() as any,
      description: newSkill.description,
    });
  };

  const handleUpdateSkill = async (updatedSkill: UiSkill) => {
    await editSkillHook(updatedSkill.id, {
      name: updatedSkill.name,
      category: updatedSkill.category as any,
      level: updatedSkill.level.toLowerCase() as any,
      description: updatedSkill.description,
    });
  };

  const handleDeleteSkill = async (id: string) => {
    await removeSkill(id);
    setPendingSkillDeleteId(null);
  };

  const handleEditSkill = (skill: UiSkill) => {
    setSelectedSkill(skill);
    setIsEditMode(true);
    setIsAddSkillModalOpen(true);
  };

  const handleAddPortfolio = async (newItem: Omit<PortfolioEntry, "id">) => {
    if (!authUser?.id) return;
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
    await editPortfolioItem(updatedItem.id, {
      title: updatedItem.title,
      description: updatedItem.description,
      type: updatedItem.type.toLowerCase(),
      tags: updatedItem.tags,
      date: updatedItem.date,
    });
  };

  const handleViewPortfolio = (id: string) => {
    console.log("View portfolio item:", id);
  };

  const handleEditPortfolio = (item: PortfolioEntry) => {
    setSelectedPortfolioItem(item);
    setIsPortfolioEditMode(true);
    setIsAddPortfolioModalOpen(true);
  };

  const handleDeletePortfolioRequest = (id: string) => {
    setPendingPortfolioDeleteId(id);
  };

  const handleConfirmDeletePortfolio = async () => {
    if (!pendingPortfolioDeleteId) return;
    await removePortfolioItem(pendingPortfolioDeleteId);
    setPendingPortfolioDeleteId(null);
  };

  const pendingSkill = pendingSkillDeleteId
    ? skills.find((item) => item.id === pendingSkillDeleteId) ?? null
    : null;

  const pendingPortfolioItem = pendingPortfolioDeleteId
    ? portfolio.find((item) => item.id === pendingPortfolioDeleteId) ?? null
    : null;

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

  return (
    <div className="relative min-h-full overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="explore-pulse absolute -left-24 top-20 h-64 w-64 rounded-full bg-indigo-200/24 blur-3xl" />
        <div className="explore-float absolute -right-24 top-44 h-72 w-72 rounded-full bg-sky-200/22 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto min-h-[calc(100vh-76px)] w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6 xl:px-10">
        {(profileLoading || skillsLoading || reviewsLoading || portfolioLoading) ? (
          <p className="mb-3 text-xs text-slate-500">Syncing profile data...</p>
        ) : null}
        {pageError ? <p className="mb-3 text-xs text-rose-600">{pageError}</p> : null}

        <ProfileHeader user={user} onEdit={() => setIsEditModalOpen(true)} />

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.7fr_1.3fr]">
          <section className="explore-fade-in-up rounded-2xl border border-white/70 bg-white/80 px-5 py-4 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Offered Skills</h2>
                <p className="text-xs text-slate-500">{skills.length} skills listed</p>
              </div>
              <button
                onClick={() => { setIsEditMode(false); setSelectedSkill(null); setIsAddSkillModalOpen(true); }}
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
              >
                <Plus size={14} />
                Add Skill
              </button>
            </div>
            <div className="mt-3 grid gap-1 md:grid-cols-2">
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} onDelete={setPendingSkillDeleteId} onEdit={handleEditSkill} />
                ))
              ) : (
                <p className="py-4 text-center text-slate-500">No skills added yet. Click "Add Skill" to get started.</p>
              )}
            </div>
          </section>

          <section className="explore-fade-in-up rounded-2xl border border-white/70 bg-white/80 px-5 py-4 backdrop-blur-sm">
            <RatingsSummary reviews={reviews} embedded sortBy={reviewSortBy} onSortChange={setReviewSortBy} />
            <div className="mt-4 space-y-3.5 border-t border-slate-200/70 pt-4">
              {visibleReviews.length > 0 ? (
                visibleReviews.map((review) => <ReviewCard key={review.id} review={review} />)
              ) : (
                <p className="py-4 text-center text-slate-500">No reviews yet. Complete sessions to receive feedback.</p>
              )}
            </div>
            {reviews.length > 3 ? (
              <button
                type="button"
                onClick={() => setShowAllReviews((v) => !v)}
                className="mt-3.5 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
              >
                {showAllReviews ? "Show fewer reviews" : `Show all ${reviews.length} reviews`}
              </button>
            ) : null}
          </section>
        </div>

        <section className="explore-fade-in-up mt-8 border-b border-slate-200/60 pb-8">
          <div className="flex items-center justify-between py-2">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Portfolio</h2>
              <p className="text-xs text-slate-500">{portfolio.length} items</p>
            </div>
            <button
              type="button"
              onClick={() => { setSelectedPortfolioItem(null); setIsPortfolioEditMode(false); setIsAddPortfolioModalOpen(true); }}
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
            >
              <Plus size={14} />
              Add Item
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {portfolio.map((item) => (
              <PortfolioItem key={item.id} item={item} onView={handleViewPortfolio} onEdit={handleEditPortfolio} onDelete={handleDeletePortfolioRequest} />
            ))}
          </div>
        </section>
      </main>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        userId={authUser?.id || ""}
        onSave={handleEditProfile}
      />

      <AddSkillModal
        isOpen={isAddSkillModalOpen}
        onClose={() => { setIsAddSkillModalOpen(false); setIsEditMode(false); setSelectedSkill(null); }}
        onAdd={handleAddSkill}
        onUpdate={handleUpdateSkill}
        editSkill={selectedSkill}
        isEditMode={isEditMode}
      />

      <AddPortfolioModal
        isOpen={isAddPortfolioModalOpen}
        onClose={() => { setIsAddPortfolioModalOpen(false); setIsPortfolioEditMode(false); setSelectedPortfolioItem(null); }}
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
        onConfirm={() => pendingSkill ? handleDeleteSkill(pendingSkill.id) : Promise.resolve()}
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
    </div>
  );
};

export default Profile;

