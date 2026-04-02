import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Coins,
  FileText,
  PlayCircle,
  Sparkles,
  Users,
} from "lucide-react";
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
  return (
    <section className="space-y-5">
      <div className="explore-glass explore-fade-in-up overflow-hidden rounded-2xl border border-white/50 bg-white/70 px-5 py-6 backdrop-blur-xl md:px-6 md:py-6">
        <div className="grid items-center gap-8 lg:grid-cols-[1.12fr_0.88fr]">
          <div>
            <div className="explore-fade-in-up mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/60 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-700">
              <BadgeCheck size={14} />
              Credit-based peer assistance
            </div>

            <h1 className="explore-fade-in-up max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-950 md:text-5xl">
              Find Help,{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-purple-300 bg-clip-text text-transparent">
                Offer Skills.
              </span>
              <br />
              No money - just reciprocity.
            </h1>

            <p className="explore-fade-in-up mt-4 max-w-2xl text-base leading-7 text-slate-500">
              Earn credits by helping others, then spend them to get help yourself.
              Every session is time-bounded, skill-tagged, and designed to feel fair,
              simple, and useful.
            </p>

            <div className="explore-fade-in-up mt-6 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-50">
                <FileText size={17} />
                Post a Request
              </button>

              <button className="inline-flex items-center gap-2 rounded-lg border border-white/60 bg-white/85 px-5 py-3 text-sm font-semibold text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:bg-white">
                <PlayCircle size={17} />
                How it works
              </button>
            </div>

            <div className="explore-fade-in-up mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
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

          <div className="grid gap-4 sm:grid-cols-2">
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

      <div className="explore-fade-in-up grid gap-3 rounded-2xl border border-white/50 bg-white/55 p-3 backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
        <Step icon={<FileText size={16} />} label="1. Post a request" />
        <Step icon={<Users size={16} />} label="2. Receive offers" />
        <Step icon={<ArrowRight size={16} />} label="3. Complete session" />
        <Step icon={<Coins size={16} />} label="4. Credits transfer" />
      </div>
    </section>
  );
}
