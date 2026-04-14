import { useState } from "react";

function validatePassword(password: string): string | null {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
}

function validateConfirmPassword(password: string, confirm: string): string | null {
    if (!confirm) return "Please confirm your password";
    if (password !== confirm) return "Passwords do not match";
    return null;
}

function getPasswordStrength(password: string) {
    if (!password) return { label: "", color: "", width: "0%" };

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { label: "Weak", color: "bg-rose-500", width: "33%" };
    if (score <= 3) return { label: "Medium", color: "bg-amber-500", width: "66%" };
    return { label: "Strong", color: "bg-emerald-500", width: "100%" };
}

interface NewPasswordFormProps {
    onSubmit: (newPassword: string) => Promise<void>;
    loading: boolean;
    error: string;
    successMessage: string;
}

export default function NewPasswordForm({
    onSubmit,
    loading,
    error,
    successMessage,
}: NewPasswordFormProps) {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirm?: string }>({});
    const [touched, setTouched] = useState<{ password?: boolean; confirm?: boolean }>({});

    const strength = getPasswordStrength(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const passErr = validatePassword(password) ?? undefined;
        const confirmErr = validateConfirmPassword(password, confirm) ?? undefined;
        setFieldErrors({ password: passErr, confirm: confirmErr });
        setTouched({ password: true, confirm: true });
        if (passErr || confirmErr) return;
        await onSubmit(password);
    };

    return (
        <div className="mx-auto w-full max-w-md rounded-2xl border border-white/70 bg-white/60 p-4 shadow-[0_20px_60px_-30px_rgba(79,70,229,0.55)] backdrop-blur-md sm:p-5">
            <div className="mb-4">
                <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
                    New Password
                </span>
                <h1 className="mt-2 mb-1 text-2xl font-bold text-slate-900">Set a new password</h1>
                <p className="text-sm text-slate-500">Choose a strong password for your account</p>
            </div>

            {error && (
                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50/90 p-4">
                    <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-rose-700">{error}</p>
                    </div>
                </div>
            )}

            {successMessage && (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50/90 p-4">
                    <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-sm text-emerald-700">{successMessage}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                    <label htmlFor="new-password" className="mb-1 block text-xs font-semibold text-slate-700">
                        New password
                    </label>
                    <div className="relative">
                        <input
                            id="new-password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => {
                                setTouched((p) => ({ ...p, password: true }));
                                setFieldErrors((p) => ({ ...p, password: validatePassword(password) ?? undefined }));
                            }}
                            placeholder="At least 6 characters"
                            autoComplete="new-password"
                            disabled={loading}
                            className={`w-full rounded-xl border bg-white/90 px-3.5 py-2.5 pr-12 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors
                ${touched.password && fieldErrors.password
                                    ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                                    : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {touched.password && fieldErrors.password && (
                        <p className="mt-1.5 text-sm text-rose-500">{fieldErrors.password}</p>
                    )}

                    {password && (
                        <div className="mt-2">
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                                    style={{ width: strength.width }}
                                />
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                Password strength: <span className="font-medium">{strength.label}</span>
                            </p>
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="confirm-password" className="mb-1 block text-xs font-semibold text-slate-700">
                        Confirm new password
                    </label>
                    <input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        onBlur={() => {
                            setTouched((p) => ({ ...p, confirm: true }));
                            setFieldErrors((p) => ({ ...p, confirm: validateConfirmPassword(password, confirm) ?? undefined }));
                        }}
                        placeholder="Re-enter your new password"
                        autoComplete="new-password"
                        disabled={loading}
                        className={`w-full rounded-xl border bg-white/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors
              ${touched.confirm && fieldErrors.confirm
                                ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                                : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            }`}
                    />
                    {touched.confirm && fieldErrors.confirm && (
                        <p className="mt-1.5 text-sm text-rose-500">{fieldErrors.confirm}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-linear-to-r from-indigo-500 via-sky-500 to-indigo-500 py-3 px-4 text-white font-medium
            hover:brightness-105 transition
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Updating...
                        </>
                    ) : (
                        "Update Password"
                    )}
                </button>
            </form>
        </div>
    );
}