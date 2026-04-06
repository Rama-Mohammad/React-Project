import { Eye, Lock, Shield, ShieldAlert, UserX } from "lucide-react";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";

const safetyItems = [
  {
    title: "Protect Your Account",
    text: "Use a strong password, avoid sharing login credentials, and always sign out on shared devices.",
    icon: <Lock size={18} />,
  },
  {
    title: "Reporting Suspicious Behavior",
    text: "If someone asks for off-platform payments or personal data, report it immediately through the support flow.",
    icon: <ShieldAlert size={18} />,
  },
  {
    title: "Privacy and Personal Information",
    text: "Share only what is needed for learning sessions. Keep sensitive personal and financial info private.",
    icon: <Eye size={18} />,
  },
  {
    title: "Safe Session Practices",
    text: "Confirm session details in-app, stay on topic, and use respectful communication in every interaction.",
    icon: <Shield size={18} />,
  },
  {
    title: "Blocking and Reporting Users",
    text: "If a user is abusive or violates guidelines, stop engagement, block/report, and document the incident.",
    icon: <UserX size={18} />,
  },
  {
    title: "Verify Session Details First",
    text: "Double-check date, time, and topic before joining so you avoid impersonation and mismatched session links.",
    icon: <Shield size={18} />,
  },
];

export default function AccountSafety() {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-sky-200/70 bg-sky-50/45 p-6 shadow-[0_20px_60px_-42px_rgba(14,165,233,0.35)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-600">Safety</p>
            <span className="rounded-full border border-sky-200 bg-sky-100/70 px-3 py-1 text-xs font-medium text-sky-700">
              Updated April 2026
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Account and Safety</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700 sm:text-base">
            Learn how to protect your profile, stay safe during sessions, and handle suspicious activity on Tokenly.
          </p>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safetyItems.map((item, index) => (
            <article
              key={item.title}
              className="group relative isolate overflow-hidden rounded-2xl border border-sky-200/70 bg-sky-50/35 p-5 shadow-[0_12px_34px_-26px_rgba(14,165,233,0.35)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-50/55 hover:shadow-[0_18px_40px_-24px_rgba(14,165,233,0.5)] before:absolute before:inset-y-0 before:-left-14 before:w-10 before:skew-x-12 before:bg-white/70 before:opacity-0 before:transition-all before:duration-500 hover:before:left-[120%] hover:before:opacity-100"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-500">Section {index + 1}</p>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                {item.icon}
              </div>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item.text}</p>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
