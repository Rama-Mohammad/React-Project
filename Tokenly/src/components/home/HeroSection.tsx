import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-x-clip">
      <div className="absolute left-1/2 top-0 h-full w-screen -translate-x-1/2 border-b border-white/40 bg-white/35 backdrop-blur-xl">
        <img
          src="/images/hero_image.png"
          alt="People connecting and learning together"
          className="h-full w-full object-cover opacity-15"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/60 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 md:pt-16 md:pb-24 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-white/50 bg-white/80 px-4 py-1.5 backdrop-blur">
            <span className="text-sm font-medium text-slate-700">
              1,200+ active peers helping each other right now
            </span>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
            Share skills.
            <span className="block bg-gradient-to-r from-indigo-400 via-sky-300 to-purple-300 bg-clip-text text-transparent">
              Earn credits.
            </span>
            Grow together.
          </h1>

          <p className="mb-8 max-w-2xl text-xl leading-relaxed text-slate-600">
            PeerCredit is a credit-based peer learning network. Help someone today, earn credits - use them to get help when you need it. No money, just reciprocity.
          </p>

          <div className="flex flex-col items-center justify-start gap-4 sm:flex-row">
            <button className="rounded-xl border border-slate-200 bg-white px-8 py-3 font-semibold text-slate-900 transition hover:bg-slate-50">
              Get started for free
            </button>
            <button className="rounded-xl border border-white/50 bg-white/80 px-8 py-3 font-semibold text-slate-700 transition backdrop-blur hover:bg-white">
              How it works
            </button>
          </div>

          <div className="mt-8 flex items-center gap-2 text-slate-500">
            <FontAwesomeIcon icon={faStar} className="text-xl text-yellow-400" />
            <FontAwesomeIcon icon={faStar} className="text-xl text-yellow-400" />
            <FontAwesomeIcon icon={faStar} className="text-xl text-yellow-400" />
            <FontAwesomeIcon icon={faStar} className="text-xl text-yellow-400" />
            <span className="font-medium text-slate-700">4.9</span>
            <span className="text-slate-600">Loved by 8,500+ learners & helpers</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
