import {
  AlertTriangle,
  Clock3,
  Coins,
  Flag,
  MessageCircle,
  Share2,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { helpers, requests } from "../data/mockExploreData";

const urgencyStyles: Record<string, string> = {
  High: "bg-rose-50 text-rose-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-emerald-50 text-emerald-600",
};

export default function RequestDetails() {
  const { requestId } = useParams<{ requestId: string }>();
  const request = requests.find((item) => item.id === requestId);
  const [actionFeedback, setActionFeedback] = useState<string>("");

  if (!request) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#c7d2fe_0%,#bae6fd_40%,#ddd6fe_100%)] text-slate-900">
        <Navbar />
        <main className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Request not found</h1>
          <p className="mt-2 text-slate-600">
            We couldn't find this request. It may have been removed.
          </p>
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

  const authorHelper = helpers.find((helper) => helper.name === request.author.name);
  const authorSkills = authorHelper?.skills.slice(0, 3) ?? request.tags.slice(0, 3);
  const sessionsCompleted = authorHelper?.sessions ?? 12;
  const draftMessage = "";

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `${request.title} | Tokenly`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: `Can you help with this request on Tokenly?`,
          url: shareUrl,
        });
        setActionFeedback("Shared successfully.");
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setActionFeedback("Request link copied to clipboard.");
    } catch {
      setActionFeedback("Could not share right now. Please try again.");
    }
  };

  const handleReport = () => {
    const subject = `Report request: ${request.title}`;
    const body = [
      "Hello Tokenly team,",
      "",
      "I want to report this request.",
      `Request ID: ${request.id}`,
      `Request title: ${request.title}`,
      `Request URL: ${window.location.href}`,
      "",
      "Issue details:",
    ].join("\n");

    window.location.href = `mailto:support@tokenly.app?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setActionFeedback("Opened your email app to submit a report.");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(160deg,#e8efff_0%,#e9f7ff_45%,#f5f8ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="explore-pulse absolute -left-24 top-20 h-64 w-64 rounded-full bg-indigo-200/24 blur-3xl" />
        <div className="explore-float absolute right-[-6rem] top-44 h-72 w-72 rounded-full bg-sky-200/22 blur-3xl" />
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-5 lg:px-6 lg:py-7">
        <div className="mb-3">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 rounded-lg border border-white/50 bg-white/75 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur transition hover:bg-white"
          >
            Back to Explore
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.9fr_0.8fr]">
          <div className="space-y-5">
            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/50 bg-white/80 p-5 backdrop-blur-xl md:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {request.category}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${urgencyStyles[request.urgency]}`}
                  >
                    {request.urgency} urgency
                  </span>
                </div>
                <span className="text-xs text-slate-500">{request.postedAgo}</span>
              </div>

              <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-[1.9rem]">
                {request.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-700">
                  <Clock3 size={15} />
                  {request.duration} min session
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-sm font-semibold text-indigo-700">
                  <Coins size={15} />
                  {request.credits} credits offered
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-700">
                  <MessageCircle size={15} />
                  {request.offers} offers received
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-white/60 bg-white/75 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</p>
                <p className="mt-2.5 text-base leading-7 text-slate-600">{request.description}</p>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Skills Required</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {request.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-white/90 px-3.5 py-1 text-sm text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/50 bg-white/80 p-5 backdrop-blur-xl md:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Posted by</p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold text-slate-800 ${request.author.avatarBg}`}
                >
                  {request.author.initials}
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{request.author.name}</h3>
                  <p className="mt-1 inline-flex items-center gap-2 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-0.5 text-amber-400">
                      <Star size={14} className="fill-amber-400" />
                      <Star size={14} className="fill-amber-400" />
                      <Star size={14} className="fill-amber-400" />
                      <Star size={14} className="fill-amber-400" />
                      <Star size={14} />
                    </span>
                    {request.author.rating?.toFixed(1)}
                    <span className="text-slate-500">
                      {sessionsCompleted} sessions completed
                    </span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {authorSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-sm text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <div className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/78 p-5 backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-slate-900">Can you help?</h3>
              <p className="mt-2 text-base text-slate-600">
                Submit an offer to help with this request. You'll earn{" "}
                <span className="font-semibold text-indigo-600">{request.credits} credits</span>{" "}
                on completion.
              </p>

              <label className="mt-4 block text-sm font-semibold text-slate-800">
                Your message to the requester
              </label>
              <textarea
                maxLength={500}
                defaultValue={draftMessage}
                placeholder="Explain why you're a good fit and how you'll approach this..."
                className="mt-2 h-24 w-full resize-none rounded-2xl border border-slate-200/80 bg-white/92 p-3 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
              <p className="mt-1 text-right text-xs text-slate-500">0/500</p>

              <label className="mt-3 block text-sm font-semibold text-slate-800">
                Your availability
              </label>
              <input
                placeholder="e.g. Today 3-6 PM UTC, or anytime tomorrow"
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200/80 bg-white/92 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />

              <button className="mt-4 h-11 w-full rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500 text-sm font-semibold text-white transition hover:brightness-105">
                Submit Offer
              </button>
            </div>

            <div className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/78 p-5 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-slate-900">Session Details</h3>
              <div className="mt-3.5 space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <Clock3 size={15} className="text-indigo-400" />
                    Duration
                  </span>
                  <span className="font-semibold text-slate-800">{request.duration} minutes</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <Coins size={15} className="text-indigo-400" />
                    Credits earned
                  </span>
                  <span className="font-semibold text-indigo-600">{request.credits} credits</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <AlertTriangle size={15} className="text-indigo-400" />
                    Urgency
                  </span>
                  <span className="font-semibold text-slate-800">{request.urgency}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck size={15} className="text-indigo-400" />
                    Credits escrowed
                  </span>
                  <span className="font-semibold text-slate-800">After acceptance</span>
                </div>
              </div>
            </div>

            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/78 p-4 backdrop-blur-xl">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleShare}
                  className="group flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-300/70 bg-white/70 px-4 text-sm font-semibold text-slate-500 transition hover:bg-white"
                >
                  <Share2 size={14} className="text-slate-500" />
                  <span className="leading-none">Share</span>
                </button>
                <button
                  type="button"
                  onClick={handleReport}
                  className="group flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-300/70 bg-white/70 px-4 text-sm font-semibold text-slate-500 transition hover:bg-white"
                >
                  <Flag size={14} className="text-slate-500" />
                  <span className="leading-none">Report</span>
                </button>
              </div>
              {actionFeedback ? (
                <p className="mt-3 text-center text-sm text-slate-600">{actionFeedback}</p>
              ) : null}
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
