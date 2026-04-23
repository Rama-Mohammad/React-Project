import {
  Coins,
  X,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import RatingStars from "../common/RatingStars";
import Avatar from "../common/Avatar";
import type { HelperCardProps } from "../../types/explore";


interface HelperDetailsModalProps {
  item: HelperCardProps["item"];
  isOpen: boolean;
  onClose: () => void;
}

export default function HelperDetailsModal({
  item,
  isOpen,
  onClose,
}: HelperDetailsModalProps) {
  const { isAuthenticated, authRedirectState } = useAuthRedirect();

  const ctaLink = isAuthenticated
    ? `/helpers/${item.id}/request`
    : "/auth?mode=signin";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/30 bg-gradient-to-br from-slate-50 via-white to-indigo-50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <Avatar
              name={item.name}
              imageUrl={item.profileImageUrl}
              className="h-16 w-16 rounded-full"
              imageClassName="rounded-full"
              fallbackClassName={`${item.avatarBg} text-base font-bold text-slate-800`}
            />

            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900">
                {item.name}
              </h2>

              <div className="mt-2 flex items-center gap-2">
                <RatingStars value={item.rating} />
                <span className="font-bold text-slate-800">
                  {item.rating.toFixed(1)}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Responds {item.responseTime}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600">
              <Coins size={14} />
              {item.creditsPerHour} /hr
            </div>
          </div>

          <div className="mb-5 rounded-xl border border-white/50 bg-white/70 p-4">
            <p className="text-sm leading-6 text-slate-700">{item.bio}</p>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-4 rounded-xl border border-white/50 bg-white/70 p-4">
            <div className="text-center">
              <p className="text-xl font-bold">{item.sessions}</p>
              <p className="text-xs text-slate-600">Sessions</p>
            </div>

            <div className="text-center">
              <p className="text-xl font-bold">{item.successRate}%</p>
              <p className="text-xs text-slate-600">Success</p>
            </div>

            <div className="text-center">
              <p className="text-xl font-bold">4.9</p>
              <p className="text-xs text-slate-600">Rating</p>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {item.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
              >
                {skill}
              </span>
            ))}
          </div>

        <Link
          to={ctaLink}
          state={!isAuthenticated ? authRedirectState : undefined}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white text-sm font-semibold hover:bg-indigo-700"
        >
            <MessageCircle size={16} />
            Request Help
          </Link>
        </div>
      </div>
    </div>
  );
}

