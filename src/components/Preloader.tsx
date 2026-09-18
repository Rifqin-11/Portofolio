import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type PreloaderProps = {
  dataReady: boolean;
  onComplete: () => void;
};

const Preloader = ({ dataReady, onComplete }: PreloaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef({ value: 0 });
  const hasExitedRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [imageReady, setImageReady] = useState(false);
  const [minimumDurationDone, setMinimumDurationDone] = useState(false);
  const readyToOpen = dataReady && imageReady && minimumDurationDone;

  useEffect(() => {
    document.body.classList.add("is-preloading");
    const minimumDurationTimer = window.setTimeout(() => {
      setMinimumDurationDone(true);
    }, 3500);

    return () => {
      window.clearTimeout(minimumDurationTimer);
      document.body.classList.remove("is-preloading");
    };
  }, []);

  useGSAP(
    () => {
      gsap.to(progressRef.current, {
        value: 100,
        duration: 3.5,
        ease: "none",
        overwrite: true,
        onUpdate: () => {
          setProgress(Math.round(progressRef.current.value));
        },
      });
    },
    { scope: containerRef }
  );

  useGSAP(
    () => {
      if (!readyToOpen || hasExitedRef.current) {
        return;
      }

      gsap.to(progressRef.current, {
        value: 100,
        duration: 0.1,
        ease: "power2.out",
        overwrite: true,
        onUpdate: () => {
          setProgress(Math.round(progressRef.current.value));
        },
        onComplete: () => {
          if (hasExitedRef.current) return;

          hasExitedRef.current = true;
          const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;

          if (reducedMotion) {
            onComplete();
            return;
          }

          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 0.85,
            ease: "power4.inOut",
            onComplete: () => {
              onComplete();
              window.requestAnimationFrame(() => ScrollTrigger.refresh());
            },
          });
        },
      });
    },
    {
      scope: containerRef,
      dependencies: [readyToOpen, onComplete],
      revertOnUpdate: false,
    }
  );

  return (
    <div
      ref={containerRef}
      className="preloader"
      role="status"
      aria-live="polite"
      aria-label={`Loading portfolio ${progress}%`}
    >
      <div className="preloader__curtain" aria-hidden="true" />
      <div className="preloader__content">
        <img
          src="/character/preload.gif"
          alt="Illustrated character working at a laptop"
          className="preloader__image"
          onLoad={() => setImageReady(true)}
          onError={() => setImageReady(true)}
        />
        <span className="preloader__progress">{progress}%</span>
      </div>
    </div>
  );
};

export default Preloader;
