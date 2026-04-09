export type TransactionType = 'earn' | 'spend' | 'bonus';

export type Transaction = {
  id: string;
  user_id: string;
  session_id?: string;
  amount: number;
  type: TransactionType;
  description?: string;
  created_at: string;
};

export type CreditSummary = {
  earned: number;
  spent: number;
  total: number;
};

export type TransactionInput = {
  user_id: string;
  session_id?: string;
  amount: number;
  type: TransactionType;
  description?: string;
};

export type UseTransactionsResult = {
  transactions: Transaction[];
  summary: CreditSummary | null;
  loading: boolean;
  error: string;
  fetchTransactionsByUser: (user_id: string) => Promise<void>;
  fetchTransactionsBySession: (session_id: string) => Promise<void>;
  fetchCreditSummary: (user_id: string) => Promise<void>;
  addTransaction: (data: TransactionInput) => Promise<boolean>;
};
