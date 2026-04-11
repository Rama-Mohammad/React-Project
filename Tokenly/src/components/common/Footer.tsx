import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Footer() {
  const { isAuthenticated } = useAuth();
  const year = new Date().getFullYear();
  const iconHoverClass =
    "inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/70 transition duration-500 hover:-translate-y-1 hover:scale-110 hover:rotate-3 hover:border-indigo-300 hover:bg-[linear-gradient(135deg,#eef2ff_0%,#ede9fe_100%)] hover:text-indigo-600 hover:shadow-[0_12px_24px_-14px_rgba(99,102,241,0.85)]";
  const titleHoverClass =
    "text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 transition duration-300 hover:text-indigo-700";
  const linkHoverClass =
    "group relative isolate block -mx-2 overflow-hidden rounded-lg px-2 py-1 transition duration-300 hover:translate-x-1 hover:bg-[linear-gradient(90deg,rgba(224,231,255,0.6)_0%,rgba(237,233,254,0.7)_100%)] hover:text-indigo-700 hover:shadow-[0_10px_20px_-14px_rgba(99,102,241,0.9)] before:absolute before:inset-y-0 before:-left-10 before:w-8 before:skew-x-12 before:bg-white/70 before:opacity-0 before:transition-all before:duration-500 hover:before:left-[120%] hover:before:opacity-100";
  const policyHoverClass =
    "group relative isolate -mx-1.5 overflow-hidden rounded-md px-1.5 py-0.5 transition duration-300 hover:bg-[linear-gradient(90deg,rgba(224,231,255,0.6)_0%,rgba(237,233,254,0.7)_100%)] hover:text-indigo-700 before:absolute before:inset-y-0 before:-left-8 before:w-6 before:skew-x-12 before:bg-white/70 before:opacity-0 before:transition-all before:duration-500 hover:before:left-[115%] hover:before:opacity-100";
  const gatedLink = (path: string) => (isAuthenticated ? path : "/auth");

  return (
    <footer className="relative mt-10 border-t border-slate-300/70 bg-white/60 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(224,236,255,0.35)_100%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-5 lg:px-6">
        <div className="grid gap-8 md:grid-cols-[1.5fr_0.75fr_0.75fr_0.75fr]">
          <div>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
              Connect, learn, and earn through real-time peer sessions.
              Exchange skills, gain experience, and grow together.
            </p>

            <div className="mt-5 flex items-center gap-3 text-slate-600">
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className={iconHoverClass}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M18.901 2.25h3.68l-8.041 9.19L24 21.75h-7.406l-5.8-7.584L4.151 21.75H.469l8.6-9.834L0 2.25h7.594l5.243 6.934L18.901 2.25Zm-1.291 17.296h2.04L6.486 4.347H4.297L17.61 19.546Z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className={iconHoverClass}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 2.7a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z" />
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className={iconHoverClass}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M13.5 21v-7h2.4l.36-2.8H13.5V9.41c0-.81.23-1.36 1.39-1.36h1.49V5.54A19.9 19.9 0 0 0 14.2 5c-2.16 0-3.64 1.32-3.64 3.74v2.46H8.1V14h2.46v7h2.94Z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <Link to="/explore" className={titleHoverClass}>Explore</Link>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <Link to="/home" className={linkHoverClass}>Home</Link>
              <Link to="/explore" className={linkHoverClass}>Explore</Link>
              <Link to={gatedLink("/dashboard")} className={linkHoverClass}>Dashboard</Link>
              <Link to={gatedLink("/sessions")} className={linkHoverClass}>Sessions</Link>
              <Link to={gatedLink("/profile")} className={linkHoverClass}>Profile</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Company</p>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <Link to={gatedLink("/explore")} className={linkHoverClass}>Browse Requests</Link>
              <Link to={gatedLink("/explore?tab=helpers#explore-tabs-bar")} className={linkHoverClass}>Find Helpers</Link>
              <Link to={gatedLink("/explore?tab=skills#explore-tabs-bar")} className={linkHoverClass}>Explore Skills</Link>
              <Link to={gatedLink("/sessions?status=active")} className={linkHoverClass}>Live Sessions</Link>
              <Link to={gatedLink("/helpers/h1/request")} className={linkHoverClass}>Create Request</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Support</p>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <Link to="/help" className={linkHoverClass}>Help Center</Link>
              <Link to="/guidelines" className={linkHoverClass}>Community Guidelines</Link>
              <Link to="/report" className={linkHoverClass}>Report an Issue</Link>
              <Link to="/faqs" className={linkHoverClass}>FAQs</Link>
              <Link to="/account-safety" className={linkHoverClass}>Account &amp; Safety</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-300/70" />

        <div className="mt-4 flex flex-col gap-2 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>(c) {year} Tokenly. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className={policyHoverClass}>Privacy Policy</Link>
            <Link to="/terms" className={policyHoverClass}>Terms of Service</Link>
            <Link to="/cookies" className={policyHoverClass}>Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
