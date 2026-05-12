import { useEffect } from "react";

const InteractiveBackground = () => {
  useEffect(() => {
    let frame = 0;

    const updatePointer = (event: PointerEvent) => {
      if (frame) cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          "--spotlight-x",
          `${event.clientX}px`
        );
        document.documentElement.style.setProperty(
          "--spotlight-y",
          `${event.clientY}px`
        );
      });
    };

    window.addEventListener("pointermove", updatePointer);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", updatePointer);
    };
  }, []);

  return <div className="interactive-background" aria-hidden="true" />;
};

export default InteractiveBackground;
