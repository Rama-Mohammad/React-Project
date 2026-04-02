import SkillCard from "./SkillCard";

const SkillsSection = () => {
  return (
    <section className="flex min-h-screen items-center py-20">
      <div className="mx-auto w-full max-w-7xl rounded-[1.5rem] border border-white/40 bg-white/60 px-4 py-10 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-500">
            SKILLS & CATEGORIES
          </p>

          <h2 className="mb-12 text-3xl font-bold leading-tight text-slate-900 md:text-4xl lg:text-5xl">
            Whatever you want to learn, it's here
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
          <SkillCard name="Programming" count="120 helpers" />
          <SkillCard name="Design" count="64 helpers" />
          <SkillCard name="Math & Science" count="88 helpers" />
          <SkillCard name="Languages" count="45 helpers" />
          <SkillCard name="Finance" count="38 helpers" />
          <SkillCard name="Music" count="29 helpers" />
          <SkillCard name="Writing" count="51 helpers" />
          <SkillCard name="Career & Biz" count="42 helpers" />
          <SkillCard name="Photography" count="34 helpers" />
          <SkillCard name="Marketing" count="47 helpers" />
          <SkillCard name="Data Science" count="56 helpers" />
          <SkillCard name="Public Speaking" count="23 helpers" />
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
