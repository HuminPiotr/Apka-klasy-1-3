import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, ArrowCounterClockwise, House, Sparkle } from "@phosphor-icons/react";
import type { GameSession } from "@/game/types";

interface SummaryScreenProps {
  session: GameSession;
  isNewRecord: boolean;
  previousRecord?: number;
  onPlayAgain: () => void;
  onNewSetup: () => void;
}

const FUN_FACTS = [
  "Polski alfabet ma 32 litery — w tym 9 takich, których nie ma żaden inny alfabet (np. ą, ę, ż).",
  "Najdłuższe polskie słowo bez samogłoski to „chrząszcz”.",
  "Litera „ó” pochodzi od dawnego długiego „o”.",
  "W języku polskim jest 7 dwuznaków: ch, cz, dz, dź, dż, rz, sz.",
  "Słowo „mama” brzmi podobnie w prawie wszystkich językach świata.",
];

export function SummaryScreen({
  session,
  isNewRecord,
  previousRecord,
  onPlayAgain,
  onNewSetup,
}: SummaryScreenProps) {
  const fact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
  const time = session.finishedAt
    ? Math.round((session.finishedAt - session.startedAt) / 1000)
    : 0;
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <Sparkle weight="fill" className="h-10 w-10 text-accent mx-auto animate-pop" />
          <h1 className="text-5xl text-primary">Brawo klasa!</h1>
          <p className="text-muted-foreground">Wszystkie pary znalezione.</p>
        </div>

        <Card className="p-6 md:p-8 shadow-lift space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-4xl font-display text-primary">{session.currentTurn}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Tury</div>
            </div>
            <div>
              <div className="text-4xl font-display text-primary">{session.totalPairs}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Pary</div>
            </div>
            <div>
              <div className="text-4xl font-display text-primary">
                {minutes > 0 ? `${minutes}:${String(seconds).padStart(2, "0")}` : `${seconds}s`}
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Czas</div>
            </div>
          </div>

          <div
            className={
              "rounded-2xl p-4 flex items-center gap-4 " +
              (isNewRecord
                ? "bg-accent/10 border-2 border-accent"
                : "bg-secondary border border-border")
            }
          >
            <Trophy
              weight="duotone"
              className={"h-10 w-10 " + (isNewRecord ? "text-accent" : "text-muted-foreground")}
            />
            <div className="flex-1">
              {isNewRecord ? (
                <>
                  <div className="font-display text-lg text-primary">Nowy rekord klasy!</div>
                  <div className="text-sm text-muted-foreground">
                    {previousRecord
                      ? `Poprzedni rekord: ${previousRecord} tur. Pobity!`
                      : "Pierwszy zapisany wynik dla tej planszy."}
                  </div>
                </>
              ) : (
                <>
                  <div className="font-display text-lg text-primary">Rekord klasy: {previousRecord} tur</div>
                  <div className="text-sm text-muted-foreground">
                    Spróbujcie jeszcze raz, żeby go pobić!
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-primary/5 border border-primary/10">
            <div className="text-xs uppercase tracking-wider text-primary/70 mb-1">Ciekawostka</div>
            <p className="text-sm text-foreground">{fact}</p>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onPlayAgain} size="lg" className="rounded-full px-6">
            <ArrowCounterClockwise weight="bold" className="h-5 w-5" />
            Graj ponownie
          </Button>
          <Button onClick={onNewSetup} size="lg" variant="outline" className="rounded-full px-6">
            <House weight="bold" className="h-5 w-5" />
            Nowe ustawienia
          </Button>
        </div>
      </div>
    </div>
  );
}
