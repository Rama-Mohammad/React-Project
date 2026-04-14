
const sections = [
  {
    title: "What Cookies Are",
    body:
      "Cookies are small text files stored in your browser. They help Tokenly remember settings and keep your experience smooth between visits.",
  },
  {
    title: "Essential Session Cookies",
    body:
      "We use essential cookies for login state, security checks, and core session features so you can navigate requests, helpers, and live pages reliably.",
  },
  {
    title: "Preference Cookies",
    body:
      "Some cookies remember interface preferences like filters or display choices to make the platform easier to use.",
  },
  {
    title: "Optional Analytics",
    body:
      "We may use basic analytics cookies to understand product usage patterns and improve features. These are used in aggregate, not for personal profiling.",
  },
  {
    title: "Managing Cookies",
    body:
      "You can manage or clear cookies from your browser settings. Disabling essential cookies may impact login and core platform functionality.",
  },
];

export default function CookiePolicy() {
  return (
    <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-sky-200/70 bg-sky-50/45 p-6 shadow-[0_20px_60px_-42px_rgba(14,165,233,0.32)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-600">Legal</p>
            <span className="rounded-full border border-sky-200 bg-sky-100/70 px-3 py-1 text-xs font-medium text-sky-700">
              Updated April 2026
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Cookie Policy</h1>
          <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base">
            This page explains how Tokenly uses cookies to support authentication, performance, and better usability.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          {sections.map((section, index) => (
            <article
              key={section.title}
              className="rounded-2xl border border-sky-200/70 bg-sky-50/35 p-5 backdrop-blur"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-500">Section {index + 1}</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">{section.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{section.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

