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
      <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 text-sm" />
    ));
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-1 mb-4">
        {renderStars()}
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">
        {quote}
      </p>

      <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-200">
        <div>
          <p className="font-semibold text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>

        <div className="flex items-center gap-1 text-green-600">
          <FontAwesomeIcon icon={faStar} className="text-sm" />
          <span className="text-sm font-medium">+{rating}</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;