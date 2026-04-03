import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Check,
  ChevronDown,
  Clock3,
  Coins,
  Compass,
  MessageCircle,
  Plus,
  Send,
  Star,
  Timer,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import { activityItems } from "../data/activityItems";

type SessionTabLabel = "All" | "Upcoming" | "Active" | "Completed";

type SessionItem = {
  id: string;
  topic: string;
  skill: string;
  status: "Upcoming" | "Active Now" | "Completed";
  role: "Helping" | "Receiving help";
  person: string;
  date: string;
  duration: string;
  credits: number;
  action?: string;
  rating?: number;
};

type RequestItem = {
  id: string;
  title: string;
  urgency: string;
  offers: number;
  age: string;
  credits: number;
};

type OfferItem = {
  id: string;
  title: string;
  status: "Accepted" | "Pending";
  user: string;
  age: string;
  credits: number;
};

const sessionTabs: SessionTabLabel[] = ["All", "Upcoming", "Active", "Completed"];

const initialSessionItems: SessionItem[] = [
  {
    id: "s1",
    topic: "Debug React useEffect causing infinite re-renders",
    skill: "Programming",
    status: "Upcoming",
    role: "Receiving help",
    person: "Priya Nair",
    date: "Mar 28, 04:00 PM",
    duration: "30 min",
    credits: -4,
    action: "Mark Complete",
  },
  {
    id: "s2",
    topic: "Walkthrough of SQL window functions (RANK, LAG, LEAD)",
    skill: "Database",
    status: "Active Now",
    role: "Helping",
    person: "Sofia Russo",
    date: "Mar 27, 02:20 PM",
    duration: "45 min",
    credits: 3,
    action: "Mark Complete",
  },
  {
    id: "s3",
    topic: "Understand TypeScript generics with practical examples",
    skill: "Web Development",
    status: "Completed",
    role: "Helping",
    person: "Alex Chen",
    date: "Completed Mar 25, 01:35 PM",
    duration: "30 min",
    credits: 3,
    rating: 5,
  },
  {
    id: "s4",
    topic: "Help me understand Big O notation for interview prep",
    skill: "Algorithms",
    status: "Completed",
    role: "Receiving help",
    person: "Marcus Webb",
    date: "Completed Mar 20, 01:05 PM",
    duration: "60 min",
    credits: -6,
    rating: 5,
  },
  {
    id: "s5",
    topic: "Explain gradient descent and backpropagation intuitively",
    skill: "Machine Learning",
    status: "Completed",
    role: "Helping",
    person: "Alex Chen",
    date: "Completed Mar 18, 05:50 PM",
    duration: "45 min",
    credits: 5,
    rating: 4,
  },
  {
    id: "s6",
    topic: "Explain hypothesis testing (t-test, p-value)",
    skill: "Statistics",
    status: "Completed",
    role: "Helping",
    person: "Sofia Russo",
    date: "Completed Mar 15, 11:48 AM",
    duration: "45 min",
    credits: 4,
    rating: 5,
  },
  {
    id: "s7",
    topic: "Review my system design for a URL shortener",
    skill: "System Design",
    status: "Completed",
    role: "Receiving help",
    person: "Liam Park",
    date: "Completed Mar 12, 05:20 PM",
    duration: "45 min",
    credits: -5,
    rating: 4,
  },
];

const openRequests: RequestItem[] = [
  {
    id: "r1",
    title: "Debug my React useEffect causing infinite re-renders",
    urgency: "High",
    offers: 3,
    age: "6d ago",
    credits: 4,
  },
  {
    id: "r2",
    title: "Help me fix a Python data pipeline that keeps crashing",
    urgency: "High",
    offers: 0,
    age: "6d ago",
    credits: 4,
  },
];

const submittedOffers: OfferItem[] = [
  {
    id: "o1",
    title: "Help me understand Big O notation for interview prep",
    status: "Accepted",
    user: "Marcus Webb",
    age: "6d ago",
    credits: 6,
  },
  {
    id: "o2",
    title: "Walkthrough of SQL window functions (RANK, LAG, LEAD)",
    status: "Accepted",
    user: "Sofia Russo",
    age: "7d ago",
    credits: 3,
  },
  {
    id: "o3",
    title: "Explain gradient descent and backpropagation intuitively",
    status: "Pending",
    user: "Priya Nair",
    age: "6d ago",
    credits: 5,
  },
];

