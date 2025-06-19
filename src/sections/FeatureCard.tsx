import { abilities } from "../constants";

const FeatureCard = () => {
  return (
    <div className="w-full padding-x-lg">
      <div className="mx-auto grid-3-cols">
        {abilities.map(({ imgPath, title, desc }) => (
          <div
            key={title}
            className="rounded-xl p-8 flex flex-col gap-4 bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)] ring-1 ring-[var(--navbar-ring)]"
          >
            <div className="size-14 flex items-center justify-center rounded-full">
              <img src={imgPath} alt={title} />
            </div>
            <h3 className="text-2xl font-semibold mt-2 text-[var(--text-primary)] dark:text-[var(--text-primary)]">
              {title}
            </h3>
            <p className="text-lg text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureCard;
