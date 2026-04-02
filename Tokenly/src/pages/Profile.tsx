import React, { useState } from "react";
import { Plus } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ProfileHeader from "../components/profile/ProfileHeader";
import SkillCard from "../components/profile/SkillCard";
import PortfolioItem from "../components/profile/PortfolioItem";
import ReviewCard from "../components/profile/ReviewCard";
import RatingsSummary from "../components/profile/RatingsSummary";
import EditProfileModal from "../components/profile/EditProfileModal";
import AddSkillModal from "../components/profile/AddSkillModal";

const mockUser = {
  name: "Jordan Lee",
  title: "UC Berkeley",
  location: "Berkeley, CA",
  memberSince: "September 2025",
  bio: "CS student at UC Berkeley, graduating 2027. I love building tools that solve real problems. Strong in React, TypeScript, and Python and always happy to debug code or explain tough concepts.",
  avatarInitials: "JL",
  rating: 4.7,
  totalRatings: 6,
  stats: {
    totalSessions: 19,
    creditsEarned: 4.7,
    skillsTaught: 17,
  },
};

const mockSkills = [
  { id: "1", name: "React", category: "Web Development", level: "Expert" as const, sessions: 8 },
  { id: "2", name: "TypeScript", category: "Web Development", level: "Advanced" as const, sessions: 6 },
  { id: "3", name: "Python", category: "Programming", level: "Advanced" as const, sessions: 5 },
  { id: "4", name: "SQL", category: "Database", level: "Intermediate" as const, sessions: 3 },
  { id: "5", name: "System Design", category: "Architecture", level: "Intermediate" as const, sessions: 2 },
];

const mockPortfolio = [
  {
    id: "1",
    type: "Project" as const,
    title: "PeerFlow - Collaborative Study Scheduler",
    date: "Jan 2026",
    description:
      "A full-stack web app that lets student groups coordinate study sessions, assign topics, and track progress. Built with React, Node.js, and PostgreSQL. 200+ active users at my university.",
    tags: ["React", "Node.js", "PostgreSQL", "Socket.io"],
  },
  {
    id: "2",
    type: "Article" as const,
    title: "TypeScript Generic Patterns Cheat Sheet",
    date: "Nov 2025",
    description:
      "A comprehensive article I wrote covering 10 practical generic patterns with real-world code examples. Published on Dev.to and featured in the TypeScript weekly newsletter.",
    tags: ["TypeScript", "Technical Writing", "Generics"],
  },
  {
    id: "3",
    type: "Contribution" as const,
    title: "Open Source Contribution - React Query Docs",
    date: "Sep 2025",
    description:
      "Rewrote the optimistic updates guide in TanStack Query documentation, added practical examples, and clarified confusing sections. PR merged and now live in docs.",
    tags: ["React", "Open Source", "Documentation"],
  },
  {
    id: "4",
    type: "Project" as const,
    title: "Lightweight CLI Task Manager in Python",
    date: "Jul 2025",
    description:
      "A terminal task tracker with priorities, due dates, and CSV export. Built with a clean OOP structure and high test coverage. Released on PyPI.",
    tags: ["Python", "CLI", "PyPI", "Testing"],
  },
];

