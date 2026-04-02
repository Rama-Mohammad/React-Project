import { useEffect } from "react";
import { createBrowserRouter, Link, Outlet, useLocation } from "react-router-dom";
import Explore from "../pages/Explore";
import Dashboard from "../pages/Dashboard";
import Tutorial from "../pages/Tutorial";
import Home from "../pages/Home";
import RequestDetails from "../pages/RequestDetails";
import RequestHelper from "../pages/RequestHelper";
import SkillHelpers from "../pages/SkillHelpers";
import SessionsPage from "../pages/Sessions";
import SessionLivePage from "../pages/SessionLive";

function ScrollToTopLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return <Outlet />;
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-bold text-[#111827]">{title}</h1>
      <p className="text-gray-600">This page is not implemented yet.</p>
      <Link
        to="/explore"
        className="rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white"
      >
        Back to Explore
      </Link>
    </div>
  );
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
      {
        path: "/session/:sessionId",  // Dynamic route for live session
        element: <SessionLivePage />,
      },
      {
        path: "/profile",
        element: <PlaceholderPage title="Profile" />,
      },
    ],
  },
]);
