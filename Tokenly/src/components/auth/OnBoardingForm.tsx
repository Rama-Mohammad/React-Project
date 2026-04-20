import { useRef, useState } from "react";
import { Camera, MapPin, BookOpen, User, ArrowRight, Loader2 } from "lucide-react";
import type { OnboardingData } from "../../types/onboardingdata";


export interface OnboardingFormProps {
  fullName: string;
  onSubmit: (data: OnboardingData) => Promise<boolean>;
  onSkip: () => void;
  loading: boolean;
  error: string;
}

const BIO_MAX = 200;

export default function OnboardingForm({
  fullName,
  onSubmit,
  onSkip,
  loading,
  error,
}: OnboardingFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [picFile, setPicFile] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [institution, setInstitution] = useState("");
  const [location, setLocation] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const firstName = fullName.split(" ")[0] || "there";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPicFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({ profilePicFile: picFile, bio, institution, location });
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 mb-3">
          <User className="w-5 h-5 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 leading-tight">
          Welcome, {firstName}! 
        </h1>
        <p className="text-slate-500 text-sm mt-1.5">
          Let's set up your profile — you can always edit this later
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Avatar upload */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative w-24 h-24 rounded-full border-2 border-dashed border-purple-200 bg-purple-50 hover:border-purple-400 hover:bg-purple-100 transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
            aria-label="Upload profile picture"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <span className="text-2xl font-bold text-purple-400 group-hover:text-purple-600 transition-colors select-none">
                  {initials}
                </span>
              </span>
            )}
            {/* Camera overlay */}
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <Camera className="w-5 h-5 text-white" />
            </span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors"
          >
            {previewUrl ? "Change photo" : "Upload photo"} (optional)
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Bio
            <span className="ml-1 font-normal text-slate-400">(optional)</span>
          </label>
          <div className="relative">
            <textarea
              value={bio}
              onChange={(e) => {
                if (e.target.value.length <= BIO_MAX) setBio(e.target.value);
              }}
              rows={3}
              placeholder="Tell others a little about yourself…"
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
            />
            <span
              className={`absolute bottom-2 right-3 text-xs tabular-nums ${
                bio.length >= BIO_MAX ? "text-rose-400" : "text-slate-400"
              }`}
            >
              {bio.length}/{BIO_MAX}
            </span>
          </div>
        </div>

        {/* Institution */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Institution / Place of Study
            <span className="ml-1 font-normal text-slate-400">(optional)</span>
          </label>
          <div className="relative">
            <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. American University of Beirut"
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Location
            <span className="ml-1 font-normal text-slate-400">(optional)</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Beirut, Lebanon"
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-600">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Complete Setup
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onSkip}
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Skip for now
          </button>
        </div>
      </form>
    </div>
  );
}