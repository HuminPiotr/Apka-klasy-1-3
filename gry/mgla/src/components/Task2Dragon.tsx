import { useEffect, useRef, useState } from "react";

interface Task2DragonProps {
  onSuccess: () => void;
  onQuit: () => void;
}

type Phase = "intro" | "breathing" | "decision";

const TOTAL = 30;
const CYCLE = 4;

const MESSAGES: Record<number, string> = {
  10: "Wypełnij płuca — wyobraź sobie dwa balony, które powoli rosną...",
  20: "Wypuszczaj powoli — jakbyś oddychał przez słomkę...",
  30: "Powietrze żegna się z płucami i spokojnie wychodzi...",
};

const Task2Dragon = ({ onSuccess, onQuit }: Task2DragonProps) => {
  const [phase, setPhase] = useState<Phase>("intro");
  const [elapsed, setElapsed] = useState(0);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase !== "breathing") return;
    setElapsed(0);
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (MESSAGES[next]) {
          setMessage(MESSAGES[next]);
          setShowMessage(true);
          setTimeout(() => setShowMessage(false), 4000);
        }
        if (next >= TOTAL) {
          clearInterval(intervalRef.current!);
          setPhase("decision");
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [phase]);

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - elapsed / TOTAL);
  const isInhale = elapsed % CYCLE < CYCLE / 2;

  if (phase === "intro") {
    return (
      <div
        className="card-bordered p-8 text-center animate-fade-in"
        style={{ background: "linear-gradient(135deg, #87CEEB, #E0F0FF)" }}
      >
        {/* Background story */}
        <h2 className="text-2xl font-extrabold mb-3" style={{ color: "hsl(var(--foreground))" }}>
          Smoczek to wesoły i aktywny rozrabiaka.<br />
          Ale nawet on musi czasem trochę uspokoić myśli.
        </h2>
        <p className="text-lg font-semibold mb-6 rounded-xl px-4 py-3"
          style={{ background: "rgba(0,0,0,0.07)", color: "hsl(var(--foreground)/0.75)" }}>
          Popatrzcie jak smoczek rozluźnia się i przygotujcie się do kolejnego zadania!
          Usiądźcie prosto i zachowajcie ciszę...
        </p>

        {/* Video — place your file as: public/smok.mp4 */}
        <div className="w-full mb-6 rounded-xl overflow-hidden"
          style={{ border: "2px solid hsl(var(--foreground))" }}>
          <video
            src="smok.mp4"
            controls
            className="w-full block"
            style={{ display: "block" }}
          >
            Twoja przeglądarka nie obsługuje odtwarzacza wideo.
          </video>
        </div>

        <div style={{ fontSize: 90, lineHeight: 1.1, marginBottom: "1rem" }}>🐉</div>

        <button
          onClick={() => setPhase("breathing")}
          className="btn-pill text-lg px-8 py-4 hover:scale-105 text-white font-extrabold"
          style={{ background: "#FF8C00" }}
        >
          ▶ START
        </button>
      </div>
    );
  }

  if (phase === "breathing") {
    return (
      <div
        className="card-bordered p-8 text-center animate-fade-in"
        style={{ background: "linear-gradient(135deg, #87CEEB, #E0F0FF)" }}
      >
        <h2 className="text-xl font-extrabold mb-4">🐉 Smoczy oddech</h2>

        <div
          style={{
            fontSize: 100,
            lineHeight: 1.1,
            display: "inline-block",
            animation: `dragon-breathe ${CYCLE}s ease-in-out infinite`,
            marginBottom: "1rem",
          }}
        >
          🐉
        </div>

        <div className="text-2xl font-extrabold mb-6" style={{ minHeight: "2.5rem" }}>
          {isInhale ? "Wdech... 🌬️" : "Wydech... 💨"}
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative" style={{ width: 100, height: 100 }}>
            <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="50" cy="50" r={radius} fill="none" stroke="#d0d0d0" strokeWidth="8" />
              <circle
                cx="50" cy="50" r={radius}
                fill="none"
                stroke="#FFB800"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div
              className="absolute inset-0 flex items-center justify-center font-extrabold text-xl"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {TOTAL - elapsed}
            </div>
          </div>
        </div>

        <div
          className="text-base font-semibold px-4"
          style={{
            minHeight: "3rem",
            opacity: showMessage ? 1 : 0,
            transition: "opacity 0.6s ease-in-out",
            color: "hsl(var(--foreground))",
          }}
        >
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className="card-bordered p-10 text-center animate-fade-in">
      <div className="text-6xl mb-4">🏆</div>
      <h2 className="text-2xl font-extrabold mb-3">Brawo!</h2>
      <p className="text-lg font-semibold mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
        Nauczycielu — oceń, czy klasa dała radę.
      </p>
      <div className="flex flex-col gap-3 items-center">
        <button
          onClick={onSuccess}
          className="btn-primary-dark text-lg px-8 py-4 hover:scale-105 w-full max-w-xs"
        >
          ✅ Udało się! Dalej →
        </button>
        <button
          onClick={() => setPhase("breathing")}
          className="btn-pill text-lg px-8 py-4 hover:scale-105 w-full max-w-xs"
          style={{
            background: "hsl(var(--selected))",
            color: "hsl(var(--foreground))",
            border: "2px solid hsl(var(--foreground))",
          }}
        >
          🔄 Powtórz zadanie
        </button>
        <button
          onClick={onQuit}
          className="btn-pill text-lg px-8 py-4 hover:scale-105 w-full max-w-xs"
          style={{
            background: "white",
            color: "hsl(var(--foreground))",
            border: "2px solid hsl(var(--foreground))",
          }}
        >
          🏠 Zakończ grę
        </button>
      </div>
    </div>
  );
};

export default Task2Dragon;
