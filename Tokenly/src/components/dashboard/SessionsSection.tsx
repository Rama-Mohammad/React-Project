import { Calendar, Check, Clock3, Coins, Timer, User } from "lucide-react";
import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";
import Loader from "../common/Loader";
import RatingStars from "../common/RatingStars";
import type { DashboardSessionItem, SessionTabLabel } from "../../types/dashboard";
import { sessionTabs, skillTone, statusTone } from "../../utils/dashboardUtils";

type SessionsSectionProps = {
  dashLoading: boolean;
  activeSessionTab: SessionTabLabel;
  onSessionTabChange: (tab: SessionTabLabel) => void;
  sessionTabCounts: Record<SessionTabLabel, number>;
  previewSessions: DashboardSessionItem[];
  onMarkComplete: (id: string) => void;
};

export default function SessionsSection({
  dashLoading,
  activeSessionTab,
  onSessionTabChange,
  sessionTabCounts,
  previewSessions,
  onMarkComplete,
}: SessionsSectionProps) {
  return (
    <section className="relative mt-4 overflow-hidden rounded-3xl border border-indigo-200/70 bg-[linear-gradient(140deg,rgba(238,242,255,0.95)_0%,rgba(237,233,254,0.92)_45%,rgba(224,231,255,0.95)_100%)] p-4 shadow-[0_14px_34px_-26px_rgba(99,102,241,0.45)] sm:p-5">
      <div className="pointer-events-none absolute -top-16 right-6 h-40 w-40 rounded-full bg-indigo-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-10 h-36 w-36 rounded-full bg-violet-300/20 blur-3xl" />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-indigo-100 p-2 text-indigo-700">
            <Calendar size={16} />
          </div>
          <h2 className="text-base font-semibold">Sessions</h2>
        </div>
        <Link to="/sessions" className="text-xs font-semibold text-indigo-700 hover:text-indigo-800">
          View all
        </Link>
      </div>

      <div className="relative mt-3 w-full overflow-x-auto">
        <div className="inline-flex min-w-max rounded-2xl bg-white/75 p-1">
          {sessionTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onSessionTabChange(tab)}
              className={`mx-0.5 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs transition ${
                activeSessionTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
              {!dashLoading && (
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-500">
                  {sessionTabCounts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-3 space-y-2.5">
        {dashLoading ? (
          <Loader className="py-10" />
        ) : previewSessions.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
            No sessions in this tab yet.
          </div>
        ) : (
          previewSessions.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3.5 transition hover:shadow-sm lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className={`rounded-full px-2.5 py-0.5 font-medium ${skillTone(item.skill)}`}>
                    {item.skill}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 font-medium ${statusTone(item.status)}`}>
                    {item.status}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-medium ${
                      item.role === "Helping" ? "bg-violet-100 text-violet-700" : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {item.role}
                  </span>
                </div>

                <h3 className="mt-2 text-sm font-medium leading-tight text-slate-900">{item.topic}</h3>

                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Avatar
                      name={item.person}
                      imageUrl={item.personImageUrl}
                      className="h-6 w-6 rounded-full"
                      imageClassName="rounded-full"
                      fallbackClassName="bg-slate-100 text-[10px] font-bold text-slate-700"
                    />
                    <User size={13} />
                    {item.role === "Helping" ? "For" : "With"} {item.person}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={13} />
                    {item.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Timer size={13} />
                    {item.duration}
                  </span>
                  {item.rating ? <RatingStars value={item.rating} /> : null}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end lg:self-center">
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-0.5 text-xs font-semibold text-indigo-700">
                  <Coins size={12} />
                  {item.credits > 0 ? `+${item.credits}` : item.credits === 0 ? "0" : item.credits}
                </span>
                {item.action ? (
                  <button
                    type="button"
                    onClick={() => onMarkComplete(item.id)}
                    className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-800"
                  >
                    {item.action}
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-700">
                    <Check size={12} />
                    Done
                  </span>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
