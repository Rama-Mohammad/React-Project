import type { PortfolioItemData, ProfileSkill, ReviewItem } from "./profile";

export type NeedBy = "flexible" | "soon" | "urgent";
export type RequiredSection =
  | "title"
  | "skills"
  | "description"
  | "duration"
  | "urgency";

export type SessionsPageItem = {
  id: string;
  topic: string;
  skill: string;
  status: "Upcoming" | "Active Now" | "Completed";
  role: "Helping" | "Receiving help";
  person: string;
  date: string;
  duration: string;
  credits: number;
  rating?: number;
};

export type UiSkill = ProfileSkill;
export type PortfolioEntry = PortfolioItemData;
export type UiReview = ReviewItem;

