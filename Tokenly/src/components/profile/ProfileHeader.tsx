import React from "react";
import {
  CalendarDays,
  GitBranch,
  Globe,
  GraduationCap,
  MapPin,
  MessageSquareMore,
  NotebookTabs,
  PencilLine,
  Sparkles,
  Star,
} from "lucide-react";

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
    const emptyStars = Math.max(0, 5 - fullStars);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={14} className="fill-amber-400 text-amber-400" />
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={14} className="text-slate-300" />
        ))}
      </>
    );
  };

  return (
    <section className="mb-6 border-b border-slate-200/60 pb-6">
      <div className="relative h-40 overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_58%_0%,rgba(255,255,255,0.9)_0%,rgba(209,223,255,0.65)_34%,rgba(191,224,255,0.5)_58%,rgba(170,206,255,0.35)_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(99,102,241,0.22)_0%,rgba(14,165,233,0.14)_55%,rgba(255,255,255,0)_100%)]" />
        {user.coverImage ? <img src={user.coverImage} alt="Cover" className="h-full w-full object-cover" /> : null}
      </div>

      <div className="relative mt-4 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-end gap-3">
            <div className="-mt-12 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-indigo-500 to-sky-500 text-xl font-bold text-white shadow-sm">
              {user.avatarInitials}
            </div>

            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{user.name}</h1>
                {user.rating ? (
                  <div className="ml-1 flex items-center gap-1">
                    {renderStars(user.rating)}
                    <span className="ml-1 text-base font-semibold text-slate-700">{user.rating.toFixed(1)}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white/85 text-slate-600 transition hover:border-sky-200 hover:text-sky-600"
              aria-label="GitHub profile"
            >
              <GitBranch size={15} />
            </button>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white/85 text-slate-600 transition hover:border-sky-200 hover:text-sky-600"
              aria-label="Personal website"
            >
              <Globe size={15} />
            </button>
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/90 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
            >
              <PencilLine size={14} />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} className="text-slate-400" />
            {user.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap size={14} className="text-slate-400" />
            {user.title}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={14} className="text-slate-400" />
            Joined {user.memberSince}
          </span>
        </div>

        <p className="max-w-4xl text-sm leading-7 text-slate-700 md:text-base">{user.bio}</p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-lg bg-white/55 px-3 py-2 text-sm text-slate-600">
            <NotebookTabs size={15} className="text-indigo-500" />
            <span className="text-lg font-bold text-slate-900">{user.stats.totalSessions}</span>
            Sessions
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/55 px-3 py-2 text-sm text-slate-600">
            <Sparkles size={15} className="text-indigo-500" />
            <span className="text-lg font-bold text-slate-900">{user.stats.creditsEarned}</span>
            Credits
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/55 px-3 py-2 text-sm text-slate-600">
            <MessageSquareMore size={15} className="text-indigo-500" />
            <span className="text-lg font-bold text-slate-900">{user.stats.skillsTaught}</span>
            Reviews
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
