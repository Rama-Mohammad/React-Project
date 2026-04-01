import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Calendar,
  ChevronDown,
  CirclePlus,
  Clock3,
  Coins,
  Code2,
  LayoutDashboard,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Star,
  User,
  UserCheck2,
  UserRoundCheck,
} from "lucide-react";

type ViewTab = "Requests" | "Helpers" | "Skills";
type SortMode = "Newest" | "Oldest" | "Lowest credits" | "Highest credits";
type HelperSort = "Top Rated" | "Fast Response" | "Most Sessions";
type SkillSort = "Most Helpers" | "Top Rated" | "Most Sessions";
type HelperRatingFilter = "Any rating" | "4.0+" | "4.5+" | "4.8+";
type SkillLevel = "All" | "Beginner" | "Intermediate" | "Advanced";

const navItems = [
  { label: "Explore", icon: BadgeCheck, to: "/explore" },
  { label: "Sessions", icon: Calendar, to: "/sessions" },
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Profile", icon: User, to: "/profile" },
];

const topics = ["All", "Algorithms", "Data Science", "Database", "Machine Learning", "Mathematics", "Programming", "Statistics", "System Design", "Web Development", "Writing"];

const requests = [
  { title: "Fix my Python pipeline crash", category: "Data Science", urgency: "High", desc: "MemoryError while transforming CSV records.", tags: ["Python", "Pandas", "Data Engineering"], duration: "30 min", offers: "0 offers", age: "5d ago", user: "Amara Diallo", rating: "4.4", credits: "4" },
  { title: "Big O for interview prep", category: "Algorithms", urgency: "High", desc: "Need fast intuition for complexity analysis.", tags: ["Algorithms", "Data Structures"], duration: "60 min", offers: "5 offers", age: "5d ago", user: "Marcus Webb", rating: "4.9", credits: "6" },
  { title: "React re-render loop", category: "Programming", urgency: "High", desc: "useEffect keeps firing infinitely.", tags: ["React", "JavaScript", "Hooks"], duration: "30 min", offers: "3 offers", age: "5d ago", user: "Alex Chen", rating: "4.8", credits: "4" },
];

