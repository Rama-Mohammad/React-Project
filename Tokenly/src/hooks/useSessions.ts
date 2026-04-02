import { useState } from "react";
import type { Session, SessionStatus } from "../types/session";
import {
    createSession,
    getSessionById,
    getSessionsByUser,
    getSessionsByStatus,
    updateSessionStatus,
} from "../services/sessionService";

type UseSessionsResult = {
    session: Session | null;
    sessions: Session[];
    loading: boolean;
    error: string;
    fetchSessionById: (id: string) => Promise<void>;
    fetchSessionsByUser: (user_id: string) => Promise<void>;
    fetchSessionsByStatus: (user_id: string, status: SessionStatus) => Promise<void>;
    startSession: (data: {
        request_id: string;
        offer_id: string;
        helper_id: string;
        requester_id: string;
        scheduled_at?: string;
        duration_minutes?: number;
    }) => Promise<boolean>;
    changeSessionStatus: (id: string, status: SessionStatus) => Promise<boolean>;
};

export default function useSessions(): UseSessionsResult {
    const [session, setSession] = useState<Session | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function fetchSessionById(id: string) {
        setLoading(true);
        setError("");

        const { data, error } = await getSessionById(id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setSession(data);
        setLoading(false);
    }

    async function fetchSessionsByUser(user_id: string) {
        setLoading(true);
        setError("");

        const { data, error } = await getSessionsByUser(user_id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setSessions(data ?? []);
        setLoading(false);
    }

    async function fetchSessionsByStatus(user_id: string, status: SessionStatus) {
        setLoading(true);
        setError("");

        const { data, error } = await getSessionsByStatus(user_id, status);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setSessions(data ?? []);
        setLoading(false);
    }

    async function startSession(data: {
        request_id: string;
        offer_id: string;
        helper_id: string;
        requester_id: string;
        scheduled_at?: string;
        duration_minutes?: number;
    }) {
        setLoading(true);
        setError("");

        const { data: created, error } = await createSession(data);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setSession(created);
        setLoading(false);
        return true;
    }

    async function changeSessionStatus(id: string, status: SessionStatus) {
        setLoading(true);
        setError("");

        const { data, error } = await updateSessionStatus(id, status);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setSession(data);
        setSessions((prev) => prev.map((s) => (s.id === id ? data : s)));
        setLoading(false);
        return true;
    }

    return {
        session,
        sessions,
        loading,
        error,
        fetchSessionById,
        fetchSessionsByUser,
        fetchSessionsByStatus,
        startSession,
        changeSessionStatus,
    };
}