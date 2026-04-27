import type { GameSettings } from "./types";

const KEY = "architekci-settings-v1";

export const DEFAULT_SETTINGS: GameSettings = {
  range: "mix",
  durationMin: 5,
  difficulty: "medium",
  freezeFrame: true,
  grade: "2",
  teamA: { name: "Czerwoni", color: "red" },
  teamB: { name: "Niebiescy", color: "blue" },
};

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: GameSettings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* noop */
  }
}

export const FUN_FACTS: string[] = [
  "Najwyższy budynek świata — Burj Khalifa w Dubaju — ma 828 metrów i 163 piętra!",
  "Pałac Kultury i Nauki w Warszawie ma 237 metrów wysokości.",
  "Wielka Piramida w Gizie była najwyższą budowlą świata przez prawie 4000 lat!",
  "Wieża Eiffla rośnie latem o ok. 15 cm — bo metal się rozszerza w upale.",
  "Mur Chiński ma ponad 21 000 km długości — to połowa równika!",
  "Aby wybudować dom, potrzeba zwykle ponad 20 000 cegieł.",
  "Architekt to osoba, która projektuje budynki — od mostów po domki na drzewach.",
];
