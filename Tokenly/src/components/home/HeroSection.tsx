import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="absolute inset-0">
        <img
          src="/images/hero_image.png"
          alt="People connecting and learning together"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 via-gray-50/50 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center bg-white/5 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-blue-200/20">
            <span className="text-white text-sm font-medium">
              1,200+ active peers helping each other right now
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Share skills.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-indigo-950">
              Earn credits.
            </span>
            Grow together.
          </h1>

          <p className="text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed">
            PeerCredit is a credit-based peer learning network. Help someone today, earn credits — use them to get help when you need it. No money, just reciprocity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-start items-center">
            <button className="bg-white hover:bg-gray-100 text-blue-600 font-semibold px-8 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg">
              Get started for free
            </button>
            <button className="border-2 border-white/30 hover:border-white/50 text-white font-semibold px-8 py-3 rounded-xl transition-all backdrop-blur-sm">
              How it works
            </button>
          </div>

          <div className="mt-8 flex items-center gap-2 text-blue-200">
            <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xl" />
            <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xl" />
            <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xl" />
            <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xl" />
            <span className="font-medium text-white">4.9</span>
            <span className="text-white">Loved by 8,500+ learners & helpers</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;