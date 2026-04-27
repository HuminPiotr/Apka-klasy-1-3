export type BlockShape =
  | "square"
  | "rect"
  | "roof"
  | "funnel"
  | "tower"
  | "castle"
  | "dome"
  | "trapezoid"
  | "rhombus"
  | "lego";

export type Difficulty = "easy" | "medium" | "hard";
export type MathRange = "add20" | "mul50" | "mix";
export type Grade = "2" | "3";
export type TeamColor = "red" | "blue" | "green" | "orange" | "purple" | "teal";
export type TeamId = "A" | "B";

/** Rodzaj krawędzi klocka — używany do oceny dopasowania.
 *  - flat  ═  prosta krawędź (uniwersalna, neutralna)
 *  - peak  △  spiczasta wypukłość (jak dach)
 *  - notch ▽  trójkątne wgłębienie (pasuje do peak)
 *  - knob  ▲  mała kwadratowa wypustka (jak ząb LEGO)
 *  - slot  ▼  szczelina (pasuje do knob)
 */
export type EdgeKind = "flat" | "peak" | "notch" | "knob" | "slot";

/** Wynik dopasowania klocka do góry wieży. */
export type FitResult = "click" | "ok" | "wobble" | "fall";

/** Nastrój twarzy klocka — sterowany pozycją w wieży, stabilnością i ostatnim eventem. */
export type FaceMood = "happy" | "calm" | "nervous" | "scared" | "panic";

export interface Team {
  id: TeamId;
  name: string;
  color: TeamColor;
  blocks: BlockShape[];
  score: number;
  /** Wskaźnik stabilności wieży: 0..100. Start = 100. */
  stability: number;
}

export interface GameSettings {
  range: MathRange;
  durationMin: 3 | 5 | 7;
  difficulty: Difficulty;
  freezeFrame: boolean;
  grade: Grade;
  teamA: { name: string; color: TeamColor };
  teamB: { name: string; color: TeamColor };
}

export interface MathQuestion {
  text: string;
  answer: number;
  options: number[];
}

export type GamePhase = "freeze" | "question" | "block" | "feedback" | "ended";
