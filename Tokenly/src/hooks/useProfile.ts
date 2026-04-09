import { useState } from "react";
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
        updates: EditProfileInput
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
