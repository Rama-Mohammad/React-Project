import { useState } from "react";
import type {
    DirectRequest,
    DirectRequestInput,
    UseDirectRequestsResult,
} from "../types/directRequest";
import {
    sendDirectRequest,
    getSentDirectRequests,
    getReceivedDirectRequests,
    acceptDirectRequest,
    rejectDirectRequest,
    cancelDirectRequest,
} from "../services/directRequestService";


export default function useDirectRequests(): UseDirectRequestsResult {
    const [directRequests, setDirectRequests] = useState<DirectRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function fetchSentRequests(requester_id: string) {
        setLoading(true);
        setError("");

        const { data, error } = await getSentDirectRequests(requester_id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setDirectRequests((data ?? []) as DirectRequest[]);
        setLoading(false);
    }

    async function fetchReceivedRequests(helper_id: string) {
        setLoading(true);
        setError("");

        const { data, error } = await getReceivedDirectRequests(helper_id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setDirectRequests((data ?? []) as DirectRequest[]);
        setLoading(false);
    }

    async function sendDirectRequestFn(data: DirectRequestInput): Promise<DirectRequest | null> {
        setLoading(true);
        setError("");

        const { data: created, error } = await sendDirectRequest(data);

        if (error || !created) {
            setError(error?.message ?? "Failed to send request");
            setLoading(false);
            return null;
        }

        setDirectRequests((prev) => [created, ...prev]);
        setLoading(false);
        return created;
    }

    async function acceptDirectRequestFn(id: string, scheduledAt?: string): Promise<boolean> {
        setLoading(true);
        setError("");

        const { error } = await acceptDirectRequest(id, scheduledAt);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setDirectRequests((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "accepted" as const } : r))
        );
        setLoading(false);
        return true;
    }

    async function rejectDirectRequestFn(id: string): Promise<boolean> {
        setLoading(true);
        setError("");

        const { error } = await rejectDirectRequest(id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setDirectRequests((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r))
        );
        setLoading(false);
        return true;
    }

    async function cancelDirectRequestFn(id: string): Promise<boolean> {
        setLoading(true);
        setError("");

        const { error } = await cancelDirectRequest(id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setDirectRequests((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "cancelled" as const } : r))
        );
        setLoading(false);
        return true;
    }

    return {
        directRequests,
        loading,
        error,
        fetchSentRequests,
        fetchReceivedRequests,
        sendDirectRequest: sendDirectRequestFn,
        acceptDirectRequest: (id: string, scheduledAt?: string) => acceptDirectRequestFn(id, scheduledAt),
        rejectDirectRequest: rejectDirectRequestFn,
        cancelDirectRequest: cancelDirectRequestFn,
    };
}

