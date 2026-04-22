import { useState } from "react";
import type { SessionStartInput, SessionStatus, UseSessionsResult } from "../types/session";
import type { Session } from "../types/session";
import {
    createSession,
    getSessionById,
    getSessionsByUser,
    getSessionsByStatus,
    updateSessionStatus,
} from "../services/sessionService";

function mapSession(db: any): Session {
    return {
        id: db.id,
        title: db.title,
        category: db.category,
        status: db.status,
        role: db.helper_id ? "helping" : "receiving",

        otherParticipant: {
            id: db.requester_id,
            name: db.requester?.name ?? "Unknown",
            avatar: db.requester?.avatar,
        },

        datetime: db.scheduled_at
            ? new Date(db.scheduled_at)
            : new Date(),

        duration: db.duration_minutes ?? 0,
        credits: db.credits ?? 0,

        description: db.request?.description,
        requestId: db.request?.id,
    };
}

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

        setSession(mapSession(data)); 
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

    async function startSession(data: SessionStartInput) {
        setLoading(true);
        setError("");
        const { data: created, error } = await createSession(data);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        // Store the created session so callers can navigate to it
        if (created) setSession(created as unknown as Session);
        setLoading(false);
        return true;
    }

    async function changeSessionStatus(id: string, status: SessionStatus) {
        setLoading(true);
        setError("");
        const { error } = await updateSessionStatus(id, status);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setSessions((prev) =>
            prev.map((s) => (s.id === id ? { ...s, status } : s))
        );
        if (session?.id === id) {
            setSession((prev) => prev ? { ...prev, status } : prev);
        }

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