export type WorldId = "challenge" | "discovery" | "relax";
export type GameId = "architekci" | "memory" | "mgla" | "prawda_czy_falsz" | "oddech_smoka";

export interface Game {
  id: GameId;
  name: string;
  icon: string;
  port: number;
  path: string;
}

export interface World {
  id: WorldId;
  name: string;
  icon: string;
  colorMain: string;
  colorHover: string;
  colorBg: string;
  colorBorder: string;
  ctaLabel: string;
  games: Game[];
}

export const worlds: World[] = [
  {
    id: "challenge",
    name: "Świat Wyzwań",
    icon: "Lightning",
    colorMain: "#FF8C42",
    colorHover: "#E67320",
    colorBg: "#FFF0E0",
    colorBorder: "#FF8C42",
    ctaLabel: "Wchodzimy!",
    games: [
      { id: "architekci", name: "Architekci na czas", icon: "Cube", port: 8081, path: "/games/architekci/" },
    ],
  },
  {
    id: "discovery",
    name: "Świat Odkrywania",
    icon: "MagnifyingGlass",
    colorMain: "#6A9FD8",
    colorHover: "#4A7FB5",
    colorBg: "#D6E8FF",
    colorBorder: "#6A9FD8",
    ctaLabel: "Odkrywamy!",
    games: [
      { id: "memory", name: "Literowe Memory", icon: "TextAa", port: 8082, path: "/games/memory/" },
      { id: "mgla", name: "Mgła", icon: "Cloud", port: 8085, path: "/games/mgla/" },
      { id: "prawda_czy_falsz", name: "Prawda czy Fałsz?", icon: "Question", port: 8084, path: "/games/tf/" },
    ],
  },
  {
    id: "relax",
    name: "Świat Relaksu",
    icon: "Leaf",
    colorMain: "#4ECDC4",
    colorHover: "#3AAFA6",
    colorBg: "#EDFAF9",
    colorBorder: "#4ECDC4",
    ctaLabel: "Relaksujemy się!",
    games: [
      { id: "oddech_smoka", name: "Oddech Smoka", icon: "Wind", port: 8083, path: "/games/smok/" },
    ],
  },
];
