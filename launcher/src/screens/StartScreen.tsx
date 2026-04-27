import { WorldCard } from "../components/WorldCard.tsx";
import { worlds } from "../data/worlds.ts";
import type { WorldId } from "../data/worlds.ts";

interface Props {
  onWorldSelect: (id: WorldId) => void;
  animClass: string;
}

export function StartScreen({ onWorldSelect, animClass }: Props) {
  return (
    <div className={animClass}>
      <h1 className="start-screen__headline">NA CO JESTEŚCIE GOTOWI?</h1>

      <div className="start-screen__cards">
        {worlds.map((world) => (
          <WorldCard
            key={world.id}
            world={world}
            onClick={() => onWorldSelect(world.id)}
          />
        ))}
      </div>
    </div>
  );
}
