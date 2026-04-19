import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Calendar,
  Check,
  CheckCheck,
  Circle,
  Clock3,
  Coins,
  ListFilter,
  Search,
  Video,
} from "lucide-react";
import ThemedSelect from "../components/common/ThemedSelect";
import Avatar from "../components/common/Avatar";
import type { Session } from "../types/session";
import { getSessionsByUser } from "../services/sessionService";
import { getCurrentUser } from "../services/authService";
import { updateSessionStatus } from "../services/sessionService";
import { getProfileCreditBalance } from "../services/profileService";

type SessionFilter = "upcoming" | "active" | "completed" | "all";
type RoleFilter = "all" | "helping" | "receiving";
type SortBy = "newest" | "oldest";

import tokenlyLogo from "../assets/favicon_tokenly.svg";

const SessionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [_searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<SessionFilter>("all");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [creditsBalance, setCreditsBalance] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data: userData, error: userError } = await getCurrentUser();

      if (userError || !userData?.user) {
        console.error("No user found");
        setLoading(false);
        return;
      }

      const userId = userData.user.id;

      const [
        { data, error },
        { data: balanceData, error: balanceError },
      ] = await Promise.all([
        getSessionsByUser(userId),
        getProfileCreditBalance(userId),
      ]);

      if (error) {
        console.error("Error fetching sessions:", error);
        setLoading(false);
        return;
      }

      if (balanceError) {
        console.error("Error fetching token balance:", balanceError);
      } else {
        setCreditsBalance(Number(balanceData?.credit_balance ?? 0));
      }

      const mappedSessions = (data || []).map((s: any) => {
        const isHelper = s.helper_id === userId;
        const otherUser = isHelper ? s.requester : s.helper;

        const helpOfferRequestValue = Array.isArray(s.help_offer_request)
          ? s.help_offer_request[0] ?? null
          : s.help_offer_request ?? null;
        const helpOfferValue = Array.isArray(helpOfferRequestValue?.help_offer)
          ? helpOfferRequestValue.help_offer[0] ?? null
          : helpOfferRequestValue?.help_offer ?? null;
        const directRequestValue = Array.isArray(s.direct_request)
          ? s.direct_request[0] ?? null
          : s.direct_request ?? null;

        const title =
          s.request?.title ??
          helpOfferValue?.title ??
          directRequestValue?.title ??
          "Untitled Session";

        const category =
          s.request?.category ??
          helpOfferValue?.category ??
          directRequestValue?.category ??
          "General";

        const creditCost =
          s.request?.credit_cost ??
          helpOfferValue?.credit_cost ??
          directRequestValue?.credit_cost ??
          0;

        const requestId = s.request?.id || s.request_id || undefined;

        return {
          id: s.id,
          requestId,
          title,
          category,
          status: s.status,
          role: (isHelper ? "helping" : "receiving") as "helping" | "receiving",
          otherParticipant: {
            name: otherUser?.full_name || otherUser?.username || "Unknown",
            avatar: otherUser?.profile_image_url,
            id: otherUser?.id,
          },
          datetime: s.scheduled_at ? new Date(s.scheduled_at) : new Date(),
          duration: s.duration_minutes || 30,
          credits: creditCost
            ? isHelper
              ? creditCost
              : -creditCost
            : 0,
        };
      });

      setSessions(mappedSessions);
      setLoading(false);
    };

    fetchSessions();

    const interval = setInterval(() => {
      void fetchSessions();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const counts = useMemo(
    () => ({
      all: sessions.length,
      upcoming: sessions.filter((s) => s.status === "upcoming").length,
      active: sessions.filter((s) => s.status === "active").length,
      completed: sessions.filter((s) => s.status === "completed").length,
      earned: sessions
        .filter((s) => s.status === "completed" && s.role === "helping" && s.credits > 0)
        .reduce((sum, s) => sum + s.credits, 0),
    }),
    [sessions]
  );

  const filteredSessions = useMemo(() => {
    let filtered = sessions;

    if (activeFilter !== "all") {
      filtered = filtered.filter((session) => session.status === activeFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (session) =>
          session.title.toLowerCase().includes(query) ||
          session.category.toLowerCase().includes(query) ||
          session.otherParticipant.name.toLowerCase().includes(query)
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((session) => session.role === roleFilter);
    }

    return [...filtered].sort((a, b) =>
      sortBy === "newest"
        ? b.datetime.getTime() - a.datetime.getTime()
        : a.datetime.getTime() - b.datetime.getTime()
    );
  }, [activeFilter, roleFilter, searchQuery, sessions, sortBy]);

  const statusTabs: { key: SessionFilter; label: string; count: number; icon: React.ReactNode }[] = [
    { key: "all", label: "All Sessions", count: counts.all, icon: <ListFilter size={16} /> },
    { key: "upcoming", label: "Upcoming", count: counts.upcoming, icon: <Calendar size={16} /> },
    { key: "active", label: "Active", count: counts.active, icon: <Video size={16} /> },
    { key: "completed", label: "Completed", count: counts.completed, icon: <CheckCheck size={16} /> },
  ];

  const roleTabs: { key: RoleFilter; label: string }[] = [
    { key: "all", label: "All Roles" },
    { key: "helping", label: "Helping" },
    { key: "receiving", label: "Requesting" },
  ];

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);

  const formatTime = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);

  const sessionNote = (session: Session) => {
    if (session.status === "active") return "Session is currently in progress";
    if (session.status === "completed") return "You rated this session";
    return `Scheduled for ${formatDate(session.datetime)} at ${formatTime(session.datetime)}`;
  };

  const ratingBySession: Record<string, number> = {
    "4": 5,
    "5": 4,
    "6": 4,
    "7": 5,
    "8": 4,
  };

  const categoryChipClass = (category: string) => {
    if (category === "Writing") return "bg-rose-50 text-rose-700";
    if (category === "Database") return "bg-amber-50 text-amber-700";
    if (category === "Web Development") return "bg-orange-50 text-orange-700";
    if (category === "Algorithms") return "bg-indigo-50 text-indigo-700";
    if (category === "Machine Learning") return "bg-violet-50 text-violet-700";
    if (category === "Statistics") return "bg-lime-50 text-lime-700";
    if (category === "System Design") return "bg-cyan-50 text-cyan-700";
    return "bg-slate-100 text-slate-700";
  };

  const statusChipClass = (status: Session["status"]) => {
    if (status === "upcoming") return "bg-sky-100 text-sky-700";
    if (status === "active") return "bg-indigo-100 text-indigo-700";
    return "bg-slate-100 text-slate-600";
  };

  const handleViewRequest = (requestId: string) => navigate(`/requests/${requestId}`);
  const handleJoin = (sessionId: string) => navigate(`/session/${sessionId}`);

  const handleMarkComplete = (sessionId: string) => {
    const session = sessions.find((item) => item.id === sessionId);
    if (!session || session.role !== "helping" || session.status !== "active") {
      setActionError("Only the helper can complete an active session.");
      return;
    }

    setActionError("");
    setSelectedSessionId(sessionId);
    setShowConfirmModal(true);
  };

  const confirmMarkComplete = async () => {
    if (!selectedSessionId) return;

    setActionError("");
    const { error } = await updateSessionStatus(selectedSessionId, "completed");

    if (error) {
      console.error(error);
      setActionError(error.message ?? "Could not complete this session.");
      return;
    }

    setSessions((prev) =>
      prev.map((session) =>
        session.id === selectedSessionId
          ? { ...session, status: "completed" }
          : session
      )
    );

    const { data: userData } = await getCurrentUser();
    if (userData?.user?.id) {
      const { data: balanceData } = await getProfileCreditBalance(userData.user.id);
      setCreditsBalance(Number(balanceData?.credit_balance ?? 0));
    }

    setShowConfirmModal(false);
    setSelectedSessionId(null);
  };

  return (
    <div className="min-h-full bg-[linear-gradient(135deg,#eef4ff_0%,#eef1ff_46%,#f5ecff_100%)] text-slate-900">

      <main className="mx-auto w-full max-w-295 px-3 py-4 sm:px-5 lg:px-6">
        <>
          <div className="rounded-2xl bg-transparent p-3 sm:p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Sessions</h1>
                <p className="mt-1 text-sm text-slate-600">
                  Track your upcoming, active, and completed peer sessions
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-indigo-700">
                <Coins size={14} />
                <span className="text-base font-semibold">{loading ? "" : creditsBalance}</span>
                <span className="text-xs font-medium">tokens balance</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-sky-100/80 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-white p-2.5 text-sky-600">
                    <Calendar size={20} />
                  </span>
                  <div>
                    <p className="text-2xl font-semibold text-sky-700">{loading ? "" : counts.upcoming}</p>
                    <p className="text-sm text-slate-600">Upcoming</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-violet-100/80 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-white p-2.5 text-violet-600">
                    <Video size={20} />
                  </span>
                  <div>
                    <p className="text-2xl font-semibold text-violet-700">{loading ? "" : counts.active}</p>
                    <p className="text-sm text-slate-600">Active Now</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-200/80 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-white p-2.5 text-slate-500">
                    <CheckCheck size={20} />
                  </span>
                  <div>
                    <p className="text-2xl font-semibold text-slate-700">{loading ? "" : counts.completed}</p>
                    <p className="text-sm text-slate-600">Completed</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-indigo-100/80 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-white p-2.5 text-indigo-600">
                    <Coins size={20} />
                  </span>
                  <div>
                    <p className="text-2xl font-semibold text-indigo-700">{loading ? "" : counts.earned}</p>
                    <p className="text-sm text-slate-600">Tokens Earned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-30 mt-3 overflow-visible rounded-2xl bg-transparent p-3 backdrop-blur-sm sm:p-4">
            <div className="rounded-xl border border-slate-300 bg-transparent p-1">
              <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-4">
                {statusTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveFilter(tab.key)}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${activeFilter === tab.key
                      ? "bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] text-white shadow-md shadow-indigo-900/20"
                      : "text-slate-600 hover:bg-slate-100/70"
                      }`}
                  >
                    {tab.icon}
                    {tab.label}
                    {!loading && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${activeFilter === tab.key ? "bg-white/25 text-white" : "bg-slate-200/80 text-slate-600"
                          }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 grid gap-2 lg:grid-cols-[1.5fr_0.85fr_0.45fr]">
              <div className="relative">
                <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by title, person, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-300/90 bg-transparent pl-10 pr-3 text-xs text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="rounded-xl border border-slate-300/90 bg-transparent p-1">
                <div className="grid grid-cols-3 gap-1">
                  {roleTabs.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setRoleFilter(tab.key)}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${roleFilter === tab.key
                        ? "bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] text-white shadow-md shadow-indigo-900/20"
                        : "text-slate-600 hover:bg-slate-100/70"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <ThemedSelect
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { value: "newest", label: "Newest First" },
                  { value: "oldest", label: "Oldest First" },
                ]}
                ariaLabel="Sessions sort"
                icon={<ListFilter size={14} />}
                size="sm"
              />
            </div>

            <p className="mt-2 text-xs text-slate-500">{loading ? "" : `${filteredSessions.length} sessions found`}</p>
          </div>

          <div className="mt-3 rounded-2xl border border-slate-300 bg-transparent p-3 backdrop-blur-sm sm:p-4">
            {actionError ? (
              <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {actionError}
              </div>
            ) : null}
            <div className="space-y-2.5">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-14">
                  <img
                    src={tokenlyLogo}
                    alt="Loading"
                    className="h-9 w-9 animate-spin"
                    style={{ animationDuration: "1.2s", animationTimingFunction: "linear" }}
                  />
                </div>
              ) : filteredSessions.map((session) => {
                const isActive = session.status === "active";
                const isCompleted = session.status === "completed";
                const rating = ratingBySession[session.id] ?? 0;
                return (
                  <article
                    key={session.id}
                    className={`rounded-2xl border bg-transparent px-3 py-2 shadow-sm backdrop-blur-sm transition sm:px-4 ${isActive ? "border-indigo-500 ring-1 ring-indigo-300/80" : "border-slate-300"
                      }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${categoryChipClass(session.category)}`}>
                          {session.category}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusChipClass(session.status)}`}>
                          <Circle size={7} fill="currentColor" />
                          {session.status === "active"
                            ? "Active Now"
                            : session.status === "completed"
                              ? "Completed"
                              : "Upcoming"}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${session.role === "helping"
                            ? "bg-violet-100 text-violet-700"
                            : "bg-indigo-100 text-indigo-700"
                            }`}
                        >
                          {session.role === "helping" ? "Helping" : "Receiving Help"}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${session.credits > 0
                          ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                          : "border-sky-300 bg-sky-50 text-sky-700"
                          }`}
                      >
                        <Coins size={14} />
                        {session.credits > 0 ? `+${session.credits}` : session.credits}
                      </span>
                    </div>

                    <h3 className="mt-2.5 text-lg font-semibold leading-tight text-slate-900">{session.title}</h3>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <div className="inline-flex items-center gap-3">
                        <Avatar
                          name={session.otherParticipant.name}
                          imageUrl={session.otherParticipant.avatar}
                          className="h-8 w-8 rounded-full"
                          imageClassName="rounded-full"
                          fallbackClassName="bg-slate-100 text-xs font-bold text-slate-700"
                        />
                        <span>
                          {session.role === "helping" ? "Helping" : "Getting help from"}
                          <strong className="ml-1 text-slate-700">{session.otherParticipant.name}</strong>
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-2">
                        <Calendar size={16} />
                        {session.status === "completed" ? `Completed ${formatDate(session.datetime)}` : formatDate(session.datetime)}
                      </span>

                      {session.status !== "completed" ? (
                        <span className="inline-flex items-center gap-2">
                          <Clock3 size={16} />
                          {formatTime(session.datetime)}
                        </span>
                      ) : null}

                      <span className="inline-flex items-center gap-2">
                        <Clock3 size={16} />
                        {session.duration} min
                      </span>
                    </div>

                    <div className="mt-3 border-t border-slate-200 pt-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                          <Circle size={14} className="text-slate-300" />
                          {isCompleted && rating > 0 ? (
                            <>
                              <span className="text-amber-500">{"?".repeat(rating)}{"?".repeat(5 - rating)}</span>
                              <span>{sessionNote(session)}</span>
                            </>
                          ) : (
                            sessionNote(session)
                          )}
                        </p>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => session.requestId && handleViewRequest(session.requestId)}
                            disabled={!session.requestId}
                            className="rounded-lg border border-indigo-300/90 bg-transparent px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50/70 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-transparent"
                          >
                            View Request
                          </button>

                          {session.status === "upcoming" ? (
                            <button
                              type="button"
                              onClick={() => handleJoin(session.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-900/20 transition hover:brightness-105"
                            >
                              <Video size={16} />
                              Start Session
                            </button>
                          ) : null}

                          {isActive ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleJoin(session.id)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-105"
                              >
                                <Video size={16} />
                                Join Live
                              </button>
                              {session.role === "helping" ? (
                                <button
                                  type="button"
                                  onClick={() => handleMarkComplete(session.id)}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                                >
                                  <Check size={16} />
                                  Mark Complete
                                </button>
                              ) : null}
                            </>
                          ) : null}

                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                              <CheckCheck size={16} />
                              Done
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {!loading && filteredSessions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-400/90 bg-transparent p-8 text-center">
                <p className="text-base text-slate-500">No sessions found</p>
                <p className="mt-1 text-base text-slate-400">Try adjusting your filters</p>
              </div>
            ) : null}
          </div>
        </>
      </main>

      {showConfirmModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-300 bg-white/95 p-5 shadow-2xl">
            <h3 className="text-base font-semibold text-slate-900">Mark session as complete?</h3>
            <p className="mt-1 text-base text-slate-500">This will complete the session and transfer the tokens from the requester to the helper.</p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedSessionId(null);
                }}
                className="rounded-lg border border-slate-300 px-3.5 py-2 text-base font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmMarkComplete}
                className="rounded-lg bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] px-3.5 py-2 text-base font-semibold text-white transition hover:brightness-105"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SessionsPage;





