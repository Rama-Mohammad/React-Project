import { useState } from "react";
import type { Profile } from "../types/profile";
import {
    getProfileById,
    getProfileByUsername,
    updateProfile,
    searchProfiles,
} from "../services/profileService";

type UseProfilesResult = {
    profile: Profile | null;
    results: Profile[];
    loading: boolean;
    error: string;
    fetchProfileById: (id: string) => Promise<void>;
    fetchProfileByUsername: (username: string) => Promise<void>;
    editProfile: (
        id: string,
        updates: {
            username?: string;
            full_name?: string;
            bio?: string;
            profile_image_url?: string;
        }
    ) => Promise<boolean>;
    search: (query: string) => Promise<void>;
};

export default function useProfiles(): UseProfilesResult {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [results, setResults] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function fetchProfileById(id: string) {
        setLoading(true);
        setError("");

        const { data, error } = await getProfileById(id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setProfile(data);
        setLoading(false);
    }

    async function fetchProfileByUsername(username: string) {
        setLoading(true);
        setError("");

        const { data, error } = await getProfileByUsername(username);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setProfile(data);
        setLoading(false);
    }

    async function editProfile(
        id: string,
        updates: {
            username?: string;
            full_name?: string;
            bio?: string;
            profile_image_url?: string;
        }
    ) {
        setLoading(true);
        setError("");

        const { data, error } = await updateProfile(id, updates);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setProfile(data);
        setLoading(false);
        return true;
    }

    async function search(query: string) {
        setLoading(true);
        setError("");

        const { data, error } = await searchProfiles(query);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setResults(data ?? []);
        setLoading(false);
    }

    return {
        profile,
        results,
        loading,
        error,
        fetchProfileById,
        fetchProfileByUsername,
        editProfile,
        search,
    };
}