import FeatureCard from "../home/FeatureCard";
import { faCoins, faPlay, faUsers, faLightbulb, faStar } from "@fortawesome/free-solid-svg-icons";

const FeaturesSection = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl rounded-[1.5rem] border border-white/40 bg-white/70 px-4 py-10 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-indigo-500">
          Everything included
        </p>

        <h2 className="mb-6 text-center text-3xl font-bold leading-tight text-slate-900 md:text-4xl lg:text-5xl">
          Built for learning, built for giving
        </h2>

        <p className="mx-auto mb-12 max-w-2xl text-center text-slate-600">
          Every feature on the platform exists to make peer-to-peer sessions more productive, trustworthy, and rewarding.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            category="Core System"
            icon={faCoins}
            bgImage="https://cggkruccjfhgxhqkjamk.supabase.co/storage/v1/object/public/assets/core_system.png"
            title="Token-Based Economy"
            description="Every help session runs on tokens - no cash, no awkward payment. Earn by helping, spend to get help."
          />

          <FeatureCard
            category="Built-in Tools"
            icon={faPlay}
            bgImage="https://cggkruccjfhgxhqkjamk.supabase.co/storage/v1/object/public/assets/full_session.png"
            title="Full Live Session Room"
            description="Video, chat, file sharing, collaborative notes, quizzes, and code worksheets - all in one place."
          />

          <FeatureCard
            category="Safety"
            icon={faUsers}
            bgImage="https://cggkruccjfhgxhqkjamk.supabase.co/storage/v1/object/public/assets/trust.png"
            title="Trust & Accountability"
            description="Ratings, reviews, and mutual-confirm completions ensure both sides stay accountable and honest."
          />

          <FeatureCard
            category="Community"
            icon={faUsers}
            bgImage="https://cggkruccjfhgxhqkjamk.supabase.co/storage/v1/object/public/assets/group_sessions.png"
            title="Group Sessions"
            description="Host or join group learning sessions. Gallery view, mentions, per-person or collaborative tools."
          />

          <FeatureCard
            category="Knowledge"
            icon={faLightbulb}
            bgImage="https://cggkruccjfhgxhqkjamk.supabase.co/storage/v1/object/public/assets/skills.png"
            title="340+ Skills Available"
            description="From programming to music theory, cooking to tax filing - the community covers it all."
          />

          <FeatureCard
            category="Analytics"
            icon={faStar}
            bgImage="https://cggkruccjfhgxhqkjamk.supabase.co/storage/v1/object/public/assets/progress.png"
            title="Progress Dashboard"
            description="Track your sessions, tokens earned and spent, skills taught and learned - all with rich analytics."
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

