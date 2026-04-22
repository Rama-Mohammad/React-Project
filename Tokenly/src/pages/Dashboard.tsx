import { useEffect, useMemo, useState } from "react";
import { Check, Coins } from "lucide-react";
import AnalyticsSection from "../components/dashboard/AnalyticsSection";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import type { DashboardSectionId } from "../components/dashboard/DashboardSidebar";
import DashboardTopBar from "../components/dashboard/DashboardTopBar";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";
import ActivitySection from "../components/dashboard/ActivitySection";
import HeaderSection from "../components/dashboard/HeaderSection";
import InboxSection from "../components/dashboard/InboxSection";
import RequestsOverviewSection from "../components/dashboard/RequestsOverviewSection";
import SentRequestsSection from "../components/dashboard/SentRequestsSection";
import SessionsSection from "../components/dashboard/SessionsSection";
import { getInitials, toRelativeAge } from "../utils/dashboardUtils";
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

export default function Dashboard() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<DashboardSectionId>("overview");
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
  const { transactions, fetchTransactionsByUser } = useTransactions();

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

  const completedSessions = useMemo(
    () => rawSessions.filter((session) => session?.status === "completed"),
    [rawSessions]
  );

  const spent = useMemo(() => {
    if (!currentUserId) return 0;

    return completedSessions
      .filter((session) => session?.requester_id === currentUserId)
      .reduce((sum, session) => {
        const creditCost = Number(session?.request?.credit_cost ?? 0);
        return sum + creditCost;
      }, 0);
  }, [completedSessions, currentUserId]);

  const received = useMemo(() => {
    if (!currentUserId) return 0;

    return completedSessions
      .filter((session) => session?.helper_id === currentUserId)
      .reduce((sum, session) => {
        const creditCost = Number(session?.request?.credit_cost ?? 0);
        return sum + creditCost;
      }, 0);
  }, [completedSessions, currentUserId]);

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

  const tokenFlowData = useMemo(() => {
    return transactions
      .slice(0, 7)
      .reverse()
      .map((item, index) => {
        const createdAt = item.created_at ? new Date(item.created_at) : null;
        const label = createdAt && !Number.isNaN(createdAt.getTime())
          ? createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          : `Point ${index + 1}`;
        const isEarned = item.type === "earn" || item.type === "bonus";
        const amount = Math.abs(Number(item.amount ?? 0));

        return {
          label,
          earned: isEarned ? amount : 0,
          spent: item.type === "spend" ? amount : 0,
          net: isEarned ? amount : -amount,
        };
      });
  }, [transactions]);

  const weeklyActivityData = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      return {
        key,
        label: formatter.format(date),
        completed: 0,
        upcoming: 0,
      };
    });

    const dayMap = new Map(days.map((day) => [day.key, day]));

    rawSessions.forEach((session) => {
      const sourceDate = session?.scheduled_at ?? session?.created_at;
      if (!sourceDate) return;

      const date = new Date(sourceDate);
      if (Number.isNaN(date.getTime())) return;

      const key = date.toISOString().slice(0, 10);
      const day = dayMap.get(key);
      if (!day) return;

      if (session?.status === "completed") day.completed += 1;
      if (session?.status === "upcoming" || session?.status === "active") day.upcoming += 1;
    });

    return days;
  }, [rawSessions]);

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

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (!mounted) return;

      if (authError || !authData?.user?.id) {
        setCurrentUserId(null);
        setOpenRequests([]);
        setRequestsLoading(false);
        setRequestsError("Please sign in to view your dashboard.");
        return;
      }

      const userId = authData.user.id;
      setCurrentUserId(userId);

      void fetchDashboard(userId);
      void fetchTransactionsByUser(userId);

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

      // 🔥 FIX: avoid recalculating requestIds if empty
      if (ownRequests.length === 0) {
        setOpenRequests([]);
        setRequestsLoading(false);
        return;
      }

      const requestIds = ownRequests.map((item) => item.id);

      let offerCountMap: Record<string, number> = {};

      const { data: offersData, error: offersError } = await supabase
        .from("offers")
        .select("request_id")
        .in("request_id", requestIds);

      if (!mounted) return;

      if (!offersError && offersData) {
        offerCountMap = offersData.reduce<Record<string, number>>(
          (acc, row) => {
            const rid = row.request_id;
            if (!rid) return acc;
            acc[rid] = (acc[rid] ?? 0) + 1;
            return acc;
          },
          {}
        );
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
  const available = creditBalance;
  const total = available + spent;
  const availablePct = total > 0 ? Math.round((available / total) * 100) : 0;
  const avgRating = profile?.avg_rating ?? 0;
  const reviewCount = stats?.reviewCount ?? 0;
  const displayedAvgRating = !dashLoading ? avgRating : undefined;
  const handleSidebarSectionSelect = (sectionId: DashboardSectionId) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-transparent text-slate-900">
      <main className="relative mx-auto w-full max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 xl:grid-cols-[17.5rem_minmax(0,1fr)]">
          <DashboardSidebar
            mobileOpen={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
            activeSection={activeSection}
            onSectionSelect={handleSidebarSectionSelect}
            stretchOnDesktop
          />

          <div className="min-w-0">
            <DashboardTopBar
              onOpenMobileNav={() => setMobileNavOpen(true)}
            />

            {activeSection === "overview" ? (
              <HeaderSection
                className="xl:h-full"
                profileImageUrl={profile?.profile_image_url}
                fullName={fullName}
                initials={initials}
                dashLoading={dashLoading}
                displayedAvgRating={displayedAvgRating}
                reviewCount={reviewCount}
                creditBalance={creditBalance}
                available={available}
                spent={spent}
                received={received}
                total={total}
                availablePct={availablePct}
                stats={stats}
              />
            ) : null}

            {activeSection === "analytics" ? (
              <AnalyticsSection
                tokenFlowData={tokenFlowData}
                weeklyActivityData={weeklyActivityData}
              />
            ) : null}

            {activeSection === "sessions" ? (
              <SessionsSection
                dashLoading={dashLoading}
                activeSessionTab={activeSessionTab}
                onSessionTabChange={setActiveSessionTab}
                sessionTabCounts={sessionTabCounts}
                previewSessions={previewSessions}
                onMarkComplete={setPendingCompleteId}
              />
            ) : null}

            {activeSection === "inbox" ? (
              <div className="grid grid-cols-1 gap-4 xl:h-full xl:grid-cols-2">
                <InboxSection
                  title="Direct Requests"
                  count={incomingDirectRequests.length}
                  items={incomingDirectRequests}
                  emptyMessage="No direct requests yet."
                  accent="indigo"
                  actionLoadingId={directRequestActionId}
                  onAccept={handleOpenScheduleModal}
                  onReject={(id) => {
                    void handleRejectDirectRequest(id);
                  }}
                />

                <SentRequestsSection
                  items={sentDirectRequests}
                  emptyMessage="No sent direct requests yet."
                />
              </div>
            ) : null}

            {activeSection === "requests" ? (
              <div className="grid grid-cols-1 gap-4 xl:h-full">
                <RequestsOverviewSection
                  requestsLoading={requestsLoading}
                  requestsError={requestsError}
                  openRequests={openRequests}
                  deletingRequestId={deletingRequestId}
                  onDeleteRequest={setPendingDeleteRequestId}
                  dashLoading={dashLoading}
                  submittedOffers={submittedOffers}
                />
              </div>
            ) : null}

            {activeSection === "activity" ? (
              <ActivitySection
                dashLoading={dashLoading}
                transactions={transactions}
                activityPreview={activityPreview}
              />
            ) : null}
          </div>
        </div>
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
