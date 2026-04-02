import { useState } from "react";
import type { Review } from "../types/review";
import {
    createReview,
    getReviewsByUser,
    getReviewBySession,
    hasUserReviewedSession,
} from "../services/reviewService";

type UseReviewsResult = {
    review: Review | null;
    reviews: Review[];
    hasReviewed: boolean;
    loading: boolean;
    error: string;
    submitReview: (data: {
        session_id: string;
        reviewer_id: string;
        reviewee_id: string;
        rating: number;
        comment?: string;
    }) => Promise<boolean>;
    fetchReviewsByUser: (reviewee_id: string) => Promise<void>;
    fetchReviewBySession: (session_id: string, reviewer_id: string) => Promise<void>;
    checkHasReviewed: (session_id: string, reviewer_id: string) => Promise<void>;
};

export default function useReviews(): UseReviewsResult {
    const [review, setReview] = useState<Review | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function submitReview(data: {
        session_id: string;
        reviewer_id: string;
        reviewee_id: string;
        rating: number;
        comment?: string;
    }) {
        setLoading(true);
        setError("");

        const { data: created, error } = await createReview(data);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setReview(created);
        setLoading(false);
        return true;
    }

    async function fetchReviewsByUser(reviewee_id: string) {
        setLoading(true);
        setError("");

        const { data, error } = await getReviewsByUser(reviewee_id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setReviews(data ?? []);
        setLoading(false);
    }

    async function fetchReviewBySession(session_id: string, reviewer_id: string) {
        setLoading(true);
        setError("");

        const { data, error } = await getReviewBySession(session_id, reviewer_id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setReview(data);
        setLoading(false);
    }

    async function checkHasReviewed(session_id: string, reviewer_id: string) {
        setLoading(true);
        setError("");

        const result = await hasUserReviewedSession(session_id, reviewer_id);
        setHasReviewed(result);
        setLoading(false);
    }

    return {
        review,
        reviews,
        hasReviewed,
        loading,
        error,
        submitReview,
        fetchReviewsByUser,
        fetchReviewBySession,
        checkHasReviewed,
    };
}