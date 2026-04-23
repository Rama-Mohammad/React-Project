import { useCallback, useRef, useState } from "react";
import {
  getPublicProfileBasic,
  getPublicProfileDetails,
  getHelperOpenOffers,
} from "../services/profileService";

type ProfileCore = {
  profile: Awaited<ReturnType<typeof getPublicProfileBasic>>["data"] | null;
  skills: Awaited<ReturnType<typeof getPublicProfileDetails>>["skills"];
  reviews: Awaited<ReturnType<typeof getPublicProfileDetails>>["reviews"];
  helpOffers: { id: string; title: string; description: string; category: string; urgency: string; duration_minutes: number; credit_cost: number; status: string; created_at: string }[];
  loading: boolean;
  detailsLoading: boolean;
  offersLoading: boolean;
  error: string;
  fetchProfile: (helperId: string, options?: { includePrivate?: boolean }) => Promise<void>;
  fetchOffers: (helperId: string, options?: { limit?: number }) => Promise<void>;
};

type ProfileSnapshot = {
  profile: ProfileCore["profile"];
  skills: ProfileCore["skills"];
  reviews: ProfileCore["reviews"];
};

const profileCache = new Map<string, ProfileSnapshot>();
const offersCache = new Map<string, ProfileCore["helpOffers"]>();
export const clearProfileCache = (helperId: string, includePrivate?: boolean) => {
  const key = `${helperId.trim()}:${includePrivate ? "private" : "public"}`;
  profileCache.delete(key);
};

export default function usePublicHelperProfile(): ProfileCore {
  const [profile, setProfile] = useState<ProfileCore["profile"]>(null);
  const [skills, setSkills] = useState<ProfileCore["skills"]>([]);
  const [reviews, setReviews] = useState<ProfileCore["reviews"]>([]);
  const [helpOffers, setHelpOffers] = useState<ProfileCore["helpOffers"]>([]);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [offersLoading, setOffersLoading] = useState(false);
  const [error, setError] = useState("");
  const latestProfileFetchRef = useRef(0);
  const latestDetailsFetchRef = useRef(0);
  const latestOffersFetchRef = useRef(0);

  const fetchProfile = useCallback(async (helperId: string, options?: { includePrivate?: boolean }) => {
    const normalizedHelperId = helperId.trim();
    if (!normalizedHelperId) return;

    const profileCacheKey = `${normalizedHelperId}:${options?.includePrivate ? "private" : "public"}`;


    const cachedProfile = profileCache.get(profileCacheKey);

if (cachedProfile) {
  profileCache.delete(profileCacheKey);
}

    const requestId = latestProfileFetchRef.current + 1;
    latestProfileFetchRef.current = requestId;

    setLoading(true);
    setError("");

    const basicResult = await getPublicProfileBasic(normalizedHelperId, options);

    if (latestProfileFetchRef.current !== requestId) {
      return;
    }

    if (basicResult.error) {
      setProfile(null);
      setSkills([]);
      setReviews([]);
      setError(basicResult.error.message);
      setLoading(false);
      setDetailsLoading(false);
      return;
    }

    setProfile(basicResult.data ?? null);
    setError("");
    setLoading(false);

    const detailsRequestId = latestDetailsFetchRef.current + 1;
    latestDetailsFetchRef.current = detailsRequestId;
    setDetailsLoading(true);

    const detailsResult = await getPublicProfileDetails(normalizedHelperId);

    if (latestDetailsFetchRef.current !== detailsRequestId) {
      return;
    }

    if (detailsResult.error) {
      setSkills([]);
      setReviews([]);
    } else {
      setSkills(detailsResult.skills);
      setReviews(detailsResult.reviews);
      profileCache.set(profileCacheKey, {
        profile: basicResult.data ?? null,
        skills: detailsResult.skills,
        reviews: detailsResult.reviews,
      });
    }

    setDetailsLoading(false);
  }, []);

  const fetchOffers = useCallback(async (helperId: string, options?: { limit?: number }) => {
    const normalizedHelperId = helperId.trim();
    if (!normalizedHelperId) return;

    const limitKey = typeof options?.limit === "number" && options.limit > 0 ? options.limit : "all";
    const offersCacheKey = `${normalizedHelperId}:${limitKey}`;
    const cachedOffers = offersCache.get(offersCacheKey);
    if (cachedOffers) {
      setHelpOffers(cachedOffers);
      setOffersLoading(false);
      return;
    }

    const requestId = latestOffersFetchRef.current + 1;
    latestOffersFetchRef.current = requestId;

    setOffersLoading(true);

    const { data, error } = await getHelperOpenOffers(normalizedHelperId, options);

    if (latestOffersFetchRef.current !== requestId) {
      return;
    }

    if (!error && data) {
      setHelpOffers(data);
      offersCache.set(offersCacheKey, data);
    } else {
      setHelpOffers([]);
    }

    setOffersLoading(false);
  }, []);

  return {
    profile,
    skills,
    reviews,
    helpOffers,
    loading,
    detailsLoading,
    offersLoading,
    error,
    fetchProfile,
    fetchOffers,
  };
}

