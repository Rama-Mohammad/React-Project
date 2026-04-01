import StatCard from "../common/StatsCard";
import { faUsers, faPlay, faCoins, faLightbulb } from "@fortawesome/free-solid-svg-icons";

const StatsSection = () => {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-blue-500 text-sm font-semibold uppercase tracking-wider mb-4">
            By the numbers
          </p>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            A community built on{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
              real reciprocity
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
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