import { ArrowLeft, Coins, FileText, PlayCircle, Rocket, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

const helpSections = [
  {
    title: "Getting Started",
    description:
      "Create your profile, add your skills, and set your learning goals. A complete profile helps you get better matches faster.",
    icon: <Rocket size={18} />,
  },
  {
    title: "How to Post a Request",
    description:
      "Go to Explore, describe what you need help with, add relevant tags, and choose a session duration to attract the right helpers.",
    icon: <FileText size={18} />,
  },
  {
    title: "How to Become a Helper",
    description:
      "Browse open requests, send thoughtful offers, and show your expertise clearly so learners can pick you with confidence.",
    icon: <UserCheck size={18} />,
  },
  {
    title: "Joining a Live Session",
    description:
      "Head to Sessions, open Active sessions, and click Join Live when it starts. Keep communication clear and goal-focused.",
    icon: <PlayCircle size={18} />,
  },
  {
    title: "Tokens and Rewards Overview",
    description:
      "You earn tokens when helping others and spend tokens when receiving help. Completed sessions update balances automatically.",
    icon: <Coins size={18} />,
  },
  {
    title: "Tracking Session Progress",
    description:
      "Use your Sessions page to track upcoming, active, and completed sessions so you always know what is next.",
    icon: <PlayCircle size={18} />,
  },
];

export default function Help() {
  return (
    <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link
          to="/account-settings"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft size={15} />
          Back to Account Settings
        </Link>

        <section className="mt-4 rounded-3xl border border-indigo-200/70 bg-indigo-50/45 p-6 shadow-[0_20px_60px_-42px_rgba(79,70,229,0.35)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">Support</p>
            <span className="rounded-full border border-indigo-200 bg-indigo-100/70 px-3 py-1 text-xs font-medium text-indigo-700">
              Updated April 2026
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Help Center</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700 sm:text-base">
            Everything you need to navigate Tokenly confidently, from posting your first request to running smooth live sessions.
          </p>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {helpSections.map((section, index) => (
            <article
              key={section.title}
              className="group relative isolate overflow-hidden rounded-2xl border border-indigo-200/70 bg-indigo-50/35 p-5 shadow-[0_12px_34px_-26px_rgba(99,102,241,0.45)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:bg-indigo-50/55 hover:shadow-[0_18px_40px_-24px_rgba(99,102,241,0.55)] before:absolute before:inset-y-0 before:-left-14 before:w-10 before:skew-x-12 before:bg-white/70 before:opacity-0 before:transition-all before:duration-500 hover:before:left-[120%] hover:before:opacity-100"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Section {index + 1}</p>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                {section.icon}
              </div>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">{section.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{section.description}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}


