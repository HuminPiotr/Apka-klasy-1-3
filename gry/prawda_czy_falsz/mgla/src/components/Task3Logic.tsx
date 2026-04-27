import { useState } from "react";

interface Task3LogicProps {
  onComplete: () => void;
}

const CHILDREN = ["Ania", "Bartek", "Kasia"] as const;
type Child = (typeof CHILDREN)[number];

const ACCESSORIES = ["Smycz", "Akwarium", "Klatka"];
const ANIMALS = ["Pies 🐕", "Rybka 🐟", "Chomik 🐹"];

const CORRECT: Record<Child, { accessory: string; animal: string }> = {
  Ania: { accessory: "Klatka", animal: "Chomik 🐹" },
  Bartek: { accessory: "Akwarium", animal: "Rybka 🐟" },
  Kasia: { accessory: "Smycz", animal: "Pies 🐕" },
};

const CLUES = [
  "🔍 Bartek nie potrzebuje ani klatki, ani smyczy.",
  "🔍 Kasia kupiła nową smycz.",
  "🔍 Osoba, która ma klatkę, opiekuje się chomikiem.",
];

type RowState = { accessory: string; animal: string };
type CheckState = "idle" | "correct" | "wrong";

const CONFETTI_COLORS = ["#FFB800", "#3498DB", "#27AE60", "#764ba2", "#FF8C00"];

const Task3Logic = ({ onComplete }: Task3LogicProps) => {
  const [rows, setRows] = useState<Record<Child, RowState>>({
    Ania: { accessory: "", animal: "" },
    Bartek: { accessory: "", animal: "" },
    Kasia: { accessory: "", animal: "" },
  });
  const [checked, setChecked] = useState<CheckState>("idle");
  const [wrongRows, setWrongRows] = useState<Child[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const updateRow = (child: Child, field: "accessory" | "animal", value: string) => {
    setChecked("idle");
    setWrongRows([]);
    setRows((prev) => ({ ...prev, [child]: { ...prev[child], [field]: value } }));
  };

  const handleCheck = () => {
    const bad = CHILDREN.filter((child) => {
      const r = rows[child];
      const c = CORRECT[child];
      return r.accessory !== c.accessory || r.animal !== c.animal;
    });
    if (bad.length === 0) {
      setChecked("correct");
      setShowConfetti(true);
      setTimeout(() => {
        onComplete();
      }, 2500);
    } else {
      setChecked("wrong");
      setWrongRows(bad as Child[]);
    }
  };

  const handleReset = () => {
    setRows({
      Ania: { accessory: "", animal: "" },
      Bartek: { accessory: "", animal: "" },
      Kasia: { accessory: "", animal: "" },
    });
    setChecked("idle");
    setWrongRows([]);
  };

  const allFilled = CHILDREN.every((c) => rows[c].accessory && rows[c].animal);

  return (
    <div className="card-bordered p-6 animate-fade-in relative overflow-hidden">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                animationDelay: `${Math.random() * 0.6}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      <h2 className="text-xl font-extrabold mb-4">
        🔍 Zadanie 3 z 3 — Dopasuj do dzieci ich akcesoria oraz zwierzaki
      </h2>

      {/* Clues */}
      <div
        className="card-bordered p-4 mb-6"
        style={{ background: "hsl(var(--muted))", border: "2px solid hsl(var(--foreground)/0.3)" }}
      >
        {CLUES.map((clue, i) => (
          <p key={i} className="text-sm font-semibold mb-1 last:mb-0">
            {clue}
          </p>
        ))}
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-3 mb-5">
        {CHILDREN.map((child) => {
          const isWrong = wrongRows.includes(child);
          const usedAccessories = CHILDREN.filter((c) => c !== child).map((c) => rows[c].accessory);
          const usedAnimals = CHILDREN.filter((c) => c !== child).map((c) => rows[c].animal);

          return (
            <div
              key={child}
              className="flex items-center gap-3"
              style={{
                padding: "0.75rem 1rem",
                borderRadius: 12,
                border: `2px solid ${isWrong ? "hsl(var(--destructive))" : "hsl(var(--foreground))"}`,
                background: isWrong ? "hsl(var(--destructive) / 0.08)" : "white",
                transition: "border-color 0.3s, background 0.3s",
              }}
            >
              <span className="font-extrabold text-base w-14 shrink-0">{child}</span>
              <select
                value={rows[child].accessory}
                onChange={(e) => updateRow(child, "accessory", e.target.value)}
                disabled={checked === "correct"}
                className="flex-1 rounded-lg px-2 py-2 font-semibold text-sm bg-white"
                style={{ border: "2px solid hsl(var(--foreground)/0.3)" }}
              >
                <option value="">Akcesorium ▼</option>
                {ACCESSORIES.map((a) => (
                  <option key={a} value={a} disabled={usedAccessories.includes(a)}>
                    {a}
                  </option>
                ))}
              </select>
              <select
                value={rows[child].animal}
                onChange={(e) => updateRow(child, "animal", e.target.value)}
                disabled={checked === "correct"}
                className="flex-1 rounded-lg px-2 py-2 font-semibold text-sm bg-white"
                style={{ border: "2px solid hsl(var(--foreground)/0.3)" }}
              >
                <option value="">Zwierzę ▼</option>
                {ANIMALS.map((a) => (
                  <option key={a} value={a} disabled={usedAnimals.includes(a)}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {/* Status */}
      <div className="h-7 text-center font-bold mb-4 text-sm">
        {checked === "wrong" && (
          <span style={{ color: "hsl(var(--destructive))" }}>
            Coś nie gra! Spróbujcie jeszcze raz 💪
          </span>
        )}
        {checked === "correct" && (
          <span style={{ color: "hsl(var(--behavior))" }}>
            ✅ Brawo! Rozwiązaliście zagadkę! 🎉
          </span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={handleCheck}
          disabled={!allFilled || checked === "correct"}
          className="btn-primary-dark px-6 py-3 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          ✔️ Sprawdź odpowiedź
        </button>
        <button
          onClick={handleReset}
          className="btn-pill px-6 py-3 hover:scale-105"
          style={{
            background: "hsl(var(--selected))",
            color: "hsl(var(--foreground))",
            border: "2px solid hsl(var(--foreground))",
          }}
        >
          🔄 Reset zagadki
        </button>
      </div>
    </div>
  );
};

export default Task3Logic;
