import { useEffect, useState } from "react";

export type FogStage = 0 | 1 | 2 | 3;

interface FogRevealProps {
  stage: FogStage;
}

const stageStyles: Record<FogStage, { blur: number; opacity: number }> = {
  0: { blur: 20, opacity: 0.85 },
  1: { blur: 13, opacity: 0.65 },
  2: { blur: 5, opacity: 0.35 },
  3: { blur: 0, opacity: 0 },
};

const FogReveal = ({ stage }: FogRevealProps) => {
  const { blur, opacity } = stageStyles[stage];
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (stage === 3) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 2800);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const transitionDuration = stage === 3 ? "2s" : "1.5s";

  const confettiColors = ["#FFB800", "#3498DB", "#27AE60", "#764ba2", "#667eea"];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: "250px",
        borderRadius: "16px",
        border: "2px solid hsl(var(--foreground))",
        background: "var(--mystery-gradient)",
      }}
      aria-label="Tajemniczy obraz za mgłą"
    >
      {/* Mystery content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
        {stage < 3 ? (
          <span className="text-4xl font-extrabold tracking-widest opacity-90">
            TAJEMNICA...
          </span>
        ) : (
          <div className="animate-fade-in">
            <div className="text-5xl mb-3">🪞🧠</div>
            <h3 className="text-3xl font-extrabold mb-2">Neurony Lustrzane!</h3>
            <p className="text-base font-semibold max-w-xl">
              W naszych mózgach są specjalne komórki, które „odbijają" zachowanie innych.
              Dlatego gdy ktoś się uśmiecha — Ty też masz ochotę się uśmiechnąć! 🪞✨
            </p>
          </div>
        )}
      </div>

      {/* Fog overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          backgroundColor: `rgba(255,255,255,${opacity})`,
          transition: `backdrop-filter ${transitionDuration} ease-out, background-color ${transitionDuration} ease-out`,
        }}
      />

      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: confettiColors[i % confettiColors.length],
                animationDelay: `${Math.random() * 0.6}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FogReveal;
