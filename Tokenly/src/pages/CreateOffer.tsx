import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ThemedSelect from "../components/common/ThemedSelect";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import { supabase } from "../lib/supabaseClient";

type UserSkill = {
  id: string;
  name: string;
  category: string | null;
  level: string | null;
};

type UrgencyOption = "low" | "medium" | "high";

const urgencyOptions: Array<{ value: UrgencyOption; label: string }> = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function CreateOffer() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skillsError, setSkillsError] = useState("");

  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [title, setTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [creditCost, setCreditCost] = useState(5);
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState("");
  const [note, setNote] = useState("");
  const [urgency, setUrgency] = useState<UrgencyOption>("medium");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    void (async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (!mounted) return;

      if (authError || !authData.user?.id) {
        setCurrentUserId(null);
        setSkills([]);
        setSkillsError("Please sign in to create an offer.");
        setSkillsLoading(false);
        return;
      }

      const userId = authData.user.id;
      setCurrentUserId(userId);
      setSkillsLoading(true);
      setSkillsError("");

      const { data, error } = await supabase
        .from("skills")
        .select("id, name, category, level")
        .eq("user_id", userId)
        .order("sessions_count", { ascending: false });

      if (!mounted) return;

      if (error) {
        setSkills([]);
        setSkillsError(error.message ?? "Could not load your skills.");
        setSkillsLoading(false);
        return;
      }

      const list = (data as UserSkill[]) ?? [];
      setSkills(list);
      setSelectedSkillId(list[0]?.id ?? "");
      setSkillsLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const selectedSkill = useMemo(
    () => skills.find((item) => item.id === selectedSkillId) ?? null,
    [selectedSkillId, skills]
  );

  const handlePublishOffer = async () => {
    setSubmitError("");
    setSubmitSuccess("");

    if (!currentUserId) {
      setSubmitError("You must be signed in to create an offer.");
      return;
    }

    if (skills.length === 0) {
      setSubmitError("Add at least one skill to your profile before creating an offer.");
      return;
    }

    if (!selectedSkillId) {
      setSubmitError("Please choose a skill.");
      return;
    }

    if (!title.trim()) {
      setSubmitError("Please add a title for your offer.");
      return;
    }

    if (!durationMinutes || durationMinutes <= 0) {
      setSubmitError("Please enter a valid duration.");
      return;
    }

    if (!creditCost || creditCost <= 0) {
      setSubmitError("Please enter a valid credit cost.");
      return;
    }

    if (!description.trim()) {
      setSubmitError("Please add a description for your offer.");
      return;
    }

    setIsSubmitting(true);
    try {
      const mergedDescription = [
        description.trim(),
        availability.trim() ? `Availability: ${availability.trim()}` : "",
        note.trim() ? `Note: ${note.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      const payload = {
        helper_id: currentUserId,
        title: title.trim(),
        description: mergedDescription,
        category: selectedSkill?.category ?? selectedSkill?.name ?? "General",
        urgency,
        credit_cost: creditCost,
        duration_minutes: durationMinutes,
        status: "open",
      };

      const { data: insertedOffer, error } = await supabase
        .from("help_offers")
        .insert(payload)
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      if (!insertedOffer?.id) {
        throw new Error("Offer was not persisted to database.");
      }

      setSubmitSuccess("Offer published successfully. People can now find you in Explore.");
      setTitle("");
      setDescription("");
      setAvailability("");
      setNote("");
    } catch (error) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: string }).message)
          : "Failed to publish offer.";
      setSubmitError(message || "Failed to publish offer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <Navbar />
      <main className="relative z-10 mx-auto max-w-5xl px-4 py-6 sm:px-5 lg:px-6 lg:py-7">
        <section className="explore-glass rounded-3xl p-5 backdrop-blur-xl md:p-6">
          <div className="mb-4">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-lg border border-white/50 bg-white/75 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur transition hover:bg-white"
            >
              Back to Explore
            </Link>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create an Offer</h1>
          <p className="mt-2 text-sm text-slate-600">
            Publish a standalone skill offer. Interested people can find your profile and request a session.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-800">Skill</label>
              <ThemedSelect
                value={selectedSkillId}
                onChange={setSelectedSkillId}
                options={skills.map((skill) => ({
                  value: skill.id,
                  label: `${skill.name} (${skill.level ?? "General"})`,
                }))}
                placeholder="Select one of your skills..."
                ariaLabel="Offer skill"
                icon={<Sparkles size={14} />}
                disabled={skillsLoading || skills.length === 0}
              />
              {skillsLoading ? <p className="mt-1 text-xs text-slate-500">Loading your skills...</p> : null}
              {skillsError ? <p className="mt-1 text-xs text-rose-600">{skillsError}</p> : null}
            </div>

            {selectedSkill ? (
              <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 text-xs text-slate-600">
                {selectedSkill.category ?? "General"} - {selectedSkill.level ?? "All levels"}
              </div>
            ) : null}

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-800">Offer title</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={`Help with ${selectedSkill?.name ?? "your skill"}`}
                className="h-11 w-full rounded-2xl border border-slate-200/80 bg-white/92 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-800">Session duration (min)</label>
                <input
                  type="number"
                  min={15}
                  step={5}
                  value={durationMinutes}
                  onChange={(event) => setDurationMinutes(Number(event.target.value))}
                  className="h-11 w-full rounded-2xl border border-slate-200/80 bg-white/92 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-800">Credit cost</label>
                <input
                  type="number"
                  min={1}
                  value={creditCost}
                  onChange={(event) => setCreditCost(Number(event.target.value))}
                  className="h-11 w-full rounded-2xl border border-slate-200/80 bg-white/92 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-800">Urgency</label>
              <ThemedSelect
                value={urgency}
                onChange={setUrgency}
                options={urgencyOptions}
                ariaLabel="Offer urgency"
                icon={<Sparkles size={14} />}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-800">Description</label>
              <textarea
                maxLength={500}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what you'll help with, your approach, and what learners can expect."
                className="h-28 w-full resize-none rounded-2xl border border-slate-200/80 bg-white/92 p-3 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
              <p className="mt-1 text-right text-xs text-slate-500">{description.length}/500</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-800">Availability (optional)</label>
              <input
                value={availability}
                onChange={(event) => setAvailability(event.target.value)}
                placeholder="e.g. Weekdays 5-8 PM UTC"
                className="h-11 w-full rounded-2xl border border-slate-200/80 bg-white/92 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-800">Offer note (optional)</label>
              <textarea
                maxLength={300}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="What can you help with in this skill?"
                className="h-24 w-full resize-none rounded-2xl border border-slate-200/80 bg-white/92 p-3 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
              <p className="mt-1 text-right text-xs text-slate-500">{note.length}/300</p>
            </div>

            <button
              type="button"
              onClick={handlePublishOffer}
              disabled={isSubmitting}
              className={`h-11 w-full rounded-xl text-sm font-semibold text-white transition ${
                isSubmitting
                  ? "cursor-not-allowed bg-slate-300"
                  : "bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500 hover:brightness-105"
              }`}
            >
              {isSubmitting ? "Publishing..." : "Publish Offer"}
            </button>

            {submitError ? <p className="text-sm font-medium text-rose-600">{submitError}</p> : null}
            {submitSuccess ? <p className="text-sm font-medium text-emerald-600">{submitSuccess}</p> : null}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
