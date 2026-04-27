import { WorldIcon } from "./icons/WorldIcon.tsx";
import type { Game, World } from "../data/worlds.ts";

interface Props {
  game: Game;
  world: World;
  onClick: () => void;
}

export function GameButton({ game, world, onClick }: Props) {
  return (
    <button
      className="game-button"
      style={{
        border: `3px solid ${world.colorBorder}`,
        "--hover-bg": world.colorBg,
        "--hover-border": world.colorHover,
      } as React.CSSProperties}
      onClick={onClick}
      aria-label={`Uruchom grę ${game.name}`}
    >
      <span className="game-button__icon">
        <WorldIcon name={game.icon} size={40} color={world.colorMain} />
      </span>
      <span className="game-button__name">{game.name}</span>
    </button>
  );
}
