import { Compass, Heart, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-10 border-t border-white/55 bg-white/60 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(224,236,255,0.35)_100%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-5 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-6">
        <div>
          <Link to="/" className="inline-flex items-center">
            <img src="/images/logo-nobg.png" alt="Tokenly" className="h-28 w-auto object-contain" />
          </Link>

          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
            A peer-to-peer learning network powered by credits. Help others, learn faster, and keep
            sessions fair and structured.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/65 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600">
            <Heart size={13} className="text-rose-500" />
            Built for reciprocal learning
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quick Links</p>
          <div className="mt-3 space-y-2">
            <Link to="/explore" className="block text-sm text-slate-700 transition hover:text-indigo-600">
              Explore
            </Link>
            <Link to="/dashboard" className="block text-sm text-slate-700 transition hover:text-indigo-600">
              Dashboard
            </Link>
            <Link to="/explore?modal=how-it-works" className="block text-sm text-slate-700 transition hover:text-indigo-600">
              How it works
            </Link>
            <Link to="/profile" className="block text-sm text-slate-700 transition hover:text-indigo-600">
              Profile
            </Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Support</p>
          <div className="mt-3 space-y-2 text-sm">
            <a
              href="mailto:support@tokenly.app"
              className="inline-flex items-center gap-2 text-slate-700 transition hover:text-indigo-600"
            >
              <Mail size={14} />
              support@tokenly.app
            </a>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Compass size={13} />
              Browse Requests
            </Link>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/50">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-xs text-slate-500 sm:px-5 md:flex-row md:items-center md:justify-between lg:px-6">
          <p>© {year} Tokenly. All rights reserved.</p>
          <p>Fair sessions. Verified outcomes. Credit-backed learning.</p>
        </div>
      </div>
    </footer>
  );
}
