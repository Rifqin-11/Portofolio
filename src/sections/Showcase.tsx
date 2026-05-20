import { useRef } from "react";
import { gsap } from "gsap/gsap-core";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Project } from "../lib/portfolio-types";

gsap.registerPlugin(ScrollTrigger);

type ShowcaseSectionProps = {
  projects: Project[];
};

const ShowcaseSection = ({ projects }: ShowcaseSectionProps) => {
  const sectionRef = useRef(null);
  const imageFrameClass = (project: Project) =>
    project.imageLayout === "full" ? "is-full" : "is-contained";
  const imageFrameStyle = (project: Project) =>
    project.imageLayout === "contained"
      ? { backgroundColor: project.backgroundColor }
      : undefined;

  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );

    gsap.utils.toArray(".project").forEach((card, index) => {
      gsap.fromTo(
        card as Element,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3 * (index + 1),
          scrollTrigger: {
            trigger: card as Element,
            start: "top bottom-=100",
          },
        }
      );
    });
  }, [projects]);

  const featuredProject =
    projects.find((project) => project.featured) ?? projects[0];
  const regularProjects = projects.filter(
    (project) => project.id !== featuredProject?.id
  );
  const sideProjects = regularProjects.slice(0, 2);
  const gridProjects = regularProjects.slice(2);

  return (
    <div id="work" ref={sectionRef} className="app-showcase">
      <div className="w-full">
        <div className="showcaselayout">
          {featuredProject && (
            <div className="first-project-wrapper project">
              <div
                className={`image-wrapper ${imageFrameClass(featuredProject)}`}
                style={imageFrameStyle(featuredProject)}
              >
                <img src={featuredProject.image} alt={featuredProject.title} />
              </div>
              <div className="text-content">
                <a
                  href={featuredProject.link}
                  className="2xl:text-4xl xl:text-3xl md:text-xl lg:text-2xl font-semibold mt-5 hover:text-gray-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {featuredProject.title}
                </a>
                {featuredProject.description && (
                  <p className="text-[var(--text-secondary)] dark:text-[var(--text-primary)] md:text-xl mt-5">
                    {featuredProject.description}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="project-list-wrapper overflow-hidden">
            {sideProjects.map((project) => (
              <div className="project" key={project.id}>
                <div
                  className={`image-wrapper ${imageFrameClass(project)}`}
                  style={imageFrameStyle(project)}
                >
                  <img src={project.image} alt={project.title} />
                </div>
                <a
                  className="hover:text-gray-400"
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.title}
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-row md:grid xl:grid-cols-2 gap-5 space-y-10 mt-10">
          {gridProjects.map((project) => (
            <div className="project flex flex-col items-start" key={project.id}>
              <div
                className={`image-wrapper ${imageFrameClass(project)} rounded-2xl w-full flex items-center justify-center overflow-hidden`}
                style={imageFrameStyle(project)}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className={
                    project.imageLayout === "full"
                      ? "h-full w-full object-cover"
                      : "max-h-full max-w-full object-contain"
                  }
                />
              </div>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg md:text-xl lg:text-2xl font-semibold hover:text-gray-400"
              >
                {project.title}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowcaseSection;
