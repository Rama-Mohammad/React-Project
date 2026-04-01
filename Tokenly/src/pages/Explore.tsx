import {
  BadgeCheck,
  Calendar,
  ChevronDown,
  CirclePlus,
  Clock3,
  Coins,
  FileText,
  LayoutDashboard,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Star,
  User,
  UserRoundCheck,
} from "lucide-react";

type Request = {
  category: string;
  urgency: "High urgency" | "Medium urgency" | "Low urgency";
  title: string;
  description: string;
  tags: string[];
  duration: string;
  offers: string;
  age: string;
  user: string;
  rating: string;
  credits: string;
  avatarColor: string;
  avatarInitials: string;
};

const requests: Request[] = [
  {
    category: "Data Science",
    urgency: "High urgency",
    title: "Help me fix a Python data pipeline that keeps crashing",
    description:
      "I have a pandas pipeline that reads a large CSV, transforms data, and writes to a database. It crashes randomly with MemoryError and I can't figure out why.",
    tags: ["Python", "Pandas", "Data Engineering"],
    duration: "30 min",
    offers: "0 offers",
    age: "5d ago",
    user: "Amara Diallo",
    rating: "4.4",
    credits: "4",
    avatarColor: "from-orange-400 to-amber-300",
    avatarInitials: "AD",
  },
  {
    category: "Algorithms",
    urgency: "High urgency",
    title: "Help me understand Big O notation for interview prep",
    description:
      "I have a technical interview in 3 days. I can write working code but I struggle to analyze time and space complexity on the spot.",
    tags: ["Algorithms", "Data Structures", "Interview Prep"],
    duration: "60 min",
    offers: "5 offers",
    age: "5d ago",
    user: "Marcus Webb",
    rating: "4.9",
    credits: "6",
    avatarColor: "from-sky-500 to-blue-400",
    avatarInitials: "MW",
  },
  {
    category: "Programming",
    urgency: "High urgency",
    title: "Debug my React useEffect causing infinite re-renders",
    description:
      "I have a component that keeps re-rendering infinitely. The useEffect depends on an object from a parent component, and even when values don't change, the effect still fires.",
    tags: ["React", "JavaScript", "Hooks"],
    duration: "30 min",
    offers: "3 offers",
    age: "5d ago",
    user: "Alex Chen",
    rating: "4.8",
    credits: "4",
    avatarColor: "from-amber-400 to-orange-400",
    avatarInitials: "AC",
  },
  {
    category: "Web Development",
    urgency: "Medium urgency",
    title: "Code review my REST API error handling",
    description:
      "I built a REST API in Node.js + Express for a side project. I want feedback on status codes, validation flow, and robust error responses.",
    tags: ["Node.js", "Express", "API Design"],
    duration: "45 min",
    offers: "2 offers",
    age: "4d ago",
    user: "Nora Patel",
    rating: "4.7",
    credits: "5",
    avatarColor: "from-fuchsia-500 to-pink-500",
    avatarInitials: "NP",
  },
  {
    category: "Machine Learning",
    urgency: "Low urgency",
    title: "Explain gradient descent and backpropagation intuitively",
    description:
      "I understand basic linear regression but neural network training still feels abstract. Looking for a clear visual explanation with simple examples.",
    tags: ["Neural Networks", "Math", "Deep Learning"],
    duration: "45 min",
    offers: "1 offer",
    age: "4d ago",
    user: "Liam Foster",
    rating: "4.9",
    credits: "3",
    avatarColor: "from-violet-500 to-purple-500",
    avatarInitials: "LF",
  },
  {
    category: "System Design",
    urgency: "Medium urgency",
    title: "Review my system design for a URL shortener",
    description:
      "I'm practicing system design. I've drafted architecture for a URL shortener and need feedback on scaling assumptions, DB choice, and caching.",
    tags: ["Scalability", "Databases", "Architecture"],
    duration: "60 min",
    offers: "4 offers",
    age: "3d ago",
    user: "Sara Nguyen",
    rating: "4.8",
    credits: "6",
    avatarColor: "from-teal-500 to-emerald-400",
    avatarInitials: "SN",
  },
];

const stats = [
  { icon: FileText, value: "247", label: "Active Requests", iconColor: "text-emerald-600" },
  { icon: UserRoundCheck, value: "83", label: "Helpers Online", iconColor: "text-orange-500" },
  { icon: Calendar, value: "61", label: "Sessions Today", iconColor: "text-violet-600" },
  { icon: Coins, value: "1.2k", label: "Credits Exchanged", iconColor: "text-rose-500" },
];

