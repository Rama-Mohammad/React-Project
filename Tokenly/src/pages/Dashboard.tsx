import React from 'react';

const Dashboard: React.FC = () => {
  // Mock data for dashboard
  const stats = {
    creditBalance: 245,
    totalHelpGiven: 12,
    totalHelpReceived: 8,
    activeRequests: 2,
    completedSessions: 20,
  };

  const recentActivity = [
    { id: 1, type: 'earned', title: 'Helped with React debugging', credits: 30, date: '2 hours ago' },
    { id: 2, type: 'spent', title: 'Python pipeline help', credits: 45, date: 'Yesterday' },
    { id: 3, type: 'earned', title: 'Code review for API', credits: 25, date: '2 days ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, User!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Credit Balance Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90">Available Credits</p>
          <p className="text-3xl font-bold">{stats.creditBalance}</p>
        </div>
        
        {/* Help Given Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Help Given</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalHelpGiven}</p>
        </div>
        
        {/* Help Received Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Help Received</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalHelpReceived}</p>
        </div>
        
        {/* Active Requests Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Active Requests</p>
          <p className="text-2xl font-bold text-gray-900">{stats.activeRequests}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.date}</p>
              </div>
              <div className={`font-semibold ${
                activity.type === 'earned' ? 'text-green-600' : 'text-red-600'
              }`}>
                {activity.type === 'earned' ? '+' : '-'}{activity.credits} credits
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition">
          <div className="text-2xl mb-1">📝</div>
          <div className="text-sm font-medium">Post Request</div>
        </button>
        <button className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition">
          <div className="text-2xl mb-1">🔍</div>
          <div className="text-sm font-medium">Find Help</div>
        </button>
        <button className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition">
          <div className="text-2xl mb-1">⭐</div>
          <div className="text-sm font-medium">My Ratings</div>
        </button>
        <button className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition">
          <div className="text-2xl mb-1">⚙️</div>
          <div className="text-sm font-medium">Settings</div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;