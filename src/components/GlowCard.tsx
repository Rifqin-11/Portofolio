// @ts-nocheck
import { useRef } from "react";

interface GlowCardProps {
  card: { review: string }; // Adjust this type according to the actual shape of 'card'
  index: number;
  children?: React.ReactNode;
}

const GlowCard = ({ card, index, children }: GlowCardProps) => {
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  interface MouseMoveEvent
    extends React.MouseEvent<HTMLDivElement, MouseEvent> {}

  type CardRef = HTMLDivElement | null;

  type HandleMouseMove = (index: number) => (e: MouseMoveEvent) => void;

  const handleMouseMove: HandleMouseMove = (index) => (e) => {
    const card = cardRefs.current[index] as HTMLDivElement | undefined;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);

    angle = (angle + 360) % 360;

    card.style.setProperty("--start", (angle + 60).toString());
  };

  return (
    <div
      ref={(el) => {
        cardRefs.current[index] = el;
      }}
      onMouseMove={handleMouseMove(index)}
      className="card card-border timeline-card rounded-xl p-10 mb-5 break-inside-avoid-column bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)]"
    >
      <div className="glow"></div>
      <div className="flex items-center gap-1 mb-5">
        {Array.from({ length: 5 }, (_, i) => (
          <img key={i} src="/images/star.png" alt="star" className="size-5" />
        ))}
      </div>
      <div className="mb-5">
        <p className="text-[var(--text-secondary)] dark:text-[var(--text-primary)] text-lg">
          {card.review}
        </p>
      </div>
      {children}
    </div>
  );
};

export default GlowCard;
