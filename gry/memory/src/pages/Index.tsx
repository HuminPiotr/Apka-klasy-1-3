import { useState } from "react";
import { SetupScreen } from "@/components/memory/SetupScreen";
import { GameScreen } from "@/components/memory/GameScreen";
import { createSession } from "@/game/engine";
import type { BoardCard, GameSession } from "@/game/types";

interface ActiveGame {
  session: GameSession;
  cards: BoardCard[];
  config: Parameters<typeof createSession>[0];
}

const Index = () => {
  const [active, setActive] = useState<ActiveGame | null>(null);

  if (!active) {
    return (
      <SetupScreen
        onStart={(config) => {
          const built = createSession(config);
          setActive({ ...built, config });
        }}
      />
    );
  }

  return (
    <GameScreen
      key={active.session.id}
      initialSession={active.session}
      initialCards={active.cards}
      onExit={() => setActive(null)}
      onPlayAgain={() => {
        const built = createSession(active.config);
        setActive({ ...built, config: active.config });
      }}
    />
  );
};

export default Index;
