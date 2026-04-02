import { useState } from "react";
import type { Skill, SkillLevel, SkillCategory } from "../types/skill";
import {
    getSkillsByUser,
    createSkill,
    updateSkill,
    deleteSkill,
} from "../services/skillService";

type UseSkillsResult = {
    skills: Skill[];
    loading: boolean;
    error: string;
    fetchSkillsByUser: (user_id: string) => Promise<void>;
    addSkill: (data: {
        user_id: string;
        name: string;
        category: SkillCategory;
        level: SkillLevel;
        description?: string;
    }) => Promise<boolean>;
    editSkill: (
        id: string,
        updates: {
            name?: string;
            category?: SkillCategory;
            level?: SkillLevel;
            description?: string;
        }
    ) => Promise<boolean>;
    removeSkill: (id: string) => Promise<boolean>;
};

export default function useSkills(): UseSkillsResult {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function fetchSkillsByUser(user_id: string) {
        setLoading(true);
        setError("");

        const { data, error } = await getSkillsByUser(user_id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setSkills(data ?? []);
        setLoading(false);
    }

    async function addSkill(data: {
        user_id: string;
        name: string;
        category: SkillCategory;
        level: SkillLevel;
        description?: string;
    }) {
        setLoading(true);
        setError("");

        const { data: created, error } = await createSkill(data);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setSkills((prev) => [...prev, created]);
        setLoading(false);
        return true;
    }

    async function editSkill(
        id: string,
        updates: {
            name?: string;
            category?: SkillCategory;
            level?: SkillLevel;
            description?: string;
        }
    ) {
        setLoading(true);
        setError("");

        const { data, error } = await updateSkill(id, updates);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setSkills((prev) => prev.map((s) => (s.id === id ? data : s)));
        setLoading(false);
        return true;
    }

    async function removeSkill(id: string) {
        setLoading(true);
        setError("");

        const { error } = await deleteSkill(id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setSkills((prev) => prev.filter((s) => s.id !== id));
        setLoading(false);
        return true;
    }

    return {
        skills,
        loading,
        error,
        fetchSkillsByUser,
        addSkill,
        editSkill,
        removeSkill,
    };
}