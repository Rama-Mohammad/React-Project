import { Link } from "react-router-dom";
import { Building2, ChevronRight, Compass, Headphones, ShieldCheck } from "lucide-react";
import useAuthRedirect from "../../hooks/useAuthRedirect";

export default function Footer() {
  const { isAuthenticated, authRedirectState } = useAuthRedirect();
  const year = new Date().getFullYear();
  const iconHoverClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-500 transition-all duration-200 hover:scale-105 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600";
  const titleClass =
    "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-500";
  const linkHoverClass =
    "group inline-flex items-center gap-1.5 text-slate-600 transition-colors duration-200 hover:text-indigo-600";
  const policyHoverClass =
    "transition-colors duration-200 hover:text-indigo-600";
  const gatedLink = (path: string) => (isAuthenticated ? path : "/auth");
  const linkChevron = (
    <ChevronRight size={12} className="opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
  );

  return (
    <footer className="relative mt-10 border-t border-gray-200/70 bg-white/70 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(224,236,255,0.35)_100%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-5 lg:px-6">
        <div className="grid items-start gap-10 text-center md:text-left md:grid-cols-[1.5fr_0.75fr_0.75fr_0.75fr]">
          <div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-500">
              Connect, learn, and earn through real-time peer sessions.
              Exchange skills, gain experience, and grow together.
            </p>

            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-gray-400">Follow us</p>
            <div className="mt-3 flex items-center justify-center gap-3 md:justify-start">
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
            <p className={titleClass}>
              <Compass size={14} />
              Platform
            </p>
            <div className="mx-auto mt-2 h-px w-8 bg-indigo-500/70 md:mx-0" />
            <div className="mt-4 flex flex-col items-center gap-2.5 text-sm md:items-start">
              <Link to="/home" className={linkHoverClass}>Home{linkChevron}</Link>
              <Link to="/explore" className={linkHoverClass}>Explore{linkChevron}</Link>
              <Link to={gatedLink("/dashboard")} state={!isAuthenticated ? authRedirectState : undefined} className={linkHoverClass}>Dashboard{linkChevron}</Link>
              <Link to={gatedLink("/sessions")} state={!isAuthenticated ? authRedirectState : undefined} className={linkHoverClass}>Sessions{linkChevron}</Link>
              <Link to={gatedLink("/profile")} state={!isAuthenticated ? authRedirectState : undefined} className={linkHoverClass}>Profile{linkChevron}</Link>
            </div>
          </div>

          <div>
            <p className={titleClass}>
              <Building2 size={14} />
              Services
            </p>
            <div className="mx-auto mt-2 h-px w-8 bg-indigo-500/70 md:mx-0" />
            <div className="mt-4 flex flex-col items-center gap-2.5 text-sm md:items-start">
              <Link to="/explore?tab=requests#explore-tabs-bar" className={linkHoverClass}>Browse Requests{linkChevron}</Link>
              <Link to="/explore?tab=helpers#explore-tabs-bar" className={linkHoverClass}>Find Helpers{linkChevron}</Link>
              <Link to="/explore?tab=skills#explore-tabs-bar" className={linkHoverClass}>Explore Skills{linkChevron}</Link>
              <Link to={gatedLink("/sessions?filter=active")} state={!isAuthenticated ? authRedirectState : undefined} className={linkHoverClass}>Live Sessions{linkChevron}</Link>
              <Link to={gatedLink("/request/new")} state={!isAuthenticated ? authRedirectState : undefined} className={linkHoverClass}>Create Request{linkChevron}</Link>
            </div>
          </div>

          <div>
            <p className={titleClass}>
              <Headphones size={14} />
              Support
            </p>
            <div className="mx-auto mt-2 h-px w-8 bg-indigo-500/70 md:mx-0" />
            <div className="mt-4 flex flex-col items-center gap-2.5 text-sm md:items-start">
              <Link to="/help" className={linkHoverClass}>Help Center{linkChevron}</Link>
              <Link to="/guidelines" className={linkHoverClass}>Community Guidelines{linkChevron}</Link>
              <Link to="/report" className={linkHoverClass}>Report an Issue{linkChevron}</Link>
              <Link to="/faqs" className={linkHoverClass}>FAQs{linkChevron}</Link>
              <Link to="/account-safety" className={linkHoverClass}>Account &amp; Safety{linkChevron}</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200/70" />

        <div className="mt-6 flex flex-col items-center gap-3 text-center text-xs text-gray-500 md:flex-row md:items-center md:justify-between md:text-left">
          <p className="inline-flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
              <ShieldCheck size={15} strokeWidth={2.1} />
            </span>
            © {year} Tokenly. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <Link to="/privacy" className={policyHoverClass}>Privacy Policy</Link>
            <span className="text-gray-300">|</span>
            <Link to="/terms" className={policyHoverClass}>Terms of Service</Link>
            <span className="text-gray-300">|</span>
            <Link to="/cookies" className={policyHoverClass}>Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
