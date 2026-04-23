import type { AuthChangeEvent, AuthResponse, AuthTokenResponsePassword, Session, Subscription } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import { getEmailByUsername } from "./profileService";

export function getCurrentUser() {
  return supabase.auth.getUser();
}

export function getCurrentSession() {
  return supabase.auth.getSession();
}

export function signUpWithEmail(
  email: string,
  password: string,
  metadata?: { username?: string; full_name?: string },
): Promise<AuthResponse> {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata ?? {},
      emailRedirectTo: `${window.location.origin}/auth?mode=signup&from=email-confirmation`,
    },
  });
}

export async function signInWithIdentifier(
  identifier: string,
  password: string,
): Promise<AuthTokenResponsePassword> {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

  let email = identifier;

  if (!isEmail) {
    const found = await getEmailByUsername(identifier.toLowerCase());
    if (!found) {
      return {
        data: { user: null, session: null },
        error: { message: "No account found with that username", name: "AuthError", status: 400 } as any,
      };
    }
    email = found;
  }

  return supabase.auth.signInWithPassword({ email, password });
}

export const signInWithEmail = signInWithIdentifier;

export function signOutUser() {
  return supabase.auth.signOut();
}

export function subscribeToAuthChanges(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
): { data: { subscription: Subscription } } {
  return supabase.auth.onAuthStateChange(callback);
}

export function sendPasswordResetEmail(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
}

export function updatePassword(newPassword: string) {
  return supabase.auth.updateUser({ password: newPassword });
}

export function updateEmail(newEmail: string) {
  return supabase.auth.updateUser({ email: newEmail });
}

export async function deleteUserAccount(userId: string) {
  const { error } = await supabase.rpc("delete_user_account", {
    target_user_id: userId,
  });
  return { error };
}
