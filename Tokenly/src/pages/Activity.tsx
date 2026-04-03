import { Calendar, Check, Coins, Plus, Send, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import { activityItems } from "../data/activityItems";

function toneClasses(tone: string) {
  if (tone === "teal") return "bg-teal-100 text-teal-700";
  if (tone === "blue") return "bg-sky-100 text-sky-700";
  if (tone === "amber") return "bg-amber-100 text-amber-700";
  if (tone === "gold") return "bg-yellow-100 text-yellow-700";
  if (tone === "green") return "bg-emerald-100 text-emerald-700";
  if (tone === "rose") return "bg-rose-100 text-rose-700";
  return "bg-slate-100 text-slate-600";
}

export default function Activity() {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-cyan-200/70 bg-[linear-gradient(140deg,rgba(236,253,255,0.95)_0%,rgba(240,249,255,0.92)_45%,rgba(236,253,245,0.95)_100%)] shadow-[0_14px_34px_-26px_rgba(8,145,178,0.45)]">
          <div className="pointer-events-none absolute -top-16 right-6 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-10 h-36 w-36 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="relative flex items-center justify-between border-b border-cyan-200/70 p-4 sm:p-5">
            <div>
              <p className="text-sm text-slate-500">Dashboard</p>
              <h1 className="text-2xl font-semibold">All Activity</h1>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/70 bg-white/80 px-3 py-1.5 text-xs font-semibold text-cyan-700 transition hover:bg-white"
            >
              Back to dashboard
            </Link>
          </div>

          <div className="relative">
            {activityItems.map((item) => (
              <article
                key={item.id}
                className="flex items-center justify-between border-b border-cyan-200/70 px-4 py-5 last:border-b-0 sm:px-5"
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-3 ${toneClasses(item.tone)}`}>
                    {item.id === "a1" ? (
                      <Plus size={15} />
                    ) : item.id === "a2" ? (
                      <Check size={15} />
                    ) : item.id === "a3" ? (
                      <Send size={15} />
                    ) : item.id === "a4" ? (
                      <Star size={15} />
                    ) : (
                      <Calendar size={15} />
                    )}
                  </div>
                  <div>
                    <p className="text-base leading-tight">{item.text}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.date}</p>
                  </div>
                </div>

                {item.credits ? (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
                      item.credits > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    <Coins size={14} />
                    {item.credits > 0 ? `+${item.credits}` : item.credits}
                  </span>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}




