
const sections = [
  {
    title: "Using Tokenly Responsibly",
    body:
      "By using Tokenly, you agree to provide accurate account information and use the platform for genuine skill exchange and learning purposes.",
  },
  {
    title: "Acceptable Behavior",
    body:
      "Users must communicate respectfully and avoid harassment, spam, scams, or abusive behavior. Violations may lead to warnings, restrictions, or account removal.",
  },
  {
    title: "Session Expectations",
    body:
      "Participants are expected to show up on time, stay on topic, and confirm session outcomes honestly. Repeated no-shows or misuse can affect account standing.",
  },
  {
    title: "Tokens and Fair Use",
    body:
      "Tokens should be used fairly within Tokenly flows. Attempts to manipulate tokens, ratings, or session records are not allowed.",
  },
  {
    title: "Limitations of Liability",
    body:
      "Tokenly provides a peer-learning platform but does not guarantee specific outcomes from sessions. Users are responsible for how they apply shared advice.",
  },
];

export default function TermsOfService() {
  return (
    <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-violet-200/70 bg-violet-50/45 p-6 shadow-[0_20px_60px_-42px_rgba(139,92,246,0.35)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-600">Legal</p>
            <span className="rounded-full border border-violet-200 bg-violet-100/70 px-3 py-1 text-xs font-medium text-violet-700">
              Updated April 2026
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>
          <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base">
            These terms describe the basic rules and expectations for using Tokenly in a safe and fair way.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          {sections.map((section, index) => (
            <article
              key={section.title}
              className="rounded-2xl border border-violet-200/70 bg-violet-50/35 p-5 backdrop-blur"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">Section {index + 1}</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">{section.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{section.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}


