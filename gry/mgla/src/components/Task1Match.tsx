import { useMemo, useState } from "react";

interface MatchSet {
  verbs: [string, string];
  behaviors: [string, string];
  /** Correct mapping: index of verb -> index of behavior */
  correct: [number, number];
}

const SETS: MatchSet[] = [
  {
    verbs: ["Słuchać", "Szanować"],
    behaviors: ["Nauczyciela", "Kolegów"],
    correct: [0, 1],
  },
  {
    verbs: ["Podnieść", "Sprzątać"],
    behaviors: ["Rękę", "Klasę"],
    correct: [0, 1],
  },
  {
    verbs: ["Dzielić się", "Mówić"],
    behaviors: ["Zabawkami", "Prawdę"],
    correct: [0, 1],
  },
  {
    verbs: ["Pomagać", "Dotrzymywać"],
    behaviors: ["Innym", "Słowa"],
    correct: [0, 1],
  },
];

interface Task1Props {
  onComplete: () => void;
}

type Status = "idle" | "correct" | "wrong";

const Task1Match = ({ onComplete }: Task1Props) => {
  // Shuffle set order and independently shuffle verbs & behaviors within each set
  const orderedSets = useMemo(() => {
    const arr = [...SETS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.map((set) => {
      // For 2 items: randomly decide whether to swap each column
      const swapVerbs = Math.random() < 0.5;
      const swapBehaviors = Math.random() < 0.5;
      const verbOrder: [number, number] = swapVerbs ? [1, 0] : [0, 1];
      const behaviorOrder: [number, number] = swapBehaviors ? [1, 0] : [0, 1];
      const shuffledVerbs: [string, string] = [set.verbs[verbOrder[0]], set.verbs[verbOrder[1]]];
      const shuffledBehaviors: [string, string] = [set.behaviors[behaviorOrder[0]], set.behaviors[behaviorOrder[1]]];
      // Remap correct: newCorrect[newVerbIdx] = newBehaviorIdx
      const newCorrect: [number, number] = [0, 1].map((newVi) => {
        const oldVi = verbOrder[newVi];
        const oldBi = set.correct[oldVi];
        return behaviorOrder.indexOf(oldBi);
      }) as [number, number];
      return { ...set, verbs: shuffledVerbs, behaviors: shuffledBehaviors, correct: newCorrect };
    });
  }, []);

  const [setIndex, setSetIndex] = useState(0);
  const [selectedVerb, setSelectedVerb] = useState<number | null>(null);
  const [selectedBehavior, setSelectedBehavior] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const current = orderedSets[setIndex];
  const total = orderedSets.length;

  const handleVerb = (i: number) => {
    if (status !== "idle") return;
    setSelectedVerb(i);
    if (selectedBehavior !== null) {
      evaluate(i, selectedBehavior);
    }
  };

  const handleBehavior = (i: number) => {
    if (status !== "idle") return;
    setSelectedBehavior(i);
    if (selectedVerb !== null) {
      evaluate(selectedVerb, i);
    }
  };

  const evaluate = (vi: number, bi: number) => {
    const isCorrect = current.correct[vi] === bi;
    if (isCorrect) {
      setStatus("correct");
      setTimeout(() => {
        if (setIndex + 1 >= total) {
          onComplete();
        } else {
          setSetIndex((s) => s + 1);
          setSelectedVerb(null);
          setSelectedBehavior(null);
          setStatus("idle");
        }
      }, 800);
    } else {
      setStatus("wrong");
      setTimeout(() => {
        setSelectedVerb(null);
        setSelectedBehavior(null);
        setStatus("idle");
      }, 1000);
    }
  };

  const verbClass = (i: number) => {
    const selected = selectedVerb === i;
    if (status === "correct" && selected) return "btn-verb btn-correct animate-check-out";
    if (status === "wrong" && selected) return "btn-verb btn-wrong animate-shake";
    if (selected) return "btn-verb btn-selected";
    return "btn-verb hover:scale-105";
  };

  const behaviorClass = (i: number) => {
    const selected = selectedBehavior === i;
    if (status === "correct" && selected) return "btn-behavior btn-correct animate-check-out";
    if (status === "wrong" && selected) return "btn-behavior btn-wrong animate-shake";
    if (selected) return "btn-behavior btn-selected";
    return "btn-behavior hover:scale-105";
  };

  return (
    <div className="card-bordered p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-extrabold">🧩 Zadanie 1 z 3 — Właściwy Wybór</h2>
        <span
          className="px-4 py-1 rounded-full text-sm font-bold"
          style={{
            background: "hsl(var(--selected))",
            color: "hsl(var(--foreground))",
            border: "2px solid hsl(var(--foreground))",
          }}
        >
          Zestaw {setIndex + 1} z {total}
        </span>
      </div>
      <p className="text-lg font-semibold mb-6 text-muted-foreground">
        Połączcie czasowniki z dobrymi zachowaniami!
      </p>

      <div
        key={setIndex}
        className="grid grid-cols-2 gap-x-12 gap-y-4 animate-pop-in"
      >
        {/* Verbs left */}
        <div className="flex flex-col gap-4">
          {current.verbs.map((v, i) => (
            <button
              key={v}
              onClick={() => handleVerb(i)}
              className={verbClass(i)}
              disabled={status !== "idle"}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Behaviors right */}
        <div className="flex flex-col gap-4">
          {current.behaviors.map((b, i) => (
            <button
              key={b}
              onClick={() => handleBehavior(i)}
              className={behaviorClass(i)}
              disabled={status !== "idle"}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 h-6 text-center font-bold">
        {status === "correct" && (
          <span style={{ color: "hsl(var(--behavior))" }}>✅ Świetnie!</span>
        )}
        {status === "wrong" && (
          <span style={{ color: "hsl(var(--destructive))" }}>
            Spróbujcie jeszcze raz! 💪
          </span>
        )}
      </div>
    </div>
  );
};

export default Task1Match;
