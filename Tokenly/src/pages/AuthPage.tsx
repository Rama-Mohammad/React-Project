import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import SignInForm from "../components/auth/SignInForm";
import SignUpForm from "../components/auth/SignUpForm";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";
import VisualPanel from "../components/auth/VisualPanel";

import type { AuthMode } from "../types/auth";

export default function AuthPage() {
    const [mode, setMode] = useState<AuthMode>("signin");
    const navigate = useNavigate();

    const {
        user,
        loading,
        error,
        successMessage,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        resetPassword,
    } = useAuth();

    // ── Redirect to dashboard once authenticated ──
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // ── Sign up handler (calls signUp, then you can also create profile) ──
    const handleSignUp = async (
        email: string,
        password: string,
        username: string,
        fullName: string,
    ): Promise<boolean> => {
        // This passes metadata to Supabase Auth AND your
        // handle_new_user trigger reads it to populate the profiles table
        const success = await signUp(email, password, {
            username,
            full_name: fullName,
        });

        return success;
    };

    // ── If already authenticated, show quick signed-in state ──
    // (normally the router would redirect before this renders)
    if (isAuthenticated && user) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-sm w-full text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">You're signed in!</h2>
                    <p className="text-slate-500 text-sm mb-6">Logged in as {user.email}</p>
                    <button
                        onClick={signOut}
                        disabled={loading}
                        className="w-full py-2.5 px-4 rounded-lg border border-slate-200 text-slate-700 font-medium
              hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    // ── Layout: signin/reset → form LEFT, visual RIGHT
    //            signup       → visual LEFT, form RIGHT ──
    const formIsLeft = mode === "signin" || mode === "reset";

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl">

                {/* Mobile logo (visual panel is hidden on mobile) */}
                <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-slate-900">PeerCredit</span>
                </div>

                {/* Main card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="grid lg:grid-cols-2 min-h-120">

                        {formIsLeft ? (
                            <>
                                {/* Form on the left */}
                                <div className="flex items-center justify-center p-8 lg:p-12">
                                    {mode === "signin" && (
                                        <SignInForm
                                            onSubmit={signIn}
                                            onSwitchToSignUp={() => setMode("signup")}
                                            onSwitchToReset={() => setMode("reset")}
                                            loading={loading}
                                            error={error}
                                            successMessage={successMessage}
                                        />
                                    )}
                                    {mode === "reset" && (
                                        <ResetPasswordForm
                                            onSubmit={resetPassword}
                                            onSwitchToSignIn={() => setMode("signin")}
                                            loading={loading}
                                            error={error}
                                            successMessage={successMessage}
                                        />
                                    )}
                                </div>

                                {/* Visual panel on the right */}
                                <VisualPanel mode={mode} />
                            </>
                        ) : (
                            <>
                                {/* Visual panel on the left */}
                                <VisualPanel mode={mode} />

                                {/* Form on the right */}
                                <div className="flex items-center justify-center p-8 lg:p-12">
                                    <SignUpForm
                                        onSubmit={handleSignUp}
                                        onSwitchToSignIn={() => setMode("signin")}
                                        loading={loading}
                                        error={error}
                                        successMessage={successMessage}
                                    />
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}