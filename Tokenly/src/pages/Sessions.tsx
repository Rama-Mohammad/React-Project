import { useState } from "react";
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
];

function skillTone(skill: string) {
  if (skill === "Programming") return "bg-violet-100 text-violet-700";
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

  // ✅ FIX: removed useMemo
  const visibleSessions = initialSessionItems;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="p-4">
        <h2 className="text-lg font-semibold">Sessions</h2>

        {visibleSessions.map((item) => (
          <div key={item.id} className="border p-3 rounded mt-3">
            <p>{item.topic}</p>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}