import { AlertTriangle, Paperclip } from "lucide-react";
import { useState } from "react";
import ThemedSelect from "../components/common/ThemedSelect";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";

export default function ReportIssue() {
  const [issueType, setIssueType] = useState("");

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-indigo-200/70 bg-indigo-50/45 p-6 shadow-[0_20px_60px_-42px_rgba(79,70,229,0.35)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">Support</p>
            <span className="rounded-full border border-indigo-200 bg-indigo-100/70 px-3 py-1 text-xs font-medium text-indigo-700">
              Updated April 2026
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Report an Issue</h1>
          <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base">
            Tell us what happened on Tokenly and we will review it. Share as much detail as possible so we can help quickly.
          </p>

          <form className="mt-6 space-y-4 rounded-2xl border border-indigo-200/70 bg-indigo-50/35 p-4 sm:p-5">
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-indigo-200/70 bg-indigo-50/50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="w-full rounded-xl border border-indigo-200/70 bg-indigo-50/50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label htmlFor="issueType" className="mb-1.5 block text-sm font-medium text-slate-700">
                Issue Type
              </label>
              <ThemedSelect
                value={issueType}
                onChange={setIssueType}
                placeholder="Select an issue type"
                ariaLabel="Issue type"
                className="mt-0"
                options={[
                  { value: "account", label: "Account access" },
                  { value: "session", label: "Session problem" },
                  { value: "payment", label: "Tokens or balance issue" },
                  { value: "abuse", label: "Abuse or harassment" },
                  { value: "bug", label: "Technical bug" },
                ]}
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                id="description"
                rows={5}
                placeholder="Describe what happened, when it happened, and any relevant usernames/session IDs."
                className="w-full rounded-xl border border-indigo-200/70 bg-indigo-50/50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label htmlFor="screenshot" className="mb-1.5 block text-sm font-medium text-slate-700">
                Screenshot or File (optional)
              </label>
              <div className="flex items-center justify-between rounded-xl border border-dashed border-sky-300/80 bg-sky-50/40 px-4 py-3">
                <span className="text-sm text-slate-500">Attach screenshot or logs (PNG, JPG, PDF)</span>
                <label
                  htmlFor="screenshot"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-sky-200 bg-sky-100/70 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                >
                  <Paperclip size={14} />
                  Upload
                </label>
                <input id="screenshot" type="file" className="hidden" />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex rounded-xl bg-[linear-gradient(90deg,#6366f1,#8b5cf6)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_26px_-18px_rgba(99,102,241,0.8)] transition hover:opacity-95"
            >
              Submit Report
            </button>
          </form>

          <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-sm text-amber-700">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <p>For urgent safety concerns, please report immediately and avoid further contact with the involved user.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
