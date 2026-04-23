import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Camera, Code2, Coins, Flame, Gauge, Globe2, Leaf, Palette, Sparkles, Tag } from "lucide-react";
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
} from "../utils/exploreMappers";
import type { ExploreTab, RequestItem, HelperItem, SkillItem, HelpOfferItem, Urgency, SkillLevel, SkillWithRelations } from "../types/explore";
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

function getCategoryIcon(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("design")) return <Palette size={14} />;
  if (normalized.includes("programming") || normalized.includes("web") || normalized.includes("code")) return <Code2 size={14} />;
  if (normalized.includes("photo")) return <Camera size={14} />;
  if (normalized.includes("language")) return <Globe2 size={14} />;
  if (normalized.includes("all")) return <Sparkles size={14} />;
  return <Tag size={14} />;
}

function getUrgencyIcon(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("high")) return <Flame size={14} />;
  if (normalized.includes("medium")) return <Gauge size={14} />;
  return <Leaf size={14} />;
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
  const [helpersPage, setHelpersPage] = useState(0);
  const [skillsPage, setSkillsPage] = useState(0);
  const [offersPage, setOffersPage] = useState(0);

  const [requestCategoryCatalog, setRequestCategoryCatalog] = useState<string[]>(["All"]);

  const requestedCategory = useMemo(() => {
    return new URLSearchParams(location.search).get("category")?.trim() ?? "";
  }, [location.search]);

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

  useEffect(() => {
    if (location.hash !== "#explore-tabs-bar") return;
    if (!tabsBarRef.current) return;

    const id = window.setTimeout(() => {
      tabsBarRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);

    return () => window.clearTimeout(id);
  }, [location.hash]);

  useEffect(() => {
    setRequestsPage(0);
  }, [activeTab, duration, search, selectedCategory, sortBy, urgency]);

  useEffect(() => {
    setHelpersPage(0);
  }, [activeTab, rating, search, selectedHelperCategories, sortBy]);

  useEffect(() => {
    if (activeTab !== "requests") return;

    let mounted = true;

    setCountsLoading((current) => ({ ...current, requests: true }));

    void fetchOpenRequests().then(() => {
      if (!mounted) return;
      setCountsLoading((current) => ({ ...current, requests: false }));
    });

    return () => {
      mounted = false;
    };
  }, [activeTab]);

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

  useEffect(() => {
    setSkillsPage(0);
  }, [activeTab, level, search, selectedCategory, sortBy]);

  useEffect(() => {
    if (activeTab !== "skills") return;

    let mounted = true;
    setSkillsLoading(true);
    setSkillsError("");
    setCountsLoading((current) => ({ ...current, skills: true }));

    void getAllSkills().then(({ data, error }) => {
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
      setSkillsLoading(false);
      setCountsLoading((current) => ({ ...current, skills: false }));
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

  useEffect(() => {
    setOffersPage(0);
  }, [activeTab, search, selectedCategory, sortBy]);

  useEffect(() => {
    if (activeTab !== "offers") return;

    let mounted = true;
    setOffersLoading(true);
    setOffersError("");
    setCountsLoading((current) => ({ ...current, offers: true }));

    void getOpenHelpOffers().then(({ data, error }) => {
      if (!mounted) return;

      if (error) {
        setOffersError(error.message ?? "Failed to load offers");
        setLiveOffers([]);
        setOffersLoading(false);
        setCountsLoading((current) => ({ ...current, offers: false }));
        return;
      }

      const mapped: HelpOfferItem[] = ((data ?? []) as Array<Record<string, unknown>>).map((row) => {
        const helperRaw = row.helper as {
          id?: string | null;
          full_name?: string | null;
          username?: string | null;
          avg_rating?: number | null;
          profile_image_url?: string | null;
        } | null;
        const helper = Array.isArray(helperRaw) ? helperRaw[0] : helperRaw;

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
      setOffersLoading(false);
      setCountsLoading((current) => ({ ...current, offers: false }));
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

  const requestsTotalPages = Math.max(1, Math.ceil(filteredRequests.length / PAGE_SIZE));
  const safeRequestsPage = Math.min(requestsPage, Math.max(0, requestsTotalPages - 1));
  const paginatedRequests = useMemo(
    () =>
      filteredRequests.slice(
        safeRequestsPage * PAGE_SIZE,
        (safeRequestsPage + 1) * PAGE_SIZE
      ),
    [filteredRequests, safeRequestsPage, PAGE_SIZE]
  );

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
  }, [liveHelpers, rating, search, selectedHelperCategories, sortBy]);

  const helpersTotalPages = Math.max(1, Math.ceil(filteredHelpers.length / PAGE_SIZE));
  const safeHelpersPage = Math.min(helpersPage, Math.max(0, helpersTotalPages - 1));
  const paginatedHelpers = useMemo(
    () =>
      filteredHelpers.slice(
        safeHelpersPage * PAGE_SIZE,
        (safeHelpersPage + 1) * PAGE_SIZE
      ),
    [filteredHelpers, safeHelpersPage]
  );

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

  const skillsTotalPages = Math.max(1, Math.ceil(filteredSkills.length / PAGE_SIZE));
  const safeSkillsPage = Math.min(skillsPage, Math.max(0, skillsTotalPages - 1));
  const paginatedSkills = useMemo(
    () =>
      filteredSkills.slice(
        safeSkillsPage * PAGE_SIZE,
        (safeSkillsPage + 1) * PAGE_SIZE
      ),
    [filteredSkills, safeSkillsPage]
  );

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

    return data;
  }, [liveOffers, search, selectedCategory, sortBy]);

  const offersTotalPages = Math.max(1, Math.ceil(filteredOffers.length / PAGE_SIZE));
  const safeOffersPage = Math.min(offersPage, Math.max(0, offersTotalPages - 1));
  const paginatedOffers = useMemo(
    () =>
      filteredOffers.slice(
        safeOffersPage * PAGE_SIZE,
        (safeOffersPage + 1) * PAGE_SIZE
      ),
    [filteredOffers, safeOffersPage]
  );

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
      helpersOnline: filteredOffers.length,
      sessionsToday: Math.max(1, Math.round(totalSessions / 20)),
      creditsExchanged: `${Math.max(1, Math.round(totalCredits / 10))}k`,
    };
  }, [filteredOffers.length, filteredRequests.length, liveHelpers, liveOpenRequests.length]);

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
      (activeTab === "helpers" && helpersLoading) ||
      (activeTab === "skills" && skillsLoading) ||
      (activeTab === "offers" && offersLoading);

    if (isCurrentTabLoading) return;

    pendingPaginationScrollRef.current = null;

    window.requestAnimationFrame(scrollToExploreHeader);
    window.setTimeout(scrollToExploreHeader, 120);
  }, [activeTab, helpersLoading, offersLoading, requestsLoading, skillsLoading, helpersPage, offersPage, requestsPage, skillsPage]);

  useEffect(() => {
    if (requestsPage !== safeRequestsPage) {
      setRequestsPage(safeRequestsPage);
    }
  }, [requestsPage, safeRequestsPage]);

  useEffect(() => {
    if (helpersPage !== safeHelpersPage) {
      setHelpersPage(safeHelpersPage);
    }
  }, [helpersPage, safeHelpersPage]);

  useEffect(() => {
    if (skillsPage !== safeSkillsPage) {
      setSkillsPage(safeSkillsPage);
    }
  }, [skillsPage, safeSkillsPage]);

  useEffect(() => {
    if (offersPage !== safeOffersPage) {
      setOffersPage(safeOffersPage);
    }
  }, [offersPage, safeOffersPage]);

  const renderPagination = (
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void,
    isLoading: boolean
  ) => {
    if (totalPages <= 1) return null;

    return (
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => handlePaginationChange(currentPage - 1, onPageChange)}
          disabled={currentPage === 0 || isLoading}
          className="rounded-2xl border border-[#dbe3f3] bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
              className={`min-w-11 rounded-2xl border px-3.5 py-2.5 text-sm font-medium transition ${
                item === currentPage + 1
                  ? "border-indigo-500 bg-indigo-600 text-white shadow-[0_18px_34px_-24px_rgba(79,70,229,0.7)]"
                  : "border-[#dbe3f3] bg-white text-slate-700 hover:bg-slate-50"
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
          className="rounded-2xl border border-[#dbe3f3] bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-[linear-gradient(180deg,#eef3ff_0%,#f6f8ff_48%,#faf7ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="explore-pulse absolute -left-20 top-24 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="explore-float absolute -right-24 top-28 h-80 w-80 rounded-full bg-sky-200/24 blur-3xl" />
        <div className="explore-pulse absolute bottom-24 left-1/3 h-64 w-64 rounded-full bg-violet-200/18 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto w-[90vw] max-w-[1600px] px-2 py-6 sm:px-3 lg:px-4 lg:py-7">
        <section className="xl:flex xl:flex-col xl:gap-0">
          <StatsHero
            stats={dynamicStats}
            defaultHelperId={defaultHelperId}
            openHowItWorks={shouldOpenHowItWorks}
          />

          <div
            id="explore-tabs-bar"
            ref={tabsBarRef}
            className="explore-fade-in-up mt-4 flex justify-center"
          >
            <CategoryTabs
              activeTab={activeTab}
              onChange={handleTabChange}
              counts={tabCounts}
              countsLoading={countsLoading}
            />
          </div>
        </section>

        <section className="mt-3">
          <div className="explore-fade-in-up rounded-[28px] border border-white/75 bg-white/45 p-3 shadow-[0_20px_60px_-52px_rgba(79,70,229,0.32)] backdrop-blur-xl sm:p-4">
            <SearchBar
              activeTab={activeTab}
              search={search}
              onSearchChange={setSearch}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            <div className="mt-3">
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

          {activeTab === "requests" && requestsLoading && requestsPage === 0 ? (
            <Loader className="mt-5 py-16" />
          ) : activeTab === "requests" && requestsError ? (
            <div className="mt-5 rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
              {requestsError}
            </div>
          ) : activeTab === "requests" ? (
            <>
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {paginatedRequests.length === 0 ? (
                  <div className="col-span-full rounded-[28px] border border-dashed border-[#dbe3f3] bg-white/70 p-10 text-center">
                    <p className="text-sm text-slate-500">
                      {search.trim() ? "No results found" : "No requests match your filters."}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {search.trim()
                        ? "Try a different keyword or clear some filters."
                        : "Try adjusting the category, urgency, or duration."}
                    </p>
                  </div>
                ) : (
                  paginatedRequests.map((item, index) => (
                    <div key={item.id} className="explore-fade-in-up h-full" style={getEnterStyle(index)}>
                      <RequestCard item={item} />
                    </div>
                  ))
                )}
              </div>
              {renderPagination(requestsPage, requestsTotalPages, setRequestsPage, requestsLoading)}
            </>
          ) : null}

          {activeTab === "helpers" && helpersLoading ? (
            <div className="mt-5 rounded-[28px] border border-[#dbe3f3] bg-white p-6">
              <Loader inline label="Loading helpers..." />
            </div>
          ) : activeTab === "helpers" && helpersError ? (
            <div className="mt-5 rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
              {helpersError}
            </div>
          ) : activeTab === "helpers" ? (
            <>
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {paginatedHelpers.length === 0 ? (
                  <div className="col-span-full rounded-[28px] border border-dashed border-[#dbe3f3] bg-white/70 p-10 text-center">
                    <p className="text-sm text-slate-500">
                      {search.trim() ? "No results found" : "No helpers match your filters."}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {search.trim()
                        ? "Try a different keyword or clear some filters."
                        : "Try adjusting the category or rating."}
                    </p>
                  </div>
                ) : (
                  paginatedHelpers.map((item, index) => (
                    <div key={item.id} className="explore-fade-in-up h-full" style={getEnterStyle(index)}>
                      <HelperCard item={item} onShowMore={setSelectedHelperForModal} />
                    </div>
                  ))
                )}
              </div>
              {renderPagination(helpersPage, helpersTotalPages, setHelpersPage, helpersLoading)}
            </>
          ) : null}

          {activeTab === "skills" && skillsLoading && skillsPage === 0 ? (
            <div className="mt-5 rounded-[28px] border border-[#dbe3f3] bg-white p-6">
              <Loader inline label="Loading skills..." />
            </div>
          ) : activeTab === "skills" && skillsError ? (
            <div className="mt-5 rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
              {skillsError}
            </div>
          ) : activeTab === "skills" ? (
            <>
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {paginatedSkills.length === 0 ? (
                  <div className="col-span-full rounded-[28px] border border-dashed border-[#dbe3f3] bg-white/70 p-10 text-center">
                    <p className="text-sm text-slate-500">
                      {search.trim() ? "No results found" : "No skills match your filters."}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {search.trim()
                        ? "Try a different keyword or clear some filters."
                        : "Try adjusting the category or level."}
                    </p>
                  </div>
                ) : (
                  paginatedSkills.map((item, index) => (
                    <div key={item.id} className="explore-fade-in-up h-full" style={getEnterStyle(index)}>
                      <SkillCard item={item} />
                    </div>
                  ))
                )}
              </div>
              {renderPagination(skillsPage, skillsTotalPages, setSkillsPage, skillsLoading)}
            </>
          ) : null}
          {activeTab === "offers" && offersLoading && offersPage === 0 ? (
            <div className="mt-5 rounded-[28px] border border-[#dbe3f3] bg-white p-6">
              <Loader inline label="Loading offers..." />
            </div>
          ) : activeTab === "offers" && offersError ? (
            <div className="mt-5 rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
              {offersError}
            </div>
          ) : activeTab === "offers" ? (
            <>
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {paginatedOffers.map((item, index) => (
                  <article
                    key={item.id}
                    className="explore-soft-card explore-fade-in-up flex h-full flex-col rounded-[28px] border border-[#dfe6f5] bg-white/94 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-indigo-100"
                    style={getEnterStyle(index)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50/85 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                        {getCategoryIcon(item.category)}
                        {item.category}
                      </span>
                      {item.urgency ? (
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${item.urgency === "high"
                            ? "bg-rose-50 text-rose-600"
                            : item.urgency === "medium"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-emerald-50 text-emerald-600"
                            }`}
                        >
                          {getUrgencyIcon(item.urgency)}
                          {item.urgency.charAt(0).toUpperCase() + item.urgency.slice(1)} urgency
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mt-3 text-base font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{item.description}</p>

                    {item.skillNames.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.skillNames.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/82 px-2 py-0.5 text-xs text-slate-500"
                          >
                            {getCategoryIcon(skill)}
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-auto pt-4 flex items-center justify-between gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-3">
                        {item.durationMinutes ? (
                          <span>{item.durationMinutes} min</span>
                        ) : null}
                        <span className="inline-flex items-center gap-1 font-semibold text-indigo-600">
                          <Coins size={14} />
                          {item.credits} credits
                        </span>
                      </div>
                      <span>{item.postedAgo}</span>
                    </div>

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
                            <p className="text-xs text-slate-500">{"\u2B50"} {item.helperRating.toFixed(1)}</p>
                          ) : null}
                        </div>
                      </div>
                      <Link
                        to={isAuthenticated ? `/offers/${item.id}?source=help_offer` : "/auth?mode=signin"}
                        state={!isAuthenticated ? authRedirectState : undefined}
                        className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_14px_28px_-22px_rgba(79,70,229,0.7)] transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-700"
                      >
                        Book
                      </Link>
                    </div>
                  </article>
                ))}

                {paginatedOffers.length === 0 ? (
                  <div className="col-span-full rounded-[28px] border border-dashed border-[#dbe3f3] bg-white/70 p-10 text-center">
                    <p className="text-sm text-slate-500">
                      {search.trim() ? "No results found" : "No open offers match your filters."}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {search.trim()
                        ? "Try a different keyword or clear some filters."
                        : "Try adjusting the category or search."}
                    </p>
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


