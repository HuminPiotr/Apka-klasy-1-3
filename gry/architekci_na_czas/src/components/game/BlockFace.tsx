import type { FaceMood } from "@/game/types";

interface Props {
  mood: FaceMood;
  /** Środek twarzy w jednostkach viewBoxa rodzica. */
  cx: number;
  cy: number;
  /** Skala twarzy względem domyślnego rozmiaru (eyeR=6). */
  scale?: number;
  /** Czy klocek jest właśnie na samej górze (silniejsze drżenie). */
  isTop?: boolean;
}

/**
 * Twarzyczka klocka — rysowana w SVG współrzędnych rodzica.
 * Rodzic musi mieć `overflow: visible` jeśli twarz wykracza.
 *
 * Mood mapping:
 *   happy   ^ ^   ‿   (mały uśmiech)
 *   calm    • •   ‿   (lekki uśmieszek)
 *   nervous • •   ―   (płaska linia)
 *   scared  ◯ ◯   o   (otwarte usta okrągłe)
 *   panic   ✕ ✕   O   (zaciśnięte oczy + krzyk, drżenie)
 */
export function BlockFace({ mood, cx, cy, scale = 1, isTop }: Props) {
  const stroke = "hsl(var(--foreground))";
  const sw = 2.2;

  const eyeDx = 11 * scale;
  const eyeR = 5.5 * scale;
  const pupilR = 2.6 * scale;
  const eyeY = cy;
  const leftX = cx - eyeDx;
  const rightX = cx + eyeDx;

  // Mouth Y poniżej oczu
  const mouthY = cy + 11 * scale;
  const mouthW = 12 * scale;

  const wrapAnim =
    mood === "panic" ? (isTop ? "animate-face-shake-strong" : "animate-face-shake")
    : mood === "scared" ? "animate-face-tremor"
    : "";

  const eyeAnim = (mood === "calm" || mood === "nervous" || mood === "happy") ? "animate-face-blink" : "";

  // Rendering oczu i ust w zależności od mood
  let eyes: JSX.Element;
  let mouth: JSX.Element;

  switch (mood) {
    case "happy":
      eyes = (
        <g className={eyeAnim} style={{ transformOrigin: `${cx}px ${eyeY}px` }}>
          {/* uśmiechnięte oczy ^ ^ */}
          <path d={`M ${leftX - eyeR} ${eyeY + 1} Q ${leftX} ${eyeY - eyeR} ${leftX + eyeR} ${eyeY + 1}`}
                stroke={stroke} strokeWidth={sw + 0.4} strokeLinecap="round" fill="none" />
          <path d={`M ${rightX - eyeR} ${eyeY + 1} Q ${rightX} ${eyeY - eyeR} ${rightX + eyeR} ${eyeY + 1}`}
                stroke={stroke} strokeWidth={sw + 0.4} strokeLinecap="round" fill="none" />
        </g>
      );
      mouth = (
        <path d={`M ${cx - mouthW / 2} ${mouthY} Q ${cx} ${mouthY + 6 * scale} ${cx + mouthW / 2} ${mouthY}`}
              stroke={stroke} strokeWidth={sw + 0.3} strokeLinecap="round" fill="none" />
      );
      break;

    case "calm":
      eyes = (
        <g className={eyeAnim} style={{ transformOrigin: `${cx}px ${eyeY}px` }}>
          <circle cx={leftX} cy={eyeY} r={eyeR} fill="white" stroke={stroke} strokeWidth={sw} />
          <circle cx={rightX} cy={eyeY} r={eyeR} fill="white" stroke={stroke} strokeWidth={sw} />
          <circle cx={leftX} cy={eyeY + 1} r={pupilR} fill={stroke} />
          <circle cx={rightX} cy={eyeY + 1} r={pupilR} fill={stroke} />
        </g>
      );
      mouth = (
        <path d={`M ${cx - mouthW / 2} ${mouthY} Q ${cx} ${mouthY + 4 * scale} ${cx + mouthW / 2} ${mouthY}`}
              stroke={stroke} strokeWidth={sw + 0.2} strokeLinecap="round" fill="none" />
      );
      break;

    case "nervous":
      eyes = (
        <g className={eyeAnim} style={{ transformOrigin: `${cx}px ${eyeY}px` }}>
          <circle cx={leftX} cy={eyeY} r={eyeR} fill="white" stroke={stroke} strokeWidth={sw} />
          <circle cx={rightX} cy={eyeY} r={eyeR} fill="white" stroke={stroke} strokeWidth={sw} />
          {/* źrenice w górę = patrzy nerwowo */}
          <circle cx={leftX} cy={eyeY - 1.5} r={pupilR} fill={stroke} />
          <circle cx={rightX} cy={eyeY - 1.5} r={pupilR} fill={stroke} />
        </g>
      );
      mouth = (
        <line x1={cx - mouthW / 2} y1={mouthY} x2={cx + mouthW / 2} y2={mouthY}
              stroke={stroke} strokeWidth={sw + 0.2} strokeLinecap="round" />
      );
      break;

    case "scared":
      eyes = (
        <g>
          {/* oczy szeroko otwarte, lekko trzęsące */}
          <g className="animate-face-tremor" style={{ transformOrigin: `${leftX}px ${eyeY}px` }}>
            <circle cx={leftX} cy={eyeY} r={eyeR + 1} fill="white" stroke={stroke} strokeWidth={sw} />
            <circle cx={leftX} cy={eyeY} r={pupilR - 0.3} fill={stroke} />
          </g>
          <g className="animate-face-tremor" style={{ transformOrigin: `${rightX}px ${eyeY}px`, animationDelay: "0.07s" }}>
            <circle cx={rightX} cy={eyeY} r={eyeR + 1} fill="white" stroke={stroke} strokeWidth={sw} />
            <circle cx={rightX} cy={eyeY} r={pupilR - 0.3} fill={stroke} />
          </g>
        </g>
      );
      mouth = (
        <ellipse cx={cx} cy={mouthY + 1} rx={3.5 * scale} ry={4 * scale}
                 fill={stroke} />
      );
      break;

    case "panic":
      eyes = (
        <g>
          {/* zaciśnięte oczy ✕ ✕ */}
          <g stroke={stroke} strokeWidth={sw + 0.6} strokeLinecap="round">
            <line x1={leftX - eyeR} y1={eyeY - eyeR} x2={leftX + eyeR} y2={eyeY + eyeR} />
            <line x1={leftX - eyeR} y1={eyeY + eyeR} x2={leftX + eyeR} y2={eyeY - eyeR} />
            <line x1={rightX - eyeR} y1={eyeY - eyeR} x2={rightX + eyeR} y2={eyeY + eyeR} />
            <line x1={rightX - eyeR} y1={eyeY + eyeR} x2={rightX + eyeR} y2={eyeY - eyeR} />
          </g>
        </g>
      );
      mouth = (
        <ellipse cx={cx} cy={mouthY + 2} rx={5 * scale} ry={6 * scale}
                 fill={stroke} />
      );
      break;
  }

  return (
    <g className={wrapAnim} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      {eyes}
      {mouth}
    </g>
  );
}
