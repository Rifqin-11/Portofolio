import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { expCards } from "../constants";
import TitleHeader from "../components/TitleHeader";
import GlowCard from "../components/GlowCard";

gsap.registerPlugin(ScrollTrigger);

const ExperienceSection = () => {
  useGSAP(() => {
    gsap.utils.toArray(".timeline-card").forEach((card) => {
      gsap.from(card as Element, {
        xPercent: -100,
        opacity: 0,
        transformOrigin: "left left",
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: card as Element,
          start: "top 80%",
        },
      });
    });

    gsap.to(".timeline", {
      transformOrigin: "bottom bottom",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".timeline",
        start: "top center",
        end: "70% center",
        onUpdate: (self) => {
          gsap.to(".timeline", {
            scaleY: 1 - self.progress,
          });
        },
      },
    });

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
  }, []);

  return (
    <section
      id="experience"
      className="w-full md:mt-40 mt-20 section-padding xl:px-0 bg-[var(--bg-primary)] dark:bg-[var(--bg-primary)]"
    >
      <div className="w-full h-full md:px-20 px-5">
        <TitleHeader
          title="Project Experience"
          sub="💼 My Career Overview"
        />

        <div className="mt-32 relative">
          <div className="relative z-50 xl:space-y-32 space-y-10">
            {expCards.map((card, idx) => (
              <div key={card.title} className="exp-card-wrapper">
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
                    <div className="timeline-wrapper">
                      <div className="timeline" />
                      <div className="gradient-line w-1 h-full" />
                    </div>

                    <div className="expText flex xl:gap-20 md:gap-10 gap-5 relative z-20">
                      {card.logoPath ? (
                        <div className="timeline-logo bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)]">
                          <img src={card.logoPath} alt="logo" />
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
