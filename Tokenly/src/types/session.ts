export type SessionStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export type Session = {
  id: string;
  request_id: string;
  offer_id: string;
  helper_id: string;
  requester_id: string;
  scheduled_at?: string;
  duration_minutes?: number;
  status: SessionStatus;
  completed_at?: string;
}

export type SessionFile = {
  id: string;
  session_id: string;
  uploader_id: string;
  file_name: string;
  file_url: string;
  file_size_bytes: number;
  created_at: string;
};

export type SessionGoal = {
  id: string;
  session_id: string;
  label: string;
  is_completed: boolean;
  created_at: string;
};