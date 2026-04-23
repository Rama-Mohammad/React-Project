
const sections = [
  {
    title: "Information We Collect",
    body:
      "When you use Tokenly, we may collect account details like your name, email, profile info, and the requests or sessions you create on the platform.",
  },
  {
    title: "How We Use Your Data",
    body:
      "We use your data to run core features, match learners with helpers, show session history, support safety tools, and improve the overall platform experience.",
  },
  {
    title: "Session and Activity Data",
    body:
      "We store session-related details such as schedule, status, tokens, and participant actions to keep records accurate and help resolve issues fairly.",
  },
  {
    title: "Data Protection",
    body:
      "We take reasonable security measures to protect user data and reduce unauthorized access. No online system is perfect, but we continuously improve safeguards.",
  },
  {
    title: "Your Choices",
    body:
      "You can update profile information and choose what details you share publicly. If needed, you can also request account support for data-related questions.",
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-indigo-200/70 bg-indigo-50/45 p-6 shadow-[0_20px_60px_-42px_rgba(79,70,229,0.35)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">Legal</p>
            <span className="rounded-full border border-indigo-200 bg-indigo-100/70 px-3 py-1 text-xs font-medium text-indigo-700">
              Updated April 2026
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
          <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base">
            This page explains what data Tokenly collects and how it is used to support safe, helpful peer learning sessions.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          {sections.map((section, index) => (
            <article
              key={section.title}
              className="rounded-2xl border border-indigo-200/70 bg-indigo-50/35 p-5 backdrop-blur"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Section {index + 1}</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">{section.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{section.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}


