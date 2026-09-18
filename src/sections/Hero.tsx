import { useEffect, useState } from "react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HeroRole, ProfileContent, SocialLink } from "../lib/portfolio-types";
import heroCharacter from "../../public/character/hero.png";
import heroCharacterDark from "../../public/character/heroDark.png";

gsap.registerPlugin(ScrollTrigger);

type HeroProps = {
  profile: ProfileContent;
  roles: HeroRole[];
  socialLinks: SocialLink[];
};

const Hero = ({ profile, roles, socialLinks }: HeroProps) => {
  const [activeHeadlineIndex, setActiveHeadlineIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  const headlines = [
    {
      id: "profile-name",
      text: profile.heroName,
    },
    ...roles.map((role) => ({
      id: role.id,
      text: role.text,
    })),
  ];

  useEffect(() => {
    if (roles.length === 0) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveHeadlineIndex((currentIndex) =>
        (currentIndex + 1) % (roles.length + 1)
      );
    }, 3500);

    return () => {
      window.clearInterval(timer);
    };
  }, [roles.length]);

  const activeHeadline = headlines[activeHeadlineIndex] ?? headlines[0];

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const characterImages = gsap.utils.toArray<HTMLElement>(
        ".reference-character__image"
      );

      if (reducedMotion) {
        gsap.set(characterImages, { scale: 1 });
        return;
      }

      gsap.fromTo(
        characterImages,
        { scale: 1.5, force3D: false },
        {
          scale: 1,
          ease: "none",
          force3D: false,
          scrollTrigger: {
            trigger: ".hero-static",
            start: "top top",
            end: "bottom 25%",
            scrub: 0.25,
          },
        }
      );
    },
    { scope: heroRef }
  );

  return (
    <section ref={heroRef} id="hero" className="hero-static">
      <div className="reference-label reference-label-left">latest</div>

      <div className="reference-label reference-label-right">Portofolio</div>

      <div className="hero-connect">
        <p className="hero-connect__label">Let's Connect:</p>
        <nav className="hero-connect__links" aria-label="Social links">
          {socialLinks.map((socialLink) => (
            <a
              key={socialLink.id}
              href={socialLink.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`hero-connect__link icon-${socialLink.name}`}
              aria-label={`Open ${socialLink.name}`}
            >
              <img src={socialLink.imgPath} alt="" aria-hidden="true" />
            </a>
          ))}
        </nav>
      </div>

      <figure className="reference-character">
        <img
          src={heroCharacter}
          alt={`Illustrated portrait of ${profile.heroName}`}
          className="reference-character__image reference-character__image--light"
        />
        <img
          src={heroCharacterDark}
          alt=""
          aria-hidden="true"
          className="reference-character__image reference-character__image--dark"
        />
      </figure>

      <h1 className="reference-name">
        <span
          className="reference-headline-slot"
          aria-live="polite"
          aria-atomic="true"
        >
          <span
            key={`${activeHeadline.id}-${activeHeadlineIndex}`}
            className={`reference-headline ${
              activeHeadlineIndex === 0
                ? "reference-headline--name"
                : "reference-headline--role"
            }`}
          >
            {activeHeadline.text}
          </span>
        </span>
      </h1>

      <p className="reference-description">
        I’m an Electrical Engineering graduate with a strong interest in
        software development. I enjoy building web and mobile applications that
        turn real-world problems into practical and user-friendly solutions. I’m
        curious, adaptable, and always eager to learn new technologies through
        hands-on projects.
      </p>
    </section>
  );
};

export default Hero;
