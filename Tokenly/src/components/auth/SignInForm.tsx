import { useState } from "react";

// ── Validation helpers (you can move these to a shared utils/validators.ts) ──
function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address";
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
}

// ── Props ──
interface SignInFormProps {
  onSubmit: (email: string, password: string) => Promise<boolean>;
  onSwitchToSignUp: () => void;
  onSwitchToReset: () => void;
  loading: boolean;
  error: string;
  successMessage: string;
}

export default function SignInForm({
  onSubmit,
  onSwitchToSignUp,
  onSwitchToReset,
  loading,
  error,
  successMessage,
}: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(email) ?? undefined;
    const passErr = validatePassword(password) ?? undefined;

    setFieldErrors({ email: emailErr, password: passErr });
    setTouched({ email: true, password: true });

    if (emailErr || passErr) return;

    await onSubmit(email, password);
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email") {
      setFieldErrors((prev) => ({ ...prev, email: validateEmail(email) ?? undefined }));
    } else {
      setFieldErrors((prev) => ({ ...prev, password: validatePassword(password) ?? undefined }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
        <p className="text-slate-500">Sign in to your Tokenly account to continue</p>
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
        {/* Email */}
        <div>
          <label htmlFor="signin-email" className="block text-sm font-medium text-slate-700 mb-1.5">
            Email address
          </label>
          <input
            id="signin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={loading}
            className={`w-full px-4 py-3 rounded-lg border bg-white text-slate-900 placeholder-slate-400
              transition-colors outline-none
              ${touched.email && fieldErrors.email
                ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              }`}
          />
          {touched.email && fieldErrors.email && (
            <p className="mt-1.5 text-sm text-rose-500">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="signin-password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <button
              type="button"
              onClick={onSwitchToReset}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
              className={`w-full px-4 py-3 pr-12 rounded-lg border bg-white text-slate-900 placeholder-slate-400
                transition-colors outline-none
                ${touched.password && fieldErrors.password
                  ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                  : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {touched.password && fieldErrors.password && (
            <p className="mt-1.5 text-sm text-rose-500">{fieldErrors.password}</p>
          )}
        </div>

        {/* Submit */}
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
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Switch link */}
      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          Create a new account
        </button>
      </p>
    </div>
  );
}
