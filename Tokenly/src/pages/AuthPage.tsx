import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import SignInForm from "../components/auth/SignInForm";
import SignUpForm from "../components/auth/SignUpForm";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";
import VisualPanel from "../components/auth/VisualPanel";
import { useSearchParams } from "react-router-dom";

import type { AuthMode } from "../types/auth";



export default function AuthPage() {
    const [searchParams] = useSearchParams();
    const getModeFromQuery = (): AuthMode => {
        const queryMode = searchParams.get("mode");
        if (queryMode === "signup" || queryMode === "reset" || queryMode === "signin") {
            return queryMode;
        }
        return "signin";
    };
    const [mode, setMode] = useState<AuthMode>(getModeFromQuery);
    const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
    const [switchTick, setSwitchTick] = useState(0);
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

    // â”€â”€ Redirect to dashboard once authenticated â”€â”€
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        setMode(getModeFromQuery());
    }, [searchParams]);

    // â”€â”€ Sign up handler (calls signUp, then you can also create profile) â”€â”€
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

    // â”€â”€ If already authenticated, show quick signed-in state â”€â”€
    // (normally the router would redirect before this renders)
    if (isAuthenticated && user) {
        return (
            <div className="relative h-dvh w-screen overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] flex items-center justify-center p-4">
                <div className="pointer-events-none absolute inset-0">
                    <div className="explore-pulse absolute -left-24 top-16 h-64 w-64 rounded-full bg-indigo-200/25 blur-3xl" />
                    <div className="explore-float absolute -right-24 top-40 h-72 w-72 rounded-full bg-sky-200/22 blur-3xl" />
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

    // â”€â”€ Layout: signin/reset â†’ form LEFT, visual RIGHT
    //            signup       â†’ visual LEFT, form RIGHT â”€â”€

    const switchMode = (nextMode: AuthMode) => {
        if (nextMode === mode) return;
        const currentIndex = mode === "signup" ? 1 : 0;
        const nextIndex = nextMode === "signup" ? 1 : 0;
        setSlideDirection(nextIndex > currentIndex ? 1 : -1);
        setSwitchTick((prev) => prev + 1);
        setMode(nextMode);
    };

    return (
        <div className="relative h-dvh w-screen overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] flex items-center justify-center p-2 sm:p-3 lg:p-4">
            <div className="pointer-events-none absolute inset-0">
                <div className="explore-pulse absolute -left-24 top-16 h-64 w-64 rounded-full bg-indigo-200/25 blur-3xl" />
                <div className="explore-float absolute -right-24 top-40 h-72 w-72 rounded-full bg-sky-200/22 blur-3xl" />
                <div className="explore-pulse absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-purple-200/20 blur-3xl" />
            </div>
            <Link
                to="/home"
                className="absolute left-3 top-3 z-20 inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/70 px-3.5 py-2 text-sm font-semibold text-slate-700 backdrop-blur transition hover:bg-white sm:left-4 sm:top-4"
            >
                â† Go back to Home Page
            </Link>

            {/* Mobile logo (visual panel is hidden on mobile) */}
            <div className="absolute left-1/2 top-3 z-20 -translate-x-1/2 lg:hidden">
                <img src="/images/logo-nobg.png" alt="Tokenly" className="h-28 w-auto object-contain sm:h-32" />
            </div>

            <div className="flex h-full w-full max-w-5xl items-center justify-center">

                {/* Main card */}
                <div className="relative z-10 overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-sm backdrop-blur-xl">
                    <div
                        key={`${mode}-${switchTick}`}
                        className={slideDirection === 1 ? "auth-switch-left" : "auth-switch-right"}
                    >
                    <div className="relative min-h-170 overflow-hidden">
                        <div
                            className={`flex w-[200%] min-h-170 transform-gpu transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                mode === "signup" ? "-translate-x-1/2" : "translate-x-0"
                            }`}
                        >
                            <div className="grid w-1/2 min-h-170 lg:grid-cols-2">
                                <div className="flex items-center justify-center overflow-hidden p-4 sm:p-5 lg:p-7">
                                    {mode === "reset" ? (
                                        <ResetPasswordForm
                                            onSubmit={resetPassword}
                                            onSwitchToSignIn={() => switchMode("signin")}
                                            loading={loading}
                                            error={error}
                                            successMessage={successMessage}
                                        />
                                    ) : (
                                        <SignInForm
                                            onSubmit={signIn}
                                            onSwitchToSignUp={() => switchMode("signup")}
                                            onSwitchToReset={() => switchMode("reset")}
                                            loading={loading}
                                            error={error}
                                            successMessage={successMessage}
                                        />
                                    )}
                                </div>
                                <VisualPanel mode={mode === "reset" ? "reset" : "signin"} />
                            </div>

                            <div className="grid w-1/2 min-h-170 lg:grid-cols-2">
                                <VisualPanel mode="signup" />
                                <div className="flex items-center justify-center overflow-hidden p-4 sm:p-5 lg:p-7">
                                    <SignUpForm
                                        onSubmit={handleSignUp}
                                        onSwitchToSignIn={() => switchMode("signin")}
                                        loading={loading}
                                        error={error}
                                        successMessage={successMessage}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
