import { useCallback, useState } from "react";
import type { EditProfileInput, Profile, UseProfilesResult } from "../types/profile";
import {
    getProfileById,
    getProfileByUsername,
    updateProfile,
    searchProfiles,
} from "../services/profileService";

export default function useProfiles(): UseProfilesResult {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [results, setResults] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchProfileById = useCallback(async (id: string) => {
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
    }, []);

    const fetchProfileByUsername = useCallback(async (username: string) => {
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
    }, []);

    const editProfile = useCallback(async (
        id: string,
        updates: EditProfileInput
    ) => {
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
    }, []);

    const search = useCallback(async (query: string) => {
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
    }, []);

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
