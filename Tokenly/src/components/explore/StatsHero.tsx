import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Coins,
  Handshake,
  X,
  FileText,
  PlayCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { helpers } from "../../data/mockExploreData";
import type { ExploreStats } from "../../types/explore";

interface StatsHeroProps {
  stats: ExploreStats;
}

function StatCard({
  icon,
  value,
  label,
  iconWrapClass,
  iconClass,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  iconWrapClass: string;
  iconClass: string;
}) {
  return (
    <div className="explore-glass rounded-xl border border-white/60 bg-white/80 p-4 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${iconWrapClass}`}>
        <div className={iconClass}>{icon}</div>
      </div>
      <div className="text-2xl font-bold tracking-tight text-slate-950">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
}

function Step({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="explore-glass flex items-center justify-center gap-2 rounded-xl border border-white/50 bg-white/70 px-3 py-3 text-slate-700 transition duration-300 hover:-translate-y-0.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export default function StatsHero({ stats }: StatsHeroProps) {
  const defaultHelperId = helpers[0]?.id ?? "h1";
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  return (
    <>
      <section className="space-y-4">
      <div className="explore-glass explore-fade-in-up overflow-hidden rounded-2xl border border-white/50 bg-white/75 px-5 py-5 backdrop-blur-xl md:px-6 md:py-6">
        <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="explore-fade-in-up mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/60 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-700">
              <BadgeCheck size={14} />
              Credit-based peer assistance
            </div>

            <h1 className="explore-fade-in-up max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-950 md:text-4xl">
              Find Help,{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-purple-300 bg-clip-text text-transparent">
                Offer Skills.
              </span>
              <br />
              No money - just reciprocity.
            </h1>

            <p className="explore-fade-in-up mt-3.5 max-w-2xl text-sm leading-6 text-slate-600">
              Earn credits by helping others, then spend them to get help yourself.
              Every session is time-bounded, skill-tagged, and designed to feel fair,
              simple, and useful.
            </p>

            <div className="explore-fade-in-up mt-5 flex flex-wrap gap-2.5">
              <Link
                to={`/helpers/${defaultHelperId}/request`}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition duration-300 hover:bg-slate-50"
              >
                <FileText size={17} />
                Post a Request
              </Link>

              <button
                type="button"
                onClick={() => setIsHowItWorksOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/60 bg-white/85 px-4 py-2.5 text-sm font-semibold text-slate-700 transition duration-300 hover:bg-white"
              >
                <PlayCircle size={17} />
                How it works
              </button>
            </div>

            <div className="explore-fade-in-up mt-4 flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5">
                <Sparkles size={14} className="text-indigo-500" />
                Friendly peer learning
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5">
                <Coins size={14} className="text-amber-500" />
                Credit-based help
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard
              icon={<FileText size={19} />}
              value={stats.activeRequests}
              label="Active Requests"
              iconWrapClass="bg-indigo-100"
              iconClass="text-indigo-500"
            />
            <StatCard
              icon={<Users size={19} />}
              value={stats.helpersOnline}
              label="Helpers Online"
              iconWrapClass="bg-sky-100"
              iconClass="text-sky-500"
            />
            <StatCard
              icon={<CalendarCheck size={19} />}
              value={stats.sessionsToday}
              label="Sessions Today"
              iconWrapClass="bg-purple-100"
              iconClass="text-purple-500"
            />
            <StatCard
              icon={<Coins size={19} />}
              value={stats.creditsExchanged}
              label="Credits Exchanged"
              iconWrapClass="bg-amber-100"
              iconClass="text-amber-500"
            />
          </div>
        </div>
      </div>

      <div className="explore-fade-in-up grid gap-2.5 rounded-2xl border border-white/50 bg-white/60 p-2.5 backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
        <Step icon={<FileText size={16} />} label="1. Post a request" />
        <Step icon={<Users size={16} />} label="2. Receive offers" />
        <Step icon={<ArrowRight size={16} />} label="3. Complete session" />
        <Step icon={<Coins size={16} />} label="4. Credits transfer" />
      </div>
      </section>

      {isHowItWorksOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm"
          onClick={() => setIsHowItWorksOpen(false)}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/30 bg-[linear-gradient(140deg,#eef4ff_0%,#e8f8ff_45%,#f3efff_100%)] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/40 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">How It Works</p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  Learn, help, and earn credits
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHowItWorksOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/80 text-slate-600 transition hover:bg-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
              <div className="rounded-2xl border border-indigo-100 bg-white/75 p-4">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <FileText size={18} />
                </div>
                <p className="text-base font-semibold text-slate-900">1. Post a request</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Share your problem, choose a skill area, and set your preferred session details.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-white/75 p-4">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                  <Users size={18} />
                </div>
                <p className="text-base font-semibold text-slate-900">2. Get matched with helpers</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Review ratings, response time, and expertise before choosing who to work with.
                </p>
              </div>

              <div className="rounded-2xl border border-violet-100 bg-white/75 p-4">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <Handshake size={18} />
                </div>
                <p className="text-base font-semibold text-slate-900">3. Complete your session</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Meet live or async, solve the issue together, and confirm when the goal is met.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-white/75 p-4">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <Coins size={18} />
                </div>
                <p className="text-base font-semibold text-slate-900">4. Credits transfer safely</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Credits are held in escrow and released only after you mark the session complete.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
