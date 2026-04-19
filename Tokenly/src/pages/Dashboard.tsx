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
  Trash2,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";
import RatingStars from "../components/common/RatingStars";
import Avatar from "../components/common/Avatar";
import { supabase } from "../lib/supabaseClient";
import { deleteRequest, getRequestsByUser } from "../services/requestService";
import { getSessionsAuthDebugContext, logSessionsQuery } from "../services/sessionDebug";
import { updateSessionStatus } from "../services/sessionService";
import useDashboard from "../hooks/useDashboard";
import useTransactions from "../hooks/useTransactions";
import type {
  DashboardRequestItem,
  DashboardSessionItem,
  SessionTabLabel,
} from "../types/dashboard";
import { acceptDirectRequest, rejectDirectRequest } from "../services/directRequestService";
import { acceptHelpOfferRequest, rejectHelpOfferRequest } from "../services/helpOfferService";
import tokenlyLogo from "../assets/favicon_tokenly.svg";
const sessionTabs: SessionTabLabel[] = ["All", "Upcoming", "Active", "Completed"];

function skillTone(skill: string) {
  if (skill === "Programming" || skill === "Web Development") return "bg-sky-100 text-sky-700";
  if (skill === "Database" || skill === "Statistics") return "bg-indigo-100 text-indigo-700";
  if (skill === "Algorithms" || skill === "System Design") return "bg-violet-100 text-violet-700";
  if (skill === "Machine Learning") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function statusTone(status: DashboardSessionItem["status"]) {
  if (status === "Upcoming") return "bg-blue-100 text-blue-700";
  if (status === "Active Now") return "bg-violet-100 text-violet-700";
  return "bg-slate-100 text-slate-600";
}

function toneClasses(type: string) {
  if (type === "earn" || type === "bonus") return "bg-violet-100 text-violet-700";
  return "bg-rose-100 text-rose-700";
}

function toRelativeAge(dateValue?: string | null) {
  if (!dateValue) return "just now";
  const date = new Date(dateValue);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (!Number.isFinite(diffMs) || diffMs < 0) return "just now";
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 60) return `${Math.max(1, minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getInitials(name: string | null | undefined) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Dashboard() {
  const [activeSessionTab, setActiveSessionTab] = useState<SessionTabLabel>("All");
  const [sessions, setSessions] = useState<DashboardSessionItem[]>([]);
  const [openRequests, setOpenRequests] = useState<DashboardRequestItem[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(null);
  const [pendingDeleteRequestId, setPendingDeleteRequestId] = useState<string | null>(null);
  const [pendingCompleteId, setPendingCompleteId] = useState<string | null>(null);
  const [transferToast, setTransferToast] = useState<{ credits: number } | null>(null);
  const [showCreditDetails, setShowCreditDetails] = useState(false);
  const [sessionActionError, setSessionActionError] = useState("");
  const [directRequestActionId, setDirectRequestActionId] = useState<string | null>(null);
  const [pendingScheduleId, setPendingScheduleId] = useState<string | null>(null);
  const [scheduledAtInput, setScheduledAtInput] = useState<string>("");
  const [pendingScheduleHelpOfferId, setPendingScheduleHelpOfferId] = useState<string | null>(null);
  const [helpOfferScheduledAtInput, setHelpOfferScheduledAtInput] = useState<string>("");
  const [helpOfferRequestActionId, setHelpOfferRequestActionId] = useState<string | null>(null);

  const {
    profile,
    stats,
    loading: dashLoading,
    fetchDashboard,
    mapSessions,
    mapOffers,
    mapIncomingDirectRequests,
    mapSentDirectRequests,
    rawSessions,
    rawOffers,
    rawIncomingDirectRequests,
    rawSentDirectRequests,
    rawHelpOfferRequests,
    mapHelpOfferRequests,
  } = useDashboard();
  const { transactions, summary, fetchTransactionsByUser, fetchCreditSummary } = useTransactions();

  const available = summary?.available ?? profile?.credit_balance ?? 0;
  const spent = summary?.spent ?? 0;
  const total = available + spent;
  const availablePct = total > 0 ? Math.round((available / total) * 100) : 0;

  const submittedOffers = useMemo(
    () => (currentUserId ? mapOffers() : []),
    [rawOffers, currentUserId]
  );

  const incomingDirectRequests = useMemo(
    () => (currentUserId ? mapIncomingDirectRequests() : []),
    [rawIncomingDirectRequests, currentUserId]
  );

  const incomingHelpOfferRequests = useMemo(
    () => (currentUserId ? mapHelpOfferRequests() : []),
    [rawHelpOfferRequests, currentUserId]
  );

  const sentDirectRequests = useMemo(
    () => (currentUserId ? mapSentDirectRequests() : []),
    [rawSentDirectRequests, currentUserId]
  );

  const sessionTabCounts = useMemo(
    () => ({
      All: sessions.length,
      Upcoming: sessions.filter((s) => s.status === "Upcoming").length,
      Active: sessions.filter((s) => s.status === "Active Now").length,
      Completed: sessions.filter((s) => s.status === "Completed").length,
    }),
    [sessions]
  );

  const visibleSessions = useMemo(() => {
    if (activeSessionTab === "All") return sessions;
    if (activeSessionTab === "Upcoming") return sessions.filter((s) => s.status === "Upcoming");
    if (activeSessionTab === "Active") return sessions.filter((s) => s.status === "Active Now");
    return sessions.filter((s) => s.status === "Completed");
  }, [activeSessionTab, sessions]);

  const previewSessions = useMemo(() => visibleSessions.slice(0, 3), [visibleSessions]);

  const activityPreview = useMemo(
    () => transactions.slice(0, 3),
    [transactions]
  );

  const handleOpenScheduleModal = (id: string) => {
    setScheduledAtInput("");
    setPendingScheduleId(id);
  };

  const handleConfirmAcceptDirectRequest = async () => {
    if (!pendingScheduleId || !scheduledAtInput) return;
    const id = pendingScheduleId;
    setPendingScheduleId(null);
    setDirectRequestActionId(id);
    await acceptDirectRequest(id, new Date(scheduledAtInput).toISOString());
    if (currentUserId) void fetchDashboard(currentUserId);
    setDirectRequestActionId(null);
  };

  const handleOpenScheduleHelpOfferModal = (id: string) => {
    setHelpOfferScheduledAtInput("");
    setPendingScheduleHelpOfferId(id);
  };

  const handleConfirmAcceptHelpOfferRequest = async () => {
    if (!pendingScheduleHelpOfferId || !helpOfferScheduledAtInput) return;
    const id = pendingScheduleHelpOfferId;
    setPendingScheduleHelpOfferId(null);
    setHelpOfferRequestActionId(id);
    await acceptHelpOfferRequest(id, new Date(helpOfferScheduledAtInput).toISOString());
    if (currentUserId) void fetchDashboard(currentUserId);
    setHelpOfferRequestActionId(null);
  };

  const handleRejectHelpOfferRequest = async (id: string) => {
    setHelpOfferRequestActionId(id);
    await rejectHelpOfferRequest(id);
    if (currentUserId) void fetchDashboard(currentUserId);
    setHelpOfferRequestActionId(null);
  };

  const handleRejectDirectRequest = async (id: string) => {
    setDirectRequestActionId(id);
    await rejectDirectRequest(id);
    if (currentUserId) void fetchDashboard(currentUserId);
    setDirectRequestActionId(null);
  };

  useEffect(() => {
    if (!transferToast) return;
    const timer = window.setTimeout(() => setTransferToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [transferToast]);

  useEffect(() => {
    let mounted = true;

    void (async () => {
      setRequestsLoading(true);
      setRequestsError("");

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (!mounted) return;

      if (authError || !authData.user?.id) {
        setCurrentUserId(null);
        setOpenRequests([]);
        setRequestsLoading(false);
        setRequestsError("Please sign in to view your dashboard.");
        return;
      }

      const userId = authData.user.id;
      setCurrentUserId(userId);

      await Promise.all([
        fetchDashboard(userId),
        fetchTransactionsByUser(userId),
        fetchCreditSummary(userId),
      ]);

      if (!mounted) return;

      const { data, error } = await getRequestsByUser(userId);
      if (!mounted) return;

      if (error) {
        setOpenRequests([]);
        setRequestsLoading(false);
        setRequestsError(error.message ?? "Could not load your requests.");
        return;
      }

      const ownRequests = (data ?? []).filter((item) => item.status === "open");
      const requestIds = ownRequests.map((item) => item.id);

      let offerCountMap: Record<string, number> = {};
      if (requestIds.length > 0) {
        const { data: offersData, error: offersError } = await supabase
          .from("offers")
          .select("request_id")
          .in("request_id", requestIds);

        if (!mounted) return;
        if (!offersError) {
          offerCountMap = (offersData ?? []).reduce<Record<string, number>>((acc, row) => {
            const rid = row.request_id as string | undefined;
            if (!rid) return acc;
            acc[rid] = (acc[rid] ?? 0) + 1;
            return acc;
          }, {});
        }
      }

      const mapped: DashboardRequestItem[] = ownRequests.map((item) => ({
        id: item.id,
        title: item.title,
        urgency: item.urgency
          ? `${item.urgency.charAt(0).toUpperCase()}${item.urgency.slice(1)}`
          : "Low",
        offers: offerCountMap[item.id] ?? 0,
        age: toRelativeAge(item.created_at),
        credits: item.credit_cost ?? 0,
      }));

      setOpenRequests(mapped);
      setRequestsLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (currentUserId) {
      setSessions(mapSessions(currentUserId));
    }
  }, [currentUserId, rawSessions]);

  const handleMarkComplete = async (id: string) => {
    setSessionActionError("");
    const { session, user, authError } = await getSessionsAuthDebugContext();
    const payload = { id, status: "completed" };

    logSessionsQuery("Dashboard handleMarkComplete start", {
      session,
      user,
      payload,
      error: authError,
    });

    if (authError) {
      setSessionActionError(authError.message ?? "You need to be signed in to complete this session.");
      return false;
    }

    const { error } = await updateSessionStatus(id, "completed");

    logSessionsQuery("Dashboard handleMarkComplete result", {
      session,
      user,
      payload,
      error,
    });

    if (error) {
      setSessionActionError(error.message ?? "Could not complete this session.");
      return false;
    }

    if (currentUserId) {
      await Promise.all([
        fetchDashboard(currentUserId),
        fetchTransactionsByUser(currentUserId),
        fetchCreditSummary(currentUserId),
      ]);
    }

    setSessions((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          status: "Completed",
          date: `Completed ${item.date}`,
          action: undefined,
        };
      })
    );

    return true;
  };

  const pendingSession = pendingCompleteId
    ? sessions.find((item) => item.id === pendingCompleteId) ?? null
    : null;

  const handleDeleteMyRequest = async (requestId: string) => {
    if (!currentUserId) return;

    setDeletingRequestId(requestId);
    try {
      const { error } = await deleteRequest(requestId, currentUserId);
      if (error) {
        setRequestsError(error.message ?? "Could not delete this request.");
        return;
      }
      setOpenRequests((prev) => prev.filter((item) => item.id !== requestId));
      setPendingDeleteRequestId(null);
    } finally {
      setDeletingRequestId(null);
    }
  };

  const pendingDeleteRequest = pendingDeleteRequestId
    ? openRequests.find((item) => item.id === pendingDeleteRequestId) ?? null
    : null;

  const fullName = profile?.full_name;
  const initials = getInitials(profile?.full_name);
  const creditBalance = profile?.credit_balance ?? 0;
  const avgRating = profile?.avg_rating ?? 0;
  const reviewCount = stats ? stats.completedSessions : 0;

  return (
    <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">

      <main className="mx-auto w-full max-w-355 px-4 py-6 sm:px-6 lg:px-8">
        {/* -- Header / profile strip -- */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-transparent p-5 shadow-none sm:p-6">
          <div className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full bg-indigo-300/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-violet-300/20 blur-3xl" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[linear-gradient(145deg,#bae6fd_0%,#a7f3d0_100%)] p-0.5">
                {profile?.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt={fullName}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white text-sm font-semibold text-slate-700">
                    {dashLoading ? "" : initials}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-slate-500">Welcome back</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {dashLoading ? "" : fullName}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                  {!dashLoading && (
                    <>
                      <RatingStars value={Math.round(avgRating)} />
                      <span className="text-sm text-slate-500">{avgRating.toFixed(1)} rating</span>
                    </>
                  )}
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
                to="/request/new"
                className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-900/20 transition hover:brightness-105"
              >
                <Plus size={17} />
                Post Request
              </Link>
            </div>
          </div>

          {/* -- Stats row -- */}
          <div className="relative mt-5 grid grid-cols-1 items-start gap-3 xl:grid-cols-[1.8fr_1fr_1fr_1fr_1fr]">
            {/* Token balance card */}
            <article className="rounded-2xl border border-indigo-300/80 bg-transparent p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-700">
                    <Coins size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Token Balance</p>
                    <p className="text-2xl font-semibold leading-none">
                      {dashLoading ? (
                        <span className="inline-block h-8 w-16 animate-pulse rounded-lg bg-slate-200" />
                      ) : (
                        <>
                          {creditBalance}{" "}
                          <span className="text-lg font-normal text-slate-500">tokens</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreditDetails((prev) => !prev)}
                  className="inline-flex items-center gap-2 text-sm text-slate-500"
                >
                  {showCreditDetails ? "Hide" : "Details"}
                  <ChevronDown
                    size={16}
                    className={showCreditDetails ? "rotate-180 transition" : "transition"}
                  />
                </button>
              </div>

              <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                <span>Available vs Spent</span>
                <span>{total} total tracked</span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/80">
                <div
                  className="h-full bg-[linear-gradient(90deg,#93c5fd_0%,#93c5fd_58%,#c4b5fd_58%,#c4b5fd_100%)]"
                  style={{ width: `${availablePct}%` }}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-6 text-sm">
                <span className="inline-flex items-center gap-2 text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-300" />
                  Available <strong className="text-slate-900">{dashLoading ? "—" : available}</strong>
                </span>
                <span className="inline-flex items-center gap-2 text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-violet-300" />
                  Spent <strong className="text-slate-900">{dashLoading ? "—" : spent}</strong>
                </span>
              </div>

              {showCreditDetails ? (
                <>
                  <div className="my-4 h-px bg-indigo-200/70" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <article className="rounded-2xl border border-indigo-200/70 bg-indigo-100/45 px-4 py-3">
                      <p className="text-sm font-semibold text-indigo-700">As Helper</p>
                      <p className="mt-1 text-4xl font-semibold leading-none text-indigo-700">
                        {stats?.totalHelpGiven ?? ""}
                      </p>
                      <p className="mt-1 text-sm text-indigo-700">sessions completed</p>
                    </article>
                    <article className="rounded-2xl border border-sky-200/70 bg-sky-100/45 px-4 py-3">
                      <p className="text-sm font-semibold text-sky-700">As Requester</p>
                      <p className="mt-1 text-4xl font-semibold leading-none text-sky-700">
                        {stats?.totalHelpReceived ?? ""}
                      </p>
                      <p className="mt-1 text-sm text-sky-700">sessions received</p>
                    </article>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-2xl border border-indigo-200/70 bg-indigo-50/80 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-700">Average Rating as Helper</p>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <RatingStars value={Math.round(avgRating)} />
                      <span className="text-lg font-semibold leading-none">{avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                </>
              ) : null}
            </article>

            {/* Sessions done */}
            <article className="rounded-2xl border border-slate-300/80 bg-transparent p-4 text-center sm:text-left">
              <div className="mx-auto sm:mx-0 w-fit rounded-2xl bg-sky-100 p-3 text-sky-700">
                <Check size={20} />
              </div>
              <p className="mt-4 text-2xl font-semibold">
                {dashLoading ? "" : stats?.completedSessions ?? 0}
              </p>
              Sessions Completed
              <p className="mt-2 text-sm text-slate-500">
                {!dashLoading && stats ? `${stats.totalHelpGiven} as helper · ${stats.totalHelpReceived} as requester` : ""}
              </p>
            </article>

            {/* Requests posted */}
            <article className="rounded-2xl border border-slate-300/80 bg-transparent p-4 text-center sm:text-left">
            <div className="mx-auto sm:mx-0 w-fit rounded-2xl bg-violet-100 p-3 text-violet-700">
                <MessageCircle size={20} />
              </div>
              <p className="mt-4 text-2xl font-semibold">
                {dashLoading ? "" : stats?.activeRequests ?? 0}
              </p>
              <p className="text-sm text-slate-700">Requests Posted</p>
              <p className="mt-2 text-sm text-slate-500">
                {!dashLoading && stats ? "Total help requests" : ""}</p>            
          </article>

            {/* Offers submitted */}
            <article className="rounded-2xl border border-slate-300/80 bg-transparent p-4 text-center sm:text-left">
                <div className="mx-auto sm:mx-0 w-fit rounded-2xl bg-indigo-100 p-3 text-indigo-700">
                <Send size={20} />
              </div>
              <p className="mt-4 text-2xl font-semibold">
                {dashLoading ? "" : stats?.offersSubmitted ?? 0}
              </p>
              <p className="text-sm text-slate-700">Offers Submitted</p>
              <p className="mt-2 text-sm text-slate-500">
                {dashLoading ? "" : stats?.offersSubmitted ?? 0}
              </p>
            </article>

            {/* Avg rating */}
            <article className="rounded-2xl border border-slate-300/80 bg-transparent p-4 text-center sm:text-left">
            <div className="mx-auto sm:mx-0 w-fit rounded-2xl bg-amber-100 p-3 text-amber-700">
                <Star size={20} />
              </div>
              <p className="mt-4 text-2xl font-semibold">
                {dashLoading ? "" : avgRating.toFixed(1)}
              </p>
              <p className="text-sm text-slate-700">Avg. Rating</p>
              <p className="mt-2 text-sm text-slate-500">{dashLoading ? "" : `From ${reviewCount} sessions`}</p>
            </article>
          </div>
        </section>

        {/* -- Sessions -- */}
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

          <div className="relative mt-3 w-full overflow-x-auto">
  <div className="inline-flex min-w-max rounded-2xl bg-white/75 p-1">
            {sessionTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveSessionTab(tab)}
                className={`mx-0.5 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs transition ${activeSessionTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                {tab}
                {!dashLoading && (
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-500">
                    {sessionTabCounts[tab]}
                  </span>
                )}
              </button>
            ))}
          </div>
          </div>

          <div className="relative mt-3 space-y-2.5">
            {dashLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10">
                <img src={tokenlyLogo} alt="Loading" className="h-9 w-9 animate-spin" style={{ animationDuration: "1.2s", animationTimingFunction: "linear" }} />
              </div>
            ) : previewSessions.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
                No sessions in this tab yet.
              </div>
            ) : (
              previewSessions.map((item) => (
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
                        className={`rounded-full px-2.5 py-0.5 font-medium ${item.role === "Helping"
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
                        <Avatar
                          name={item.person}
                          imageUrl={item.personImageUrl}
                          className="h-6 w-6 rounded-full"
                          imageClassName="rounded-full"
                          fallbackClassName="bg-slate-100 text-[10px] font-bold text-slate-700"
                        />
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
                      {item.rating ? <RatingStars value={item.rating} /> : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end lg:self-center">
                    <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-0.5 text-xs font-semibold text-indigo-700">
                      <Coins size={12} />
                      {item.credits > 0 ? `+${item.credits}` : item.credits === 0 ? "0" : item.credits}
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
              ))
            )}
          </div>
        </section>

        {/* -- Direct Requests (incoming from users who want this helper) -- */}
        {/* Only shown when there are pending direct requests – disappears once all resolved */}
        {incomingDirectRequests.length > 0 ? (
          <section className="mt-4 rounded-3xl border border-indigo-200/70 bg-transparent shadow-none">
            <div className="flex items-center justify-between border-b border-indigo-200/70 p-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Direct Requests</h3>
                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                  {incomingDirectRequests.length} pending
                </span>
              </div>
            </div>
            <div className="space-y-2 p-4">
              {incomingDirectRequests.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-300/80 bg-transparent p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-1 items-start gap-3">
                      <Avatar
                        name={item.personName}
                        imageUrl={item.personImageUrl}
                        className="h-10 w-10 rounded-full shrink-0"
                        imageClassName="rounded-full"
                        fallbackClassName="bg-indigo-100 text-xs font-semibold text-indigo-700"
                      />
                      <div className="flex-1">
                        <p className="text-base font-semibold leading-tight text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          From {item.personName}
                          {item.duration ? ` • ${item.duration} min` : ""}
                          {item.credits ? ` • ${item.credits} credits` : ""}
                          {" • "}{item.age}
                        </p>
                        {item.message ? (
                          <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.message}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={directRequestActionId === item.id}
                      onClick={() => handleOpenScheduleModal(item.id)}
                      className="inline-flex h-8 items-center rounded-xl bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] px-3 text-xs font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {directRequestActionId === item.id ? "Accepting..." : "Accept"}
                    </button>
                    <button
                      type="button"
                      disabled={directRequestActionId === item.id}
                      onClick={() => void handleRejectDirectRequest(item.id)}
                      className="inline-flex h-8 items-center rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* -- Help Offer Requests (incoming from users who want the helper's posted offer) -- */}
        {incomingHelpOfferRequests.length > 0 ? (
          <section className="mt-4 rounded-3xl border border-violet-200/70 bg-transparent shadow-none">
            <div className="flex items-center justify-between border-b border-violet-200/70 p-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Help Offer Requests</h3>
                <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700">
                  {incomingHelpOfferRequests.length} pending
                </span>
              </div>
            </div>
            <div className="space-y-2 p-4">
              {incomingHelpOfferRequests.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-300/80 bg-transparent p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-1 items-start gap-3">
                      <Avatar
                        name={item.personName}
                        imageUrl={item.personImageUrl}
                        className="h-10 w-10 rounded-full shrink-0"
                        imageClassName="rounded-full"
                        fallbackClassName="bg-violet-100 text-xs font-semibold text-violet-700"
                      />
                      <div className="flex-1">
                        <p className="text-base font-semibold leading-tight text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          From {item.personName}
                          {item.duration ? ` • ${item.duration} min` : ""}
                          {item.credits ? ` • ${item.credits} credits` : ""}
                          {" • "}{item.age}
                        </p>
                        {item.message ? (
                          <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.message}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={helpOfferRequestActionId === item.id}
                      onClick={() => handleOpenScheduleHelpOfferModal(item.id)}
                      className="inline-flex h-8 items-center rounded-xl bg-[linear-gradient(135deg,#7c3aed_0%,#8b5cf6_100%)] px-3 text-xs font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {helpOfferRequestActionId === item.id ? "Accepting..." : "Accept"}
                    </button>
                    <button
                      type="button"
                      disabled={helpOfferRequestActionId === item.id}
                      onClick={() => void handleRejectHelpOfferRequest(item.id)}
                      className="inline-flex h-8 items-center rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {sentDirectRequests.length > 0 ? (
          <section className="mt-4 rounded-3xl border border-slate-300/80 bg-transparent shadow-none">
            <div className="flex items-center justify-between border-b border-slate-300/80 p-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Sent Direct Requests</h3>
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  {sentDirectRequests.length} total
                </span>
              </div>
            </div>
            <div className="space-y-2 p-4">
              {sentDirectRequests.map((item) => {
                const statusClasses =
                  item.status === "accepted"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : item.status === "rejected"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : item.status === "cancelled"
                        ? "bg-slate-100 text-slate-600 border-slate-200"
                        : "bg-amber-50 text-amber-700 border-amber-200";

                const statusLabel =
                  item.status === "accepted"
                    ? "Accepted"
                    : item.status === "rejected"
                      ? "Denied"
                      : item.status === "cancelled"
                        ? "Cancelled"
                        : "Pending";

                return (
                  <div key={item.id} className="rounded-2xl border border-slate-300/80 bg-transparent p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-1 items-start gap-3">
                        <Avatar
                          name={item.personName}
                          imageUrl={item.personImageUrl}
                          className="h-10 w-10 rounded-full shrink-0"
                          imageClassName="rounded-full"
                          fallbackClassName="bg-indigo-100 text-xs font-semibold text-indigo-700"
                        />
                        <div className="flex-1">
                          <p className="text-base font-semibold leading-tight text-slate-900">{item.title}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            Sent to {item.personName}
                            {item.duration ? ` • ${item.duration} min` : ""}
                            {item.credits ? ` • ${item.credits} credits` : ""}
                            {" • "}{item.age}
                          </p>
                          {item.message ? (
                            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.message}</p>
                          ) : null}
                        </div>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses}`}>
                        {statusLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* -- Open Requests + Submitted Offers -- */}
        <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
          <article className="rounded-3xl border border-slate-300/80 bg-transparent shadow-none">
            <div className="flex items-center justify-between border-b border-slate-300/80 p-4">
              <h3 className="text-lg font-semibold">Open Requests</h3>
              <Link to="/request/new" className="text-sm font-semibold text-indigo-700">
                + New
              </Link>
            </div>
            <div className="space-y-2 p-4">
              {requestsLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-8">
                  <img src={tokenlyLogo} alt="Loading" className="h-9 w-9 animate-spin" style={{ animationDuration: "1.2s", animationTimingFunction: "linear" }} />
                </div>
              ) : requestsError ? (
                <div className="rounded-2xl border border-rose-300/80 bg-rose-50/80 p-4 text-sm text-rose-700">
                  {requestsError}
                </div>
              ) : openRequests.length === 0 ? (
                <div className="rounded-2xl border border-slate-300/80 bg-transparent p-4 text-sm text-slate-600">
                  You don't have any open requests yet.
                </div>
              ) : (
                openRequests.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-300/80 bg-transparent p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base leading-tight">{item.title}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                          <span className="rounded-full bg-rose-100 px-3 py-0.5 text-rose-700">
                            {item.urgency}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MessageCircle size={14} />
                            {item.offers} offers
                          </span>
                          <span>{item.age}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-sm font-semibold text-indigo-700">
                          <Coins size={14} />
                          {item.credits}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPendingDeleteRequestId(item.id)}
                          disabled={deletingRequestId === item.id}
                          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${deletingRequestId === item.id
                            ? "cursor-not-allowed border-rose-200 bg-rose-100 text-rose-400"
                            : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                            }`}
                        >
                          <Trash2 size={12} />
                          {deletingRequestId === item.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-300/80 bg-transparent shadow-none">
            <div className="flex items-center justify-between border-b border-slate-300/80 p-4">
              <h3 className="text-lg font-semibold">Submitted Offers</h3>
              <Link to="/explore?tab=requests#explore-tabs-bar" className="text-sm font-semibold text-indigo-700">
                Browse requests
              </Link>
            </div>
            <div className="space-y-2 p-4">
              {dashLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-8">
                  <img src={tokenlyLogo} alt="Loading" className="h-9 w-9 animate-spin" style={{ animationDuration: "1.2s", animationTimingFunction: "linear" }} />
                </div>
              ) : submittedOffers.length === 0 ? (
                <div className="rounded-2xl border border-slate-300/80 bg-transparent p-4 text-sm text-slate-600">
                  You haven't submitted any offers yet.
                </div>
              ) : (
                submittedOffers.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-300/80 bg-transparent p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base leading-tight">{item.title}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                          <span
                            className={`rounded-full px-3 py-0.5 ${item.status === "Accepted"
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
                ))
              )}
            </div>
          </article>
        </section>

        {/* -- Activity Feed -- */}
        <section className="relative mt-4 overflow-hidden rounded-3xl border border-indigo-200/70 bg-[linear-gradient(140deg,rgba(238,242,255,0.95)_0%,rgba(237,233,254,0.92)_45%,rgba(224,231,255,0.95)_100%)] shadow-[0_14px_34px_-26px_rgba(99,102,241,0.45)]">
          <div className="pointer-events-none absolute -top-16 right-6 h-40 w-40 rounded-full bg-indigo-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-10 h-36 w-36 rounded-full bg-violet-300/20 blur-3xl" />

          <div className="relative flex items-center justify-between border-b border-indigo-200/70 p-4">
            <h3 className="text-lg font-semibold">Activity</h3>
            {transactions.length > 3 ? (
              <Link
                to="/activity"
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-300/70 bg-white/80 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-white"
              >
                View more
              </Link>
            ) : null}
          </div>

          <div className="relative">
            {dashLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-8">
                <img src={tokenlyLogo} alt="Loading" className="h-9 w-9 animate-spin" style={{ animationDuration: "1.2s", animationTimingFunction: "linear" }} />
              </div>
            ) : activityPreview.length === 0 ? (
              <div className="px-4 py-5 text-sm text-slate-500">No activity yet.</div>
            ) : (
              activityPreview.map((item) => (
                <article
                  key={item.id}
                  className="flex items-center justify-between border-b border-indigo-200/70 px-4 py-5 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-3 ${toneClasses(item.type)}`}>
                      {item.type === "earn" || item.type === "bonus" ? (
                        <Plus size={15} />
                      ) : (
                        <Coins size={15} />
                      )}
                    </div>
                    <div>
                      <p className="text-base leading-tight">{item.description ?? "Token transaction"}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {toRelativeAge(item.created_at)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${item.type === "earn" || item.type === "bonus"
                      ? "bg-violet-100 text-violet-700"
                      : "bg-rose-100 text-rose-700"
                      }`}
                  >
                    <Coins size={14} />
                    {item.type === "earn" || item.type === "bonus" ? `+${item.amount}` : `-${item.amount}`}
                  </span>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      {/* -- Token transfer toast -- */}
      {transferToast ? (
        <div className="pointer-events-none fixed bottom-5 right-5 z-60">
          <div className="flex min-w-65 items-center gap-2.5 rounded-2xl border border-indigo-300 bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] px-4 py-3 text-white shadow-xl shadow-indigo-900/20">
            <div className="rounded-full bg-white/20 p-1.5 text-white">
              <Coins size={15} />
            </div>
            <div>
              <p className="text-base font-semibold leading-tight">
                {transferToast.credits} tokens released
              </p>
              <p className="mt-0.5 text-sm text-indigo-100">Session marked as complete</p>
            </div>
          </div>
        </div>
      ) : null}

      {sessionActionError ? (
        <div className="pointer-events-none fixed bottom-5 left-5 z-60">
          <div className="min-w-65 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-xl">
            {sessionActionError}
          </div>
        </div>
      ) : null}

      {/* -- Mark complete confirm modal -- */}
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
                <p className="mt-0.5 text-sm text-slate-500">This will complete the session and move the requester&apos;s tokens to the helper.</p>
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
              </div>
            </div>
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
                onClick={async () => {
                  const succeeded = await handleMarkComplete(pendingSession.id);
                  if (!succeeded) return;
                  setPendingCompleteId(null);
                  setTransferToast({ credits: Math.abs(pendingSession.credits) });
                }}
                className="rounded-xl bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] px-3 py-2 text-sm font-semibold text-white transition hover:brightness-105"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmDeleteModal
        isOpen={Boolean(pendingDeleteRequest)}
        title="Delete this request?"
        message="This request will be removed from your dashboard."
        itemName={pendingDeleteRequest?.title}
        details={pendingDeleteRequest ? `${pendingDeleteRequest.offers} offers • ${pendingDeleteRequest.credits} tokens` : undefined}
        confirmLabel="Delete Request"
        loading={Boolean(pendingDeleteRequest && deletingRequestId === pendingDeleteRequest.id)}
        onCancel={() => setPendingDeleteRequestId(null)}
        onConfirm={() => {
          if (!pendingDeleteRequest) return;
          return handleDeleteMyRequest(pendingDeleteRequest.id);
        }}
      />

      {/* -- Schedule Direct Request Modal -- */}
      {pendingScheduleId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm"
            onClick={() => setPendingScheduleId(null)}
            aria-label="Close"
          />
          <div className="relative w-full max-w-md rounded-2xl border border-indigo-100 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Schedule Session</h3>
            <p className="mt-1 text-sm text-slate-500">
              Pick a date and time to meet with the requester.
            </p>
            <input
              type="datetime-local"
              value={scheduledAtInput}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => setScheduledAtInput(e.target.value)}
              className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
            />
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPendingScheduleId(null)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!scheduledAtInput}
                onClick={() => void handleConfirmAcceptDirectRequest()}
                className="rounded-xl bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] px-3 py-2 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm & Accept
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* -- Schedule Help Offer Request Modal -- */}
      {pendingScheduleHelpOfferId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm"
            onClick={() => setPendingScheduleHelpOfferId(null)}
            aria-label="Close"
          />
          <div className="relative w-full max-w-md rounded-2xl border border-violet-100 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Schedule Session</h3>
            <p className="mt-1 text-sm text-slate-500">
              Pick a date and time to meet with the requester.
            </p>
            <input
              type="datetime-local"
              value={helpOfferScheduledAtInput}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => setHelpOfferScheduledAtInput(e.target.value)}
              className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none"
            />
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPendingScheduleHelpOfferId(null)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!helpOfferScheduledAtInput}
                onClick={() => void handleConfirmAcceptHelpOfferRequest()}
                className="rounded-xl bg-[linear-gradient(135deg,#7c3aed_0%,#8b5cf6_100%)] px-3 py-2 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm & Accept
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
