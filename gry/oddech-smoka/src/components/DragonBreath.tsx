import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import smokVideo from "@/assets/smok.mp4";
import senVideo from "@/assets/sen.mp4";
import smokImage from "@/assets/smok.webp";

type Phase = "idle" | "inhale" | "hold" | "exhale" | "done";

const PHASE_DURATION = 4000; // 4s (wdech / hold)
const EXHALE_DURATION = 6000; // 6s (dłuższy wydech)
const TOTAL_CYCLES = 3;

const getPhaseDuration = (phase: "inhale" | "hold" | "exhale") =>
  phase === "exhale" ? EXHALE_DURATION : PHASE_DURATION;

type PhaseStyle = {
  label: string;
  sub: string;
  bg: string;
  text: string;
  tint: string;
  tintBlend: "color" | "multiply" | "screen" | "overlay" | "soft-light";
};

const phaseConfig: Record<Exclude<Phase, "idle" | "done">, PhaseStyle> = {
  inhale: {
    label: "WDECH",
    sub: "Wciągnij powietrze nosem...",
    bg: "var(--gradient-sky)",
    text: "hsl(var(--foreground))",
    tint: "hsl(200 85% 55%)",
    tintBlend: "color",
  },
  hold: {
    label: "TRZYMAJ!",
    sub: "Smok napełnia płuca ogniem 🔥",
    bg: "var(--gradient-calm)",
    text: "hsl(var(--foreground))",
    tint: "hsl(140 60% 50%)",
    tintBlend: "color",
  },
  exhale: {
    label: "WYDECH",
    sub: "Zionij długo i powoli ustami...",
    bg: "var(--gradient-fire)",
    text: "hsl(var(--primary-foreground))",
    tint: "hsl(18 90% 55%)",
    tintBlend: "color",
  },
};

