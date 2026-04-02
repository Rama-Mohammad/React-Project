import { supabase } from "../lib/supabaseClient";
import type { SkillLevel, SkillCategory } from "../types/skill";

export async function getSkillsByUser(user_id: string) {
  return await supabase
    .from("skills")
    .select("*")
    .eq("user_id", user_id)
    .order("sessions_count", { ascending: false });
}

export async function createSkill(data: {
  user_id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  description?: string;
}) {
  return await supabase
    .from("skills")
    .insert({ ...data, sessions_count: 0 })
    .select()
    .single();
}

export async function updateSkill(
  id: string,
  updates: {
    name?: string;
    category?: SkillCategory;
    level?: SkillLevel;
    description?: string;
  }
) {
  return await supabase
    .from("skills")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
}

export async function incrementSkillSessionCount(id: string) {
  return await supabase.rpc("increment_skill_sessions", { skill_id: id });
}

export async function deleteSkill(id: string) {
  return await supabase.from("skills").delete().eq("id", id);
}