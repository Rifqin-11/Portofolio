import { counterItems } from "../constants";
import CountUp from "react-countup";

const AnimatedCounter = () => {
  return (
    <div id="counter" className="padding-x-lg xl:mt-0 mt-32">
      <div className="mx-auto grid-3-cols">
        {counterItems.map((item) => (
          <div
            key={item.label}
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
