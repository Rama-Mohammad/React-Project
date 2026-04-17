import { useEffect, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  Compass,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useProfiles from "../../hooks/useProfile";
import tokenlyLogo from "/images/nav-logo.svg";

const navLinkBase =
  "inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition duration-200";
const navLinkInactive =
  "text-slate-500 hover:bg-white/85 hover:text-slate-900";
const navLinkActive =
  "bg-white text-slate-900 shadow-[0_10px_24px_-18px_rgba(79,70,229,0.65)] ring-1 ring-slate-200/80";

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

  useEffect(() => {
    if (isAuthenticated && user) {
      void fetchProfileById(user.id);
    }
  }, [fetchProfileById, isAuthenticated, user]);

  useEffect(() => {
    function onOutsideClick(event: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setAvatarOpen(false);
      }
    }

    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    function onResize() {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileOpen]);

  async function handleSignOut() {
    await signOut();
    setAvatarOpen(false);
    setMobileOpen(false);
    navigate("/");
  }

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : (user?.email?.[0].toUpperCase() ?? "?");

  const sharedLinks = (onClick?: () => void) => (
    <>
      <NavLink to="/explore" className={getNavClass} onClick={onClick}>
        <Compass size={16} /> Explore
      </NavLink>
    </>
  );

  const authedLinks = (onClick?: () => void) => (
    <>
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
    <header className="sticky top-0 z-40 border-b border-white/55 bg-white/72 backdrop-blur-2xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center justify-start pl-[2px] lg:pl-[2px]">
          <NavLink
            to="/"
            className="flex shrink-0 items-center transition hover:opacity-95 -ml-2"
          >
            <img
              src={tokenlyLogo}
              alt="Tokenly"
              className="h-9 w-auto max-w-36.5 object-contain sm:max-w-42.5 lg:max-w-46.5"
            />
          </NavLink>
        </div>

        <div className="hidden items-center justify-center lg:flex">
          <nav className="flex items-center gap-1 rounded-full border border-white/70 bg-white/45 px-2 py-2 shadow-[0_14px_30px_-28px_rgba(79,70,229,0.5)]">
            <NavLink to="/" className={getNavClass}>
              <Home size={16} /> Home
            </NavLink>
            {sharedLinks()}
            {isAuthenticated && authedLinks()}
          </nav>
        </div>

        <div className="flex items-center justify-end gap-2 pl-4 lg:pl-0 sm:gap-3">
          {loading ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" />
          ) : isAuthenticated ? (
            <div className="relative" ref={avatarRef}>
              <button
                type="button"
                onClick={() => setAvatarOpen((previous) => !previous)}
                className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-indigo-200/80 bg-[linear-gradient(135deg,#eef2ff_0%,#f5f3ff_100%)] text-sm font-bold text-indigo-700 shadow-[0_14px_26px_-24px_rgba(79,70,229,0.7)] transition hover:border-indigo-300 hover:shadow-[0_18px_32px_-24px_rgba(79,70,229,0.9)]"
                aria-label="Open profile menu"
              >
                {profile?.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt="User avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </button>

              {avatarOpen ? (
                <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_24px_60px_-32px_rgba(79,70,229,0.45)] backdrop-blur-xl">
                  <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(238,242,255,0.9)_0%,rgba(245,243,255,0.95)_100%)] px-4 py-4">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {profile?.full_name ?? profile?.username ?? "User"}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">{user?.email}</p>
                  </div>

                  <div className="p-2">
                    <Link
                      to="/profile"
                      onClick={() => setAvatarOpen(false)}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <User size={15} /> View profile
                    </Link>
                    <Link
                      to="/my-offers"
                      onClick={() => setAvatarOpen(false)}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <BriefcaseBusiness size={15} /> My offers
                    </Link>
                    <Link
                      to="/account-settings"
                      onClick={() => setAvatarOpen(false)}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <Settings size={15} /> Account Settings
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                      <LogOut size={15} /> Sign out
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                to="/auth"
                className="rounded-full border border-slate-200/90 bg-white/85 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white hover:text-slate-900"
              >
                Sign in
              </Link>
              <Link
                to="/auth?mode=signup"
                className="rounded-full bg-[linear-gradient(135deg,#4f46e5_0%,#7c3aed_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_34px_-22px_rgba(79,70,229,0.75)] transition hover:brightness-105"
              >
                Sign up
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((previous) => !previous)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/90 bg-white/90 text-slate-700 shadow-[0_14px_30px_-28px_rgba(79,70,229,0.6)] transition hover:bg-white lg:hidden"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/70 bg-white/92 px-4 pb-4 pt-3 shadow-[0_18px_36px_-32px_rgba(79,70,229,0.45)] backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-2">
            <NavLink to="/" className={getNavClass} onClick={() => setMobileOpen(false)}>
              <Home size={16} /> Home
            </NavLink>
            {sharedLinks(() => setMobileOpen(false))}
            {isAuthenticated ? (
              authedLinks(() => setMobileOpen(false))
            ) : (
              <>
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Sign in
                </Link>
                <Link
                  to="/auth?mode=signup"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl bg-[linear-gradient(135deg,#4f46e5_0%,#7c3aed_100%)] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-105"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}