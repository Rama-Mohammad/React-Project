import { useCallback, useState } from "react";
import type { CreditSummary, Transaction, TransactionInput, UseTransactionsResult } from "../types/transaction";
import {
    getTransactionsByUser,
    getTransactionsBySession,
    createTransaction,
    getUserCreditSummary,
} from "../services/transactionService";

export default function useTransactions(): UseTransactionsResult {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<CreditSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchTransactionsByUser = useCallback(async (user_id: string) => {
        setLoading(true);
        setError("");

        const { data, error } = await getTransactionsByUser(user_id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setTransactions(data ?? []);
        setLoading(false);
    }, []);

    const fetchTransactionsBySession = useCallback(async (session_id: string) => {
        setLoading(true);
        setError("");

        const { data, error } = await getTransactionsBySession(session_id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setTransactions(data ?? []);
        setLoading(false);
    }, []);

    const fetchCreditSummary = useCallback(async (user_id: string) => {
        setLoading(true);
        setError("");

        const { data, error } = await getUserCreditSummary(user_id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setSummary(data);
        setLoading(false);
    }, []);

    const addTransaction = useCallback(async (data: TransactionInput) => {
        setLoading(true);
        setError("");

        const { error } = await createTransaction(data);

        if (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }

        setLoading(false);
        return true;
    }, []);

    return {
        transactions,
        summary,
        loading,
        error,
        fetchTransactionsByUser,
        fetchTransactionsBySession,
        fetchCreditSummary,
        addTransaction,
    };
}

