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
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Reset your password</h1>
        <p className="text-slate-500">Enter your email and we'll send you a link to reset your password</p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50/90 p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        </div>
      )}

      {/* Success alert */}
      {successMessage && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50/90 p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-emerald-700">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700 mb-1.5">
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
            className={`w-full px-4 py-3 rounded-lg border bg-white text-slate-900 placeholder-slate-400
              transition-colors outline-none
              ${touched && fieldError
                ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              }`}
          />
          {touched && fieldError && (
            <p className="mt-1.5 text-sm text-rose-500">{fieldError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500 py-3 px-4 text-white font-medium
            hover:brightness-105 transition
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
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

      {/* Back link */}
      <p className="mt-6 text-center text-sm text-slate-500">
        Remember your password?{" "}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          Back to sign in
        </button>
      </p>
    </div>
  );
}
