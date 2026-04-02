import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCode,
  faPaintBrush,
  faCalculator,
  faLanguage,
  faChartLine,
  faMusic,
  faPenFancy,
  faBriefcase,
  faCamera,
  faBullhorn,
  faChartBar,
  faMicrophone,
  faLightbulb,
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

const SkillCard = ({ name, count }: SkillCardProps) => {
  const skillColors: Record<
    string,
    {
      text: string;
      bg: string;
      icon: IconDefinition;
    }
  > = {
    Programming: { text: "text-purple-600", bg: "bg-purple-50", icon: faCode },
    Design: { text: "text-sky-600", bg: "bg-sky-50", icon: faPaintBrush },
    "Math & Science": { text: "text-emerald-600", bg: "bg-emerald-50", icon: faCalculator },
    Languages: { text: "text-amber-600", bg: "bg-amber-50", icon: faLanguage },
    Finance: { text: "text-rose-600", bg: "bg-rose-50", icon: faChartLine },
    Music: { text: "text-indigo-600", bg: "bg-indigo-50", icon: faMusic },
    Writing: { text: "text-teal-600", bg: "bg-teal-50", icon: faPenFancy },
    "Career & Biz": { text: "text-pink-600", bg: "bg-pink-50", icon: faBriefcase },
    Photography: { text: "text-orange-600", bg: "bg-orange-50", icon: faCamera },
    Marketing: { text: "text-cyan-600", bg: "bg-cyan-50", icon: faBullhorn },
    "Data Science": { text: "text-lime-600", bg: "bg-lime-50", icon: faChartBar },
    "Public Speaking": { text: "text-violet-600", bg: "bg-violet-50", icon: faMicrophone },
  };

  const colorStyle = skillColors[name] || {
    text: "text-slate-600",
    bg: "bg-slate-50",
    icon: faLightbulb,
  };

  return (
    <div
      className={`${colorStyle.bg} cursor-pointer rounded-xl border border-white/50 p-5 text-center shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
    >
      <div
        className={`${colorStyle.text} mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white transition-transform hover:scale-110`}
      >
        <FontAwesomeIcon icon={colorStyle.icon} className="text-xl" />
      </div>

      <h3 className={`${colorStyle.text} mb-2 text-lg font-semibold`}>{name}</h3>

      <p className="text-sm text-slate-500">{count}</p>
    </div>
  );
};

export default SkillCard;
