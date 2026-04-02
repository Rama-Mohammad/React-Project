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