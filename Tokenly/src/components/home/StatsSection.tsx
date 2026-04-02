import StatCard from "../common/StatsCard";
import { faUsers, faPlay, faCoins, faLightbulb } from "@fortawesome/free-solid-svg-icons";

const StatsSection = () => {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl rounded-[1.5rem] border border-white/40 bg-white/70 px-4 py-10 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-500">
            By the numbers
          </p>

          <h2 className="mb-6 text-3xl font-bold leading-tight text-slate-900 md:text-4xl lg:text-5xl">
            A community built on{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-purple-300 bg-clip-text text-transparent">
              real reciprocity
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          <StatCard icon={faUsers} number="12,500+" label="Active Members" />
          <StatCard icon={faPlay} number="28,400+" label="Sessions Completed" />
          <StatCard icon={faCoins} number="42,100" label="Credits Exchanged" />
          <StatCard icon={faLightbulb} number="340+" label="Skills Available" />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
