import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faUsers, faComments, faCoins } from "@fortawesome/free-solid-svg-icons";

type StepKey = "01" | "02" | "03" | "04";

const StepCard = ({
  step,
  title,
  description,
}: {
  step: StepKey;
  title: string;
  description: string;
}) => {
  const stepConfig = {
    "01": { icon: faFileAlt, bg: "bg-indigo-100", text: "text-indigo-500" },
    "02": { icon: faUsers, bg: "bg-sky-100", text: "text-sky-500" },
    "03": { icon: faComments, bg: "bg-purple-100", text: "text-purple-500" },
    "04": { icon: faCoins, bg: "bg-amber-100", text: "text-amber-500" },
  };

  const config = stepConfig[step];

  return (
    <div className="group rounded-xl border border-white/40 bg-white/70 px-3.5 py-4 text-center backdrop-blur transition hover:shadow-md">
      <div
        className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${config.bg} transition-all duration-300 group-hover:scale-105`}
      >
        <FontAwesomeIcon icon={config.icon} className={`text-lg ${config.text}`} />
      </div>

      <p className={`mb-1.5 text-xs font-semibold ${config.text}`}>STEP {step}</p>

      <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>

      <p className="mx-auto max-w-xs text-xs leading-relaxed text-slate-600">{description}</p>
    </div>
  );
};

export default StepCard;
