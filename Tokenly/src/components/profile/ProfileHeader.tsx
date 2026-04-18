import React, { useState } from "react";
import {
  CalendarDays,
  Check,
  Globe,
  GraduationCap,
  MapPin,
  MessageSquareMore,
  NotebookTabs,
  PencilLine,
  QrCode,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import RatingStars from "../common/RatingStars";
import type { ProfileHeaderProps } from "../../types/profile";

function normalizeWebsiteUrl(value?: string) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEdit }) => {
  const [copied, setCopied] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const handleShareProfile = async () => {
    const profileUrl = window.location.href;
    const shareData = {
      title: `${user.name} on Tokenly`,
      text: `Check out ${user.name}'s profile`,
      url: profileUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // no-op if share is canceled or clipboard is unavailable
    }
  };

  const profileUrl = window.location.href;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(profileUrl)}`;
  const websiteUrl = normalizeWebsiteUrl(user.website);

  return (
    <section className="mb-6 border-b border-slate-200/60 pb-6">
      <div className="relative h-40 overflow-hidden rounded-2xl">
        {user.coverImage ? <img src={user.coverImage} alt="Cover" className="h-full w-full object-cover" /> : null}
      </div>

      <div className="relative mt-4 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-end gap-3">
            <div className="-mt-12 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-linear-to-br from-indigo-500 to-sky-500 text-xl font-bold text-white shadow-sm">
              {user.profileImageUrl ? (
                <img src={user.profileImageUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user.avatarInitials
              )}
            </div>
            

            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{user.name}</h1>
                {user.rating ? (
                  <div className="ml-1 flex items-center gap-1">
                    <RatingStars value={user.rating} />
                    <span className="ml-1 text-base font-semibold text-slate-700">{user.rating.toFixed(1)}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareProfile}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white/85 text-slate-600 transition hover:border-sky-200 hover:text-sky-600"
              aria-label="Share profile"
              title={copied ? "Link copied" : "Share profile"}
            >
              {copied ? <Check size={15} /> : <Share2 size={15} />}
            </button>
            <button
              type="button"
              onClick={() => setIsQrOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white/85 text-slate-600 transition hover:border-sky-200 hover:text-sky-600"
              aria-label="Show profile QR code"
              title="Show profile QR code"
            >
              <QrCode size={15} />
            </button>
            <button
              type="button"
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
          {user.website ? (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sky-700 transition hover:text-sky-800"
            >
              <Globe size={14} className="text-slate-400" />
              {user.website}
            </a>
          ) : null}
        </div>

        <p className="max-w-4xl text-sm leading-7 text-slate-700 md:text-base">{user.bio}</p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-lg bg-white/55 px-3 py-2 text-sm text-slate-600">
            <NotebookTabs size={15} className="text-indigo-500" />
            <span className="text-lg font-bold text-slate-900">{user.stats.totalSessions === 0 && !user.name ? "" : user.stats.totalSessions}</span>
            Sessions
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/55 px-3 py-2 text-sm text-slate-600">
            <Sparkles size={15} className="text-indigo-500" />
            <span className="text-lg font-bold text-slate-900">{user.stats.creditsEarned === 0 && !user.name ? "" : user.stats.creditsEarned}</span>
            Tokens
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/55 px-3 py-2 text-sm text-slate-600">
            <MessageSquareMore size={15} className="text-indigo-500" />
            <span className="text-lg font-bold text-slate-900">{user.stats.skillsTaught === 0 && !user.name ? "" : user.stats.skillsTaught}</span>
            Reviews
          </div>
        </div>
      </div>

      {isQrOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsQrOpen(false)}
            aria-label="Close QR modal"
          />

          <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsQrOpen(false)}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <h3 className="text-base font-semibold text-slate-900">Profile QR Code</h3>
            <p className="mt-1 text-xs text-slate-500">Scan to open this profile</p>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <img src={qrCodeUrl} alt={`${user.name} profile QR code`} className="h-full w-full rounded-lg bg-white" />
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleShareProfile}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Copy Link
              </button>
              <a
                href={qrCodeUrl}
                download={`${user.name.replace(/\s+/g, "-").toLowerCase()}-profile-qr.png`}
                className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100"
              >
                Download QR
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default ProfileHeader;

