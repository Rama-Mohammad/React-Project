import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect } from "react";
import ThemedSelect from "../common/ThemedSelect";
import type { ExploreTab } from "../../types/explore";
import type { SearchBarProps } from "../../types/explore";

const sortOptionsMap: Record<ExploreTab, string[]> = {
  requests: ["Newest", "Most Offers", "Lowest Tokens", "Highest Tokens"],
  helpers: ["Top Rated", "Fastest Response", "Most Sessions"],
  skills: ["Most Helpers", "Top Rated", "Most Sessions"],
  offers: ["Newest", "Oldest", "Highest Tokens"],
};

const placeholderMap: Record<ExploreTab, string> = {
  requests: "Search by title, skill, or keyword...",
  helpers: "Search by name, skill, or expertise...",
  skills: "Search skills by name or description...",
  offers: "Search by request title, helper, or message...",
};

export default function SearchBar({
  activeTab,
  search,
  onSearchChange,
  sortBy,
  onSortChange,
}: SearchBarProps) {
  const options = sortOptionsMap[activeTab] ?? [];
  const selectedSort = options.includes(sortBy) ? sortBy : options[0] ?? "Sort";

  useEffect(() => {
    if (!options.includes(sortBy) && options.length > 0) {
      onSortChange(options[0]);
    }
  }, [activeTab, onSortChange, options, sortBy]);

  return (
    <div className="explore-fade-in-up relative z-40 flex flex-col gap-3 lg:flex-row">
      <div className="relative flex-1">
        <Search
          size={18}
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400/90 transition-colors duration-300"
        />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholderMap[activeTab]}
          className="h-12 w-full rounded-[18px] border border-[#dfe6f5] bg-white/88 pl-12 pr-4 text-sm font-medium text-slate-900 shadow-[0_14px_32px_-30px_rgba(15,23,42,0.42)] outline-none transition duration-300 placeholder:text-slate-400/90 hover:border-indigo-100 focus:border-indigo-200 focus:bg-white focus:ring-4 focus:ring-indigo-100/70"
        />
      </div>

      <ThemedSelect
        value={selectedSort}
        onChange={onSortChange}
        options={options.map((option) => ({ value: option, label: option }))}
        ariaLabel="Explore sort"
        icon={<SlidersHorizontal size={14} />}
        size="sm"
        className="min-w-[210px]"
      />
    </div>
  );
}


