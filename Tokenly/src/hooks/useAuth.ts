import { useEffect, useState } from "react";
import type { AuthUser, AuthSession } from "../types/auth";
import type { UseAuthResult } from "../types/hooks";
import type { SupabaseAuthSession } from "../services/authService";
import {
    getCurrentSession,
    signInWithEmail,
    signOutUser,
    signUpWithEmail,
    sendPasswordResetEmail,
    updatePassword,
    subscribeToAuthChanges,
} from "../services/authService";


function formatError(message: string) {
    const msg = message.toLowerCase();

    if (msg.includes("invalid login")) return "Wrong email or password";
    if (msg.includes("already registered")) return "Email already in use";
    if (msg.includes("password should be")) return "Password must be at least 6 characters";
    if (msg.includes("unable to validate")) return "Session expired, please sign in again";
    if (msg.includes("email not confirmed")) return "Please verify your email before signing in";
    if (msg.includes("network")) return "Network error, please check your connection";

    return message;
}


function mapUser(user: SupabaseAuthSession["user"] | null): AuthUser | null {
    if (!user) return null;

    return {
        id: user.id,
        email: user.email ?? "",
        provider: "email",
        created_at: user.created_at ?? "",
        last_sign_in_at: user.last_sign_in_at ?? undefined,
    };
}

function mapSession(session: SupabaseAuthSession | null): AuthSession | null {
    if (!session) return null;

    const mappedUser = mapUser(session.user);
    if (!mappedUser) return null;

    return {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at ?? 0,
        user: mappedUser,
    };
}


export default function useAuth(): UseAuthResult {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [session, setSession] = useState<AuthSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        async function initialize() {
            setLoading(true);
            setError("");

            const { data, error } = await getCurrentSession();

            if (error) {
                setError(formatError(error.message));
                setLoading(false);
                return;
            }

            const mappedSession = mapSession(data.session);
            setSession(mappedSession);
            setUser(mappedSession?.user ?? null);
            setLoading(false);
        }

        void initialize();

        const {
            data: { subscription },
        } = subscribeToAuthChanges((_event, session) => {
            const mappedSession = mapSession(session);
            setSession(mappedSession);
            setUser(mappedSession?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);


    async function signUp(
        email: string,
        password: string,
        metadata?: { username?: string; full_name?: string },
    ) {
        setError("");
        setSuccessMessage("");

        const { error } = await signUpWithEmail(email, password, metadata);

        if (error) {
            setError(formatError(error.message));
            return false;
        }

        setSuccessMessage("Account created successfully.");
        return true;
    }

    async function signIn(email: string, password: string) {
        setError("");
        setSuccessMessage("");

        const { error } = await signInWithEmail(email, password);

        if (error) {
            setError(formatError(error.message));
            return false;
        }

        setSuccessMessage("Signed in successfully.");
        return true;
    }

    async function signOut() {
        setError("");
        setSuccessMessage("");

        const { error } = await signOutUser();

        if (error) {
            setError(formatError(error.message));
            return false;
        }

        setSuccessMessage("Signed out successfully.");
        return true;
    }

    async function resetPassword(email: string) {
        setError("");
        setSuccessMessage("");

        const { error } = await sendPasswordResetEmail(email);

        if (error) {
            setError(formatError(error.message));
            return false;
        }

        setSuccessMessage("Password reset email sent. Check your inbox.");
        return true;
    }

    async function changePassword(newPassword: string) {
        setError("");
        setSuccessMessage("");

        const { error } = await updatePassword(newPassword);

        if (error) {
            setError(formatError(error.message));
            return false;
        }

        setSuccessMessage("Password updated successfully.");
        return true;
    }


    return {
        user,
        session,
        loading,
        error,
        successMessage,
        isAuthenticated: !!user,
        signUp,
        signIn,
        signOut,
        resetPassword,
        changePassword,
    };
}
