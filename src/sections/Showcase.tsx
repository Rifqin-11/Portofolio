import { useRef } from "react";
import { gsap } from "gsap/gsap-core";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const ShowcaseSection = () => {
  const sectionRef = useRef(null);
  const rydeRef = useRef(null);
  const libraryRef = useRef(null);
  const ycDirectoryRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );

    const cards = [rydeRef.current, libraryRef.current, ycDirectoryRef.current];

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
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
            trigger: card,
            start: "top bottom-=100",
          },
        }
      );
    });
  }, []);

  return (
    <div id="work" ref={sectionRef} className="app-showcase">
      <div className="w-full">
        <div className="showcaselayout">
          {/* left */}
          <div ref={rydeRef} className="first-project-wrapper">
            <div className="image-wrapper">
              <img src="/images/project1.png" alt="Ryde App Interface" />
            </div>
            <div className="text-content">
              <a
                href="https://github.com/Rifqin-11/EmployeeWeb"
                className="2xl:text-4xl xl:text-3xl md:text-xl lg:text-2xl font-semibold mt-5"
                target="_blank"
                rel="noopener noreferrer"
              >
                EmployeeWeb - Visitor Management System
              </a>
              <p className="text-[var(--text-secondary)] dark:text-[var(--text-primary)] md:text-xl mt-5">
                EmployeeWeb is a web-based administration system that allows
                employees to manage visitor records efficiently. With this
                system. This project is built using CodeIgniter 4 and Tailwind
                CSS, ensuring a clean and responsive UI.
              </p>
            </div>
          </div>

          {/* right */}
          <div className="project-list-wrapper overflow-hidden">
            <div className="project" ref={libraryRef}>
              <div className="image-wrapper bg-[#FFEFDB]">
                <img
                  src="/images/project2.png"
                  alt="Library Management Platform"
                />
              </div>
              <a
                href="https://github.com/Rifqin-11/PLNCalculator"
                target="_blank"
                rel="noopener noreferrer"
              >
                PLN Calculator
              </a>
            </div>

            <div className="project" ref={ycDirectoryRef}>
              <div className="image-wrapper bg-[#FFE7EB]">
                <img src="/images/project3.png" alt="Siap Undip Schedule" />
              </div>
              <a
                href="https://github.com/Rifqin-11/SiapUndipSchedule"
                target="_blank"
                rel="noopener noreferrer"
              >
                Siap Undip Schedule
              </a>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:flex-row gap-5 mt-10">
          <div className="project flex flex-col items-start">
            <div className="image-wrapper bg-[#F1EBFF] rounded-2xl w-full h-[400px] flex items-center justify-center overflow-hidden">
              <img
                src="/images/project5.png"
                alt="Netflix Clone"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <a
              className="text-lg md:text-xl lg:text-2xl font-semibold mt-5"
              href="https://github.com/Rifqin-11/NetflixClone"
              target="_blank"
              rel="noopener noreferrer"
            >
              Netflix Clone
            </a>
          </div>

          <div className="project flex flex-col items-start">
            <div className="image-wrapper bg-[#E6FFF7] rounded-2xl w-full h-[400px] flex items-center justify-center overflow-hidden">
              <img
                src="/images/project4.png"
                alt="Sitita Teknik Elektro"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <a
              className="text-lg md:text-xl lg:text-2xl font-semibold mt-5"
              href="https://github.com/Rifqin-11/Sitita"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sitita Teknik Elektro
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseSection;
