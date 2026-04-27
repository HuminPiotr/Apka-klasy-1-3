import { Button } from "@/components/ui/button";
import {
  Pause,
  Play,
  Lightbulb,
  UsersThree,
  StopCircle,
  Eye,
} from "@phosphor-icons/react";

interface TeacherBarProps {
  turn: number;
  found: number;
  total: number;
  paused: boolean;
  currentPlayer?: string;
  onTogglePause: () => void;
  onPickPlayer: () => void;
  onHint: () => void;
  onFlash: () => void;
  onEnd: () => void;
}

export function TeacherBar({
  turn,
  found,
  total,
  paused,
  currentPlayer,
  onTogglePause,
  onPickPlayer,
  onHint,
  onFlash,
  onEnd,
}: TeacherBarProps) {
  return (
    <div className="sticky top-0 z-20 bg-card/80 backdrop-blur-md border-b border-border shrink-0">
      <div className="mx-auto max-w-7xl px-3 md:px-4 py-2 flex items-center gap-2 md:gap-3">
        <div className="flex items-center gap-3 md:gap-4 mr-auto min-w-0">
          <div className="flex flex-col">
            <span className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground">Tura</span>
            <span className="font-display text-xl md:text-2xl text-primary leading-none">{turn}</span>
          </div>
          <div className="h-8 md:h-10 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground">Pary</span>
            <span className="font-display text-xl md:text-2xl text-primary leading-none">
              {found}<span className="text-muted-foreground text-sm md:text-base">/{total}</span>
            </span>
          </div>
          {currentPlayer && (
            <>
              <div className="h-8 md:h-10 w-px bg-border hidden sm:block" />
              <div className="hidden sm:flex flex-col min-w-0">
                <span className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground">Odkrywacz</span>
                <span className="font-display text-lg md:text-xl text-accent leading-none truncate">{currentPlayer}</span>
              </div>
            </>
          )}
        </div>

        <Button variant="outline" size="sm" onClick={onPickPlayer} className="rounded-full px-2 md:px-3" title="Następny Odkrywacz">
          <UsersThree weight="duotone" />
          <span className="hidden lg:inline">Następny</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onFlash} className="rounded-full px-2 md:px-3" title="Pokaż wszystkie karty">
          <Eye weight="duotone" />
          <span className="hidden lg:inline">Flash</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onHint} className="rounded-full px-2 md:px-3" title="Podpowiedź">
          <Lightbulb weight="duotone" />
          <span className="hidden lg:inline">Podpowiedź</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onTogglePause} className="rounded-full px-2 md:px-3" title={paused ? "Wznów" : "Pauza"}>
          {paused ? <Play weight="fill" /> : <Pause weight="fill" />}
          <span className="hidden lg:inline">{paused ? "Wznów" : "Pauza"}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onEnd} className="rounded-full px-2 md:px-3 text-destructive hover:text-destructive" title="Zakończ grę">
          <StopCircle weight="duotone" />
          <span className="hidden lg:inline">Zakończ</span>
        </Button>
      </div>
    </div>
  );
}
