import { BlockShapeSvg } from "./BlockShapeSvg";
import { BLOCK_LABELS } from "@/game/blocks";
import type { BlockShape } from "@/game/types";

interface Props {
  block: BlockShape;
  top: BlockShape | null;
  onClick: () => void;
  /** Zachowane dla kompatybilności — nieużywane. */
  showHint?: boolean;
}

export function BlockChoice({ block, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center rounded-2xl bg-card p-3 cartoon-border cartoon-shadow transition-transform hover:-translate-y-1 hover:scale-105"
    >
      <div className="flex h-[80px] items-center justify-center">
        <BlockShapeSvg shape={block} width={70} height={70} />
      </div>
      <div className="mt-1 font-display text-sm">{BLOCK_LABELS[block]}</div>
    </button>
  );
}

