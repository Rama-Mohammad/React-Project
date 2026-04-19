//IMPORTANT NOTE:
// Route: /helpers/:helperId/request  →  Flow 3 (direct request to specific helper)
// Route: /request/new                →  Flow 1 (public request, open to all helpers)
import { CheckCircle2, Coins, Lightbulb, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { createRequest } from "../services/requestService";
import { sendDirectRequest } from "../services/directRequestService";
import { getProfileCreditBalance } from "../services/profileService";
import type { NeedBy, RequiredSection, SessionType } from "../types/page";

const durationChoices = [30, 45, 60, 90, 120];
const PRESET_SKILLS = ["Design", "Marketing", "Music", "Programming", "Writing"];

function normalizeSkillName(value: string) {
  return value.trim().toLowerCase();
}

export default function RequestHelper() {
  const { helperId } = useParams<{ helperId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Helper info — loaded when helperId is present (Flow 3)
  const [helper, setHelper] = useState<{
    creditsPerHour: number;
    name: string;
    username: string | null;
  } | null>(null);
  const [isLoadingHelper, setIsLoadingHelper] = useState(true);
  const [helperLoadError, setHelperLoadError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [creditsToOffer, setCreditsToOffer] = useState<number>(6);
  const [needBy, setNeedBy] = useState<NeedBy | null>(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sectionError, setSectionError] = useState<RequiredSection | null>(null);
  const [availableTokens, setAvailableTokens] = useState(0);

  const sectionRefs = useRef<Record<RequiredSection, HTMLElement | null>>({
    title: null,
    skills: null,
    description: null,
    sessionType: null,
    duration: null,
    urgency: null,
  });


  // isGenericRequestFlow = no specific helper targeted → public request
  // isDirectFlow = specific helper targeted → direct_request
  const isGenericRequestFlow = !helperId;

  // Pre-fill from URL params (used when coming from an offer card)
  useEffect(() => {
    const offerTitle = searchParams.get("offerTitle");
    const offerCategory = searchParams.get("offerCategory");
    const offerDuration = searchParams.get("offerDuration");
    const offerCredits = searchParams.get("offerCredits");

    if (offerTitle) setTitle((c) => c || offerTitle);
    if (offerCategory) setSelectedSkills((c) => (c.length > 0 ? c : [offerCategory]));
    if (offerDuration) setDurationMinutes(Number(offerDuration) || null);
    if (offerCredits) setCreditsToOffer(Number(offerCredits) || 6);
  }, [searchParams]);

  // Load helper info when helperId is present
  useEffect(() => {
    if (!helperId) {
      // Generic request flow — no helper to load, just skip loading state
      setHelper({ creditsPerHour: 6, name: "", username: null });
      setIsLoadingHelper(false);
      return;
    }

    let mounted = true;
    setIsLoadingHelper(true);
    setHelperLoadError("");

    void (async () => {
      // Fetch helper profile + their help_offers for creditsPerHour estimate
      const [profileRes, offersRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, username")
          .eq("id", helperId)
          .single(),
        supabase
          .from("help_offers")
          .select("credit_cost, duration_minutes")
          .eq("helper_id", helperId)
          .eq("status", "open"),
      ]);

      if (!mounted) return;

      if (profileRes.error || !profileRes.data) {
        setHelperLoadError("This helper could not be found.");
        setHelper(null);
        setIsLoadingHelper(false);
        return;
      }

      const hourlyRates = (offersRes.data ?? [])
        .map((offer) => {
          if (!offer.duration_minutes || offer.duration_minutes <= 0) return null;
          if (offer.credit_cost == null) return null;
          return (offer.credit_cost / offer.duration_minutes) * 60;
        })
        .filter((rate): rate is number => rate !== null && Number.isFinite(rate));

      const creditsPerHour =
        hourlyRates.length > 0
          ? Math.max(1, Math.round(hourlyRates.reduce((sum, rate) => sum + rate, 0) / hourlyRates.length))
          : 6;

      setHelper({
        creditsPerHour,
        name: profileRes.data.full_name ?? profileRes.data.username ?? "Helper",
        username: profileRes.data.username,
      });
      setIsLoadingHelper(false);
    })();

    return () => { mounted = false; };
  }, [helperId]);

  // Auto-dismiss success/error messages
  useEffect(() => {
    if (!submitMessage) return;
    const id = window.setTimeout(() => setSubmitMessage(""), 3000);
    return () => window.clearTimeout(id);
  }, [submitMessage]);

  useEffect(() => {
    if (!submitError) return;
    const id = window.setTimeout(() => setSubmitError(""), 4500);
    return () => window.clearTimeout(id);
  }, [submitError]);

  useEffect(() => {
    let mounted = true;

    void (async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (!mounted || authError || !authData.user?.id) return;

      const { data: balanceData, error: balanceError } = await getProfileCreditBalance(authData.user.id);
      if (!mounted || balanceError) return;

      const balance = Number(balanceData?.credit_balance ?? 0);
      setAvailableTokens(balance);
      setCreditsToOffer((current) => Math.min(balance, current));
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? [] : [skill]));
  };

  const addCustomSkill = () => {
    const trimmedSkill = customSkillInput.trim();
    if (!trimmedSkill) return;

    const normalizedSkill = normalizeSkillName(trimmedSkill);
    const alreadySelected = selectedSkills.some(
      (skill) => normalizeSkillName(skill) === normalizedSkill
    );

    if (!alreadySelected) {
      setSelectedSkills([trimmedSkill]);
    }

    setCustomSkillInput("");
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedSkills([]);
    setCustomSkillInput("");
    setShowCustomSkillInput(false);
    setSessionType(null);
    setDurationMinutes(null);
    setCreditsToOffer(6);
    setNeedBy(null);
    setSectionError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validation
    if (!title.trim()) { setSectionError("title"); return; }
    if (selectedSkills.length === 0) { setSectionError("skills"); return; }
    if (!description.trim()) { setSectionError("description"); return; }
    if (!sessionType) { setSectionError("sessionType"); return; }
    if (!durationMinutes) { setSectionError("duration"); return; }
    if (!needBy) { setSectionError("urgency"); return; }

    setSectionError(null);
    setSubmitError("");
    setSubmitMessage("");
    setIsSubmitting(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user?.id) {
        setSubmitError("Please sign in to send a request.");
        return;
      }

      const userId = authData.user.id;
      const urgency = needBy === "urgent" ? "high" : needBy === "soon" ? "medium" : "low";

      // ── Flow 3: Direct request to a specific helper ─────────────────────
      if (helperId && !isGenericRequestFlow) {
        if (userId === helperId) {
          setSubmitError("You cannot send a direct request to yourself.");
          return;
        }

        const { data: created, error: drError } = await sendDirectRequest({
          requester_id: userId,
          helper_id: helperId,
          title: title.trim(),
          message: description.trim(),
          category: selectedSkills[0] ?? "General",
          duration_minutes: durationMinutes ?? undefined,
          credit_cost: creditsToOffer,
        });

        if (drError || !created) {
          setSubmitError(drError?.message ?? "Could not send request. Please try again.");
          return;
        }

        const helperDisplayName = helper?.name ?? "the helper";
        setSubmitMessage(`Direct request sent to ${helperDisplayName}!`);
        resetForm();

        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
        return;
      }

      // ── Flow 1: Generic public request ────────────────────────────────────
      const { data: createdRequest, error: createError } = await createRequest({
        requester_id: userId,
        title: title.trim(),
        description: description.trim(),
        category: selectedSkills[0] ?? "General",
        urgency,
        duration_minutes: durationMinutes ?? undefined,
        credit_cost: creditsToOffer,
        status: "open",
      });

      if (createError || !createdRequest?.id) {
        setSubmitError(createError?.message ?? "Could not create request. Please try again.");
        return;
      }

      // Link skills to the request
      if (selectedSkills.length > 0) {
        const { data: matchedSkills } = await supabase
          .from("skills")
          .select("id, name")
          .in("name", selectedSkills);

        const skillIds = (matchedSkills ?? []).map((item) => item.id).filter(Boolean);
        if (skillIds.length > 0) {
          const links = skillIds.map((skillId) => ({
            request_id: createdRequest.id,
            skill_id: skillId,
          }));
          const { error: linkError } = await supabase.from("request_skills").insert(links);
          if (linkError) {
            // Non-fatal — request was created, skills just didn't link
            console.warn("request_skills linking failed:", linkError.message);
          }
        }
      }

      setSubmitMessage("Request posted successfully.");
      resetForm();
      setTimeout(() => {
        navigate("/explore?tab=requests#explore-tabs-bar");
      }, 700);
    } catch (error) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: string }).message)
          : "Could not send request. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingHelper) {
    return (
      <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
        <main className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            {isGenericRequestFlow ? "Opening request form..." : "Loading helper..."}
          </h1>
        </main>
      </div>
    );
  }

  if (!helper) {
    return (
      <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
        <main className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Helper not found</h1>
          <p className="mt-2 text-slate-600">
            {helperLoadError || "This helper profile may no longer be available."}
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Go Back
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-full overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="explore-pulse absolute -left-24 top-20 h-64 w-64 rounded-full bg-indigo-200/24 blur-3xl" />
        <div className="explore-float absolute -right-24 top-44 h-72 w-72 rounded-full bg-sky-200/22 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-5 lg:px-6 lg:py-8">
        <div className="mb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/50 bg-white/75 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur transition hover:bg-white"
          >
            Back
          </button>

          {/* "Sending to {helperName}" banner — only shown on direct request flow */}
          {!isGenericRequestFlow && helper.name ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <User size={12} />
              Sending directly to {helper.name}
            </div>
          ) : null}
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[1.9fr_0.95fr]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {isGenericRequestFlow ? "Request a Session" : `Request ${helper.name}`}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                {isGenericRequestFlow
                  ? "Describe what you need. Helpers will browse your request and submit offers."
                  : `Send a private session request directly to ${helper.name}. They'll see it on their dashboard and can accept or decline.`}
              </p>

              {/* Title */}
              <div
                ref={(el) => { sectionRefs.current.title = el; }}
                className="mt-5"
              >
                <label className="block text-sm font-semibold text-slate-800">
                  Session title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={120}
                  placeholder="e.g. Help me debug a React useEffect issue"
                  className={`mt-2 w-full rounded-2xl border bg-white/90 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-indigo-100 ${
                    sectionError === "title" ? "border-rose-300 focus:border-rose-300" : "border-slate-200 focus:border-indigo-300"
                  }`}
                />
                {sectionError === "title" ? (
                  <p className="mt-1 text-xs text-rose-500">Please enter a title.</p>
                ) : null}
              </div>

              {/* Skills */}
              <div
                ref={(el) => { sectionRefs.current.skills = el; }}
                className="mt-5"
              >
                <label className="block text-sm font-semibold text-slate-800">
                  Skill area <span className="text-rose-500">*</span>
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PRESET_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                        selectedSkills.includes(skill)
                          ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/50"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowCustomSkillInput((current) => !current)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      showCustomSkillInput
                        ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/50"
                    }`}
                  >
                    Other
                  </button>
                </div>
                {showCustomSkillInput ? (
                  <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomSkill();
                        }
                      }}
                      maxLength={40}
                      placeholder="Write your skill name"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                    />
                    <button
                      type="button"
                      onClick={addCustomSkill}
                      className="rounded-xl border border-indigo-200 bg-white px-3.5 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                    >
                      Add
                    </button>
                  </div>
                ) : null}
                {selectedSkills.some((skill) => !PRESET_SKILLS.includes(skill)) ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedSkills
                      .filter((skill) => !PRESET_SKILLS.includes(skill))
                      .map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
                        >
                          {skill} x
                        </button>
                      ))}
                  </div>
                ) : null}
                {sectionError === "skills" ? (
                  <p className="mt-1 text-xs text-rose-500">Please select at least one skill.</p>
                ) : null}
              </div>

              {/* Description */}
              <div
                ref={(el) => { sectionRefs.current.description = el; }}
                className="mt-5"
              >
                <label className="block text-sm font-semibold text-slate-800">
                  {isGenericRequestFlow ? "Describe your problem" : "Message"}{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={1000}
                  rows={5}
                  placeholder={
                    isGenericRequestFlow
                      ? "Explain what you need help with, what you've tried, and what outcome you want..."
                      : `Tell ${helper.name} what you need, any context, and when you're available...`
                  }
                  className={`mt-2 w-full resize-none rounded-2xl border bg-white/90 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-indigo-100 ${
                    sectionError === "description" ? "border-rose-300 focus:border-rose-300" : "border-slate-200 focus:border-indigo-300"
                  }`}
                />
                <p className="mt-1 text-right text-xs text-slate-400">{description.length}/1000</p>
                {sectionError === "description" ? (
                  <p className="mt-1 text-xs text-rose-500">Please describe what you need.</p>
                ) : null}
              </div>

              {/* Session type */}
              <div
                ref={(el) => { sectionRefs.current.sessionType = el; }}
                className="mt-5"
              >
                <label className="block text-sm font-semibold text-slate-800">
                  Session format <span className="text-rose-500">*</span>
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["one-on-one", "async", "group"] as SessionType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSessionType(type)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        sessionType === type
                          ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200"
                      }`}
                    >
                      {type === "one-on-one" ? "1-on-1 live" : type === "async" ? "Async video" : "Group session"}
                    </button>
                  ))}
                </div>
                {sectionError === "sessionType" ? (
                  <p className="mt-1 text-xs text-rose-500">Please choose a format.</p>
                ) : null}
              </div>

              {/* Duration */}
              <div
                ref={(el) => { sectionRefs.current.duration = el; }}
                className="mt-5"
              >
                <label className="block text-sm font-semibold text-slate-800">
                  Duration <span className="text-rose-500">*</span>
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {durationChoices.map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDurationMinutes(mins)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        durationMinutes === mins
                          ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200"
                      }`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
                {sectionError === "duration" ? (
                  <p className="mt-1 text-xs text-rose-500">Please choose a duration.</p>
                ) : null}
              </div>

              {/* Urgency */}
              <div
                ref={(el) => { sectionRefs.current.urgency = el; }}
                className="mt-5"
              >
                <label className="block text-sm font-semibold text-slate-800">
                  When do you need this? <span className="text-rose-500">*</span>
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["flexible", "soon", "urgent"] as NeedBy[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setNeedBy(option)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        needBy === option
                          ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200"
                      }`}
                    >
                      {option === "flexible" ? "Flexible" : option === "soon" ? "Soon" : "Urgent"}
                    </button>
                  ))}
                </div>
                {sectionError === "urgency" ? (
                  <p className="mt-1 text-xs text-rose-500">Please select urgency.</p>
                ) : null}
              </div>

              {/* Feedback messages */}
              {submitMessage ? (
                <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle2 size={16} />
                  {submitMessage}
                </div>
              ) : null}
              {submitError ? (
                <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {submitError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 via-sky-500 to-indigo-500 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "Sending..."
                  : isGenericRequestFlow
                  ? "Post Request"
                  : `Send to ${helper.name}`}
              </button>
            </section>
          </form>

          {/* Right sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-20">
            {/* Tokens picker */}
            <section className="explore-glass rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl">
              <h2 className="text-base font-semibold text-slate-900">Tokens to offer</h2>
              <p className="mt-1 text-xs text-slate-500">You have {availableTokens} tokens available.</p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCreditsToOffer((c) => Math.max(0, c - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                >
                  −
                </button>
                <div className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 py-2 text-lg font-bold text-indigo-700">
                  <Coins size={18} />
                  {creditsToOffer}
                </div>
                <button
                  type="button"
                  onClick={() => setCreditsToOffer((c) => Math.min(availableTokens, c + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                >
                  +
                </button>
              </div>

              {helper.creditsPerHour > 0 && durationMinutes ? (
                <p className="mt-3 text-xs text-slate-500">
                  Suggested: ~{Math.round((helper.creditsPerHour / 60) * durationMinutes)} tokens for {durationMinutes} min
                </p>
              ) : null}
            </section>

            {/* Tips */}
            <section className="explore-glass rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Lightbulb size={15} className="text-amber-500" />
                {isGenericRequestFlow ? "Tips for getting offers" : "Tips for direct requests"}
              </div>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-600">
                {isGenericRequestFlow ? (
                  <>
                    <li>• Be specific about what you've already tried</li>
                    <li>• Mention the desired outcome, not just the problem</li>
                    <li>• Higher tokens attract more experienced helpers</li>
                    <li>• Shorter sessions fill up faster</li>
                  </>
                ) : (
                  <>
                    <li>• Include context about why you're choosing this helper specifically</li>
                    <li>• Mention your availability so they can plan</li>
                    <li>• Keep it concise — helpers receive many requests</li>
                    <li>• The helper will accept or decline from their dashboard</li>
                  </>
                )}
              </ul>
            </section>

            {/* Link back to helper profile */}
            {!isGenericRequestFlow && helperId ? (
              <Link
                to={`/helpers/${helperId}`}
                className="block rounded-3xl border border-white/55 bg-white/80 p-4 text-center text-xs font-semibold text-indigo-600 backdrop-blur transition hover:bg-white"
              >
                View {helper.name}'s full profile →
              </Link>
            ) : null}
          </aside>
        </div>
      </main>
    </div>
  );
}
