import { useState } from "react";
import {
  getPortfolioByUser,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from "../services/portfolioService";

export type PortfolioRow = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  type: string;
  url?: string;
  tags: string[];
  date?: string;
  created_at: string;
};

export default function usePortfolio() {
  const [items, setItems] = useState<PortfolioRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchByUser(user_id: string) {
    setLoading(true);
    setError("");
    const { data, error } = await getPortfolioByUser(user_id);
    if (error) { setError(error.message); setLoading(false); return; }
    setItems(data ?? []);
    setLoading(false);
  }

  async function add(data: Parameters<typeof createPortfolioItem>[0]) {
    setLoading(true);
    setError("");
    const { data: created, error } = await createPortfolioItem(data);
    if (error) { setError(error.message); setLoading(false); return false; }
    setItems((prev) => [created, ...prev]);
    setLoading(false);
    return true;
  }

  async function edit(id: string, updates: Parameters<typeof updatePortfolioItem>[1]) {
    setLoading(true);
    setError("");
    const { data, error } = await updatePortfolioItem(id, updates);
    if (error) { setError(error.message); setLoading(false); return false; }
    setItems((prev) => prev.map((i) => (i.id === id ? data : i)));
    setLoading(false);
    return true;
  }

  async function remove(id: string) {
    setLoading(true);
    setError("");
    const { error } = await deletePortfolioItem(id);
    if (error) { setError(error.message); setLoading(false); return false; }
    setItems((prev) => prev.filter((i) => i.id !== id));
    setLoading(false);
    return true;
  }

  return { items, loading, error, fetchByUser, add, edit, remove };
}