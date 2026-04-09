import { AlertTriangle, Clock3, Coins, MessageCircle, ShieldCheck, Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import RatingStars from "../components/common/RatingStars";

type SessionRequestDetailsItem = {
  id: string;
  category: string;
  urgency: "Low" | "Medium" | "High";
  postedAgo: string;
  title: string;
  duration: number;
  credits: number;
  offers: number;
  description: string;
  tags: string[];
  requester: {
    name: string;
    initials: string;
    rating: number;
    sessionsCompleted: number;
    skills: string[];
    avatarBg: string;
  };
};

const sessionRequests: SessionRequestDetailsItem[] = [
  {
    id: "1",
    category: "Writing",
    urgency: "Medium",
    postedAgo: "7d ago",
    title: "Help structure my technical blog post about Docker",
    duration: 30,
    credits: 3,
    offers: 2,
    description:
      "I drafted a technical blog post but the structure feels scattered. I need help with flow, transitions, and making the explanation clearer for beginners.",
    tags: ["Writing", "Technical Blogging", "Docker"],
    requester: {
      name: "Liam Park",
      initials: "LP",
      rating: 4.7,
      sessionsCompleted: 21,
      skills: ["Writing", "System Design"],
      avatarBg: "bg-cyan-200",
    },
  },
  {
    id: "2",
    category: "Programming",
    urgency: "High",
    postedAgo: "6d ago",
    title: "Debug React useEffect causing infinite re-renders",
    duration: 30,
    credits: 4,
    offers: 3,
    description:
      "My component keeps rendering in a loop because of dependencies I am not handling correctly. I want help fixing the issue and understanding the pattern.",
    tags: ["React", "JavaScript", "Hooks"],
    requester: {
      name: "Priya Nair",
      initials: "PN",
      rating: 4.6,
      sessionsCompleted: 26,
      skills: ["React", "TypeScript"],
      avatarBg: "bg-rose-200",
    },
  },
  {
    id: "3",
    category: "Database",
    urgency: "Low",
    postedAgo: "10d ago",
    title: "Walkthrough of SQL window functions (RANK, LAG, LEAD)",
    duration: 30,
    credits: 3,
    offers: 1,
    description:
      "I am preparing an analytics report and need practical help understanding window functions in SQL, with clear examples and when to use each one.",
    tags: ["SQL", "PostgreSQL", "Analytics"],
    requester: {
      name: "Sofia Russo",
      initials: "SR",
      rating: 4.7,
      sessionsCompleted: 19,
      skills: ["SQL", "Data Analysis"],
      avatarBg: "bg-pink-200",
    },
  },
  {
    id: "4",
    category: "Web Development",
    urgency: "Medium",
    postedAgo: "6d ago",
    title: "Understand TypeScript generics with practical examples",
    duration: 30,
    credits: 3,
    offers: 4,
    description:
      "I know basic TypeScript but struggle using generics in real code. I want examples with utility functions and reusable component props.",
    tags: ["TypeScript", "Generics", "Frontend"],
    requester: {
      name: "Alex Chen",
      initials: "AC",
      rating: 4.8,
      sessionsCompleted: 24,
      skills: ["TypeScript", "React"],
      avatarBg: "bg-orange-200",
    },
  },
  {
    id: "5",
    category: "Algorithms",
    urgency: "High",
    postedAgo: "6d ago",
    title: "Help me understand Big O notation for interview prep",
    duration: 60,
    credits: 6,
    offers: 5,
    description:
      "I have an interview coming up and I can write code but I get stuck when explaining complexity. I need clear strategy and practice patterns.",
    tags: ["Algorithms", "Interview Prep", "Data Structures"],
    requester: {
      name: "Marcus Webb",
      initials: "MW",
      rating: 4.9,
      sessionsCompleted: 34,
      skills: ["Algorithms", "Python"],
      avatarBg: "bg-sky-200",
    },
  },
  {
    id: "6",
    category: "Machine Learning",
    urgency: "Low",
    postedAgo: "10d ago",
    title: "Explain gradient descent and backpropagation intuitively",
    duration: 45,
    credits: 5,
    offers: 1,
    description:
      "I've been taking Andrew Ng's ML course and I understand the math on paper but I can't build an intuition for why gradient descent actually works. I want someone to walk me through it with analogies and maybe a small worked example. I learn best through conversation, not slides.",
    tags: ["Machine Learning", "Neural Networks", "Calculus"],
    requester: {
      name: "Priya Nair",
      initials: "PN",
      rating: 4.6,
      sessionsCompleted: 21,
      skills: ["React", "TypeScript"],
      avatarBg: "bg-rose-200",
    },
  },
  {
    id: "7",
    category: "Statistics",
    urgency: "Medium",
    postedAgo: "8d ago",
    title: "Explain hypothesis testing (t-test, p-value)",
    duration: 45,
    credits: 4,
    offers: 2,
    description:
      "I need help understanding when to use t-tests and how to interpret p-values correctly for a class project.",
    tags: ["Statistics", "Hypothesis Testing", "Data Analysis"],
    requester: {
      name: "Sofia Russo",
      initials: "SR",
      rating: 4.7,
      sessionsCompleted: 19,
      skills: ["Statistics", "SQL"],
      avatarBg: "bg-pink-200",
    },
  },
  {
    id: "8",
    category: "System Design",
    urgency: "Medium",
    postedAgo: "9d ago",
    title: "Review my system design for a URL shortener",
    duration: 45,
    credits: 5,
    offers: 2,
    description:
      "I drafted a system design for a URL shortener and want feedback on scaling decisions, database choices, and bottlenecks.",
    tags: ["System Design", "Databases", "Distributed Systems"],
    requester: {
      name: "Liam Park",
      initials: "LP",
      rating: 4.7,
      sessionsCompleted: 21,
      skills: ["System Design", "Backend"],
      avatarBg: "bg-cyan-200",
    },
  },
];

const urgencyStyles: Record<SessionRequestDetailsItem["urgency"], string> = {
  Low: "bg-indigo-50 text-indigo-700",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-rose-50 text-rose-700",
};

export default function SessionRequestDetails() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [offerMessage, setOfferMessage] = useState("");
  const [availability, setAvailability] = useState("");
  const [actionFeedback, setActionFeedback] = useState("");
  const request = useMemo(
    () => sessionRequests.find((item) => item.id === sessionId),
    [sessionId]
  );

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `${request?.title ?? "Session Request"} | Tokenly`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: "Can you help with this request on Tokenly?",
          url: shareUrl,
        });
        setActionFeedback("Request shared successfully.");
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setActionFeedback("Request link copied to clipboard.");
    } catch {
      setActionFeedback("Could not share right now. Please try again.");
    }
  };

  if (!request) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
        <Navbar />
        <main className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Request not found</h1>
          <p className="mt-2 text-slate-600">
            We could not find this session request.
          </p>
          <Link
            to="/sessions"
            className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Back to Sessions
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_52%,#f3e8ff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-[1240px] px-3 py-4 sm:px-3.5 lg:px-4">
        <div className="mb-3">
          <Link
            to="/sessions"
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200/70 bg-white/75 px-2.5 py-1 text-[11px] font-medium text-slate-700 backdrop-blur transition hover:bg-white"
          >
            Back to Sessions
          </Link>
        </div>

        <div className="grid gap-3.5 lg:grid-cols-[1.9fr_0.75fr]">
          <div className="space-y-3.5">
            <section className="rounded-3xl border border-white/55 bg-white/78 p-3.5 backdrop-blur-xl md:p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                    {request.category}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${urgencyStyles[request.urgency]}`}>
                    <span className="h-1 w-1 rounded-full bg-current opacity-80" />
                    {request.urgency} urgency
                  </span>
                </div>
                <span className="text-xs text-slate-400">{request.postedAgo}</span>
              </div>

              <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-[2rem]">
                {request.title}
              </h1>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700">
                  <Clock3 size={13} />
                  {request.duration} min session
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
                  <Coins size={13} />
                  {request.credits} credits offered
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700">
                  <MessageCircle size={13} />
                  {request.offers} offer received
                </span>
              </div>

              <div className="mt-3.5 rounded-2xl border border-white/60 bg-white/72 p-3">
                <p className="text-2xl font-semibold text-slate-800">Description</p>
                <p className="mt-1.5 text-sm leading-7 text-slate-600">{request.description}</p>
              </div>

              <div className="mt-3.5">
                <p className="text-2xl font-semibold text-slate-800">Skills Required</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {request.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 text-[11px] text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/55 bg-white/78 p-3.5 backdrop-blur-xl md:p-4">
              <p className="text-2xl font-semibold text-slate-800">Posted by</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-slate-800 ${request.requester.avatarBg}`}
                >
                  {request.requester.initials}
                </div>

                <div>
                  <h3 className="text-3xl font-semibold text-slate-900">{request.requester.name}</h3>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-600">
                    <RatingStars value={request.requester.rating} />
                    {request.requester.rating.toFixed(1)}
                    <span className="text-slate-500">
                      {request.requester.sessionsCompleted} sessions completed
                    </span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {request.requester.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-slate-200 bg-white/90 px-2 py-0.5 text-[11px] text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-3.5 lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-3xl border border-white/55 bg-white/78 p-3.5 backdrop-blur-xl">
              <h3 className="text-2xl font-semibold text-slate-900">Can you help?</h3>
              <p className="mt-1 text-xs text-slate-600">
                Submit an offer to help with this request. You'll earn{" "}
                <span className="font-semibold text-indigo-600">{request.credits} credits</span>{" "}
                on completion.
              </p>

              <label className="mt-3 block text-[11px] font-semibold text-slate-800">
                Your message to the requester
              </label>
              <textarea
                maxLength={500}
                value={offerMessage}
                onChange={(event) => setOfferMessage(event.target.value)}
                placeholder="Explain why you're a good fit and how you'll approach this..."
                className="mt-1 h-16 w-full resize-none rounded-xl border border-slate-200/80 bg-white/92 p-2.5 text-[11px] text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
              <p className="mt-1 text-right text-xs text-slate-500">{offerMessage.length}/500</p>

              <label className="mt-2 block text-[11px] font-semibold text-slate-800">
                Your availability
              </label>
              <input
                value={availability}
                onChange={(event) => setAvailability(event.target.value)}
                placeholder="e.g. Today 3-6 PM UTC, or anytime tomorrow"
                className="mt-1 h-9 w-full rounded-xl border border-slate-200/80 bg-white/92 px-3 text-[11px] text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="button"
                className="mt-3 h-9 w-full rounded-xl bg-[linear-gradient(90deg,#6366f1,#8b5cf6)] text-xs font-semibold text-white transition hover:brightness-105"
              >
                Submit Offer
              </button>
            </div>

            <div className="rounded-3xl border border-white/55 bg-white/78 p-3.5 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-slate-900">Session Details</h3>
              <div className="mt-2.5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <Clock3 size={13} className="text-indigo-400" />
                    Duration
                  </span>
                  <span className="font-semibold text-slate-800">{request.duration} minutes</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <Coins size={13} className="text-indigo-400" />
                    Credits earned
                  </span>
                  <span className="font-semibold text-indigo-600">{request.credits} credits</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <AlertTriangle size={13} className="text-indigo-400" />
                    Urgency
                  </span>
                  <span className="font-semibold text-slate-800">{request.urgency}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck size={13} className="text-indigo-400" />
                    Credits escrowed
                  </span>
                  <span className="font-semibold text-slate-800">After acceptance</span>
                </div>
              </div>
            </div>

            <section className="rounded-3xl border border-white/55 bg-white/78 p-3 backdrop-blur-xl">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleShare}
                  className="group flex h-9 items-center justify-center gap-1.5 rounded-2xl border border-slate-300/70 bg-white/70 px-3 text-[11px] font-semibold text-slate-500 transition hover:bg-white"
                >
                  <Share2 size={13} className="text-slate-500" />
                  <span className="leading-none">Share</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/report")}
                  className="group flex h-9 items-center justify-center gap-1.5 rounded-2xl border border-slate-300/70 bg-white/70 px-3 text-[11px] font-semibold text-slate-500 transition hover:bg-white"
                >
                  <AlertTriangle size={13} className="text-slate-500" />
                  <span className="leading-none">Report</span>
                </button>
              </div>
              {actionFeedback ? (
                <p className="mt-2 text-center text-[11px] text-slate-500">{actionFeedback}</p>
              ) : null}
            </section>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
