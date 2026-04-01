export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  bio?: string;
  profile_image_url?: string;
  credit_balance: number;
  avg_rating: number;
  created_at: string;
}