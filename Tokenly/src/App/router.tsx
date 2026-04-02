import { useEffect } from "react";
import { createBrowserRouter, Outlet, useLocation } from "react-router-dom";
import Explore from "../pages/Explore";
import Dashboard from "../pages/Dashboard";
import Tutorial from "../pages/Tutorial";
import Home from "../pages/Home";
import RequestDetails from "../pages/RequestDetails";
import RequestHelper from "../pages/RequestHelper";
import SkillHelpers from "../pages/SkillHelpers";
import SessionsPage from "../pages/Sessions";
// import SessionLivePage from "../pages/SessionLive";
import Profile from "../pages/Profile";

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
        path: "/tutorial",
        element: <Tutorial />,
      },
      {
        path: "/sessions",
        element: <SessionsPage />,
      },
      // {
      //   path: "/session/:sessionId",  // Dynamic route for live session
      //   element: <SessionLivePage />,
      // },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
]);
