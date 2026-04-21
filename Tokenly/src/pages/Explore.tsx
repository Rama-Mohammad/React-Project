import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import CategoryTabs from "../components/explore/CategoryTabs";
import FilterSideBar from "../components/explore/FilterSideBar";
import HelperCard from "../components/explore/HelperCard";
import RequestCard from "../components/explore/RequestCard";
import SearchBar from "../components/explore/SearchBar";
import SkillCard from "../components/explore/SkillCard";
import StatsHero from "../components/explore/StatsHero";
import HelperDetailsModal from "../components/explore/HelperDetailsModal";
import Avatar from "../components/common/Avatar";
import Loader from "../components/common/Loader";
import {
  mapRequestToExploreItem,
  mapSkillToExploreItem,
  type SkillWithRelations,
} from "../utils/exploreMappers";
import type { ExploreTab, RequestItem, HelperItem, SkillItem, HelpOfferItem, Urgency, SkillLevel } from "../types/explore";
import useRequests from "../hooks/useRequest";
import { getAllSkills } from "../services/skillService";
import { getExploreHelpers } from "../services/helperExploreService";
import { mapProfileToHelperItem } from "../utils/helperExploreMapper";
import { getOpenHelpOffers } from "../services/helpOfferService";
import useAuth from "../hooks/useAuth";
import useAuthRedirect from "../hooks/useAuthRedirect";

function matchesSearch(text: string, search: string) {
  return text.toLowerCase().includes(search.toLowerCase().trim());
}

function getEnterStyle(index: number): CSSProperties {
  return {
    "--enter-delay": `${Math.min(index, 10) * 60}ms`,
  } as CSSProperties;
}

function buildPagination(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 1) return [1];
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages = new Set<number>([1, totalPages, currentPage + 1]);
  for (let offset = -1; offset <= 1; offset += 1) {
    const candidate = currentPage + 1 + offset;
    if (candidate > 1 && candidate < totalPages) {
      pages.add(candidate);
    }
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b);
  const pagination: Array<number | "ellipsis"> = [];

  sortedPages.forEach((page, index) => {
    const previous = sortedPages[index - 1];
    if (previous && page - previous > 1) {
      pagination.push("ellipsis");
    }
    pagination.push(page);
  });

  return pagination;
}

