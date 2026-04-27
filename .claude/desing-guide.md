# DESIGN GUIDE — Aplikacja Edukacyjna

**Wersja:** 1.0 | **Projekt:** Aplikacja edukacyjna kl. 1–3

---

## KONTEKST

- Aplikacja wyświetlana na projektorze lub tablicy interaktywnej w klasie
- Obsługiwana myszką przez nauczyciela na komputerze
- Dzieci są widownią — oglądają z odległości 2–5 metrów
- Rozdzielczość: 1920×1080px, tylko landscape, zawsze fullscreen
- Brak wersji mobilnej i responsywności

---

## KOLORY

### Tło aplikacji

--color-bg: #F5F0E8

### Kolory neutralne

--color-text-primary: #2D2D2D --color-text-secondary: #6B6B6B --color-divider: #D4D4D4

### Świat Wyzwań (pomarańczowy)

--color-challenge-main: #FF8C42 --color-challenge-accent: #E6A800 --color-challenge-hover: #E67320 --color-challenge-bg: #FFF0E0 --color-challenge-border: #FF8C42

### Świat Odkrywania (niebieski)

--color-discovery-main: #6A9FD8 --color-discovery-accent: #B388FF --color-discovery-hover: #4A7FB5 --color-discovery-bg: #D6E8FF --color-discovery-border: #6A9FD8

### Świat Relaksu (turkusowy)

--color-relax-main: #4ECDC4 --color-relax-accent: #95D5B2 --color-relax-hover: #3AAFA6 --color-relax-bg: #EDFAF9 --color-relax-border: #4ECDC4

### Kolory systemowe

--color-success: #5CB85C --color-warning: #E6A800 --color-error: #D9534F

### Zasady kolorów

