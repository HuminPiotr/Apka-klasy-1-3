## Klocki z twarzami — Tamagotchi effect

Każdy klocek w wieży dostaje parę oczu i usta, które reagują na stan wieży. Gdy wieża stoi pewnie — spokój. Gdy się chwieje — strach. Gdy spada — komiczna panika i „aaaaa!".

### Mechanika nastrojów

Każdy klocek liczy własny **mood** na podstawie:

- **Pozycja w wieży** — im wyżej, tym bardziej nerwowy (top = zawsze najbardziej wystraszony, „samotnie na szczycie")
- **Stabilność wieży** (0–100) — wspólna dla wszystkich
- **Stan chwilowy** — ostatni fit (`click` → krótkie „💖 happy", `wobble` → przerażenie, `fall` → panika)

Skala nastrojów (5 stanów):

| Stan | Twarz | Kiedy |
|---|---|---|
| `happy` | `^_^` uśmiech | tuż po CLICK (1.2s flash), klocek pod spodem też się cieszy |
| `calm` | `• •` spokój | stabilność > 70 i nie jest na samej górze |
| `nervous` | `o o` lekko zaniepokojony | stabilność 40–70 lub jest na szczycie przy stab > 70 |
| `scared` | `O O` szeroko otwarte oczy, usta `o` | stabilność 15–40 lub szczyt przy 40–70 |
| `panic` | `>< ><` zaciśnięte + `OAO` krzyk | stabilność < 15, wobble, lub upadek |

### Animacje twarzy

- **Mruganie** — co 3–6s losowo, krótkie zamknięcie powiek (calm/nervous)
- **Drżenie oczu** — szybkie poziome trząchnięcie (scared/panic)
- **Otwarte usta krzyk** — przy fall, klocki lecące w dół mają usta `OAO` i emoji `💦`
- **Serduszka** — przy CLICK nad klockiem pod spodem unosi się małe `💖` (1s)

### Render

W `BlockShapeSvg.tsx` dodaję opcjonalny prop `face?: FaceMood` i `faceOffset?: {x,y}` (część kształtów ma środek w innym miejscu — np. roof to trójkąt). Dla każdego kształtu definiuję pozycję twarzy (`FACE_POS`) tak, aby wpadała w „korpus" klocka, nie w wypustki.

Twarz to grupa SVG: 2 oczy (białka + źrenice) + usta. Sterowanie przez prop `mood`:

```text
calm:    ●  ●     ‿
nervous: ●  ●     ―
scared:  ◯  ◯     o
panic:   ✕  ✕     O   (+ trzęsienie)
happy:   ^  ^     ‿
```

Mruganie i drżenie robię CSS-em (nowe keyframes `blink`, `tremor`, `scream-shake`) zamiast JS-owych intervalów per-klocek (perf).

### Dźwięk

- `sfx.aaaa()` — komiczne „aaaaaaa!" przy fall (krótka kaskada zstępujących tonów)
- (istniejące) `sfx.click` zostaje + nowe `sfx.kiss` (delikatny „mwah") opcjonalnie przy CLICK

### Pliki do zmian

**Nowe:**
- `src/components/game/BlockFace.tsx` — komponent SVG twarzy z propem `mood: FaceMood`

**Edycje:**
- `src/game/types.ts` — typ `FaceMood = "happy" | "calm" | "nervous" | "scared" | "panic"`
- `src/components/game/BlockShapeSvg.tsx` — przyjmuje `mood` i renderuje `<BlockFace>` w środku korpusu (per-shape `FACE_POS`)
- `src/components/game/Tower.tsx` — wylicza mood każdego klocka: `computeMood(index, totalBlocks, stability, recentEvent)`; przekazuje do `BlockShapeSvg`. Animacja serduszka po CLICK (overlay nad klockiem pod-szczytem przez 1s).
- `src/pages/Play.tsx` — po `chooseBlock` ustawia chwilowy `recentEvent: "click" | "wobble" | "fall" | null` na 1.2s, przekazuje do `Tower`. Wywołuje `sfx.aaaa()` przy fall.
- `src/game/sfx.ts` — dodaje `aaaa()` (Web Audio: opadająca pila + szum, ~600ms)
- `src/index.css` / `tailwind.config.ts` — keyframes `blink`, `tremor`, `scream-shake`, `heart-rise`

### Czego NIE zmieniamy

- Logika fitów, stabilności, punktacji, wyboru klocków — bez zmian
- Kształty SVG korpusów — bez zmian, dokładamy tylko twarz w środku
- Reszta UI (timer, panel nauczyciela, ekran końcowy) — bez zmian
