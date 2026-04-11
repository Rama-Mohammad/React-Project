import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const CTASection = () => {
  const { isAuthenticated } = useAuth();
  const gatedLink = "/auth?mode=signup";

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl rounded-[1.5rem] border border-white/40 bg-white/60 px-4 py-10 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-block rounded-full bg-indigo-50 px-5 py-2 text-sm font-medium text-indigo-600">
              Free to join - start with 5 tokens
            </div>

            <h2 className="mb-6 text-4xl font-bold text-slate-900 md:text-5xl">
              Ready to start
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-purple-300 bg-clip-text text-transparent">
                exchanging skills?
              </span>
            </h2>

            <p className="text-lg leading-relaxed text-slate-600">
              Join 8,500+ peers already helping each other. Every new member gets 5 starter tokens - enough to book your first session.
            </p>
          </div>

          <div className="rounded-2xl border border-white/50 bg-white/80 p-8 shadow-sm backdrop-blur">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-slate-900">Get started today</h2>
              <p className="mb-6 text-slate-600">No bank card. No payments. Just skills.</p>

              <div className="mb-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to={isAuthenticated ? "/explore" : gatedLink}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-center font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Browse Requests
                </Link>
                <Link
                  to={isAuthenticated ? "/request/new" : gatedLink}
                  className="rounded-xl border border-indigo-200/70 bg-[linear-gradient(135deg,rgba(129,140,248,0.24)_0%,rgba(56,189,248,0.2)_48%,rgba(168,139,250,0.24)_100%)] px-6 py-2.5 text-center font-semibold text-indigo-800 shadow-[0_10px_30px_-18px_rgba(79,70,229,0.6)] backdrop-blur-md transition hover:brightness-105"
                >
                  Post a Request
                </Link>
              </div>

              <div className="mb-6">
                <Link
                  to={isAuthenticated ? "/dashboard" : gatedLink}
                  className="inline-flex items-center gap-2 text-sm font-medium text-indigo-500 transition-colors hover:text-indigo-600"
                >
                  <FontAwesomeIcon icon={faChartLine} className="text-sm" />
                  View your dashboard
                </Link>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <div className="mx-auto w-fit space-y-3">
                  <div className="flex items-center gap-3 text-left">
                    <span className="inline-flex w-4 shrink-0 justify-center">
                      <FontAwesomeIcon icon={faCheck} className="text-sm text-emerald-500" />
                    </span>
                    <span className="text-sm text-slate-700">5 free starter tokens on sign-up</span>
                  </div>

                  <div className="flex items-center gap-3 text-left">
                    <span className="inline-flex w-4 shrink-0 justify-center">
                      <FontAwesomeIcon icon={faCheck} className="text-sm text-emerald-500" />
                    </span>
                    <span className="text-sm text-slate-700">No money ever changes hands</span>
                  </div>

                  <div className="flex items-center gap-3 text-left">
                    <span className="inline-flex w-4 shrink-0 justify-center">
                      <FontAwesomeIcon icon={faCheck} className="text-sm text-emerald-500" />
                    </span>
                    <span className="text-sm text-slate-700">Cancel or pause anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;




