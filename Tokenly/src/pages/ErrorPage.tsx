import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";

function getErrorCopy(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return {
      status: error.status,
      title: error.status === 404 ? "Page not found" : error.statusText || "Something went wrong",
      message:
        typeof error.data === "string"
          ? error.data
          : "The page could not be loaded successfully. Please try again or return to a safe page.",
    };
  }

  if (error instanceof Error) {
    return {
      status: 500,
      title: "Unexpected application error",
      message: error.message || "An unexpected error interrupted this page.",
    };
  }

  return {
    status: 500,
    title: "Unexpected application error",
    message: "Something went wrong while loading this page. Please try again.",
  };
}

export default function ErrorPage() {
  const error = useRouteError();
  const { status, title, message } = getErrorCopy(error);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative isolate w-full overflow-hidden rounded-4xl border border-white/60 bg-white/72 px-6 py-12 shadow-[0_30px_90px_-50px_rgba(79,70,229,0.42)] backdrop-blur-xl sm:px-10">
          <div className="absolute -left-12 top-10 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="absolute -right-8 bottom-4 h-44 w-44 rounded-full bg-indigo-200/40 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50/85 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              <AlertTriangle size={14} />
              Error {status}
            </div>

            <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
              {title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              {message}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-200/70 bg-[linear-gradient(135deg,#38bdf8_0%,#6366f1_55%,#8b5cf6_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-20px_rgba(79,70,229,0.75)] transition duration-300 hover:-translate-y-0.5 hover:border-sky-100 hover:shadow-[0_22px_48px_-18px_rgba(79,70,229,0.9)]"
              >
                <RefreshCcw size={16} />
                Reload Page
              </button>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/85 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
              >
                <Home size={16} />
                Return Home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
