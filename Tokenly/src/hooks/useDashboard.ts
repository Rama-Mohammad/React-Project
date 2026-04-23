import { useState } from "react";
import {
  getDashboardDirectRequests,
  getDashboardOffers,
  getDashboardProfile,
  getDashboardSentDirectRequests,
  getDashboardSessions,
  getDashboardStats,
  getDashboardHelpOfferRequests,
} from "../services/dashboardService";
import type {
  DashboardHelpOfferRequestItem,
  DashboardDirectRequestItem,
  DashboardOfferItem,
  DashboardProfile,
  DashboardSessionItem,
  DashboardStats,
} from "../types/dashboard";

type DashboardCacheState = {
  profile: DashboardProfile | null;
  stats: DashboardStats | null;
  rawSessions: any[];
  rawOffers: any[];
  rawIncomingDirectRequests: unknown[];
  rawSentDirectRequests: unknown[];
  rawHelpOfferRequests: unknown[];
};

const DASHBOARD_CACHE_KEY = "tokenly-dashboard-cache";

function readDashboardCache(): DashboardCacheState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(DASHBOARD_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DashboardCacheState;
  } catch {
    return null;
  }
}

function writeDashboardCache(value: DashboardCacheState) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(value));
  } catch {
    // Ignore cache write failures and keep live data flowing.
  }
}

export default function useDashboard() {
  const cached = readDashboardCache();
  const [profile, setProfile] = useState<DashboardProfile | null>(cached?.profile ?? null);
  const [stats, setStats] = useState<DashboardStats | null>(cached?.stats ?? null);
  const [rawSessions, setRawSessions] = useState<any[]>(cached?.rawSessions ?? []);
  const [rawOffers, setRawOffers] = useState<any[]>(cached?.rawOffers ?? []);
  const [rawIncomingDirectRequests, setRawIncomingDirectRequests] = useState<unknown[]>(
    cached?.rawIncomingDirectRequests ?? []
  );
  const [rawSentDirectRequests, setRawSentDirectRequests] = useState<unknown[]>(
    cached?.rawSentDirectRequests ?? []
  );
  const [rawHelpOfferRequests, setRawHelpOfferRequests] = useState<unknown[]>(
    cached?.rawHelpOfferRequests ?? []
  );
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState("");

  async function fetchDashboard(user_id: string) {
    if (!cached) setLoading(true);
    setError("");

    const [profileRes, statsData, sessionsRes] = await Promise.all([
      getDashboardProfile(user_id),
      getDashboardStats(user_id),
      getDashboardSessions(user_id),
    ]);

    if (profileRes.error) setError(profileRes.error.message);
    else setProfile(profileRes.data);

    setStats(statsData);
    setRawSessions(sessionsRes.data ?? []);
    setLoading(false);

    const criticalCache: DashboardCacheState = {
      profile: profileRes.error ? null : profileRes.data,
      stats: statsData,
      rawSessions: sessionsRes.data ?? [],
      rawOffers,
      rawIncomingDirectRequests,
      rawSentDirectRequests,
      rawHelpOfferRequests,
    };

    writeDashboardCache(criticalCache);

    void Promise.all([
      getDashboardOffers(user_id),
      getDashboardDirectRequests(user_id),
      getDashboardSentDirectRequests(user_id),
      getDashboardHelpOfferRequests(user_id),
    ]).then(([
      offersRes,
      directRequestsRes,
      sentDirectRequestsRes,
      helpOfferRequestsRes,
    ]) => {
      const nextRawOffers = offersRes.data ?? [];
      const nextIncomingDirectRequests = directRequestsRes.data ?? [];
      const nextSentDirectRequests = sentDirectRequestsRes.data ?? [];
      const nextHelpOfferRequests = helpOfferRequestsRes.data ?? [];

      setRawOffers(nextRawOffers);
      setRawIncomingDirectRequests(nextIncomingDirectRequests);
      setRawSentDirectRequests(nextSentDirectRequests);
      setRawHelpOfferRequests(nextHelpOfferRequests);

      writeDashboardCache({
        profile: profileRes.error ? null : profileRes.data,
        stats: statsData,
        rawSessions: sessionsRes.data ?? [],
        rawOffers: nextRawOffers,
        rawIncomingDirectRequests: nextIncomingDirectRequests,
        rawSentDirectRequests: nextSentDirectRequests,
        rawHelpOfferRequests: nextHelpOfferRequests,
      });
    });
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

        if (!s.request) {
          console.warn("Missing request for session", s.id);
        }

        const topic =
          s.request?.title ??
          helpOfferValue?.title ??
          directRequestValue?.title ??
          "Session";

        return {
          id: s.id,
          topic,
          skill: s.request?.category ?? helpOfferValue?.category ?? directRequestValue?.category ?? "General",
          status: uiStatus,
          role: (isHelper ? "Helping" : "Receiving help") as DashboardSessionItem["role"],
          person: otherPerson ?? "Unknown",
          personImageUrl: isHelper ? s.requester?.profile_image_url ?? undefined : s.helper?.profile_image_url ?? undefined,
          date: dateStr,
          duration: s.duration_minutes ? `${s.duration_minutes} min` : "--",
          credits: isHelper
            ? (s.request?.credit_cost ?? helpOfferValue?.credit_cost ?? directRequestValue?.credit_cost ?? 0)
            : -(s.request?.credit_cost ?? helpOfferValue?.credit_cost ?? directRequestValue?.credit_cost ?? 0),
          action: isHelper && dbStatus === "active" ? "Mark Complete" : undefined,
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
          personImageUrl: (requester as { profile_image_url?: string | null } | null)?.profile_image_url ?? undefined,
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
        personImageUrl: (helper as { profile_image_url?: string | null } | null)?.profile_image_url ?? undefined,
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

  function mapHelpOfferRequests(): DashboardHelpOfferRequestItem[] {
    return rawHelpOfferRequests.map((r: unknown) => {
      const req = r as Record<string, unknown>;
      const requesterRaw = req.requester as
        | { full_name?: string | null; username?: string | null; profile_image_url?: string | null }
        | Array<{ full_name?: string | null; username?: string | null; profile_image_url?: string | null }>
        | null;
      const requester = Array.isArray(requesterRaw) ? requesterRaw[0] : requesterRaw;

      const helpOfferRaw = req.help_offer as
        | { title?: string | null; credit_cost?: number | null; duration_minutes?: number | null }
        | Array<{ title?: string | null; credit_cost?: number | null; duration_minutes?: number | null }>
        | null;
      const helpOffer = Array.isArray(helpOfferRaw) ? helpOfferRaw[0] : helpOfferRaw;

      return {
        id: String(req.id ?? ""),
        title: helpOffer?.title ?? "Help Offer Request",
        personName: requester?.full_name ?? requester?.username ?? "User",
        personImageUrl: requester?.profile_image_url ?? undefined,
        message: String(req.message ?? ""),
        credits: Number(helpOffer?.credit_cost ?? 0),
        duration: helpOffer?.duration_minutes != null ? Number(helpOffer.duration_minutes) : null,
        age: toRelativeAge(req.created_at as string | null),
      };
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
    rawHelpOfferRequests,
    mapHelpOfferRequests,
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
