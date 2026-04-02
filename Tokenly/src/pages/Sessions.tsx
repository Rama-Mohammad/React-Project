<<<<<<< HEAD
import { useMemo, useState } from "react";
import { Calendar, Check, Clock3, Coins, Star, Timer, User } from "lucide-react";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";

type SessionTabLabel = "All" | "Upcoming" | "Active" | "Completed";

type SessionItem = {
  id: string;
  topic: string;
  skill: string;
  status: "Upcoming" | "Active Now" | "Completed";
  role: "Helping" | "Receiving help";
  person: string;
  date: string;
  duration: string;
  credits: number;
  rating?: number;
};

const sessionTabs: SessionTabLabel[] = ["All", "Upcoming", "Active", "Completed"];

const initialSessionItems: SessionItem[] = [
  {
    id: "s1",
    topic: "Debug React useEffect causing infinite re-renders",
    skill: "Programming",
    status: "Upcoming",
    role: "Receiving help",
    person: "Priya Nair",
    date: "Mar 28, 04:00 PM",
    duration: "30 min",
    credits: -4,
  },
  {
    id: "s2",
    topic: "Walkthrough of SQL window functions (RANK, LAG, LEAD)",
    skill: "Database",
    status: "Active Now",
    role: "Helping",
    person: "Sofia Russo",
    date: "Mar 27, 02:20 PM",
    duration: "45 min",
    credits: 3,
  },
  {
    id: "s3",
    topic: "Understand TypeScript generics with practical examples",
    skill: "Web Development",
    status: "Completed",
    role: "Helping",
    person: "Alex Chen",
    date: "Completed Mar 25, 01:35 PM",
    duration: "30 min",
    credits: 3,
    rating: 5,
  },
  {
    id: "s4",
    topic: "Help me understand Big O notation for interview prep",
    skill: "Algorithms",
    status: "Completed",
    role: "Receiving help",
    person: "Marcus Webb",
    date: "Completed Mar 20, 01:05 PM",
    duration: "60 min",
    credits: -6,
    rating: 5,
  },
  {
    id: "s5",
    topic: "Explain gradient descent and backpropagation intuitively",
    skill: "Machine Learning",
    status: "Completed",
    role: "Helping",
    person: "Alex Chen",
    date: "Completed Mar 18, 05:50 PM",
    duration: "45 min",
    credits: 5,
    rating: 4,
  },
  {
    id: "s6",
    topic: "Explain hypothesis testing (t-test, p-value)",
    skill: "Statistics",
    status: "Completed",
    role: "Helping",
    person: "Sofia Russo",
    date: "Completed Mar 15, 11:48 AM",
    duration: "45 min",
    credits: 4,
    rating: 5,
  },
  {
    id: "s7",
    topic: "Review my system design for a URL shortener",
    skill: "System Design",
    status: "Completed",
    role: "Receiving help",
    person: "Liam Park",
    date: "Completed Mar 12, 05:20 PM",
    duration: "45 min",
    credits: -5,
    rating: 4,
  },
];

function skillTone(skill: string) {
  if (skill === "Programming") return "bg-violet-100 text-violet-700";
  if (skill === "Database") return "bg-sky-100 text-sky-700";
  if (skill === "Web Development") return "bg-violet-100 text-violet-700";
  if (skill === "Algorithms") return "bg-sky-100 text-sky-700";
  if (skill === "Machine Learning") return "bg-violet-100 text-violet-700";
  if (skill === "Statistics") return "bg-sky-100 text-sky-700";
  if (skill === "System Design") return "bg-sky-100 text-sky-700";
  return "bg-slate-100 text-slate-700";
}

function statusTone(status: SessionItem["status"]) {
  if (status === "Upcoming") return "bg-sky-100 text-sky-700";
  if (status === "Active Now") return "bg-violet-100 text-violet-700";
  return "bg-slate-100 text-slate-600";
}

function Stars({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={12}
          className={value <= count ? "fill-violet-400 text-violet-400" : "text-violet-200"}
        />
      ))}
    </span>
  );
}

