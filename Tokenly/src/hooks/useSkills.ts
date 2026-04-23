import { useState } from "react";
import type { Skill, SkillInput, SkillUpdateInput, UseSkillsResult } from "../types/skill";
import {
    getSkillsByUser,
    createSkill,
    updateSkill,
    deleteSkill,
} from "../services/skillService";

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

    async function addSkill(data: SkillInput) {
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
        updates: SkillUpdateInput
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

