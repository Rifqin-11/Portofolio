import type { CSSProperties } from "react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "../lib/portfolio-types";

gsap.registerPlugin(ScrollTrigger);

type ShowcaseSectionProps = {
  projects: Project[];
};

const ShowcaseSection = ({ projects }: ShowcaseSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const visibleProjects = projects
    .filter((project) => project.isActive)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder);

  const topProjects = visibleProjects.slice(0, 3);
  const bottomProjects = visibleProjects.slice(3);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const cards = gsap.utils.toArray<HTMLElement>(".work-card");

      if (reducedMotion) {
        gsap.set(cards, { clearProps: "all" });
        return;
      }

      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 72, scale: 0.86 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.95,
            delay: index * 0.04,
            ease: "back.out(1.35)",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  const renderProject = (project: Project) => {
    const index = visibleProjects.indexOf(project);
    const cardStyle = { "--work-order": index } as CSSProperties;

    return (
      <article
        className={`work-card${index === 0 ? " work-card--featured" : ""}`}
        key={project.id}
        style={cardStyle}
      >
        <a
          className="work-card__link"
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${project.title}`}
        >
          <div
            className="work-card__media"
            style={{ backgroundColor: project.backgroundColor }}
          >
            <img
              src={project.image}
              alt=""
              className={project.imageLayout === "full" ? "is-full" : "is-contained"}
            />
            <span className="work-card__number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="work-card__content">
            <h3>{project.title}</h3>
            {project.featured && project.description && <p>{project.description}</p>}
          </div>
        </a>
      </article>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className="editorial-section work-section"
    >
      <div className="editorial-section__header work-section__header">
        <p className="editorial-kicker">Selected work</p>
        <h2>Things I have built.</h2>
      </div>

      <div className="work-bento">
        <div className="work-bento__top">
          {topProjects.map(renderProject)}
        </div>
        {bottomProjects.length > 0 && (
          <div className="work-bento__bottom">
            {bottomProjects.map(renderProject)}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShowcaseSection;
