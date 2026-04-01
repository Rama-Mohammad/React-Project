import React from 'react';
import StatsCard from '../common/StatsCard';

interface StatsHeroProps {
  stats: {
    activeRequests: number;
    helpersOnline: number;
    sessionsToday: number;
    creditsExchanged: number;
  };
}

const StatsHero: React.FC<StatsHeroProps> = ({ stats }) => {
  const statItems = [
    { label: 'Active Requests', value: stats.activeRequests, icon: '📝' },
    { label: 'Helpers Online', value: stats.helpersOnline, icon: '🟢' },
    { label: 'Sessions Today', value: stats.sessionsToday, icon: '⚡' },
    { label: 'Credits Exchanged', value: `${stats.creditsExchanged}k`, icon: '💎' },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Help, Offer Skills.
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          No money — just reciprocity. Earn credits by helping others, spend them to get help yourself.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((stat, index) => (
          <StatsCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* How it works steps */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-blue-100">
        {[
          { step: 1, text: 'Post a request' },
          { step: 2, text: 'Receive offers' },
          { step: 3, text: 'Complete session' },
          { step: 4, text: 'Credits transfer' },
        ].map((item) => (
          <div key={item.step} className="text-center">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
              {item.step}
            </div>
            <span className="text-sm font-medium text-gray-700">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsHero;