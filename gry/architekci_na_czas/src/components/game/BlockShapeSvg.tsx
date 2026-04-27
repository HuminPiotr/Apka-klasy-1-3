import type { BlockShape, FaceMood } from "@/game/types";
import { BlockFace } from "./BlockFace";

interface Props {
  shape: BlockShape;
  width?: number;
  height?: number;
  className?: string;
  /** Jeśli podane — w środku korpusu rysowana jest twarz w danym nastroju. */
  mood?: FaceMood;
  /** Czy ten klocek jest aktualnie na samej górze wieży (silniejsze drżenie w panice). */
  isTop?: boolean;
}

const STROKE = "hsl(var(--foreground))";
const COLORS: Record<BlockShape, string> = {
  square: "hsl(var(--block-square))",
  rect: "hsl(var(--block-rect))",
  roof: "hsl(var(--block-roof))",
  funnel: "hsl(var(--block-funnel))",
  tower: "hsl(var(--block-tower))",
  castle: "hsl(var(--block-castle))",
  dome: "hsl(var(--block-dome))",
  trapezoid: "hsl(var(--block-trapezoid))",
  rhombus: "hsl(var(--block-rhombus))",
  lego: "hsl(var(--block-lego))",
};

/** Pozycja środka twarzy w jednostkach viewBoxa danego kształtu + skala. */
const FACE_POS: Record<BlockShape, { cx: number; cy: number; scale: number }> = {
  square:    { cx: 50, cy: 56, scale: 1.0 },
  rect:      { cx: 80, cy: 38, scale: 0.95 },
  roof:      { cx: 50, cy: 70, scale: 0.85 }, // trójkąt — twarz nisko
  funnel:    { cx: 50, cy: 32, scale: 0.85 }, // odwrócony — twarz wysoko
  tower:     { cx: 50, cy: 56, scale: 0.95 },
  castle:    { cx: 50, cy: 60, scale: 1.0 },
  dome:      { cx: 50, cy: 70, scale: 0.95 },
  trapezoid: { cx: 70, cy: 48, scale: 0.95 },
  rhombus:   { cx: 50, cy: 50, scale: 0.85 },
  lego:      { cx: 50, cy: 50, scale: 0.95 },
};

/**
 * Klocki rysowane tak, aby ich krawędzie GÓRNA i DOLNA dotykały
 * brzegów viewBoxa (y=0 i y=100). Dzięki temu w wieży klocki stykają
 * się ze sobą bez wizualnej przerwy. Knob/wypustki wystają poza
 * viewBox górą (ujemne y) i są obsługiwane przez `overflow visible`
 * + ujemny margines w Tower.
 */
export function BlockShapeSvg({ shape, width = 80, height = 80, className, mood, isTop }: Props) {
  const fill = COLORS[shape];
  const sw = 4;
  const common = { fill, stroke: STROKE, strokeWidth: sw, strokeLinejoin: "round" as const };
  const fp = FACE_POS[shape];
  const face = mood ? <BlockFace mood={mood} cx={fp.cx} cy={fp.cy} scale={fp.scale} isTop={isTop} /> : null;

  switch (shape) {
    case "square":
      return (
        <svg width={width} height={height} viewBox="-2 -2 104 104" className={className} style={{ overflow: "visible" }}>
          <rect x="2" y="0" width="96" height="100" rx="6" {...common} />
          {face}
        </svg>
      );

    case "rect":
      return (
        <svg width={width * 1.6} height={height * 0.7} viewBox="-2 -2 164 74" className={className} style={{ overflow: "visible" }}>
          <rect x="2" y="0" width="156" height="70" rx="6" {...common} />
          {face}
        </svg>
      );

    case "roof":
      // Trójkąt — peak góra (y=0), flat dół (y=100)
      return (
        <svg width={width} height={height} viewBox="-2 -2 104 104" className={className} style={{ overflow: "visible" }}>
          <polygon points="50,0 100,100 0,100" {...common} />
          {face}
        </svg>
      );

    case "funnel":
      // Trójkąt odwrócony — flat góra (y=0), peak dół (y=100)
      return (
        <svg width={width} height={height} viewBox="-2 -2 104 104" className={className} style={{ overflow: "visible" }}>
          <polygon points="0,0 100,0 50,100" {...common} />
          {face}
        </svg>
      );

    case "tower": {
      // Wieżyczka — knob WYSTAJE ponad y=0, korpus zaczyna się od y=0
      return (
        <svg width={width} height={height} viewBox="-2 -16 104 116" className={className} style={{ overflow: "visible" }}>
          <rect x="38" y="-14" width="24" height="16" rx="3" {...common} />
          <rect x="2" y="0" width="96" height="100" rx="6" {...common} />
          {face}
        </svg>
      );
    }

    case "castle":
      return (
        <svg width={width} height={height} viewBox="-2 -2 104 104" className={className} style={{ overflow: "visible" }}>
          <path
            d="M 0 0 L 36 0 L 36 22 L 64 22 L 64 0 L 100 0 L 100 100 L 0 100 Z"
            {...common}
          />
          {face}
        </svg>
      );

    case "dome":
      return (
        <svg width={width} height={height} viewBox="-2 -2 104 104" className={className} style={{ overflow: "visible" }}>
          <path d="M 0 100 L 0 50 A 50 50 0 0 1 100 50 L 100 100 Z" {...common} />
          {face}
        </svg>
      );

    case "trapezoid":
      return (
        <svg width={width * 1.4} height={height * 0.8} viewBox="-2 -2 144 84" className={className} style={{ overflow: "visible" }}>
          <polygon points="26,0 114,0 140,80 0,80" {...common} />
          {face}
        </svg>
      );

    case "rhombus":
      return (
        <svg width={width} height={height} viewBox="-2 -2 104 104" className={className} style={{ overflow: "visible" }}>
          <polygon points="50,0 100,50 50,100 0,50" {...common} />
          {face}
        </svg>
      );

    case "lego": {
      return (
        <svg width={width} height={height} viewBox="-2 -16 104 116" className={className} style={{ overflow: "visible" }}>
          <rect x="38" y="-14" width="24" height="14" rx="3" {...common} />
          <path
            d="M 0 0 L 100 0 L 100 100 L 64 100 L 64 86 L 36 86 L 36 100 L 0 100 Z"
            {...common}
          />
          {face}
        </svg>
      );
    }
  }
}
