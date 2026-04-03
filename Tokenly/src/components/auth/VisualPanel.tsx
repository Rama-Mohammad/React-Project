type AuthMode = "signin" | "signup" | "reset";

interface VisualPanelProps {
  mode: AuthMode;
}

export default function VisualPanel({ mode }: VisualPanelProps) {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-12">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-16 h-16 rounded-xl bg-slate-900 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>

      {/* Dynamic heading */}
      <h2 className="text-2xl font-bold text-slate-900 text-center mb-3">
        {mode === "signin" && "Welcome back to PeerCredit"}
        {mode === "signup" && "Join the PeerCredit community"}
        {mode === "reset" && "We'll help you get back in"}
      </h2>

      {/* Dynamic description */}
      <p className="text-slate-500 text-center max-w-sm mb-10">
        {mode === "signin" &&
          "Your peers are waiting. Pick up where you left off — check new offers, join live sessions, and keep building your skills."}
        {mode === "signup" &&
          "Start with 10 free credits. Help others with what you know, learn what you don't. Every session makes both sides stronger."}
        {mode === "reset" &&
          "No worries — it happens to everyone. We'll send you a link to set a new password."}
      </p>

      {/* Stats */}
      <div className="flex gap-8">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-900">1.2k+</p>
          <p className="text-sm text-slate-500">Sessions completed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-900">4.8</p>
          <p className="text-sm text-slate-500">Avg. rating</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-900">500+</p>
          <p className="text-sm text-slate-500">Active helpers</p>
        </div>
      </div>

      {/* Image/animation placeholder — replace later */}
      <div className="mt-10 w-full max-w-sm h-48 rounded-xl bg-slate-100 border-2 border-dashed border-slate-200
        flex items-center justify-center text-slate-400 text-sm">
        Image / Animation placeholder
      </div>
    </div>
  );
}