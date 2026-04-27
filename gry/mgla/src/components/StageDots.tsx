interface StageDotsProps {
  /** Current stage: 0 = none active, 1-3 = active stage */
  current: 0 | 1 | 2 | 3;
  /** Number of completed stages */
  completed: number;
}

const StageDots = ({ current, completed }: StageDotsProps) => {
  const dots = [1, 2, 3] as const;
  return (
    <div className="flex items-center gap-3" aria-label="Postęp misji">
      {dots.map((n) => {
        const isCompleted = n <= completed;
        const isActive = n === current && !isCompleted;
        let bg = "hsl(var(--stage-inactive))";
        let color = "hsl(var(--foreground))";
        if (isCompleted) {
          bg = "hsl(var(--behavior))";
          color = "white";
        } else if (isActive) {
          bg = "hsl(var(--selected))";
        }
        return (
          <div
            key={n}
            className="flex items-center justify-center font-extrabold text-lg transition-all duration-300"
            style={{
              width: 44,
              height: 44,
              borderRadius: "9999px",
              background: bg,
              color,
              border: "2px solid hsl(var(--foreground))",
              transform: isActive ? "scale(1.1)" : "scale(1)",
            }}
          >
            {isCompleted ? "✓" : n}
          </div>
        );
      })}
    </div>
  );
};

export default StageDots;
