export type RequestStatus = 'open' | 'accepted' | 'completed' | 'cancelled';
export type Urgency = 'low' | 'medium' | 'high';

export type Request = {
  id: string;
  requester_id: string;
  title: string;
  description: string;
  category?: string;
  urgency: Urgency;
  duration_minutes?: number;
  credit_cost: number;
  status: RequestStatus;
  created_at: string;
};

export type RequestFilters = {
  category?: string;
  urgency?: Urgency;
  max_duration?: number;
  page?: number;
  pageSize?: number;
};

export type RequestInput = {
  requester_id: string;
  title: string;
  description: string;
  category?: string;
  urgency: Urgency;
  duration_minutes?: number;
  credit_cost: number;
  status?: RequestStatus;
};

export type UseRequestsResult = {
  request: Request | null;
  requests: Request[];
  loading: boolean;
  error: string;
  fetchRequestById: (id: string) => Promise<void>;
  fetchRequestsByUser: (user_id: string) => Promise<void>;
  fetchOpenRequests: (filters?: RequestFilters) => Promise<number | null>;
  submitRequest: (data: RequestInput) => Promise<boolean>;
  changeRequestStatus: (id: string, status: RequestStatus) => Promise<boolean>;
  removeRequest: (id: string) => Promise<boolean>;
};

