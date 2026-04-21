import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

type AuthMode = "signin" | "signup" | "reset" | "newpassword";

export type AuthRedirectState = {
  from: string;
};

export function buildAuthPath(mode: AuthMode = "signin") {
  return `/auth?mode=${mode}`;
}

export default function useAuthRedirect() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const from = useMemo(
    () => `${location.pathname}${location.search}${location.hash}`,
    [location.hash, location.pathname, location.search]
  );

  const authRedirectState = useMemo<AuthRedirectState>(() => ({ from }), [from]);

  const redirectToAuth = useCallback(
    (mode: AuthMode = "signin") => {
      navigate(buildAuthPath(mode), {
        state: authRedirectState,
      });
    },
    [authRedirectState, navigate]
  );

  const requireAuth = useCallback(
    (action: () => void, mode: AuthMode = "signin") => {
      if (!user) {
        redirectToAuth(mode);
        return false;
      }

      action();
      return true;
    },
    [redirectToAuth, user]
  );

  return {
    isAuthenticated,
    authRedirectState,
    redirectToAuth,
    requireAuth,
  };
}
