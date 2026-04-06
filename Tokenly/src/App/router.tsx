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
import Help from "../pages/Help";
import Guidelines from "../pages/Guidelines";
import ReportIssue from "../pages/ReportIssue";
import FAQ from "../pages/FAQ";
import AccountSafety from "../pages/AccountSafety";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService";
import CookiePolicy from "../pages/CookiePolicy";
import SessionRequestDetails from "../pages/SessionRequestDetails";

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
        path: "/sessions/request/:sessionId",
        element: <SessionRequestDetails />,
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
      {
        path: "/help",
        element: <Help />,
      },
      {
        path: "/guidelines",
        element: <Guidelines />,
      },
      {
        path: "/report",
        element: <ReportIssue />,
      },
      {
        path: "/faqs",
        element: <FAQ />,
      },
      {
        path: "/account-safety",
        element: <AccountSafety />,
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms",
        element: <TermsOfService />,
      },
      {
        path: "/cookies",
        element: <CookiePolicy />,
      },
      { path: "/auth", element: <AuthPage /> },
      {
        path: "/reset-password",
        element: <AuthPage />,
      },
    ],
  },
]);
