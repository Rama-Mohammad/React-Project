import { useEffect, useRef, useState } from "react";
import { Compass, CalendarDays, LayoutDashboard, Menu, User, LogOut, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useProfiles from "../../hooks/useProfile";

const navLinkBase =
  "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition border";
const navLinkInactive =
  "bg-white/50 border-white/40 text-slate-500 hover:bg-white/60";
const navLinkActive =
  "bg-white text-slate-900 border-slate-200 shadow-sm";

function getNavClass({ isActive }: { isActive: boolean }) {
  return `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`;
}

export default function Navbar() {
  const { user, isAuthenticated, signOut, loading } = useAuth();
  const { profile, fetchProfileById } = useProfiles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch profile once authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      void fetchProfileById(user.id);
    }
  }, [isAuthenticated, user?.id]);

  // Close avatar dropdown on outside click
  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  async function handleSignOut() {
    await signOut();
    setAvatarOpen(false);
    navigate("/");
  }

  // Fallback initials for avatar
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : (user?.email?.[0].toUpperCase() ?? "?");

  const authedLinks = (onClick?: () => void) => (
    <>
      <NavLink to="/explore" className={getNavClass} onClick={onClick}>
        <Compass size={16} /> Explore
      </NavLink>
      <NavLink to="/dashboard" className={getNavClass} onClick={onClick}>
        <LayoutDashboard size={16} /> Dashboard
      </NavLink>
      <NavLink to="/sessions" className={getNavClass} onClick={onClick}>
        <CalendarDays size={16} /> Sessions
      </NavLink>
      <NavLink to="/profile" className={getNavClass} onClick={onClick}>
        <User size={16} /> Profile
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5 sm:px-5 lg:px-6">

        {/* Left: logo + desktop nav */}
        <div className="flex items-center gap-8">
          <NavLink to="/" className="flex items-center">
            <img
              src="/images/logo-nobg.png"
              alt="PeerCredit"
              className="h-14 w-auto origin-left scale-170 object-contain"
            />
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/" className={getNavClass}>
              <Compass size={16} /> Home
            </NavLink>
            {isAuthenticated && authedLinks()}
          </nav>
        </div>

        {/* Right: auth area */}
        <div className="flex items-center gap-2">

          {/* Loading skeleton */}
          {loading && (
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-100" />
          )}

          {/* Signed in: avatar + dropdown */}
          {!loading && isAuthenticated && (
            <div className="relative" ref={avatarRef}>
              <button
                onClick={() => setAvatarOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-purple-50 text-sm font-semibold text-purple-700 transition hover:border-purple-400"
              >
                {profile?.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </button>

              {avatarOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {profile?.full_name ?? profile?.username ?? "User"}
                    </p>
                    <p className="truncate text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <Link
                      to="/profile"
                      onClick={() => setAvatarOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <User size={15} /> View profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
                    >
                      <LogOut size={15} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Signed out: sign in + sign up */}
          {!loading && !isAuthenticated && (
            <>
              <Link
                to="/auth"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Sign in
              </Link>
              <Link
                to="/auth?mode=signup"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Sign up
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 md:hidden"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white/95 px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            <NavLink to="/" className={getNavClass} onClick={() => setMobileOpen(false)}>
              <Compass size={16} /> Home
            </NavLink>
            {isAuthenticated && authedLinks(() => setMobileOpen(false))}
            {!isAuthenticated && (
              <Link
                to="/auth"
                className={`${navLinkBase} ${navLinkInactive}`}
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}