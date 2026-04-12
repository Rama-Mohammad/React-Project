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

export type DirectRequestUpdateInput = {
  status: DirectRequestStatus;
};

export type DirectRequestWithProfile = DirectRequest & {
  requester: {
    id: string;
    full_name: string | null;
    username: string;
    profile_image_url: string | null;
    avg_rating: number;
  } | null;
  helper: {
    id: string;
    full_name: string | null;
    username: string;
    profile_image_url: string | null;
    avg_rating: number;
  } | null;
};

export type UseDirectRequestsResult = {
  directRequests: DirectRequest[];
  loading: boolean;
  error: string;
  fetchSentRequests: (requester_id: string) => Promise<void>;
  fetchReceivedRequests: (helper_id: string) => Promise<void>;
  sendDirectRequest: (data: DirectRequestInput) => Promise<DirectRequest | null>;
  acceptDirectRequest: (id: string) => Promise<boolean>;
  rejectDirectRequest: (id: string) => Promise<boolean>;
  cancelDirectRequest: (id: string) => Promise<boolean>;
};