import {
  CalendarClock,
  CheckCircle2,
  Coins,
  Lightbulb,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import { helpers } from "../data/mockExploreData";

type SessionType = "one-on-one" | "async" | "group";
type NeedBy = "flexible" | "soon" | "urgent";

const durationChoices = [30, 45, 60, 90, 120];

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
  const [creditsToOffer, setCreditsToOffer] = useState<number>(6);
  const [needBy, setNeedBy] = useState<NeedBy>("soon");
  const [preferredDateTime, setPreferredDateTime] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const availableCredits = 12;

  const allSkills = [
    "Programming",
    "Mathematics",
    "Machine Learning",
    "Data Science",
    "Web Development",
    "Algorithms",
    "System Design",
    "Writing",
    "Statistics",
    "Database",
  ];

  if (!helper) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
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
    if (!isFormComplete) {
      setSubmitMessage("Please complete all required fields before sending your request.");
      return;
    }

    setSubmitMessage(
      `Session request sent to ${helper.name}. Estimated total: ${creditsToOffer} credits.`
    );
  };

  const isFormComplete =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    selectedSkills.length > 0 &&
    Boolean(sessionType) &&
    durationMinutes > 0 &&
    creditsToOffer > 0 &&
    Boolean(needBy);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
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
                Describe what you need clearly so the right helper can find you quickly.
              </p>
            </section>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl">
              <label className="text-sm font-semibold text-slate-800">
                Request Title <span className="text-rose-500">*</span>
              </label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                placeholder="e.g. Debugging a React state management issue"
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200/80 bg-white/92 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
            </section>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl">
              <p className="text-sm font-semibold text-slate-800">
                Skill Category <span className="text-rose-500">*</span>
              </p>
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
              <label className="text-sm font-semibold text-slate-800">
                Describe Your Request <span className="text-rose-500">*</span>
              </label>
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
              <p className="text-sm font-semibold text-slate-800">
                Session Type <span className="text-rose-500">*</span>
              </p>
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
              <p className="text-sm font-semibold text-slate-800">
                Session Duration <span className="text-rose-500">*</span>
              </p>
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
                Estimated cost: <span className="font-semibold text-indigo-700">{creditsToOffer} credits</span>{" "}
                at {helper.creditsPerHour} credits/hr
              </p>
            </section>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/80 p-4 backdrop-blur-xl">
              <p className="text-lg font-semibold text-slate-800">
                Credits to Offer <span className="text-rose-500">*</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Higher credits attract more experienced helpers. You currently have <span className="font-semibold text-slate-700">{availableCredits} credits</span>.
              </p>

              <div className="mt-3 grid items-center gap-3 md:grid-cols-[1fr_auto]">
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={creditsToOffer}
                  onChange={(event) => setCreditsToOffer(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
                />

                <div className="inline-flex min-w-[88px] items-center justify-center gap-1.5 rounded-2xl border border-indigo-300 bg-indigo-50 px-3 py-2 text-2xl font-semibold text-indigo-700">
                  <Coins size={15} />
                  {creditsToOffer}
                </div>
              </div>

              <div className="mt-1.5 grid grid-cols-3 text-xs text-slate-500">
                <span>1 (minimal)</span>
                <span className="text-center">10 (recommended)</span>
                <span className="text-right">20 (premium)</span>
              </div>
            </section>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl">
              <p className="text-sm font-semibold text-slate-800">
                Urgency Level <span className="text-rose-500">*</span>
              </p>
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




            <button
              type="submit"
              disabled={!isFormComplete}
              className={`h-11 w-full rounded-xl text-sm font-semibold text-white transition ${
                isFormComplete
                  ? "bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500 hover:brightness-105"
                  : "cursor-not-allowed bg-slate-300"
              }`}
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
                  <span className="text-lg font-bold text-indigo-700">{creditsToOffer}</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Credits are held securely and released only after the session is completed.
              </p>
            </section>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/80 p-4 backdrop-blur-xl">
              <h4 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
                <Lightbulb size={16} className="text-indigo-500" />
                Tips for a Great Request
              </h4>
              <ul className="mt-3 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-indigo-500" />
                  Be specific about what you've already tried
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-indigo-500" />
                  Describe the exact outcome you need
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-indigo-500" />
                  Use relevant skill tags to attract the right helpers
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-indigo-500" />
                  Set a fair credit amount for the complexity
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-indigo-500" />
                  Choose urgency honestly - high urgency attracts faster responses
                </li>
              </ul>
            </section>

            <section className="explore-fade-in-up rounded-3xl border border-indigo-200 bg-indigo-50/70 p-4">
              <h4 className="inline-flex items-center gap-2 text-lg font-semibold text-indigo-800">
                <Coins size={16} className="text-indigo-600" />
                How Credits Work
              </h4>
              <p className="mt-2 text-sm leading-6 text-indigo-800/90">
                Credits are <span className="font-semibold">reserved</span> when a session is created and{" "}
                <span className="font-semibold">transferred</span> only after you confirm the session was
                completed. If a session fails, credits are returned to you automatically.
              </p>
            </section>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}








