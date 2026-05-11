import CountUp from "react-countup";
import type { Stat } from "../lib/portfolio-types";

type AnimatedCounterProps = {
  items: Stat[];
};

const AnimatedCounter = ({ items }: AnimatedCounterProps) => {
  return (
    <div id="counter" className="padding-x-lg xl:mt-0 mt-32">
      <div className="mx-auto grid-3-cols">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg p-10 flex flex-col justify-center bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)] ring-1 ring-[var(--navbar-ring)]"
          >
            <div className="counter-number text-5xl font-bold mb-2 text-[var(--text-primary)] dark:text-[var(--text-primary)]">
              <CountUp suffix={item.suffix} end={item.value} />
            </div>
            <div className="text-lg text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedCounter;
