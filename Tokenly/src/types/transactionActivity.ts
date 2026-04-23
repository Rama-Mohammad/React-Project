export type TransactionActivityRow = {
  id: string;
  user_id: string;
  session_id?: string | null;
  title?: string | null;
  description?: string | null;
  type?: string | null;
  created_at: string;
  amount?: number | null;
  credit_amount?: number | null;
  token_amount?: number | null;
  credits?: number | null;
};

export type TransactionActivityFeedItem = TransactionActivityRow & {
  displayTitle: string;
  displayDescription: string;
  displayTypeLabel: string;
  tokenBadgeLabel: string;
  tokenBadgeToneClass: string;
};
