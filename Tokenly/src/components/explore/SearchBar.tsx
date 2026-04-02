import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import type { ExploreTab } from "../../types/explore";

interface SearchBarProps {
  activeTab: ExploreTab;
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

const sortOptionsMap: Record<ExploreTab, string[]> = {
  requests: ["Newest", "Most Offers", "Lowest Credits", "Highest Credits"],
  helpers: ["Top Rated", "Fastest Response", "Most Sessions"],
  skills: ["Most Helpers", "Top Rated", "Most Sessions"],
};

const placeholderMap: Record<ExploreTab, string> = {
  requests: "Search by title, skill, or keyword...",
  helpers: "Search by name, skill, or expertise...",
  skills: "Search skills by name or description...",
};

export default function SearchBar({
  activeTab,
  search,
  onSearchChange,
  sortBy,
  onSortChange,
}: SearchBarProps) {
  const options = sortOptionsMap[activeTab];

  return (
    <div className="explore-fade-in-up flex flex-col gap-3 lg:flex-row">
      <div className="relative flex-1">
        <Search
          size={17}
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-300"
        />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholderMap[activeTab]}
          className="h-11 w-full rounded-xl border border-white/50 bg-white/80 pl-12 pr-4 text-sm text-slate-900 backdrop-blur outline-none transition duration-300 placeholder:text-slate-400 focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 focus:shadow-[0_0_0_3px_rgba(165,180,252,0.18)]"
        />
      </div>

      <div className="relative min-w-[180px]">
        <SlidersHorizontal
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-white/50 bg-white/80 pl-10 pr-10 text-sm font-medium text-slate-700 backdrop-blur outline-none transition duration-300 focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 focus:shadow-[0_0_0_3px_rgba(165,180,252,0.18)]"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
