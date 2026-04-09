export type Review = {
  id: string;
  session_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
  created_at: string;
};

export type ReviewInput = {
  session_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
};

export type UseReviewsResult = {
  review: Review | null;
  reviews: Review[];
  hasReviewed: boolean;
  loading: boolean;
  error: string;
  submitReview: (data: ReviewInput) => Promise<boolean>;
  fetchReviewsByUser: (reviewee_id: string) => Promise<void>;
  fetchReviewBySession: (session_id: string, reviewer_id: string) => Promise<void>;
  checkHasReviewed: (session_id: string, reviewer_id: string) => Promise<void>;
};
