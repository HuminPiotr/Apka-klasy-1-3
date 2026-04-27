import { useEffect, useRef, useState } from "react";

interface MirrorDuelProps {
  onQuit: () => void;
}

const TOTAL = 60;

const INSTRUCTIONS = [
  "Dobierzcie się w pary — najlepiej z osobą, z którą rzadziej rozmawiacie.",
  "Stańcie naprzeciwko siebie i patrzcie sobie w oczy.",
  "Jedna osoba KAMIENNA TWARZ — w całkowitej ciszy.",
  "Druga osoba: tylko się uśmiecha — bez dotykania, bez mówienia.",
  "Po minucie: zamiana ról. Timer na ekranie odlicza czas.",
];

type TimerState = "idle" | "running" | "paused" | "done";

const MirrorDuel = ({ onQuit }: MirrorDuelProps) => {
  const [timeLeft, setTimeLeft] = useState(TOTAL);
  const [state, setState] = useState<TimerState>("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    // If done — reset and start fresh
    const startFrom = state === "done" ? TOTAL : timeLeft;
    if (state === "done") setTimeLeft(TOTAL);
    setState("running");

    let current = startFrom;
    intervalRef.current = setInterval(() => {
      current -= 1;
      setTimeLeft(current);
      if (current <= 0) {
        clearInterval(intervalRef.current!);
        setState("done");
      }
    }, 1000);
  };

  // Stop = pause only, keeps current time
  const pause = () => {
    clearInterval(intervalRef.current!);
    setState("paused");
  };

  useEffect(() => () => { clearInterval(intervalRef.current!); }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (timeLeft / TOTAL);

  return (
    <div className="card-bordered p-8 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-center mb-6">🪞 Pojedynek Luster</h2>

      {/* Instructions */}
      <ol className="mb-8 space-y-3">
        {INSTRUCTIONS.map((inst, i) => (
          <li key={i} className="flex gap-3 items-start text-base font-semibold">
            <span
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-extrabold text-sm text-white"
              style={{ background: "hsl(var(--foreground))" }}
            >
              {i + 1}
            </span>
            <span className="pt-0.5">{inst}</span>
          </li>
        ))}
      </ol>

      {/* Timer */}
      <div className="flex justify-center mb-6">
        <div className="relative" style={{ width: 160, height: 160 }}>
          <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="80" cy="80" r={radius} fill="none" stroke="#e0e0e0" strokeWidth="10" />
            <circle
              cx="80" cy="80" r={radius}
              fill="none"
              stroke="#FFB800"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: state === "running" ? "stroke-dashoffset 1s linear" : "none" }}
            />
          </svg>
          <div
            className="absolute inset-0 flex items-center justify-center font-extrabold"
            style={{ fontSize: 38, color: "#FFB800" }}
          >
            {formatTime(state === "done" ? 0 : timeLeft)}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-center mb-8">
        <button
          onClick={start}
          disabled={state === "running"}
          className="btn-pill px-6 py-3 text-white font-extrabold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ background: "#27AE60" }}
        >
          {state === "done" ? "🔄 Jeszcze raz" : "▶ Start timera"}
        </button>
        <button
          onClick={pause}
          disabled={state !== "running"}
          className="btn-pill px-6 py-3 text-white font-extrabold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ background: "hsl(var(--destructive))" }}
        >
          ⏸ Pauza
        </button>
      </div>

      {/* Teacher message — shown after timer ends */}
      {state === "done" && (
        <div
          className="card-bordered p-6 mb-6 animate-fade-in"
          style={{ background: "hsl(var(--muted))" }}
        >
          <p className="text-base font-semibold leading-relaxed">
            Widzicie? Trudno jest się nie uśmiechnąć, gdy ktoś uśmiecha się do nas.
            To znaczy, że Wasze mózgi chcą być ze sobą w zgodzie.{" "}
            Pamiętajcie o tym gdy ktoś w klasie będzie miał gorszy dzień —
            Wasz uśmiech ma prawdziwą, biologiczną moc! 💪
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={onQuit}
          className="btn-primary-dark px-8 py-3 hover:scale-105"
        >
          🏠 Koniec gry — Wróć do menu
        </button>
      </div>
    </div>
  );
};

export default MirrorDuel;
