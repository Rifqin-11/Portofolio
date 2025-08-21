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
              <img src="/images/project6.png" alt="Ryde App Interface" />
            </div>
            <div className="text-content">
              <a
                href="https://splitbill.rifqinaufal11.studio/"
                className="2xl:text-4xl xl:text-3xl md:text-xl lg:text-2xl font-semibold mt-5 hover:text-gray-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Split Bill Web App
              </a>
              <p className="text-[var(--text-secondary)] dark:text-[var(--text-primary)] md:text-xl mt-5">
                Split Bill is a web app that lets users upload a photo of a
                receipt and automatically splits the bill based on who ordered
                what. Assign items to each person, get an instant breakdown of
                costs, and share the payment info with friends. Simple, smart,
                and perfect for dining out together.
              </p>
            </div>
          </div>

          {/* right */}
          <div className="project-list-wrapper overflow-hidden">
            <div className="project" ref={ycDirectoryRef}>
              <div className="image-wrapper bg-[#e8f4f6]">
                <img src="/images/project3.png" alt="Siap Undip Schedule" />
              </div>
              <a
                className="hover:text-gray-400"
                href="https://schedule.rifqinaufal11.studio/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Siap Undip Schedule
              </a>
            </div>
            
            <div className="project" ref={libraryRef}>
              <div className="image-wrapper bg-[#e4eefe]">
                <img
                  src="/images/project1.png"
                  alt="EmployeeWeb - Visitor Management System"
                />
              </div>
              <a
                className="hover:text-gray-400"
                href="https://github.com/Rifqin-11/EmployeeWeb"
                target="_blank"
                rel="noopener noreferrer"
              >
                EmployeeWeb - Visitor Management System
              </a>
            </div>
          </div>
        </div>
        <div className="flex-row md:grid xl:grid-cols-2 gap-5 space-y-10 mt-10">
          <div className="project flex flex-col items-start">
            <div className="image-wrapper bg-[#F1EBFF] rounded-2xl w-full h-[400px] flex items-center justify-center overflow-hidden">
              <img
                src="/images/project2.png"
                alt="PLN Calculator"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <a
              href="https://github.com/Rifqin-11/PLNCalculator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg md:text-xl lg:text-2xl font-semibold hover:text-gray-400"
            >
              PLN Calculator
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
              className="text-lg md:text-xl lg:text-2xl font-semibold hover:text-gray-400"
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