export default function Sessions() {
  const [activeSessionTab, setActiveSessionTab] = useState<SessionTabLabel>("All");

  const sessionTabCounts = useMemo(
    () => ({
      All: initialSessionItems.length,
      Upcoming: initialSessionItems.filter((item) => item.status === "Upcoming").length,
      Active: initialSessionItems.filter((item) => item.status === "Active Now").length,
      Completed: initialSessionItems.filter((item) => item.status === "Completed").length,
    }),
    []
  );

  const visibleSessions = useMemo(() => {
    if (activeSessionTab === "All") return initialSessionItems;
    if (activeSessionTab === "Upcoming") return initialSessionItems.filter((item) => item.status === "Upcoming");
    if (activeSessionTab === "Active") return initialSessionItems.filter((item) => item.status === "Active Now");
    return initialSessionItems.filter((item) => item.status === "Completed");
  }, [activeSessionTab]);

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#edf3ff_0%,#eff8ff_45%,#f8fbff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-[1420px] px-4 py-4 sm:px-6 lg:px-8">
        <section className="mt-2 rounded-2xl border border-white/60 bg-white/75 p-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-indigo-50/60 p-2 text-slate-600">
              <Calendar size={16} />
            </div>
            <h2 className="text-base font-semibold">All Sessions</h2>
          </div>

          <div className="mt-3 inline-flex rounded-2xl bg-indigo-50/60 p-1">
            {sessionTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveSessionTab(tab)}
                className={`mx-0.5 inline-flex items-center gap-2 rounded-xl px-3 py-1 text-xs ${
                  activeSessionTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                {tab}
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-500">
                  {sessionTabCounts[tab]}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            {visibleSessions.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-2 rounded-xl border border-white/70 bg-white/90 p-3 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className={`rounded-full px-2.5 py-0.5 font-medium ${skillTone(item.skill)}`}>{item.skill}</span>
                    <span className={`rounded-full px-2.5 py-0.5 font-medium ${statusTone(item.status)}`}>{item.status}</span>
                    <span className={`rounded-full px-2.5 py-0.5 font-medium ${item.role === "Helping" ? "bg-indigo-100 text-indigo-700" : "bg-violet-100 text-violet-600"}`}>{item.role}</span>
                  </div>

                  <h3 className="mt-1.5 text-sm font-medium leading-tight text-slate-900">{item.topic}</h3>

                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5"><User size={13} />{item.role === "Helping" ? "For" : "With"} {item.person}</span>
                    <span className="inline-flex items-center gap-1.5"><Clock3 size={13} />{item.date}</span>
                    <span className="inline-flex items-center gap-1.5"><Timer size={13} />{item.duration}</span>
                    {item.rating ? <Stars count={item.rating} /> : null}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end lg:self-center">
                  <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-0.5 text-xs font-semibold text-indigo-700">
                    <Coins size={12} />
                    {item.credits > 0 ? `+${item.credits}` : item.credits}
                  </span>
                  {item.status === "Completed" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600">
                      <Check size={12} />
                      Done
                    </span>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
=======
// pages/Sessions.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SessionFilters from '../components/session/list/SessionFilters';
import SessionListItem from '../components/session/list/SessionListItem';
import type { Session } from '../types/session';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarAlt,
    faBolt,
    faCheckCircle,
    faCoins,
    faSearch,
    faSortAmountDown
} from '@fortawesome/free-solid-svg-icons';

const SessionsPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState<'upcoming' | 'active' | 'completed' | 'all'>('upcoming');
    const [sessions, setSessions] = useState<Session[]>([]);
    const [creditsBalance, setCreditsBalance] = useState(12);
    
    // New state for search and filters
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'helping' | 'receiving'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

    useEffect(() => {
        // Mock data based on the prototype
        const mockSessions: Session[] = [
            {
                id: '1',
                title: 'Help structure my technical blog post about Docker',
                category: 'Writing',
                status: 'upcoming',
                role: 'receiving',
                otherParticipant: { name: 'Liam Park' },
                datetime: new Date(2026, 2, 30, 1, 0),
                duration: 30,
                credits: -3,
            },
            {
                id: '2',
                title: 'Debug React useEffect causing infinite re-renders',
                category: 'Programming',
                status: 'upcoming',
                role: 'receiving',
                otherParticipant: { name: 'Priya Nair' },
                datetime: new Date(2026, 2, 28, 22, 0),
                duration: 30,
                credits: -4,
            },
            {
                id: '3',
                title: 'Walkthrough of SQL window functions (RANK, LAG, LEAD)',
                category: 'Database',
                status: 'active',
                role: 'helping',
                otherParticipant: { name: 'Sofia Russo' },
                datetime: new Date(2026, 2, 28, 0, 30),
                duration: 30,
                credits: 3,
            },
            {
                id: '4',
                title: 'Understand TypeScript generics with practical examples',
                category: 'Web Development',
                status: 'completed',
                role: 'helping',
                otherParticipant: { name: 'Alex Chen' },
                datetime: new Date(2026, 2, 25),
                duration: 30,
                credits: 3,
            },
            {
                id: '5',
                title: 'Help me understand Big O notation for interview prep',
                category: 'Algorithms',
                status: 'completed',
                role: 'receiving',
                otherParticipant: { name: 'Marcus Webb' },
                datetime: new Date(2026, 2, 20),
                duration: 60,
                credits: -6,
            },
            {
                id: '6',
                title: 'Explain gradient descent and backpropagation intuitively',
                category: 'Machine Learning',
                status: 'completed',
                role: 'helping',
                otherParticipant: { name: 'Alex Chen' },
                datetime: new Date(2026, 2, 18),
                duration: 45,
                credits: 5,
            },
            {
                id: '7',
                title: 'Explain hypothesis testing (t-test, p-value)',
                category: 'Statistics',
                status: 'completed',
                role: 'helping',
                otherParticipant: { name: 'Sofia Russo' },
                datetime: new Date(2026, 2, 15),
                duration: 45,
                credits: 4,
            },
            {
                id: '8',
                title: 'Review my system design for a URL shortener',
                category: 'System Design',
                status: 'completed',
                role: 'receiving',
                otherParticipant: { name: 'Liam Park' },
                datetime: new Date(2026, 2, 12),
                duration: 45,
                credits: -5,
            },
        ];

        setSessions(mockSessions);
    }, []);

    // Apply all filters
    const getFilteredSessions = () => {
        let filtered = sessions;
        
        // Filter by status
        if (activeFilter !== 'all') {
            filtered = filtered.filter(session => session.status === activeFilter);
        }
        
        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(session =>
                session.title.toLowerCase().includes(query) ||
                session.category.toLowerCase().includes(query) ||
                session.otherParticipant.name.toLowerCase().includes(query)
            );
        }
        
        // Filter by role
        if (roleFilter !== 'all') {
            filtered = filtered.filter(session => session.role === roleFilter);
        }
        
        // Sort
        filtered = [...filtered].sort((a, b) => {
            if (sortBy === 'newest') {
                return b.datetime.getTime() - a.datetime.getTime();
            } else {
                return a.datetime.getTime() - b.datetime.getTime();
            }
        });
        
        return filtered;
    };

    const filteredSessions = getFilteredSessions();

    const counts = {
        upcoming: sessions.filter(s => s.status === 'upcoming').length,
        active: sessions.filter(s => s.status === 'active').length,
        completed: sessions.filter(s => s.status === 'completed').length,
        earned: sessions.filter(s => s.credits > 0).reduce((sum, s) => sum + s.credits, 0),
    };

    const handleJoin = (sessionId: string) => {
        navigate(`/session/${sessionId}`);
    };

    const handleCancel = (sessionId: string) => {
        if (confirm('Are you sure you want to cancel this session?')) {
            setSessions(prev => prev.filter(s => s.id !== sessionId));
        }
    };

    const handleReview = (sessionId: string) => {
        console.log('Review session:', sessionId);
    };

    const handleViewRequest = (sessionId: string) => {
        navigate(`/requests/${sessionId}`);
    };

    const handleMarkComplete = (sessionId: string) => {
        if (confirm('Mark this session as complete?')) {
            setSessions(prev => prev.map(session =>
                session.id === sessionId
                    ? { ...session, status: 'completed' as const }
                    : session
            ));
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">All Sessions</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                    <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
                    <p className="text-xs text-gray-500">Total</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                    <p className="text-2xl font-bold text-yellow-600">{counts.upcoming}</p>
                    <p className="text-xs text-gray-500">Upcoming</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                    <p className="text-2xl font-bold text-green-600">{counts.active}</p>
                    <p className="text-xs text-gray-500">Active</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                    <p className="text-2xl font-bold text-gray-900">{counts.completed}</p>
                    <p className="text-xs text-gray-500">Completed</p>
                </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="flex flex-wrap gap-3 mb-6">
                {/* Search Input */}
                <div className="flex-1 min-w-[200px] relative">
                    <FontAwesomeIcon 
                        icon={faSearch} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                    />
                    <input
                        type="text"
                        placeholder="Search by title, person, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>

                {/* Role Filter Dropdown */}
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-700"
                >
                    <option value="all">All Roles</option>
                    <option value="helping">Helping</option>
                    <option value="receiving">Requesting</option>
                </select>

                {/* Sort Dropdown */}
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-700"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            {/* Session Filters Tabs */}
            <SessionFilters
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                counts={counts}
            />

            {/* Results Count */}
            <div className="mb-4">
                <p className="text-sm text-gray-500">{filteredSessions.length} sessions found</p>
            </div>

            {/* Session List */}
            <div className="space-y-3">
                {filteredSessions.map(session => (
                    <SessionListItem
                        key={session.id}
                        session={session}
                        onJoin={handleJoin}
                        onCancel={handleCancel}
                        onReview={handleReview}
                        onViewRequest={handleViewRequest}
                        onMarkComplete={handleMarkComplete}
                    />
                ))}
            </div>

            {/* Empty State */}
            {filteredSessions.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No sessions found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                </div>
            )}
        </div>
    );
};

export default SessionsPage;
>>>>>>> 0ababe72551a10ab23c2f170a0caf621a7f75066
