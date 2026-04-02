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
import Navbar from "../components/common/Navbar";

type SessionTab = {
  label: string;
  count: number;
  active?: boolean;
};

type SessionItem = {
  id: string;
  topic: string;
  skill: string;
  status: string;
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

type ActivityItem = {
  id: string;
  text: string;
  date: string;
  tone: string;
  credits?: number;
};

const sessionTabs: SessionTab[] = [
  { label: "All", count: 8, active: true },
  { label: "Upcoming", count: 2 },
  { label: "Active", count: 1 },
  { label: "Completed", count: 5 },
] ;

const sessionItems: SessionItem[] = [
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
] ;

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
] ;

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
] ;

const activityItems: ActivityItem[] = [
  { id: "a1", text: 'You posted a new request - "Debug React useEffect"', date: "Mar 27, 10:15 AM", tone: "purple" },
  { id: "a2", text: "Your offer for SQL window functions was accepted", date: "Mar 26, 12:30 PM", tone: "blue" },
  { id: "a3", text: 'You submitted an offer on "SQL window functions walkthrough"', date: "Mar 26, 11:10 AM", tone: "orange" },
  { id: "a4", text: "Alex Chen rated you 5 stars after your session", date: "Mar 25, 01:40 PM", tone: "amber" },
  { id: "a5", text: "Session completed - TypeScript generics with Alex Chen", date: "Mar 25, 01:35 PM", tone: "green", credits: 3 },
  { id: "a6", text: "Session completed - Big O notation with Marcus Webb", date: "Mar 20, 01:05 PM", tone: "green", credits: -6 },
  { id: "a7", text: "Credits escrowed for Big O notation session with Marcus Webb", date: "Mar 19, 10:00 AM", tone: "rose", credits: -6 },
] ;

function toneClasses(tone: string) {
  if (tone === "purple") return "bg-violet-100 text-violet-600";
  if (tone === "blue") return "bg-sky-100 text-sky-600";
  if (tone === "orange") return "bg-sky-100 text-sky-600";
  if (tone === "amber") return "bg-violet-100 text-violet-600";
  if (tone === "green") return "bg-indigo-100 text-indigo-600";
  if (tone === "rose") return "bg-violet-100 text-violet-600";
  return "bg-indigo-50/60 text-slate-600";
}

function skillTone(skill: string) {
  if (skill === "Programming") return "bg-violet-100 text-violet-700";
  if (skill === "Database") return "bg-sky-100 text-sky-700";
  if (skill === "Web Development") return "bg-violet-100 text-violet-700";
  if (skill === "Algorithms") return "bg-indigo-100 text-indigo-700";
  if (skill === "Machine Learning") return "bg-violet-100 text-violet-700";
  if (skill === "Statistics") return "bg-sky-100 text-sky-700";
  if (skill === "System Design") return "bg-indigo-100 text-indigo-700";
  return "bg-indigo-50/60 text-slate-700";
}

function statusTone(status: string) {
  if (status === "Upcoming") return "bg-sky-100 text-sky-700";
  if (status === "Active Now") return "bg-indigo-100 text-indigo-700";
  return "bg-indigo-50/60 text-slate-600";
}

function Stars({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={14}
          className={value <= count ? "fill-violet-400 text-violet-400" : "text-indigo-300"}
        />
      ))}
    </span>
  );
}

