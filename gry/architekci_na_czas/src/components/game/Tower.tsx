import { BlockShapeSvg } from "./BlockShapeSvg";
import type { FaceMood, Team } from "@/game/types";
import { BOTTOM_EDGE, TOP_EDGE } from "@/game/blocks";
import { cn } from "@/lib/utils";

interface Props {
  team: Team;
  isActive: boolean;
  side: "left" | "right";
  collapsing?: boolean;
  flash?: "success" | "error" | null;
  /** Animacja chwiania przy WOBBLE. */
  wobbling?: boolean;
  /** Ostatnie zdarzenie na tej wieży (chwilowe, ~1.2s). */
  recentEvent?: "click" | "wobble" | "fall" | null;
  /** Aktualny kąt odchylenia wieży w stopniach (fizyka „sztywnego pręta"). */
  wobbleAngle?: number;
  /** Pokaż iskry nad ostatnim klockiem (po LOCKED). */
  sparks?: boolean;
}

const TEAM_BG: Record<Team["color"], string> = {
  red: "bg-team-red text-team-red-foreground",
  blue: "bg-team-blue text-team-blue-foreground",
  green: "bg-team-green text-white",
  orange: "bg-team-orange text-white",
  purple: "bg-team-purple text-white",
  teal: "bg-team-teal text-white",
};

const BLOCK_HEIGHT = 56;

/**
 * Wyznacz nastrój klocka na podstawie:
 *  - pozycji w wieży (im wyżej, tym nerwowiej; szczyt zawsze najbardziej)
 *  - stabilności wieży (0..100)
 *  - chwilowego zdarzenia (click → happy, wobble → scared, fall → panic)
 */
function computeMood(
  index: number,
  total: number,
  stability: number,
  recentEvent: "click" | "wobble" | "fall" | null | undefined,
  collapsing: boolean,
): FaceMood {
  const isTop = index === total - 1;
  const isUnderTop = index === total - 2;

  if (collapsing && index >= total - 2) return "panic";
  if (recentEvent === "fall") return "panic";

  if (recentEvent === "click" && (isTop || isUnderTop)) return "happy";
  if (recentEvent === "wobble" && isTop) return "panic";
  if (recentEvent === "wobble") return "scared";

  // "Wysokość" = pozycja względna od dołu, dodaje +nervousness im wyżej
  const heightBoost = total > 1 ? (index / Math.max(1, total - 1)) * 25 : 0;
  // Top zawsze ma dodatkowy strach
  const topPenalty = isTop ? 20 : 0;
  const effectiveStab = stability - heightBoost - topPenalty;

  if (effectiveStab > 70) return "calm";
  if (effectiveStab > 40) return "nervous";
  if (effectiveStab > 15) return "scared";
  return "panic";
}

