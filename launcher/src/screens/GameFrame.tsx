import { createPortal } from "react-dom";
import { BackButton } from "../components/BackButton.tsx";
import type { Game, World } from "../data/worlds.ts";

interface Props {
  game: Game;
  world: World;
  onBack: () => void;
}

export function GameFrame({ game, world, onBack }: Props) {
  const url = `http://localhost:${game.port}`;

  return createPortal(
    <div className="game-frame animate-fade-in">
      <iframe
        src={url}
        title={game.name}
        className="game-frame__iframe"
        allow="autoplay; fullscreen"
      />
      <div className="game-frame__back-overlay">
        <BackButton color={world.colorMain} onClick={onBack} label="Wróć do menu" />
      </div>
    </div>,
    document.body
  );
}