function toneClasses(tone: string) {
  if (tone === "teal") return "bg-violet-100 text-violet-700";
  if (tone === "blue") return "bg-sky-100 text-sky-700";
  if (tone === "amber") return "bg-amber-100 text-amber-700";
  if (tone === "gold") return "bg-yellow-100 text-yellow-700";
  if (tone === "green") return "bg-violet-100 text-violet-700";
  if (tone === "rose") return "bg-rose-100 text-rose-700";
  return "bg-slate-100 text-slate-600";
}

function skillTone(skill: string) {
  if (skill === "Programming" || skill === "Web Development") return "bg-sky-100 text-sky-700";
  if (skill === "Database" || skill === "Statistics") return "bg-indigo-100 text-indigo-700";
  if (skill === "Algorithms" || skill === "System Design") return "bg-violet-100 text-violet-700";
  if (skill === "Machine Learning") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function statusTone(status: SessionItem["status"]) {
  if (status === "Upcoming") return "bg-blue-100 text-blue-700";
  if (status === "Active Now") return "bg-violet-100 text-violet-700";
  return "bg-slate-100 text-slate-600";
}

function Stars({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={14}
          className={value <= count ? "fill-amber-400 text-amber-400" : "text-amber-200"}
        />
      ))}
    </span>
  );
}

