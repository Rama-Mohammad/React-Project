// src/components/profile/ProfileHeader.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMapMarkerAlt, faCalendarAlt, faLink } from '@fortawesome/free-solid-svg-icons';

interface ProfileHeaderProps {
  user: {
    name: string;
    title: string;
    location: string;
    memberSince: string;
    bio: string;
    avatarInitials: string;
    rating?: number;
    totalRatings?: number;
    website?: string;
    coverImage?: string;
    stats: {
      totalSessions: number;
      creditsEarned: number;
      skillsTaught: number;
    };
  };
  onEdit: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEdit }) => {
  const renderStars = (rating: number = 0) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesomeIcon key={`full-${i}`} icon={faStar} className="text-yellow-400 text-sm" />
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="text-gray-300 text-sm" />
        ))}
      </>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600">
        {user.coverImage && (
          <img 
            src={user.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex gap-6">
            <div className="relative -mt-16">
              <div className="w-24 h-24 rounded-xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{user.avatarInitials}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                {user.rating && (
                  <div className="flex items-center gap-1">
                    {renderStars(user.rating)}
                    <span className="text-sm text-gray-600 ml-1">({user.totalRatings})</span>
                  </div>
                )}
              </div>
              
              <p className="text-lg text-gray-600 mb-2">{user.title}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                  <span>Joined {user.memberSince}</span>
                </div>
                {user.website && (
                  <div className="flex items-center gap-1.5">
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {user.website}
                    </a>
                  </div>
                )}
              </div>
              
              <p className="text-gray-700 max-w-2xl">{user.bio}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className="px-5 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:border-blue-400 hover:text-blue-600 transition-all"
            >
              Edit Profile
            </button>
          </div>
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
    </div>
  );
};

export default ProfileHeader;