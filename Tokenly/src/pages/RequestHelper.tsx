import {
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { helpers } from "../data/mockExploreData";

type SessionType = "one-on-one" | "async" | "group";
type NeedBy = "flexible" | "soon" | "urgent";

const durationChoices = [30, 45, 60, 90, 120];

function BadgePill({ label }: { label: string }) {
  const styles: Record<string, string> = {
    "Top Rated": "bg-amber-50 text-amber-700",
    "Fast Responder": "bg-indigo-50 text-indigo-700",
    Expert: "bg-violet-50 text-violet-700",
    "Verified Student": "bg-sky-50 text-sky-700",
  };

  const icons: Record<string, React.ReactNode> = {
    "Top Rated": <Star size={13} className="fill-current" />,
    "Fast Responder": <Zap size={13} />,
    Expert: <BadgeCheck size={13} />,
    "Verified Student": <ShieldCheck size={13} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[label] || "bg-slate-100 text-slate-700"
      }`}
    >
      {icons[label]}
      {label}
    </span>
  );
}

export default function RequestHelper() {
  const { helperId } = useParams<{ helperId: string }>();
  const helper = helpers.find((entry) => entry.id === helperId);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sessionType, setSessionType] = useState<SessionType>("one-on-one");
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [needBy, setNeedBy] = useState<NeedBy>("soon");
  const [preferredDateTime, setPreferredDateTime] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  const allSkills = helper
    ? Array.from(new Set([...helper.categories, ...helper.skills]))
    : [];

  const totalCredits = useMemo(() => {
    if (!helper) return 0;
    return Math.max(1, Math.round((helper.creditsPerHour * durationMinutes) / 60));
  }, [helper, durationMinutes]);

  if (!helper) {
    return (
      <div className="min-h-screen bg-[linear-gradient(160deg,#e8efff_0%,#e9f7ff_45%,#f5f8ff_100%)] text-slate-900">
        <Navbar />
        <main className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Helper not found</h1>
          <p className="mt-2 text-slate-600">This helper profile may no longer be available.</p>
          <Link
            to="/explore"
            className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Back to Explore
          </Link>
        </main>
      </div>
    );
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills((previous) =>
      previous.includes(skill) ? previous.filter((entry) => entry !== skill) : [...previous, skill]
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitMessage(
      `Session request sent to ${helper.name}. Estimated total: ${totalCredits} credits.`
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(160deg,#e8efff_0%,#e9f7ff_45%,#f5f8ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="explore-pulse absolute -left-24 top-20 h-64 w-64 rounded-full bg-indigo-200/24 blur-3xl" />
        <div className="explore-float absolute right-[-6rem] top-44 h-72 w-72 rounded-full bg-sky-200/22 blur-3xl" />
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-5 lg:px-6 lg:py-8">
        <div className="mb-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/50 bg-white/75 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur transition hover:bg-white"
          >
            Back
          </button>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[1.9fr_0.95fr]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Request a Session</h1>
              <p className="mt-2 text-sm text-slate-600">
                Tell {helper.name} what you need help with and confirm your preferred session details.
              </p>
            </section>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl">
              <label className="text-sm font-semibold text-slate-800">What do you need help with?</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                placeholder="e.g. Debugging a React state management issue"
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200/80 bg-white/92 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
            </section>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl">
              <p className="text-sm font-semibold text-slate-800">Which skill area?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {allSkills.map((skill) => {
                  const active = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "border border-indigo-300 bg-indigo-50 text-indigo-700"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl">
              <label className="text-sm font-semibold text-slate-800">Describe your problem</label>
              <textarea
                maxLength={500}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                placeholder="What happens now, and what outcome are you trying to get?"
                className="mt-2 h-28 w-full resize-none rounded-2xl border border-slate-200/80 bg-white/92 p-3 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
              <p className="mt-1 text-right text-xs text-slate-500">{description.length}/500</p>
            </section>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl">
              <p className="text-sm font-semibold text-slate-800">Session Type</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {[
                  {
                    value: "one-on-one" as SessionType,
                    title: "Live 1-on-1",
                    desc: "Real-time video session",
                  },
                  { value: "async" as SessionType, title: "Async Review", desc: "Recorded feedback" },
                  { value: "group" as SessionType, title: "Open to Group", desc: "Helper may invite others" },
                ].map((option) => {
                  const active = sessionType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSessionType(option.value)}
                      className={`rounded-2xl border p-3 text-left transition ${
                        active
                          ? "border-indigo-300 bg-indigo-50"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <p className="text-sm font-semibold text-slate-800">{option.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{option.desc}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl">
              <p className="text-sm font-semibold text-slate-800">Session Duration</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {durationChoices.map((minutes) => {
                  const active = durationMinutes === minutes;
                  return (
                    <button
                      key={minutes}
                      type="button"
                      onClick={() => setDurationMinutes(minutes)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "border border-indigo-300 bg-indigo-50 text-indigo-700"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {minutes} min
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Estimated cost: <span className="font-semibold text-indigo-700">{totalCredits} credits</span>{" "}
                at {helper.creditsPerHour} credits/hr
              </p>
            </section>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl">
              <p className="text-sm font-semibold text-slate-800">When do you need this?</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {[
                  { value: "flexible" as NeedBy, title: "Flexible", hint: "Within a few days" },
                  { value: "soon" as NeedBy, title: "Soon", hint: "Within 24 hours" },
                  { value: "urgent" as NeedBy, title: "Urgent", hint: "As soon as possible" },
                ].map((option) => {
                  const active = needBy === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNeedBy(option.value)}
                      className={`rounded-2xl border p-3 text-left transition ${
                        active
                          ? "border-indigo-300 bg-indigo-50"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <p className="text-sm font-semibold text-slate-800">{option.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{option.hint}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl">
              <label className="text-sm font-semibold text-slate-800">
                Preferred Date & Time <span className="text-slate-500">(optional)</span>
              </label>
              <div className="relative mt-2">
                <CalendarClock size={16} className="pointer-events-none absolute left-3 top-3 text-slate-400" />
                <input
                  type="datetime-local"
                  value={preferredDateTime}
                  onChange={(event) => setPreferredDateTime(event.target.value)}
                  className="h-11 w-full rounded-2xl border border-slate-200/80 bg-white/92 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </section>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl">
              <label className="text-sm font-semibold text-slate-800">
                Personal message to {helper.name} <span className="text-slate-500">(optional)</span>
              </label>
              <textarea
                maxLength={300}
                value={personalMessage}
                onChange={(event) => setPersonalMessage(event.target.value)}
                placeholder="Any context you'd like to share before the session?"
                className="mt-2 h-24 w-full resize-none rounded-2xl border border-slate-200/80 bg-white/92 p-3 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
              <p className="mt-1 text-right text-xs text-slate-500">{personalMessage.length}/300</p>
            </section>

            <button
              type="submit"
              className="h-11 w-full rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500 text-sm font-semibold text-white transition hover:brightness-105"
            >
              Send Session Request
            </button>

            {submitMessage ? (
              <p className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700">
                {submitMessage}
              </p>
            ) : null}
          </form>

          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <section className="explore-glass explore-fade-in-up overflow-hidden rounded-3xl border border-white/55 bg-white/80 backdrop-blur-xl">
              <div className="h-16 bg-gradient-to-r from-indigo-500 to-sky-500" />
              <div className="p-5">
                <div className="-mt-10 flex items-start justify-between gap-3">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full border-4 border-white text-base font-bold text-slate-800 ${helper.avatarBg}`}
                  >
                    {helper.initials}
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    <Star size={12} className="fill-current" />
                    {helper.rating.toFixed(1)}
                  </div>
                </div>

                <h3 className="mt-3 text-lg font-semibold text-slate-900">{helper.name}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {helper.online ? "Online now" : "Offline"} • Responds {helper.responseTime}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{helper.bio}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {helper.badges.slice(0, 3).map((badge) => (
                    <BadgePill key={badge} label={badge} />
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-center">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{helper.sessions}</p>
                    <p className="text-xs text-slate-500">Sessions</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">{helper.successRate}%</p>
                    <p className="text-xs text-slate-500">Completion</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl">
              <h4 className="text-sm font-semibold text-slate-900">Credit Estimate</h4>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Rate</span>
                  <span className="font-semibold text-slate-900">{helper.creditsPerHour} credits/hr</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Duration</span>
                  <span className="font-semibold text-slate-900">{durationMinutes} min</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-slate-700">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold text-indigo-700">{totalCredits}</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Credits are held securely and released only after the session is completed.
              </p>
            </section>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl">
              <h4 className="text-sm font-semibold text-slate-900">You're Protected</h4>
              <ul className="mt-3 space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="mt-0.5 text-indigo-500" />
                  Credits only transfer after your confirmation.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="mt-0.5 text-indigo-500" />
                  You can report issues if session goals are not met.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="mt-0.5 text-indigo-500" />
                  Helper ratings are verified by real session outcomes.
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
