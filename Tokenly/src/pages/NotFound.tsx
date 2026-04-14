import { Compass, Home, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">

      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative isolate w-full overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 px-6 py-12 shadow-[0_30px_90px_-50px_rgba(37,99,235,0.45)] backdrop-blur-xl sm:px-10">
          <div className="absolute -left-16 top-12 h-40 w-40 rounded-full bg-sky-200/50 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-indigo-200/45 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              <Search size={14} />
              Page Missing
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
              404
            </h1>
            <p className="mt-4 text-xl font-semibold text-slate-800 sm:text-2xl">
              We couldn&apos;t find the page you were looking for.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              The link may be outdated, the address may be mistyped, or the page may have moved.
              You can head back home or keep exploring Tokenly from a known page.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-200/70 bg-[linear-gradient(135deg,#38bdf8_0%,#6366f1_55%,#8b5cf6_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-20px_rgba(79,70,229,0.75)] transition duration-300 hover:-translate-y-0.5 hover:border-sky-100 hover:shadow-[0_22px_48px_-18px_rgba(79,70,229,0.9)]"
              >
                <Home size={16} />
                Go Home
              </Link>
              <Link
                to="/explore"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/85 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
              >
                <Compass size={16} />
                Explore Tokenly
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

