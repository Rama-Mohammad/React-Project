import { useMemo, useState } from "react";
import { Calendar, Check, Clock3, Coins, Star, Timer, User } from "lucide-react";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";

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
  rating?: number;
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

function skillTone(skill: string) {
  if (skill === "Programming") return "bg-violet-100 text-violet-700";
  if (skill === "Database") return "bg-sky-100 text-sky-700";
  if (skill === "Web Development") return "bg-violet-100 text-violet-700";
  if (skill === "Algorithms") return "bg-sky-100 text-sky-700";
  if (skill === "Machine Learning") return "bg-violet-100 text-violet-700";
  if (skill === "Statistics") return "bg-sky-100 text-sky-700";
  if (skill === "System Design") return "bg-sky-100 text-sky-700";
  return "bg-slate-100 text-slate-700";
}

function statusTone(status: SessionItem["status"]) {
  if (status === "Upcoming") return "bg-sky-100 text-sky-700";
  if (status === "Active Now") return "bg-violet-100 text-violet-700";
  return "bg-slate-100 text-slate-600";
}

function Stars({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={12}
          className={value <= count ? "fill-violet-400 text-violet-400" : "text-violet-200"}
        />
      ))}
    </span>
  );
}

export default function Sessions() {
  const [activeSessionTab, setActiveSessionTab] = useState<SessionTabLabel>("All");

  const sessionTabCounts = useMemo(
    () => ({
      All: initialSessionItems.length,
      Upcoming: initialSessionItems.filter((item) => item.status === "Upcoming").length,
      Active: initialSessionItems.filter((item) => item.status === "Active Now").length,
      Completed: initialSessionItems.filter((item) => item.status === "Completed").length,
    }),
    []
  );

  const visibleSessions = useMemo(() => {
    if (activeSessionTab === "All") return initialSessionItems;
    if (activeSessionTab === "Upcoming") return initialSessionItems.filter((item) => item.status === "Upcoming");
    if (activeSessionTab === "Active") return initialSessionItems.filter((item) => item.status === "Active Now");
    return initialSessionItems.filter((item) => item.status === "Completed");
  }, [activeSessionTab]);

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#edf3ff_0%,#eff8ff_45%,#f8fbff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-[1420px] px-4 py-4 sm:px-6 lg:px-8">
        <section className="mt-2 rounded-2xl border border-white/60 bg-white/75 p-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-indigo-50/60 p-2 text-slate-600">
              <Calendar size={16} />
            </div>
            <h2 className="text-base font-semibold">All Sessions</h2>
          </div>

          <div className="mt-3 inline-flex rounded-2xl bg-indigo-50/60 p-1">
            {sessionTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveSessionTab(tab)}
                className={`mx-0.5 inline-flex items-center gap-2 rounded-xl px-3 py-1 text-xs ${
                  activeSessionTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                {tab}
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-500">
                  {sessionTabCounts[tab]}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            {visibleSessions.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-2 rounded-xl border border-white/70 bg-white/90 p-3 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className={`rounded-full px-2.5 py-0.5 font-medium ${skillTone(item.skill)}`}>{item.skill}</span>
                    <span className={`rounded-full px-2.5 py-0.5 font-medium ${statusTone(item.status)}`}>{item.status}</span>
                    <span className={`rounded-full px-2.5 py-0.5 font-medium ${item.role === "Helping" ? "bg-indigo-100 text-indigo-700" : "bg-violet-100 text-violet-600"}`}>{item.role}</span>
                  </div>

                  <h3 className="mt-1.5 text-sm font-medium leading-tight text-slate-900">{item.topic}</h3>

                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5"><User size={13} />{item.role === "Helping" ? "For" : "With"} {item.person}</span>
                    <span className="inline-flex items-center gap-1.5"><Clock3 size={13} />{item.date}</span>
                    <span className="inline-flex items-center gap-1.5"><Timer size={13} />{item.duration}</span>
                    {item.rating ? <Stars count={item.rating} /> : null}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end lg:self-center">
                  <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-0.5 text-xs font-semibold text-indigo-700">
                    <Coins size={12} />
                    {item.credits > 0 ? `+${item.credits}` : item.credits}
                  </span>
                  {item.status === "Completed" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600">
                      <Check size={12} />
                      Done
                    </span>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
