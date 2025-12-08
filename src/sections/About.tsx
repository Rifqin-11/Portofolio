import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { abilities } from "../constants";
import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".ability-card",
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: "#about",
          start: "top center",
        },
      }
    );
  });

  return (
    <section id="about" className="section-padding">
      <div className="w-full md:px-10 px-5">
        <TitleHeader
          title="Why Hire Me?"
          sub="🎯 Dedicated, Adaptable, and Driven to Excel"
        />

        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10 mt-16">
          {abilities.map((item, index) => (
            <div
              key={index}
              className="ability-card card-border p-8 rounded-2xl bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)] hover:border-blue-500/50 transition-colors duration-300 group"
            >
              <div className="size-14 rounded-full bg-white flex-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <img
                  src={item.imgPath}
                  alt={item.title}
                  className="size-8 object-contain"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-[var(--text-primary)]">
                {item.title}
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
