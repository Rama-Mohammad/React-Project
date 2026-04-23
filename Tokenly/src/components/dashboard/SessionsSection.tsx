import { Check, Clock3, Coins, Timer, User } from "lucide-react";
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

function joinClasses(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function DashboardPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={joinClasses(
        "rounded-[32px] border border-white/80 bg-white/84 shadow-[0_22px_60px_-38px_rgba(15,23,42,0.26)] backdrop-blur-xl",
        className
      )}
    >
      {children}
    </section>
  );
}

function DashboardPanelHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
          </div>
          {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function DashboardEmptyState({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={joinClasses(
        "rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600",
        className
      )}
    >
      {children}
    </div>
  );
}

function DashboardGhostAction({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={joinClasses(
        "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50",
        className
      )}
    >
      {children}
    </div>
  );
}

export default function SessionsSection({
  dashLoading,
  activeSessionTab,
  onSessionTabChange,
  sessionTabCounts,
  previewSessions,
  onMarkComplete,
}: SessionsSectionProps) {
  return (
    <DashboardPanel className="relative flex h-full min-h-0 flex-col overflow-hidden xl:h-[30rem] xl:max-h-[30rem]">
      <div>
        <DashboardPanelHeader
          title="Sessions"
          subtitle="Upcoming, active, and completed work"
          action={
            <Link to="/sessions">
              <DashboardGhostAction>View all</DashboardGhostAction>
            </Link>
          }
        />
      </div>

      <div className="mt-4 w-full overflow-x-auto px-1">
        <div className="inline-flex min-w-max rounded-2xl bg-slate-100 p-1">
          {sessionTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onSessionTabChange(tab)}
              className={`mx-0.5 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs transition ${
                activeSessionTab === tab
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
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

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto px-1 pb-1">
        {dashLoading ? (
          <Loader className="py-10" />
        ) : previewSessions.length === 0 ? (
          <DashboardEmptyState className="mx-1">
            No sessions in this tab yet.
          </DashboardEmptyState>
        ) : (
          previewSessions.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-3 rounded-[26px] border border-slate-200/90 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] p-4 transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-30px_rgba(15,23,42,0.35)] lg:flex-row lg:items-center lg:justify-between"
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

                <h3 className="mt-2 text-base font-semibold leading-tight text-slate-950">{item.topic}</h3>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
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
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                  <Coins size={12} />
                  {item.credits > 0 ? `+${item.credits}` : item.credits === 0 ? "0" : item.credits}
                </span>
                {item.action ? (
                  <button
                    type="button"
                    onClick={() => onMarkComplete(item.id)}
                    className="rounded-xl bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                  >
                    {item.action}
                  </button>
                ) : item.status === "Completed" ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                    <Check size={12} />
                    Done
                  </span>
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>
    </DashboardPanel>
  );
}
