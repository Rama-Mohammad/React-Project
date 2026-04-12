import { useState } from "react";
import {
  getDashboardDirectRequests,
  getDashboardOffers,
  getDashboardProfile,
  getDashboardSentDirectRequests,
  getDashboardSessions,
  getDashboardStats,
} from "../services/dashboardService";
import type {
  DashboardDirectRequestItem,
  DashboardOfferItem,
  DashboardSessionItem,
} from "../types/dashboard";

export type DashboardProfile = {
  full_name: string;
  credit_balance: number;
  avg_rating: number;
  profile_image_url: string | null;
  username: string;
};

export type DashboardStats = {
  completedSessions: number;
  upcomingSessions: number;
  totalHelpGiven: number;
  totalHelpReceived: number;
  activeRequests: number;
  offersSubmitted: number;
  offersAccepted: number;
};

export default function useDashboard() {
  const [profile, setProfile] = useState<DashboardProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [rawSessions, setRawSessions] = useState<any[]>([]);
  const [rawOffers, setRawOffers] = useState<any[]>([]);
  const [rawIncomingDirectRequests, setRawIncomingDirectRequests] = useState<unknown[]>([]);
  const [rawSentDirectRequests, setRawSentDirectRequests] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchDashboard(user_id: string) {
    setLoading(true);
    setError("");

    const [
      profileRes,
      statsData,
      sessionsRes,
      offersRes,
      directRequestsRes,
      sentDirectRequestsRes,
    ] = await Promise.all([
      getDashboardProfile(user_id),
      getDashboardStats(user_id),
      getDashboardSessions(user_id),
      getDashboardOffers(user_id),
      getDashboardDirectRequests(user_id),
      getDashboardSentDirectRequests(user_id),
    ]);

    if (profileRes.error) setError(profileRes.error.message);
    else setProfile(profileRes.data);

    setStats(statsData);
    setRawSessions(sessionsRes.data ?? []);
    setRawOffers(offersRes.data ?? []);
    setRawIncomingDirectRequests(directRequestsRes.data ?? []);
    setRawSentDirectRequests(sentDirectRequestsRes.data ?? []);
    setLoading(false);
  }

  function mapSessions(user_id: string): DashboardSessionItem[] {
    return rawSessions
      .map((s) => {
        const isHelper = s.helper_id === user_id;
        const otherPerson = isHelper ? s.requester?.full_name : s.helper?.full_name;
        const dbStatus: string = s.status;
        const uiStatus: DashboardSessionItem["status"] =
          dbStatus === "upcoming"
            ? "Upcoming"
            : dbStatus === "active"
              ? "Active Now"
              : "Completed";

        const helpOfferRequestValue = Array.isArray(s.help_offer_request)
          ? s.help_offer_request[0] ?? null
          : s.help_offer_request ?? null;
        const helpOfferValue = Array.isArray(helpOfferRequestValue?.help_offer)
          ? helpOfferRequestValue.help_offer[0] ?? null
          : helpOfferRequestValue?.help_offer ?? null;
        const directRequestValue = Array.isArray(s.direct_request)
          ? s.direct_request[0] ?? null
          : s.direct_request ?? null;

        const scheduledDate = s.scheduled_at ? new Date(s.scheduled_at) : null;
        const dateStr = scheduledDate
          ? dbStatus === "completed"
            ? `Completed ${scheduledDate.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`
            : scheduledDate.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
          : "TBD";

        return {
          id: s.id,
          topic: s.request?.title ?? helpOfferValue?.title ?? directRequestValue?.title ?? "Session",
          skill: s.request?.category ?? helpOfferValue?.category ?? directRequestValue?.category ?? "General",
          status: uiStatus,
          role: (isHelper ? "Helping" : "Receiving help") as DashboardSessionItem["role"],
          person: otherPerson ?? "Unknown",
          date: dateStr,
          duration: s.duration_minutes ? `${s.duration_minutes} min` : "--",
          credits: 0,
          action: uiStatus !== "Completed" ? "Mark Complete" : undefined,
        };
      })
      .sort((a, b) => {
        const rank = (status: DashboardSessionItem["status"]) =>
          status === "Upcoming" ? 0 : status === "Active Now" ? 1 : 2;
        return rank(a.status) - rank(b.status);
      });
  }

  function mapOffers(): DashboardOfferItem[] {
    return rawOffers.map((o) => ({
      id: o.id,
      title: o.request?.title ?? "Request",
      status: o.status === "accepted" ? "Accepted" : "Pending",
      user: o.request?.requester?.full_name ?? "Unknown",
      age: toRelativeAge(o.created_at),
      credits: o.request?.credit_cost ?? 0,
    }));
  }

  function mapIncomingDirectRequests(): DashboardDirectRequestItem[] {
    return rawIncomingDirectRequests
      .map((r: unknown) => {
        const req = r as Record<string, unknown>;
        const requesterRaw = req.requester as
          | { full_name?: string | null; username?: string | null }
          | Array<{ full_name?: string | null; username?: string | null }>
          | null;
        const requester = Array.isArray(requesterRaw) ? requesterRaw[0] : requesterRaw;
        const statusValue = String(req.status ?? "pending");

        return {
          id: String(req.id ?? ""),
          title: String(req.title ?? ""),
          personName: requester?.full_name ?? requester?.username ?? "User",
          message: String(req.message ?? ""),
          credits: Number(req.credit_cost ?? 0),
          duration: req.duration_minutes != null ? Number(req.duration_minutes) : null,
          age: toRelativeAge(req.created_at as string | null),
          status:
            statusValue === "accepted"
              ? "accepted"
              : statusValue === "rejected"
                ? "rejected"
                : statusValue === "cancelled"
                  ? "cancelled"
                  : "pending",
          direction: "incoming",
        } satisfies DashboardDirectRequestItem;
      })
      .filter((item) => item.status === "pending");
  }

  function mapSentDirectRequests(): DashboardDirectRequestItem[] {
    return rawSentDirectRequests.map((r: unknown) => {
      const req = r as Record<string, unknown>;
      const helperRaw = req.helper as
        | { full_name?: string | null; username?: string | null }
        | Array<{ full_name?: string | null; username?: string | null }>
        | null;
      const helper = Array.isArray(helperRaw) ? helperRaw[0] : helperRaw;
      const statusValue = String(req.status ?? "pending");

      return {
        id: String(req.id ?? ""),
        title: String(req.title ?? ""),
        personName: helper?.full_name ?? helper?.username ?? "Helper",
        message: String(req.message ?? ""),
        credits: Number(req.credit_cost ?? 0),
        duration: req.duration_minutes != null ? Number(req.duration_minutes) : null,
        age: toRelativeAge(req.created_at as string | null),
        status:
          statusValue === "accepted"
            ? "accepted"
            : statusValue === "rejected"
              ? "rejected"
              : statusValue === "cancelled"
                ? "cancelled"
                : "pending",
        direction: "outgoing",
      } satisfies DashboardDirectRequestItem;
    });
  }

  return {
    profile,
    stats,
    rawSessions,
    rawOffers,
    rawIncomingDirectRequests,
    rawSentDirectRequests,
    loading,
    error,
    fetchDashboard,
    mapSessions,
    mapOffers,
    mapIncomingDirectRequests,
    mapSentDirectRequests,
  };
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
