import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const FeatureCard = ({
  title,
  description,
  icon,
  category,
  bgImage,
}: {
  title: string;
  description: string;
  icon: IconDefinition;
  category: string;
  bgImage: string;
}) => {
  const categoryColors = {
    "Core System": { text: "text-purple-600", bg: "bg-purple-50" },
    "Built-in Tools": { text: "text-sky-600", bg: "bg-sky-50" },
    Safety: { text: "text-emerald-600", bg: "bg-emerald-50" },
    Community: { text: "text-amber-600", bg: "bg-amber-50" },
    Knowledge: { text: "text-rose-600", bg: "bg-rose-50" },
    Analytics: { text: "text-indigo-600", bg: "bg-indigo-50" },
  };

  const categoryStyle = (categoryColors as Record<string, { text: string; bg: string }>)[
    category
  ] || { text: "text-indigo-600", bg: "bg-indigo-50" };

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/50 bg-white/80 shadow-sm backdrop-blur transition hover:shadow-md">
      <div className="h-48 overflow-hidden">
        <img
          src={bgImage}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-6">
        <div className="mb-3 inline-block">
          <span
            className={`${categoryStyle.bg} ${categoryStyle.text} rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider`}
          >
            {category}
          </span>
        </div>

        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 via-sky-100 to-purple-100 text-indigo-500">
            <FontAwesomeIcon icon={icon} className="text-sm" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
