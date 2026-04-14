import { BadgeCheck, Handshake, MessageCircle, ShieldAlert, Sparkles } from "lucide-react";

const guidelineItems = [
  {
    title: "Respectful Communication",
    detail:
      "Keep conversations constructive, patient, and inclusive. Respect different learning speeds and backgrounds.",
    icon: <MessageCircle size={18} />,
  },
  {
    title: "Honest Skill Representation",
    detail:
      "List your real experience level and strengths. Clear expectations lead to better session outcomes for everyone.",
    icon: <BadgeCheck size={18} />,
  },
  {
    title: "No Spam or Harassment",
    detail:
      "Repeated unsolicited messages, abusive language, and personal attacks are not tolerated on Tokenly.",
    icon: <ShieldAlert size={18} />,
  },
  {
    title: "Session Conduct",
    detail:
      "Show up on time, stay focused on the request goals, and communicate updates if anything changes.",
    icon: <Handshake size={18} />,
  },
  {
    title: "Fair Use of the Platform",
    detail:
      "Use tokens responsibly, avoid manipulation, and complete sessions honestly before confirming outcomes.",
    icon: <Sparkles size={18} />,
  },
  {
    title: "Keep Communication On Platform",
    detail:
      "Use Tokenly messaging and session flow when possible so agreements, updates, and reports remain transparent.",
    icon: <MessageCircle size={18} />,
  },
];

export default function Guidelines() {
  return (
    <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-violet-200/70 bg-violet-50/45 p-6 shadow-[0_20px_60px_-42px_rgba(139,92,246,0.35)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-600">Community</p>
            <span className="rounded-full border border-violet-200 bg-violet-100/70 px-3 py-1 text-xs font-medium text-violet-700">
              Updated April 2026
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Community Guidelines</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700 sm:text-base">
            These shared standards help Tokenly stay safe, fair, and productive for both learners and helpers.
          </p>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guidelineItems.map((item, index) => (
            <article
              key={item.title}
              className="group relative isolate overflow-hidden rounded-2xl border border-violet-200/70 bg-violet-50/35 p-5 shadow-[0_12px_34px_-26px_rgba(139,92,246,0.35)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:bg-violet-50/55 hover:shadow-[0_18px_40px_-24px_rgba(139,92,246,0.5)] before:absolute before:inset-y-0 before:-left-14 before:w-10 before:skew-x-12 before:bg-white/70 before:opacity-0 before:transition-all before:duration-500 hover:before:left-[120%] hover:before:opacity-100"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">Section {index + 1}</p>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                {item.icon}
              </div>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item.detail}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

