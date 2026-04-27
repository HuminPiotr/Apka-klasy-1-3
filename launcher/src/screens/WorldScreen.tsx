import { BackButton } from "../components/BackButton.tsx";
import { GameButton } from "../components/GameButton.tsx";
import { WorldIcon } from "../components/icons/WorldIcon.tsx";
import type { World, GameId } from "../data/worlds.ts";

interface Props {
  world: World;
  onBack: () => void;
  onGameSelect: (id: GameId) => void;
  animClass: string;
}

export function WorldScreen({ world, onBack, onGameSelect, animClass }: Props) {
  return (
    <div className={animClass}>
      <BackButton color={world.colorMain} onClick={onBack} label="Wróć" />

      <div className="world-screen__header">
        <WorldIcon name={world.icon} size={96} color={world.colorMain} />
        <h1 className="world-screen__title" style={{ color: world.colorMain }}>
          {world.name.toUpperCase()}
        </h1>
      </div>

      <div className="world-screen__games">
        {world.games.map((game) => (
          <GameButton
            key={game.id}
            game={game}
            world={world}
            onClick={() => onGameSelect(game.id)}
          />
        ))}
      </div>
    </div>
  );
}
