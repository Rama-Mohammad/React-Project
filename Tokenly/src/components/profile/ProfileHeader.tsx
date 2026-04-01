// src/components/profile/ProfileHeader.tsx
import React from 'react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

interface ProfileHeaderProps {
  user: {
    name: string;
    title: string;
    location: string;
    memberSince: string;
    bio: string;
    avatarInitials: string;
    stats: {
      totalSessions: number;
      creditsEarned: number;
      skillsTaught: number;
    };
  };
  onEdit: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEdit }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex gap-6">
          <Avatar initials={user.avatarInitials} size="lg" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
            <p className="text-lg text-gray-600 mb-2">{user.title}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span> {user.location}</span>
              <span> Joined {user.memberSince}</span>
            </div>
            <p className="mt-3 text-gray-700 max-w-2xl">{user.bio}</p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="px-5 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:border-blue-400 hover:text-blue-600 transition-all"
        >
          Edit Profile
        </button>
      </div>
      
   
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{user.stats.totalSessions}</div>
          <div className="text-sm text-gray-500">Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{user.stats.creditsEarned}</div>
          <div className="text-sm text-gray-500">Credits Earned</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{user.stats.skillsTaught}</div>
          <div className="text-sm text-gray-500">Skills Taught</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;