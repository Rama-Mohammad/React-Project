import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faUsers, faComments, faCoins } from "@fortawesome/free-solid-svg-icons";

type StepKey = "01" | "02" | "03" | "04";

const StepCard = ({ step, title, description }: {
  step: StepKey;
  title: string;
  description: string;
}) => {
  const stepConfig = {
    "01": {
      icon: faFileAlt,
      bg: "bg-green-100",
      text: "text-green-600",
    },
    "02": {
      icon: faUsers,
      bg: "bg-orange-100",
      text: "text-orange-600",
    },
    "03": {
      icon: faComments,
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
    "04": {
      icon: faCoins,
      bg: "bg-red-100",
      text: "text-red-600",
    },
  };

  const config = stepConfig[step];

  return (
    <div className="flex flex-col items-center text-center px-4 group">
      <div
        className={`w-16 h-16 flex items-center justify-center rounded-xl ${config.bg} shadow-sm mb-6 transition-all duration-300
         group-hover:scale-110 group-hover:shadow-lg`}>
        <FontAwesomeIcon
          icon={config.icon}
          className={`text-2xl ${config.text}`}
        />
      </div>

      <p className={`text-sm font-semibold mb-2 ${config.text}`}>
        STEP {step}
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {title}
      </h3>

      <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  );
};

export default StepCard;