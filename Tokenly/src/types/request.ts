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
}