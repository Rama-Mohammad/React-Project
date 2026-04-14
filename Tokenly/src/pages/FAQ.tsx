import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqItems = [
  {
    q: "How do requests work?",
    a: "Post your request with a clear title, description, and skill tags. Helpers can then send offers and availability.",
  },
  {
    q: "How do helpers get selected?",
    a: "You compare offers by profile quality, ratings, and fit for your topic, then accept the helper you prefer.",
  },
  {
    q: "How do live sessions happen?",
    a: "When a request is accepted, the session appears in your Sessions page. Join at the scheduled time from the Active tab.",
  },
  {
    q: "How do tokens work?",
    a: "You earn tokens by helping others and spend tokens when receiving help. Transfer happens once sessions are marked complete.",
  },
  {
    q: "Can I cancel a session?",
    a: "Yes. Cancel as early as possible and communicate clearly. Repeated late cancellations may affect trust and ratings.",
  },
  {
    q: "How do I report a user?",
    a: "Use the Report an Issue page and include usernames, session details, and screenshots when available.",
  },
  {
    q: "Can I switch between helper and learner roles?",
    a: "Yes, Tokenly supports both roles. You can post requests and also respond to others as a helper.",
  },
  {
    q: "What if my session had technical issues?",
    a: "Report the issue with a short timeline and details. Our support review helps resolve tokens and session status fairly.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">

      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-indigo-200/70 bg-indigo-50/45 p-6 shadow-[0_20px_60px_-42px_rgba(79,70,229,0.35)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">Support</p>
            <span className="rounded-full border border-indigo-200 bg-indigo-100/70 px-3 py-1 text-xs font-medium text-indigo-700">
              Updated April 2026
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Frequently Asked Questions</h1>
          <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base">
            Quick answers to common questions about requests, sessions, tokens, and safety on Tokenly.
          </p>

          <div className="mt-6 space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <article
                  key={item.q}
                  className="group relative isolate overflow-hidden rounded-2xl border border-indigo-200/70 bg-indigo-50/35 backdrop-blur transition duration-300 hover:border-indigo-300 hover:bg-indigo-50/55 hover:shadow-[0_14px_30px_-24px_rgba(99,102,241,0.6)] before:absolute before:inset-y-0 before:-left-14 before:w-10 before:skew-x-12 before:bg-white/70 before:opacity-0 before:transition-all before:duration-500 hover:before:left-[120%] hover:before:opacity-100"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  >
                    <span className="text-sm font-semibold text-slate-900 sm:text-base">{item.q}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen ? <p className="px-4 pb-4 text-sm leading-6 text-slate-700">{item.a}</p> : null}
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

