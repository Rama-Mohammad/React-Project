import { useMemo } from "react";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import type { SessionsPageItem } from "../types/page";

const initialSessionItems: SessionsPageItem[] = [
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

export default function Sessions() {
  const visibleSessions = useMemo(() => initialSessionItems, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <Navbar />

      <main className="p-4">
        <h2 className="text-lg font-semibold">Sessions</h2>

        {visibleSessions.map((item) => (
          <div key={item.id} className="mt-3 rounded border p-3">
            <p>{item.topic}</p>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}

