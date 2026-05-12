import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import TitleHeader from "../components/TitleHeader";
import GlowCard from "../components/GlowCard";
import type { Experience } from "../lib/portfolio-types";

gsap.registerPlugin(ScrollTrigger);

type ExperienceSectionProps = {
  experiences: Experience[];
};

const ExperienceSection = ({ experiences }: ExperienceSectionProps) => {
  useGSAP(() => {
    gsap.utils.toArray(".timeline-card").forEach((card) => {
      const cardElement = card as HTMLElement;

      if (cardElement.getBoundingClientRect().top < window.innerHeight * 0.85) {
        gsap.set(cardElement, { xPercent: 0, opacity: 1 });
        return;
      }

      gsap.fromTo(
        cardElement,
        {
          xPercent: -120,
          opacity: 0,
        },
        {
          xPercent: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: cardElement,
            start: "top 85%",
            once: true,
          },
        }
      );
    });

    gsap.fromTo(
      ".experience-list .gradient-line",
      {
        scaleY: 0,
        transformOrigin: "top top",
      },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".experience-list",
          start: "top 70%",
          end: "bottom 70%",
          scrub: true,
        },
      }
    );

    gsap.utils.toArray(".expText").forEach((text) => {
      gsap.from(text as Element, {
        opacity: 0,
        xPercent: 0,
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: text as Element,
          start: "top 60%",
        },
      });
    }, "<");
  }, { dependencies: [experiences.length], revertOnUpdate: true });

  return (
    <section
      id="experience"
      className="w-full md:mt-40 mt-20 section-padding xl:px-0 bg-[var(--bg-primary)] dark:bg-[var(--bg-primary)]"
    >
      <div className="w-full h-full md:px-20 px-5">
        <TitleHeader
          title="Project & Organizational Experience"
          sub="💼 My Career Overview"
        />

        <div className="mt-32 relative">
          <div className="experience-list relative z-50 xl:space-y-32 space-y-10">
            <div className="timeline-wrapper" aria-hidden="true">
              <div className="gradient-line w-1 h-full" />
            </div>
            {experiences.map((card, idx) => (
              <div key={card.id} className="exp-card-wrapper">
                <div className="xl:w-2/6">
                  <GlowCard card={card} index={idx}>
                    {card.imgPath ? (
                      <div>
                        <img src={card.imgPath} alt={card.title} />
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </GlowCard>
                </div>

                <div className="xl:w-4/6">
                  <div className="flex items-start">
                    <div className="expText flex xl:gap-20 md:gap-10 gap-5 relative z-20">
                      {card.logoPath ? (
                        <div className="timeline-logo bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)]">
                          <img
                            src={card.logoPath}
                            alt="logo"
                            className="rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="md:size-20 size-10 flex-none rounded-full flex justify-center items-center md:-translate-y-7"></div>
                      )}
                      <div>
                        <h1 className="font-semibold text-3xl text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                          {card.title}
                        </h1>
                        <p className="flex my-5 text-lg text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                          📅&nbsp;{card.date}
                        </p>
                        <p className="italic text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                          Responsibilities
                        </p>
                        <ul className="list-disc ms-5 mt-5 flex flex-col gap-5">
                          {card.responsibilities.map((resp, idx) => (
                            <li
                              key={idx}
                              className="text-lg text-[var(--text-secondary)] dark:text-[var(--text-secondary)]"
                            >
                              {resp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
