import type { DashboardSessionItem, SessionTabLabel } from "../types/dashboard";

export const sessionTabs: SessionTabLabel[] = ["All", "Upcoming", "Active", "Completed"];

export function skillTone(skill: string) {
  if (skill === "Programming" || skill === "Web Development") return "bg-sky-100 text-sky-700";
  if (skill === "Database" || skill === "Statistics") return "bg-indigo-100 text-indigo-700";
  if (skill === "Algorithms" || skill === "System Design") return "bg-violet-100 text-violet-700";
  if (skill === "Machine Learning") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

export function statusTone(status: DashboardSessionItem["status"]) {
  if (status === "Upcoming") return "bg-blue-100 text-blue-700";
  if (status === "Active Now") return "bg-violet-100 text-violet-700";
  return "bg-slate-100 text-slate-600";
}

export function toneClasses(type: string) {
  if (type === "earn" || type === "bonus") return "bg-violet-100 text-violet-700";
  return "bg-rose-100 text-rose-700";
}

export function toRelativeAge(dateValue?: string | null) {
  if (!dateValue) return "just now";
  const date = new Date(dateValue);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (!Number.isFinite(diffMs) || diffMs < 0) return "just now";
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 60) return `${Math.max(1, minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function getInitials(name: string | null | undefined) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

