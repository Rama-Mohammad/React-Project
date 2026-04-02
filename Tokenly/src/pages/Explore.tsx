import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import CategoryTabs from "../components/explore/CategoryTabs";
import FilterSideBar from "../components/explore/FilterSideBar";
import HelperCard from "../components/explore/HelperCard";
import RequestCard from "../components/explore/RequestCard";
import SearchBar from "../components/explore/SearchBar";
import SkillCard from "../components/explore/SkillCard";
import StatsHero from "../components/explore/StatsHero";
import {
  exploreStats,
  helperCategories,
  helpers,
  requestCategories,
  requests,
  skillCategories,
  skills,
} from "../data/mockExploreData";
import type { ExploreTab, RequestItem, HelperItem, SkillItem } from "../types/explore";

function matchesSearch(text: string, search: string) {
  return text.toLowerCase().includes(search.toLowerCase().trim());
}

function getEnterStyle(index: number): CSSProperties {
  return {
    "--enter-delay": `${Math.min(index, 10) * 60}ms`,
  } as CSSProperties;
}

export default function Explore() {
  const [activeTab, setActiveTab] = useState<ExploreTab>("requests");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [urgency, setUrgency] = useState("All");
  const [duration, setDuration] = useState("Any");
  const [rating, setRating] = useState("Any rating");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [level, setLevel] = useState("All");

  const filteredRequests: RequestItem[] = useMemo(() => {
    let data = [...requests];

    if (selectedCategory !== "All") {
      data = data.filter((item) => item.category === selectedCategory);
    }

    if (urgency !== "All") {
      data = data.filter((item) => item.urgency === urgency);
    }

    if (duration !== "Any") {
      const maxDuration = duration === "<=30 min" ? 30 : duration === "<=45 min" ? 45 : 60;
      data = data.filter((item) => item.duration <= maxDuration);
    }

    if (search.trim()) {
      data = data.filter((item) =>
        matchesSearch(
          [item.title, item.description, item.category, item.author.name, ...item.tags].join(" "),
          search
        )
      );
    }

    if (sortBy === "Most Offers") {
      data.sort((a, b) => b.offers - a.offers);
    } else if (sortBy === "Lowest Credits") {
      data.sort((a, b) => a.credits - b.credits);
    } else if (sortBy === "Highest Credits") {
      data.sort((a, b) => b.credits - a.credits);
    }

    return data;
  }, [selectedCategory, urgency, duration, search, sortBy]);

  const filteredHelpers: HelperItem[] = useMemo(() => {
    let data = [...helpers];

    if (selectedCategory !== "All") {
      data = data.filter(
        (item) =>
          item.categories.includes(selectedCategory) ||
          item.skills.includes(selectedCategory)
      );
    }

    if (onlineOnly) {
      data = data.filter((item) => item.online);
    }

    if (rating !== "Any rating") {
      const min = rating === "4.0+" ? 4.0 : rating === "4.5+" ? 4.5 : 4.8;
      data = data.filter((item) => item.rating >= min);
    }

    if (search.trim()) {
      data = data.filter((item) =>
        matchesSearch([item.name, item.bio, ...item.categories, ...item.skills].join(" "), search)
      );
    }

    if (sortBy === "Top Rated") {
      data.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Fastest Response") {
      const responseRank = (responseTime: string) => {
        if (responseTime.includes("5")) return 1;
        if (responseTime.includes("10")) return 2;
        if (responseTime.includes("15")) return 3;
        if (responseTime.includes("20")) return 4;
        if (responseTime.includes("25")) return 5;
        if (responseTime.includes("30")) return 6;
        if (responseTime.includes("35")) return 7;
        if (responseTime.includes("40")) return 8;
        if (responseTime.includes("45")) return 9;
        return 10;
      };

      data.sort((a, b) => responseRank(a.responseTime) - responseRank(b.responseTime));
    } else if (sortBy === "Most Sessions") {
      data.sort((a, b) => b.sessions - a.sessions);
    }

    return data;
  }, [selectedCategory, onlineOnly, rating, search, sortBy]);

  const filteredSkills: SkillItem[] = useMemo(() => {
    let data = [...skills];

    if (selectedCategory !== "All") {
      data = data.filter((item) => item.category === selectedCategory);
    }

    if (level !== "All") {
      data = data.filter((item) => item.level === level);
    }

    if (search.trim()) {
      data = data.filter((item) =>
        matchesSearch([item.name, item.description, item.category].join(" "), search)
      );
    }

    if (sortBy === "Most Helpers") {
      data.sort((a, b) => b.helpers - a.helpers);
    } else if (sortBy === "Top Rated") {
      data.sort((a, b) => b.avgRating - a.avgRating);
    } else if (sortBy === "Most Sessions") {
      data.sort((a, b) => b.sessions - a.sessions);
    }

    return data;
  }, [selectedCategory, level, search, sortBy]);

  const currentCategories =
    activeTab === "requests"
      ? requestCategories
      : activeTab === "helpers"
      ? helperCategories
      : skillCategories;

  const totalCount =
    activeTab === "requests"
      ? filteredRequests.length
      : activeTab === "helpers"
      ? filteredHelpers.length
      : filteredSkills.length;

  const titleText =
    activeTab === "requests"
      ? "Browse open help requests from peers"
      : activeTab === "helpers"
      ? "Find experts ready to help you"
      : "Explore skills available in the community";

  const handleTabChange = (tab: ExploreTab) => {
    setActiveTab(tab);
    setSearch("");
    setSelectedCategory("All");
    setUrgency("All");
    setDuration("Any");
    setRating("Any rating");
    setOnlineOnly(false);
    setLevel("All");

    if (tab === "requests") setSortBy("Newest");
    if (tab === "helpers") setSortBy("Top Rated");
    if (tab === "skills") setSortBy("Most Helpers");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(160deg,#e8efff_0%,#e9f7ff_45%,#f5f8ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="explore-pulse absolute -left-28 top-24 h-64 w-64 rounded-full bg-indigo-200/25 blur-3xl" />
        <div className="explore-float absolute right-[-7rem] top-40 h-72 w-72 rounded-full bg-sky-200/22 blur-3xl" />
        <div className="explore-pulse absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-purple-200/20 blur-3xl" />
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-5 lg:px-6 lg:py-8">
        <StatsHero stats={exploreStats} />

        <section className="mt-8">
          <div className="explore-fade-in-up mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CategoryTabs
              activeTab={activeTab}
              onChange={handleTabChange}
              counts={{
                requests: requests.length,
                helpers: helpers.length,
                skills: skills.length,
              }}
            />

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 lg:text-right">
              {titleText}
            </p>
          </div>

          <div className="explore-glass explore-fade-in-up rounded-[1.25rem] border border-white/50 bg-white/70 p-4 backdrop-blur-xl md:p-5">
            <SearchBar
              activeTab={activeTab}
              search={search}
              onSearchChange={setSearch}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            <div className="mt-4">
              <FilterSideBar
                activeTab={activeTab}
                categories={currentCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                urgency={urgency}
                onUrgencyChange={setUrgency}
                duration={duration}
                onDurationChange={setDuration}
                rating={rating}
                onRatingChange={setRating}
                onlineOnly={onlineOnly}
                onOnlineOnlyChange={setOnlineOnly}
                level={level}
                onLevelChange={setLevel}
                totalCount={totalCount}
              />
            </div>
          </div>

          {activeTab === "requests" && (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredRequests.map((item, index) => (
                <div key={item.id} className="explore-fade-in-up h-full" style={getEnterStyle(index)}>
                  <RequestCard item={item} />
                </div>
              ))}
            </div>
          )}

          {activeTab === "helpers" && (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredHelpers.map((item, index) => (
                <div key={item.id} className="explore-fade-in-up h-full" style={getEnterStyle(index)}>
                  <HelperCard item={item} />
                </div>
              ))}
            </div>
          )}

          {activeTab === "skills" && (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredSkills.map((item, index) => (
                <div key={item.id} className="explore-fade-in-up h-full" style={getEnterStyle(index)}>
                  <SkillCard item={item} />
                </div>
              ))}
            </div>
          )}

          {totalCount === 0 && (
            <div className="explore-fade-in-up mt-6 rounded-[1.5rem] border border-dashed border-white/40 bg-white/70 p-8 text-center shadow-sm backdrop-blur-xl">
              <h3 className="text-xl font-bold text-slate-900">No results found</h3>
              <p className="mt-2 text-sm text-slate-500">Try changing the filters or search term.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
