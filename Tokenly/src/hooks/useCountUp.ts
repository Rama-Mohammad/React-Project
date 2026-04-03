import { useEffect, useState } from "react";

const useCountUp = (end: number, start: boolean) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    let current = 0;
    const increment = end / 100;

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

  return value;
};

export default useCountUp;
