import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCode, faPaintBrush, faCalculator, faLanguage, faChartLine,
  faMusic, faPenFancy, faBriefcase, faCamera, faBullhorn,
  faChartBar, faMicrophone, faLightbulb
} from "@fortawesome/free-solid-svg-icons";

type SkillName =
  | "Programming"
  | "Design"
  | "Math & Science"
  | "Languages"
  | "Finance"
  | "Music"
  | "Writing"
  | "Career & Biz"
  | "Photography"
  | "Marketing"
  | "Data Science"
  | "Public Speaking";

type SkillCardProps = {
  name: SkillName;
  count: number | string;
};

// these are static data not changable..
const SkillCard = ({ name, count }: SkillCardProps) => {
  const skillColors: Record<
    string,
    {
      text: string;
      bg: string;
      icon: IconDefinition;
    }
  > = {
    "Programming": {
      text: "text-purple-700",
      bg: "bg-purple-50",
      icon: faCode
    },
    "Design": {
      text: "text-blue-700",
      bg: "bg-blue-50",
      icon: faPaintBrush
    },
    "Math & Science": {
      text: "text-green-700",
      bg: "bg-green-50",
      icon: faCalculator
    },
    "Languages": {
      text: "text-orange-700",
      bg: "bg-orange-50",
      icon: faLanguage
    },
    "Finance": {
      text: "text-red-700",
      bg: "bg-red-50",
      icon: faChartLine
    },
    "Music": {
      text: "text-indigo-700",
      bg: "bg-indigo-50",
      icon: faMusic
    },
    "Writing": {
      text: "text-teal-700",
      bg: "bg-teal-50",
      icon: faPenFancy
    },
    "Career & Biz": {
      text: "text-pink-700",
      bg: "bg-pink-50",
      icon: faBriefcase
    },
    "Photography": {
      text: "text-amber-700",
      bg: "bg-amber-50",
      icon: faCamera
    },
    "Marketing": {
      text: "text-cyan-700",
      bg: "bg-cyan-50",
      icon: faBullhorn
    },
    "Data Science": {
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      icon: faChartBar
    },
    "Public Speaking": {
      text: "text-rose-700",
      bg: "bg-rose-50",
      icon: faMicrophone
    }
  };

  const colorStyle = skillColors[name] || {
    text: "text-gray-700",
    bg: "bg-gray-50",
    icon: faLightbulb
  };

  return (
    <div className={`${colorStyle.bg} rounded-xl p-5 text-center border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer`}>
      <div className={`${colorStyle.text} w-12 h-12 flex items-center justify-center rounded-full bg-white mx-auto mb-3 group-hover:scale-110 transition-transform`}>
        <FontAwesomeIcon icon={colorStyle.icon} className="text-xl" />
      </div>

      <h3 className={`${colorStyle.text} font-semibold text-lg mb-2`}>
        {name}
      </h3>

      <p className="text-gray-500 text-sm">
        {count}
      </p>
    </div>
  );
};

export default SkillCard;