export type TransactionType = 'earn' | 'spend' | 'bonus';

export type Transaction = {
  id: string;
  user_id: string;
  session_id?: string;
  amount: number;
  type: TransactionType;
  description?: string;
  created_at: string;
}