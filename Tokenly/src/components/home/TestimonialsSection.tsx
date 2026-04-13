import TestimonialCard from "../home/TestimonialCard";

const TestimonialsSection = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl rounded-[1.5rem] border border-white/40 bg-white/70 px-4 py-10 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-500">
            REAL STORIES
          </p>

          <h2 className="mb-12 text-3xl font-bold leading-tight text-slate-900 md:text-4xl lg:text-5xl">
            People learning and teaching every day
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <TestimonialCard
            quote="I was stuck on dynamic programming for weeks. Posted a request, got a session with an expert in 2 hours. Used the tokens I earned from teaching Python. Zero dollars spent."
            name="Priya Sharma"
            title="CS Student, MIT"
            rating={8}
          />
          <TestimonialCard
            quote="I help people with Figma and UI design on weekends and earn tokens. Then I use those tokens to get help with accounting and tax filing. It's genuinely a fair deal, and it feels like a balanced system where everyone benefits."            name="Marcus Reid"
            title="UX Designer, Freelancer"
            rating={34}
          />
          <TestimonialCard
            quote="The live session room is incredible - we used the notes feature and quiz tool together. My student actually remembered the content. I've completed 22 sessions so far."
            name="Elena Kowalski"
            title="PhD Candidate, Linguistics"
            rating={62}
          />
          <TestimonialCard
            quote="The accountability system is what makes this different. Ratings, mutual confirmation, session logs - no one ghosted me, no one wasted my time. Great community."
            name="Kai Tanaka"
            title="Bootcamp Graduate"
            rating={15}
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
