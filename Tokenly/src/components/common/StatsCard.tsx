import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";
import type { RefObject } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const useInView = (): [RefObject<HTMLDivElement | null>, boolean] => {
  // ref is used to detect when an element appears on screen for the first time and isVisible is used to trigger the count up animation
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

type CountUpProps = {
  end: number;
  start: boolean;
};

const CountUp = ({ end, start }: CountUpProps) => {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (!start) return;

    let current = 0;
    const duration = 1800;
    const increment = end / (duration / 16);

    const counter = setInterval(() => {
      current += increment;

      if (current >= end) {
        current = end;
        clearInterval(counter);
      }

      setValue(Math.floor(current));
    }, 16);

    return () => clearInterval(counter);
  }, [end, start]);

  return <>{value.toLocaleString()}</>;
};

type StatCardProps = {
  icon: IconDefinition;
  number: string;
  label: string;
};

const StatCard = ({ icon, number, label }: StatCardProps) => {
  const numericValue = parseInt(number.replace(/\D/g, ""));
  const [ref, isVisible] = useInView();

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-4 rounded-2xl border border-white/50 bg-white/80 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
        <FontAwesomeIcon icon={icon} />
      </div>

      <div className="text-4xl font-bold text-slate-900">
        <CountUp end={numericValue} start={isVisible} />
        {number.includes("+") && "+"}
      </div>

      <div className="text-sm font-medium text-slate-600">{label}</div>
    </div>
  );
};

export default StatCard;
