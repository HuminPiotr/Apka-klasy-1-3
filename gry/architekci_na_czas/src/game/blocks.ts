import type { BlockShape, Difficulty, EdgeKind, FitResult } from "./types";

export const BLOCK_LABELS: Record<BlockShape, string> = {
  square: "Kwadrat",
  rect: "Prostokąt szeroki",
  roof: "Trójkąt (dach)",
  funnel: "Trójkąt odwrócony",
  tower: "Wieżyczka",
  castle: "Zamek z fosą",
  dome: "Półkole",
  trapezoid: "Trapez",
  rhombus: "Romb",
  lego: "Klocek LEGO",
};

export const BLOCK_COLOR_VAR: Record<BlockShape, string> = {
  square: "hsl(var(--block-square))",
  rect: "hsl(var(--block-rect))",
  roof: "hsl(var(--block-roof))",
  funnel: "hsl(var(--block-funnel))",
  tower: "hsl(var(--block-tower))",
  castle: "hsl(var(--block-castle))",
  dome: "hsl(var(--block-dome))",
  trapezoid: "hsl(var(--block-trapezoid))",
  rhombus: "hsl(var(--block-rhombus))",
  lego: "hsl(var(--block-lego))",
};

/** Względna szerokość klocka (jednostki umowne). Używana do oceny nawisu (overhang) na płaskim złączu. */
export const BLOCK_WIDTH: Record<BlockShape, number> = {
  square: 2,
  rect: 4,
  roof: 3,
  funnel: 3,
  tower: 1,
  castle: 3,
  dome: 3,
  trapezoid: 3,
  rhombus: 2,
  lego: 2,
};

/** Krawędź dolna każdego klocka — czym stawiamy. */
export const BOTTOM_EDGE: Record<BlockShape, EdgeKind> = {
  square: "flat",
  rect: "flat",
  roof: "flat",
  funnel: "peak",
  tower: "flat",
  castle: "flat",
  dome: "flat",
  trapezoid: "flat",
  rhombus: "peak",
  lego: "slot",
};

/** Krawędź górna każdego klocka — na czym stawiamy. */
export const TOP_EDGE: Record<BlockShape, EdgeKind> = {
  square: "flat",
  rect: "flat",
  roof: "peak",
  funnel: "flat",
  tower: "knob",
  castle: "slot",
  dome: "flat", // półkole — flat z lekkim zaokrągleniem; traktujemy jak flat
  trapezoid: "flat",
  rhombus: "peak",
  lego: "knob",
};

export const EDGE_LABEL: Record<EdgeKind, string> = {
  flat: "płaska",
  peak: "spiczasta",
  notch: "wklęsła",
  knob: "z wypustką",
  slot: "ze szczeliną",
};

export const EDGE_ICON: Record<EdgeKind, string> = {
  flat: "═",
  peak: "△",
  notch: "▽",
  knob: "▲",
  slot: "▼",
};

/**
 * Oceń dopasowanie nowego klocka do wierzchołka wieży.
 * Pełna matryca 5×5 wg specyfikacji.
 *
 * Wiersze = krawędź DOLNA nowego klocka (czym stawiamy)
 * Kolumny = krawędź GÓRNA wieży (na czym stawiamy)
 */
export function evaluateFit(top: BlockShape | null, next: BlockShape): FitResult {
  const nb = BOTTOM_EDGE[next];

  // Pusty fundament — traktujemy jak płaski grunt
  if (top === null) {
    if (nb === "flat") return "click";
    if (nb === "peak") return "wobble";
    // slot (wklęsła) na płaskim gruncie — stabilnie siada, brak chwiania
    if (nb === "slot") return "ok";
    return "ok";
  }

  const te = TOP_EDGE[top];

  // Wklęsła (slot) na płaskiej (flat) — gdy nowy klocek nie jest szerszy od podłoża,
  // siada stabilnie obejmując krawędź. Brak chwiania.
  if (nb === "slot" && te === "flat" && top && BLOCK_WIDTH[next] <= BLOCK_WIDTH[top]) {
    return "ok";
  }

  const map: Record<EdgeKind, Record<EdgeKind, FitResult>> = {
    // dolna krawędź = flat
    flat: {
      flat: "ok",
      peak: "wobble",
      notch: "ok",
      knob: "ok",
      slot: "wobble",
    },
    // dolna krawędź = peak (spiczasta — szuka wgłębienia)
    peak: {
      flat: "wobble",
      peak: "wobble",
      notch: "click",
      knob: "wobble",
      slot: "click",
    },
    // dolna krawędź = notch (wklęsła — szuka wypukłości)
    notch: {
      flat: "ok",
      peak: "click",
      notch: "wobble",
      knob: "click",
      slot: "wobble",
    },
    // dolna krawędź = knob (wypustka — szuka szczeliny / wgłębienia)
    knob: {
      flat: "ok",
      peak: "wobble",
      notch: "click",
      knob: "wobble",
      slot: "click",
    },
    // dolna krawędź = slot (szczelina — szuka wypustki)
    slot: {
      flat: "wobble",
      peak: "click",
      notch: "wobble",
      knob: "click",
      slot: "wobble",
    },
  };

  return map[nb][te];
}

/** Punkty za dopasowanie. */
export function fitPoints(fit: FitResult): number {
  switch (fit) {
    case "click":
      return 3;
    case "ok":
      return 1;
    case "wobble":
      return 1;
    case "fall":
      return 0;
  }
}

/** Bonus punktowy za rolę specjalną klocka (po postawieniu). */
export function blockBonusPoints(b: BlockShape): number {
  if (b === "roof") return 2; // zamykacz / odważny wybór
  return 0;
}

/** Zmiana stabilności wynikająca z dopasowania (0..100). */
export function fitStabilityDelta(fit: FitResult): number {
  switch (fit) {
    case "click":
      return 15;
    case "ok":
      return 0;
    case "wobble":
      return -20;
    case "fall":
      return -100; // i tak resetujemy
  }
}

/** Naturalny spadek stabilności za każdy nowy klocek (wieża rośnie). */
export const STABILITY_DECAY_PER_BLOCK = 5;

/** Bonus stabilności za rolę specjalną klocka. */
export function blockStabilityBonus(b: BlockShape): number {
  if (b === "rect") return 10; // stabilizator
  return 0;
}

/** Klocki dostępne w paletce wg trudności. */
export function availableBlocks(d: Difficulty): BlockShape[] {
  if (d === "easy") return ["square", "rect", "roof", "tower", "castle", "funnel"];
  if (d === "medium")
    return ["square", "rect", "roof", "funnel", "tower", "castle", "dome", "trapezoid"];
  return ["square", "rect", "roof", "funnel", "tower", "castle", "dome", "trapezoid", "rhombus", "lego"];
}

/** Etykieta wyniku dla nauczyciela. */
export const FIT_LABEL: Record<FitResult, string> = {
  click: "CLICK!",
  ok: "OK",
  wobble: "Niestabilne…",
  fall: "Zawalenie!",
};

/** Stan wieży wg progów stabilności. */
export type TowerState = "stable" | "shaky" | "critical" | "fallen";
export function towerState(stability: number): TowerState {
  if (stability <= 0) return "fallen";
  if (stability <= 30) return "critical";
  if (stability <= 70) return "shaky";
  return "stable";
}
