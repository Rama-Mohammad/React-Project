import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { helpers } from "../../data/mockExploreData";

const CTASection = () => {
  const defaultHelperId = helpers[0]?.id ?? "h1";

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl rounded-[1.5rem] border border-white/40 bg-white/60 px-4 py-10 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-block rounded-full bg-indigo-50 px-5 py-2 text-sm font-medium text-indigo-600">
              Free to join - start with 5 credits
            </div>

            <h2 className="mb-6 text-4xl font-bold text-slate-900 md:text-5xl">
              Ready to start
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-purple-300 bg-clip-text text-transparent">
                exchanging skills?
              </span>
            </h2>

            <p className="text-lg leading-relaxed text-slate-600">
              Join 8,500+ peers already helping each other. Every new member gets 5 starter credits - enough to book your first session.
            </p>
          </div>

          <div className="rounded-2xl border border-white/50 bg-white/80 p-8 shadow-sm backdrop-blur">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-slate-900">Get started today</h2>
              <p className="mb-6 text-slate-600">No credit card. No payments. Just skills.</p>

              <div className="mb-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/explore"
                  className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-center font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Browse Requests
                </Link>
                <Link
                  to={`/helpers/${defaultHelperId}/request`}
                  className="rounded-xl border border-white/50 bg-white/80 px-6 py-2.5 text-center font-semibold text-slate-700 transition hover:bg-white"
                >
                  Post a Request
                </Link>
              </div>

              <div className="mb-6">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-medium text-indigo-500 transition-colors hover:text-indigo-600"
                >
                  <FontAwesomeIcon icon={faChartLine} className="text-sm" />
                  View your dashboard
                </a>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <FontAwesomeIcon icon={faCheck} className="text-sm text-emerald-500" />
                    <span className="text-sm text-slate-700">5 free starter credits on sign-up</span>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <FontAwesomeIcon icon={faCheck} className="text-sm text-emerald-500" />
                    <span className="text-sm text-slate-700">No money ever changes hands</span>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <FontAwesomeIcon icon={faCheck} className="text-sm text-emerald-500" />
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