const Confetti = () => {
  const pieces = Array.from({ length: 40 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 1.5;
        const duration = 2 + Math.random() * 2;
        const colors = [
          "hsl(var(--accent))",
          "hsl(var(--secondary))",
          "hsl(var(--primary))",
          "hsl(var(--hold))",
        ];
        const color = colors[i % colors.length];
        const size = 8 + Math.random() * 10;
        return (
          <span
            key={i}
            className="absolute top-[-20px] rounded-sm"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              backgroundColor: color,
              animation: `confetti-fall ${duration}s ${delay}s linear forwards`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

const DragonBreath = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [cycle, setCycle] = useState(1);
  const [progress, setProgress] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(PHASE_DURATION / 1000);
  const videoRef = useRef<HTMLVideoElement>(null);
  const senVideoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const phaseStartRef = useRef<number>(0);

  // Animacja paska postępu + odliczanie sekund zsynchronizowane z fazą
  // (z 1.5s opóźnieniem przy starcie pierwszego cyklu)
  useEffect(() => {
    if (phase === "idle" || phase === "done") {
      setProgress(0);
      setSecondsLeft(PHASE_DURATION / 1000);
      return;
    }

    const duration = getPhaseDuration(phase);
    const startDelay = phase === "inhale" && cycle === 1 ? 1500 : 0;

    // Reset stanu wizualnego na czas opóźnienia
    setProgress(phase === "exhale" ? 100 : 0);
    setSecondsLeft(duration / 1000);

    const startTimer = setTimeout(() => {
      phaseStartRef.current = performance.now();
      const tick = (now: number) => {
        const elapsed = now - phaseStartRef.current;
        const ratio = Math.min(elapsed / duration, 1);
        let value = 0;
        if (phase === "inhale") value = ratio * 100;
        else if (phase === "hold") value = 100;
        else if (phase === "exhale") value = (1 - ratio) * 100;
        setProgress(value);
        const remaining = Math.max(
          0,
          Math.ceil((duration - elapsed) / 1000),
        );
        setSecondsLeft(remaining);
        if (ratio < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, cycle]);

  // Sterowanie sekwencją faz (z 1.5s opóźnieniem przy starcie pierwszego cyklu)
  useEffect(() => {
    if (phase === "idle" || phase === "done") return;

    const startDelay = phase === "inhale" && cycle === 1 ? 1500 : 0;

    const timer = setTimeout(() => {
      if (phase === "inhale") setPhase("hold");
      else if (phase === "hold") setPhase("exhale");
      else if (phase === "exhale") {
        if (cycle < TOTAL_CYCLES) {
          setCycle((c) => c + 1);
          setPhase("inhale");
        } else {
          setPhase("done");
        }
      }
    }, getPhaseDuration(phase) + startDelay);

    return () => clearTimeout(timer);
  }, [phase, cycle]);

  // Aktywna animacja smoka leci ciągle i w naturalnym tempie
  // (z 1.5s opóźnieniem przy starcie pierwszego cyklu)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (phase === "inhale" || phase === "hold" || phase === "exhale") {
      video.playbackRate = 1;
      video.loop = true;

      const shouldDelay = phase === "inhale" && cycle === 1;
      if (shouldDelay) {
        video.pause();
        const delayTimer = setTimeout(() => {
          video.play().catch(() => {});
        }, 1500);
        return () => clearTimeout(delayTimer);
      }

      video.play().catch(() => {});
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [phase, cycle]);

  // Auto-play wideo śpiącego smoka po zakończeniu
  useEffect(() => {
    if (phase === "done") {
      senVideoRef.current?.play().catch(() => {});
    }
  }, [phase]);

  const start = () => {
    setCycle(1);
    setPhase("inhale");
  };

  const reset = () => {
    setPhase("idle");
    setCycle(1);
    setProgress(0);
  };

  // Subtelna skala pomocnicza — wideo robi główną pracę, scale dodaje "oddech"
  const dragonScale =
    phase === "inhale"
      ? 1 + (progress / 100) * 0.15
      : phase === "hold"
        ? 1.15
        : phase === "exhale"
          ? 1 + (progress / 100) * 0.15
          : 1;

  const activePhase =
    phase === "idle" || phase === "done" ? null : phaseConfig[phase];

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6 transition-[background] duration-[1500ms] ease-in-out"
      style={{
        background: activePhase?.bg ?? "var(--gradient-sky)",
      }}
      aria-label="Ćwiczenie oddechowe Oddech Smoka"
    >
      {/* Chmurki w tle */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-[8%] top-[12%] h-16 w-32 rounded-full bg-white blur-xl" />
        <div className="absolute right-[10%] top-[20%] h-20 w-40 rounded-full bg-white blur-2xl" />
        <div className="absolute bottom-[18%] left-[15%] h-14 w-28 rounded-full bg-white blur-xl" />
      </div>

      {phase === "done" && <Confetti />}

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-8 text-center">
        <h1 className="sr-only">Oddech Smoka — ćwiczenie uspokajające</h1>

        {/* Licznik cykli */}
        {phase !== "idle" && phase !== "done" && (
          <div className="rounded-full bg-white/70 px-6 py-2 text-lg font-bold text-foreground shadow-[var(--shadow-soft)] backdrop-blur-sm">
            Cykl {cycle} z {TOTAL_CYCLES}
          </div>
        )}

        {/* Smok */}
        <div
          className="relative flex aspect-square w-[min(70vw,420px)] items-center justify-center overflow-hidden bg-white/40 shadow-[var(--shadow-soft)] backdrop-blur-sm transition-transform duration-1000 ease-in-out"
          style={{ transform: `scale(${dragonScale})`, borderRadius: "99px", isolation: "isolate" }}
        >
          {/* Statyczny obrazek smoka — ekran startowy */}
          {phase === "idle" && (
            <img
              src={smokImage}
              alt="Śpiący smok czeka na rozpoczęcie ćwiczenia"
              className="h-full w-full object-cover"
              style={{ borderRadius: "99px" }}
            />
          )}

          {/* Wideo smoka oddychającego — fazy aktywne */}
          {(phase === "inhale" || phase === "hold" || phase === "exhale") && (
            <video
              ref={videoRef}
              src={smokVideo}
              className="h-full w-full object-cover"
              style={{ borderRadius: "99px" }}
              muted
              playsInline
              preload="auto"
            />
          )}

          {/* Wideo śpiącego smoka — ekran końcowy (zatrzymanie na ostatniej klatce) */}
          {phase === "done" && (
            <video
              ref={senVideoRef}
              src={senVideo}
              className="h-full w-full object-cover"
              style={{ borderRadius: "99px" }}
              muted
              playsInline
              autoPlay
              onEnded={(e) => {
                const v = e.currentTarget;
                v.pause();
                if (v.duration && !isNaN(v.duration)) {
                  v.currentTime = Math.max(0, v.duration - 0.05);
                }
              }}
            />
          )}


          {phase === "exhale" && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                boxShadow: "var(--shadow-glow)",
                animation: "pulse-glow 4s ease-out forwards",
                borderRadius: "99px",
              }}
            />
          )}
        </div>

        {/* Komunikat fazy */}
        {activePhase && (
          <div className="space-y-2">
            <div
              className="text-6xl font-black tracking-wide drop-shadow-md md:text-7xl"
              style={{ color: activePhase.text }}
            >
              {activePhase.label}
            </div>
            <p className="text-xl font-medium text-foreground/80 md:text-2xl">
              {activePhase.sub}
            </p>
            <div
              className="text-5xl font-black tabular-nums drop-shadow-md md:text-6xl"
              style={{ color: activePhase.text }}
              aria-live="polite"
            >
              {secondsLeft}s
            </div>
          </div>
        )}

        {/* Pasek postępu */}
        {phase !== "idle" && phase !== "done" && (
          <div className="w-full max-w-md">
            <Progress value={progress} className="h-5 bg-white/60" />
          </div>
        )}

        {/* Ekran startowy */}
        {phase === "idle" && (
          <div className="space-y-6">
            <p className="mx-auto max-w-xl text-2xl font-semibold text-foreground md:text-3xl">
              Smok potrzebuje powietrza, żeby zionąć! 🐉
              <br />
              <span className="text-xl font-medium text-foreground/70 md:text-2xl">
                Usiądźcie prosto i przygotujcie się.
              </span>
            </p>
            <Button
              size="lg"
              onClick={start}
              className="h-16 rounded-full bg-secondary px-10 text-2xl font-bold text-secondary-foreground shadow-[var(--shadow-soft)] hover:bg-secondary/90 hover:scale-105 transition-transform"
            >
              ▶ START
            </Button>
          </div>
        )}

        {/* Ekran końcowy */}
        {phase === "done" && (
          <div className="space-y-6 animate-fade-in">
            <p className="text-3xl font-bold text-foreground md:text-4xl">
              Brawo! Smok jest spokojny 😴
            </p>
            <p className="text-xl text-foreground/70">
              Możemy wracać do nauki.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                onClick={reset}
                variant="outline"
                className="h-14 rounded-full bg-white/80 px-8 text-lg font-semibold"
              >
                Powtórz
              </Button>
              <Button
                size="lg"
                className="h-14 rounded-full bg-primary px-8 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Następna lekcja →
              </Button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse-glow {
          0% { opacity: 0; }
          30% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </main>
  );
};

export default DragonBreath;
