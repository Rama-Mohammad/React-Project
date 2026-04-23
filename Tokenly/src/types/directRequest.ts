export type DirectRequestStatus = "pending" | "accepted" | "rejected" | "cancelled";

export type DirectRequest = {
  id: string;
  requester_id: string;
  helper_id: string;
  title: string;
  message: string;
  category: string | null;
  duration_minutes: number | null;
  credit_cost: number;
  status: DirectRequestStatus;
  created_at: string;
};

export type DirectRequestInput = {
  requester_id: string;
  helper_id: string;
  title: string;
  message: string;
  category?: string;
  duration_minutes?: number;
  credit_cost: number;
};

export type DirectRequestMeta = {
  isDirectRequest: boolean;
  directHelperId?: string;
  directHelperName?: string;
  cleanDescription: string;
};

