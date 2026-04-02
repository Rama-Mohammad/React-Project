import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

type TestimonialCardProps = {
  quote: string;
  name: string;
  title: string;
  rating: number;
};

const TestimonialCard = ({ quote, name, title, rating }: TestimonialCardProps) => {
  const renderStars = () => {
    return [...Array(5)].map((_, i) => (
      <FontAwesomeIcon key={i} icon={faStar} className="text-sm text-yellow-400" />
    ));
  };

  return (
    <div className="rounded-2xl border border-white/50 bg-white/80 p-6 shadow-sm backdrop-blur transition-shadow duration-300 hover:shadow-md">
      <div className="mb-4 flex items-center gap-1">{renderStars()}</div>

      <p className="mb-4 leading-relaxed text-slate-700">{quote}</p>

      <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-2">
        <div>
          <p className="font-semibold text-slate-900">{name}</p>
          <p className="text-sm text-slate-500">{title}</p>
        </div>

        <div className="flex items-center gap-1 text-indigo-500">
          <FontAwesomeIcon icon={faStar} className="text-sm" />
          <span className="text-sm font-medium">+{rating}</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
