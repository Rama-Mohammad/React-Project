import { useEffect } from "react";
import { createBrowserRouter, Outlet, useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout";
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
import MyOffers from "../pages/MyOffers";
import CreateOffer from "../pages/CreateOffer";
import HelpOfferDetails from "../pages/HelpOfferDetails"
import HelpOfferBooking from "../pages/HelpOfferBooking";
import HelperProfile from "../pages/HelperProfile";
import OfferAppointment from "../pages/OfferAppointment";
import TokenOptions from "../pages/TokenOptions";
import AccountSettings from "../pages/AccountSettings";
import ErrorPage from "../pages/ErrorPage";
import NotFound from "../pages/NotFound";

function ErrorTestPage(): never {
  throw new Error("This is a test route for the Tokenly error page.");
}

function ScrollToTopLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return <Outlet />;
}

export const router = createBrowserRouter(
  [
    {
      element: <ScrollToTopLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          element: <Layout />,
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
              path: "/offers/:offerId",
              element: <HelpOfferBooking />,
            },
            {
              path: "/my-offers/help-offer/:offerId",
              element: <HelpOfferDetails />,
            },
            {
              path: "/my-offers/independent/:offerId",
              element: <HelpOfferDetails />,
            },
            {
              path: "/helpers/:helperId",
              element: <HelperProfile />,
            },
            {
              path: "/helpers/:helperId/request",
              element: <RequestHelper />,
            },
            {
              path: "/sessions/request/:sessionId",
              element: <SessionRequestDetails />,
            },
            {
              path: "/sessions",
              element: <Sessions />,
            },
            {
              path: "/offers/:offerId/appointment",
              element: <OfferAppointment />,
            },
            {
              path: "/request/new",
              element: <RequestHelper />,
            },
            {
              path: "/create-offer",
              element: <CreateOffer />,
            },
            {
              path: "/skills/:skillId/helpers",
              element: <SkillHelpers />,
            },
            {
              path: "/my-offers",
              element: <MyOffers />,
            },
            {
              path: "/dashboard",
              element: <Dashboard />,
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
              path: "/tokens/options",
              element: <TokenOptions />,
            },
            {
              path: "/account-settings",
              element: <AccountSettings />,
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
            {
              path: "*",
              element: <NotFound />,
            },
          ],
        },
        {
          path: "/session/:sessionId",
          element: <SessionLivePage />,
        },
        { path: "/auth", element: <AuthPage /> },
        {
          path: "/reset-password",
          element: <AuthPage />,
        },

        {
          path: "/error-test",
          element: <ErrorTestPage />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
