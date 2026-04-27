import { cn } from "@/lib/utils";
import type { BoardCard } from "@/game/types";
import * as Phosphor from "@phosphor-icons/react";
import { Star } from "@phosphor-icons/react";

interface MemoryCardProps {
  card: BoardCard;
  faceUp: boolean;
  disabled?: boolean;
  onClick?: () => void;
  /** Tryb flash startowy — wszystkie karty odkryte z większą animacją */
  flashing?: boolean;
}

function getFaceClasses(card: BoardCard): string {
  switch (card.kind) {
    case "upper":
      return "bg-card-upper text-card-upper-foreground";
    case "lower":
      return "bg-card-lower text-card-lower-foreground";
    case "letter":
      return "bg-card-letter text-card-letter-foreground";
    case "image":
      return "bg-card-image text-card-image-foreground";
    case "syllable_start":
      return "bg-card-syllable-start text-card-syllable-start-foreground";
    case "syllable_end":
      return "bg-card-syllable-end text-card-syllable-end-foreground";
  }
}

function PhosphorIcon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null;
  const Icon = (Phosphor as unknown as Record<string, React.ComponentType<{ weight?: string; className?: string }>>)[name];
  if (!Icon) return null;
  return <Icon weight="duotone" className={className} />;
}

export function MemoryCard({ card, faceUp, disabled, onClick, flashing }: MemoryCardProps) {
  const isMatched = card.state === "matched";
  const showFront = faceUp || isMatched;

  const isImage = card.kind === "image";
  const isSyllable = card.kind === "syllable_start" || card.kind === "syllable_end";
  const isLetter = card.kind === "upper" || card.kind === "lower" || card.kind === "letter";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isMatched}
      aria-label={`Karta ${showFront ? card.content : "zakryta"}`}
      className={cn(
        "perspective group relative h-full w-full select-none",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 rounded-2xl",
        "transition-transform duration-200",
        !disabled && !isMatched && "hover:-translate-y-1 active:translate-y-0",
        isMatched && "opacity-0 scale-90 pointer-events-none transition-all duration-500",
      )}
    >
      <div
        className={cn(
          "preserve-3d relative h-full w-full transition-transform duration-300",
          showFront && "rotate-y-180",
        )}
      >
        {/* Rewers */}
        <div
          className={cn(
            "backface-hidden absolute inset-0 rounded-2xl shadow-card-paper",
            "bg-card-back text-card-back-foreground",
            "flex items-center justify-center overflow-hidden",
            "border border-[hsl(222_45%_15%)]",
          )}
        >
          <div className="absolute inset-2 rounded-xl border border-card-back-foreground/20" />
          <Star
            weight="fill"
            className={cn(
              "h-1/2 w-1/2 animate-pulse-soft",
              flashing && "animate-spin-slow",
            )}
          />
        </div>

        {/* Awers */}
        <div
          className={cn(
            "backface-hidden rotate-y-180 absolute inset-0 rounded-2xl shadow-lift overflow-hidden",
            "flex flex-col items-center justify-center p-2",
            getFaceClasses(card),
            isMatched && "ring-4 ring-accent",
          )}
        >
          {isLetter && (
            <span
              className="font-school leading-none"
              style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
            >
              {card.content}
            </span>
          )}

          {isImage && (
            <>
              <PhosphorIcon name={card.iconName} className="h-[55%] w-[55%]" />
              {card.caption && (
                <span className="mt-1 font-school text-2xl md:text-3xl">
                  <strong className="font-black underline decoration-2 underline-offset-4">
                    {card.caption.charAt(0)}
                  </strong>
                  {card.caption.slice(1)}
                </span>
              )}
            </>
          )}

          {isSyllable && (
            <span
              className="font-school leading-none text-center px-1 break-words max-w-full"
              style={{ fontSize: "clamp(1.4rem, 4.2vw, 3.2rem)" }}
            >
              {card.content}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
