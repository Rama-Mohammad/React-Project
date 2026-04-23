import { ArrowLeft, Code2, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/common/Loader";
import ThemedSelect from "../components/common/ThemedSelect";
import HelperCard from "../components/explore/HelperCard";
import type { HelperItem, SkillItem, SkillWithRelations } from "../types/explore";
import { getExploreHelpers } from "../services/helperExploreService";
import { mapProfileToHelperItem } from "../utils/helperExploreMapper";
import { getAllSkills } from "../services/skillService";
import { mapSkillToExploreItem } from "../utils/exploreMappers";

const levelStyles: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-amber-50 text-amber-700",
  Advanced: "bg-rose-50 text-rose-700",
};

export default function SkillHelpers() {
  const { skillId } = useParams<{ skillId: string }>();
  const [skill, setSkill] = useState<SkillItem | null>(null);
  const [isLoadingSkill, setIsLoadingSkill] = useState(true);
  const [skillLoadError, setSkillLoadError] = useState("");
  const [helpers, setHelpers] = useState<HelperItem[]>([]);
  const [helpersLoadError, setHelpersLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState("Any");
  const [sortBy, setSortBy] = useState("Top Rated");

  useEffect(() => {
    if (!skillId) {
      setIsLoadingSkill(false);
      return;
    }

    let mounted = true;
    setIsLoadingSkill(true);
    setSkillLoadError("");

    void getAllSkills().then(({ data, error }) => {
      if (!mounted) return;

      if (error) {
        setSkillLoadError(error.message);
        setSkill(null);
        setIsLoadingSkill(false);
        return;
      }

      const mappedSkills = ((data ?? []) as SkillWithRelations[]).map((item) =>
        mapSkillToExploreItem(item)
      );
      const selectedSkill = mappedSkills.find((entry) => entry.id === skillId) ?? null;

      setSkill(selectedSkill);
      setIsLoadingSkill(false);
    });

    return () => {
      mounted = false;
    };
  }, [skillId]);

  useEffect(() => {
    let mounted = true;
    setHelpersLoadError("");

    void getExploreHelpers().then(({ data, error }) => {
      if (!mounted) return;

      if (error || !data) {
        setHelpersLoadError(error?.message ?? "Failed to load helpers");
        setHelpers([]);
        return;
      }

      const mapped = data.profiles.map((profile) =>
        mapProfileToHelperItem(profile, data.skills, data.sessions, data.helpOffers)
      );
      setHelpers(mapped);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const matchedHelpers = useMemo(() => {
    if (!skill) return [];

    let data = helpers.filter(
      (helper) =>
        helper.skills.includes(skill.name) ||
        helper.categories.includes(skill.category) ||
        helper.skills.includes(skill.category)
    );

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      data = data.filter((helper) =>
        [helper.name, helper.bio, ...helper.skills, ...helper.categories]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }

    if (minRating !== "Any") {
      const threshold = minRating === "4.0+" ? 4.0 : minRating === "4.5+" ? 4.5 : 4.8;
      data = data.filter((helper) => helper.rating >= threshold);
    }

    if (sortBy === "Top Rated") {
      data = data.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Fastest Response") {
      const responseRank = (responseTime: string) => {
        if (responseTime.includes("5")) return 1;
        if (responseTime.includes("10")) return 2;
        if (responseTime.includes("15")) return 3;
        if (responseTime.includes("20")) return 4;
        if (responseTime.includes("30")) return 5;
        return 6;
      };

      data = data.sort((a, b) => responseRank(a.responseTime) - responseRank(b.responseTime));
    } else if (sortBy === "Most Sessions") {
      data = data.sort((a, b) => b.sessions - a.sessions);
    }

    return data;
  }, [skill, helpers, search, minRating, sortBy]);

  if (!skill) {
    if (isLoadingSkill) {
      return (
        <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
          <main className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
            <Loader inline label="Loading skill..." />
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
        <main className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Skill not found</h1>
          <p className="mt-2 text-slate-600">
            {skillLoadError || "This skill page is not available."}
          </p>
          <Link
            to="/explore"
            className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Back to Explore
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-full overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="explore-pulse absolute -left-28 top-24 h-64 w-64 rounded-full bg-indigo-200/25 blur-3xl" />
        <div className="explore-float absolute -right-28 top-40 h-72 w-72 rounded-full bg-sky-200/22 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-5 lg:px-6 lg:py-8">
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/explore" className="inline-flex items-center gap-1.5 transition hover:text-slate-700">
            <ArrowLeft size={14} />
            Explore
          </Link>
          <span>/</span>
          <span>Skills</span>
          <span>/</span>
          <span className="font-semibold text-slate-700">{skill.name}</span>
        </div>

        <section className="explore-glass explore-fade-in-up rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-100 via-sky-100 to-purple-100 text-indigo-600">
                <Code2 size={24} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">{skill.name}</h1>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      levelStyles[skill.level] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {skill.level}
                  </span>
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                    {skill.category}
                  </span>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{skill.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-center">
              <div>
                <p className="text-2xl font-bold text-slate-900">{skill.helpers}</p>
                <p className="text-xs text-slate-500">Helpers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{skill.avgRating.toFixed(1)}</p>
                <p className="text-xs text-slate-500">Avg Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{skill.sessions}</p>
                <p className="text-xs text-slate-500">Sessions</p>
              </div>
            </div>
          </div>
        </section>

        {helpersLoadError ? (
          <p className="mt-2 text-sm font-medium text-rose-600">{helpersLoadError}</p>
        ) : null}

        <section className="explore-glass explore-fade-in-up relative z-40 mt-4 overflow-visible rounded-3xl border border-white/55 bg-white/80 p-4 backdrop-blur-xl md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            <label className="relative block flex-1">
              <Search size={16} className="pointer-events-none absolute left-3 top-3 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Search helpers for ${skill.name}...`}
                className="h-11 w-full rounded-2xl border border-slate-200/80 bg-white/92 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            <ThemedSelect
              value={sortBy}
              onChange={setSortBy}
              options={["Top Rated", "Fastest Response", "Most Sessions"].map((option) => ({
                value: option,
                label: option,
              }))}
              ariaLabel="Helper sort"
              size="md"
              className="min-w-47.5"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {["Any", "4.0+", "4.5+", "4.8+"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMinRating(option)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  minRating === option
                    ? "border border-indigo-300 bg-indigo-50 text-indigo-700"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {option}
              </button>
            ))}
            <span className="ml-auto text-xs font-medium text-slate-500">{matchedHelpers.length} helpers</span>
          </div>
        </section>

        {matchedHelpers.length > 0 ? (
          <section className="relative z-10 mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {matchedHelpers.map((helper) => (
              <div key={helper.id} className="explore-fade-in-up h-full">
                <HelperCard item={helper} />
              </div>
            ))}
          </section>
        ) : (
          <section className="explore-fade-in-up relative z-10 mt-6 rounded-3xl border border-dashed border-white/40 bg-white/70 p-8 text-center shadow-sm backdrop-blur-xl">
            <h3 className="text-xl font-bold text-slate-900">No helpers found</h3>
            <p className="mt-2 text-sm text-slate-500">
              Try relaxing filters or searching with another keyword.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setMinRating("Any");
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Sparkles size={14} />
              Reset filters
            </button>
          </section>
        )}
      </main>
    </div>
  );
}


