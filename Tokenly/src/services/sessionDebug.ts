import { supabase } from "../lib/supabaseClient";

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

export function logSessionsQuery(_label: string, _details: unknown) {
  void _label;
  void _details;
  return;
}

