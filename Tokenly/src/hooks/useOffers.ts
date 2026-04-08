import { useState } from "react";
import type { Offer, OfferStatus, UseOffersResult } from "../types/offer";
import {
    createOffer,
    getOffersByRequest,
    getOffersByHelper,
    updateOfferStatus,
    deleteOffer,
} from "../services/offerService";

export default function useOffers(): UseOffersResult {
    const [offer, setOffer] = useState<Offer | null>(null);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function submitOffer(
        request_id: string,
        helper_id: string,
        message?: string,
        availability?: string
    ) {
        setLoading(true);
        setError("");

        const { error } = await createOffer(request_id, helper_id, message, availability);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setLoading(false);
        return true;
    }

    async function fetchOffersByRequest(request_id: string) {
        setLoading(true);
        setError("");

        const { data, error } = await getOffersByRequest(request_id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setOffers(data ?? []);
        setLoading(false);
    }

    async function fetchOffersByHelper(helper_id: string) {
        setLoading(true);
        setError("");

        const { data, error } = await getOffersByHelper(helper_id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setOffers(data ?? []);
        setLoading(false);
    }

    async function changeOfferStatus(id: string, status: OfferStatus) {
        setLoading(true);
        setError("");

        const { data, error } = await updateOfferStatus(id, status);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setOffer(data);
        setOffers((prev) => prev.map((o) => (o.id === id ? data : o)));
        setLoading(false);
        return true;
    }

    async function removeOffer(id: string) {
        setLoading(true);
        setError("");

        const { error } = await deleteOffer(id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setOffers((prev) => prev.filter((o) => o.id !== id));
        setLoading(false);
        return true;
    }

    return {
        offer,
        offers,
        loading,
        error,
        submitOffer,
        fetchOffersByRequest,
        fetchOffersByHelper,
        changeOfferStatus,
        removeOffer,
    };
}
