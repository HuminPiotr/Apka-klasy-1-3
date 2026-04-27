import { WorldIcon } from "./icons/WorldIcon.tsx";
import type { World } from "../data/worlds.ts";

interface Props {
  world: World;
  onClick: () => void;
}

export function WorldCard({ world, onClick }: Props) {
  return (
    <button
      className="world-card"
      style={{
        background: world.colorBg,
        border: `4px solid ${world.colorBorder}`,
        "--hover-border": world.colorHover,
        "--hover-shadow": "var(--shadow-card-hover)",
      } as React.CSSProperties}
      onClick={onClick}
      aria-label={`Wejdź do ${world.name}`}
    >
      <div className="world-card__icon">
        <WorldIcon name={world.icon} color={world.colorMain} size={96} />
      </div>

      <h2
        className="world-card__title"
        style={{ color: world.colorMain }}
      >
        {world.name}
      </h2>

      <div
        className="world-card__cta"
        style={{ background: world.colorMain }}
        aria-hidden="true"
      >
        {world.ctaLabel}
      </div>
    </button>
  );
}
