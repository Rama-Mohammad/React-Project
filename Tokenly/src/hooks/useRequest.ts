import { useState } from "react";
import type { Request, RequestFilters, RequestInput, RequestStatus, UseRequestsResult } from "../types/request";
import {
    createRequest,
    getRequestById,
    getRequestsByUser,
    getAllOpenRequests,
    updateRequestStatus,
    deleteRequest,
} from "../services/requestService";

export default function useRequests(): UseRequestsResult {
    const [request, setRequest] = useState<Request | null>(null);
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function fetchRequestById(id: string) {
        setLoading(true);
        setError("");

        const { data, error } = await getRequestById(id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setRequest(data);
        setLoading(false);
    }

    async function fetchRequestsByUser(user_id: string) {
        setLoading(true);
        setError("");

        const { data, error } = await getRequestsByUser(user_id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setRequests(data ?? []);
        setLoading(false);
    }

    async function fetchOpenRequests(filters?: RequestFilters) {
        setLoading(true);
        setError("");

        const { data, error } = await getAllOpenRequests(filters);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setRequests(data ?? []);
        setLoading(false);
    }

    async function submitRequest(data: RequestInput) {
        setLoading(true);
        setError("");

        const { error } = await createRequest(data);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setLoading(false);
        return true;
    }

    async function changeRequestStatus(id: string, status: RequestStatus) {
        setLoading(true);
        setError("");

        const { data, error } = await updateRequestStatus(id, status);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setRequest(data);
        setLoading(false);
        return true;
    }

    async function removeRequest(id: string) {
        setLoading(true);
        setError("");

        const { error } = await deleteRequest(id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setRequests((prev) => prev.filter((r) => r.id !== id));
        setLoading(false);
        return true;
    }

    return {
        request,
        requests,
        loading,
        error,
        fetchRequestById,
        fetchRequestsByUser,
        fetchOpenRequests,
        submitRequest,
        changeRequestStatus,
        removeRequest,
    };
}
