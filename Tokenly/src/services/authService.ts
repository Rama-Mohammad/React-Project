import type { AuthChangeEvent, AuthResponse, AuthTokenResponsePassword, Session, Subscription, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

export function getCurrentUser() {
  return supabase.auth.getUser();
}

export function getCurrentSession() {
  return supabase.auth.getSession();
}

export function signUpWithEmail(email: string, password: string): Promise<AuthResponse> {
  return supabase.auth.signUp({
    email,
    password,
  });
}

export function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthTokenResponsePassword> {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

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

export type SupabaseAuthUser = User;
export type SupabaseAuthSession = Session;
