import React, { useState, useEffect } from 'react';
import CreditBalanceCard from '../components/dashboard/CreditBalanceCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import MiniSessionCard from '../components/dashboard/MiniSessionCard';
import StatsCard from '../components/common/StatsCard';
import Loader from '../components/common/Loader';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useCredits } from '../features/credits/hooks/useCredits';
import { useSessions } from '../features/sessions/hooks/useSessions';
import type { Transaction, Session } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getBalance, getTransactions } = useCredits();
  const { getUserSessions } = useSessions();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock stats for now
  const stats = {
    totalHelpGiven: 12,
    totalHelpReceived: 8,
    activeRequests: 2,
    completedSessions: 20,
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [userBalance, userTransactions, userSessions] = await Promise.all([
          getBalance(),
          getTransactions(),
          getUserSessions(),
        ]);
        setBalance(userBalance);
        setTransactions(userTransactions);
        setSessions(userSessions);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleViewHistory = () => {
    console.log('View transaction history');
  };

  const handleJoinSession = (sessionId: string) => {
    console.log('Join session:', sessionId);
  };

  const handleViewAllActivity = () => {
    console.log('View all activity');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name || 'User'}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <CreditBalanceCard balance={balance} onViewHistory={handleViewHistory} />
        <StatsCard label="Help Given" value={stats.totalHelpGiven} icon="🤝" />
        <StatsCard label="Help Received" value={stats.totalHelpReceived} icon="📚" />
        <StatsCard label="Active Requests" value={stats.activeRequests} icon="📝" />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed - Takes 2/3 of the space */}
        <div className="lg:col-span-2">
          <ActivityFeed
            transactions={transactions}
            onViewAll={handleViewAllActivity}
          />
        </div>

        {/* Upcoming Sessions - Takes 1/3 of the space */}
        <div>
          <MiniSessionCard
            sessions={sessions}
            onJoinSession={handleJoinSession}
          />
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center hover:shadow-md transition">
          <div className="text-2xl mb-1">⭐</div>
          <div className="text-sm font-medium text-gray-700">My Ratings</div>
          <div className="text-xs text-gray-500 mt-1">{user?.rating || 0} / 5</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center hover:shadow-md transition">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-sm font-medium text-gray-700">Skills Offered</div>
          <div className="text-xs text-gray-500 mt-1">{user?.skills?.length || 0} skills</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center hover:shadow-md transition">
          <div className="text-2xl mb-1">✅</div>
          <div className="text-sm font-medium text-gray-700">Completion Rate</div>
          <div className="text-xs text-gray-500 mt-1">95%</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center hover:shadow-md transition">
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-sm font-medium text-gray-700">Success Streak</div>
          <div className="text-xs text-gray-500 mt-1">2 weeks</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;