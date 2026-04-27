import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { BoardCard } from "@/game/types";
import { MemoryCard } from "./MemoryCard";

interface BoardProps {
  cards: BoardCard[];
  cols: number;
  rows: number;
  revealedIds: string[];
  flashing: boolean;
  busy: boolean;
  onReveal: (cardId: string) => void;
}

const CARD_ASPECT = 4 / 5; // szer / wys

/**
 * Plansza, która ZAWSZE mieści się w dostępnym kontenerze.
 * Liczymy maksymalny rozmiar karty z proporcji 4:5 i ograniczeń wymiarów rodzica,
 * żeby cała siatka była widoczna bez scrollowania.
 */
export function Board({ cards, cols, rows, revealedIds, flashing, busy, onReveal }: BoardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      // Wewnętrzny padding planszy (p-3 md:p-4 = 12/16 px) + gap między kartami
      const isMd = window.innerWidth >= 768;
      const pad = isMd ? 16 : 12;
      const gap = isMd ? 12 : 8;

      const availW = rect.width - pad * 2 - gap * (cols - 1);
      const availH = rect.height - pad * 2 - gap * (rows - 1);
      if (availW <= 0 || availH <= 0) return;

      // Maksymalna szerokość karty z ograniczenia szer.
      const wFromW = availW / cols;
      // Maksymalna szerokość karty z ograniczenia wys. (h = w/aspect)
      const wFromH = (availH / rows) * CARD_ASPECT;

      const w = Math.floor(Math.min(wFromW, wFromH));
      const h = Math.floor(w / CARD_ASPECT);
      setCardSize({ w, h });
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [cols, rows]);

  const sorted = [...cards].sort((a, b) => a.row * cols + a.col - (b.row * cols + b.col));

  return (
    <div ref={wrapRef} className="w-full h-full flex items-center justify-center">
      <div
        className={cn(
          "rounded-3xl p-3 md:p-4 bg-card/60 shadow-paper border border-border",
          "grid gap-2 md:gap-3",
        )}
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cardSize ? `${cardSize.w}px` : "1fr"})`,
          gridTemplateRows: `repeat(${rows}, ${cardSize ? `${cardSize.h}px` : "1fr"})`,
          visibility: cardSize ? "visible" : "hidden",
        }}
      >
        {sorted.map((card) => {
          const faceUp = flashing || revealedIds.includes(card.id) || card.state === "matched";
          return (
            <MemoryCard
              key={card.id}
              card={card}
              faceUp={faceUp}
              flashing={flashing}
              disabled={busy || flashing || revealedIds.includes(card.id)}
              onClick={() => onReveal(card.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
