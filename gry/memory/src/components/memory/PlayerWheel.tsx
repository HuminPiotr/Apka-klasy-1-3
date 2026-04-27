import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Confetti, X, Hash } from "@phosphor-icons/react";

interface PlayerWheelProps {
  open: boolean;
  /** Lista imion. Jeśli pusta — wybór "Następne dziecko!" */
  names?: string[];
  /** Tryb losowania numerów z dziennika */
  numberRange?: { from: number; to: number };
  onClose: () => void;
  onPicked: (label?: string) => void;
}

export function PlayerWheel({ open, names = [], numberRange, onClose, onPicked }: PlayerWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      setPicked(null);
      setSpinning(false);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    }
  }, [open]);

  if (!open) return null;

  const isNumbers = !!numberRange;
  const numbers = isNumbers
    ? Array.from(
        { length: Math.max(1, numberRange!.to - numberRange!.from + 1) },
        (_, i) => String(numberRange!.from + i),
      )
    : [];
  const labels = isNumbers ? numbers : names.length > 0 ? names : ["Następne dziecko!"];

  const spin = () => {
    setSpinning(true);
    setPicked(null);
    const final = labels[Math.floor(Math.random() * labels.length)];
    intervalRef.current = window.setInterval(() => setTick((t) => t + 1), 80);
    timerRef.current = window.setTimeout(() => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      setSpinning(false);
      setPicked(final);
    }, 1800);
  };

  const flickerLabel = labels[tick % labels.length];

  return (
    <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-card rounded-3xl shadow-lift p-8 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-9 w-9 rounded-full hover:bg-secondary flex items-center justify-center"
          aria-label="Zamknij"
        >
          <X weight="bold" />
        </button>

        <h2 className="font-display text-3xl text-primary mb-2">
          {isNumbers ? "Numer z dziennika" : "Kto teraz odkrywa?"}
        </h2>
        <p className="text-muted-foreground mb-6">
          {isNumbers
            ? `Losowanie z zakresu ${numberRange!.from}–${numberRange!.to}.`
            : "Kliknij, aby wylosować Odkrywacza."}
        </p>

        <div className="relative h-48 flex items-center justify-center mb-6 overflow-hidden">
          {!picked ? (
            <div
              className={
                "font-display text-primary " +
                (isNumbers ? "text-7xl md:text-8xl " : "text-4xl ") +
                (spinning ? "animate-pulse-soft" : "")
              }
            >
              {spinning ? (
                isNumbers ? (
                  <span className="inline-flex items-center gap-2">
                    <Hash weight="duotone" className="h-10 w-10 text-accent" />
                    {flickerLabel}
                  </span>
                ) : (
                  flickerLabel
                )
              ) : isNumbers ? (
                <Hash weight="duotone" className="h-20 w-20 text-muted-foreground" />
              ) : (
                "🎲"
              )}
            </div>
          ) : (
            <div className="animate-scale-in flex flex-col items-center gap-3">
              <Confetti weight="duotone" className="h-12 w-12 text-accent" />
              <div className={"font-display text-primary " + (isNumbers ? "text-8xl" : "text-5xl")}>
                {isNumbers ? `Nr ${picked}` : picked}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          {!picked ? (
            <Button size="lg" onClick={spin} disabled={spinning} className="rounded-full px-8">
              {spinning ? "Losuję…" : "Losuj"}
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                variant="outline"
                onClick={spin}
                className="rounded-full px-6"
              >
                Losuj ponownie
              </Button>
              <Button
                size="lg"
                onClick={() =>
                  onPicked(
                    isNumbers
                      ? `Nr ${picked}`
                      : names.length > 0
                      ? picked!
                      : undefined,
                  )
                }
                className="rounded-full px-8"
              >
                Zaczynamy!
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
