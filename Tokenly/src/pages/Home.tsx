import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import StepsSection from "../components/home/StepsSection";
import FeaturesSection from "../components/home/FeaturesSection";
import SkillsSection from "../components/home/SkillsSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import CTASection from "../components/home/CTASection";

const Home = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#c7d2fe_0%,#bae6fd_40%,#ddd6fe_100%)] text-slate-900">
      <Navbar />

      <main>
        <HeroSection />
        <StatsSection />
        <StepsSection />
        <FeaturesSection />
        <SkillsSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
