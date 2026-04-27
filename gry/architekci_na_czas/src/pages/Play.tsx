import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tower } from "@/components/game/Tower";
import { BlockChoice } from "@/components/game/BlockChoice";
import { Confetti } from "@/components/game/Confetti";
import { loadSettings, FUN_FACTS } from "@/game/storage";
import { generateQuestion, answerTimeSec } from "@/game/math";
import {
  availableBlocks,
  BLOCK_LABELS,
  EDGE_ICON,
  EDGE_LABEL,
  TOP_EDGE,
  BOTTOM_EDGE,
  evaluateFit,
  fitPoints,
  fitStabilityDelta,
  blockBonusPoints,
  blockStabilityBonus,
  STABILITY_DECAY_PER_BLOCK,
  FIT_LABEL,
  BLOCK_WIDTH,
} from "@/game/blocks";
import { sfx } from "@/game/sfx";
import type { BlockShape, FitResult, GamePhase, MathQuestion, Team, TeamId } from "@/game/types";
import { cn } from "@/lib/utils";

const TEAM_BG: Record<string, string> = {
  red: "bg-team-red text-team-red-foreground",
  blue: "bg-team-blue text-team-blue-foreground",
  green: "bg-team-green text-white",
  orange: "bg-team-orange text-white",
  purple: "bg-team-purple text-white",
  teal: "bg-team-teal text-white",
};
const TEAM_BG_SOFT: Record<string, string> = {
  red: "bg-team-red/15",
  blue: "bg-team-blue/15",
  green: "bg-team-green/15",
  orange: "bg-team-orange/15",
  purple: "bg-team-purple/15",
  teal: "bg-team-teal/15",
};

