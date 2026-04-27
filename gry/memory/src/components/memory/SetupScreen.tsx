import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GAME_MODES, getAvailableLetters, getPairsForMode } from "@/game/data";
import type { GameModeId, PlayerSelectionMode } from "@/game/types";
import { pickGrid } from "@/game/engine";
import { cn } from "@/lib/utils";
import * as Phosphor from "@phosphor-icons/react";
import { Play, ArrowRight, Shuffle, GraduationCap } from "@phosphor-icons/react";

interface SetupScreenProps {
  onStart: (config: {
    modeId: GameModeId;
    selectedLetters: string[];
    flashDurationSec: number;
    playerSelectionMode: PlayerSelectionMode;
    numberRangeFrom?: number;
    numberRangeTo?: number;
  }) => void;
}

function ModeIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Phosphor as unknown as Record<string, React.ComponentType<{ weight?: string; className?: string }>>)[name];
  return Icon ? <Icon weight="duotone" className={className} /> : null;
}

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [modeId, setModeId] = useState<GameModeId>("upper_lower");
  const [selected, setSelected] = useState<string[]>(["A", "B", "K", "M", "S", "T"]);
  const [flash, setFlash] = useState(5);
  const [playerMode, setPlayerMode] = useState<PlayerSelectionMode>("numbers");
  const [numFrom, setNumFrom] = useState(1);
  const [numTo, setNumTo] = useState(24);

  const available = useMemo(() => getAvailableLetters(modeId), [modeId]);
  const pairs = useMemo(() => getPairsForMode(modeId), [modeId]);

  const validSelected = selected.filter((l) => available.includes(l));
  const grid = validSelected.length >= 2 ? pickGrid(validSelected.length) : null;

  const toggle = (l: string) => {
    setSelected((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l],
    );
  };

  const quickPick = (n: number) => {
    const shuffled = [...available].sort(() => Math.random() - 0.5).slice(0, n);
    setSelected(shuffled);
  };

  const canStart = validSelected.length >= 2;

  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="text-center space-y-3 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10">
            <GraduationCap weight="duotone" className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary/80">Edukacja wczesnoszkolna · klasy 1–3</span>
          </div>
          <h1 className="text-5xl md:text-6xl text-primary">Literowe Memory</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Cała klasa gra naraz. Jedno dziecko odkrywa, reszta zapamiętuje i podpowiada.
          </p>
        </header>

        {/* Tryb */}
        <section className="space-y-3 animate-fade-in">
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground px-1">
            1. Wybierz tryb gry
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GAME_MODES.map((m) => {
              const active = m.id === modeId;
              return (
                <button
                  key={m.id}
                  onClick={() => setModeId(m.id)}
                  className={cn(
                    "text-left p-5 rounded-2xl border-2 transition-all bg-card",
                    "hover:-translate-y-0.5 shadow-paper",
                    active
                      ? "border-primary ring-4 ring-primary/10"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center",
                        active ? "bg-primary text-primary-foreground" : "bg-secondary text-primary",
                      )}
                    >
                      <ModeIcon name={m.iconName} className="h-7 w-7" />
                    </div>
                    <span className="text-xs text-muted-foreground">{m.tagline}</span>
                  </div>
                  <h3 className="text-xl font-display text-primary">{m.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{m.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Litery */}
        <section className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground px-1">
              2. Wybierz {modeId === "syllables" ? "słowa" : "litery"} ({validSelected.length})
            </h2>
            <div className="flex gap-2">
              {[4, 6, 8].map((n) => (
                <Button
                  key={n}
                  variant="outline"
                  size="sm"
                  onClick={() => quickPick(n)}
                  className="rounded-full"
                >
                  <Shuffle weight="bold" className="h-3.5 w-3.5" />
                  {n} losowych
                </Button>
              ))}
            </div>
          </div>
          <Card className="p-4 md:p-5 shadow-paper">
            <div className="flex flex-wrap gap-2">
              {pairs.map((p) => {
                const isOn = selected.includes(p.letterGroup);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggle(p.letterGroup)}
                    className={cn(
                      "min-w-[52px] h-12 px-3 rounded-xl font-school text-xl border-2 transition-all",
                      isOn
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-secondary text-foreground border-border hover:border-primary/40",
                    )}
                    title={p.displayLabel}
                  >
                    {p.letterGroup}
                  </button>
                );
              })}
            </div>
          </Card>
        </section>

        {/* Opcje */}
        <section className="grid md:grid-cols-2 gap-4 animate-fade-in">
          <Card className="p-5 shadow-paper space-y-3">
            <h3 className="font-display text-lg text-primary">Wybór Odkrywacza</h3>
            <div className="grid grid-cols-3 gap-2">
              {(["numbers", "manual", "queue"] as PlayerSelectionMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setPlayerMode(m)}
                  className={cn(
                    "py-2 rounded-lg text-sm border-2 transition-all",
                    playerMode === m
                      ? "border-primary bg-primary/5 text-primary font-semibold"
                      : "border-border bg-secondary hover:border-primary/40",
                  )}
                >
                  {m === "numbers"
                    ? "Z dziennika"
                    : m === "manual"
                    ? "Ręcznie"
                    : "Po kolei"}
                </button>
              ))}
            </div>
            {playerMode === "numbers" && (
              <div className="pt-2 space-y-2">
                <p className="text-xs text-muted-foreground">
                  Podaj zakres numerów z dziennika — system wylosuje numer dziecka.
                </p>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">od</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={numFrom}
                    onChange={(e) => setNumFrom(Math.max(1, Number(e.target.value) || 1))}
                    className="w-20 h-10 px-3 rounded-lg border-2 border-border bg-card text-center font-display text-lg focus:border-primary outline-none"
                  />
                  <label className="text-sm text-muted-foreground">do</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={numTo}
                    onChange={(e) => setNumTo(Math.max(1, Number(e.target.value) || 1))}
                    className="w-20 h-10 px-3 rounded-lg border-2 border-border bg-card text-center font-display text-lg focus:border-primary outline-none"
                  />
                </div>
              </div>
            )}
          </Card>
          <Card className="p-5 shadow-paper space-y-3">
            <h3 className="font-display text-lg text-primary">
              Czas flashu startowego: <span className="text-accent">{flash}s</span>
            </h3>
            <input
              type="range"
              min={3}
              max={10}
              value={flash}
              onChange={(e) => setFlash(Number(e.target.value))}
              className="w-full accent-[hsl(var(--accent))]"
            />
            <p className="text-xs text-muted-foreground">
              Karty są odkryte tyle sekund — klasa zapamiętuje rozmieszczenie.
            </p>
          </Card>
        </section>

        {/* Start */}
        <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
          <div className="text-sm text-muted-foreground">
            {grid ? (
              <>
                Plansza:{" "}
                <span className="font-semibold text-foreground">
                  {grid.cols} × {grid.rows}
                </span>{" "}
                ({validSelected.length * 2} kart)
              </>
            ) : (
              "Wybierz co najmniej 2 pary"
            )}
          </div>
          <Button
            size="lg"
            disabled={!canStart}
            onClick={() =>
              onStart({
                modeId,
                selectedLetters: validSelected,
                flashDurationSec: flash,
                playerSelectionMode: playerMode,
                numberRangeFrom: playerMode === "numbers" ? Math.min(numFrom, numTo) : undefined,
                numberRangeTo: playerMode === "numbers" ? Math.max(numFrom, numTo) : undefined,
              })
            }
            className="rounded-full px-8 h-14 text-base shadow-lift"
          >
            <Play weight="fill" className="h-5 w-5" />
            Rozpocznij grę
            <ArrowRight weight="bold" className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