- Każdy Świat ma monopol na swój kolor — palety się nie mieszają
- Kontrast tekstu na tle minimum 4.5:1 (WCAG AA)
- Kolor nigdy nie jest jedynym nośnikiem informacji
- Tło ekranu nigdy nie jest czystą bielą (#FFFFFF) — oślepia na projektorze
- Saturacja kolorów wyższa niż standardowa — kompensacja wypłukiwania przez projektor

---

## TYPOGRAFIA

### Font

font-family: 'Nunito', sans-serif Google Fonts: https://fonts.google.com/specimen/Nunito Wagi: 400 (Regular), 600 (SemiBold), 700 (Bold), 800 (ExtraBold), 900 (Black)

### Skala typograficzna

--font-display: 112px / weight 900 / letter-spacing: 0.02em --font-h1: 72px / weight 800 --font-h2: 52px / weight 700 --font-h3: 36px / weight 700 --font-button: 32px / weight 800 --font-body: 28px / weight 400 --font-caption: 22px / weight 600

### Zasady typografii

- Tylko font Nunito — żadnych fontów szeryfowych
- Minimum 22px dla jakiegokolwiek tekstu widocznego na ekranie
- Brak italic — trudniejsze do czytania dla klasy 1–3
- Line-height: 1.4 dla treści wielolinijkowych
- Tekst na przyciskach zawsze wyśrodkowany
- ALL CAPS tylko dla głównego hasła ekranu startowego

---

## SPACING

### Jednostka bazowa: 8px

--space-xs: 8px --space-s: 16px --space-m: 24px --space-l: 32px --space-xl: 48px --space-xxl: 64px --space-xxxl: 80px

---

## GRID

### Layout ekranu głównego (1920×1080px)

Marginesy boczne: 80px Odstęp między kartami: 40px Kolumny kart Światów: 3 równe kolumny Padding karty: 40px

---

## KSZTAŁTY I CIENIE

--radius-card: 28px --radius-button: 999px (pill shape) --radius-button-secondary: 16px --radius-modal: 32px

--shadow-card: 0px 8px 24px rgba(0, 0, 0, 0.10) --shadow-card-hover: 0px 12px 32px rgba(0, 0, 0, 0.18) --shadow-modal: 0px 16px 48px rgba(0, 0, 0, 0.24)

--border-width: 4px (grubość wszystkich ramek kart — widoczność z odległości) --border-style: solid

---

## KOMPONENTY

### Karta Świata (ekran główny)

Szerokość: równy podział 3 kolumn z gutterem 40px i marginesami 80px Min-height: 380px Padding: 40px Border-radius: 28px Border: 4px solid [kolor-main świata] Background: [kolor-bg świata] Box-shadow: --shadow-card Cursor: pointer

Zawartość:

Ikona świata: 96×96px, wyśrodkowana

Nazwa świata: --font-h1, kolor [kolor-main świata], wyśrodkowana

Przycisk CTA: pełna szerokość karty (minus padding), --font-button

Stan hover: Box-shadow: --shadow-card-hover Transform: scale(1.03) Transition: 0.2s ease-out Border-color: [kolor-hover świata]

### Przycisk główny CTA (wewnątrz karty)

Height: 72px Width: 100% (full-width karty minus padding) Border-radius: 999px Background: [kolor-main świata] Color: #FFFFFF Font: --font-button Padding: 16px 40px

Stan hover: Background: [kolor-hover świata] Transform: scale(1.02) Transition: 0.15s ease-out

Stan active: Transform: scale(0.97)

### Przycisk wyboru gry (ekran 2)

Height: 80px Width: 100% Border-radius: 16px Background: #FFFFFF Border: 3px solid [kolor-main świata] Color: --color-text-primary Font: --font-h3 Padding: 20px 32px Display: flex, align-items: center, gap: 16px Cursor: pointer

Zawartość:

Ikona gry: 40×40px, po lewej

Nazwa gry: tekst, po prawej ikony

Stan hover: Background: [kolor-bg świata] Transform: scale(1.02) Border-color: [kolor-hover świata] Transition: 0.15s ease-out

Stan active: Transform: scale(0.98)

### Przycisk gry zewnętrznej (Mgła)

Identyczny jak "Przycisk wyboru gry" z następującymi różnicami: Border-style: dashed Dodaj ikonę ↗ (external link) po prawej stronie: 20px, --color-text-secondary

### Przycisk powrotu

Position: fixed, top: 32px, left: 40px Font: --font-h3 / weight 700 Color: [kolor-main aktywnego świata] Display: flex, align-items: center, gap: 12px Cursor: pointer Min tap area: 48×48px Ikona ←: 24px

Stan hover: Opacity: 0.75 Transition: 0.15s ease-out

### Modal (przejście do zewnętrznej aplikacji)

Overlay: rgba(0, 0, 0, 0.55) Background: #FFFFFF Border-radius: 32px Padding: 56px Width: 560px Text-align: center Box-shadow: --shadow-modal

Zawartość:

Ikona: 96×96px

Tytuł: --font-h2, --color-text-primary

Opis: --font-body, --color-text-secondary

Dwa przyciski: "← Zostań" (secondary) i "Wchodzimy! 🚀" (primary)

Animacja wejścia: From: opacity(0) + scale(0.85) To: opacity(1) + scale(1.0) Duration: 250ms, ease-out

---

## ANIMACJE

--transition-fast: 150ms ease-out --transition-normal: 220ms ease-out --transition-slow: 280ms ease-out

### Biblioteka przejść

| Nazwa        | Opis                                            | Czas  |
| ------------ | ----------------------------------------------- | ----- |
| card-bounce  | scale(0.97) → scale(1.03) → scale(1.0)          | 220ms |
| screen-enter | translateX(100%) → translateX(0) + opacity(0→1) | 280ms |
| screen-exit  | translateX(0) → translateX(-30%) + opacity(1→0) | 280ms |
| modal-enter  | scale(0.85)+opacity(0) → scale(1)+opacity(1)    | 250ms |
| button-press | scale(0.97)                                     | 100ms |
| fade-in      | opacity(0) → opacity(1)                         | 200ms |

### Zasady animacji

- Easing zawsze ease-out — naturalny, fizyczny ruch
- Animacje tylko jako reakcja na akcję użytkownika — brak autoplay
- Obsługa prefers-reduced-motion — wyłącz transform, zachowaj fade
- Brak migających elementów

---

## IKONY

Styl: Filled/Solid — nie outline Biblioteka: Phosphor Icons (https://phosphoricons.com) Format: SVG

### Przypisanie ikon

| Element            | Ikona Phosphor  | Rozmiar |
| ------------------ | --------------- | ------- |
| Świat Wyzwań       | Lightning       | 96px    |
| Świat Odkrywania   | MagnifyingGlass | 96px    |
| Świat Relaksu      | Leaf            | 96px    |
| Architekci na czas | Cube            | 40px    |
| Literowe Memory    | TextAa          | 40px    |
| Mgła               | Cloud           | 40px    |
| Prawda czy Fałsz   | Question        | 40px    |
| Oddech Smoka       | Wind            | 40px    |
| Link zewnętrzny    | ArrowSquareOut  | 20px    |
| Powrót             | ArrowLeft       | 24px    |
| Zamknij modal      | X               | 24px    |

### Zasady ikon

- Każda gra ma unikalną, stałą ikonę
- Ikona zawsze towarzyszy tekstowi — nigdy sama
- Kolor ikony = kolor-main aktywnego świata lub #FFFFFF na kolorowym tle

---

## EKRANY I NAWIGACJA

### Struktura ekranów

Ekran 1: START Hasło główne + 3 karty Światów

Ekran 2A: ŚWIAT WYZWAŃ Nagłówek świata + 1 przycisk gry (Architekci na czas)

Ekran 2B: ŚWIAT ODKRYWANIA Nagłówek świata + 3 przyciski gier (Literowe Memory, Mgła↗, Prawda czy Fałsz)

Ekran 2C: ŚWIAT RELAKSU Nagłówek świata + 1 przycisk gry (Oddech Smoka)

Modal: PRZEJŚCIE ZEWNĘTRZNE Pojawia się nad ekranem 2B po kliknięciu Mgła

### Zasady nawigacji

- Przycisk powrotu zawsze widoczny na ekranach 2A, 2B, 2C
- Animacja wejścia w prawo, powrót w lewo — stały kierunek
- Kliknięcie Mgła otwiera modal z potwierdzeniem przed otwarciem zewnętrznego linku
- Aplikacja pracuje w trybie fullscreen — brak elementów przeglądarki
- Maksymalnie 2 kliknięcia od ekranu startowego do uruchomienia gry

---

## TYP KOMUNIKATÓW

Pozytywne: "Brawo!", "Świetnie!", "Zaczynamy!", "Wchodzimy!" Neutralne: "Wróć", "Zostań", "Wybierz" Błędy: nigdy "Błąd" — zawsze "Spróbuj jeszcze raz!" lub "Prawie!" Forma: bezpośrednia "ty/wy", krótkie zdania max 6–8 słów Caps: tylko główne hasło na ekranie startowym

---

## DOSTĘPNOŚĆ

Kontrast tekstu: min. 4.5:1 (WCAG AA) Kontrast dużego tekstu: min. 3:1 Focus visible: outline 3px, offset 2px, kolor kontrastowy Aria-label: wszystkie przyciski i ikony mają aria-label prefers-reduced-motion: wyłącz transform, zachowaj opacity transitions Kolor: nigdy jedynym nośnikiem informacji

---

## EKRAN STARTOWY — SPECYFIKACJA

Layout: flex column, justify-content: center, align-items: center pełny ekran 1920×1080px Background: --color-bg (#F5F0E8)

Hasło główne: Tekst: "NA CO JESTEŚCIE GOTOWI?" Font: --font-display (112px, weight 900) Color: --color-text-primary Margin-bottom: --space-xxxl (80px)

Kontener kart: Display: flex Gap: 40px Padding: 0 80px Width: 100%

## EKRAN 2 — SPECYFIKACJA (Wybór gry)

Layout: flex column, justify-content: center, align-items: center pełny ekran 1920×1080px Background: --color-bg (#F5F0E8)

Przycisk powrotu: Position: fixed, top: 32px, left: 40px

Nagłówek świata: Ikona: 96×96px, kolor-main świata Tytuł: --font-h1, kolor-main świata Margin-bottom: --space-xxl (64px)

Kontener przycisków gier: Display: flex, flex-direction: column Gap: --space-m (24px) Width: 640px Margin: 0 auto

### Ekran 2A — Świat Wyzwań

Kolor aktywny: --color-challenge- Ikona: Lightning, 96px, #FF8C42 Tytuł: "ŚWIAT WYZWAŃ"

Przyciski:

[Cube 40px] Architekci na czas → uruchamia grę

### Ekran 2B — Świat Odkrywania

Kolor aktywny: --color-discovery- Ikona: MagnifyingGlass, 96px, #6A9FD8 Tytuł: "ŚWIAT ODKRYWANIA"

Przyciski:

[TextAa 40px] Literowe Memory → uruchamia grę

[Cloud 40px] Mgła ↗ → otwiera modal (dashed border)

[Question 40px] Prawda czy Fałsz? → uruchamia grę

### Ekran 2C — Świat Relaksu

Kolor aktywny: --color-relax- Ikona: Leaf, 96px, #4ECDC4 Tytuł: "ŚWIAT RELAKSU"

Przyciski:

[Wind 40px] Oddech Smoka → uruchamia grę

---

## MODAL — SPECYFIKACJA

Trigger: kliknięcie przycisku "Mgła" na ekranie 2B

Overlay: Background: rgba(0, 0, 0, 0.55) Position: fixed, inset: 0 Z-index: 100 Display: flex, justify-content: center, align-items: center

Modal box: Background: #FFFFFF Border-radius: --radius-modal (32px) Padding: 56px Width: 560px Text-align: center Box-shadow: --shadow-modal

Zawartość (od góry):

Ikona Cloud: 96×96px, #6A9FD8

Tytuł: "Zaraz przejdziesz do gry Mgła!" --font-h2, --color-text-primary, margin-top: 24px

Opis: "Otworzy się osobna aplikacja." --font-body, --color-text-secondary, margin-top: 16px

Przyciski: flex, gap: 16px, margin-top: 40px, justify-content: center

Przycisk "← Zostań": Background: transparent Border: 3px solid --color-discovery-main Color: --color-discovery-main Font: --font-button Height: 72px Padding: 16px 40px Border-radius: 999px

Przycisk "Wchodzimy! 🚀": Background: --color-discovery-main Color: #FFFFFF Font: --font-button Height: 72px Padding: 16px 40px Border-radius: 999px

Animacja wejścia: From: opacity(0) + scale(0.85) To: opacity(1) + scale(1.0) Duration: 250ms ease-out

Animacja wyjścia: From: opacity(1) + scale(1.0) To: opacity(0) + scale(0.85) Duration: 200ms ease-in

Zamknięcie:

przycisk "← Zostań"

klawisz Escape

kliknięcie overlay

---

## CSS VARIABLES — PEŁNA LISTA

```css
:root {
  /* Tło */
  --color-bg: #f5f0e8;

  /* Neutralne */
  --color-text-primary: #2d2d2d;
  --color-text-secondary: #6b6b6b;
  --color-divider: #d4d4d4;

  /* Świat Wyzwań */
  --color-challenge-main: #ff8c42;
  --color-challenge-accent: #e6a800;
  --color-challenge-hover: #e67320;
  --color-challenge-bg: #fff0e0;
  --color-challenge-border: #ff8c42;

  /* Świat Odkrywania */
  --color-discovery-main: #6a9fd8;
  --color-discovery-accent: #b388ff;
  --color-discovery-hover: #4a7fb5;
  --color-discovery-bg: #d6e8ff;
  --color-discovery-border: #6a9fd8;

  /* Świat Relaksu */
  --color-relax-main: #4ecdc4;
  --color-relax-accent: #95d5b2;
  --color-relax-hover: #3aafa6;
  --color-relax-bg: #edfaf9;
  --color-relax-border: #4ecdc4;

  /* Systemowe */
  --color-success: #5cb85c;
  --color-warning: #e6a800;
  --color-error: #d9534f;

  /* Typografia */
  --font-family: "Nunito", sans-serif;
  --font-display: 900 112px/1.1 "Nunito", sans-serif;
  --font-h1: 800 72px/1.2 "Nunito", sans-serif;
  --font-h2: 700 52px/1.3 "Nunito", sans-serif;
  --font-h3: 700 36px/1.3 "Nunito", sans-serif;
  --font-button: 800 32px/1 "Nunito", sans-serif;
  --font-body: 400 28px/1.5 "Nunito", sans-serif;
  --font-caption: 600 22px/1.4 "Nunito", sans-serif;

  /* Spacing */
  --space-xs: 8px;
  --space-s: 16px;
  --space-m: 24px;
  --space-l: 32px;
  --space-xl: 48px;
  --space-xxl: 64px;
  --space-xxxl: 80px;

  /* Border radius */
  --radius-card: 28px;
  --radius-button: 999px;
  --radius-button-secondary: 16px;
  --radius-modal: 32px;

  /* Cienie */
  --shadow-card: 0px 8px 24px rgba(0, 0, 0, 0.1);
  --shadow-card-hover: 0px 12px 32px rgba(0, 0, 0, 0.18);
  --shadow-modal: 0px 16px 48px rgba(0, 0, 0, 0.24);

  /* Border */
  --border-width: 4px;

  /* Animacje */
  --transition-fast: 150ms ease-out;
  --transition-normal: 220ms ease-out;
  --transition-slow: 280ms ease-out;
}
STRUKTURA PLIKÓW (sugerowana)


/src
  /components
    WorldCard.jsx          — karta Świata na ekranie głównym
    GameButton.jsx         — przycisk wyboru gry na ekranie 2
    BackButton.jsx         — przycisk powrotu
    ExternalModal.jsx      — modal potwierdzenia dla Mgły
  /screens
    StartScreen.jsx        — ekran główny "NA CO JESTEŚCIE GOTOWI?"
    WorldScreen.jsx        — ekran 2 (przyjmuje dane świata jako props)
  /styles
    design-tokens.css      — CSS variables (sekcja powyżej)
    global.css             — reset, body, fullscreen
  /data
    worlds.js              — dane światów (nazwy, kolory, ikony, gry)
  /assets
    /icons                 — SVG z Phosphor Icons
worlds.js — struktura danych


export const worlds = [
  {
    id: "challenge",
    name: "Świat Wyzwań",
    icon: "Lightning",
    colorMain:   "#FF8C42",
    colorHover:  "#E67320",
    colorBg:     "#FFF0E0",
    colorBorder: "#FF8C42",
    games: [
      {
        id: "architects",
        name: "Architekci na czas",
        icon: "Cube",
        external: false,
        url: null
      }
    ]
  },
  {
    id: "discovery",
    name: "Świat Odkrywania",
    icon: "MagnifyingGlass",
    colorMain:   "#6A9FD8",
    colorHover:  "#4A7FB5",
    colorBg:     "#D6E8FF",
    colorBorder: "#6A9FD8",
    games: [
      {
        id: "memory",
        name: "Literowe Memory",
        icon: "TextAa",
        external: false,
        url: null
      },
      {
        id: "fog",
        name: "Mgła",
        icon: "Cloud",
        external: true,
        url: "WSTAW_URL"
      },
      {
        id: "truefalse",
        name: "Prawda czy Fałsz?",
        icon: "Question",
        external: false,
        url: null
      }
    ]
  },
  {
    id: "relax",
    name: "Świat Relaksu",
    icon: "Leaf",
    colorMain:   "#4ECDC4",
    colorHover:  "#3AAFA6",
    colorBg:     "#EDFAF9",
    colorBorder: "#4ECDC4",
    games: [
      {
        id: "dragon",
        name: "Oddech Smoka",
        icon: "Wind",
        external: false,
        url: null
      }
    ]
  }
]
GLOBAL CSS


*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body,
#root {
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  background: var(--color-bg);
  font-family: var(--font-family);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
}

/* Fullscreen API — aplikacja startuje w trybie pełnoekranowym */
:fullscreen,
:-webkit-full-screen {
  width: 100vw;
  height: 100vh;
}

/* Focus visible — dla dostępności klawiaturowej */
:focus-visible {
  outline: 3px solid currentColor;
  outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
