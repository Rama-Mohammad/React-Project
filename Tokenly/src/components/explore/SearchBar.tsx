import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ExploreTab } from "../../types/explore";
import type { SearchBarProps } from "../../types/explore";

const sortOptionsMap: Record<ExploreTab, string[]> = {
  requests: ["Newest", "Most Offers", "Lowest Credits", "Highest Credits"],
  helpers: ["Top Rated", "Fastest Response", "Most Sessions"],
  skills: ["Most Helpers", "Top Rated", "Most Sessions"],
  offers: ["Newest", "Oldest", "Highest Credits"],
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
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const selectedSort = options.includes(sortBy) ? sortBy : options[0] ?? "Sort";

  useEffect(() => {
    if (!options.includes(sortBy) && options.length > 0) {
      onSortChange(options[0]);
    }
  }, [activeTab, onSortChange, options, sortBy]);

  useEffect(() => {
    setOpen(false);
  }, [activeTab]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <div className="explore-fade-in-up relative z-40 flex flex-col gap-2.5 lg:flex-row">
      <div className="relative flex-1">
        <Search
          size={17}
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-300"
        />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholderMap[activeTab]}
          className="h-10 w-full rounded-xl border border-white/55 bg-white/85 pl-12 pr-4 text-sm text-slate-900 backdrop-blur outline-none transition duration-200 placeholder:text-slate-400 focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div
        ref={dropdownRef}
        className={`relative min-w-[190px] ${open ? "z-[90]" : "z-20"}`}
      >
        <SlidersHorizontal
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <ChevronDown
          size={16}
          className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-left text-sm font-medium text-slate-700 shadow-sm outline-none transition duration-200 hover:bg-slate-50 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        >
          {selectedSort}
        </button>

        {open && (
          <div className="absolute left-0 top-[calc(100%+0.35rem)] z-[100] w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_12px_30px_-16px_rgba(15,23,42,0.45)]">
            {options.map((option) => {
              const active = option === sortBy;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onSortChange(option);
                    setOpen(false);
                  }}
                  className={`block w-full px-3 py-2 text-left text-sm font-medium transition ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {option}
                </button>
              );
            })}
            {options.length === 0 && (
              <div className="px-2.5 py-2 text-sm text-slate-500">No options available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

