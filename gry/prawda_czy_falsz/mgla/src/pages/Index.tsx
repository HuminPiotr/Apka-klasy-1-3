import { useState } from "react";
import FogReveal, { FogStage } from "@/components/FogReveal";
import StageDots from "@/components/StageDots";
import Task1Match from "@/components/Task1Match";
import Task2Dragon from "@/components/Task2Dragon";
import Task3Logic from "@/components/Task3Logic";
import FinalScreen from "@/components/FinalScreen";
import MirrorDuel from "@/components/MirrorDuel";

type Screen = "start" | "task1" | "task2" | "task3" | "final" | "mirror";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("start");
  const [fogStage, setFogStage] = useState<FogStage>(0);
  const [completed, setCompleted] = useState(0);

  const currentStage: 0 | 1 | 2 | 3 =
    screen === "start" ? 0 :
    screen === "task1" ? 1 :
    screen === "task2" ? 2 :
    3;

  const handleTask1Complete = () => {
    setCompleted(1);
    setFogStage(1);   // fog lifts a little
    setScreen("task2");
  };

  const handleTask2Success = () => {
    setCompleted(2);
    setFogStage(2);   // fog lifts more
    setScreen("task3");
  };

  const handleTask3Complete = () => {
    setCompleted(3);
    setFogStage(3);   // fog fully gone + confetti
    setScreen("final");
  };

  const handleQuit = () => {
    setScreen("start");
    setFogStage(0);
    setCompleted(0);
  };

  return (
    <main className={`min-h-screen w-full flex justify-center px-4 py-8${screen === "start" ? " bg-gradient-to-b from-accent/40 to-background" : ""}`}>
      <div className="w-full" style={{ maxWidth: 900, minWidth: 0 }}>

        {/* Top bar */}
        <header className="flex items-center justify-between mb-8">
          {screen !== "start" ? (
            <button
              onClick={handleQuit}
              className="btn-pill"
              style={{
                background: "white",
                color: "hsl(var(--foreground))",
                border: "2px solid hsl(var(--foreground))",
                padding: "0.5rem 1.25rem",
                fontSize: "0.95rem",
              }}
            >
              🏠 Menu
            </button>
          ) : (
            <div />
          )}
          <StageDots current={currentStage} completed={completed} />
        </header>

        {/* Main content */}
        <section className="mb-8">

          {screen === "start" && (
            <div className="card-bordered p-10 text-center animate-fade-in">
              <h1 className="text-5xl font-extrabold mb-4">
                Zadanie Mgła <span aria-hidden>🌫️</span>
              </h1>
              <p className="text-xl font-semibold mb-8 text-muted-foreground">
                Wykonajcie 3 zadania i sprawdźcie co kryje się za mgłą!
              </p>
              <button
                onClick={() => { setScreen("task1"); }}
                className="btn-primary-dark text-lg px-8 py-4 hover:scale-105"
              >
                ▶ Rozpocznij misję
              </button>
            </div>
          )}

          {screen === "task1" && (
            <Task1Match onComplete={handleTask1Complete} />
          )}

          {screen === "task2" && (
            <Task2Dragon onSuccess={handleTask2Success} onQuit={handleQuit} />
          )}

          {screen === "task3" && (
            <Task3Logic onComplete={handleTask3Complete} />
          )}

          {screen === "final" && (
            <FinalScreen
              onMirrorDuel={() => setScreen("mirror")}
              onQuit={handleQuit}
            />
          )}

          {screen === "mirror" && (
            <MirrorDuel onQuit={handleQuit} />
          )}

        </section>

        {/* Fog reveal — always visible at bottom */}
        <FogReveal stage={fogStage} />

      </div>
    </main>
  );
};

export default Index;
