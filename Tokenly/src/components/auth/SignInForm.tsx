import { useState } from "react";
import type { SignInFormProps } from "../../types/auth";

// function validateEmail(email: string): string | null {
//   if (!email.trim()) return "Email is required";
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address";
//   return null;
// }
function validateIdentifier(identifier: string): string | null {
  if (!identifier.trim()) return "Email or username is required";
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
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

    const emailErr = validateIdentifier(email) ?? undefined;
    const passErr = validatePassword(password) ?? undefined;

    setFieldErrors({ email: emailErr, password: passErr });
    setTouched({ email: true, password: true });

    if (emailErr || passErr) return;

    await onSubmit(email, password);
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email") {
      setFieldErrors((prev) => ({ ...prev, email: validateIdentifier(email) ?? undefined }));
    } else {
      setFieldErrors((prev) => ({ ...prev, password: validatePassword(password) ?? undefined }));
    }
  };

  

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/70 bg-white/60 p-4 shadow-[0_20px_60px_-30px_rgba(79,70,229,0.55)] backdrop-blur-md sm:p-5">
      <div className="mb-4">
        <h1 className="mb-1 text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">Sign in to your Tokenly account to continue</p>
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
          <label htmlFor="signin-email" className="mb-1 block text-xs font-semibold text-slate-700">
            Email address or username
          </label>
          <input
            id="signin-email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={loading}
            className={`w-full rounded-xl border bg-white/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors
              ${touched.email && fieldErrors.email
                ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              }`}
          />
          {touched.email && fieldErrors.email && <p className="mt-1.5 text-sm text-rose-500">{fieldErrors.email}</p>}
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="signin-password" className="block text-xs font-semibold text-slate-700">
              Password
            </label>
            <button
              type="button"
              onClick={onSwitchToReset}
              className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700"
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
          {touched.password && fieldErrors.password && <p className="mt-1.5 text-sm text-rose-500">{fieldErrors.password}</p>}
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
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-slate-500">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="font-medium text-indigo-600 transition-colors hover:text-indigo-700"
        >
          Create a new account
        </button>
      </p>
    </div>
  );
}

