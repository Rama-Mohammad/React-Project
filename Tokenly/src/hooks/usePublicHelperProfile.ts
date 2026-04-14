import { useState } from "react";
import {
  getPublicHelperProfileCore,
  getHelperOpenOffers,
} from "../services/profileService";

type ProfileCore = {
  profile: Awaited<ReturnType<typeof getPublicHelperProfileCore>>["profile"];
  skills: Awaited<ReturnType<typeof getPublicHelperProfileCore>>["skills"];
  reviews: Awaited<ReturnType<typeof getPublicHelperProfileCore>>["reviews"];
  helpOffers: { id: string; title: string; description: string; category: string; urgency: string; duration_minutes: number; credit_cost: number; status: string; created_at: string }[];
  loading: boolean;
  offersLoading: boolean;
  error: string;
  fetchProfile: (helperId: string) => Promise<void>;
  fetchOffers: (helperId: string) => Promise<void>;
};

export default function usePublicHelperProfile(): ProfileCore {
  const [profile, setProfile] = useState<ProfileCore["profile"]>(null);
  const [skills, setSkills] = useState<ProfileCore["skills"]>([]);
  const [reviews, setReviews] = useState<ProfileCore["reviews"]>([]);
  const [helpOffers, setHelpOffers] = useState<ProfileCore["helpOffers"]>([]);
  const [loading, setLoading] = useState(false);
  const [offersLoading, setOffersLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchProfile(helperId: string) {
    setLoading(true);
    setError("");

    const result = await getPublicHelperProfileCore(helperId);

    if (result.error) setError(result.error.message);
    else {
      setProfile(result.profile);
      setSkills(result.skills);
      setReviews(result.reviews);
    }

    setLoading(false);
  }

  async function fetchOffers(helperId: string) {
    setOffersLoading(true);

    const { data, error } = await getHelperOpenOffers(helperId);

    if (!error && data) setHelpOffers(data);

    setOffersLoading(false);
  }

  return {
    profile,
    skills,
    reviews,
    helpOffers,
    loading,
    offersLoading,
    error,
    fetchProfile,
    fetchOffers,
  };
}