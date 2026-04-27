export type GameModeId = "upper_lower" | "letter_image" | "syllables";

export type CardSide = "A" | "B";

export type CardKind =
  | "upper"
  | "lower"
  | "letter"
  | "image"
  | "syllable_start"
  | "syllable_end";

export interface CardPair {
  id: string;
  modeId: GameModeId;
  letterGroup: string; // np. "A", "K", "MA"
  contentA: string;
  contentB: string;
  /** Dla trybu Litera↔Obrazek — nazwa ikony Phosphor lub słowo dla obrazka */
  imageWord?: string; // np. "kot"
  imageIcon?: string; // np. "Cat"
  /** Dla sylab — pełne słowo */
  fullWord?: string;
  displayLabel: string;
}

export interface BoardCard {
  id: string;
  pairId: string;
  side: CardSide;
  kind: CardKind;
  content: string;
  /** Dodatkowe dane do wyświetlenia po odkryciu */
  caption?: string; // np. podpis pod obrazkiem
  iconName?: string; // ikona Phosphor
  row: number;
  col: number;
  state: "hidden" | "revealed" | "matched";
}

export type PlayerSelectionMode = "manual" | "queue" | "numbers";

export interface GameSession {
  id: string;
  modeId: GameModeId;
  cols: number;
  rows: number;
  selectedLetters: string[];
  flashDurationSec: number;
  pauseBetweenCardsSec: number;
  playerSelectionMode: PlayerSelectionMode;
  numberRangeFrom?: number;
  numberRangeTo?: number;
  status: "setup" | "flashing" | "playing" | "finished";
  currentTurn: number;
  totalPairs: number;
  foundPairs: number;
  startedAt: number;
  finishedAt?: number;
}

export interface TurnLogEntry {
  turn: number;
  playerName?: string;
  firstCardId: string;
  secondCardId: string;
  isMatch: boolean;
  timestamp: number;
}

export interface ClassRecord {
  modeId: GameModeId;
  gridSize: string;
  bestTurns: number;
  lastPlayed: number;
}
