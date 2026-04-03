import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
            <div className="relative h-dvh w-screen overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] flex items-center justify-center p-4">
                <div className="pointer-events-none absolute inset-0">
                    <div className="explore-pulse absolute -left-24 top-16 h-64 w-64 rounded-full bg-indigo-200/25 blur-3xl" />
                    <div className="explore-float absolute right-[-6rem] top-40 h-72 w-72 rounded-full bg-sky-200/22 blur-3xl" />
                </div>
                <div className="relative z-10 bg-white/85 rounded-2xl shadow-sm border border-white/70 p-8 max-w-sm w-full text-center backdrop-blur">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">You're signed in!</h2>
                    <p className="text-slate-500 text-sm mb-6">Logged in as {user.email}</p>
                    <button
                        onClick={signOut}
                        disabled={loading}
                        className="w-full py-2.5 px-4 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 font-medium
              hover:bg-indigo-100 transition-colors disabled:opacity-50"
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
        <div className="relative h-dvh w-screen overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] flex items-center justify-center p-2 sm:p-3 lg:p-4">
            <div className="pointer-events-none absolute inset-0">
                <div className="explore-pulse absolute -left-24 top-16 h-64 w-64 rounded-full bg-indigo-200/25 blur-3xl" />
                <div className="explore-float absolute right-[-6rem] top-40 h-72 w-72 rounded-full bg-sky-200/22 blur-3xl" />
                <div className="explore-pulse absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-purple-200/20 blur-3xl" />
            </div>
            <div className="flex h-full w-full max-w-5xl flex-col justify-center">
                <div className="mb-3 flex justify-start">
                    <Link
                        to="/home"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/70 px-3.5 py-2 text-sm font-semibold text-slate-700 backdrop-blur transition hover:bg-white"
                    >
                        ← Go back to Home Page
                    </Link>
                </div>

                {/* Mobile logo (visual panel is hidden on mobile) */}
                <div className="mb-4 flex items-center justify-center gap-2 lg:hidden">
                    <img src="/images/logo-nobg.png" alt="Tokenly" className="h-20 w-auto object-contain" />
                </div>

                {/* Main card */}
                <div className="relative z-10 h-[90dvh] overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_28px_90px_-35px_rgba(79,70,229,0.55)] ring-1 ring-white/60 backdrop-blur-xl lg:h-[88dvh] lg:max-h-[760px]">
                    <div className="grid h-full lg:grid-cols-2">

                        {formIsLeft ? (
                            <>
                                {/* Form on the left */}
                                <div className="flex items-center justify-center overflow-hidden p-4 sm:p-5 lg:p-7">
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
                                <div className="flex items-center justify-center overflow-hidden p-4 sm:p-5 lg:p-7">
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
