import { useCallback, useRef, useState } from "react";
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

type PortfolioState = {
  items: PortfolioRow[];
  loading: boolean;
  error: string | null;
};

const initialState: PortfolioState = {
  items: [],
  loading: false,
  error: null,
};

const portfolioCache = new Map<string, PortfolioRow[]>();

export default function usePortfolio() {
  const [state, setState] = useState<PortfolioState>(initialState);
  const latestFetchIdRef = useRef(0);

  const fetchByUser = useCallback(async (user_id: string) => {
    const normalizedUserId = user_id.trim();
    if (!normalizedUserId) return;
    const cachedItems = portfolioCache.get(normalizedUserId);

    if (cachedItems) {
      setState({
        items: cachedItems,
        loading: false,
        error: null,
      });
      return;
    }

    const fetchId = latestFetchIdRef.current + 1;
    latestFetchIdRef.current = fetchId;

    setState((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    const { data, error } = await getPortfolioByUser(normalizedUserId);

    if (latestFetchIdRef.current !== fetchId) {
      return;
    }

    if (error) {
      setState({
        items: [],
        loading: false,
        error: error.message,
      });
      return;
    }

    setState({
      items: data ?? [],
      loading: false,
      error: null,
    });
    portfolioCache.set(normalizedUserId, data ?? []);
  }, []);

  const add = useCallback(async (data: Parameters<typeof createPortfolioItem>[0]) => {
    const { data: created, error } = await createPortfolioItem(data);

    if (error) {
      setState((current) => ({
        ...current,
        error: error.message,
      }));
      return false;
    }

    setState((current) => ({
      items: created ? [created, ...current.items] : current.items,
      loading: false,
      error: null,
    }));
    if (created?.user_id) {
      const currentCachedItems = portfolioCache.get(created.user_id) ?? [];
      portfolioCache.set(created.user_id, [created, ...currentCachedItems]);
    }
    return true;
  }, []);

  const edit = useCallback(async (id: string, updates: Parameters<typeof updatePortfolioItem>[1]) => {
    const { data, error } = await updatePortfolioItem(id, updates);

    if (error) {
      setState((current) => ({
        ...current,
        error: error.message,
      }));
      return false;
    }

    setState((current) => ({
      items: current.items.map((item) => (item.id === id ? data : item)),
      loading: false,
      error: null,
    }));
    if (data?.user_id) {
      const currentCachedItems = portfolioCache.get(data.user_id) ?? [];
      portfolioCache.set(
        data.user_id,
        currentCachedItems.map((item) => (item.id === id ? data : item))
      );
    }
    return true;
  }, []);

  const remove = useCallback(async (id: string) => {
    const { error } = await deletePortfolioItem(id);

    if (error) {
      setState((current) => ({
        ...current,
        error: error.message,
      }));
      return false;
    }

    setState((current) => ({
      items: current.items.filter((item) => item.id !== id),
      loading: false,
      error: null,
    }));
    portfolioCache.forEach((items, userId) => {
      portfolioCache.set(
        userId,
        items.filter((item) => item.id !== id)
      );
    });
    return true;
  }, []);

  return {
    items: state.items,
    loading: state.loading,
    error: state.error,
    fetchByUser,
    add,
    edit,
    remove,
  };
}
