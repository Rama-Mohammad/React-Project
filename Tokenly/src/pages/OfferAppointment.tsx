import { CalendarDays, Clock3, Coins, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Loader from "../components/common/Loader";
import { supabase } from "../lib/supabaseClient";
import {
  acceptOffer,
  createOffer,
  extractAvailabilityFromOfferDescription,
  getIndependentOfferAppointmentDetails,
  getOfferAppointmentDetails,
} from "../services/offerService";
import type { HelpOfferAppointmentRow, OfferAppointmentRow } from "../types/offer";
import { getProfileCreditBalance } from "../services/profileService";
import { createRequest } from "../services/requestService";

type AppointmentSource = "request" | "independent";

function toLocalDateTimeInputValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function buildDefaultAppointment() {
  const date = new Date();
  date.setHours(date.getHours() + 2, 0, 0, 0);
  return toLocalDateTimeInputValue(date);
}


export default function OfferAppointment() {
  const { offerId } = useParams<{ offerId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const source = (searchParams.get("source") === "independent" ? "independent" : "request") as AppointmentSource;

  const [requestOffer, setRequestOffer] = useState<OfferAppointmentRow | null>(null);
  const [independentOffer, setIndependentOffer] = useState<HelpOfferAppointmentRow | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appointmentAt, setAppointmentAt] = useState(buildDefaultAppointment);
  const [prepMessage, setPrepMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let mounted = true;

    void (async () => {
      setLoading(true);
      setError("");

      const { data: authData } = await supabase.auth.getUser();
      if (!mounted) return;

      setCurrentUserId(authData.user?.id ?? null);

      if (!offerId) {
        setError("Offer not found.");
        setLoading(false);
        return;
      }

      if (source === "independent") {
        const { data, error: independentError } = await getIndependentOfferAppointmentDetails(offerId);
        if (!mounted) return;

        if (independentError || !data) {
          setError(independentError?.message ?? "Offer not found.");
          setIndependentOffer(null);
          setRequestOffer(null);
          setLoading(false);
          return;
        }

        setIndependentOffer(data);
        setRequestOffer(null);
        setLoading(false);
        return;
      }

      const { data, error: requestError } = await getOfferAppointmentDetails(offerId);
      if (!mounted) return;

      if (requestError || !data) {
        setError(requestError?.message ?? "Offer not found.");
        setRequestOffer(null);
        setIndependentOffer(null);
        setLoading(false);
        return;
      }

      setRequestOffer(data);
      setIndependentOffer(null);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [offerId, source]);

  const helperName = useMemo(() => {
    if (source === "independent") {
      return independentOffer?.helper?.full_name ?? independentOffer?.helper?.username ?? "helper";
    }

    return requestOffer?.helper?.full_name ?? requestOffer?.helper?.username ?? "helper";
  }, [independentOffer, requestOffer, source]);

  const availabilityText = useMemo(() => {
    if (source === "independent") {
      return extractAvailabilityFromOfferDescription(independentOffer?.description).availability;
    }

    return requestOffer?.availability || "Availability not provided.";
  }, [independentOffer, requestOffer, source]);

  const offerDescription = useMemo(() => {
    if (source === "independent") {
      return extractAvailabilityFromOfferDescription(independentOffer?.description).summary;
    }

    return requestOffer?.message || "No message was included with this offer.";
  }, [independentOffer, requestOffer, source]);

  const title = source === "independent" ? independentOffer?.title : requestOffer?.request?.title;
  const duration = source === "independent" ? independentOffer?.duration_minutes ?? 0 : requestOffer?.request?.duration_minutes ?? 0;
  const credits = source === "independent" ? independentOffer?.credit_cost ?? 0 : requestOffer?.request?.credit_cost ?? 0;
  const category = source === "independent" ? independentOffer?.category ?? "General" : requestOffer?.request?.category ?? "General";
  const status = source === "independent" ? independentOffer?.status ?? "open" : requestOffer?.status ?? "pending";

  const canSchedule = useMemo(() => {
    if (!currentUserId) return false;
    if (source === "independent") {
      return currentUserId !== independentOffer?.helper_id;
    }

    return Boolean(
      currentUserId &&
        requestOffer?.request?.requester_id &&
        currentUserId === requestOffer.request.requester_id
    );
  }, [currentUserId, independentOffer?.helper_id, requestOffer, source]);

  const handleScheduleSession = async () => {
    if (!currentUserId) {
      setSubmitError("Please sign in first.");
      return;
    }

    if (!canSchedule) {
      setSubmitError(
        source === "independent"
          ? "You cannot book your own offer."
          : "Only the requester who owns this request can accept the offer and set the appointment."
      );
      return;
    }

    if (!appointmentAt) {
      setSubmitError("Please choose an appointment date and time.");
      return;
    }

    const scheduledDate = new Date(appointmentAt);
    if (!Number.isFinite(scheduledDate.getTime())) {
      setSubmitError("Please choose a valid appointment date and time.");
      return;
    }

    if (scheduledDate.getTime() <= Date.now()) {
      setSubmitError("Choose a time in the future.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const { data: profile, error: profileError } = await getProfileCreditBalance(currentUserId);
      if (profileError) {
        setSubmitError(profileError.message ?? "Could not verify your token balance.");
        return;
      }

      const currentBalance = Number(profile?.credit_balance ?? 0);
      const requiredTokens = Number(credits ?? 0);

      if (currentBalance < requiredTokens) {
        setSubmitError("Not enough tokens to accept this offer.");
        navigate(`/tokens/options?required=${requiredTokens}&balance=${currentBalance}`);
        return;
      }

      const selectedSlotText = [
        `Offerer availability: ${availabilityText}`,
        `Chosen appointment: ${scheduledDate.toLocaleString()}`,
        prepMessage.trim() ? `Requester note: ${prepMessage.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      if (source === "independent") {
        if (!independentOffer) {
          setSubmitError("Offer not found.");
          return;
        }

        const { data: createdRequest, error: createRequestError } = await createRequest({
          requester_id: currentUserId,
          title: independentOffer.title,
          description: [
            offerDescription,
            `Booked from independent offer by ${helperName}.`,
            prepMessage.trim() ? `Prep message: ${prepMessage.trim()}` : "",
          ]
            .filter(Boolean)
            .join("\n\n"),
          category: independentOffer.category ?? "General",
          urgency: independentOffer.urgency === "high" || independentOffer.urgency === "medium" || independentOffer.urgency === "low"
            ? independentOffer.urgency
            : "medium",
          duration_minutes: independentOffer.duration_minutes ?? undefined,
          credit_cost: independentOffer.credit_cost ?? 0,
          status: "open",
        });

        if (createRequestError || !createdRequest?.id) {
          setSubmitError(createRequestError?.message ?? "Could not create a booking request.");
          return;
        }

        if (currentUserId === independentOffer.helper_id) {
          setSubmitError("You cannot book your own offer.");
          return;
        }

        const { data: createdOffer, error: createOfferError } = await createOffer(
          createdRequest.id,
          offerDescription,
          selectedSlotText
        );

        if (createOfferError || !createdOffer?.id) {
          setSubmitError(createOfferError?.message ?? "Could not prepare this offer for scheduling.");
          return;
        }

        const { error: acceptError } = await acceptOffer(
          createdOffer.id,
          {
            id: createdRequest.id,
            requester_id: currentUserId,
            duration_minutes: independentOffer.duration_minutes ?? undefined,
            credit_cost: independentOffer.credit_cost ?? 0,
          },
          scheduledDate.toISOString()
        );

        if (acceptError) {
          setSubmitError(acceptError.message ?? "Could not schedule this session.");
          return;
        }

        await supabase.from("help_offers").update({ status: "accepted" }).eq("id", independentOffer.id);
        navigate("/sessions");
        return;
      }

      if (!requestOffer?.request) {
        setSubmitError("This offer is no longer linked to an active request.");
        return;
      }

      await supabase
        .from("offers")
        .update({ availability: selectedSlotText })
        .eq("id", requestOffer.id);

      const { error: acceptError } = await acceptOffer(
        requestOffer.id,
        {
          id: requestOffer.request.id,
          requester_id: requestOffer.request.requester_id,
          duration_minutes: requestOffer.request.duration_minutes ?? undefined,
          credit_cost: requestOffer.request.credit_cost ?? 0,
        },
        scheduledDate.toISOString()
      );

      if (acceptError) {
        setSubmitError(acceptError.message ?? "Could not schedule this session.");
        return;
      }

      navigate("/sessions");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="explore-pulse absolute -left-24 top-20 h-64 w-64 rounded-full bg-indigo-200/24 blur-3xl" />
        <div className="explore-float absolute right-[-6rem] top-44 h-72 w-72 rounded-full bg-sky-200/22 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-5 lg:px-6 lg:py-8">
        <div className="mb-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/50 bg-white/75 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur transition hover:bg-white"
          >
            Back
          </button>
        </div>

        {loading ? (
          <section className="explore-glass rounded-3xl border border-white/55 bg-white/80 p-6 backdrop-blur-xl">
            <Loader inline label="Loading offer appointment details..." />
          </section>
        ) : error || (!requestOffer && !independentOffer) ? (
          <section className="explore-glass rounded-3xl border border-white/55 bg-white/80 p-6 text-center backdrop-blur-xl">
            <h1 className="text-3xl font-bold text-slate-900">Offer not found</h1>
            <p className="mt-2 text-slate-600">{error || "This offer may have been removed."}</p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-6 inline-flex rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Go Back
            </button>
          </section>
        ) : (
          <div className="grid items-start gap-5 lg:grid-cols-[1.55fr_0.95fr]">
            <section className="space-y-4">
              <div className="explore-glass rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl md:p-6">
                <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                  Accept Offer
                </span>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                  Schedule this session
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Review the offered availability, pick the best time, and confirm the booking with <span className="font-semibold text-slate-900">{helperName}</span>.
                </p>
              </div>

              <div className="explore-glass rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl md:p-6">
                <h2 className="text-lg font-semibold text-slate-900">Offer summary</h2>
                <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {source === "independent" ? "Independent offer" : "Request-based offer"}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{offerDescription}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                        Offerer availability
                      </p>
                      <p className="mt-2 text-sm leading-6 text-indigo-900">{availabilityText}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Session details
                      </p>
                      <div className="mt-2 space-y-2 text-sm text-slate-600">
                        <p>{category}</p>
                        <p>{duration} min</p>
                        <p>{credits} tokens</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="explore-glass rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl md:p-6">
                <h2 className="text-lg font-semibold text-slate-900">Booking preferences</h2>

                <label className="mt-4 block">
                  <span className="text-sm font-semibold text-slate-800">Preferred date and time</span>
                  <input
                    type="datetime-local"
                    value={appointmentAt}
                    onChange={(event) => setAppointmentAt(event.target.value)}
                    className="mt-2 h-11 w-full rounded-2xl border border-slate-200/80 bg-white/92 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>

                <label className="mt-4 block">
                  <span className="text-sm font-semibold text-slate-800">Message for the helper</span>
                  <textarea
                    value={prepMessage}
                    onChange={(event) => setPrepMessage(event.target.value)}
                    maxLength={320}
                    placeholder="Mention what you want to cover, files to review, or what outcome you want from the session."
                    className="mt-2 h-28 w-full resize-none rounded-2xl border border-slate-200/80 bg-white/92 p-3 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  />
                  <p className="mt-1 text-right text-xs text-slate-500">{prepMessage.length}/320</p>
                </label>

                {!currentUserId ? (
                  <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    Sign in to book this offer.
                  </p>
                ) : !canSchedule ? (
                  <p className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {source === "independent"
                      ? "You cannot accept your own independent offer."
                      : "Only the requester who owns this request can accept this offer."}
                  </p>
                ) : null}

                {submitError ? (
                  <p className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {submitError}
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={() => void handleScheduleSession()}
                  disabled={submitting || !canSchedule}
                  className={`mt-4 inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white transition ${
                    submitting || !canSchedule
                      ? "cursor-not-allowed bg-slate-300"
                      : "bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500 hover:brightness-105"
                  }`}
                >
                  {submitting ? "Scheduling..." : "Confirm Booking"}
                </button>
              </div>
            </section>

            <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
              <div className="explore-glass rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-slate-900">Booking snapshot</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <Sparkles size={15} className="text-indigo-400" />
                      Helper
                    </span>
                    <span className="font-semibold text-slate-800">{helperName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <Clock3 size={15} className="text-indigo-400" />
                      Duration
                    </span>
                    <span className="font-semibold text-slate-800">{duration} min</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <Coins size={15} className="text-indigo-400" />
                      Tokens
                    </span>
                    <span className="font-semibold text-indigo-700">{credits}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={15} className="text-indigo-400" />
                      Status
                    </span>
                    <span className="font-semibold text-slate-800 capitalize">{status}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}




