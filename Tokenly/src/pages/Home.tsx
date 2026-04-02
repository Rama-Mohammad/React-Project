import { useEffect } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import StepsSection from "../components/home/StepsSection";
import FeaturesSection from "../components/home/FeaturesSection";
import SkillsSection from "../components/home/SkillsSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import CTASection from "../components/home/CTASection";
import useAuth from "../hooks/useAuth";
import useRequests from "../hooks/useRequest";
import useSessions from "../hooks/useSessions";
import useTransactions from "../hooks/useTransactions";

const Home = () => {
  const { user } = useAuth();
  const { requests, fetchOpenRequests, error: requestsError } = useRequests();
  const { sessions, fetchSessionsByUser, error: sessionsError } = useSessions();
  const { summary, fetchCreditSummary, error: creditsError } = useTransactions();

  useEffect(() => {
    void fetchOpenRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    void fetchSessionsByUser(user.id);
    void fetchCreditSummary(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const pageError = requestsError || sessionsError || creditsError;

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#e8efff_0%,#e9f7ff_45%,#f5f8ff_100%)] text-slate-900">
      <Navbar />

      <main>
        <HeroSection />
        <section className="mx-auto mt-4 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-3 rounded-2xl border border-white/60 bg-white/70 p-4 text-sm shadow-sm backdrop-blur-md sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Open Requests</p>
              <p className="text-2xl font-semibold text-slate-900">{requests.length}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Your Sessions</p>
              <p className="text-2xl font-semibold text-slate-900">{sessions.length}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Your Credits</p>
              <p className="text-2xl font-semibold text-slate-900">
                {summary?.total ?? 0}
              </p>
            </div>
          </div>
          {pageError ? (
            <p className="mt-2 text-xs text-rose-600">{pageError}</p>
          ) : null}
        </section>
        <StatsSection />
        <StepsSection />
        <FeaturesSection />
        <SkillsSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
