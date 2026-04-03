import { useState } from "react";
import type { Transaction } from "../types/transaction";
import type { CreditSummary, TransactionInput, UseTransactionsResult } from "../types/hooks";
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

    async function fetchTransactionsByUser(user_id: string) {
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
    }

    async function fetchTransactionsBySession(session_id: string) {
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
    }

    async function fetchCreditSummary(user_id: string) {
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
    }

    async function addTransaction(data: TransactionInput) {
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
    }

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