const Play = () => {
  const navigate = useNavigate();
  const settings = useRef(loadSettings()).current;

  const [teams, setTeams] = useState<Record<TeamId, Team>>({
    A: { id: "A", name: settings.teamA.name, color: settings.teamA.color, blocks: [], score: 0, stability: 100 },
    B: { id: "B", name: settings.teamB.name, color: settings.teamB.color, blocks: [], score: 0, stability: 100 },
  });

  const [active, setActive] = useState<TeamId>("A");
  const [phase, setPhase] = useState<GamePhase>(settings.freezeFrame ? "freeze" : "question");
  const [question, setQuestion] = useState<MathQuestion>(() => generateQuestion(settings.range, settings.grade));
  const [secondsLeft, setSecondsLeft] = useState(settings.durationMin * 60);
  const [paused, setPaused] = useState(false);
  const [answerSec, setAnswerSec] = useState(answerTimeSec(settings.grade));
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [collapsing, setCollapsing] = useState<TeamId | null>(null);
  const [wobbling, setWobbling] = useState<TeamId | null>(null);
  const [shushing, setShushing] = useState(false);
  const [showHint, setShowHint] = useState(settings.grade === "2");
  const [freezePhase, setFreezePhase] = useState<"intro" | "count" | "freeze" | "ready">("intro");
  const [winner, setWinner] = useState<TeamId | "tie" | null>(null);
  const [funFact] = useState(() => FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]);
  const [lastFit, setLastFit] = useState<FitResult | null>(null);
  const [blockChoices, setBlockChoices] = useState<BlockShape[]>([]);
  const [recentEventA, setRecentEventA] = useState<"click" | "wobble" | "fall" | null>(null);
  const [recentEventB, setRecentEventB] = useState<"click" | "wobble" | "fall" | null>(null);
  // Fizyczny kąt odchylenia wieży (stopnie, bez znaku — Tower nadaje znak po stronie). 0..30+.
  const [angleA, setAngleA] = useState(0);
  const [angleB, setAngleB] = useState(0);
  const [sparksA, setSparksA] = useState(false);
  const [sparksB, setSparksB] = useState(false);

  /** Próg zawalenia w stopniach. */
  const COLLAPSE_ANGLE = 15;

  function flashEvent(team: TeamId, ev: "click" | "wobble" | "fall") {
    const setter = team === "A" ? setRecentEventA : setRecentEventB;
    setter(ev);
    setTimeout(() => setter(null), 1200);
  }

  function flashSparks(team: TeamId) {
    const setter = team === "A" ? setSparksA : setSparksB;
    setter(true);
    setTimeout(() => setter(false), 800);
  }

  /**
   * Silnik złączeń — zwraca jak nowy klocek wpływa na bieżący kąt wieży.
   *  - LOCKED      = idealne dopasowanie (CLICK!) → redukcja kąta o 80%
   *  - SOLID_REST  = FLAT na FLAT, nowy ≤ stary  → tłumienie (×0.8), bez dodawania kąta
   *  - OVERHANG    = FLAT na FLAT, nowy > stary  → +3° proporcjonalnie do nawisu
   *  - FRICTION    = inne neutralne (OK)         → +1° lekko
   *  - PIVOT       = WOBBLE/FALL                 → +8° i mocna sprężyna
   */
  type JointType = "LOCKED" | "SOLID_REST" | "OVERHANG" | "FRICTION" | "PIVOT";
  function jointDelta(
    fit: FitResult,
    top: BlockShape | null,
    next: BlockShape,
  ): { type: JointType; angleAdd: number; angleMul: number } {
    if (fit === "click") return { type: "LOCKED", angleAdd: 0, angleMul: 0.2 };

    // Pusta wieża + płaska dolna krawędź = stabilny fundament (jak na podłodze)
    if (top === null && BOTTOM_EDGE_IS_FLAT(next)) {
      return { type: "SOLID_REST", angleAdd: 0, angleMul: 0.8 };
    }

    // Płaska krawędź na płaskiej (lub wklęsła na płaskiej) — zawsze stabilne, niezależnie od szerokości.
    // Realna wieża nie chwieje się tylko dlatego, że kładziemy szerszy klocek na węższym, jeśli oba mają płaskie powierzchnie styku.
    if (
      fit === "ok" &&
      top !== null &&
      TOP_EDGE[top] === "flat" &&
      (BOTTOM_EDGE[next] === "flat" || BOTTOM_EDGE[next] === "notch")
    ) {
      return { type: "SOLID_REST", angleAdd: 0, angleMul: 0.8 };
    }

    if (fit === "ok") return { type: "FRICTION", angleAdd: 1, angleMul: 1 };
    return { type: "PIVOT", angleAdd: 8, angleMul: 1 }; // wobble + fall
  }

  // Pomocnik: dolna krawędź klocka jest płaska?
  function BOTTOM_EDGE_IS_FLAT(b: BlockShape): boolean {
    return BOTTOM_EDGE[b] === "flat";
  }

  const palette = availableBlocks(settings.difficulty);

  /** Wybierz 3 losowe klocki z paletki, gwarantując ≥1 dobry (click/ok) na danej górze wieży. */
  function pickChoices(top: BlockShape | null): BlockShape[] {
    const all = [...palette];
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    const good = all.filter((b) => {
      const f = evaluateFit(top, b);
      return f === "click" || f === "ok";
    });
    const pickSize = Math.min(3, all.length);
    if (good.length === 0) return all.slice(0, pickSize);
    const guaranteed = good[0];
    const rest = all.filter((b) => b !== guaranteed).slice(0, pickSize - 1);
    const result = [guaranteed, ...rest];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  // Główny timer gry
  useEffect(() => {
    if (phase === "ended" || phase === "freeze" || paused) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          endGame();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, paused]);

  // Odliczanie do odpowiedzi
  useEffect(() => {
    if (phase !== "question" || paused) return;
    setAnswerSec(answerTimeSec(settings.grade));
    const id = setInterval(() => {
      setAnswerSec((s) => {
        if (s <= 1) {
          clearInterval(id);
          handleAnswerTimeout();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, active, paused, question]);

  // Freeze Frame intro
  useEffect(() => {
    if (phase !== "freeze") return;
    if (freezePhase === "intro") {
      const t = setTimeout(() => setFreezePhase("count"), 1500);
      return () => clearTimeout(t);
    }
    if (freezePhase === "count") {
      let n = 3;
      sfx.countdown();
      const id = setInterval(() => {
        n -= 1;
        if (n > 0) sfx.countdown();
        if (n <= 0) {
          clearInterval(id);
          sfx.freeze();
          setFreezePhase("freeze");
          setTimeout(() => setFreezePhase("ready"), 1500);
        }
      }, 900);
      return () => clearInterval(id);
    }
  }, [phase, freezePhase]);

  function endGame() {
    setPhase("ended");
    const a = teams.A.score;
    const b = teams.B.score;
    setWinner(a === b ? "tie" : a > b ? "A" : "B");
    sfx.win();
  }

  function nextTurn(switchTeam: boolean) {
    setShowHint(settings.grade === "2");
    setFeedback(null);
    setLastFit(null);
    if (switchTeam) setActive((t) => (t === "A" ? "B" : "A"));
    setQuestion(generateQuestion(settings.range, settings.grade));
    setPhase("question");
  }

  function handleAnswerTimeout() {
    sfx.boing();
    setFeedback("wrong");
    setTimeout(() => nextTurn(true), 800);
  }

  function chooseAnswer(opt: number) {
    if (phase !== "question") return;
    if (opt === question.answer) {
      sfx.ding();
      setFeedback("correct");
      setTimeout(() => {
        setFeedback(null);
        const team = teams[active];
        const top = team.blocks[team.blocks.length - 1] ?? null;
        setBlockChoices(pickChoices(top));
        setPhase("block");
      }, 600);
    } else {
      sfx.boing();
      setFeedback("wrong");
      setTimeout(() => nextTurn(true), 800);
    }
  }

  function chooseBlock(b: BlockShape) {
    if (phase !== "block") return;
    const team = teams[active];
    const top = team.blocks[team.blocks.length - 1] ?? null;
    const fit = evaluateFit(top, b);

    setLastFit(fit);

    // Stabilność (pasek 0..100) — zostaje jako wskaźnik dla nauczyciela
    const delta = fitStabilityDelta(fit);
    const decay = STABILITY_DECAY_PER_BLOCK;
    const bonus = blockStabilityBonus(b);
    const projectedStab = team.stability + delta - decay + bonus;

    // Silnik złączeń → nowy kąt odchylenia wieży
    const joint = jointDelta(fit, top, b);
    const currentAngle = active === "A" ? angleA : angleB;
    const setAngle = active === "A" ? setAngleA : setAngleB;
    // OVERHANG/FRICTION rosną odrobinę szybciej, gdy wieża jest wyższa (większy moment)
    const heightBoost =
      joint.type === "OVERHANG" || joint.type === "FRICTION"
        ? Math.min(2, team.blocks.length * 0.2)
        : 0;
    const projectedAngle = currentAngle * joint.angleMul + joint.angleAdd + heightBoost;

    // Czy wieża pada? — fall LUB kąt przekroczył próg LUB stabilność spadła do 0
    const willFall = fit === "fall" || projectedAngle >= COLLAPSE_ANGLE || projectedStab <= 0;

    if (!willFall && fit === "click") {
      // LOCKED — sztywne złącze
      sfx.lock();
      flashEvent(active, "click");
      flashSparks(active);
      setAngle(projectedAngle);
      setTeams((prev) => {
        const t = prev[active];
        return {
          ...prev,
          [active]: {
            ...t,
            blocks: [...t.blocks, b],
            score: t.score + fitPoints(fit) + blockBonusPoints(b),
            stability: Math.max(0, Math.min(100, projectedStab)),
          },
        };
      });
      setTimeout(() => nextTurn(true), 700);
    } else if (!willFall && fit === "ok") {
      // FRICTION — głuchy "tup"
      sfx.tap();
      setAngle(projectedAngle);
      setTeams((prev) => {
        const t = prev[active];
        return {
          ...prev,
          [active]: {
            ...t,
            blocks: [...t.blocks, b],
            score: t.score + fitPoints(fit) + blockBonusPoints(b),
            stability: Math.max(0, Math.min(100, projectedStab)),
          },
        };
      });
      setTimeout(() => nextTurn(true), 700);
    } else if (!willFall && fit === "wobble") {
      // PIVOT — sprężynowy "boing!", wieża mocno się wygina
      sfx.spring();
      sfx.creak();
      setWobbling(active);
      flashEvent(active, "wobble");
      setAngle(projectedAngle);
      setTeams((prev) => {
        const t = prev[active];
        return {
          ...prev,
          [active]: {
            ...t,
            blocks: [...t.blocks, b],
            score: t.score + fitPoints(fit) + blockBonusPoints(b),
            stability: Math.max(0, Math.min(100, projectedStab)),
          },
        };
      });
      setTimeout(() => {
        setWobbling(null);
        nextTurn(true);
      }, 900);
    } else {
      // FALL — najpierw dodaj klocek na szczyt, by gracz zobaczył jego upadek razem z wieżą
      sfx.tap();
      setAngle(projectedAngle);
      setTeams((prev) => {
        const t = prev[active];
        return {
          ...prev,
          [active]: {
            ...t,
            blocks: [...t.blocks, b],
            stability: Math.max(0, Math.min(100, projectedStab)),
          },
        };
      });

      // Krótka pauza, by widać było ułożony klocek przed zawaleniem
      setTimeout(() => {
        sfx.crash();
        sfx.aaaa();
        flashEvent(active, "fall");
        setCollapsing(active);
        setTimeout(() => {
          setTeams((prev) => {
            const t = prev[active];
            return {
              ...prev,
              [active]: {
                ...t,
                blocks: t.blocks.slice(0, Math.max(0, t.blocks.length - 2)),
                stability: 60,
              },
            };
          });
          setAngle(0);
          setCollapsing(null);
          nextTurn(true);
        }, 1300);
      }, 800);
    }
  }

  // Panel nauczyciela
  function teacherSkip() {
    nextTurn(false);
  }
  function teacherSwap() {
    nextTurn(true);
  }
  function teacherAddTime(delta: number) {
    setSecondsLeft((s) => Math.max(5, s + delta));
  }
  function teacherShush() {
    setShushing(true);
    setPaused(true);
    setTimeout(() => {
      setShushing(false);
      setPaused(false);
    }, 10000);
  }

  // ===== Render: Freeze Frame =====
  if (phase === "freeze") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary p-6">
        <div className="text-center">
          {freezePhase === "intro" && (
            <div className="animate-pop-in">
              <div className="mb-4 inline-block rounded-2xl stripe-bg px-6 py-2 cartoon-border cartoon-shadow">
                <span className="font-display text-xl text-foreground">🏗️ START 🏗️</span>
              </div>
              <h1 className="text-stroke-lg text-6xl text-primary-foreground md:text-7xl">
                ARCHITEKCI<br />NA CZAS!
              </h1>
              <p className="mt-4 font-display text-2xl text-primary-foreground">
                🎵 Tańczcie i wyładujcie energię! 🎵
              </p>
            </div>
          )}
          {freezePhase === "count" && (
            <div key={answerSec} className="font-display text-9xl text-primary-foreground animate-pop-in">
              3… 2… 1…
            </div>
          )}
          {freezePhase === "freeze" && (
            <div className="animate-freeze-pulse">
              <div className="text-stroke-lg text-[10rem] leading-none text-card">FREEZE!</div>
              <p className="mt-4 font-display text-3xl text-primary-foreground">
                ❄️ Zamrzyjcie w pozie waszej drużyny! ❄️
              </p>
            </div>
          )}
          {freezePhase === "ready" && (
            <div className="animate-fade-in">
              <p className="mb-6 font-display text-3xl text-primary-foreground">
                Gotowi do budowy?
              </p>
              <Button
                onClick={() => setPhase("question")}
                className="h-20 rounded-2xl bg-card text-3xl font-display text-foreground cartoon-border-thick cartoon-shadow-xl hover:-translate-y-1 hover:bg-card"
              >
                ▶ START GRY
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== Render: End =====
  if (phase === "ended") {
    const winName =
      winner === "tie"
        ? "Remis!"
        : winner === "A"
        ? teams.A.name
        : teams.B.name;
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <Confetti active />
        <div className="w-full max-w-3xl rounded-3xl bg-card p-8 text-center cartoon-border-thick cartoon-shadow-xl animate-pop-in">
          <h1 className="text-stroke-lg mb-2 text-5xl text-primary md:text-6xl">⏱️ CZAS MINĄŁ!</h1>

          <div className="my-6 grid gap-4 md:grid-cols-2">
            {(["A", "B"] as TeamId[]).map((id) => {
              const t = teams[id];
              const max = Math.max(teams.A.score, teams.B.score, 1);
              return (
                <div
                  key={id}
                  className={cn(
                    "rounded-2xl p-5 cartoon-border",
                    winner === id ? "cartoon-shadow-lg animate-bounce-soft" : "",
                    TEAM_BG_SOFT[t.color],
                  )}
                >
                  <div className={cn("inline-block rounded-full px-4 py-1 cartoon-border font-display text-xl", TEAM_BG[t.color])}>
                    {t.name}
                  </div>
                  <div className="mt-3 font-display text-4xl">{t.score} pkt</div>
                  <div className="mt-1 text-sm text-muted-foreground">{t.blocks.length} klocków</div>
                  <div className="mt-3 h-4 w-full rounded-full bg-muted cartoon-border overflow-hidden">
                    <div
                      className={cn("h-full", TEAM_BG[t.color])}
                      style={{ width: `${(t.score / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl bg-primary/20 p-4 cartoon-border text-left">
            <div className="font-display text-xl">🏆 {winner === "tie" ? "Wygrywają obie drużyny!" : `Wygrywają: ${winName}!`}</div>
          </div>

          <div className="mt-4 rounded-2xl bg-secondary/15 p-4 cartoon-border text-left">
            <div className="font-display text-lg">📊 Ciekawostka:</div>
            <p className="mt-1 text-base">{funFact}</p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => window.location.reload()}
              className="h-14 rounded-2xl bg-primary px-6 text-xl font-display text-primary-foreground cartoon-border cartoon-shadow hover:-translate-y-0.5 hover:bg-primary"
            >
              🔄 Zagraj ponownie
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="h-14 rounded-2xl bg-card px-6 text-xl font-display cartoon-border cartoon-shadow hover:-translate-y-0.5"
            >
              ✖ Zakończ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ===== Render: Game (question / block) =====
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const activeTeam = teams[active];
  const top = activeTeam.blocks[activeTeam.blocks.length - 1] ?? null;
  const topEdge = top ? TOP_EDGE[top] : null;
  const isQuestion = phase === "question";
  const isBlock = phase === "block";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Pauza overlay */}
      {paused && !shushing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-foreground/60 backdrop-blur-sm">
          <div className="rounded-3xl bg-card p-10 text-center cartoon-border-thick cartoon-shadow-xl animate-pop-in">
            <div className="text-stroke-lg text-7xl text-primary">⏸ PAUZA</div>
            <Button
              onClick={() => setPaused(false)}
              className="mt-6 h-14 rounded-2xl bg-primary px-8 text-xl font-display cartoon-border"
            >
              ▶ Wznów
            </Button>
          </div>
        </div>
      )}
      {shushing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-secondary/90">
          <div className="text-center animate-freeze-pulse">
            <div className="text-[12rem] leading-none">🤫</div>
            <div className="text-stroke-lg text-6xl text-card">CIIII…</div>
          </div>
        </div>
      )}

      {/* Górna strefa: wieże + timer */}
      <div className="grid flex-1 grid-cols-[1fr_auto_1fr] gap-4 px-6 pt-4 pb-2 min-h-[280px]">
        <Tower
          team={teams.A}
          isActive={active === "A"}
          side="left"
          collapsing={collapsing === "A"}
          wobbling={wobbling === "A"}
          recentEvent={recentEventA}
          wobbleAngle={angleA}
          sparks={sparksA}
          flash={active === "A" ? feedback === "correct" ? "success" : feedback === "wrong" ? "error" : null : null}
        />

        <div className="flex flex-col items-center justify-start gap-3 pt-2">
          <div className="rounded-2xl bg-card px-5 py-3 cartoon-border cartoon-shadow text-center">
            <div className="text-xs font-display text-muted-foreground">CZAS</div>
            <div className={cn("font-display text-4xl tabular-nums", secondsLeft < 30 && "text-destructive animate-bounce-soft")}>
              {mins}:{String(secs).padStart(2, "0")}
            </div>
          </div>
          <div className="rounded-full bg-foreground px-3 py-1 text-card font-display text-sm">
            VS
          </div>
          {lastFit && (
            <div
              className={cn(
                "rounded-full cartoon-border px-3 py-1 font-display text-sm animate-pop-in",
                lastFit === "click" && "bg-success text-success-foreground",
                lastFit === "ok" && "bg-primary text-primary-foreground",
                lastFit === "wobble" && "bg-team-orange text-white",
                lastFit === "fall" && "bg-destructive text-destructive-foreground",
              )}
            >
              {FIT_LABEL[lastFit]}
            </div>
          )}
        </div>

        <Tower
          team={teams.B}
          isActive={active === "B"}
          side="right"
          collapsing={collapsing === "B"}
          wobbling={wobbling === "B"}
          recentEvent={recentEventB}
          wobbleAngle={angleB}
          sparks={sparksB}
          flash={active === "B" ? feedback === "correct" ? "success" : feedback === "wrong" ? "error" : null : null}
        />
      </div>

      {/* Środkowa strefa: zadanie */}
      <div
        className={cn(
          "mx-4 mb-3 rounded-3xl p-5 cartoon-border-thick cartoon-shadow-lg transition-colors",
          TEAM_BG_SOFT[activeTeam.color],
        )}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className={cn("rounded-full px-4 py-1 cartoon-border font-display text-lg", TEAM_BG[activeTeam.color])}>
            Teraz budują: {activeTeam.name}
          </div>
          {isQuestion && (
            <div className="rounded-full bg-card px-3 py-1 cartoon-border font-display tabular-nums">
              ⏳ {answerSec}s
            </div>
          )}
        </div>

        {isQuestion && (
          <div className="text-center animate-fade-in">
            <div className="text-stroke-lg my-2 font-display text-6xl md:text-7xl">{question.text}</div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {question.options.map((o) => (
                <button
                  key={o}
                  onClick={() => chooseAnswer(o)}
                  className="h-20 rounded-2xl bg-card text-4xl font-display cartoon-border cartoon-shadow transition-transform hover:-translate-y-1 active:translate-y-0"
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        )}

        {isBlock && (
          <div className="animate-fade-in">
            <div className="mb-2 text-center font-display text-2xl">
              ✅ Brawo! Wybierz klocek do wieży:
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {blockChoices.map((b) => (
                <BlockChoice
                  key={b}
                  block={b}
                  top={top}
                  showHint={showHint}
                  onClick={() => chooseBlock(b)}
                />
              ))}
            </div>

            {showHint && (
              <div className="mt-3 rounded-xl bg-card/70 p-3 cartoon-border text-center text-sm font-display">
                💡 Spójrz na <b>górę wieży</b> i <b>dół klocka</b>. Wypukłość w wgłębienie = <span className="text-stability-good">CLICK!</span>{" "}
                Wypukłość na wypukłości = <span className="text-stability-bad">chwieje się</span>.
                Kolor ramki podpowiada wynik.
              </div>
            )}
            {!showHint && settings.grade === "3" && (
              <div className="mt-3 text-center">
                <button
                  onClick={() => setShowHint(true)}
                  className="rounded-full bg-card px-4 py-1 cartoon-border font-display text-sm"
                >
                  💡 Pokaż podpowiedź
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Panel nauczyciela */}
      <div className="border-t-4 border-foreground bg-card px-3 py-2">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 text-sm">
          <span className="font-display text-foreground/70 mr-2">🎮 Panel nauczyciela:</span>
          <TeacherBtn onClick={() => setPaused((p) => !p)}>{paused ? "▶ Wznów" : "⏸ Pauza"}</TeacherBtn>
          <TeacherBtn onClick={teacherSkip} disabled={!isQuestion}>⏭ Pomiń pytanie</TeacherBtn>
          <TeacherBtn onClick={teacherSwap}>🔄 Zamień drużyny</TeacherBtn>
          <TeacherBtn onClick={() => setShowHint(true)} disabled={!isBlock}>💡 Podpowiedź</TeacherBtn>
          <TeacherBtn onClick={() => teacherAddTime(60)}>⏱️ +1 min</TeacherBtn>
          <TeacherBtn onClick={() => teacherAddTime(-60)}>⏱️ −1 min</TeacherBtn>
          <TeacherBtn onClick={teacherShush}>🔇 Ciszo-Metr</TeacherBtn>
          <TeacherBtn onClick={endGame} variant="danger">🏁 Zakończ teraz</TeacherBtn>
          <span
            className="ml-2 cursor-help rounded-full bg-muted px-2 py-1 text-xs font-display"
            title="Klocki łączą się jak puzzle. Wypukłość (▲ △) wchodzi w wgłębienie (▼ ▽) = CLICK! Płaskie na płaskim = OK. Wypukłe na wypukłym = chwieje się. Pasek 0–100 nad wieżą pokazuje stabilność — gdy spadnie do 0, wieża się wali."
          >
            ❓ Jak to działa
          </span>
        </div>
      </div>
    </div>
  );
};

function TeacherBtn({
  children,
  onClick,
  disabled,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "danger";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full border-2 border-foreground px-3 py-1 font-display transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0",
        variant === "danger" ? "bg-destructive text-destructive-foreground" : "bg-background",
      )}
    >
      {children}
    </button>
  );
}

export default Play;
