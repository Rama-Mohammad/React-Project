import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
<section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
  {/* Background Image Overlay */}
  <div className="absolute inset-0">
    <img 
      src="/images/hero_image.png"
      alt="People connecting and learning together"
      className="w-full h-full object-cover opacity-30"
    />
  </div>
  
  {/* Bottom Blur Effect */}
  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 via-gray-50/50 to-transparent"></div>
  
  {/* Content - Left aligned with white text */}
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
    <div className="max-w-3xl">
      <div className="inline-flex items-center bg-blue-500/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-blue-400/30">
        <span className="text-blue-100 text-sm font-medium">1,200+ active peers helping each other right now</span>
      </div>
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
        Share skills.
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
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
        <span className="text-yellow-400 text-xl">★</span>
        <span className="font-medium">4.9</span>
        <span className="text-blue-200">Loved by 8,500+ learners & helpers</span>
      </div>
    </div>
  </div>
</section>

        {/* Rest of your sections remain the same */}
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">By the numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <StatCard number="12,500+" label="Active Members" />
              <StatCard number="28,400+" label="Sessions Completed" />
              <StatCard number="42,100" label="Credits Exchanged" />
              <StatCard number="340+" label="Skills Available" />
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Four steps to your next breakthrough</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              The whole flow — from posting to completed session — happens right inside PeerCredit.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StepCard step="01" title="Post a Request" description="Describe what you need help with — a skill, a topic, a problem. Set your budget in credits and timeline." />
              <StepCard step="02" title="Receive Offers" description="Qualified peers browse open requests and make offers. Review their rating, experience, and hourly rate." />
              <StepCard step="03" title="Complete a Session" description="Meet in our live session room — video, chat, file sharing, quizzes, and collaborative notes included." />
              <StepCard step="04" title="Credits Transfer" description="Both parties confirm completion. Credits move instantly. Earn more by helping others in return." />
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Built for learning, built for giving</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Every feature on the platform exists to make peer-to-peer sessions more productive, trustworthy, and rewarding.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard title="Credit-Based Economy" description="Every help session runs on credits — no cash, no awkward payment. Earn by helping, spend to get help." />
              <FeatureCard title="Full Live Session Room" description="Video, chat, file sharing, collaborative notes, quizzes, and code worksheets — all in one place." />
              <FeatureCard title="Trust & Accountability" description="Ratings, reviews, and mutual-confirm completions ensure both sides stay accountable and honest." />
              <FeatureCard title="Group Sessions" description="Host or join group learning sessions. Gallery view, mentions, per-person or collaborative tools." />
              <FeatureCard title="340+ Skills Available" description="From programming to music theory, cooking to tax filing — the community covers it all." />
              <FeatureCard title="Progress Dashboard" description="Track your sessions, credits earned and spent, skills taught and learned — all with rich analytics." />
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Whatever you want to learn, it's here</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-12">
              <SkillCard name="Programming" count="120 helpers" />
              <SkillCard name="Design" count="64 helpers" />
              <SkillCard name="Math & Science" count="88 helpers" />
              <SkillCard name="Languages" count="45 helpers" />
              <SkillCard name="Finance" count="38 helpers" />
              <SkillCard name="Music" count="29 helpers" />
              <SkillCard name="Writing" count="51 helpers" />
              <SkillCard name="Career & Biz" count="42 helpers" />
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">People learning and teaching every day</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TestimonialCard 
                quote="I was stuck on dynamic programming for weeks. Posted a request, got a session with an expert in 2 hours. Used the credits I earned from teaching Python. Zero dollars spent."
                name="Priya Sharma"
                title="CS Student, MIT"
                rating={8}
              />
              <TestimonialCard 
                quote="I help people with Figma and UI design on weekends and earn credits. Then I use those credits to get help with accounting and tax filing. It's genuinely a fair deal."
                name="Marcus Reid"
                title="UX Designer, Freelancer"
                rating={34}
              />
              <TestimonialCard 
                quote="The live session room is incredible — we used the notes feature and quiz tool together. My student actually remembered the content. I've completed 22 sessions so far."
                name="Elena Kowalski"
                title="PhD Candidate, Linguistics"
                rating={62}
              />
              <TestimonialCard 
                quote="The accountability system is what makes this different. Ratings, mutual confirmation, session logs — no one ghosted me, no one wasted my time. Great community."
                name="Kai Tanaka"
                title="Bootcamp Graduate"
                rating={15}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// Reusable components remain the same
const StatCard = ({ number, label }) => (
  <div className="text-center">
    <div className="text-4xl font-bold text-blue-600 mb-2">{number}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

const StepCard = ({ step, title, description }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="text-4xl font-bold text-blue-200 mb-4">{step}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const FeatureCard = ({ title, description }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-blue-200 transition-all">
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const SkillCard = ({ name, count }) => (
  <div className="bg-white rounded-xl p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
    <h3 className="font-semibold text-gray-900">{name}</h3>
    <p className="text-sm text-gray-500">{count}</p>
  </div>
);

const TestimonialCard = ({ quote, name, title, rating }) => (
  <div className="bg-gray-50 rounded-2xl p-6 relative">
    <div className="text-4xl text-gray-300 absolute top-4 left-4">"</div>
    <p className="text-gray-700 mb-4 pl-6 pt-2">{quote}</p>
    <div className="flex items-center justify-between mt-4">
      <div>
        <p className="font-semibold text-gray-900">{name}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
      <div className="flex items-center text-green-600">
        <span className="text-sm">+{rating}</span>
        <span className="ml-1">★</span>
      </div>
    </div>
  </div>
);

export default Homepage;