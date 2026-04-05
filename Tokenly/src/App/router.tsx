import { useEffect } from "react";
import { createBrowserRouter, Outlet, useLocation } from "react-router-dom";
import Explore from "../pages/Explore";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import RequestDetails from "../pages/RequestDetails";
import RequestHelper from "../pages/RequestHelper";
import SkillHelpers from "../pages/SkillHelpers";
import Profile from "../pages/Profile";
import Sessions from "../pages/Sessions";
import SessionLivePage from "../pages/SessionLive";
import Activity from "../pages/Activity";
import AuthPage from "../pages/AuthPage";

function ScrollToTopLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <ScrollToTopLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/explore",
        element: <Explore />,
      },
      {
        path: "/requests/:requestId",
        element: <RequestDetails />,
      },
      {
        path: "/session/:sessionId",
        element: <SessionLivePage />,
      },
      {
        path: "/helpers/:helperId/request",
        element: <RequestHelper />,
      },
      {
        path: "/skills/:skillId/helpers",
        element: <SkillHelpers />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/sessions",
        element: <Sessions />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/activity",
        element: <Activity />,
      },
      { path: "/auth", element: <AuthPage /> },
      {
        path: "/reset-password",
        element: <AuthPage />,
      },
    ],
  },
]);
