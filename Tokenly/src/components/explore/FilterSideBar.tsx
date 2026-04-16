import { useEffect, useState, type ReactNode } from "react";
import type { FilterSideBarProps } from "../../types/explore";

const INITIAL_VISIBLE_HELPER_FILTERS = 10;

function ChipButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? "border-slate-200 bg-white text-slate-900 shadow-sm"
          : "border-white/40 bg-white/65 text-slate-600 hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
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
  rating,
  onRatingChange,
  onlineOnly,
  onOnlineOnlyChange,
  level,
  onLevelChange,
  totalCount,
}: FilterSideBarProps) {
  const [showAllHelperFilters, setShowAllHelperFilters] = useState(false);

  useEffect(() => {
    if (activeTab !== "helpers") {
      setShowAllHelperFilters(false);
    }
  }, [activeTab]);

  const visibleCategories =
    activeTab === "helpers" && !showAllHelperFilters
      ? categories.slice(0, INITIAL_VISIBLE_HELPER_FILTERS)
      : categories;
  const hasHiddenHelperCategories =
    activeTab === "helpers" && categories.length > INITIAL_VISIBLE_HELPER_FILTERS;

  return (
    <div className="explore-glass explore-fade-in-up rounded-[1.25rem] border border-white/50 bg-white/75 p-4 backdrop-blur-xl">
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-wrap gap-1.5">
          {visibleCategories.map((item) => (
            <ChipButton
              key={item}
              active={selectedCategory === item}
              onClick={() => onCategoryChange(item)}
            >
              {item}
            </ChipButton>
          ))}

          {hasHiddenHelperCategories ? (
            <button
              type="button"
              onClick={() => setShowAllHelperFilters((current) => !current)}
              className="rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
            >
              {showAllHelperFilters ? "View Less" : "View More"}
            </button>
          ) : null}
        </div>

        {activeTab === "requests" && (
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {urgencyOptions.map((item) => (
                <ChipButton
                  key={item}
                  active={urgency === item}
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
            </div>

            <p className="text-xs text-slate-500">
              <span className="font-semibold text-indigo-500">{totalCount}</span> requests
            </p>
          </div>
        )}

        {activeTab === "helpers" && (
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {ratingOptions.map((item) => (
                <ChipButton
                  key={item}
                  active={rating === item}
                  onClick={() => onRatingChange(item)}
                >
                  {item}
                </ChipButton>
              ))}

              <ChipButton
                active={onlineOnly}
                onClick={() => onOnlineOnlyChange(!onlineOnly)}
              >
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-400" />
                  Online now
                </span>
              </ChipButton>
            </div>

            <p className="text-xs text-slate-500">
              <span className="font-semibold text-indigo-500">{totalCount}</span> helpers
            </p>
          </div>
        )}

        {activeTab === "skills" && (
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3">
              {showMoreSkillFilters ? (
                <div className="flex flex-wrap gap-1.5">
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
                  className="rounded-full border border-white/40 bg-white/65 px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-white"
                >
                  {showMoreSkillFilters ? "Hide Filters" : "View Filters"}
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              <span className="font-semibold text-indigo-500">{totalCount}</span> skills
            </p>
          </div>
        )}

        {activeTab === "offers" && (
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <p className="text-xs text-slate-500">
              Browse all submitted offers from helpers across the platform.
            </p>
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-indigo-500">{totalCount}</span> offers
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
