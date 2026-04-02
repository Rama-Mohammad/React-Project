import StepCard from "../home/StepCard";

const StepsSection = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl rounded-[1.5rem] border border-white/40 bg-white/60 px-4 py-10 backdrop-blur-xl sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-indigo-500">
          Four steps
        </p>

        <h2 className="mb-6 text-center text-3xl font-bold leading-tight text-slate-900 md:text-4xl lg:text-5xl">
          Your next breakthrough starts here
        </h2>

        <p className="mx-auto mb-12 max-w-2xl text-center text-slate-600">
          The whole flow - from posting to completed session - happens right inside PeerCredit.
        </p>

        <div className="relative">
          <div className="absolute left-0 right-0 top-10 z-0 hidden h-px bg-white/70 lg:block" />

          <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <StepCard
              step="01"
              title="Post a Request"
              description="Describe what you need help with - a skill, a topic, a problem. Set your budget in credits and timeline."
            />
            <StepCard
              step="02"
              title="Receive Offers"
              description="Qualified peers browse open requests and make offers. Review their rating, experience, and hourly rate."
            />
            <StepCard
              step="03"
              title="Complete a Session"
              description="Meet in our live session room - video, chat, file sharing, quizzes, and collaborative notes included."
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
