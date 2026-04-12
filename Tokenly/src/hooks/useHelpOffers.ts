import { useState } from "react";
import type {
    HelpOffer,
    HelpOfferInput,
    HelpOfferUpdateInput,
    HelpOfferRequest,
    HelpOfferRequestInput,
    UseHelpOffersResult,
    UseHelpOfferRequestsResult,
} from "../types/helpOffer";
import {
    getOpenHelpOffers,
    getHelpOffersByHelper,
    getHelpOfferById,
    createHelpOffer,
    updateHelpOffer,
    deleteHelpOffer,
    getRequestsForHelpOffer,
    getHelpOfferRequestsByUser,
    submitHelpOfferRequest,
    acceptHelpOfferRequest,
    rejectHelpOfferRequest,
    withdrawHelpOfferRequest,
} from "../services/helpOfferService";

export function useHelpOffers(): UseHelpOffersResult {
    const [helpOffer, setHelpOffer] = useState<HelpOffer | null>(null);
    const [helpOffers, setHelpOffers] = useState<HelpOffer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function fetchHelpOfferById(id: string) {
        setLoading(true);
        setError("");

        const { data, error } = await getHelpOfferById(id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setHelpOffer(data as HelpOffer | null);
        setLoading(false);
    }

    async function fetchHelpOffersByHelper(helper_id: string) {
        setLoading(true);
        setError("");

        const { data, error } = await getHelpOffersByHelper(helper_id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setHelpOffers((data ?? []) as HelpOffer[]);
        setLoading(false);
    }

    // Used by the Explore offers tab — fetches all open help_offers publicly
    async function fetchOpenHelpOffers() {
        setLoading(true);
        setError("");

        const { data, error } = await getOpenHelpOffers();

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setHelpOffers((data ?? []) as HelpOffer[]);
        setLoading(false);
    }

    async function createHelpOfferFn(data: HelpOfferInput): Promise<HelpOffer | null> {
        setLoading(true);
        setError("");

        const { data: created, error } = await createHelpOffer(data);

        if (error || !created) {
            setError(error?.message ?? "Failed to create offer");
            setLoading(false);
            return null;
        }

        const newOffer = created as HelpOffer;
        setHelpOffers((prev) => [newOffer, ...prev]);
        setLoading(false);
        return newOffer;
    }

    async function updateHelpOfferFn(id: string, updates: HelpOfferUpdateInput): Promise<boolean> {
        setLoading(true);
        setError("");

        const { data: updated, error } = await updateHelpOffer(id, updates);

        if (error || !updated) {
            setError(error?.message ?? "Failed to update offer");
            setLoading(false);
            return false;
        }

        const updatedOffer = updated as HelpOffer;
        setHelpOffers((prev) => prev.map((o) => (o.id === id ? updatedOffer : o)));
        if (helpOffer?.id === id) setHelpOffer(updatedOffer);
        setLoading(false);
        return true;
    }

    async function deleteHelpOfferFn(id: string): Promise<boolean> {
        setLoading(true);
        setError("");

        const { error } = await deleteHelpOffer(id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setHelpOffers((prev) => prev.filter((o) => o.id !== id));
        if (helpOffer?.id === id) setHelpOffer(null);
        setLoading(false);
        return true;
    }

    return {
        helpOffer,
        helpOffers,
        loading,
        error,
        fetchHelpOfferById,
        fetchHelpOffersByHelper,
        fetchOpenHelpOffers,
        createHelpOffer: createHelpOfferFn,
        updateHelpOffer: updateHelpOfferFn,
        deleteHelpOffer: deleteHelpOfferFn,
    };
}

//  HELP OFFER REQUESTS HOOK
// Used by requesters to send/manage their requests to a helper's offer,
// and by helpers to see incoming requests and accept/reject them

export function useHelpOfferRequests(): UseHelpOfferRequestsResult {
    const [requests, setRequests] = useState<HelpOfferRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Helper uses this to see all requests on one of their posted offers
    async function fetchRequestsForOffer(help_offer_id: string) {
        setLoading(true);
        setError("");

        const { data, error } = await getRequestsForHelpOffer(help_offer_id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setRequests((data ?? []) as HelpOfferRequest[]);
        setLoading(false);
    }

    // Requester uses this to see all their sent requests
    async function fetchRequestsByUser(requester_id: string) {
        setLoading(true);
        setError("");

        const { data, error } = await getHelpOfferRequestsByUser(requester_id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setRequests((data ?? []) as HelpOfferRequest[]);
        setLoading(false);
    }

    // Requester submits interest in a helper's open help_offer
    async function submitRequest(data: HelpOfferRequestInput): Promise<HelpOfferRequest | null> {
        setLoading(true);
        setError("");

        const { data: created, error } = await submitHelpOfferRequest(data);

        if (error || !created) {
            setError(error?.message ?? "Failed to submit request");
            setLoading(false);
            return null;
        }

        setRequests((prev) => [created, ...prev]);
        setLoading(false);
        return created;
    }

    // Helper accepts a request → session is created internally in the service
    async function acceptRequest(id: string): Promise<boolean> {
        setLoading(true);
        setError("");

        const { error } = await acceptHelpOfferRequest(id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        // Mark accepted in local state, reject all others on same offer
        setRequests((prev) =>
            prev.map((r) =>
                r.id === id
                    ? { ...r, status: "accepted" as const }
                    : r.help_offer_id === prev.find((x) => x.id === id)?.help_offer_id
                    ? { ...r, status: "rejected" as const }
                    : r
            )
        );
        setLoading(false);
        return true;
    }

    // Helper rejects a specific request
    async function rejectRequest(id: string): Promise<boolean> {
        setLoading(true);
        setError("");

        const { error } = await rejectHelpOfferRequest(id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setRequests((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r))
        );
        setLoading(false);
        return true;
    }

    // Requester withdraws their own pending request
    async function withdrawRequest(id: string): Promise<boolean> {
        setLoading(true);
        setError("");

        const { error } = await withdrawHelpOfferRequest(id);

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
        requests,
        loading,
        error,
        fetchRequestsForOffer,
        fetchRequestsByUser,
        submitRequest,
        acceptRequest,
        rejectRequest,
        withdrawRequest,
    };
}