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

// Used by both sides of a direct request:
// - Requester: send a request to a specific helper from the Helpers tab
// - Helper: view incoming direct requests and accept/reject them

export default function useDirectRequests(): UseDirectRequestsResult {
    const [directRequests, setDirectRequests] = useState<DirectRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Requester fetches all requests they've sent
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

    // Helper fetches all requests they've received
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

    // Requester sends a private session request to a specific helper
    // Called from the HelperCard or helper profile page
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

    // Helper accepts → session is created internally in the service (Flow 3)
    async function acceptDirectRequestFn(id: string): Promise<boolean> {
        setLoading(true);
        setError("");

        const { error } = await acceptDirectRequest(id);

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

    // Helper rejects the direct request
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

    // Requester cancels their own pending direct request
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
        acceptDirectRequest: acceptDirectRequestFn,
        rejectDirectRequest: rejectDirectRequestFn,
        cancelDirectRequest: cancelDirectRequestFn,
    };
}