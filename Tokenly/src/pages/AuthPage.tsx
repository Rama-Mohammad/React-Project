import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import NewPasswordForm from "../components/auth/NewPasswordForm";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";
import SignInForm from "../components/auth/SignInForm";
import SignUpForm from "../components/auth/SignUpForm";
import VisualPanel from "../components/auth/VisualPanel";
import type { AuthMode } from "../types/auth";

function getInitialMode(searchParams: URLSearchParams): AuthMode {
    const queryMode = searchParams.get("mode");
    if (
        queryMode === "signin" ||
        queryMode === "signup" ||
        queryMode === "reset" ||
        queryMode === "newpassword"
    ) {
        return queryMode;
    }
    if (window.location.hash.includes("type=recovery")) {
        return "newpassword";
    }
    return "signin";
}

export default function AuthPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [mode, setMode] = useState<AuthMode>(() => getInitialMode(searchParams));
    const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
    const [switchTick, setSwitchTick] = useState(0);

    const {
        user,
        loading,
        error,
        successMessage,
        isAuthenticated,
        isPasswordRecovery,
        signIn,
        signUp,
        signOut,
        resetPassword,
        changePassword,
    } = useAuth();
    const isRecoveryRoute =
        isPasswordRecovery ||
        mode === "newpassword" ||
        window.location.pathname === "/reset-password" ||
        window.location.hash.includes("type=recovery");

    //when supabase fires PASSWORD_RECOVERY event=>force newpassword mode
    useEffect(() => {
        if (isPasswordRecovery) {
            setMode("newpassword");
        }
    }, [isPasswordRecovery]);

    //redirect to explore if alrready authenticated and not in password revovery 
    useEffect(() => {
        if (isAuthenticated && !isRecoveryRoute) {
            navigate("/explore", { replace: true });
        }
    }, [isAuthenticated, isRecoveryRoute, navigate]);

    const switchMode = (nextMode: AuthMode) => {
        if (nextMode === mode) return;
        const currentIndex = mode === "signup" ? 1 : 0;
        const nextIndex = nextMode === "signup" ? 1 : 0;
        setSlideDirection(nextIndex > currentIndex ? 1 : -1);
        setSwitchTick((prev) => prev + 1);
        setMode(nextMode);
    };

    const handleSignUp = async (
        email: string,
        password: string,
        username: string,
        fullName: string,
    ): Promise<boolean> => {
        return await signUp(email, password, { username, full_name: fullName });
    };

    const handleNewPassword = async (newPassword: string) => {
        const success = await changePassword(newPassword);
        if (success) {
            setTimeout(() => switchMode("signin"), 2000);
        }
    };

    if (isAuthenticated && user && !isRecoveryRoute) {
        return (
            <div className="relative h-dvh w-screen overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] flex items-center justify-center p-4">
                <div className="relative z-10 bg-white/85 rounded-2xl shadow-sm border border-white/70 p-8 max-w-sm w-full text-center backdrop-blur">
                    <h2 className="text-xl font-bold text-slate-900 mb-1">You're signed in!</h2>
                    <p className="text-slate-500 text-sm mb-6">Logged in as {user.email}</p>
                    <button
                        onClick={signOut}
                        disabled={loading}
                        className="w-full py-2.5 px-4 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 font-medium hover:bg-indigo-100 transition-colors disabled:opacity-50"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

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
                Go back to Home Page
            </Link>

            <div className="absolute left-1/2 top-3 z-20 -translate-x-1/2 lg:hidden">
                <img src="/images/logo-nobg.png" alt="Tokenly" className="h-28 w-auto object-contain sm:h-32" />
            </div>

            <div className="flex h-full w-full max-w-5xl items-center justify-center">
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
                                {/* Left panel: signin / reset / newpassword */}
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
                                        ) : mode === "newpassword" ? (
                                            <NewPasswordForm
                                                onSubmit={handleNewPassword}
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
                                    <VisualPanel mode={mode === "newpassword" ? "reset" : mode} />
                                </div>

                                {/* Right panel: signup */}
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
