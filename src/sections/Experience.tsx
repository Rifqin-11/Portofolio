import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Experience } from "../lib/portfolio-types";

gsap.registerPlugin(ScrollTrigger);

type ExperienceSectionProps = {
  experiences: Experience[];
};

const ExperienceSection = ({ experiences }: ExperienceSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const rows = gsap.utils.toArray<HTMLElement>(".experience-row");

      if (reducedMotion) {
        gsap.set(rows, { clearProps: "all" });
        return;
      }

      rows.forEach((row, index) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 52 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: index * 0.04,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="editorial-section experience-section"
    >
      <div className="editorial-section__header">
        <p className="editorial-kicker">Experience</p>
        <h2>Places where I learned by doing.</h2>
      </div>

      <div className="experience-rows">
        {experiences.map((card) => {
          const [role, ...companyParts] = card.title.split("|");
          const company = companyParts.join("|").trim();

          return (
            <article key={card.id} className="experience-row">
              <time>{card.date}</time>
              <div className="experience-row__main">
                <div className="experience-row__heading">
                  <h3>{role.trim()}</h3>
                  {company && <p className="experience-row__company">{company}</p>}
                </div>
                <p className="experience-row__description">{card.review}</p>
                {card.responsibilities.length > 0 && (
                  <ul>
                    {card.responsibilities.slice(0, 3).map((responsibility) => (
                      <li key={responsibility}>{responsibility}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ExperienceSection;
