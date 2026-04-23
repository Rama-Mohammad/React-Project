import {
  Check,
  Coins,
  MessageCircle,
  Send,
  Sparkles,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { DashboardStats } from "../../types/dashboard";

type HeaderSectionProps = {
  className?: string;
  profileImageUrl?: string | null;
  fullName?: string | null;
  initials: string;
  dashLoading: boolean;
  displayedAvgRating?: number;
  reviewCount: number;
  creditBalance: number;
  available: number;
  spent: number;
  received: number;
  total: number;
  availablePct: number;
  stats: DashboardStats | null;
};

function OverviewStat({
  icon,
  label,
  value,
  sublabel,
  iconClass = "",
  cardClass = "",
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  iconClass?: string;
  cardClass?: string;
  className?: string;
}) {
  return (
    <div className={["rounded-[28px] border border-slate-100 bg-white px-5 py-4", cardClass, className].join(" ")}>
      <div className={["mb-3 inline-flex rounded-2xl p-2.5", iconClass].join(" ")}>
        {icon}
      </div>
      <p className="min-h-[2.75rem] text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{sublabel}</p>
    </div>
  );
}

export default function HeaderSection({
  className = "",
  profileImageUrl,
  fullName,
  initials,
  dashLoading,
  displayedAvgRating,
  reviewCount,
  creditBalance,
  available,
  spent,
  received,
  total,
  availablePct,
  stats,
}: HeaderSectionProps) {
  const name = fullName?.trim() || "Dashboard";
  const completedSessions = stats?.completedSessions ?? 0;
  const activeRequests = stats?.activeRequests ?? 0;
  const offersSubmitted = stats?.offersSubmitted ?? 0;

  return (
    <section className={["w-full overflow-hidden xl:flex xl:h-full xl:min-h-0 xl:flex-col", className].join(" ")}>
      <div className="overflow-hidden xl:flex-1 xl:min-h-0 xl:overflow-y-auto">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 border-b border-slate-100 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={name}
                  className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-[linear-gradient(135deg,#6d7cff_0%,#8aa8ff_100%)] text-lg font-semibold text-white shadow-sm">
                  {initials}
                </div>
              )}

              <div className="min-w-0">
                <p className="text-sm font-medium text-indigo-400">Dashboard</p>
                <h2 className="truncate text-3xl font-semibold tracking-tight text-slate-950">{name}</h2>
                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                  Keep track of your sessions, requests, offers, and token movement in one streamlined space.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-4 py-2.5 text-sm font-medium text-indigo-700 transition hover:border-indigo-200 hover:bg-indigo-100/80"
              >
                <Sparkles size={16} />
                Explore
              </Link>
              <Link
                to="/request/new"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#4f46e5_0%,#7c3aed_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_32px_-20px_rgba(124,58,237,0.45)] transition hover:brightness-105"
              >
                <span className="text-base leading-none">+</span>
                Post Request
              </Link>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.35fr)_repeat(4,minmax(0,0.7fr))]">
            <div className="rounded-[30px] border border-[#dfe5ff] bg-[linear-gradient(135deg,#ffffff_0%,#f4f7ff_42%,#eef4ff_100%)] px-5 py-4 shadow-[0_18px_44px_-34px_rgba(99,102,241,0.26)]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-2xl bg-[linear-gradient(135deg,#eef2ff_0%,#dbeafe_100%)] p-2.5 text-indigo-600">
                    <Coins size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Token Balance</p>
                    <p className="mt-1 text-4xl font-semibold tracking-tight text-slate-950">
                      {creditBalance}
                      <span className="ml-1 text-lg font-medium text-slate-500">tokens</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-400">
                  <span>Available vs Spent</span>
                  <span>{availablePct}% available</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-indigo-100/70">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#6366f1_0%,#60a5fa_52%,#8b5cf6_100%)]"
                    style={{ width: `${Math.max(0, Math.min(100, availablePct))}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-5 text-sm">
                <div>
                  <p className="text-slate-400">Available</p>
                  <p className="font-semibold text-slate-900">{available}</p>
                </div>
                <div>
                  <p className="text-slate-400">Spent</p>
                  <p className="font-semibold text-slate-900">{spent}</p>
                </div>
                <div>
                  <p className="text-slate-400">Earned</p>
                  <p className="font-semibold text-slate-900">{received}</p>
                </div>
                <div>
                  <p className="text-slate-400">Pool</p>
                  <p className="font-semibold text-slate-900">{total}</p>
                </div>
              </div>
            </div>

            <OverviewStat
              icon={<Check size={16} />}
              label="Sessions Completed"
              value={String(completedSessions)}
              sublabel={`${stats?.totalHelpGiven ?? 0} as helper`}
              iconClass="bg-emerald-50 text-emerald-600"
              cardClass="border-emerald-100 bg-[linear-gradient(180deg,#ffffff_0%,#f2fbf7_100%)]"
            />
            <OverviewStat
              icon={<MessageCircle size={16} />}
              label="Requests Posted"
              value={String(activeRequests)}
              sublabel="Total help requests"
              iconClass="bg-violet-50 text-violet-600"
              cardClass="border-violet-100 bg-[linear-gradient(180deg,#ffffff_0%,#f7f3ff_100%)]"
            />
            <OverviewStat
              icon={<Send size={16} />}
              label="Offers Submitted"
              value={String(offersSubmitted)}
              sublabel={`${stats?.offersAccepted ?? 0} total accepted`}
              iconClass="bg-sky-50 text-sky-600"
              cardClass="border-sky-100 bg-[linear-gradient(180deg,#ffffff_0%,#f2f8ff_100%)]"
            />
            <OverviewStat
              icon={<Star size={16} />}
              label="Avg. Rating"
              value={displayedAvgRating != null ? displayedAvgRating.toFixed(1) : "--"}
              sublabel={`From ${reviewCount} reviews`}
              iconClass="bg-amber-50 text-amber-500"
              cardClass="border-amber-100 bg-[linear-gradient(180deg,#ffffff_0%,#fff8ed_100%)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
