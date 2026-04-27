import type {
  BoardCard,
  CardKind,
  CardPair,
  ClassRecord,
  GameModeId,
  GameSession,
  PlayerSelectionMode,
} from "./types";
import { getPairsForMode } from "./data";

const uid = () => Math.random().toString(36).slice(2, 10);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Dobiera siatkę o najbardziej kwadratowych proporcjach dla 2*N kart. */
export function pickGrid(pairCount: number): { rows: number; cols: number } {
  const total = pairCount * 2;
  let best = { rows: 1, cols: total };
  let bestDiff = Infinity;
  for (let cols = 1; cols <= total; cols++) {
    if (total % cols !== 0) continue;
    const rows = total / cols;
    const diff = Math.abs(rows - cols);
    // preferuj wi\u0119cej kolumn ni\u017c wierszy (tablica jest szeroka)
    const score = diff + (rows > cols ? 0.5 : 0);
    if (score < bestDiff) {
      bestDiff = score;
      best = { rows, cols };
    }
  }
  return best;
}

function kindFor(modeId: GameModeId, side: "A" | "B"): CardKind {
  if (modeId === "upper_lower") return side === "A" ? "upper" : "lower";
  if (modeId === "letter_image") return side === "A" ? "letter" : "image";
  return side === "A" ? "syllable_start" : "syllable_end";
}

export interface CreateSessionInput {
  modeId: GameModeId;
  selectedLetters: string[];
  flashDurationSec?: number;
  pauseBetweenCardsSec?: number;
  playerSelectionMode?: PlayerSelectionMode;
  numberRangeFrom?: number;
  numberRangeTo?: number;
}

export interface CreatedSession {
  session: GameSession;
  cards: BoardCard[];
}

export function createSession(input: CreateSessionInput): CreatedSession {
  const allPairs = getPairsForMode(input.modeId);
  const chosen: CardPair[] = input.selectedLetters
    .map((l) => allPairs.find((p) => p.letterGroup === l))
    .filter((p): p is CardPair => Boolean(p));

  if (chosen.length < 2) {
    throw new Error("Wybierz co najmniej 2 pary.");
  }

  const grid = pickGrid(chosen.length);

  // Buduj 2 karty na parę
  const raw: BoardCard[] = chosen.flatMap((pair) => [
    {
      id: uid(),
      pairId: pair.id,
      side: "A" as const,
      kind: kindFor(pair.modeId, "A"),
      content: pair.contentA,
      caption:
        pair.modeId === "letter_image" ? undefined : undefined,
      iconName: undefined,
      row: 0,
      col: 0,
      state: "hidden" as const,
    },
    {
      id: uid(),
      pairId: pair.id,
      side: "B" as const,
      kind: kindFor(pair.modeId, "B"),
      content: pair.contentB,
      caption: pair.modeId === "letter_image" ? pair.imageWord : undefined,
      iconName:
        pair.modeId === "letter_image" || pair.modeId === "syllables"
          ? pair.imageIcon
          : undefined,
      row: 0,
      col: 0,
      state: "hidden" as const,
    },
  ]);

  const shuffled = shuffle(raw);
  shuffled.forEach((c, idx) => {
    c.row = Math.floor(idx / grid.cols);
    c.col = idx % grid.cols;
  });

  const session: GameSession = {
    id: uid(),
    modeId: input.modeId,
    cols: grid.cols,
    rows: grid.rows,
    selectedLetters: input.selectedLetters,
    flashDurationSec: input.flashDurationSec ?? 5,
    pauseBetweenCardsSec: input.pauseBetweenCardsSec ?? 1.2,
    playerSelectionMode: input.playerSelectionMode ?? "numbers",
    numberRangeFrom: input.numberRangeFrom,
    numberRangeTo: input.numberRangeTo,
    status: "setup",
    currentTurn: 0,
    totalPairs: chosen.length,
    foundPairs: 0,
    startedAt: Date.now(),
  };

  return { session, cards: shuffled };
}

/* -------- Records (LocalStorage) -------- */
const RECORDS_KEY = "literowe_memory_records_v1";

export function loadRecords(): ClassRecord[] {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveRecord(rec: ClassRecord): { isNewRecord: boolean; previous?: number } {
  const all = loadRecords();
  const idx = all.findIndex(
    (r) => r.modeId === rec.modeId && r.gridSize === rec.gridSize,
  );
  if (idx === -1) {
    all.push(rec);
    localStorage.setItem(RECORDS_KEY, JSON.stringify(all));
    return { isNewRecord: true };
  }
  const prev = all[idx];
  if (rec.bestTurns < prev.bestTurns) {
    all[idx] = rec;
    localStorage.setItem(RECORDS_KEY, JSON.stringify(all));
    return { isNewRecord: true, previous: prev.bestTurns };
  }
  return { isNewRecord: false, previous: prev.bestTurns };
}

export function findRecord(modeId: GameModeId, gridSize: string): ClassRecord | undefined {
  return loadRecords().find((r) => r.modeId === modeId && r.gridSize === gridSize);
}
