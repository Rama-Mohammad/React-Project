import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Coins,
  Handshake,
  X,
  FileText,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { StatsHeroProps } from "../../types/explore";

function Sparkline({
  stroke,
  fill,
  points,
}: {
  stroke: string;
  fill: string;
  points: string;
}) {
  return (
    <svg viewBox="0 0 120 38" className="mt-4 h-8 w-full" aria-hidden="true">
      <defs>
        <linearGradient id={fill} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M0 38 L${points} L120 38 Z`} fill={`url(#${fill})`} />
      <path
        d={`M${points}`}
        fill="none"
        stroke={stroke}
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatCard({
  icon,
  value,
  label,
  iconWrapClass,
  iconClass,
  sparkStroke,
  sparkFillId,
  sparkPoints,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  iconWrapClass: string;
  iconClass: string;
  sparkStroke: string;
  sparkFillId: string;
  sparkPoints: string;
}) {
  return (
    <div className="group explore-soft-card relative overflow-hidden rounded-[24px] border border-[#dfe6f5]/90 bg-white/95 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-indigo-100 hover:bg-white xl:min-h-[128px] xl:p-4">
      <div className="absolute inset-x-0 top-0 h-12 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0)_100%)]" />
      <div className={`relative inline-flex h-10 w-10 items-center justify-center rounded-[16px] ring-1 ring-white/80 ${iconWrapClass}`}>
        <div className={`${iconClass} drop-shadow-[0_8px_22px_rgba(99,102,241,0.14)]`}>{icon}</div>
      </div>
      <div className="relative mt-3.5 text-[1.45rem] font-extrabold tracking-[-0.045em] text-slate-950 sm:text-[1.65rem] xl:text-[1.5rem]">
        {value}
      </div>
      <div className="relative mt-0.5 text-sm font-medium text-slate-500/90 xl:text-[13px]">
        {label}
      </div>
      <Sparkline stroke={sparkStroke} fill={sparkFillId} points={sparkPoints} />
    </div>
  );
}

function Step({
  icon,
  index,
  label,
  accentClass,
  badgeClass,
}: {
  icon: React.ReactNode;
  index: string;
  label: string;
  accentClass: string;
  badgeClass: string;
}) {
  return (
    <div className="relative flex h-full items-center justify-center lg:shrink-0 lg:justify-start">
      <div className="relative shrink-0">
        <div className={`flex h-10 w-10 items-center justify-center rounded-[15px] ring-1 ring-white/75 shadow-[0_12px_30px_-24px_rgba(79,70,229,0.45)] ${accentClass}`}>
          {icon}
        </div>
        <span className={`absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ring-2 ring-white/90 ${badgeClass}`}>
          {index}
        </span>
      </div>
      <p className="ml-3 text-[14px] font-medium tracking-[-0.01em] text-slate-700/90">{label}</p>
    </div>
  );
}

export default function StatsHero({ stats, openHowItWorks = false }: StatsHeroProps) {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  useEffect(() => {
    if (openHowItWorks) {
      setIsHowItWorksOpen(true);
    }
  }, [openHowItWorks]);

  return (
    <>
      <section className="space-y-4">
        <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/55 p-2 shadow-[0_26px_80px_-64px_rgba(79,70,229,0.35)] backdrop-blur-xl sm:p-2.5 lg:p-2.5 xl:flex-1">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-16 top-10 h-44 w-44 rounded-full bg-indigo-100/70 blur-3xl" />
            <div className="absolute right-8 top-8 h-40 w-40 rounded-full bg-sky-100/55 blur-3xl" />
            <div className="absolute bottom-0 left-[42%] h-32 w-32 rounded-full bg-violet-100/55 blur-3xl" />
          </div>

          <div className="relative grid items-start gap-3 xl:grid-cols-[1.26fr_0.74fr]">
            <div className="explore-soft-card relative overflow-hidden rounded-[30px] border border-white/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(245,247,255,0.96)_52%,rgba(249,246,255,0.96)_100%)] px-5 py-4 pb-6 sm:px-6 sm:py-4 sm:pb-6 lg:px-7 lg:py-5 lg:pb-7 xl:min-h-[252px]">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-12 top-8 h-44 w-44 rounded-full bg-indigo-100/70 blur-3xl" />
                <div className="absolute left-16 top-20 h-28 w-28 rounded-full bg-sky-100/60 blur-3xl" />
                <div className="absolute bottom-10 right-10 h-28 w-40 rounded-full bg-violet-100/45 blur-3xl" />
                <div className="absolute bottom-8 right-8 h-24 w-32 opacity-30 [background-image:radial-gradient(circle,#c7d2fe_1.1px,transparent_1.1px)] [background-size:12px_12px]" />
              </div>

              <div className="relative">
                <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-indigo-100/80 bg-white/90 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-[0_12px_30px_-26px_rgba(79,70,229,0.3)] sm:text-[11px]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e0e7ff_0%,#dbeafe_100%)] text-indigo-600">
                    <BadgeCheck size={14} />
                  </span>
                  Token-based peer assistance
                </div>

                <h1 className="text-[1.95rem] font-extrabold leading-[1.02] tracking-[-0.06em] text-slate-950 sm:text-[2.25rem] lg:text-[2.55rem] xl:text-[2.35rem]">
                  Find Help,
                  <br />
                  <span className="bg-[linear-gradient(90deg,#4f46e5_0%,#3b82f6_52%,#8b5cf6_100%)] bg-clip-text text-transparent">
                    Offer Skills.
                  </span>
                  <br />
                  No money, just reciprocity.
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500/95 sm:text-[15px]">
                  Earn tokens by helping others, then spend them to get help yourself. Every session is time-bounded,
                  skill-tagged, and designed to feel fair, simple, and genuinely useful.
                </p>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Link
                    to="/request/new"
                    className="explore-soft-glow inline-flex min-h-10 items-center justify-center gap-2 rounded-[16px] bg-[linear-gradient(135deg,#4f46e5_0%,#6366f1_45%,#8b5cf6_100%)] px-4.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:brightness-105"
                  >
                    <FileText size={18} />
                    Post a Request
                  </Link>

                  <Link
                    to="/create-offer"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[16px] border border-[#dfe6f5] bg-white/92 px-4.5 text-sm font-semibold text-slate-800 shadow-[0_14px_32px_-28px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-0.5 hover:border-indigo-100 hover:bg-white"
                  >
                    <Handshake size={18} className="text-slate-600" />
                    Create an Offer
                  </Link>
                </div>

                <div className="mt-3.5 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-white/82 px-3.5 py-1.5 text-xs text-slate-500 shadow-[0_10px_24px_-22px_rgba(15,23,42,0.35)] sm:text-sm">
                    <Sparkles size={14} className="text-indigo-500" />
                    Friendly peer learning
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-white/82 px-3.5 py-1.5 text-xs text-slate-500 shadow-[0_10px_24px_-22px_rgba(15,23,42,0.35)] sm:text-sm">
                    <Coins size={14} className="text-amber-500" />
                    Token-based help
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-white/82 px-3.5 py-1.5 text-xs text-slate-500 shadow-[0_10px_24px_-22px_rgba(15,23,42,0.35)] sm:text-sm">
                    <Users size={14} className="text-sky-500" />
                    Community-powered support
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2 xl:content-start">
              <StatCard
                icon={<FileText size={22} />}
                value={stats.activeRequests}
                label="Active Requests"
                iconWrapClass="bg-[linear-gradient(135deg,#eef2ff_0%,#e0e7ff_100%)]"
                iconClass="text-indigo-600"
                sparkStroke="#6366f1"
                sparkFillId="requestsSpark"
                sparkPoints="0 28 C 14 24, 22 12, 34 16 S 58 30, 70 24 S 94 10, 120 15"
              />
              <StatCard
                icon={<Users size={22} />}
                value={stats.helpersOnline}
                label="Offers Available"
                iconWrapClass="bg-[linear-gradient(135deg,#e0f2fe_0%,#dbeafe_100%)]"
                iconClass="text-sky-600"
                sparkStroke="#38bdf8"
                sparkFillId="offersSpark"
                sparkPoints="0 27 C 14 22, 24 14, 36 18 S 60 31, 74 22 S 95 11, 120 14"
              />
              <StatCard
                icon={<CalendarCheck size={22} />}
                value={stats.sessionsToday}
                label="Sessions Today"
                iconWrapClass="bg-[linear-gradient(135deg,#dcfce7_0%,#ecfccb_100%)]"
                iconClass="text-emerald-600"
                sparkStroke="#34d399"
                sparkFillId="sessionsSpark"
                sparkPoints="0 30 C 15 28, 22 18, 34 17 S 59 27, 74 20 S 95 6, 120 10"
              />
              <StatCard
                icon={<Coins size={22} />}
                value={stats.creditsExchanged}
                label="Tokens Exchanged"
                iconWrapClass="bg-[linear-gradient(135deg,#fef3c7_0%,#fde68a_100%)]"
                iconClass="text-amber-600"
                sparkStroke="#f59e0b"
                sparkFillId="tokensSpark"
                sparkPoints="0 29 C 14 26, 20 14, 34 16 S 57 24, 72 18 S 96 8, 120 12"
              />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/80 bg-white/70 px-5 py-3 shadow-[0_18px_50px_-42px_rgba(79,70,229,0.35)] backdrop-blur-xl sm:px-6 lg:px-6 lg:py-3">
          <div className="grid gap-3 lg:flex lg:items-center">
            <Step
              index="01"
              icon={<FileText size={20} className="text-indigo-600" />}
              label="Post a request"
              accentClass="bg-[linear-gradient(135deg,#ede9fe_0%,#e0e7ff_100%)]"
              badgeClass="bg-indigo-600 text-white"
            />
            <div className="hidden h-full min-w-8 flex-1 items-center justify-center lg:flex">
              <ArrowRight size={17} className="text-slate-300/80" />
            </div>
            <Step
              index="02"
              icon={<Users size={20} className="text-sky-600" />}
              label="Receive offers"
              accentClass="bg-[linear-gradient(135deg,#e0f2fe_0%,#dbeafe_100%)]"
              badgeClass="bg-sky-500 text-white"
            />
            <div className="hidden h-full min-w-8 flex-1 items-center justify-center lg:flex">
              <ArrowRight size={17} className="text-slate-300/80" />
            </div>
            <Step
              index="03"
              icon={<Handshake size={20} className="text-violet-600" />}
              label="Complete a session"
              accentClass="bg-[linear-gradient(135deg,#ede9fe_0%,#f5d0fe_100%)]"
              badgeClass="bg-violet-500 text-white"
            />
            <div className="hidden h-full min-w-8 flex-1 items-center justify-center lg:flex">
              <ArrowRight size={17} className="text-slate-300/80" />
            </div>
            <Step
              index="04"
              icon={<Coins size={20} className="text-amber-600" />}
              label="Tokens transfer"
              accentClass="bg-[linear-gradient(135deg,#fef3c7_0%,#fde68a_100%)]"
              badgeClass="bg-amber-500 text-white"
            />
          </div>
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
                  Learn, help, and earn tokens
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
                <p className="text-base font-semibold text-slate-900">4. Tokens transfer safely</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Tokens are held in escrow and released only after you mark the session complete.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