export function Tower({ team, isActive, side, collapsing, flash, wobbling, recentEvent, wobbleAngle = 0, sparks }: Props) {
  const blocks = team.blocks;

  // Kąt fizyczny — clamped do ±15°, ale wizualnie skalowany w dół, żeby kołysanie było subtelne.
  // Małe wychylenia (<2°) traktujemy jako 0 — wieża stoi spokojnie.
  const sign = side === "left" ? -1 : 1;
  const physical = Math.max(-15, Math.min(15, wobbleAngle));
  const physAbs = Math.abs(physical);
  // Mapowanie nieliniowe: 0..15° fizycznych → 0..6° wizualnych. Dolny próg 2° = bez animacji.
  const visualAmplitude = physAbs < 2 ? 0 : Math.min(6, (physAbs - 2) * 0.5);
  const swayAmplitude = visualAmplitude;
  // Wolniejsze, łagodniejsze kołysanie
  const swayDuration = swayAmplitude < 0.5 ? 0 : Math.max(1.6, 3.2 - swayAmplitude * 0.15);

  const barColor =
    team.stability > 70 ? "bg-stability-good"
    : team.stability > 30 ? "bg-stability-warn"
    : "bg-stability-bad";

  return (
    <div className="flex h-full flex-col items-center justify-end gap-2">
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl cartoon-border px-4 py-2 cartoon-shadow font-display text-xl",
          TEAM_BG[team.color],
          isActive && "animate-bounce-soft",
        )}
      >
        <span>{side === "left" ? "🔴" : "🔵"}</span>
        <span className="truncate max-w-[140px]">{team.name}</span>
        <span className="ml-2 rounded-full bg-background/30 px-2 text-base">{team.score} pkt</span>
      </div>

      {/* Wskaźnik stabilności — pasek 0..100 */}
      <div className="flex w-full max-w-[260px] flex-col gap-1">
        <div className="flex items-center justify-end text-xs font-display">
          <span className="tabular-nums text-muted-foreground">{Math.max(0, Math.round(team.stability))}/100</span>
        </div>
        <div className="h-3 w-full rounded-full bg-muted cartoon-border overflow-hidden">
          <div
            className={cn("h-full transition-all duration-500", barColor)}
            style={{ width: `${Math.max(0, Math.min(100, team.stability))}%` }}
          />
        </div>
      </div>

      <div
        className={cn(
          "relative flex w-full max-w-[260px] flex-1 flex-col-reverse items-center justify-start overflow-visible rounded-t-2xl px-2",
          flash === "success" && "animate-flash-success",
          flash === "error" && "animate-flash-error",
          wobbling && "animate-wobble",
          swayAmplitude >= 1 && !wobbling && !collapsing && "animate-tower-sway",
        )}
        style={{
          transformOrigin: "bottom center",
          // Kąt jako CSS var — keyframe oscyluje od -angle do +angle
          ["--wobble-angle" as any]: `${swayAmplitude * sign}deg`,
          animationDuration: swayDuration ? `${swayDuration}s` : undefined,
          // Statyczna pozycja gdy nie animujemy: lekkie pochylenie zgodne ze znakiem
          transform: swayAmplitude < 1 ? "rotate(0deg)" : undefined,
        }}
      >
        {blocks.map((b, i) => {
          const isTop = i === blocks.length - 1;
          const isUnderTop = i === blocks.length - 2;
          const mood = computeMood(i, blocks.length, team.stability, recentEvent, !!collapsing);
          const showHeart = recentEvent === "click" && isUnderTop;
          const showSparks = sparks && isTop;

          // Naturalna wysokość renderu wynika z proporcji SVG (BlockShapeSvg sam dobiera).
          // Wymuszamy stałą "bazę" przez height — komponent skaluje SVG zachowując viewBox.
          // Ujemny margines: jeśli ten klocek ma knob na dole (wchodzi w klocek pod sobą),
          // lub klocek pod nim ma notch (przyjmuje wypustkę) — niech wskakuje w niego.
          const below = i > 0 ? blocks[i - 1] : null;
          const myBottom = BOTTOM_EDGE[b];
          const belowTop = below ? TOP_EDGE[below] : null;
          // Knob/lego mają graficzny knob wystający 14-16px ponad korpus SVG (ujemne y).
          // Aby się stykały z klockiem poniżej krawędziami korpusu, każdy klocek z knobem
          // na górze (tower, lego) wymaga, by klocek powyżej "wszedł" w jego knob = -16px.
          // Realizujemy to przez marginTop na klocku stojącym NA tym z knobem.
          const overlap =
            belowTop === "knob"
              ? -16 // wsuń się w knob klocka poniżej
              : belowTop === "notch" && (myBottom === "knob" || myBottom === "flat")
              ? -6 // delikatne wciśnięcie w wgłębienie
              : 0;

          return (
            <div
              key={collapsing && isTop ? `fall-${i}` : i}
              className={cn(
                "relative flex flex-shrink-0 items-end justify-center leading-none",
                isTop && !collapsing && "animate-block-drop",
                collapsing && isTop && "animate-block-tumble",
                collapsing && isUnderTop && "animate-block-fall",
              )}
              style={{ marginTop: i === 0 ? 0 : overlap }}
            >
              <BlockShapeSvg shape={b} height={BLOCK_HEIGHT} width={BLOCK_HEIGHT} mood={mood} isTop={isTop} />
              {showHeart && (
                <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 text-2xl animate-heart-rise">
                  💖
                </div>
              )}
              {showSparks && (
                <div className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 text-xl">
                  <span className="absolute animate-spark-burst" style={{ ["--sx" as any]: "-14px" }}>✨</span>
                  <span className="absolute animate-spark-burst" style={{ ["--sx" as any]: "0px", animationDelay: "0.05s" }}>⭐</span>
                  <span className="absolute animate-spark-burst" style={{ ["--sx" as any]: "14px", animationDelay: "0.1s" }}>✨</span>
                </div>
              )}
            </div>
          );
        })}

        {blocks.length === 0 && (
          <div className="pb-4 text-center font-display text-2xl text-muted-foreground">
            Buduj!
          </div>
        )}
      </div>

      {/* Fundament — żółto-czarna taśma */}
      <div className="h-4 w-full max-w-[280px] rounded-md cartoon-border stripe-bg" />
    </div>
  );
}
