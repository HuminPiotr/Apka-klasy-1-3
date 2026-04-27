import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from "@/game/storage";
import type { Difficulty, GameSettings, Grade, MathRange, TeamColor } from "@/game/types";
import { cn } from "@/lib/utils";

const TEAM_COLORS: { id: TeamColor; bg: string; label: string }[] = [
  { id: "red", bg: "bg-team-red", label: "Czerwony" },
  { id: "blue", bg: "bg-team-blue", label: "Niebieski" },
  { id: "green", bg: "bg-team-green", label: "Zielony" },
  { id: "orange", bg: "bg-team-orange", label: "Pomarańcz" },
  { id: "purple", bg: "bg-team-purple", label: "Fioletowy" },
  { id: "teal", bg: "bg-team-teal", label: "Morski" },
];

function ChipGroup<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded-full cartoon-border px-4 py-2 font-display text-base transition-transform hover:-translate-y-0.5",
            value === o.id
              ? "bg-primary text-primary-foreground cartoon-shadow"
              : "bg-card text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ColorPicker({
  value,
  onChange,
  exclude,
}: {
  value: TeamColor;
  onChange: (c: TeamColor) => void;
  exclude?: TeamColor;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {TEAM_COLORS.filter((c) => c.id !== exclude).map((c) => (
        <button
          key={c.id}
          type="button"
          aria-label={c.label}
          onClick={() => onChange(c.id)}
          className={cn(
            "h-10 w-10 rounded-full cartoon-border transition-transform hover:scale-110",
            c.bg,
            value === c.id && "ring-4 ring-foreground ring-offset-2 ring-offset-background",
          )}
        />
      ))}
    </div>
  );
}

const Index = () => {
  const navigate = useNavigate();
  const [s, setS] = useState<GameSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setS(loadSettings());
  }, []);

  const start = () => {
    saveSettings(s);
    navigate("/play");
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl">
        {/* Hero */}
        <header className="mb-8 text-center">
          <div className="mb-2 inline-block rounded-2xl stripe-bg px-6 py-2 cartoon-border cartoon-shadow">
            <span className="font-display text-xl text-foreground">🏗️ PLAC BUDOWY 🏗️</span>
          </div>
          <h1 className="text-stroke-lg text-5xl text-primary md:text-6xl">
            ARCHITEKCI NA CZAS
          </h1>
          <p className="mt-3 font-display text-lg text-muted-foreground">
            Gra matematyczno-geometryczna dla klas 1–3
          </p>
        </header>

        <div className="grid gap-5 rounded-3xl bg-card p-6 cartoon-border-thick cartoon-shadow-lg md:p-8">
          <h2 className="font-display text-3xl">⚙️ Ustawienia gry</h2>

          {/* Zakres */}
          <section className="grid gap-2">
            <Label className="font-display text-lg">Zakres działań</Label>
            <ChipGroup<MathRange>
              value={s.range}
              onChange={(v) => setS({ ...s, range: v })}
              options={[
                { id: "add20", label: "➕ Dodawanie do 20" },
                { id: "mul50", label: "✖️ Mnożenie do 50" },
                { id: "mix", label: "🎲 Mix" },
              ]}
            />
          </section>

          <section className="grid gap-2">
            <Label className="font-display text-lg">Czas gry</Label>
            <ChipGroup<"3" | "5" | "7">
              value={String(s.durationMin) as "3" | "5" | "7"}
              onChange={(v) => setS({ ...s, durationMin: Number(v) as 3 | 5 | 7 })}
              options={[
                { id: "3", label: "⏱️ 3 min" },
                { id: "5", label: "⏱️ 5 min" },
                { id: "7", label: "⏱️ 7 min" },
              ]}
            />
          </section>

          <section className="grid gap-2">
            <Label className="font-display text-lg">Trudność klocków</Label>
            <ChipGroup<Difficulty>
              value={s.difficulty}
              onChange={(v) => setS({ ...s, difficulty: v })}
              options={[
                { id: "easy", label: "🟢 Łatwa (6)" },
                { id: "medium", label: "🟡 Średnia (8)" },
                { id: "hard", label: "🔴 Trudna (10)" },
              ]}
            />
          </section>

          <section className="grid gap-2">
            <Label className="font-display text-lg">Klasa</Label>
            <ChipGroup<Grade>
              value={s.grade}
              onChange={(v) => setS({ ...s, grade: v })}
              options={[
                { id: "2", label: "Klasa 2 (8s, podpowiedzi)" },
                { id: "3", label: "Klasa 3 (5s, bez podpowiedzi)" },
              ]}
            />
          </section>

          <section className="grid gap-2">
            <Label className="font-display text-lg">Freeze Frame (rozgrzewka)</Label>
            <ChipGroup<"on" | "off">
              value={s.freezeFrame ? "on" : "off"}
              onChange={(v) => setS({ ...s, freezeFrame: v === "on" })}
              options={[
                { id: "on", label: "❄️ Włączony" },
                { id: "off", label: "Wyłączony" },
              ]}
            />
          </section>

          {/* Drużyny */}
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-background p-4 cartoon-border">
              <Label className="font-display text-lg">🔴 Drużyna A</Label>
              <Input
                value={s.teamA.name}
                onChange={(e) => setS({ ...s, teamA: { ...s.teamA, name: e.target.value } })}
                className="mt-2 cartoon-border bg-card font-display text-base"
                maxLength={20}
              />
              <div className="mt-3">
                <ColorPicker
                  value={s.teamA.color}
                  exclude={s.teamB.color}
                  onChange={(c) => setS({ ...s, teamA: { ...s.teamA, color: c } })}
                />
              </div>
            </div>
            <div className="rounded-2xl bg-background p-4 cartoon-border">
              <Label className="font-display text-lg">🔵 Drużyna B</Label>
              <Input
                value={s.teamB.name}
                onChange={(e) => setS({ ...s, teamB: { ...s.teamB, name: e.target.value } })}
                className="mt-2 cartoon-border bg-card font-display text-base"
                maxLength={20}
              />
              <div className="mt-3">
                <ColorPicker
                  value={s.teamB.color}
                  exclude={s.teamA.color}
                  onChange={(c) => setS({ ...s, teamB: { ...s.teamB, color: c } })}
                />
              </div>
            </div>
          </section>

          <Button
            onClick={start}
            className="mt-2 h-16 rounded-2xl bg-primary text-2xl font-display text-primary-foreground cartoon-border cartoon-shadow-lg hover:-translate-y-1 hover:bg-primary"
          >
            ▶ START
          </Button>
        </div>

        <p className="mt-6 text-center font-display text-sm text-muted-foreground">
          Wskazówka: nauczyciel klika odpowiedzi za drużynę, którą wskazują dzieci.
        </p>
      </div>
    </div>
  );
};

export default Index;
