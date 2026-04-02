import type { ExploreTab } from "../../types/explore";

interface FilterSideBarProps {
  activeTab: ExploreTab;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;

  urgency: string;
  onUrgencyChange: (value: string) => void;

  duration: string;
  onDurationChange: (value: string) => void;

  rating: string;
  onRatingChange: (value: string) => void;

  onlineOnly: boolean;
  onOnlineOnlyChange: (value: boolean) => void;

  level: string;
  onLevelChange: (value: string) => void;

  totalCount: number;
}

function ChipButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-slate-200 bg-white text-slate-900 shadow-sm ring-1 ring-white/70"
          : "border-white/40 bg-white/60 text-slate-500 hover:-translate-y-0.5 hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}

export default function FilterSideBar({
  activeTab,
  categories,
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
  return (
    <div className="explore-glass explore-fade-in-up rounded-[1.25rem] border border-white/50 bg-white/70 p-4 backdrop-blur-xl">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <ChipButton
              key={item}
              active={selectedCategory === item}
              onClick={() => onCategoryChange(item)}
            >
              {item}
            </ChipButton>
          ))}
        </div>

        {activeTab === "requests" && (
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {["All", "High", "Medium", "Low"].map((item) => (
                <ChipButton
                  key={item}
                  active={urgency === item}
                  onClick={() => onUrgencyChange(item)}
                >
                  {item}
                </ChipButton>
              ))}

              {["Any", "<=30 min", "<=45 min", "<=60 min"].map((item) => (
                <ChipButton
                  key={item}
                  active={duration === item}
                  onClick={() => onDurationChange(item)}
                >
                  {item}
                </ChipButton>
              ))}
            </div>

            <p className="text-sm text-slate-500">
              <span className="font-semibold text-indigo-500">{totalCount}</span> requests
            </p>
          </div>
        )}

        {activeTab === "helpers" && (
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {["Any rating", "4.0+", "4.5+", "4.8+"].map((item) => (
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

            <p className="text-sm text-slate-500">
              <span className="font-semibold text-indigo-500">{totalCount}</span> helpers
            </p>
          </div>
        )}

        {activeTab === "skills" && (
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {["All", "Beginner", "Intermediate", "Advanced"].map((item) => (
                <ChipButton
                  key={item}
                  active={level === item}
                  onClick={() => onLevelChange(item)}
                >
                  {item}
                </ChipButton>
              ))}
            </div>

            <p className="text-sm text-slate-500">
              <span className="font-semibold text-indigo-500">{totalCount}</span> skills
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
