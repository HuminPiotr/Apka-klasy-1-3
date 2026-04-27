import type { CardPair, GameModeId } from "./types";

export interface GameModeMeta {
  id: GameModeId;
  name: string;
  tagline: string;
  description: string;
  minClass: number;
  iconName: string; // Phosphor
}

export const GAME_MODES: GameModeMeta[] = [
  {
    id: "upper_lower",
    name: "Wielka ↔ Mała",
    tagline: "Klasa 1 · I semestr",
    description: "Para to wielka litera i jej mała wersja. Niebieskie z zielonymi.",
    minClass: 1,
    iconName: "TextAa",
  },
  {
    id: "letter_image",
    name: "Litera ↔ Obrazek",
    tagline: "Klasa 1 · II semestr",
    description: "Litera łączy się z obrazkiem rzeczy, która się na nią zaczyna.",
    minClass: 1,
    iconName: "ImageSquare",
  },
  {
    id: "syllables",
    name: "Sylaby",
    tagline: "Klasa 2",
    description: "Dwie sylaby tworzą razem słowo. Ciemna szuka jasnej.",
    minClass: 2,
    iconName: "PuzzlePiece",
  },
];

/* ---------------- Tryb 1: Wielka ↔ Mała ---------------- */
const UPPER_LOWER_LETTERS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
  "K", "L", "M", "N", "O", "P", "R", "S", "T", "U", "W", "Z",
];

export const UPPER_LOWER_PAIRS: CardPair[] = UPPER_LOWER_LETTERS.map((L) => ({
  id: `ul_${L}`,
  modeId: "upper_lower",
  letterGroup: L,
  contentA: L,
  contentB: L.toLowerCase(),
  displayLabel: `${L} — ${L.toLowerCase()}`,
}));

/* ---------------- Tryb 2: Litera ↔ Obrazek ----------------
   Ikony Phosphor: dobrane ręcznie do polskich słów. */
interface LetterImageDef {
  letter: string;
  word: string;
  icon: string; // Phosphor icon name
}

const LETTER_IMAGE_DEFS: LetterImageDef[] = [
  { letter: "K", word: "kot", icon: "Cat" },
  { letter: "D", word: "dom", icon: "House" },
  { letter: "S", word: "słońce", icon: "Sun" },
  { letter: "P", word: "pies", icon: "Dog" },
  { letter: "R", word: "ryba", icon: "Fish" },
  { letter: "B", word: "balon", icon: "Balloon" },
  { letter: "G", word: "gwiazda", icon: "Star" },
  { letter: "L", word: "lampa", icon: "Lamp" },
  { letter: "M", word: "miś", icon: "PawPrint" },
  { letter: "J", word: "jabłko", icon: "AppleLogo" },
  { letter: "C", word: "chmura", icon: "Cloud" },
  { letter: "A", word: "auto", icon: "Car" },
  { letter: "T", word: "tort", icon: "Cake" },
  { letter: "O", word: "oko", icon: "Eye" },
  { letter: "Z", word: "zegar", icon: "Clock" },
  { letter: "N", word: "nożyczki", icon: "Scissors" },
  { letter: "W", word: "walizka", icon: "Suitcase" },
  { letter: "F", word: "flaga", icon: "Flag" },
  { letter: "U", word: "ucho", icon: "Ear" },
  { letter: "E", word: "ekran", icon: "Monitor" },
];

export const LETTER_IMAGE_PAIRS: CardPair[] = LETTER_IMAGE_DEFS.map((d) => ({
  id: `li_${d.letter}`,
  modeId: "letter_image",
  letterGroup: d.letter,
  contentA: d.letter,
  contentB: d.word,
  imageWord: d.word,
  imageIcon: d.icon,
  displayLabel: `${d.letter} — ${d.word}`,
}));

/* ---------------- Tryb 3: Sylaby ---------------- */
interface SyllableDef {
  start: string;
  end: string;
  word: string;
  icon: string;
}

const SYLLABLE_DEFS: SyllableDef[] = [
  { start: "Ping", end: "win", word: "pingwin", icon: "Bird" },
  { start: "Ple", end: "cak", word: "plecak", icon: "Backpack" },
  { start: "Czos", end: "nek", word: "czosnek", icon: "Plant" },
  { start: "Wam", end: "pir", word: "wampir", icon: "Tooth" },
  { start: "Bal", end: "kon", word: "balkon", icon: "Buildings" },
  { start: "Kak", end: "tus", word: "kaktus", icon: "Cactus" },
  { start: "Bre", end: "lok", word: "brelok", icon: "Key" },
];

export const SYLLABLE_PAIRS: CardPair[] = SYLLABLE_DEFS.map((d) => ({
  id: `sy_${d.word}`,
  modeId: "syllables",
  letterGroup: d.word.toUpperCase(),
  contentA: d.start,
  contentB: d.end,
  fullWord: d.word,
  imageIcon: d.icon,
  displayLabel: d.word,
}));

export function getPairsForMode(mode: GameModeId): CardPair[] {
  switch (mode) {
    case "upper_lower":
      return UPPER_LOWER_PAIRS;
    case "letter_image":
      return LETTER_IMAGE_PAIRS;
    case "syllables":
      return SYLLABLE_PAIRS;
  }
}

export function getAvailableLetters(mode: GameModeId): string[] {
  return getPairsForMode(mode).map((p) => p.letterGroup);
}
