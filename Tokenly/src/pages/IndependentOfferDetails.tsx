import { Clock3, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import { supabase } from "../lib/supabaseClient";

type IndependentOfferDetailsRow = {
  id: string;
  helper_id: string;
  title: string;
  description: string | null;
  category: string | null;
  urgency: string | null;
  duration_minutes: number | null;
  credit_cost: number | null;
  status: string;
  created_at: string;
};

export default function IndependentOfferDetails() {
  const { offerId } = useParams<{ offerId: string }>();
  const [offer, setOffer] = useState<IndependentOfferDetailsRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    void (async () => {
      setLoading(true);
      setError("");

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (!mounted) return;

      if (authError || !authData.user?.id) {
        setOffer(null);
        setLoading(false);
        setError("Please sign in to view this offer.");
        return;
      }

      if (!offerId) {
        setOffer(null);
        setLoading(false);
        setError("Offer not found.");
        return;
      }

      const { data, error: offerError } = await supabase
        .from("help_offers")
        .select("id, helper_id, title, description, category, urgency, duration_minutes, credit_cost, status, created_at")
        .eq("id", offerId)
        .eq("helper_id", authData.user.id)
        .maybeSingle();

      if (!mounted) return;

      if (offerError || !data) {
        setOffer(null);
        setLoading(false);
        setError(offerError?.message ?? "Offer not found.");
        return;
      }

      setOffer(data as IndependentOfferDetailsRow);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [offerId]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <Navbar />
      <main className="relative z-10 mx-auto max-w-5xl px-4 py-6 sm:px-5 lg:px-6 lg:py-7">
        <section className="explore-glass rounded-3xl border border-white/50 bg-white/80 p-5 backdrop-blur-xl md:p-6">
          <div className="mb-4">
            <Link
              to="/my-offers"
              className="inline-flex items-center gap-2 rounded-lg border border-white/50 bg-white/75 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur transition hover:bg-white"
            >
              Back to My Offers
            </Link>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-sm text-slate-600">
              Loading offer details...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
              {error}
            </div>
          ) : offer ? (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{offer.title}</h1>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  {offer.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-600">
                {offer.category ?? "General"} - {new Date(offer.created_at).toLocaleDateString()}
              </p>

              <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4">
                <p className="text-sm font-semibold text-slate-800">Description</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {offer.description || "No description provided."}
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3">
                  <p className="text-xs text-slate-500">Duration</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-slate-800">
                    <Clock3 size={14} className="text-indigo-500" />
                    {offer.duration_minutes ?? 0} min
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3">
                  <p className="text-xs text-slate-500">Tokens</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{offer.credit_cost ?? 0}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3">
                  <p className="text-xs text-slate-500">Urgency</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-slate-800">
                    <Sparkles size={14} className="text-indigo-500" />
                    {offer.urgency ?? "medium"}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}
