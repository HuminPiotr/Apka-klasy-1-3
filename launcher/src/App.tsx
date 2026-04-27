import { useState, useCallback, useEffect } from "react";
import { StartScreen } from "./screens/StartScreen.tsx";
import { WorldScreen } from "./screens/WorldScreen.tsx";
import { GameFrame } from "./screens/GameFrame.tsx";
import { worlds } from "./data/worlds.ts";
import type { WorldId, GameId } from "./data/worlds.ts";

type AppScreen = "start" | "world" | "game";
type NavDirection = "forward" | "backward";
type AnimState = { exiting: boolean; direction: NavDirection };

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("start");
  const [activeWorldId, setActiveWorldId] = useState<WorldId | null>(null);
  const [activeGameId, setActiveGameId] = useState<GameId | null>(null);
  const [anim, setAnim] = useState<AnimState>({ exiting: false, direction: "forward" });

  const activeWorld = worlds.find((w) => w.id === activeWorldId) ?? null;
  const activeGame = activeWorld?.games.find((g) => g.id === activeGameId) ?? null;

  const navigate = useCallback((direction: NavDirection, next: () => void) => {
    setAnim({ exiting: true, direction });
    setTimeout(() => {
      setAnim({ exiting: false, direction });
      next();
    }, 280);
  }, []);

  const handleWorldSelect = useCallback(
    (id: WorldId) => {
      navigate("forward", () => {
        setActiveWorldId(id);
        setScreen("world");
      });
    },
    [navigate]
  );

  const handleBackToStart = useCallback(() => {
    navigate("backward", () => {
      setScreen("start");
      setActiveWorldId(null);
    });
  }, [navigate]);

  const handleGameSelect = useCallback((id: GameId) => {
    setActiveGameId(id);
    setScreen("game");
  }, []);

  const handleBackToWorld = useCallback(() => {
    setScreen("world");
    setActiveGameId(null);
  }, []);

  const animClass = (base: string): string => {
    if (anim.exiting) {
      return `${base} ${anim.direction === "forward" ? "animate-exit-forward" : "animate-exit-backward"}`;
    }
    return `${base} ${anim.direction === "forward" ? "animate-enter-forward" : "animate-enter-backward"}`;
  };

  // F11 → fullscreen toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F11") {
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (screen === "game" && activeGame && activeWorld) {
    return (
      <GameFrame
        game={activeGame}
        world={activeWorld}
        onBack={handleBackToWorld}
      />
    );
  }

  if (screen === "world" && activeWorld) {
    return (
      <WorldScreen
        world={activeWorld}
        onBack={handleBackToStart}
        onGameSelect={handleGameSelect}
        animClass={animClass("screen world-screen")}
      />
    );
  }

  return (
    <StartScreen
      onWorldSelect={handleWorldSelect}
      animClass={animClass("screen start-screen")}
    />
  );
}