const helpers = [
  { name: "Marcus Webb", rating: 4.9, online: true, responseMins: 5, desc: "CS senior, strong in algorithms and interview prep.", badges: ["Top Rated", "Fast Responder", "Expert"], focus: ["Algorithms", "Programming", "+1"], tags: ["Algorithms", "Data Structures", "Python", "C++", "+1"], sessions: 57, success: 98, rate: 6, skills: ["Algorithms", "Programming"] },
  { name: "James Okafor", rating: 4.9, online: true, responseMins: 20, desc: "ML researcher; practical neural nets guidance.", badges: ["Top Rated", "Expert", "Verified Student"], focus: ["Machine Learning", "Mathematics", "+1"], tags: ["Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "+1"], sessions: 44, success: 97, rate: 6, skills: ["Machine Learning", "Mathematics"] },
  { name: "Fatima Al-Rashid", rating: 4.9, online: true, responseMins: 10, desc: "Algorithm specialist and ICPC finalist.", badges: ["Top Rated", "Expert", "Fast Responder"], focus: ["Algorithms", "Programming", "+1"], tags: ["Algorithms", "Graph Theory", "Dynamic Programming", "Java", "+1"], sessions: 52, success: 99, rate: 6, skills: ["Algorithms", "Programming"] },
];

const skills = [
  { name: "Python", category: "Programming", level: "Beginner" as SkillLevel, desc: "Core Python for scripting, OOP, and automation.", helpers: 32, rating: 4.7, sessions: 310, icon: "code" },
  { name: "Algorithms", category: "Algorithms", level: "Advanced" as SkillLevel, desc: "Complexity, graph patterns, and competitive strategies.", helpers: 24, rating: 4.9, sessions: 231, icon: "algo" },
  { name: "Pandas", category: "Data Science", level: "Beginner" as SkillLevel, desc: "DataFrames, cleaning, joining, and time-series workflows.", helpers: 22, rating: 4.7, sessions: 183, icon: "table" },
];

const stats = [
  { icon: MessageCircle, value: "247", label: "Active Requests", tone: "text-emerald-600" },
  { icon: UserRoundCheck, value: "83", label: "Helpers Online", tone: "text-orange-500" },
  { icon: Calendar, value: "61", label: "Sessions Today", tone: "text-violet-600" },
  { icon: Coins, value: "1.2k", label: "Credits Exchanged", tone: "text-rose-500" },
];

const badgeTone = (b: string) =>
  b === "Top Rated" ? "bg-amber-50 text-amber-700" : b === "Fast Responder" ? "bg-emerald-50 text-emerald-700" : b === "Verified Student" ? "bg-sky-50 text-sky-700" : "bg-violet-50 text-violet-700";

const levelTone = (l: SkillLevel) =>
  l === "Advanced" ? "bg-rose-50 text-rose-600" : l === "Intermediate" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600";

export default function Explore() {
  const navigate = useNavigate();
  const location = useLocation();

  const [tab, setTab] = useState<ViewTab>("Requests");
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("All");
  const [showHow, setShowHow] = useState(false);
  const [sort, setSort] = useState<SortMode>("Newest");
  const [helperSort, setHelperSort] = useState<HelperSort>("Top Rated");
  const [skillSort, setSkillSort] = useState<SkillSort>("Most Helpers");
  const [helperRating, setHelperRating] = useState<HelperRatingFilter>("Any rating");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("All");

  const filteredRequests = useMemo(() => {
    const q = search.toLowerCase();
    const list = requests.filter((r) => (topic === "All" || r.category === topic || r.tags.includes(topic)) && (q === "" || `${r.title} ${r.desc} ${r.category} ${r.tags.join(" ")}`.toLowerCase().includes(q)));
    return [...list].sort((a, b) => (sort === "Newest" ? 0 : sort === "Lowest credits" ? Number(a.credits) - Number(b.credits) : sort === "Highest credits" ? Number(b.credits) - Number(a.credits) : 0));
  }, [search, topic, sort]);

  const filteredHelpers = useMemo(() => {
    const q = search.toLowerCase();
    const min = helperRating === "4.8+" ? 4.8 : helperRating === "4.5+" ? 4.5 : helperRating === "4.0+" ? 4 : 0;
    const list = helpers.filter((h) => (topic === "All" || h.skills.includes(topic)) && h.rating >= min && (!onlineOnly || h.online) && (q === "" || `${h.name} ${h.desc} ${h.skills.join(" ")}`.toLowerCase().includes(q)));
    return [...list].sort((a, b) => (helperSort === "Top Rated" ? b.rating - a.rating : helperSort === "Fast Response" ? a.responseMins - b.responseMins : b.sessions - a.sessions));
  }, [search, topic, helperRating, onlineOnly, helperSort]);

  const filteredSkills = useMemo(() => {
    const q = search.toLowerCase();
    const list = skills.filter((s) => (topic === "All" || s.category === topic) && (skillLevel === "All" || s.level === skillLevel) && (q === "" || `${s.name} ${s.desc} ${s.category}`.toLowerCase().includes(q)));
    return [...list].sort((a, b) => (skillSort === "Most Helpers" ? b.helpers - a.helpers : skillSort === "Top Rated" ? b.rating - a.rating : b.sessions - a.sessions));
  }, [search, topic, skillLevel, skillSort]);

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#111827]">
      <header className="sticky top-0 z-30 border-b border-[#e7ebf0] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/explore" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500" />
            <span className="text-xl font-bold tracking-tight">PeerCredit</span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((n) => {
              const I = n.icon;
              const active = location.pathname === n.to;
              return (
                <Link key={n.label} to={n.to} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${active ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"}`}>
                  <I size={15} />{n.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 sm:flex"><Coins size={14} />12 credits</div>
            <button onClick={() => navigate("/dashboard")} className="hidden items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-semibold text-white sm:flex"><CirclePlus size={14} />Post Request</button>
            <button onClick={() => navigate("/profile")} className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-xs font-semibold text-white">MK</button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="pt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <BadgeCheck size={12} />
              Credit-based peer assistance
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Find Help, <span className="text-emerald-600">Offer Skills.</span>
              <br />
              No money - just reciprocity.
            </h1>
            <p className="mt-3 max-w-xl text-sm text-gray-600">
              Earn credits by helping others, spend them to get help yourself.
              Every session is time-bounded, skill-tagged, and tracked for accountability.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <CirclePlus size={14} />
                Post a Request
              </button>
              <button
                type="button"
                onClick={() => setShowHow(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <BadgeCheck size={14} />
                How it works
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.label} className="rounded-xl border border-gray-200 bg-white p-3">
                  <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 ${item.tone}`}>
                    <Icon size={16} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-8 rounded-lg bg-emerald-600 px-4 py-2.5 text-white">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium sm:gap-5 sm:text-sm">
            <span>1. Post a request</span>
            <span aria-hidden>-&gt;</span>
            <span>2. Receive offers</span>
            <span aria-hidden>-&gt;</span>
            <span>3. Complete session</span>
            <span aria-hidden>-&gt;</span>
            <span>4. Credits transfer</span>
          </div>
        </section>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
            {(["Requests", "Helpers", "Skills"] as ViewTab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${tab === t ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                {t}
                <span className={`rounded-full px-1.5 py-0.5 text-xs ${tab === t ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-600"}`}>
                  {t === "Requests" ? filteredRequests.length : t === "Helpers" ? filteredHelpers.length : filteredSkills.length}
                </span>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500">{tab === "Helpers" ? "Find experts ready to help you" : tab === "Skills" ? "Explore skills available in the community" : "Browse open help requests from peers"}</p>
        </div>

        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none" placeholder={tab === "Helpers" ? "Search by name, skill, or expertise..." : tab === "Skills" ? "Search skills by name or description..." : "Search by title, skill, or keyword..."} />
            </div>
            <button
              onClick={() => tab === "Requests" ? setSort((p) => p === "Newest" ? "Oldest" : p === "Oldest" ? "Lowest credits" : p === "Lowest credits" ? "Highest credits" : "Newest") : tab === "Helpers" ? setHelperSort((p) => p === "Top Rated" ? "Fast Response" : p === "Fast Response" ? "Most Sessions" : "Top Rated") : setSkillSort((p) => p === "Most Helpers" ? "Top Rated" : p === "Top Rated" ? "Most Sessions" : "Most Helpers")}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700"
            >
              <SlidersHorizontal size={14} />
              {tab === "Requests" ? sort : tab === "Helpers" ? helperSort : skillSort}
              <ChevronDown size={12} />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {topics.map((t) => <button key={t} onClick={() => setTopic(t)} className={`rounded-full border px-3 py-1 text-xs ${topic === t ? "border-emerald-600 bg-emerald-600 text-white" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>{t}</button>)}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {tab === "Helpers" && (["Any rating", "4.0+", "4.5+", "4.8+"] as HelperRatingFilter[]).map((r) => <button key={r} onClick={() => setHelperRating(r)} className={`rounded-md px-2.5 py-1 text-xs ${helperRating === r ? "bg-gray-100 text-gray-700" : "text-gray-500 hover:bg-gray-50"}`}>{r}</button>)}
              {tab === "Skills" && (["All", "Beginner", "Intermediate", "Advanced"] as SkillLevel[]).map((l) => <button key={l} onClick={() => setSkillLevel(l)} className={`rounded-md px-2.5 py-1 text-xs ${skillLevel === l ? "bg-gray-100 text-gray-700" : "text-gray-500 hover:bg-gray-50"}`}>{l}</button>)}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tab === "Helpers" && <button onClick={() => setOnlineOnly((p) => !p)} className={`rounded-md px-2.5 py-1 text-xs ${onlineOnly ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"}`}>{onlineOnly ? "Online now" : "All status"}</button>}
            </div>
            <p className="text-xs text-gray-500"><span className="font-semibold text-gray-700">{tab === "Requests" ? filteredRequests.length : tab === "Helpers" ? filteredHelpers.length : filteredSkills.length}</span> {tab.toLowerCase()}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tab === "Requests" && filteredRequests.map((r) => (
            <article key={r.title} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between"><span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-cyan-700">{r.category}</span><span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-600">{r.urgency}</span></div>
              <h3 className="text-base font-semibold text-gray-900">{r.title}</h3>
              <p className="mt-1 text-xs text-gray-600">{r.desc}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{r.tags.map((t) => <span key={t} className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-600">{t}</span>)}</div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500"><span className="inline-flex items-center gap-1"><Clock3 size={12} />{r.duration}</span><span className="inline-flex items-center gap-1"><MessageCircle size={12} />{r.offers}</span><span>{r.age}</span></div>
              <div className="mt-3 flex items-center justify-between"><div><p className="text-xs font-medium text-gray-900">{r.user}</p><p className="inline-flex items-center gap-1 text-[10px] text-gray-500"><Star size={10} className="fill-amber-400 text-amber-400" />{r.rating}</p></div><div className="flex items-center gap-2"><span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">{r.credits}</span><button className="rounded-lg bg-gray-900 px-3 py-1 text-xs font-medium text-white">View</button></div></div>
            </article>
          ))}

          {tab === "Helpers" && filteredHelpers.map((h) => (
            <article key={h.name} className="rounded-2xl border border-gray-200 bg-white">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{h.name}</p>
                    <p className="text-sm text-gray-400"><span className="font-medium text-emerald-600">{h.online ? "Online now" : "Offline"}</span> · Responds &lt; {h.responseMins} min</p>
                  </div>
                  <p className="inline-flex items-center gap-1 text-lg font-semibold text-gray-900"><Star size={14} className="fill-amber-400 text-amber-400" />{h.rating.toFixed(1)}</p>
                </div>
                <p className="mt-3 text-sm text-gray-600">{h.desc}</p>
                <div className="mt-3 flex flex-wrap gap-2">{h.badges.map((b) => <span key={b} className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeTone(b)}`}>{b}</span>)}</div>
                <div className="mt-3 flex flex-wrap gap-2">{h.focus.map((t) => <span key={t} className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-600">{t}</span>)}</div>
                <div className="mt-2 flex flex-wrap gap-2">{h.tags.map((t) => <span key={t} className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs text-gray-600">{t}</span>)}</div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 text-sm text-gray-500">
                <div className="flex items-center gap-4"><span>{h.sessions} sessions</span><span>{h.success}%</span></div>
                <div className="flex items-center gap-2"><span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">{h.rate} /hr</span><button className="rounded-xl bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white">Request</button></div>
              </div>
            </article>
          ))}

          {tab === "Skills" && filteredSkills.map((s) => (
            <article key={s.name} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.icon === "table" ? "bg-cyan-100 text-cyan-600" : s.icon === "algo" ? "bg-indigo-100 text-indigo-600" : "bg-violet-100 text-violet-600"}`}>{s.icon === "table" ? <LayoutDashboard size={20} /> : <Code2 size={20} />}</div>
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${levelTone(s.level)}`}>{s.level}</span>
              </div>
              <h3 className="mt-4 text-3xl font-semibold text-gray-900">{s.name}</h3>
              <span className="mt-1 inline-flex rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-cyan-700">{s.category}</span>
              <p className="mt-4 text-sm text-gray-600">{s.desc}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600"><span className="inline-flex items-center gap-1"><UserCheck2 size={14} className="text-emerald-600" /><strong>{s.helpers}</strong> helpers</span><span className="inline-flex items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400" /><strong>{s.rating.toFixed(1)}</strong> avg</span><span><strong>{s.sessions}</strong> sessions</span></div>
              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4"><span className="text-sm text-gray-400">Top helpers</span><button className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">Find helpers <ChevronDown size={14} className="-rotate-90" /></button></div>
            </article>
          ))}
        </div>
      </main>

      {showHow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4" onClick={() => setShowHow(false)}>
          <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4"><div><h2 className="text-2xl font-bold text-gray-900">How It Works</h2><p className="mt-1 text-sm text-gray-600">Quick tutorial to start using PeerCredit.</p></div><button onClick={() => setShowHow(false)} className="rounded-lg border border-gray-200 px-2.5 py-1 text-sm text-gray-600 hover:bg-gray-50">Close</button></div>
            <div className="mt-5 space-y-3 text-sm text-gray-700">
              <p><strong>1. Post a request:</strong> Describe your problem and add tags.</p>
              <p><strong>2. Receive offers:</strong> Helpers send offers based on skills.</p>
              <p><strong>3. Complete session:</strong> Work together and mark done.</p>
              <p><strong>4. Credits transfer:</strong> Credits move after completion.</p>
            </div>
            <div className="mt-6 flex justify-end"><button onClick={() => setShowHow(false)} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Got it</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
