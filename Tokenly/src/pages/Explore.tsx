import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
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
  mapRequestToExploreItem,
  mapSkillToExploreItem,
  type SkillWithRelations,
} from "../utils/exploreMappers";
import type { ExploreTab, RequestItem, HelperItem, SkillItem, OfferItem, Urgency, SkillLevel } from "../types/explore";
import useRequests from "../hooks/useRequest";
import { extractAvailabilityFromOfferDescription } from "../services/offerService";
import { getAllSkills } from "../services/skillService";
import { getExploreHelpers } from "../services/helperExploreService";
import { mapProfileToHelperItem } from "../utils/helperExploreMapper";
import { supabase } from "../lib/supabaseClient";

function matchesSearch(text: string, search: string) {
  return text.toLowerCase().includes(search.toLowerCase().trim());
}

function getEnterStyle(index: number): CSSProperties {
  return {
    "--enter-delay": `${Math.min(index, 10) * 60}ms`,
  } as CSSProperties;
}

function toRelativeAge(dateValue?: string | null) {
  if (!dateValue) return "just now";

  const date = new Date(dateValue);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (!Number.isFinite(diffMs) || diffMs < 0) return "just now";

  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 60) return `${Math.max(1, minutes)}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function buildDynamicOptions(values: Array<string | null | undefined>, fallback: string) {
  const unique = Array.from(
    new Set(
      values
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value))
    )
  ).sort((a, b) => a.localeCompare(b));

  return ["All", ...(unique.length > 0 ? unique : [fallback])];
}

export default function Explore() {
  const location = useLocation();
  const tabsBarRef = useRef<HTMLDivElement | null>(null);
  const {
    requests: liveOpenRequests,
    fetchOpenRequests,
    loading: requestsLoading,
    error: requestsError,
  } = useRequests();
  const [activeTab, setActiveTab] = useState<ExploreTab>("requests");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [urgency, setUrgency] = useState("All");
  const [duration, setDuration] = useState("Any");
  const [rating, setRating] = useState("Any rating");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [level, setLevel] = useState("All");
  const [liveSkills, setLiveSkills] = useState<SkillWithRelations[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState("");
  const [liveHelpers, setLiveHelpers] = useState<HelperItem[]>([]);
  const [helpersLoading, setHelpersLoading] = useState(false);
  const [helpersError, setHelpersError] = useState("");
  const [liveOffers, setLiveOffers] = useState<OfferItem[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offersError, setOffersError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedTab = params.get("tab");

    if (requestedTab === "requests" || requestedTab === "helpers" || requestedTab === "skills" || requestedTab === "offers") {
      setActiveTab(requestedTab);
    }
  }, [location.search]);

  const shouldOpenHowItWorks = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("modal") === "how-it-works";
  }, [location.search]);

  useEffect(() => {
    if (location.hash !== "#explore-tabs-bar") return;
    if (!tabsBarRef.current) return;

    const id = window.setTimeout(() => {
      tabsBarRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);

    return () => window.clearTimeout(id);
  }, [location.hash]);

  useEffect(() => {
    if (activeTab !== "requests") return;

    const mappedUrgency =
      urgency === "Low" ? "low" : urgency === "Medium" ? "medium" : urgency === "High" ? "high" : undefined;
    const mappedDuration =
      duration === "<=30 min" ? 30 : duration === "<=45 min" ? 45 : duration === "<=60 min" ? 60 : undefined;

    void fetchOpenRequests({
      category: selectedCategory === "All" ? undefined : selectedCategory,
      urgency: mappedUrgency,
      max_duration: mappedDuration,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, duration, selectedCategory, urgency]);

  useEffect(() => {
    if (activeTab !== "skills") return;

    let mounted = true;
    setSkillsLoading(true);
    setSkillsError("");

    void getAllSkills().then(({ data, error }) => {
      if (!mounted) return;

      if (error) {
        setSkillsError(error.message);
        setLiveSkills([]);
        setSkillsLoading(false);
        return;
      }

      setLiveSkills(((data ?? []) as SkillWithRelations[]));
      setSkillsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "helpers") return;

    let mounted = true;
    setHelpersLoading(true);
    setHelpersError("");

    void getExploreHelpers().then(({ data, error }) => {
      if (!mounted) return;

      if (error || !data) {
        setHelpersError(error?.message ?? "Failed to load helpers");
        setLiveHelpers([]);
        setHelpersLoading(false);
        return;
      }

      const mapped = data.profiles.map((profile) =>
        mapProfileToHelperItem(profile, data.skills, data.sessions, data.helpOffers)
      );
      setLiveHelpers(mapped);
      setHelpersLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "offers") return;

    let mounted = true;
    setOffersLoading(true);
    setOffersError("");

    void Promise.all([
      supabase
        .from("offers")
        .select(`
          id,
          request_id,
          helper_id,
          message,
          availability,
          status,
          created_at,
          request:requests!offers_request_id_fkey(
            title,
            category,
            credit_cost,
            duration_minutes
          ),
          helper:profiles!offers_helper_id_fkey(
            full_name,
            username
          )
        `)
        .order("created_at", { ascending: false }),
      supabase
        .from("help_offers")
        .select("id, helper_id, title, description, category, urgency, duration_minutes, credit_cost, status, created_at")
        .order("created_at", { ascending: false }),
    ]).then(([requestOffersResult, independentOffersResult]) => {
      if (!mounted) return;

      if (requestOffersResult.error) {
        setOffersError(requestOffersResult.error.message ?? "Failed to load offers");
        setLiveOffers([]);
        setOffersLoading(false);
        return;
      }

      if (independentOffersResult.error) {
        setOffersError(independentOffersResult.error.message ?? "Failed to load independent offers");
        setLiveOffers([]);
        setOffersLoading(false);
        return;
      }

      const requestMapped: OfferItem[] = ((requestOffersResult.data ?? []) as Array<Record<string, unknown>>).map((row) => {
        const helperRaw = row.helper as
          | { full_name?: string | null; username?: string | null }
          | { full_name?: string | null; username?: string | null }[]
          | null;
        const requestRaw = row.request as
          | { title?: string | null; category?: string | null; credit_cost?: number | null; duration_minutes?: number | null }
          | { title?: string | null; category?: string | null; credit_cost?: number | null; duration_minutes?: number | null }[]
          | null;

        const helper = Array.isArray(helperRaw) ? helperRaw[0] : helperRaw;
        const request = Array.isArray(requestRaw) ? requestRaw[0] : requestRaw;

        return {
          id: String(row.id ?? ""),
          source: "request",
          helperId: String(row.helper_id ?? ""),
          requestId: String(row.request_id ?? ""),
          createdAt: String(row.created_at ?? ""),
          requestTitle: request?.title ?? "Unknown request",
          category: request?.category ?? "General",
          helperName: helper?.full_name ?? helper?.username ?? "Unknown helper",
          message: String(row.message ?? "No message provided."),
          availability: String(row.availability ?? "Availability not provided."),
          status: String(row.status ?? "pending"),
          credits: request?.credit_cost ?? 0,
          duration: request?.duration_minutes ?? 0,
          submittedAgo: toRelativeAge((row.created_at as string | null) ?? null),
        };
      });

      const helperNameById = requestMapped.reduce<Record<string, string>>((acc, item) => {
        if (item.helperId) acc[item.helperId] = item.helperName;
        return acc;
      }, {});

      const independentMapped: OfferItem[] = ((independentOffersResult.data ?? []) as Array<Record<string, unknown>>).map((row) => {
        const parsedOffer = extractAvailabilityFromOfferDescription(String(row.description ?? ""));

        return {
          id: String(row.id ?? ""),
          source: "independent",
          helperId: String(row.helper_id ?? ""),
          requestId: "",
          createdAt: String(row.created_at ?? ""),
          requestTitle: String(row.title ?? "Independent offer"),
          category: String(row.category ?? "General"),
          helperName: helperNameById[String(row.helper_id ?? "")] ?? "Helper",
          message: parsedOffer.summary,
          availability: parsedOffer.availability,
          status: String(row.status ?? "open"),
          credits: Number(row.credit_cost ?? 0),
          duration: Number(row.duration_minutes ?? 0),
          submittedAgo: toRelativeAge((row.created_at as string | null) ?? null),
        };
      });

      const merged = [...requestMapped, ...independentMapped].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setLiveOffers(merged);
      setOffersLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [activeTab]);

 const filteredRequests: RequestItem[] = useMemo(() => {
  let data = liveOpenRequests.map((item) => mapRequestToExploreItem(item as never));

  if (selectedCategory !== "All") {
    data = data.filter((item) => item.category === selectedCategory);
  }

  if (urgency !== "All") {
    data = data.filter((item) => item.urgency === urgency);
  }

  if (duration !== "Any") {
    if (duration === ">60 min") {
      data = data.filter((item) => item.duration > 60);
    } else {
      const maxDuration = duration === "<=30 min" ? 30 : duration === "<=45 min" ? 45 : 60;
      data = data.filter((item) => item.duration <= maxDuration);
    }
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
  } else if (sortBy === "Lowest Tokens") {
    data.sort((a, b) => a.credits - b.credits);
  } else if (sortBy === "Highest Tokens") {
    data.sort((a, b) => b.credits - a.credits);
  }

  return data;
}, [liveOpenRequests, selectedCategory, urgency, duration, search, sortBy]);

  const filteredHelpers: HelperItem[] = useMemo(() => {
    let data = [...liveHelpers];

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
  }, [liveHelpers, onlineOnly, rating, search, selectedCategory, sortBy]);

  const filteredSkills: SkillItem[] = useMemo(() => {
    let data = liveSkills.map((item) => mapSkillToExploreItem(item));

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
  }, [level, liveSkills, search, selectedCategory, sortBy]);

  const filteredOffers: OfferItem[] = useMemo(() => {
    let data = [...liveOffers];

    if (selectedCategory !== "All") {
      data = data.filter((item) => item.category === selectedCategory);
    }

    if (search.trim()) {
      data = data.filter((item) =>
        matchesSearch(
          [item.requestTitle, item.category, item.helperName, item.message, item.availability].join(" "),
          search
        )
      );
    }

    if (sortBy === "Oldest") {
      data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "Highest Tokens") {
      data.sort((a, b) => b.credits - a.credits);
    }

    return data;
  }, [liveOffers, search, selectedCategory, sortBy]);

  const requestCategoryOptions = useMemo(
    () => buildDynamicOptions(liveOpenRequests.map((item) => item.category), "General"),
    [liveOpenRequests]
  );

  const helperCategoryOptions = useMemo(
    () =>
      buildDynamicOptions(
        liveHelpers.flatMap((item) => [...item.categories, ...item.skills]),
        "General"
      ),
    [liveHelpers]
  );

  const skillCategoryOptions = useMemo(
    () => buildDynamicOptions(liveSkills.map((item) => item.category ?? "Other"), "Other"),
    [liveSkills]
  );

  const offerCategoryOptions = useMemo(
    () => buildDynamicOptions(liveOffers.map((item) => item.category), "General"),
    [liveOffers]
  );

  const requestUrgencyOptions = useMemo(() => {
    const priorities: Array<"All" | Urgency> = ["All", "High", "Medium", "Low"];
    const available = new Set<Urgency>(liveOpenRequests.map((item) =>
      item.urgency === "high" ? "High" : item.urgency === "medium" ? "Medium" : "Low"
    ));
    return priorities.filter((item) => item === "All" || available.has(item));
  }, [liveOpenRequests]);

  const requestDurationOptions = useMemo(() => {
    const availableDurations = liveOpenRequests.map((item) => item.duration_minutes ?? 0);
    const options = ["Any"];

    if (availableDurations.some((value) => value > 0 && value <= 30)) options.push("<=30 min");
    if (availableDurations.some((value) => value > 30 && value <= 45)) options.push("<=45 min");
    if (availableDurations.some((value) => value > 45 && value <= 60)) options.push("<=60 min");
    if (availableDurations.some((value) => value > 60)) options.push(">60 min");

    return options;
  }, [liveOpenRequests]);

  const helperRatingOptions = useMemo(() => {
    const maxRating = liveHelpers.reduce((highest, item) => Math.max(highest, item.rating), 0);
    const options = ["Any rating"];
    if (maxRating >= 4) options.push("4.0+");
    if (maxRating >= 4.5) options.push("4.5+");
    if (maxRating >= 4.8) options.push("4.8+");
    return options;
  }, [liveHelpers]);

  const skillLevelOptions = useMemo(() => {
    const priorities: Array<"All" | SkillLevel> = ["All", "Beginner", "Intermediate", "Advanced"];
    const available = new Set<SkillLevel>(liveSkills.map((item) => mapSkillToExploreItem(item).level));
    return priorities.filter((item) => item === "All" || available.has(item));
  }, [liveSkills]);

  const currentCategories =
    activeTab === "requests"
      ? requestCategoryOptions
      : activeTab === "helpers"
      ? helperCategoryOptions
      : activeTab === "skills"
      ? skillCategoryOptions
      : offerCategoryOptions;

  useEffect(() => {
    if (!currentCategories.includes(selectedCategory)) {
      setSelectedCategory("All");
    }
  }, [currentCategories, selectedCategory]);

  useEffect(() => {
    if (activeTab === "requests" && !(requestUrgencyOptions as string[]).includes(urgency)) {
      setUrgency("All");
    }
  }, [activeTab, requestUrgencyOptions, urgency]);

  useEffect(() => {
    if (activeTab === "requests" && !requestDurationOptions.includes(duration)) {
      setDuration("Any");
    }
  }, [activeTab, duration, requestDurationOptions]);

  useEffect(() => {
    if (activeTab === "helpers" && !helperRatingOptions.includes(rating)) {
      setRating("Any rating");
    }
  }, [activeTab, helperRatingOptions, rating]);

  useEffect(() => {
    if (activeTab === "skills" && !(skillLevelOptions as string[]).includes(level)) {
      setLevel("All");
    }
  }, [activeTab, level, skillLevelOptions]);

  const totalCount =
    activeTab === "requests"
      ? filteredRequests.length
      : activeTab === "helpers"
      ? filteredHelpers.length
      : activeTab === "skills"
      ? filteredSkills.length
      : filteredOffers.length;

  const tabCounts = useMemo(
    () => ({
      requests: filteredRequests.length,
      helpers: filteredHelpers.length,
      skills: filteredSkills.length,
      offers: filteredOffers.length,
    }),
    [filteredRequests.length, filteredHelpers.length, filteredSkills.length, filteredOffers.length]
  );

  const dynamicStats = useMemo(() => {
    const totalSessions = liveHelpers.reduce((sum, helper) => sum + helper.sessions, 0);
    const totalCredits = liveHelpers.reduce((sum, helper) => sum + helper.creditsPerHour, 0);
    const liveCount = liveOpenRequests.length;

    return {
      activeRequests: liveCount || filteredRequests.length,
      helpersOnline: filteredHelpers.filter((helper) => helper.online).length,
      sessionsToday: Math.max(1, Math.round(totalSessions / 20)),
      creditsExchanged: `${Math.max(1, Math.round(totalCredits / 10))}k`,
    };
  }, [filteredHelpers, filteredRequests.length, liveHelpers, liveOpenRequests.length]);

  const defaultHelperId = useMemo(() => {
    return filteredHelpers.find((helper) => helper.online)?.id ?? liveHelpers[0]?.id ?? "h1";
  }, [filteredHelpers]);

  const titleText =
    activeTab === "requests"
      ? "Browse open help requests from peers"
      : activeTab === "helpers"
      ? "Find experts ready to help you"
      : activeTab === "skills"
      ? "Explore skills available in the community"
      : "See offers submitted by helpers across requests";

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
    if (tab === "offers") setSortBy("Newest");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="explore-pulse absolute -left-28 top-24 h-64 w-64 rounded-full bg-indigo-200/25 blur-3xl" />
        <div className="explore-float absolute right-[-7rem] top-40 h-72 w-72 rounded-full bg-sky-200/22 blur-3xl" />
        <div className="explore-pulse absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-purple-200/20 blur-3xl" />
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto w-[90vw] px-2 py-6 sm:px-3 lg:px-4 lg:py-8">
        <StatsHero
          stats={dynamicStats}
          defaultHelperId={defaultHelperId}
          openHowItWorks={shouldOpenHowItWorks}
        />

        <section className="mt-8">
          <div
            id="explore-tabs-bar"
            ref={tabsBarRef}
            className="explore-fade-in-up mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
          >
            <CategoryTabs
              activeTab={activeTab}
              onChange={handleTabChange}
              counts={tabCounts}
            />

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 lg:text-right">
              {titleText}
            </p>
          </div>
          {activeTab === "requests" && !requestsLoading && !requestsError ? (
            <p className="mb-4 text-xs text-slate-500">Live open requests: {liveOpenRequests.length}</p>
          ) : null}

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
                urgencyOptions={requestUrgencyOptions}
                durationOptions={requestDurationOptions}
                ratingOptions={helperRatingOptions}
                levelOptions={skillLevelOptions}
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

          {activeTab === "requests" && requestsLoading ? (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              Loading requests...
            </div>
          ) : activeTab === "requests" && requestsError ? (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
              {requestsError}
            </div>
          ) : activeTab === "requests" ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredRequests.map((item, index) => (
                <div key={item.id} className="explore-fade-in-up h-full" style={getEnterStyle(index)}>
                  <RequestCard item={item} />
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === "helpers" && helpersLoading ? (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              Loading helpers...
            </div>
          ) : activeTab === "helpers" && helpersError ? (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
              {helpersError}
            </div>
          ) : activeTab === "helpers" ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredHelpers.map((item, index) => (
                <div key={item.id} className="explore-fade-in-up h-full" style={getEnterStyle(index)}>
                  <HelperCard item={item} />
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === "skills" && skillsLoading ? (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              Loading skills...
            </div>
          ) : activeTab === "skills" && skillsError ? (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
              {skillsError}
            </div>
          ) : activeTab === "skills" ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredSkills.map((item, index) => (
                <div key={item.id} className="explore-fade-in-up h-full" style={getEnterStyle(index)}>
                  <SkillCard item={item} />
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === "offers" && offersLoading ? (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              Loading offers...
            </div>
          ) : activeTab === "offers" && offersError ? (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
              {offersError}
            </div>
          ) : activeTab === "offers" ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredOffers.map((item, index) => (
                <article
                  key={item.id}
                  className="explore-fade-in-up flex h-full flex-col rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur"
                  style={getEnterStyle(index)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-slate-500">{item.submittedAgo}</p>
                      <h3 className="mt-1 text-base font-semibold text-slate-900">{item.requestTitle}</h3>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.status === "accepted"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.status === "rejected"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">{item.category} by {item.helperName}</p>
                  <p className="mt-3 text-sm text-slate-700">{item.message}</p>
                  <p className="mt-2 text-xs text-slate-600">Availability: {item.availability}</p>

                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                    <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700">
                      {item.duration} min
                    </span>
                    <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700">
                      {item.credits} tokens
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {item.source === "request" ? (
                        <>
                          <Link
                            to={`/requests/${item.requestId}`}
                            className="inline-flex h-9 items-center rounded-xl border border-slate-300/70 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            View Request
                          </Link>
                          <Link
                            to={`/offers/${item.id}/appointment`}
                            className="inline-flex h-9 items-center rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500 px-3 text-sm font-semibold text-white transition hover:brightness-105"
                          >
                            Accept Offer
                          </Link>
                        </>
                      ) : (
                        <Link
                          to={`/offers/${item.id}/appointment?source=independent`}
                          className="inline-flex h-9 items-center rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500 px-3 text-sm font-semibold text-white transition hover:brightness-105"
                        >
                          Accept Offer
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}

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