export default function Dashboard() {
  const [activeSessionTab, setActiveSessionTab] = useState<SessionTabLabel>("All");
  const [sessions, setSessions] = useState<SessionItem[]>(initialSessionItems);
  const [pendingCompleteId, setPendingCompleteId] = useState<string | null>(null);
  const [transferToast, setTransferToast] = useState<{ credits: number } | null>(null);
  const [showCreditDetails, setShowCreditDetails] = useState(false);

  const earned = 47;
  const spent = 35;
  const total = earned + spent;
  const earnedPct = Math.round((earned / total) * 100);

  const sessionTabCounts = useMemo(
    () => ({
      All: sessions.length,
      Upcoming: sessions.filter((item) => item.status === "Upcoming").length,
      Active: sessions.filter((item) => item.status === "Active Now").length,
      Completed: sessions.filter((item) => item.status === "Completed").length,
    }),
    [sessions]
  );

  const visibleSessions = useMemo(() => {
    if (activeSessionTab === "All") return sessions;
    if (activeSessionTab === "Upcoming") return sessions.filter((item) => item.status === "Upcoming");
    if (activeSessionTab === "Active") return sessions.filter((item) => item.status === "Active Now");
    return sessions.filter((item) => item.status === "Completed");
  }, [activeSessionTab, sessions]);

  const previewSessions = useMemo(() => visibleSessions.slice(0, 3), [visibleSessions]);
  const activityPreview = useMemo(() => activityItems.slice(0, 3), []);

  useEffect(() => {
    if (!transferToast) return;

    const timer = window.setTimeout(() => {
      setTransferToast(null);
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [transferToast]);

  const handleMarkComplete = (id: string) => {
    setSessions((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (!item.action) return item;

        return {
          ...item,
          status: "Completed",
          date: `Completed ${item.date}`,
          action: undefined,
          rating: item.rating ?? 5,
        };
      })
    );
  };

  const pendingSession = pendingCompleteId
    ? sessions.find((item) => item.id === pendingCompleteId) ?? null
    : null;

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-[1420px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-transparent p-5 shadow-none sm:p-6">
          <div className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full bg-indigo-300/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-violet-300/20 blur-3xl" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[linear-gradient(145deg,#bae6fd_0%,#a7f3d0_100%)] p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white text-sm font-semibold text-slate-700">
                  JL
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500">Welcome back</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Jordan Lee</h1>
                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                  <Stars count={5} />
                  <span className="text-sm text-slate-500">4.7 rating</span>
                  <span className="rounded-full border border-slate-200 bg-white/85 px-3 py-1 text-xs font-medium text-slate-600">React</span>
                  <span className="rounded-full border border-slate-200 bg-white/85 px-3 py-1 text-xs font-medium text-slate-600">TypeScript</span>
                  <span className="rounded-full border border-slate-200 bg-white/85 px-3 py-1 text-xs font-medium text-slate-600">Python</span>
                </div>
              </div>
            </div>

            <div className="relative flex gap-2.5 pt-1">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Compass size={17} />
                Explore
              </Link>
              <Link
                to="/helpers/h1/request"
                className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-900/20 transition hover:brightness-105"
              >
                <Plus size={17} />
                Post Request
              </Link>
            </div>
          </div>

          <div className="relative mt-5 grid grid-cols-1 gap-3 xl:grid-cols-[1.8fr_1fr_1fr_1fr_1fr]">
            <article className="rounded-2xl border border-indigo-100 bg-transparent p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-700">
                    <Coins size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Credit Balance</p>
                    <p className="text-2xl font-semibold leading-none">
                      12 <span className="text-lg font-normal text-slate-500">credits</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreditDetails((prev) => !prev)}
                  className="inline-flex items-center gap-2 text-sm text-slate-500"
                >
                  {showCreditDetails ? "Hide" : "Details"}
                  <ChevronDown size={16} className={showCreditDetails ? "rotate-180 transition" : "transition"} />
                </button>
              </div>

              <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                <span>Earned vs Spent</span>
                <span>82 total transacted</span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/80">
                <div
                  className="h-full bg-[linear-gradient(90deg,#93c5fd_0%,#93c5fd_58%,#c4b5fd_58%,#c4b5fd_100%)]"
                  style={{ width: `${earnedPct}%` }}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-6 text-sm">
                <span className="inline-flex items-center gap-2 text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-300" />
                  Earned <strong className="text-slate-900">47</strong>
                </span>
                <span className="inline-flex items-center gap-2 text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-300" />
                  Spent <strong className="text-slate-900">35</strong>
                </span>
              </div>

              {showCreditDetails ? (
                <>
                  <div className="my-4 h-px bg-indigo-200/70" />

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <article className="rounded-2xl border border-indigo-200/70 bg-indigo-100/45 px-4 py-3">
                      <p className="text-sm font-semibold text-indigo-700">As Helper</p>
                      <p className="mt-1 text-4xl font-semibold leading-none text-indigo-700">11</p>
                      <p className="mt-1 text-sm text-indigo-700">sessions completed</p>
                    </article>

                    <article className="rounded-2xl border border-sky-200/70 bg-sky-100/45 px-4 py-3">
                      <p className="text-sm font-semibold text-sky-700">As Requester</p>
                      <p className="mt-1 text-4xl font-semibold leading-none text-sky-700">8</p>
                      <p className="mt-1 text-sm text-sky-700">sessions received</p>
                    </article>
                  </div>

                  <div className="mt-3 flex items-center justify-between rounded-2xl border border-indigo-200/70 bg-indigo-50/80 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-700">Average Rating as Helper</p>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Stars count={5} />
                      <span className="text-lg font-semibold leading-none">4.7</span>
                      <span className="text-sm font-medium">(17)</span>
                    </div>
                  </div>
                </>
              ) : null}
            </article>

            <article className="rounded-2xl border border-slate-200 bg-transparent p-4">
              <div className="w-fit rounded-2xl bg-sky-100 p-3 text-sky-700">
                <Check size={20} />
              </div>
              <p className="mt-4 text-2xl font-semibold">19</p>
              <p className="text-sm text-slate-700">Sessions Done</p>
              <p className="mt-2 text-sm text-slate-500">11 as helper · 8 as requester</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-transparent p-4">
              <div className="w-fit rounded-2xl bg-violet-100 p-3 text-violet-700">
                <MessageCircle size={20} />
              </div>
              <p className="mt-4 text-2xl font-semibold">8</p>
              <p className="text-sm text-slate-700">Requests Posted</p>
              <p className="mt-2 text-sm text-slate-500">Total help requests</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-transparent p-4">
              <div className="w-fit rounded-2xl bg-indigo-100 p-3 text-indigo-700">
                <Send size={20} />
              </div>
              <p className="mt-4 text-2xl font-semibold">15</p>
              <p className="text-sm text-slate-700">Offers Submitted</p>
              <p className="mt-2 text-sm text-slate-500">11 accepted</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-transparent p-4">
              <div className="w-fit rounded-2xl bg-amber-100 p-3 text-amber-700">
                <Star size={20} />
              </div>
              <p className="mt-4 text-2xl font-semibold">4.7</p>
              <p className="text-sm text-slate-700">Avg. Rating</p>
              <p className="mt-2 text-sm text-slate-500">From 17 ratings</p>
            </article>
          </div>
        </section>

        <section className="relative mt-4 overflow-hidden rounded-3xl border border-indigo-200/70 bg-[linear-gradient(140deg,rgba(238,242,255,0.95)_0%,rgba(237,233,254,0.92)_45%,rgba(224,231,255,0.95)_100%)] p-4 shadow-[0_14px_34px_-26px_rgba(99,102,241,0.45)] sm:p-5">
          <div className="pointer-events-none absolute -top-16 right-6 h-40 w-40 rounded-full bg-indigo-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-10 h-36 w-36 rounded-full bg-violet-300/20 blur-3xl" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-indigo-100 p-2 text-indigo-700">
                <Calendar size={16} />
              </div>
              <h2 className="text-base font-semibold">Sessions</h2>
            </div>
            <Link to="/sessions" className="text-xs font-semibold text-indigo-700 hover:text-indigo-800">
              View all
            </Link>
          </div>

          <div className="relative mt-3 inline-flex rounded-2xl bg-white/75 p-1">
            {sessionTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveSessionTab(tab)}
                className={`mx-0.5 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs transition ${
                  activeSessionTab === tab
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-500">
                  {sessionTabCounts[tab]}
                </span>
              </button>
            ))}
          </div>

          <div className="relative mt-3 space-y-2.5">
            {previewSessions.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3.5 transition hover:shadow-sm lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className={`rounded-full px-2.5 py-0.5 font-medium ${skillTone(item.skill)}`}>
                      {item.skill}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 font-medium ${statusTone(item.status)}`}>
                      {item.status}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-medium ${
                        item.role === "Helping"
                          ? "bg-violet-100 text-violet-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {item.role}
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-medium leading-tight text-slate-900">{item.topic}</h3>

                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <User size={13} />
                      {item.role === "Helping" ? "For" : "With"} {item.person}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={13} />
                      {item.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Timer size={13} />
                      {item.duration}
                    </span>
                    {item.rating ? <Stars count={item.rating} /> : null}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end lg:self-center">
                  <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-0.5 text-xs font-semibold text-indigo-700">
                    <Coins size={12} />
                    {item.credits > 0 ? `+${item.credits}` : item.credits}
                  </span>
                  {item.action ? (
                    <button
                      type="button"
                      onClick={() => setPendingCompleteId(item.id)}
                      className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-800"
                    >
                      {item.action}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-700">
                      <Check size={12} />
                      Done
                    </span>
                  )}
                </div>
              </article>
            ))}

            {visibleSessions.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
                No sessions in this tab yet.
              </div>
            ) : null}
          </div>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
          <article className="rounded-3xl border border-slate-200/70 bg-transparent shadow-none">
            <div className="flex items-center justify-between border-b border-slate-200/80 p-4">
              <h3 className="text-lg font-semibold">Open Requests</h3>
              <Link to="/helpers/h1/request" className="text-sm font-semibold text-indigo-700">
                + New
              </Link>
            </div>
            <div className="space-y-2 p-4">
              {openRequests.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-transparent p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base leading-tight">{item.title}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span className="rounded-full bg-rose-100 px-3 py-0.5 text-rose-700">• {item.urgency}</span>
                        <span className="inline-flex items-center gap-1">
                          <MessageCircle size={14} />
                          {item.offers} offers
                        </span>
                        <span>{item.age}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-sm font-semibold text-indigo-700">
                      <Coins size={14} />
                      {item.credits}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200/70 bg-transparent shadow-none">
            <div className="flex items-center justify-between border-b border-slate-200/80 p-4">
              <h3 className="text-lg font-semibold">Submitted Offers</h3>
              <Link to="/explore?tab=requests#explore-tabs-bar" className="text-sm font-semibold text-indigo-700">
                Browse requests
              </Link>
            </div>
            <div className="space-y-2 p-4">
              {submittedOffers.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-transparent p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base leading-tight">{item.title}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span
                          className={`rounded-full px-3 py-0.5 ${
                            item.status === "Accepted"
                              ? "bg-violet-100 text-violet-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {item.status}
                        </span>
                        <span>by {item.user}</span>
                        <span>{item.age}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-sm font-semibold text-indigo-700">
                      <Coins size={14} />
                      {item.credits}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="relative mt-4 overflow-hidden rounded-3xl border border-indigo-200/70 bg-[linear-gradient(140deg,rgba(238,242,255,0.95)_0%,rgba(237,233,254,0.92)_45%,rgba(224,231,255,0.95)_100%)] shadow-[0_14px_34px_-26px_rgba(99,102,241,0.45)]">
          <div className="pointer-events-none absolute -top-16 right-6 h-40 w-40 rounded-full bg-indigo-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-10 h-36 w-36 rounded-full bg-violet-300/20 blur-3xl" />

          <div className="relative flex items-center justify-between border-b border-indigo-200/70 p-4">
            <h3 className="text-lg font-semibold">Activity</h3>
            <Link
              to="/activity"
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-300/70 bg-white/80 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-white"
            >
              View all
            </Link>
          </div>

          <div className="relative">
            {activityPreview.map((item) => (
              <article
                key={item.id}
                className="flex items-center justify-between border-b border-indigo-200/70 px-4 py-5 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-3 ${toneClasses(item.tone)}`}>
                    {item.id === "a1" ? (
                      <Plus size={15} />
                    ) : item.id === "a2" ? (
                      <Check size={15} />
                    ) : item.id === "a3" ? (
                      <Send size={15} />
                    ) : item.id === "a4" ? (
                      <Star size={15} />
                    ) : (
                      <Calendar size={15} />
                    )}
                  </div>
                  <div>
                    <p className="text-base leading-tight">{item.text}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.date}</p>
                  </div>
                </div>

                {item.credits ? (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
                      item.credits > 0 ? "bg-violet-100 text-violet-700" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    <Coins size={14} />
                    {item.credits > 0 ? `+${item.credits}` : item.credits}
                  </span>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {transferToast ? (
        <div className="pointer-events-none fixed bottom-5 right-5 z-[60]">
          <div className="flex min-w-[260px] items-center gap-2.5 rounded-2xl border border-indigo-300 bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] px-4 py-3 text-white shadow-xl shadow-indigo-900/20">
            <div className="rounded-full bg-white/20 p-1.5 text-white">
              <Coins size={15} />
            </div>
            <div>
              <p className="text-base font-semibold leading-tight">{transferToast.credits} credits released</p>
              <p className="mt-0.5 text-sm text-indigo-100">Session marked as complete</p>
            </div>
          </div>
        </div>
      ) : null}

      {pendingSession ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm"
            onClick={() => setPendingCompleteId(null)}
            aria-label="Close confirmation"
          />

          <div className="relative w-full max-w-md rounded-2xl border border-indigo-100 bg-white p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-indigo-100 p-2.5 text-indigo-700">
                <Check size={16} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Mark Session Complete?</h3>
                <p className="mt-0.5 text-sm text-slate-500">This will trigger credit transfer</p>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-medium leading-snug text-slate-800">{pendingSession.topic}</p>
                  <p className="mt-1.5 text-sm text-slate-500">
                    {pendingSession.role === "Helping" ? "for" : "with"} {pendingSession.person}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                  <Coins size={14} />
                  {pendingSession.credits > 0 ? `+${pendingSession.credits}` : pendingSession.credits}
                </span>
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              {Math.abs(pendingSession.credits)} credits will be transferred{" "}
              {pendingSession.credits > 0 ? "to your balance." : "from your balance."}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPendingCompleteId(null)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const releasedCredits = Math.abs(pendingSession.credits);
                  handleMarkComplete(pendingSession.id);
                  setPendingCompleteId(null);
                  setTransferToast({ credits: releasedCredits });
                }}
                className="rounded-xl bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] px-3 py-2 text-sm font-semibold text-white transition hover:brightness-105"
              >
                Confirm & Transfer
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}







