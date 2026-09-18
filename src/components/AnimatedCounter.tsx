import CountUp from "react-countup";
import type { CSSProperties } from "react";
import type { Stat } from "../lib/portfolio-types";

type AnimatedCounterProps = {
  items: Stat[];
};

const AnimatedCounter = ({ items }: AnimatedCounterProps) => {
  return (
    <section
      id="counter"
      className="metrics-section"
      aria-label="Portfolio metrics"
    >
      <div className="metrics-grid">
        {items.filter((item) => item.isActive).map((item, index) => (
          <article
            key={item.id}
            className="metric-item"
            style={{ "--metric-index": index } as CSSProperties}
          >
            <div className="metric-value">
              <CountUp
                end={item.value}
                suffix={item.suffix}
                enableScrollSpy
                scrollSpyOnce
              />
            </div>
            <p className="metric-label">
              {item.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AnimatedCounter;