const navItems = [
  { label: "Explore", icon: BadgeCheck, active: true },
  { label: "Sessions", icon: Calendar, active: false },
  { label: "Dashboard", icon: LayoutDashboard, active: false },
  { label: "Profile", icon: User, active: false },
];

const topics = [
  "All",
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

const urgencyColorMap = {
  "High urgency": "bg-rose-50 text-rose-600",
  "Medium urgency": "bg-amber-50 text-amber-600",
  "Low urgency": "bg-emerald-50 text-emerald-600",
};

export default function Explore() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#111827]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#e7ebf0] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500" />
            <span className="text-xl font-bold tracking-tight">PeerCredit</span>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    item.active
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 sm:flex">
              <Coins size={14} />
              12 credits
            </div>
            <button className="hidden items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:flex">
              <CirclePlus size={14} />
              Post Request
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-xs font-semibold text-white">
              MK
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <BadgeCheck size={12} />
              Credit-based peer assistance
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Find Help, <span className="text-emerald-600">Offer Skills.</span>
              <br />
              No money — just reciprocity.
            </h1>

            <p className="mt-3 max-w-xl text-sm text-gray-600">
              Earn credits by helping others, spend them to get help yourself.
              Every session is time-bounded, skill-tagged, and tracked for
              accountability.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                <CirclePlus size={14} />
                Post a Request
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                <BadgeCheck size={14} />
                How it works
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
                >
                  <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 ${item.iconColor}`}>
                    <Icon size={16} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Steps Banner */}
        <div className="mt-8 rounded-lg bg-emerald-600 px-4 py-2.5 text-white">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium sm:gap-5 sm:text-sm">
            <span className="inline-flex items-center gap-1">1. Post a request</span>
            <span>→</span>
            <span className="inline-flex items-center gap-1">2. Receive offers</span>
            <span>→</span>
            <span className="inline-flex items-center gap-1">3. Complete session</span>
            <span>→</span>
            <span className="inline-flex items-center gap-1">4. Credits transfer</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
            {[
              { label: "Requests", count: 12, active: true },
              { label: "Helpers", count: 12, active: false },
              { label: "Skills", count: 15, active: false },
            ].map((tab) => (
              <button
                key={tab.label}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${
                  tab.active
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs ${
                    tab.active
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Browse open help requests from peers
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none"
                placeholder="Search by title, skill, or keyword..."
              />
            </div>
            <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
              <SlidersHorizontal size={14} />
              Newest
              <ChevronDown size={12} />
            </button>
          </div>

          {/* Topics */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {topics.map((topic, index) => (
              <button
                key={topic}
                className={`rounded-full border px-3 py-1 text-xs ${
                  index === 0
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Additional Filters */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {["All", "High", "Medium", "Low"].map((level, index) => (
                <button
                  key={level}
                  className={`rounded-md px-2.5 py-1 text-xs ${
                    index === 0
                      ? "bg-gray-100 text-gray-700"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Any", "≤30m", "≤45m", "≤60m"].map((slot, index) => (
                <button
                  key={slot}
                  className={`rounded-md px-2.5 py-1 text-xs ${
                    index === 0
                      ? "bg-gray-100 text-gray-700"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">12</span> requests
            </p>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <article
              key={request.title}
              className="group rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
            >
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-cyan-700">
                    {request.category}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${urgencyColorMap[request.urgency]}`}
                  >
                    {request.urgency.replace(" urgency", "")}
                  </span>
                </div>

                <h3 className="text-base font-semibold leading-tight text-gray-900 line-clamp-2">
                  {request.title}
                </h3>

                <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                  {request.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {request.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 px-4 py-3">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock3 size={12} />
                    {request.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={12} />
                    {request.offers}
                  </span>
                  <span>{request.age}</span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${request.avatarColor} text-[10px] font-bold text-white`}
                    >
                      {request.avatarInitials}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        {request.user}
                      </p>
                      <p className="flex items-center gap-0.5 text-[10px] text-gray-500">
                        <Star size={10} className="fill-amber-400 text-amber-400" />
                        {request.rating}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      <Coins size={10} />
                      {request.credits}
                    </div>
                    <button className="rounded-lg bg-gray-900 px-3 py-1 text-xs font-medium text-white transition hover:bg-gray-800">
                      View
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}