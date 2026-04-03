import { useState } from "react";

// ── Validation helpers ──
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

function validateConfirmPassword(password: string, confirm: string): string | null {
  if (!confirm) return "Please confirm your password";
  if (password !== confirm) return "Passwords do not match";
  return null;
}

function validateUsername(username: string): string | null {
  if (!username.trim()) return "Username is required";
  if (username.length < 3) return "Username must be at least 3 characters";
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Only letters, numbers, and underscores";
  return null;
}

function getPasswordStrength(pw: string) {
  if (!pw) return { label: "", color: "", width: "0%" };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 2) return { label: "Weak", color: "bg-rose-500", width: "33%" };
  if (score <= 3) return { label: "Medium", color: "bg-amber-500", width: "66%" };
  return { label: "Strong", color: "bg-emerald-500", width: "100%" };
}

// ── Props ──
interface SignUpFormProps {
  onSubmit: (email: string, password: string, username: string, fullName: string) => Promise<boolean>;
  onSwitchToSignIn: () => void;
  loading: boolean;
  error: string;
  successMessage: string;
}

export default function SignUpForm({
  onSubmit,
  onSwitchToSignIn,
  loading,
  error,
  successMessage,
}: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string | undefined> = {
      email: validateEmail(email) ?? undefined,
      username: validateUsername(username) ?? undefined,
      fullName: !fullName.trim() ? "Full name is required" : undefined,
      password: validatePassword(password) ?? undefined,
      confirmPassword: validateConfirmPassword(password, confirmPassword) ?? undefined,
    };

    setFieldErrors(errors);
    setTouched({ email: true, username: true, fullName: true, password: true, confirmPassword: true });

    if (Object.values(errors).some(Boolean)) return;

    await onSubmit(email, password, username, fullName);
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    const validators: Record<string, () => string | null> = {
      email: () => validateEmail(email),
      username: () => validateUsername(username),
      fullName: () => (!fullName.trim() ? "Full name is required" : null),
      password: () => validatePassword(password),
      confirmPassword: () => validateConfirmPassword(password, confirmPassword),
    };

    if (validators[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: validators[field]() ?? undefined }));
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-lg border bg-white text-slate-900 placeholder-slate-400
     transition-colors outline-none
     ${touched[field] && fieldErrors[field]
       ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
       : "border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
     }`;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
        <p className="text-slate-500">Join PeerCredit and start earning credits by helping others</p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-rose-50 border border-rose-200">
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
        <div className="mb-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-emerald-700">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full name + Username side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="signup-fullname" className="block text-sm font-medium text-slate-700 mb-1.5">
              Full name
            </label>
            <input
              id="signup-fullname"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => handleBlur("fullName")}
              placeholder="Jordan Lee"
              disabled={loading}
              className={inputClass("fullName")}
            />
            {touched.fullName && fieldErrors.fullName && (
              <p className="mt-1 text-sm text-rose-500">{fieldErrors.fullName}</p>
            )}
          </div>
          <div>
            <label htmlFor="signup-username" className="block text-sm font-medium text-slate-700 mb-1.5">
              Username
            </label>
            <input
              id="signup-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => handleBlur("username")}
              placeholder="jordanlee"
              autoComplete="username"
              disabled={loading}
              className={inputClass("username")}
            />
            {touched.username && fieldErrors.username && (
              <p className="mt-1 text-sm text-rose-500">{fieldErrors.username}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700 mb-1.5">
            Email address
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={loading}
            className={inputClass("email")}
          />
          {touched.email && fieldErrors.email && (
            <p className="mt-1 text-sm text-rose-500">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              disabled={loading}
              className={`${inputClass("password")} pr-12`}
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
          {/* Strength bar */}
          {password && (
            <div className="mt-2">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${strength.color} rounded-full transition-all duration-300`}
                  style={{ width: strength.width }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Password strength: <span className="font-medium">{strength.label}</span>
              </p>
            </div>
          )}
          {touched.password && fieldErrors.password && (
            <p className="mt-1 text-sm text-rose-500">{fieldErrors.password}</p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="signup-confirm" className="block text-sm font-medium text-slate-700 mb-1.5">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="signup-confirm"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => handleBlur("confirmPassword")}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              disabled={loading}
              className={`${inputClass("confirmPassword")} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
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
          {touched.confirmPassword && fieldErrors.confirmPassword && (
            <p className="mt-1 text-sm text-rose-500">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        {/* Terms */}
        <p className="text-xs text-slate-400">
          By creating an account, you agree to PeerCredit's{" "}
          <a href="#" className="text-purple-600 hover:text-purple-700">Terms of Service</a>{" "}
          and{" "}
          <a href="#" className="text-purple-600 hover:text-purple-700">Privacy Policy</a>
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg bg-slate-900 text-white font-medium
            hover:bg-slate-800 active:bg-slate-950 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Switch link */}
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}