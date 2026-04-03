import { useState } from "react";

function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address";
  return null;
}

interface ResetPasswordFormProps {
  onSubmit: (email: string) => Promise<boolean>;
  onSwitchToSignIn: () => void;
  loading: boolean;
  error: string;
  successMessage: string;
}

export default function ResetPasswordForm({
  onSubmit,
  onSwitchToSignIn,
  loading,
  error,
  successMessage,
}: ResetPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validateEmail(email) ?? undefined;
    setFieldError(err);
    setTouched(true);

    if (err) return;

    await onSubmit(email);
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/70 bg-white/60 p-4 shadow-[0_20px_60px_-30px_rgba(79,70,229,0.55)] backdrop-blur-md sm:p-5">
      <div className="mb-4">
        <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-violet-700">
          Recovery
        </span>
        <h1 className="mt-2 mb-1 text-2xl font-bold text-slate-900">Reset your password</h1>
        <p className="text-sm text-slate-500">Enter your email and we'll send you a link to reset your password</p>
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

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <div>
          <label htmlFor="reset-email" className="mb-1 block text-xs font-semibold text-slate-700">
            Email address
          </label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              setTouched(true);
              setFieldError(validateEmail(email) ?? undefined);
            }}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={loading}
            className={`w-full rounded-xl border bg-white/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors
              ${touched && fieldError
                ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              }`}
          />
          {touched && fieldError && <p className="mt-1.5 text-sm text-rose-500">{fieldError}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 px-4 py-2.5 text-sm font-medium text-white shadow-[0_10px_30px_-15px_rgba(99,102,241,0.85)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending link...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-slate-500">
        Remember your password?{" "}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="font-medium text-indigo-600 transition-colors hover:text-indigo-700"
        >
          Back to sign in
        </button>
      </p>
    </div>
  );
}
