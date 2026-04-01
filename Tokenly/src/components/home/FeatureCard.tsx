import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

// added this so everything would have a type and not throw errors. i added it her since it is only used in the home page and not anywhere else
const FeatureCard = ({ title, description, icon, category, bgImage }: {
  title: string;
  description: string;
  icon: IconDefinition;
  category: string;
  bgImage: string;
}) => {
  const categoryColors = {
    "Core System": {
      text: "text-purple-700",
      bg: "bg-purple-50"
    },
    "Built-in Tools": {
      text: "text-blue-700",
      bg: "bg-blue-50"
    },
    "Safety": {
      text: "text-green-700",
      bg: "bg-green-50"
    },
    "Community": {
      text: "text-orange-700",
      bg: "bg-orange-50"
    },
    "Knowledge": {
      text: "text-red-700",
      bg: "bg-red-50"
    },
    "Analytics": {
      text: "text-indigo-700",
      bg: "bg-indigo-50"
    }
  };

  const categoryStyle = (categoryColors as any)[category] || {
    text: "text-blue-700",
    bg: "bg-blue-50"
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 group hover:shadow-xl transition-all duration-300 bg-white">
      <div className="h-48 overflow-hidden">
        <img
          src={bgImage}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-6">
        <div className="inline-block mb-3">
          <span className={`${categoryStyle.bg} ${categoryStyle.text} text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider`}>
            {category}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 flex-shrink-0">
            <FontAwesomeIcon icon={icon} className="text-sm" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;