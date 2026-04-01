import SkillCard from "./SkillCard";

const SkillsSection = () => {
  return (
    <section className="py-20 bg-gray-50 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center">
          <p className="text-blue-500 text-sm font-semibold uppercase tracking-wider mb-4">
            SKILLS & CATEGORIES
          </p>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-12">
            Whatever you want to learn, it's here
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
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