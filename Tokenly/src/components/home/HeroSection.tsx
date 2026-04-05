import { X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import RatingStars from "../common/RatingStars";
import useAuth from "../../hooks/useAuth";

const HeroSection = () => {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  return (
    <>
      <section className="relative min-h-screen overflow-x-clip">
        <div className="absolute left-1/2 top-0 h-full w-screen -translate-x-1/2 border-b border-white/40 bg-white/35 backdrop-blur-xl">
          <img
            src="/images/hero_image.png"
            alt="People connecting and learning together"
            className="h-full w-full object-cover opacity-15"
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/60 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 md:pt-16 md:pb-24 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-white/50 bg-white/80 px-4 py-1.5 backdrop-blur">
              <span className="text-sm font-medium text-slate-700">
                1,200+ active peers helping each other right now
              </span>
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
              Share skills.
              <span className="block bg-gradient-to-r from-indigo-400 via-sky-300 to-purple-300 bg-clip-text text-transparent">
                Earn credits.
              </span>
              Grow together.
            </h1>

            <p className="mb-8 max-w-2xl text-xl leading-relaxed text-slate-600">
              Tokenly is a credit-based peer learning network. Help someone today, earn credits - use them to get help when you need it. No money, just reciprocity.
            </p>

            <div className="flex flex-col items-center justify-start gap-4 sm:flex-row">
              {!loading && !isAuthenticated ? (
                <Link
                  to="/auth?mode=signup"
                  className="rounded-xl border border-slate-200 bg-white px-8 py-3 font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Get started for free
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => setIsHowItWorksOpen(true)}
                className="rounded-xl border border-sky-200 bg-sky-50 px-8 py-3 font-semibold text-sky-700 transition hover:bg-sky-100"
              >
                How it works
              </button>
            </div>

            <div className="mt-8 flex items-center gap-2 text-slate-500">
              <RatingStars value={4.9} sizeClassName="text-xl" />
              <span className="font-medium text-slate-700">4.9</span>
              <span className="text-slate-600">Loved by 8,500+ learners & helpers</span>
            </div>
          </div>
        </div>
      </section>

      {isHowItWorksOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm"
          onClick={() => setIsHowItWorksOpen(false)}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/30 bg-[linear-gradient(140deg,#eef4ff_0%,#e8f8ff_45%,#f3efff_100%)] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/40 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">How It Works</p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Simple credit flow</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHowItWorksOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/80 text-slate-600 transition hover:bg-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <div className="overflow-hidden rounded-2xl border border-white/50 bg-white/80">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Step</th>
                      <th className="px-4 py-3">What happens</th>
                      <th className="px-4 py-3">Credit status</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr className="border-t border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-900">1. Post request</td>
                      <td className="px-4 py-3">Describe the problem and choose skill tags.</td>
                      <td className="px-4 py-3">Reserved</td>
                    </tr>
                    <tr className="border-t border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-900">2. Get offers</td>
                      <td className="px-4 py-3">Helpers respond with availability.</td>
                      <td className="px-4 py-3">Still reserved</td>
                    </tr>
                    <tr className="border-t border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-900">3. Complete session</td>
                      <td className="px-4 py-3">You meet and confirm outcome.</td>
                      <td className="px-4 py-3">Ready to transfer</td>
                    </tr>
                    <tr className="border-t border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-900">4. Confirm transfer</td>
                      <td className="px-4 py-3">Credits move only after confirmation.</td>
                      <td className="px-4 py-3">Transferred safely</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default HeroSection;