export default function Dashboard() {
  const earned = 47;
  const spent = 35;
  const total = earned + spent;
  const earnedPct = Math.round((earned / total) * 100);

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#e8efff_0%,#e9f7ff_45%,#f5f8ff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-[1420px] px-4 py-4 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-white/60 bg-white/75 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="h-14 w-14 rounded-2xl bg-[linear-gradient(140deg,#d9e7ff_0%,#bdd8ff_100%)] p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white text-sm font-semibold text-slate-700">
                  JL
                </div>
              </div>
              <div>
                <p className="text-base leading-none text-slate-400">Welcome back</p>
                <h1 className="mt-1 text-3xl font-semibold leading-none tracking-tight">Jordan Lee</h1>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Stars count={5} />
                  <span className="text-base text-slate-500">4.7</span>
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600">React</span>
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600">TypeScript</span>
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600">Python</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
              >
                <Compass size={18} />
                Explore
              </Link>
              <button className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">
                <Plus size={18} />
                Post Request
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.8fr_1fr_1fr_1fr_1fr]">
            <article className="rounded-2xl border border-white/70 bg-white/85 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
                    <Coins size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Credit Balance</p>
                    <p className="text-3xl font-semibold leading-none">
                      12 <span className="text-lg font-normal text-slate-400">credits</span>
                    </p>
                  </div>
                </div>
                <button className="inline-flex items-center gap-2 text-sm text-slate-400">
                  Details
                  <ChevronDown size={16} />
                </button>
              </div>

              <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
                <span>Earned vs Spent</span>
                <span>82 total transacted</span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-indigo-100/80">
                <div className="h-full bg-indigo-500" style={{ width: `${earnedPct}%` }} />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-6 text-sm">
                <span className="inline-flex items-center gap-2 text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                  Earned <strong className="text-slate-800">47</strong>
                </span>
                <span className="inline-flex items-center gap-2 text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
                  Spent <strong className="text-slate-800">35</strong>
                </span>
              </div>
            </article>

            <article className="rounded-2xl border border-white/70 bg-white/85 p-4">
              <div className="w-fit rounded-2xl bg-indigo-100 p-3 text-indigo-600">
                <Check size={20} />
              </div>
              <p className="mt-4 text-3xl font-semibold">19</p>
              <p className="text-base text-slate-600">Sessions Done</p>
              <p className="mt-2 text-sm text-slate-400">11 as helper · 8 as requester</p>
            </article>

            <article className="rounded-2xl border border-white/70 bg-white/85 p-4">
              <div className="w-fit rounded-2xl bg-sky-100 p-3 text-sky-600">
                <MessageCircle size={20} />
              </div>
              <p className="mt-4 text-3xl font-semibold">8</p>
              <p className="text-base text-slate-600">Requests Posted</p>
              <p className="mt-2 text-sm text-slate-400">Total help requests</p>
            </article>

            <article className="rounded-2xl border border-white/70 bg-white/85 p-4">
              <div className="w-fit rounded-2xl bg-indigo-100 p-3 text-indigo-600">
                <Send size={20} />
              </div>
              <p className="mt-4 text-3xl font-semibold">15</p>
              <p className="text-base text-slate-600">Offers Submitted</p>
              <p className="mt-2 text-sm text-slate-400">11 accepted</p>
            </article>

            <article className="rounded-2xl border border-white/70 bg-white/85 p-4">
              <div className="w-fit rounded-2xl bg-indigo-100 p-3 text-indigo-600">
                <Star size={20} />
              </div>
              <p className="mt-4 text-3xl font-semibold">4.7</p>
              <p className="text-base text-slate-600">Avg. Rating</p>
              <p className="mt-2 text-sm text-slate-400">From 17 ratings</p>
            </article>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-white/60 bg-white/75 p-4 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50/60 p-2.5 text-slate-600">
              <Calendar size={18} />
            </div>
            <h2 className="text-xl font-semibold">Sessions</h2>
          </div>

          <div className="mt-4 inline-flex rounded-2xl bg-indigo-50/60 p-1">
            {sessionTabs.map((tab) => (
              <button
                key={tab.label}
                className={`mx-0.5 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-base ${
                  tab.active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                {tab.label}
                <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-sm text-slate-500">{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-2.5">
            {sessionItems.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/90 p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className={`rounded-full px-3 py-1 font-medium ${skillTone(item.skill)}`}>{item.skill}</span>
                    <span className={`rounded-full px-3 py-1 font-medium ${statusTone(item.status)}`}>{item.status}</span>
                    <span
                      className={`rounded-full px-3 py-1 font-medium ${
                        item.role === "Helping" ? "bg-indigo-100 text-indigo-700" : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {item.role}
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-medium leading-tight text-slate-900">{item.topic}</h3>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <span className="inline-flex items-center gap-2">
                      <User size={15} />
                      {item.role === "Helping" ? "For" : "With"} {item.person}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock3 size={15} />
                      {item.date}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Timer size={15} />
                      {item.duration}
                    </span>
                    {item.rating ? <Stars count={item.rating} /> : null}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end lg:self-center">
                  <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-base font-semibold text-indigo-700">
                    <Coins size={14} />
                    {item.credits > 0 ? `+${item.credits}` : item.credits}
                  </span>

                  {item.action ? (
                    <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                      {item.action}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
                      <Check size={14} />
                      Done
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
          <article className="rounded-2xl border border-white/60 bg-white/75">
            <div className="flex items-center justify-between border-b border-slate-200/70 p-4">
              <h3 className="text-xl font-semibold">Open Requests</h3>
              <button className="text-sm text-indigo-600">+ New</button>
            </div>
            <div className="space-y-2 p-4">
              {openRequests.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/70 bg-white/90 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg leading-tight">{item.title}</p>
                      <div className="mt-2 flex items-center gap-3 text-sm text-slate-400">
                        <span className="rounded-full bg-violet-100 px-3 py-0.5 text-violet-600">• {item.urgency}</span>
                        <span className="inline-flex items-center gap-1">
                          <MessageCircle size={14} />
                          {item.offers} offers
                        </span>
                        <span>{item.age}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-base font-semibold text-indigo-700">
                      <Coins size={14} />
                      {item.credits}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-white/60 bg-white/75">
            <div className="flex items-center justify-between border-b border-slate-200/70 p-4">
              <h3 className="text-xl font-semibold">Submitted Offers</h3>
              <button className="text-sm text-indigo-600">Browse requests</button>
            </div>
            <div className="space-y-2 p-4">
              {submittedOffers.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/70 bg-white/90 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg leading-tight">{item.title}</p>
                      <div className="mt-2 flex items-center gap-3 text-sm text-slate-400">
                        <span
                          className={`rounded-full px-3 py-0.5 ${
                            item.status === "Accepted"
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-sky-100 text-sky-700"
                          }`}
                        >
                          {item.status}
                        </span>
                        <span>by {item.user}</span>
                        <span>{item.age}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-base font-semibold text-indigo-700">
                      <Coins size={14} />
                      {item.credits}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-4 rounded-2xl border border-white/60 bg-white/75">
          <div className="flex items-center justify-between border-b border-slate-200/70 p-4">
            <h3 className="text-xl font-semibold">Activity</h3>
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700">
              March 2026
              <ChevronDown size={16} />
            </button>
          </div>

          <div>
            {activityItems.map((item) => (
              <article
                key={item.id}
                className="flex items-center justify-between border-b border-slate-200/70 px-4 py-5 last:border-b-0"
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
                    <p className="text-lg leading-tight">{item.text}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.date}</p>
                  </div>
                </div>

                {item.credits ? (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1 text-base font-semibold ${
                      item.credits > 0 ? "bg-indigo-100 text-indigo-700" : "bg-violet-100 text-violet-600"
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
    </div>
  );
}


