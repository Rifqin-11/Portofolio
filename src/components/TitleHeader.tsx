import React from "react";

interface TitleHeaderProps {
  title: string;
  sub: string;
}

const TitleHeader: React.FC<TitleHeaderProps> = ({ title, sub }) => {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="hero-badge bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)]">
        <p className="text-[var(--text-primary)]">{sub}</p>
      </div>
      <div className="font-semibold md:text-5xl text-3xl text-center text-[var(--text-primary)]">
        {title}
      </div>
    </div>
  );
};

export default TitleHeader;
