import { useEffect, useState, type ReactNode } from "react";
import {
  Camera,
  Code2,
  Flame,
  Gauge,
  Globe2,
  Leaf,
  Palette,
  Sparkles,
  Tag,
} from "lucide-react";
import type { FilterSideBarProps } from "../../types/explore";

const HELPER_BASIC_FILTERS = [
  "All",
  "Programming",
  "Design",
  "Writing",
  "Web Development",
  "Machine Learning",
];

function ChipButton({
  active,
  children,
  icon,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  icon?: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold transition duration-300 ${active
          ? "border-indigo-100 bg-white text-slate-900 shadow-[0_14px_30px_-26px_rgba(79,70,229,0.45)]"
          : "border-[#e7ebf5] bg-white/55 text-slate-500 hover:border-indigo-100 hover:bg-white/90 hover:text-slate-700"
        }`}
    >
      {icon}
      {children}
    </button>
  );
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
  if (normalized.includes("low")) return <Leaf size={14} />;
  return undefined;
}

export default function FilterSideBar({
  activeTab,
  showMoreSkillFilters = false,
  onToggleSkillFilters,
  categories,
  urgencyOptions,
  durationOptions,
  ratingOptions,
  levelOptions,
  selectedCategory,
  onCategoryChange,
  urgency,
  onUrgencyChange,
  duration,
  onDurationChange,
  onResetRequestFilters,
  rating,
  onRatingChange,
  level,
  onLevelChange,
  selectedHelperCategories = [],
  onHelperCategoryToggle,
  onResetHelperFilters,
  totalCount,
}: FilterSideBarProps) {
  const [showAllHelperFilters, setShowAllHelperFilters] = useState(false);

  useEffect(() => {
    if (activeTab !== "helpers") {
      setShowAllHelperFilters(false);
    }
  }, [activeTab]);

  const helperBasicCategories = HELPER_BASIC_FILTERS;
  const helperDynamicCategories = categories.filter(
    (item) => !HELPER_BASIC_FILTERS.includes(item)
  );
  const visibleCategories =
    activeTab === "helpers"
      ? showAllHelperFilters
        ? [...helperBasicCategories, ...helperDynamicCategories]
        : Array.from(
            new Set(
              selectedHelperCategories.filter((item) => !helperBasicCategories.includes(item)).length > 0
                ? [
                    ...helperBasicCategories,
                    ...selectedHelperCategories.filter((item) => !helperBasicCategories.includes(item)),
                  ]
                : helperBasicCategories
            )
          )
      : categories;
  const hasHiddenHelperCategories =
    activeTab === "helpers" && helperDynamicCategories.length > 0;

  const hasActiveRequestFilters =
    selectedCategory !== "All" || urgency !== "All" || duration !== "Any";
  const hasActiveHelperFilters =
    selectedHelperCategories.length > 0 || rating !== "Any rating";

  return (
    <div className="explore-fade-in-up rounded-[24px] border border-white/75 bg-white/58 p-3 shadow-[0_16px_42px_-38px_rgba(79,70,229,0.35)] backdrop-blur-xl sm:p-4">
      <div className="flex flex-col gap-3">
        {activeTab === "requests" && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
              {categories.map((item) => (
                <ChipButton
                  key={item}
                  active={selectedCategory === item}
                  icon={getCategoryIcon(item)}
                  onClick={() => onCategoryChange(item)}
                >
                  {item}
                </ChipButton>
              ))}
            </div>

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                {urgencyOptions.map((item) => (
                  <ChipButton
                    key={item}
                    active={urgency === item}
                    icon={getUrgencyIcon(item)}
                    onClick={() => onUrgencyChange(item)}
                  >
                    {item}
                  </ChipButton>
                ))}

                {durationOptions.map((item) => (
                  <ChipButton
                    key={item}
                    active={duration === item}
                    onClick={() => onDurationChange(item)}
                  >
                    {item}
                  </ChipButton>
                ))}

                <button
                  type="button"
                  onClick={() => onResetRequestFilters?.()}
                  disabled={!hasActiveRequestFilters}
                  className="rounded-full border border-[#dfe6f5] bg-white/80 px-4 py-1.5 text-xs font-semibold text-slate-600 transition duration-300 hover:border-indigo-100 hover:bg-white disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-400"
                >
                  Clear Filters
                </button>
              </div>

              <p className="text-xs text-slate-500 text-center sm:text-left">
                <span className="font-semibold text-indigo-500">{totalCount}</span> requests
              </p>
            </div>
          </div>
        )}

        {activeTab === "helpers" && (
          <>
            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
              {visibleCategories.map((item) => (
                <ChipButton
                  key={item}
                  active={
                    item === "All"
                      ? selectedHelperCategories.length === 0
                      : selectedHelperCategories.includes(item)
                  }
                  icon={getCategoryIcon(item)}
                  onClick={() => onHelperCategoryToggle?.(item)}
                >
                  {item}
                </ChipButton>
              ))}

              {hasHiddenHelperCategories ? (
                <button
                  type="button"
                  onClick={() => setShowAllHelperFilters((current) => !current)}
                  className="rounded-full border border-indigo-100 bg-indigo-50/80 px-4 py-1.5 text-xs font-semibold text-indigo-600 transition duration-300 hover:border-indigo-200 hover:bg-indigo-50"
                >
                  {showAllHelperFilters ? "View Less" : "View More"}
                </button>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                {ratingOptions.map((item) => (
                  <ChipButton
                    key={item}
                    active={rating === item}
                    onClick={() => onRatingChange(item)}
                  >
                    {item}
                  </ChipButton>
                ))}

                <button
                  type="button"
                  onClick={() => onResetHelperFilters?.()}
                  disabled={!hasActiveHelperFilters}
                  className="rounded-full border border-[#dfe6f5] bg-white/80 px-4 py-1.5 text-xs font-semibold text-slate-600 transition duration-300 hover:border-indigo-100 hover:bg-white disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-400"
                >
                  Clear Filters
                </button>
              </div>

              <p className="text-xs text-slate-500 text-center sm:text-left">
                <span className="font-semibold text-indigo-500">{totalCount}</span> helpers
              </p>
            </div>
          </>
        )}

        {activeTab === "skills" && (
          <>
            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
              {categories.map((item) => (
                <ChipButton
                  key={item}
                  active={selectedCategory === item}
                  icon={getCategoryIcon(item)}
                  onClick={() => onCategoryChange(item)}
                >
                  {item}
                </ChipButton>
              ))}
            </div>

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-col gap-3">
                {showMoreSkillFilters ? (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                    {levelOptions.map((item) => (
                      <ChipButton
                        key={item}
                        active={level === item}
                        onClick={() => onLevelChange(item)}
                      >
                        {item}
                      </ChipButton>
                    ))}
                  </div>
                ) : null}

                <div>
                  <button
                    type="button"
                    onClick={() => onToggleSkillFilters?.()}
                    className="rounded-full border border-[#dfe6f5] bg-white/80 px-4 py-1.5 text-xs font-semibold text-slate-600 transition duration-300 hover:border-indigo-100 hover:bg-white"
                  >
                    {showMoreSkillFilters ? "Hide Filters" : "View Filters"}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                <span className="font-semibold text-indigo-500">{totalCount}</span> skills
              </p>
            </div>
          </>
        )}

        {activeTab === "offers" && (
          <>
            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
              {categories.map((item) => (
                <ChipButton
                  key={item}
                  active={selectedCategory === item}
                  icon={getCategoryIcon(item)}
                  onClick={() => onCategoryChange(item)}
                >
                  {item}
                </ChipButton>
              ))}
            </div>

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <p className="text-xs text-slate-500">
                Browse all submitted offers from helpers across the platform.
              </p>
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-indigo-500">{totalCount}</span> offers
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
