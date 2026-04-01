import StepCard from "../home/StepCard";

const StepsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-blue-500 text-sm font-semibold uppercase tracking-wider mb-4 text-center">
          Four steps
        </p>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6 text-center">
          Your next breakthrough starts here
        </h2>

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          The whole flow — from posting to completed session — happens right inside PeerCredit.
        </p>

        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-px bg-gray-300 z-0"></div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 z-10">
            <StepCard
              step="01"
              title="Post a Request"
              description="Describe what you need help with — a skill, a topic, a problem. Set your budget in credits and timeline."
            />
            <StepCard
              step="02"
              title="Receive Offers"
              description="Qualified peers browse open requests and make offers. Review their rating, experience, and hourly rate."
            />
            <StepCard
              step="03"
              title="Complete a Session"
              description="Meet in our live session room — video, chat, file sharing, quizzes, and collaborative notes included."
            />
            <StepCard
              step="04"
              title="Credits Transfer"
              description="Both parties confirm completion. Credits move instantly. Earn more by helping others in return."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepsSection;