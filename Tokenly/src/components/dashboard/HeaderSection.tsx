import { Check, ChevronDown, Coins, Compass, MessageCircle, Plus, Send, Star } from "lucide-react";
import { Link } from "react-router-dom";
import RatingStars from "../common/RatingStars";
import type { DashboardStats } from "../../types/dashboard";

type HeaderSectionProps = {
  profileImageUrl?: string | null;
  fullName?: string | null;
  initials: string;
  dashLoading: boolean;
  displayedAvgRating?: number;
  reviewCount: number;
  creditBalance: number;
  showCreditDetails: boolean;
  onToggleCreditDetails: () => void;
  available?: number;
  spent?: number;
  received?: number;
  total?: number;
  availablePct?: number;
  stats: DashboardStats | null;
};

export default function HeaderSection({
  profileImageUrl,
  fullName,
  initials,
  dashLoading,
  displayedAvgRating,
  reviewCount,
  creditBalance,
  showCreditDetails,
  onToggleCreditDetails,
  available,
  spent,
  received,
  total,
  availablePct,
  stats,
}: HeaderSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-transparent p-5 shadow-none sm:p-6">
      <div className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-violet-300/20 blur-3xl" />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl bg-[linear-gradient(145deg,#bae6fd_0%,#a7f3d0_100%)] p-0.5">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={fullName ?? "Profile"}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white text-sm font-semibold text-slate-700">
                {dashLoading ? "" : initials}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {dashLoading ? "" : fullName}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              {!dashLoading && (
                <>
                  <RatingStars value={displayedAvgRating ?? 0} />
                  <span className="text-sm text-slate-500">
                    {reviewCount > 0 ? `${displayedAvgRating?.toFixed(1)} rating` : "No reviews yet"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="relative flex gap-2.5 pt-1">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Compass size={17} />
            Explore
          </Link>
          <Link
            to="/request/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-900/20 transition hover:brightness-105"
          >
            <Plus size={17} />
            Post Request
          </Link>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-1 items-start gap-3 xl:grid-cols-[1.8fr_1fr_1fr_1fr_1fr]">
        <article
          className="rounded-2xl border border-indigo-300/80 bg-transparent p-4"
          data-received={received ?? 0}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-700">
                <Coins size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Token Balance</p>
                <p className="text-2xl font-semibold leading-none">
                  {dashLoading ? (
                    <span className="inline-block h-8 w-16 animate-pulse rounded-lg bg-slate-200" />
                  ) : (
                    <>
                      {creditBalance} <span className="text-lg font-normal text-slate-500">tokens</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleCreditDetails}
              className="inline-flex items-center gap-2 text-sm text-slate-500"
            >
              {showCreditDetails ? "Hide" : "Details"}
              <ChevronDown
                size={16}
                className={showCreditDetails ? "rotate-180 transition" : "transition"}
              />
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
            <span>Available vs Spent</span>
            <span>{total} total tracked</span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/80">
            <div
              className="h-full bg-[linear-gradient(90deg,#93c5fd_0%,#93c5fd_58%,#c4b5fd_58%,#c4b5fd_100%)]"
              style={{ width: `${availablePct ?? 0}%` }}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-6 text-sm">
            <span className="inline-flex items-center gap-2 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-300" />
              Available <strong className="text-slate-900">{dashLoading ? "—" : available}</strong>
            </span>
            <span className="inline-flex items-center gap-2 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-300" />
              Spent <strong className="text-slate-900">{dashLoading ? "—" : spent}</strong>
            </span>
          </div>

          {showCreditDetails ? (
            <>
              <div className="my-4 h-px bg-indigo-200/70" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <article className="rounded-2xl border border-indigo-200/70 bg-indigo-100/45 px-4 py-3">
                  <p className="text-sm font-semibold text-indigo-700">As Helper</p>
                  <p className="mt-1 text-4xl font-semibold leading-none text-indigo-700">
                    {stats?.totalHelpGiven ?? ""}
                  </p>
                  <p className="mt-1 text-sm text-indigo-700">sessions completed</p>
                </article>
                <article className="rounded-2xl border border-sky-200/70 bg-sky-100/45 px-4 py-3">
                  <p className="text-sm font-semibold text-sky-700">As Requester</p>
                  <p className="mt-1 text-4xl font-semibold leading-none text-sky-700">
                    {stats?.totalHelpReceived ?? ""}
                  </p>
                  <p className="mt-1 text-sm text-sky-700">sessions received</p>
                </article>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-2xl border border-indigo-200/70 bg-indigo-50/80 px-4 py-3">
                <p className="text-sm font-semibold text-slate-700">Average Rating as Helper</p>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <RatingStars value={displayedAvgRating ?? 0} />
                  <span className="text-lg font-semibold leading-none">
                    {displayedAvgRating?.toFixed(1)}
                  </span>
                </div>
              </div>
            </>
          ) : null}
        </article>

        <article className="rounded-2xl border border-slate-300/80 bg-transparent p-4 text-center sm:text-left">
          <div className="mx-auto w-fit rounded-2xl bg-sky-100 p-3 text-sky-700 sm:mx-0">
            <Check size={20} />
          </div>
          <p className="mt-4 text-2xl font-semibold">{dashLoading ? "" : stats?.completedSessions}</p>
          Sessions Completed
          <p className="mt-2 text-sm text-slate-500">
            {!dashLoading && stats
              ? `${stats.totalHelpGiven} as helper · ${stats.totalHelpReceived} as requester`
              : ""}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-300/80 bg-transparent p-4 text-center sm:text-left">
          <div className="mx-auto w-fit rounded-2xl bg-violet-100 p-3 text-violet-700 sm:mx-0">
            <MessageCircle size={20} />
          </div>
          <p className="mt-4 text-2xl font-semibold">{dashLoading ? "" : stats?.activeRequests}</p>
          <p className="text-sm text-slate-700">Requests Posted</p>
          <p className="mt-2 text-sm text-slate-500">{!dashLoading && stats ? "Total help requests" : ""}</p>
        </article>

        <article className="rounded-2xl border border-slate-300/80 bg-transparent p-4 text-center sm:text-left">
          <div className="mx-auto w-fit rounded-2xl bg-indigo-100 p-3 text-indigo-700 sm:mx-0">
            <Send size={20} />
          </div>
          <p className="mt-4 text-2xl font-semibold">{dashLoading ? "" : stats?.offersSubmitted}</p>
          <p className="text-sm text-slate-700">Offers Submitted</p>
          <p className="mt-2 text-sm text-slate-500">{dashLoading ? "" : stats?.offersSubmitted}</p>
        </article>

        <article className="rounded-2xl border border-slate-300/80 bg-transparent p-4 text-center sm:text-left">
          <div className="mx-auto w-fit rounded-2xl bg-amber-100 p-3 text-amber-700 sm:mx-0">
            <Star size={20} />
          </div>
          <p className="mt-4 text-2xl font-semibold">{dashLoading ? "" : displayedAvgRating?.toFixed(1)}</p>
          <p className="text-sm text-slate-700">Avg. Rating</p>
          <p className="mt-2 text-sm text-slate-500">
            {!dashLoading && stats ? `From ${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}` : ""}
          </p>
        </article>
      </div>
    </section>
  );
}