function toRelativeAge(dateValue?: string | null): string {
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

// A helper is considered online if their last_seen is within the last 15 minutes
function isOnline(lastSeen?: string | null): boolean {
  if (!lastSeen) return false;
  return Date.now() - new Date(lastSeen).getTime() < 15 * 60 * 1000;
}

function buildDynamicOptions(values: (string | null | undefined)[], fallback: string): string[] {
  const unique = Array.from(new Set(values.filter(Boolean) as string[])).sort();
  return ["All", ...(unique.length > 0 ? unique : [fallback])];
}

function preserveSelectedOption(options: string[], selectedOption: string, defaultOption: string): string[] {
  if (selectedOption === defaultOption || options.includes(selectedOption)) {
    return options;
  }

  return [...options, selectedOption];
}

const HELPER_BASIC_FILTERS = [
  "All",
  "Programming",
  "Design",
  "Writing",
  "Web Development",
  "Machine Learning",
] as const;

export default function Explore() {
  const { isAuthenticated } = useAuth();
  const { authRedirectState } = useAuthRedirect();
  const location = useLocation();
  const tabsBarRef = useRef<HTMLDivElement | null>(null);
  const pendingPaginationScrollRef = useRef<{
    page: number;
    tab: ExploreTab;
  } | null>(null);
  const [selectedHelperForModal, setSelectedHelperForModal] = useState<HelperItem | null>(null);
  const {
    requests: liveOpenRequests,
    fetchOpenRequests,
    loading: requestsLoading,
    error: requestsError,
  } = useRequests();
  const [activeTab, setActiveTab] = useState<ExploreTab>("requests");
  const [search, setSearch] = useState("");
  const [showMoreSkillFilters, setShowMoreSkillFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedHelperCategories, setSelectedHelperCategories] = useState<string[]>([]);
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
  const [liveOffers, setLiveOffers] = useState<HelpOfferItem[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offersError, setOffersError] = useState("");
  const [countsLoading, setCountsLoading] = useState({
    requests: true,
    helpers: true,
    skills: true,
    offers: true,
  });

  const PAGE_SIZE = 12;

  const [requestsPage, setRequestsPage] = useState(0);
  const [skillsPage, setSkillsPage] = useState(0);
  const [offersPage, setOffersPage] = useState(0);

  const [requestsTotal, setRequestsTotal] = useState(0);
  const [skillsTotal, setSkillsTotal] = useState(0);
  const [offersTotal, setOffersTotal] = useState(0);
  const [requestCategoryCatalog, setRequestCategoryCatalog] = useState<string[]>(["All"]);

  const requestedCategory = useMemo(() => {
    return new URLSearchParams(location.search).get("category")?.trim() ?? "";
  }, [location.search]);

  // Sync tab from URL param (e.g. /explore?tab=helpers)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedTab = params.get("tab");

    if (requestedTab === "requests" || requestedTab === "helpers" || requestedTab === "skills" || requestedTab === "offers") {
      setActiveTab(requestedTab);
    }
  }, [location.search]);

  useEffect(() => {
    if (activeTab !== "skills") {
      setShowMoreSkillFilters(false);
    }
  }, [activeTab]);

  const shouldOpenHowItWorks = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("modal") === "how-it-works";
  }, [location.search]);

  // Smooth scroll to tabs bar when navigated via hash
  useEffect(() => {
    if (location.hash !== "#explore-tabs-bar") return;
    if (!tabsBarRef.current) return;

    const id = window.setTimeout(() => {
      tabsBarRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);

    return () => window.clearTimeout(id);
  }, [location.hash]);

  // Reset requests pagination when filters or tab change
  useEffect(() => {
    setRequestsPage(0);
  }, [activeTab, duration, selectedCategory, urgency]);

  // Requests tab: refetch when filters or page changes
  useEffect(() => {
    if (activeTab !== "requests") return;

    let mounted = true;
    const mappedUrgency =
      urgency === "Low" ? "low" : urgency === "Medium" ? "medium" : urgency === "High" ? "high" : undefined;
    const mappedDuration =
      duration === "<=30 min" ? 30 : duration === "<=45 min" ? 45 : duration === "<=60 min" ? 60 : undefined;

    setCountsLoading((current) => ({ ...current, requests: true }));

    void fetchOpenRequests(
      {
        category: selectedCategory === "All" ? undefined : selectedCategory,
        urgency: mappedUrgency,
        max_duration: mappedDuration,
        page: requestsPage,
        pageSize: PAGE_SIZE,
      }
    ).then((count) => {
      if (!mounted) return;
      setRequestsTotal(count ?? 0);
      setCountsLoading((current) => ({ ...current, requests: false }));
    });

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, duration, selectedCategory, urgency, requestsPage]);

  useEffect(() => {
    setRequestCategoryCatalog((current) => {
      const discovered = liveOpenRequests
        .map((item) => item.category)
        .filter((item): item is string => Boolean(item?.trim()));

      return Array.from(new Set([...current, ...discovered])).sort((a, b) => {
        if (a === "All") return -1;
        if (b === "All") return 1;
        return a.localeCompare(b);
      });
    });
  }, [liveOpenRequests]);

  // Reset skills pagination when tab changes
  useEffect(() => {
    setSkillsPage(0);
  }, [activeTab]);

  // Skills tab: fetch when tab is active or page changes
  useEffect(() => {
    if (activeTab !== "skills") return;

    let mounted = true;
    setSkillsLoading(true);
    setSkillsError("");
    setCountsLoading((current) => ({ ...current, skills: true }));

    void getAllSkills({ page: skillsPage, pageSize: PAGE_SIZE }).then(({ data, error, count }) => {
      if (!mounted) return;

      if (error) {
        setSkillsError(error.message);
        setLiveSkills([]);
        setSkillsLoading(false);
        setCountsLoading((current) => ({ ...current, skills: false }));
        return;
      }

      const incoming = (data ?? []) as SkillWithRelations[];
      setLiveSkills(incoming);
      setSkillsTotal(count ?? 0);
      setSkillsLoading(false);
      setCountsLoading((current) => ({ ...current, skills: false }));
    });

    return () => {
      mounted = false;
    };
  }, [activeTab, skillsPage]);

  // Helpers tab: fetch only profiles that have skills or open help_offers
  // online status is derived from last_seen (< 15 min = online)
  useEffect(() => {
    if (activeTab !== "helpers") return;

    let mounted = true;
    setHelpersLoading(true);
    setHelpersError("");
    setCountsLoading((current) => ({ ...current, helpers: true }));

    void getExploreHelpers().then(({ data, error }) => {
      if (!mounted) return;

      if (error || !data) {
        setHelpersError(error?.message ?? "Failed to load helpers");
        setLiveHelpers([]);
        setHelpersLoading(false);
        setCountsLoading((current) => ({ ...current, helpers: false }));
        return;
      }

      const mapped = data.profiles.map((profile) =>
        mapProfileToHelperItem(profile, data.skills, data.sessions, data.helpOffers)
      );
      setLiveHelpers(mapped);
      setHelpersLoading(false);
      setCountsLoading((current) => ({ ...current, helpers: false }));
    });

    return () => {
      mounted = false;
    };
  }, [activeTab]);

  // Reset offers pagination when tab changes
  useEffect(() => {
    setOffersPage(0);
  }, [activeTab]);

  // Offers tab: fetch open help_offers only (Flow 2 — helper-initiated)
  // This replaces the old broken fetch that mixed `offers` + `help_offers` together
  useEffect(() => {
    if (activeTab !== "offers") return;

    let mounted = true;
    setOffersLoading(true);
    setOffersError("");
    setCountsLoading((current) => ({ ...current, offers: true }));

    void getOpenHelpOffers({ page: offersPage, pageSize: PAGE_SIZE }).then(({ data, error, count }) => {
      if (!mounted) return;

      if (error) {
        setOffersError(error.message ?? "Failed to load offers");
        setLiveOffers([]);
        setOffersLoading(false);
        setCountsLoading((current) => ({ ...current, offers: false }));
        return;
      }

      // Map raw DB rows to HelpOfferItem for the UI
      const mapped: HelpOfferItem[] = ((data ?? []) as Array<Record<string, unknown>>).map((row) => {
        const helperRaw = row.helper as {
          id?: string | null;
          full_name?: string | null;
          username?: string | null;
          avg_rating?: number | null;
          profile_image_url?: string | null;
        } | null;
        const helper = Array.isArray(helperRaw) ? helperRaw[0] : helperRaw;

        // Extract skill names from the nested help_offer_skills join
        const skillsRaw = row.skills as Array<{ skill?: { name?: string } | null }> | null;
        const skillNames = (skillsRaw ?? [])
          .map((s) => s?.skill?.name)
          .filter(Boolean) as string[];

        const name = helper?.full_name ?? helper?.username ?? "Helper";
        const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

        return {
          id: String(row.id ?? ""),
          helperId: String(row.helper_id ?? ""),
          helperName: name,
          helperInitials: initials,
          helperAvatarBg: "bg-indigo-100",
          helperProfileImageUrl: helper?.profile_image_url ?? undefined,
          helperRating: Number(helper?.avg_rating ?? 0),
          title: String(row.title ?? ""),
          description: String(row.description ?? ""),
          category: String(row.category ?? "General"),
          urgency: (row.urgency as "low" | "medium" | "high" | null) ?? null,
          durationMinutes: row.duration_minutes != null ? Number(row.duration_minutes) : null,
          credits: Number(row.credit_cost ?? 0),
          status: (row.status as "open" | "closed" | "accepted") ?? "open",
          postedAgo: toRelativeAge(row.created_at as string | null),
          createdAt: String(row.created_at ?? ""),
          skillNames,
        };
      });

      setLiveOffers(mapped);
      setOffersTotal(count ?? 0);
      setOffersLoading(false);
      setCountsLoading((current) => ({ ...current, offers: false }));
    });

    return () => {
      mounted = false;
    };
  }, [activeTab, offersPage]);

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

    if (selectedHelperCategories.length > 0) {
      data = data.filter(
        (item) =>
          selectedHelperCategories.some(
            (selectedSkill) =>
              item.categories.includes(selectedSkill) ||
              item.skills.includes(selectedSkill)
          )
      );
    }

    // Online filter now uses last_seen — a helper is online if seen within 15 minutes
    if (onlineOnly) {
      data = data.filter((item) => isOnline(item.lastSeen));
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
  }, [liveHelpers, onlineOnly, rating, search, selectedHelperCategories, sortBy]);

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

  // Offers tab filtering: searches title, helper name, category, description, skills
  // Sorting: Newest (default), Oldest, Highest Tokens
  const filteredOffers: HelpOfferItem[] = useMemo(() => {
    let data = [...liveOffers];

    if (selectedCategory !== "All") {
      data = data.filter((item) => item.category === selectedCategory);
    }

    if (search.trim()) {
      data = data.filter((item) =>
        matchesSearch(
          [item.title, item.category, item.helperName, item.description, ...item.skillNames].join(" "),
          search
        )
      );
    }

    if (sortBy === "Oldest") {
      data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "Highest Tokens") {
      data.sort((a, b) => b.credits - a.credits);
    }
    // Default is Newest — already sorted by created_at desc from the service

    return data;
  }, [liveOffers, search, selectedCategory, sortBy]);

  const requestCategoryOptions = useMemo(
    () =>
      preserveSelectedOption(
        requestCategoryCatalog.length > 1 ? requestCategoryCatalog : ["All", "General"],
        selectedCategory,
        "All"
      ),
    [requestCategoryCatalog, selectedCategory]
  );

  const helperCategoryOptions = useMemo(
    () => {
      const dynamicOptions = buildDynamicOptions(
        liveHelpers.flatMap((item) => [...item.categories, ...item.skills]),
        "General"
      );

      return Array.from(new Set([...HELPER_BASIC_FILTERS, ...dynamicOptions]));
    },
    [liveHelpers]
  );

  const skillCategoryOptions = useMemo(
    () => buildDynamicOptions(liveSkills.map((item) => item.category ?? "Other"), "Other"),
    [liveSkills]
  );

  // Offer categories come from help_offers.category — not from the old mixed mess
  const offerCategoryOptions = useMemo(
    () => buildDynamicOptions(liveOffers.map((item) => item.category), "General"),
    [liveOffers]
  );

  const requestUrgencyOptions = useMemo(() => {
    const priorities: Array<"All" | Urgency> = ["All", "High", "Medium", "Low"];
    const available = new Set<Urgency>(liveOpenRequests.map((item) =>
      item.urgency === "high" ? "High" : item.urgency === "medium" ? "Medium" : "Low"
    ));
    return priorities.filter((item) => item === "All" || available.has(item) || item === urgency);
  }, [liveOpenRequests, urgency]);

  const requestDurationOptions = useMemo(() => {
    const availableDurations = liveOpenRequests.map((item) => item.duration_minutes ?? 0);
    const options = ["Any"];

    if (availableDurations.some((value) => value > 0 && value <= 30)) options.push("<=30 min");
    if (availableDurations.some((value) => value > 30 && value <= 45)) options.push("<=45 min");
    if (availableDurations.some((value) => value > 45 && value <= 60)) options.push("<=60 min");
    if (availableDurations.some((value) => value > 60)) options.push(">60 min");

    return preserveSelectedOption(options, duration, "Any");
  }, [duration, liveOpenRequests]);

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

  // Reset category filter when tab changes and current selection no longer applies
  useEffect(() => {
    if (activeTab === "helpers") {
      setSelectedHelperCategories((current) =>
        current.filter((category) => currentCategories.includes(category))
      );
      return;
    }

    if (!currentCategories.includes(selectedCategory)) {
      setSelectedCategory("All");
    }
  }, [activeTab, currentCategories, selectedCategory]);

  useEffect(() => {
    if (!requestedCategory) {
      return;
    }

    const matchedCategory = currentCategories.find(
      (category) => category.toLowerCase() === requestedCategory.toLowerCase()
    );

    if (matchedCategory) {
      if (activeTab === "helpers") {
        setSelectedHelperCategories([matchedCategory]);
      } else {
        setSelectedCategory(matchedCategory);
      }
    }
  }, [activeTab, currentCategories, requestedCategory]);

  const handleHelperCategoryToggle = (value: string) => {
    setSelectedHelperCategories((current) => {
      if (value === "All") {
        return [];
      }

      if (current.includes(value)) {
        return current.filter((item) => item !== value);
      }

      return [...current, value];
    });
  };

  const resetRequestFilters = () => {
    setSelectedCategory("All");
    setUrgency("All");
    setDuration("Any");
  };

  const resetHelperFilters = () => {
    setSelectedHelperCategories([]);
    setRating("Any rating");
    setOnlineOnly(false);
  };

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
      // Online count now uses last_seen < 15 min instead of a hardcoded boolean
      helpersOnline: filteredHelpers.filter((helper) => isOnline(helper.lastSeen)).length,
      sessionsToday: Math.max(1, Math.round(totalSessions / 20)),
      creditsExchanged: `${Math.max(1, Math.round(totalCredits / 10))}k`,
    };
  }, [filteredHelpers, filteredRequests.length, liveHelpers, liveOpenRequests.length]);

  const defaultHelperId = useMemo(() => {
    return filteredHelpers.find((helper) => isOnline(helper.lastSeen))?.id ?? liveHelpers[0]?.id ?? "h1";
  }, [filteredHelpers, liveHelpers]);

  const titleText =
    activeTab === "requests"
      ? "Browse open help requests from peers"
      : activeTab === "helpers"
        ? "Find experts ready to help you"
        : activeTab === "skills"
          ? "Explore skills available in the community"
          : "Browse offers posted by helpers — request one directly";

  const handleTabChange = (tab: ExploreTab) => {
    setActiveTab(tab);
    setSearch("");
    setSelectedCategory("All");
    setSelectedHelperCategories([]);
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

  const scrollToExploreHeader = () => {
    const scrollTarget = tabsBarRef.current;
    if (!scrollTarget) return;

    const offset = 24;
    const targetTop = scrollTarget.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });
  };

  const handlePaginationChange = (page: number, onPageChange: (page: number) => void) => {
    pendingPaginationScrollRef.current = { page, tab: activeTab };
    scrollToExploreHeader();
    onPageChange(page);
  };

  useEffect(() => {
    const pendingScroll = pendingPaginationScrollRef.current;
    if (!pendingScroll || pendingScroll.tab !== activeTab) return;

    const isCurrentTabLoading =
      (activeTab === "requests" && requestsLoading) ||
      (activeTab === "skills" && skillsLoading) ||
      (activeTab === "offers" && offersLoading);

    if (isCurrentTabLoading) return;

    pendingPaginationScrollRef.current = null;

    window.requestAnimationFrame(scrollToExploreHeader);
    window.setTimeout(scrollToExploreHeader, 120);
  }, [activeTab, offersLoading, requestsLoading, skillsLoading, offersPage, requestsPage, skillsPage]);

  const requestsTotalPages = Math.max(1, Math.ceil(requestsTotal / PAGE_SIZE));
  const skillsTotalPages = Math.max(1, Math.ceil(skillsTotal / PAGE_SIZE));
  const offersTotalPages = Math.max(1, Math.ceil(offersTotal / PAGE_SIZE));

  const renderPagination = (
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void,
    isLoading: boolean
  ) => {
    if (totalPages <= 1) return null;

    return (
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => handlePaginationChange(currentPage - 1, onPageChange)}
          disabled={currentPage === 0 || isLoading}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>
        {buildPagination(currentPage, totalPages).map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${currentPage}-${index}`} className="px-1 text-sm text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => handlePaginationChange(item - 1, onPageChange)}
              disabled={isLoading}
              aria-current={item === currentPage + 1 ? "page" : undefined}
              className={`min-w-10 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                item === currentPage + 1
                  ? "border-indigo-500 bg-indigo-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {item}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => handlePaginationChange(currentPage + 1, onPageChange)}
          disabled={currentPage >= totalPages - 1 || isLoading}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="explore-pulse absolute -left-28 top-24 h-64 w-64 rounded-full bg-indigo-200/25 blur-3xl" />
        <div className="explore-float absolute -right-28 top-40 h-72 w-72 rounded-full bg-sky-200/22 blur-3xl" />
        <div className="explore-pulse absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-purple-200/20 blur-3xl" />
      </div>

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
              countsLoading={countsLoading}
            />

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 text-center lg:text-right">      
                 {titleText}
            </p>
          </div>

          {activeTab === "requests" && !requestsLoading && !requestsError ? (
            <p className="mb-4 text-xs text-slate-500 text-center sm:text-left">Live open requests: {liveOpenRequests.length}</p>
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
                showMoreSkillFilters={showMoreSkillFilters}
                onToggleSkillFilters={() => setShowMoreSkillFilters((current) => !current)}
                categories={currentCategories}
                urgencyOptions={requestUrgencyOptions}
                durationOptions={requestDurationOptions}
                ratingOptions={helperRatingOptions}
                levelOptions={skillLevelOptions}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedHelperCategories={selectedHelperCategories}
                onHelperCategoryToggle={handleHelperCategoryToggle}
                onResetHelperFilters={resetHelperFilters}
                urgency={urgency}
                onUrgencyChange={setUrgency}
                duration={duration}
                onDurationChange={setDuration}
                onResetRequestFilters={resetRequestFilters}
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

          {/* -- Requests -- */}
          {activeTab === "requests" && requestsLoading && requestsPage === 0 ? (
            <Loader className="mt-5 py-16" />
          ) : activeTab === "requests" && requestsError ? (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
              {requestsError}
            </div>
          ) : activeTab === "requests" ? (
            <>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredRequests.map((item, index) => (
                  <div key={item.id} className="explore-fade-in-up h-full" style={getEnterStyle(index)}>
                    <RequestCard item={item} />
                  </div>
                ))}
              </div>
              {renderPagination(requestsPage, requestsTotalPages, setRequestsPage, requestsLoading)}
            </>
          ) : null}

          {/* -- Helpers -- */}
          {activeTab === "helpers" && helpersLoading ? (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-6">
              <Loader inline label="Loading helpers..." />
            </div>
          ) : activeTab === "helpers" && helpersError ? (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
              {helpersError}
            </div>
          ) : activeTab === "helpers" ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredHelpers.map((item, index) => (
                <div key={item.id} className="explore-fade-in-up h-full" style={getEnterStyle(index)}>
                  <HelperCard item={item} onShowMore={setSelectedHelperForModal} />
                </div>
              ))}
            </div>
          ) : null}

          {/* -- Skills -- */}
          {activeTab === "skills" && skillsLoading && skillsPage === 0 ? (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-6">
              <Loader inline label="Loading skills..." />
            </div>
          ) : activeTab === "skills" && skillsError ? (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
              {skillsError}
            </div>
          ) : activeTab === "skills" ? (
            <>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredSkills.map((item, index) => (
                  <div key={item.id} className="explore-fade-in-up h-full" style={getEnterStyle(index)}>
                    <SkillCard item={item} />
                  </div>
                ))}
              </div>
              {renderPagination(skillsPage, skillsTotalPages, setSkillsPage, skillsLoading)}
            </>
          ) : null}

          {/* -- Offers tab (Flow 2) --
               Shows help_offers posted by helpers advertising availability.
               A user browses these and clicks "Book" to submit a help_offer_request.
               This is NOT the `offers` table — those are private responses to requests. */}
          {activeTab === "offers" && offersLoading && offersPage === 0 ? (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-6">
              <Loader inline label="Loading offers..." />
            </div>
          ) : activeTab === "offers" && offersError ? (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
              {offersError}
            </div>
          ) : activeTab === "offers" ? (
            <>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredOffers.map((item, index) => (
                  <article
                    key={item.id}
                    className="explore-fade-in-up flex h-full flex-col rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur"
                    style={getEnterStyle(index)}
                  >
                    {/* Header: category + urgency badge */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                        {item.category}
                      </span>
                      {item.urgency ? (
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.urgency === "high"
                            ? "bg-rose-50 text-rose-600"
                            : item.urgency === "medium"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-emerald-50 text-emerald-600"
                            }`}
                        >
                          {item.urgency.charAt(0).toUpperCase() + item.urgency.slice(1)} urgency
                        </span>
                      ) : null}
                    </div>

                    {/* Title + description */}
                    <h3 className="mt-3 text-base font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{item.description}</p>

                    {/* Skill tags */}
                    {item.skillNames.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.skillNames.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {/* Footer: duration + credits + posted age */}
                    <div className="mt-auto pt-4 flex items-center justify-between gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-3">
                        {item.durationMinutes ? (
                          <span>{item.durationMinutes} min</span>
                        ) : null}
                        <span className="font-semibold text-indigo-600">{item.credits} credits</span>
                      </div>
                      <span>{item.postedAgo}</span>
                    </div>

                    {/* Helper info + Book button */}
                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={item.helperName}
                          imageUrl={item.helperProfileImageUrl}
                          className="h-7 w-7 rounded-full"
                          imageClassName="rounded-full"
                          fallbackClassName="bg-indigo-100 text-xs font-semibold text-indigo-700"
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{item.helperName}</p>
                          {item.helperRating > 0 ? (
                            <p className="text-xs text-slate-500">⭐ {item.helperRating.toFixed(1)}</p>
                          ) : null}
                        </div>
                      </div>
                      {/* Links to the help offer detail page — user can submit a help_offer_request from there */}
                      <Link
                        to={isAuthenticated ? `/offers/${item.id}?source=help_offer` : "/auth?mode=signin"}
                        state={!isAuthenticated ? authRedirectState : undefined}
                        className="rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                      >
                        Book
                      </Link>
                    </div>
                  </article>
                ))}

                {filteredOffers.length === 0 ? (
                  <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
                    <p className="text-sm text-slate-500">No open offers match your filters.</p>
                    <p className="mt-1 text-xs text-slate-400">Try adjusting the category or search.</p>
                  </div>
                ) : null}
              </div>
              {renderPagination(offersPage, offersTotalPages, setOffersPage, offersLoading)}
            </>
          ) : null}
        </section>
      </main>

      {selectedHelperForModal && (
        <HelperDetailsModal
          item={selectedHelperForModal}
          isOpen={!!selectedHelperForModal}
          onClose={() => setSelectedHelperForModal(null)}
        />
      )}
    </div>
  );
}