const mockReviews = [
  {
    id: "1",
    reviewerName: "Sofia Russo",
    date: "Mar 27, 2026",
    rating: 5,
    comment:
      "I finally understand window functions. Jordan explained concepts with examples from datasets similar to mine and everything clicked in one session.",
    skillCategory: "Database",
    sessionTopic: "Walkthrough of SQL window functions",
  },
  {
    id: "2",
    reviewerName: "Alex Chen",
    date: "Mar 25, 2026",
    rating: 5,
    comment:
      "Jordan walked me through why my TypeScript generics were failing and gave reusable patterns immediately. Super clear and patient.",
    skillCategory: "Web Development",
    sessionTopic: "Understand TypeScript generics",
  },
  {
    id: "3",
    reviewerName: "Marcus Webb",
    date: "Mar 20, 2026",
    rating: 4,
    comment:
      "Great explanations and excellent guidance through Big O notation. I needed repetition in one section but the session was very helpful.",
    skillCategory: "Algorithms",
    sessionTopic: "Big O fundamentals",
  },
  {
    id: "4",
    reviewerName: "Noa Kim",
    date: "Mar 18, 2026",
    rating: 5,
    comment:
      "Came in confused, left with a clean implementation plan and confidence. Every minute of the session felt useful.",
    skillCategory: "Architecture",
    sessionTopic: "Service boundaries and API design",
  },
  {
    id: "5",
    reviewerName: "Leo Patel",
    date: "Mar 16, 2026",
    rating: 4,
    comment:
      "Helpful and practical. Jordan explains tradeoffs clearly and keeps the pace easy to follow.",
    skillCategory: "Programming",
    sessionTopic: "Python data pipelines",
  },
  {
    id: "6",
    reviewerName: "Nina Ortega",
    date: "Mar 11, 2026",
    rating: 5,
    comment:
      "Very strong technical depth without making it overwhelming. I learned exactly what I needed for my project.",
    skillCategory: "Web Development",
    sessionTopic: "React app performance",
  },
];

const Profile: React.FC = () => {
  const [user, setUser] = useState(mockUser);
  const [skills, setSkills] = useState(mockSkills);
  const [portfolio] = useState(mockPortfolio);
  const [reviews] = useState(mockReviews);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const handleEditProfile = (updatedUser: typeof mockUser) => {
    setUser(updatedUser);
  };

  const handleUpdateSkill = (updatedSkill: any) => {
    setSkills(skills.map((skill) => (skill.id === updatedSkill.id ? updatedSkill : skill)));
  };

  const handleAddSkill = (newSkill: Omit<(typeof mockSkills)[0], "id">) => {
    const skill = {
      ...newSkill,
      id: Date.now().toString(),
      sessions: 0,
    };
    setSkills([...skills, skill]);
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  const handleViewPortfolio = (id: string) => {
    console.log("View portfolio item:", id);
  };

  const handleEditSkill = (skill: any) => {
    setSelectedSkill(skill);
    setIsEditMode(true);
    setIsAddSkillModalOpen(true);
  };

  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(160deg,#e8efff_0%,#e9f7ff_45%,#f5f8ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="explore-pulse absolute -left-24 top-20 h-64 w-64 rounded-full bg-indigo-200/24 blur-3xl" />
        <div className="explore-float absolute right-[-6rem] top-44 h-72 w-72 rounded-full bg-sky-200/22 blur-3xl" />
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-76px)] w-full max-w-[1280px] px-4 py-4 sm:px-6 lg:px-8 lg:py-6 xl:px-10">
        <ProfileHeader user={user} onEdit={() => setIsEditModalOpen(true)} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1.3fr]">
          <section className="explore-fade-in-up rounded-2xl border border-white/70 bg-white/80 px-5 py-4 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Offered Skills</h2>
                <p className="text-xs text-slate-500">{skills.length} skills listed</p>
              </div>

              <button
                onClick={() => setIsAddSkillModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
              >
                <Plus size={14} />
                Add Skill
              </button>
            </div>

            <div className="mt-3 grid gap-1 md:grid-cols-2">
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} onDelete={handleDeleteSkill} onEdit={handleEditSkill} />
                ))
              ) : (
                <p className="py-4 text-center text-slate-500">No skills added yet. Click "Add Skill" to get started.</p>
              )}
            </div>
          </section>

          <section className="explore-fade-in-up rounded-2xl border border-white/70 bg-white/80 px-5 py-4 backdrop-blur-sm">
            <RatingsSummary reviews={reviews} embedded />

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
                onClick={() => setShowAllReviews((value) => !value)}
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

            <button className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100">
              <Plus size={14} />
              Add Item
            </button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[repeat(2,minmax(0,0.4fr))] md:justify-start">
            {portfolio.map((item) => (
              <PortfolioItem key={item.id} item={item} onView={handleViewPortfolio} />
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
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
    </div>
  );
};

export default Profile;

