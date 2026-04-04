import type { TestimonialCardProps } from "../../types/home";
import RatingStars from "../common/RatingStars";

const TestimonialCard = ({ quote, name, title, rating }: TestimonialCardProps) => {
  return (
    <div className="rounded-2xl border border-white/50 bg-white/80 p-6 shadow-sm backdrop-blur transition-shadow duration-300 hover:shadow-md">
      <div className="mb-4">
        <RatingStars value={5} />
      </div>

      <p className="mb-4 leading-relaxed text-slate-700">{quote}</p>

      <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-2">
        <div>
          <p className="font-semibold text-slate-900">{name}</p>
          <p className="text-sm text-slate-500">{title}</p>
        </div>

        <div className="flex items-center gap-1 text-indigo-500">
          <RatingStars
            value={1}
            sizeClassName="text-sm"
            wrapperClassName="inline-flex items-center"
            filledClassName="text-indigo-500"
            emptyClassName="hidden"
          />
          <span className="text-sm font-medium">+{rating}</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;

