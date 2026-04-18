import type { VisualPanelProps } from "../../types/auth";
import tokelyGraphic from '../../assets/tokenly-graphic.svg';

export default function VisualPanel({ mode }: VisualPanelProps) {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-[linear-gradient(140deg,#eef4ff_0%,#e8f8ff_45%,#f3efff_100%)] p-8 xl:p-10">
      <div className="mb-5">
        <img src="https://cggkruccjfhgxhqkjamk.supabase.co/storage/v1/object/public/assets/tokenly-logo.svg" alt="Tokenly" className="h-44 w-auto object-contain" />
      </div>

      <h2 className="mb-3 text-center text-2xl font-bold text-slate-900">
        {mode === "signin" && "Welcome back to Tokenly"}
        {mode === "signup" && "Join the Tokenly community"}
        {mode === "reset" && "We'll help you get back in"}
      </h2>

      <p className="mb-6 max-w-sm text-center text-slate-500">
        {mode === "signin" &&
          "Your peers are waiting. Pick up where you left off - check new offers, join live sessions, and keep building your skills."}
        {mode === "signup" &&
          "Start with 10 free tokens. Help others with what you know, learn what you don't. Every session makes both sides stronger."}
        {mode === "reset" &&
          "No worries - it happens to everyone. We'll send you a link to set a new password."}
      </p>

      <div className="flex gap-6">
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

      <div className="mt-10 flex w-full max-w-sm justify-center">
        <img
          src={tokelyGraphic}
          alt="Tokenly peer learning illustration"
          className="h-64 w-auto object-contain"
        />
      </div>
    </div>
  );
}

