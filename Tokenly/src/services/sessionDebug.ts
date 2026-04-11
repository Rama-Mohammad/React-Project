import type { PostgrestError, Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

export type SessionsQueryError = PostgrestError | Error | null;

export async function getSessionsAuthDebugContext() {
  const [{ data: sessionData, error: sessionError }, { data: userData, error: userError }] = await Promise.all([
    supabase.auth.getSession(),
    supabase.auth.getUser(),
  ]);

  return {
    session: sessionData.session,
    user: userData.user,
    authError: sessionError ?? userError ?? null,
  };
}

export function logSessionsQuery(
  label: string,
  details: {
    session: Session | null;
    user: User | null;
    payload?: unknown;
    error?: SessionsQueryError;
  }
) {
  console.log(`[sessions] ${label}`, {
    session: details.session,
    user: details.user,
    payload: details.payload ?? null,
    error: details.error ?? null,
  });
}
