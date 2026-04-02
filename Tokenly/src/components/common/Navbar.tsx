import { Compass, CalendarDays, LayoutDashboard, Menu, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import tokenlyLogo from "../../assets/tokenly-logo-cropped.png";

const navLinkBase =
  "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition border";
const navLinkInactive = "bg-white/50 border-white/40 text-slate-500 hover:bg-white/60";
const navLinkActive = "bg-white text-slate-900 border-slate-200 shadow-sm";

function getNavClass({ isActive }: { isActive: boolean }) {
  return `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`;
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-5 lg:px-6">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="flex items-center">
            <img src={tokenlyLogo} alt="Tokenly" className="h-9 w-auto object-contain" />
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/" className={getNavClass}>
              <Compass size={16} />
              Home
            </NavLink>

            <NavLink to="/explore" className={getNavClass}>
              <Compass size={16} />
              Explore
            </NavLink>

            <NavLink to="/dashboard" className={getNavClass}>
              <LayoutDashboard size={16} />
              Dashboard
            </NavLink>

            <NavLink to="/sessions" className={getNavClass}>
              <CalendarDays size={16} />
              Sessions
            </NavLink>

            <NavLink to="/profile" className={getNavClass}>
              <User size={16} />
              Profile
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Sign in
          </button>

          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 md:hidden">
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
