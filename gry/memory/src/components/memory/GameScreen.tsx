import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Board } from "@/components/memory/Board";
import { TeacherBar } from "@/components/memory/TeacherBar";
import { PlayerWheel } from "@/components/memory/PlayerWheel";
import { SummaryScreen } from "@/components/memory/SummaryScreen";
import { findRecord, saveRecord } from "@/game/engine";
import type { BoardCard, GameSession } from "@/game/types";
import { GAME_MODES } from "@/game/data";
import { Sparkle, Play } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface GameScreenProps {
  initialSession: GameSession;
  initialCards: BoardCard[];
  onExit: () => void;
  onPlayAgain: () => void;
}

export function GameScreen({
  initialSession,
  initialCards,
  onExit,
  onPlayAgain,
}: GameScreenProps) {
  const [session, setSession] = useState<GameSession>({ ...initialSession, status: "flashing" });
  const [cards, setCards] = useState<BoardCard[]>(initialCards);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);
  const [wheelOpen, setWheelOpen] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<string | undefined>();
  const [matchedFlash, setMatchedFlash] = useState<string | null>(null);
  const [recordInfo, setRecordInfo] = useState<{ isNewRecord: boolean; previous?: number } | null>(null);
  const flashTimerRef = useRef<number | null>(null);

  const modeMeta = GAME_MODES.find((m) => m.id === session.modeId)!;
  const gridSize = `${session.cols}x${session.rows}`;

  /* Flash startowy */
  useEffect(() => {
    if (session.status !== "flashing") return;
    flashTimerRef.current = window.setTimeout(() => {
      setSession((s) => ({ ...s, status: "playing" }));
      // od razu otwórz koło fortuny
      if (session.playerSelectionMode === "numbers") {
        setWheelOpen(true);
      }
    }, session.flashDurationSec * 1000);
    return () => {
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status]);

  /* Manualny flash */
  const triggerFlash = () => {
    if (session.status !== "playing") return;
    setSession((s) => ({ ...s, status: "flashing" }));
  };

  /* Reveal logic */
  const handleReveal = useCallback(
    (cardId: string) => {
      if (busy || paused || session.status !== "playing") return;
      if (revealedIds.includes(cardId)) return;
      const card = cards.find((c) => c.id === cardId);
      if (!card || card.state !== "hidden") return;

      const next = [...revealedIds, cardId];
      setRevealedIds(next);

      if (next.length === 2) {
        setBusy(true);
        const [aId, bId] = next;
        const a = cards.find((c) => c.id === aId)!;
        const b = cards.find((c) => c.id === bId)!;
        const isMatch = a.pairId === b.pairId && a.id !== b.id;

        const turnNumber = session.currentTurn + 1;
        setSession((s) => ({ ...s, currentTurn: turnNumber }));

        if (isMatch) {
          // Krótka pauza, potem zaznacz jako matched
          window.setTimeout(() => {
            setMatchedFlash(a.pairId);
            setCards((prev) =>
              prev.map((c) =>
                c.pairId === a.pairId ? { ...c, state: "matched" } : c,
              ),
            );
            setRevealedIds([]);
            setSession((s) => {
              const found = s.foundPairs + 1;
              const finished = found >= s.totalPairs;
              return {
                ...s,
                foundPairs: found,
                status: finished ? "finished" : s.status,
                finishedAt: finished ? Date.now() : undefined,
              };
            });
            setBusy(false);
            window.setTimeout(() => setMatchedFlash(null), 700);
          }, 350);
        } else {
          window.setTimeout(() => {
            setRevealedIds([]);
            setBusy(false);
          }, session.pauseBetweenCardsSec * 1000);
        }
      }
    },
    [busy, paused, session, revealedIds, cards],
  );

  /* Zapisz rekord po skończeniu */
  useEffect(() => {
    if (session.status === "finished" && !recordInfo) {
      const result = saveRecord({
        modeId: session.modeId,
        gridSize,
        bestTurns: session.currentTurn,
        lastPlayed: Date.now(),
      });
      const existing = findRecord(session.modeId, gridSize);
      setRecordInfo({
        isNewRecord: result.isNewRecord,
        previous: result.previous ?? (result.isNewRecord ? undefined : existing?.bestTurns),
      });
    }
  }, [session.status, session.modeId, session.currentTurn, gridSize, recordInfo]);

  /* Hint: krótko odsłoń losową niezna­lezioną kartę */
  const triggerHint = () => {
    if (session.status !== "playing" || busy) return;
    const hidden = cards.filter((c) => c.state === "hidden" && !revealedIds.includes(c.id));
    if (hidden.length === 0) return;
    const pick = hidden[Math.floor(Math.random() * hidden.length)];
    setRevealedIds((r) => [...r, pick.id]);
    setBusy(true);
    window.setTimeout(() => {
      setRevealedIds((r) => r.filter((id) => id !== pick.id));
      setBusy(false);
    }, 1000);
  };

  const matchedPair = useMemo(() => {
    if (!matchedFlash) return null;
    return cards.find((c) => c.pairId === matchedFlash);
  }, [matchedFlash, cards]);

  if (session.status === "finished") {
    return (
      <SummaryScreen
        session={session}
        isNewRecord={recordInfo?.isNewRecord ?? false}
        previousRecord={recordInfo?.previous}
        onPlayAgain={onPlayAgain}
        onNewSetup={onExit}
      />
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      <TeacherBar
        turn={session.currentTurn}
        found={session.foundPairs}
        total={session.totalPairs}
        paused={paused}
        currentPlayer={currentPlayer}
        onTogglePause={() => setPaused((p) => !p)}
        onPickPlayer={() => setWheelOpen(true)}
        onHint={triggerHint}
        onFlash={triggerFlash}
        onEnd={onExit}
      />

      <div className="px-2 md:px-6 py-2 md:py-3 flex-1 flex flex-col min-h-0">
        <div className="text-center mb-2 shrink-0">
          <span className="inline-block text-[11px] uppercase tracking-widest text-muted-foreground">
            {modeMeta.name}
          </span>
          {session.status === "flashing" && (
            <div className="font-display text-xl md:text-2xl text-accent animate-pulse-soft">
              Zapamiętujcie rozmieszczenie!
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0 w-full max-w-6xl mx-auto">
          <Board
            cards={cards}
            cols={session.cols}
            rows={session.rows}
            revealedIds={revealedIds}
            flashing={session.status === "flashing"}
            busy={busy || paused}
            onReveal={handleReveal}
          />
        </div>
      </div>

      {/* Overlay po znalezieniu pary — duża etykieta */}
      {matchedPair && (
        <div className="fixed inset-x-0 top-1/3 flex items-center justify-center pointer-events-none z-30">
          <div className="bg-accent text-accent-foreground rounded-full px-8 py-4 shadow-lift animate-scale-in flex items-center gap-3">
            <Sparkle weight="fill" className="h-6 w-6" />
            <span className="font-display text-3xl">PASUJE!</span>
          </div>
        </div>
      )}

      {paused && session.status === "playing" && (
        <div
          className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-40 flex items-center justify-center cursor-pointer"
          onClick={() => setPaused(false)}
        >
          <div className="bg-card rounded-3xl px-10 py-8 text-center shadow-lift max-w-sm mx-4">
            <h2 className="font-display text-4xl text-primary mb-2">Pauza</h2>
            <p className="text-muted-foreground mb-6">Kliknij gdziekolwiek lub przycisk poniżej, aby wznowić grę.</p>
            <Button
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                setPaused(false);
              }}
              className="rounded-full"
            >
              <Play weight="fill" className="mr-2" />
              Wznów grę
            </Button>
          </div>
        </div>
      )}

      <PlayerWheel
        open={wheelOpen}
        numberRange={
          session.playerSelectionMode === "numbers" &&
          session.numberRangeFrom != null &&
          session.numberRangeTo != null
            ? { from: session.numberRangeFrom, to: session.numberRangeTo }
            : undefined
        }
        onClose={() => setWheelOpen(false)}
        onPicked={(name) => {
          setCurrentPlayer(name ?? "Następne dziecko!");
          setWheelOpen(false);
        }}
      />
    </div>
  );
}
