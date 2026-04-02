import { createBrowserRouter, Link } from "react-router-dom";
import Explore from "../pages/Explore";
import Dashboard from "../pages/Dashboard";
import Tutorial from "../pages/Tutorial";
import Profile from "../pages/Profile";

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
    path: "/",
    element: <Explore />,
  },
  {
    path: "/explore",
    element: <Explore />,
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
    element: <PlaceholderPage title="Sessions" />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);
