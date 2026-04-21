import type { ReactNode } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  ShieldCheck,
  Star,
  Ticket,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import Avatar from "../common/Avatar";
import TagOverflowList from "../common/TagOverflowList";
import type { HelperCardProps } from "../../types/explore";

function BadgePill({ label }: { label: string }) {
  const styles: Record<string, string> = {
    "Top Rated": "border border-amber-100 bg-amber-50 text-amber-700",
    "Fast Responder": "border border-emerald-100 bg-emerald-50 text-emerald-700",
    Expert: "border border-violet-100 bg-violet-50 text-violet-700",
    "Verified Student": "border border-sky-100 bg-sky-50 text-sky-700",
  };

  const icons: Record<string, ReactNode> = {
    "Top Rated": <Star size={13} className="fill-current" />,
    "Fast Responder": <Zap size={13} />,
    Expert: <BadgeCheck size={13} />,
    "Verified Student": <ShieldCheck size={13} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[label] || "border border-slate-200 bg-slate-100 text-slate-700"
        }`}
    >
      {icons[label]}
      {label}
    </span>
  );
}

function tagClassName(isPurple = false) {
  return isPurple
    ? "inline-flex h-8 items-center whitespace-nowrap rounded-full bg-violet-50 px-3.5 text-xs font-semibold text-violet-600"
    : "inline-flex h-7 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600";
}

interface HelperCardPropsWithCallback extends HelperCardProps {
  onShowMore?: (item: HelperCardProps["item"]) => void;
}

export default function HelperCard({ item }: HelperCardPropsWithCallback) {
  const { isAuthenticated, authRedirectState } = useAuthRedirect();
  const ctaLink = isAuthenticated
    ? `/helpers/${item.id}/request`
    : "/auth?mode=signin";

  const visibleBadges = item.badges.slice(0, 3);
  const visibleCategories = item.categories.slice(0, 2);

  return (
    <article className="relative w-full max-w-full sm:max-w-none mx-auto flex h-full min-h-[320px] sm:min-h-[372px] flex-col overflow-hidden rounded-2xl border border-slate-200 
    bg-white shadow-[0_10px_24px_-22px_rgba(15,23,42,0.35)] transition duration-300 hover:z-20 hover:border-slate-300 hover:shadow-[0_16px_32px_-24px_rgba(15,23,42,0.42)]">
      <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-5 pb-2">
        <div className="flex items-start gap-3 min-w-0">
          <div className="relative shrink-0">
            <Avatar
              name={item.name}
              imageUrl={item.profileImageUrl}
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-full"
              imageClassName="rounded-full"
              fallbackClassName={`${item.avatarBg} text-sm font-bold text-slate-800`}
            />
            {item.online ? (
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-[17px] font-semibold tracking-[-0.02em] text-slate-900">
                  {item.name}
                </h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                  {item.online ? (
                    <span className="font-medium text-emerald-600">Online now</span>
                  ) : null}
                  {/* <span className="text-slate-300">/</span> */}
                  {/* <span className="text-slate-400">Responds {item.responseTime}</span> */}
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 pt-0.5 text-[15px] font-semibold text-slate-800">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                {item.rating.toFixed(1)}
              </div>
            </div>

            <p className="mt-3 sm:mt-5 min-h-[44px] sm:min-h-[52px] line-clamp-2 text-sm sm:text-[15px] leading-6 sm:leading-7 text-slate-600">
              {item.bio}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 justify-start sm:justify-start">
              {visibleBadges.map((badge) => (
                <BadgePill key={badge} label={badge} />
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-start sm:justify-start">
              {visibleCategories.map((category) => (
                <span
                  key={category}
                  className={tagClassName(true)}
                >
                  {category}
                </span>
              ))}
            </div>

            <TagOverflowList
              tags={item.skills}
              className="mt-3"
              tagClassName={tagClassName()}
              overflowTagClassName={tagClassName(true)}
              hiddenTagClassName="inline-flex whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white px-3 sm:px-5 py-3 sm:py-4">
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4">
          <div className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-500">
            <Ticket size={13} className="text-slate-400" />
            <span>
              <span className="font-semibold text-slate-800">{item.sessions}</span> sessions
            </span>
          </div>

          <div className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-500">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <span className="font-semibold text-slate-800">{item.successRate}%</span>
          </div>

          <div className="inline-flex items-center justify-center sm:justify-start sm:ml-auto h-9 items-center gap-1.5 rounded-full border
           border-emerald-100 bg-emerald-50 px-4 text-sm font-medium text-emerald-700">
            <Ticket size={14} className="text-emerald-600" />
            {item.creditsPerHour} /hr
          </div>

          <Link
            to={ctaLink}
            state={!isAuthenticated ? authRedirectState : undefined}
            className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-50 sm:ml-0"
          >
            Request
          </Link>
        </div>
      </div>
    </article>
  );
}
