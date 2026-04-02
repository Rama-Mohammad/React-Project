// src/pages/Profile.tsx
import React, { useState } from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import SkillCard from '../components/profile/SkillCard';
import PortfolioItem from '../components/profile/PortfolioItem';
import ReviewCard from '../components/profile/ReviewCard';
import RatingsSummary from '../components/profile/RatingsSummary';
import EditProfileModal from '../components/profile/EditProfileModal';
import AddSkillModal from '../components/profile/AddSkillModal';

// Mock data - In a real app, this would come from an API or state management
const mockUser = {
  name: "Jordan Lee",
  title: "Senior Full Stack Developer | Technical Writer",
  location: "San Francisco, CA",
  memberSince: "January 2024",
  bio: "Passionate about helping others learn to code. I specialize in React, TypeScript, and backend architecture. I believe in practical, example-driven teaching that builds real understanding.",
  avatarInitials: "JL",
  stats: {
    totalSessions: 24,
    creditsEarned: 187,
    skillsTaught: 5
  }
};

const mockSkills = [
  { id: "1", name: "React", category: "Web Development", level: "Expert" as const, sessions: 8 },
  { id: "2", name: "TypeScript", category: "Web Development", level: "Advanced" as const, sessions: 6 },
  { id: "3", name: "Python", category: "Programming", level: "Advanced" as const, sessions: 5 },
  { id: "4", name: "SQL", category: "Database", level: "Intermediate" as const, sessions: 3 },
  { id: "5", name: "System Design", category: "Architecture", level: "Intermediate" as const, sessions: 2 }
];

const mockPortfolio = [
  {
    id: "1",
    type: "Project" as const,
    title: "PeerFlow — Collaborative Study Scheduler",
    date: "Jan 2026",
    description: "A full-stack web app that lets student groups coordinate study sessions, assign topics, and track progress. Built with React, Node.js, and PostgreSQL. 200+ active users at my university.",
    tags: ["React", "Node.js", "PostgreSQL", "Socket.io"]
  },
  {
    id: "2",
    type: "Article" as const,
    title: "TypeScript Generic Patterns Cheat Sheet",
    date: "Nov 2025",
    description: "A comprehensive article I wrote covering 10 practical generic patterns with real-world code examples. Published on Dev.to, reached 4,200 views and was featured in the TypeScript weekly newsletter.",
    tags: ["TypeScript", "Technical Writing", "Generics"]
  },
  {
    id: "3",
    type: "Contribution" as const,
    title: "Open Source Contribution — React Query Docs",
    date: "Sep 2025",
    description: "Rewrote the optimistic updates guide in TanStack Query's official documentation, adding code sandboxes and clarifying 3 confusing sections. PR merged and live on the docs site.",
    tags: ["React", "Open Source", "Documentation"]
  },
  {
    id: "4",
    type: "Project" as const,
    title: "Lightweight CLI Task Manager in Python",
    date: "Jul 2025",
    description: "A terminal-based task tracker with priorities, due dates, and CSV export. Written with clean OOP structure and 95% test coverage. Available on PyPI with 800+ installs.",
    tags: ["Python", "CLI", "PyPI", "Testing"]
  }
];

const mockReviews = [
  {
    id: "1",
    reviewerName: "Sofia Russo",
    date: "Mar 28, 2026",
    rating: 5,
    comment: "I finally understand window functions! Jordan didn't just explain the syntax — they gave me real examples from datasets similar to mine. We went over RANK, DENSE_RANK and LAG in one session and it all clicked. Excellent session.",
    skillCategory: "Database",
    sessionTopic: "Walkthrough of SQL window functions (RANK, LAG, LEAD)"
  },
  {
    id: "2",
    reviewerName: "Alex Chen",
    date: "Mar 25, 2026",
    rating: 5,
    comment: "Jordan was amazing — walked me through exactly why my TypeScript generics weren't working and showed me three patterns I can reuse immediately. Super clear, patient, and actually knew what they were talking about. Will definitely request help again.",
    skillCategory: "Web Development",
    sessionTopic: "Understand TypeScript generics with practical examples"
  }
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
    setSkills(skills.map(skill =>
      skill.id === updatedSkill.id ? updatedSkill : skill
    ));
  };

  const handleAddSkill = (newSkill: Omit<typeof mockSkills[0], 'id'>) => {
    const skill = {
      ...newSkill,
      id: Date.now().toString(),
      sessions: 0
    };
    setSkills([...skills, skill]);
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const handleViewPortfolio = (id: string) => {
    console.log('View portfolio item:', id);
  };

  const handleEditSkill = (skill: any) => {
    setSelectedSkill(skill);
    setIsEditMode(true);
    setIsAddSkillModalOpen(true);
  };

  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <ProfileHeader
          user={user}
          onEdit={() => setIsEditModalOpen(true)}
        />

        {/* ✅ FIXED MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT COLUMN */}
          <div className="space-y-8">

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Offered Skills</h2>
                <button
                  onClick={() => setIsAddSkillModalOpen(true)}
                  className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Add Skill
                </button>
              </div>

              <div className="space-y-3">
                {skills.length > 0 ? (
                  skills.map(skill => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      onDelete={handleDeleteSkill}
                      onEdit={handleEditSkill}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No skills added yet. Click "Add Skill" to get started!
                  </p>
                )}
              </div>
            </div>

            {/* Portfolio (moved here ✅) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Portfolio
              </h2>

              <div className="space-y-6">
                {portfolio.map(item => (
                  <PortfolioItem
                    key={item.id}
                    item={item}
                    onView={handleViewPortfolio}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">

            <RatingsSummary reviews={reviews} />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Recent Reviews
              </h2>

              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No reviews yet. Complete sessions to receive feedback!
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Modals */}
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