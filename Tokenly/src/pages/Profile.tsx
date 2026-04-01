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
  },
  {
    id: "3",
    reviewerName: "Marcus Webb",
    date: "Mar 20, 2026",
    rating: 4,
    comment: "Jordan asked great questions during the Big O session and clearly put in effort before the call. They were engaged and gave good examples. A few concepts needed more repetition but overall a worthwhile session.",
    skillCategory: "Algorithms",
    sessionTopic: "Help me understand Big O notation for interview prep"
  },
  {
    id: "4",
    reviewerName: "Sarah Johnson",
    date: "Mar 15, 2026",
    rating: 5,
    comment: "Jordan's React session was incredibly helpful. They explained hooks in a way that finally made sense. I've already applied what I learned to my project!",
    skillCategory: "Web Development",
    sessionTopic: "React Hooks deep dive"
  },
  {
    id: "5",
    reviewerName: "David Kim",
    date: "Mar 10, 2026",
    rating: 4,
    comment: "Great session on system design. Jordan provided excellent resources and real-world examples. Would definitely book again.",
    skillCategory: "Architecture",
    sessionTopic: "System Design interview prep"
  },
  {
    id: "6",
    reviewerName: "Emily Chen",
    date: "Mar 5, 2026",
    rating: 5,
    comment: "Best TypeScript tutor I've found! Jordan helped me understand complex generic types and now I feel confident using them in production.",
    skillCategory: "Web Development",
    sessionTopic: "Advanced TypeScript patterns"
  }
];

const Profile: React.FC = () => {
  const [user, setUser] = useState(mockUser);
  const [skills, setSkills] = useState(mockSkills);
  const [portfolio] = useState(mockPortfolio);
  const [reviews] = useState(mockReviews);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);

  const handleEditProfile = (updatedUser: typeof mockUser) => {
    setUser(updatedUser);
    // In a real app, you would also save to backend here
  };

  const handleAddSkill = (newSkill: Omit<typeof mockSkills[0], 'id'>) => {
    const skill = {
      ...newSkill,
      id: Date.now().toString(),
      sessions: 0
    };
    setSkills([...skills, skill]);
    // In a real app, you would also save to backend here
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
    // In a real app, you would also delete from backend here
  };

  const handleViewPortfolio = (id: string) => {
    // In a real app, this would navigate to portfolio item details
    console.log('View portfolio item:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Section */}
        <ProfileHeader 
          user={user} 
          onEdit={() => setIsEditModalOpen(true)} 
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Skills & Ratings */}
          <div className="lg:col-span-1 space-y-8">
            {/* Offered Skills Section */}
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
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No skills added yet. Click "Add Skill" to get started!
                  </p>
                )}
              </div>
            </div>

            {/* Ratings Summary */}
            <RatingsSummary reviews={reviews} />
          </div>

          {/* Right Column - Portfolio & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Portfolio Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio</h2>
              <div className="space-y-6">
                {portfolio.length > 0 ? (
                  portfolio.map(item => (
                    <PortfolioItem 
                      key={item.id} 
                      item={item} 
                      onView={handleViewPortfolio}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No portfolio items yet. Start adding your projects and contributions!
                  </p>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Reviews</h2>
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
        onClose={() => setIsAddSkillModalOpen(false)}
        onAdd={handleAddSkill}
      />
    </div>
  );
};

export default Profile;