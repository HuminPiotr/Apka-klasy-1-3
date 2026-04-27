interface Props {
  active: boolean;
}

const COLORS = [
  "hsl(var(--team-red))",
  "hsl(var(--team-blue))",
  "hsl(var(--team-green))",
  "hsl(var(--team-orange))",
  "hsl(var(--team-purple))",
  "hsl(var(--primary))",
];

export function Confetti({ active }: Props) {
  if (!active) return null;
  const pieces = Array.from({ length: 80 });
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 1.5;
        const duration = 2 + Math.random() * 2;
        const color = COLORS[i % COLORS.length];
        const size = 8 + Math.random() * 10;
        const rot = Math.random() * 360;
        return (
          <span
            key={i}
            className="absolute top-0 animate-confetti-fall"
            style={{
              left: `${left}%`,
              width: size,
              height: size * 0.4,
              background: color,
              transform: `rotate(${rot}deg)`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
}
