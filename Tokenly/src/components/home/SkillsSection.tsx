import { useEffect, useMemo, useState } from "react";
import SkillCard from "./SkillCard";
import { getExploreHelpers } from "../../services/helperExploreService";

type HomeSkillConfig = {
  name:
    | "Programming"
    | "Design"
    | "Math & Science"
    | "Languages"
    | "Finance"
    | "Music"
    | "Writing"
    | "Career & Biz"
    | "Photography"
    | "Marketing"
    | "Data Science"
    | "Public Speaking";
  aliases: string[];
};

const HOME_SKILLS: HomeSkillConfig[] = [
  { name: "Programming", aliases: ["programming", "web development", "development", "coding", "code"] },
  { name: "Design", aliases: ["design", "ui", "ux", "graphic design", "product design"] },
  { name: "Math & Science", aliases: ["math", "mathematics", "science", "statistics", "algorithms"] },
  { name: "Languages", aliases: ["language", "languages", "english", "french", "arabic", "spanish"] },
  { name: "Finance", aliases: ["finance", "accounting", "investing", "economics"] },
  { name: "Music", aliases: ["music", "singing", "guitar", "piano", "drums"] },
  { name: "Writing", aliases: ["writing", "copywriting", "content writing", "editing"] },
  { name: "Career & Biz", aliases: ["career", "business", "entrepreneurship", "management", "biz"] },
  { name: "Photography", aliases: ["photography", "photo", "camera", "editing"] },
  { name: "Marketing", aliases: ["marketing", "seo", "social media", "branding"] },
  { name: "Data Science", aliases: ["data science", "machine learning", "data analysis", "analytics"] },
  { name: "Public Speaking", aliases: ["public speaking", "communication", "presentation", "speaking"] },
];

function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

const SkillsSection = () => {
  const [helperCounts, setHelperCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let mounted = true;

    void getExploreHelpers().then(({ data, error }) => {
      if (!mounted || error || !data) return;

      const counts = HOME_SKILLS.reduce<Record<string, number>>((acc, skill) => {
        acc[skill.name] = 0;
        return acc;
      }, {});

      const helperIds = new Set(data.profiles.map((profile) => profile.id));

      helperIds.forEach((helperId) => {
        const searchableTerms = new Set(
          [
            ...data.skills
              .filter((skill) => skill.user_id === helperId)
              .flatMap((skill) => [skill.name, skill.category]),
            ...data.helpOffers
              .filter((offer) => offer.helper_id === helperId)
              .map((offer) => offer.category),
          ]
            .map((value) => normalize(value))
            .filter(Boolean)
        );

        HOME_SKILLS.forEach((skill) => {
          const hasMatch = skill.aliases.some((alias) => {
            const normalizedAlias = normalize(alias);
            return Array.from(searchableTerms).some(
              (term) => term === normalizedAlias || term.includes(normalizedAlias) || normalizedAlias.includes(term)
            );
          });

          if (hasMatch) {
            counts[skill.name] += 1;
          }
        });
      });

      setHelperCounts(counts);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const skillCards = useMemo(
    () =>
      HOME_SKILLS.map((skill) => ({
        ...skill,
        count: `${helperCounts[skill.name] ?? 0} helpers`,
        to: `/explore?tab=helpers&category=${encodeURIComponent(skill.name)}#explore-tabs-bar`,
      })),
    [helperCounts]
  );

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
          {skillCards.map((skill) => (
            <SkillCard key={skill.name} name={skill.name} count={skill.count} to={skill.to} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
