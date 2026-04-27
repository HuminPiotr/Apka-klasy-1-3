import { useEffect, useState } from "react";
import { buildGameSet, randomJoke, type Question } from "@/data/questions";
import { shuffledScenarios, type Scenario } from "@/data/scenarios";

type Screen = "menu" | "game" | "surprise" | "summary" | "part2";

const TF_BTN =
  "h-14 px-6 rounded-full font-extrabold text-base text-white shadow-md transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";

const QUESTION_IMAGES: Record<string, string> = {
  P1:  "images/kameleon.png",
  P2:  "images/rosiczka.png",
  P3:  "images/mozg.png",
  P4:  "images/osmiornica.png",
  P5:  "images/fatamorgana.png",
  P6:  "images/wenus.png",
  P7:  "images/nos.png",
  P8:  "images/szkola.png",
  P9:  "images/plac.png",
  P10: "images/serca.png",
  P11: "images/maliny.png",
  P12: "images/pociag.png",
  P13: "images/wegiel.png",
  P14: "images/antarktyda.png",
  P15: "images/podziemny.png",
  F1:  "images/byk.png",
  F2:  "images/zlotoryja.png",
  F3:  "images/czytanie.png",
  F4:  "images/polarny.png",
  F5:  "images/wawelski.png",
  F6:  "images/slonce.png",
  F7:  "images/kot.png",
  P16: "images/dlugopis.png",
  F9:  "images/podloga.png",
  F10: "images/ziewanie.png",
  F11: "images/marchewka.png",
  F12: "images/samolot.png",
  F13: "images/mozg2.png",
  F14: "images/piorun.png",
  F15: "images/burjkhalifa.png",
};

const SCENARIO_IMAGES: Record<string, string> = {
  S1: "images/pinokio.png",
  S2: "images/kapturek.png",
  S3: "images/lego.png",
  S4: "images/winnie.png",
  S5: "images/lody.png",
  S6: "images/kleks.png",
};

// Extract first emoji from category string (e.g. "🦎 Przyroda" -> "🦎")
function emojiFromCategory(cat: string): string {
  const match = cat.match(/\p{Extended_Pictographic}/u);
  return match ? match[0] : "✨";
}

// Confetti pieces — random colors / positions
function ConfettiBurst() {
  const colors = ["#27AE60", "#E74C3C", "#FFB800", "#1a1a2e", "#3498db"];
  const pieces = Array.from({ length: 40 });
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.4;
        const bg = colors[i % colors.length];
        const rotate = Math.random() * 360;
        return (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${left}%`,
              backgroundColor: bg,
              animationDelay: `${delay}s`,
              transform: `rotate(${rotate}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

const Index = () => {
  const [screen, setScreen] = useState<Screen>("menu");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answer, setAnswer] = useState<null | boolean>(null);
  const [joke, setJoke] = useState("");
  const [previousScreen, setPreviousScreen] = useState<Screen>("menu");
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRewardMsg, setShowRewardMsg] = useState(false);

  const startPart2 = () => {
    setScenarios(shuffledScenarios());
    setScenarioIdx(0);
    setScreen("part2");
  };

  const startGame = () => {
    setQuestions(buildGameSet());
    setIdx(0);
    setCorrect(0);
    setAnswer(null);
    setShowConfetti(false);
    setShowRewardMsg(false);
    setScreen("game");
  };

  const current = questions[idx];
  const isCorrect = answer !== null && current && answer === current.isTrue;

  const handleAnswer = (a: boolean) => {
    if (answer !== null) return;
    setAnswer(a);
    if (current && a === current.isTrue) {
      setCorrect((c) => {
        const nc = c + 1;
        // Trigger reward when crossing 2 -> 3
        if (c === 2 && nc === 3) {
          setShowConfetti(true);
          setShowRewardMsg(true);
        }
        return nc;
      });
    }
  };

  // Auto-hide confetti
  useEffect(() => {
    if (!showConfetti) return;
    const t = setTimeout(() => setShowConfetti(false), 2400);
    return () => clearTimeout(t);
  }, [showConfetti]);

  // Auto-hide reward message
  useEffect(() => {
    if (!showRewardMsg) return;
    const t = setTimeout(() => setShowRewardMsg(false), 3500);
    return () => clearTimeout(t);
  }, [showRewardMsg]);

  const next = () => {
    setAnswer(null);
    if (idx + 1 >= questions.length) {
      setScreen("summary");
    } else {
      setIdx(idx + 1);
    }
  };

  const openSurprise = () => {
    setJoke(randomJoke());
    setPreviousScreen(screen);
    setScreen("surprise");
  };

  // ============== MENU ==============
  if (screen === "menu") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-accent/40 to-background">
        <div className="max-w-2xl w-full text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-black mb-3 tracking-tight">
            Prawda czy Fałsz 🤔
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 mb-6 font-semibold">
            Gra dla całej klasy!
          </p>

          <div className="bg-card border-2 border-foreground/20 rounded-2xl p-5 mb-8 text-left shadow-md">
            <p className="text-base md:text-lg font-semibold leading-relaxed text-foreground/80">
              🌟 Pora odkryć coś nowego! Przygotujcie ręce do zgłaszania się! Czytajcie pytania i odpowiadajcie zgodnie z tym, jak uważacie.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={startGame}
              className="bg-card border-2 border-foreground rounded-2xl p-6 text-xl md:text-2xl font-extrabold transition-all duration-300 hover:bg-accent hover:scale-[1.02] active:scale-95 shadow-md"
            >
              🎯 Część I — Prawdziwe, czy Fałszywe?
            </button>
            <button
              onClick={startPart2}
              className="bg-card border-2 border-foreground rounded-2xl p-6 text-xl md:text-2xl font-extrabold transition-all duration-300 hover:bg-accent hover:scale-[1.02] active:scale-95 shadow-md"
            >
              💭 Część II — Włączamy Wyobraźnię
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ============== PART 2 — SCENARIOS ==============
  if (screen === "part2") {
    const scenario = scenarios[scenarioIdx];
    if (!scenario) return null;
    const isLast = scenarioIdx + 1 >= scenarios.length;

    return (
      <main className="min-h-screen flex flex-col p-4 md:p-6">
        {/* Top bar */}
        <header className="flex items-center justify-between max-w-[900px] w-full mx-auto mb-6">
          <button
            onClick={() => setScreen("menu")}
            className="text-sm font-bold text-foreground/60 hover:text-foreground transition-colors"
          >
            ← Menu
          </button>
          <div className="text-sm md:text-base font-bold">
            Scenariusz {scenarioIdx + 1} z {scenarios.length}
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center max-w-[900px] w-full mx-auto">
          <article
            key={scenario.id}
            className="bg-card border-2 border-foreground rounded-2xl p-6 md:p-10 w-full shadow-lg animate-fade-in"
          >
            <h2 className="text-2xl md:text-4xl font-black mb-6 leading-tight text-center">
              {scenario.title}
            </h2>

            <section className="mb-6">
              <h3 className="text-lg md:text-xl font-extrabold mb-3">
                💬 Pytania do dyskusji
              </h3>
              <ul className="list-disc list-outside pl-6 space-y-2 text-base md:text-lg font-semibold leading-relaxed">
                {scenario.questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </section>

            <section className="bg-accent/60 border-2 border-foreground/20 rounded-xl p-4 md:p-5">
              <h3 className="text-lg md:text-xl font-extrabold mb-2">
                💡 Ciekawostka
              </h3>
              <p className="text-base md:text-lg font-semibold leading-relaxed">
                {scenario.funFact}
              </p>
            </section>

            {SCENARIO_IMAGES[scenario.id] && (
              <div className="mt-5 flex justify-center">
                <img
                  src={SCENARIO_IMAGES[scenario.id]}
                  alt={scenario.title}
                  loading="lazy"
                  className="rounded-xl border-2 border-foreground/20 shadow-md max-h-60 object-cover"
                />
              </div>
            )}
          </article>

          <div className="mt-6 w-full">
            {isLast ? (
              <button
                onClick={() => setScreen("menu")}
                className="w-full h-14 rounded-full bg-foreground text-background font-extrabold text-base transition-all hover:scale-[1.02] active:scale-95 shadow-md"
              >
                🏠 Wróć do menu
              </button>
            ) : (
              <button
                onClick={() => setScenarioIdx(scenarioIdx + 1)}
                className="w-full h-14 rounded-full bg-foreground text-background font-extrabold text-base transition-all hover:scale-[1.02] active:scale-95 shadow-md"
              >
                Jeszcze jeden →
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  // ============== SURPRISE ==============
  if (screen === "surprise") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-xl animate-bounce-in">
          <div className="text-8xl mb-6">😂</div>
          <div className="bg-card border-2 border-foreground rounded-2xl p-8 mb-8 shadow-lg">
            <p className="text-xl md:text-2xl font-bold leading-relaxed">{joke}</p>
          </div>
          <button
            onClick={() => setScreen(previousScreen === "summary" ? "summary" : "game")}
            className="bg-foreground text-background rounded-full h-12 px-8 font-bold transition-all hover:scale-105"
          >
            ← Wróć do gry
          </button>
        </div>
      </main>
    );
  }

  // ============== SUMMARY ==============
  if (screen === "summary") {
    const total = questions.length;
    let emoji = "💪";
    let message = "Świetna próba! Następnym razem pójdzie jeszcze lepiej. 💪";
    if (correct === 10) {
      emoji = "🏆";
      message = "Niesamowite! Komplet punktów — prawdziwy mistrz wiedzy! 🏆";
    } else if (correct >= 7) {
      emoji = "⭐";
      message = "Świetny wynik! Naprawdę dużo wiesz. ⭐";
    } else if (correct >= 4) {
      emoji = "👍";
      message = "Dobra robota! Z każdą grą będzie lepiej. 👍";
    }

    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-[900px] w-full animate-bounce-in">
          <div className="text-8xl mb-4">{emoji}</div>
          <h2 className="text-4xl md:text-5xl font-black mb-3">Koniec gry!</h2>
          <p className="text-2xl md:text-3xl font-extrabold mb-4">
            <span className="text-truegreen">{correct}</span> na {total} poprawnych!
          </p>
          <p className="text-lg md:text-xl font-semibold text-foreground/80 mb-8 max-w-xl mx-auto">
            {message}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={startGame}
              className="bg-foreground text-background rounded-full h-12 px-8 font-bold transition-all hover:scale-105"
            >
              🔄 Nowa gra — inne pytania
            </button>
            <button
              onClick={() => setScreen("menu")}
              className="bg-card border-2 border-foreground rounded-full h-12 px-8 font-bold transition-all hover:scale-105"
            >
              ← Menu
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ============== GAME ==============
  if (!current) return null;

  const cardStateClass =
    answer === null
      ? "border-foreground"
      : isCorrect
        ? "border-truegreen bg-truegreen/10 animate-bounce-in"
        : "border-falsered bg-falsered/10 animate-shake";

  const surpriseUnlocked = correct >= 3;
  const imgUrl = QUESTION_IMAGES[current.id];
  const placeholderEmoji = emojiFromCategory(current.category);

  return (
    <main className="min-h-screen flex flex-col p-4 md:p-6">
      {showConfetti && <ConfettiBurst />}

      {/* Top bar */}
      <header className="flex items-center justify-between max-w-[900px] w-full mx-auto mb-6">
        <button
          onClick={() => setScreen("menu")}
          className="text-sm font-bold text-foreground/60 hover:text-foreground transition-colors"
        >
          ← Menu
        </button>
        <div className="flex items-center gap-4 text-sm md:text-base font-bold">
          <span>Pytanie {idx + 1} z {questions.length}</span>
          <span className="bg-truegreen text-white px-3 py-1 rounded-full">
            ✅ {correct}
          </span>
        </div>
      </header>

      {/* Reward banner */}
      {showRewardMsg && (
        <div className="max-w-[900px] w-full mx-auto mb-4 animate-fade-in">
          <div className="bg-accent border-2 border-foreground rounded-2xl px-4 py-3 text-center font-extrabold text-lg shadow-md">
            🎉 Czas na niespodziankę!
          </div>
        </div>
      )}

      {/* Game area */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-[900px] w-full mx-auto">
        <div className="text-base md:text-lg font-bold mb-4 bg-accent/60 px-4 py-2 rounded-full">
          {current.category}
        </div>

        <div
          key={current.id}
          className={`bg-card border-2 ${cardStateClass} rounded-2xl p-6 md:p-10 w-full shadow-lg transition-all duration-300 ease-in-out`}
        >
          <p
            className="text-center font-bold leading-relaxed"
            style={{ fontSize: "1.3rem" }}
          >
            {current.text}
          </p>

          {answer !== null && (
            <div className="mt-6 pt-6 border-t-2 border-dashed border-foreground/20 animate-fade-in">
              <p
                className={`text-center font-bold mb-2 text-lg ${
                  isCorrect ? "text-truegreen" : "text-falsered"
                }`}
              >
                {isCorrect ? "✅ Brawo, dobrze!" : "❌ Niestety, źle..."}
              </p>
              <p className="text-center text-foreground/80">{current.explanation}</p>

              {/* Themed image / emoji placeholder */}
              <div className="mt-5 flex justify-center">
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={current.text}
                    loading="lazy"
                    className="rounded-xl border-2 border-foreground/20 shadow-md max-h-60 object-cover"
                  />
                ) : (
                  <div
                    className="rounded-xl border-2 border-foreground/20 shadow-md flex items-center justify-center"
                    style={{
                      width: 160,
                      height: 160,
                      backgroundColor: "#F5F0E6",
                      fontSize: 80,
                      lineHeight: 1,
                    }}
                    aria-label="ilustracja tematyczna"
                  >
                    {placeholderEmoji}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 w-full">
          {answer === null ? (
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <button
                onClick={() => handleAnswer(true)}
                className={`${TF_BTN} bg-truegreen`}
                style={{ borderRadius: 50 }}
              >
                ✅ PRAWDA
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className={`${TF_BTN} bg-falsered`}
                style={{ borderRadius: 50 }}
              >
                ❌ FAŁSZ
              </button>
            </div>
          ) : (
            <button
              onClick={next}
              className="w-full h-14 rounded-full bg-foreground text-background font-extrabold text-base transition-all hover:scale-[1.02] active:scale-95 shadow-md"
            >
              Dalej →
            </button>
          )}
        </div>

        {/* Surprise button */}
        <button
          onClick={openSurprise}
          disabled={!surpriseUnlocked}
          className={`mt-6 h-12 px-6 rounded-full font-bold transition-all duration-300 ${
            surpriseUnlocked
              ? `bg-accent border-2 border-foreground hover:scale-105 ${
                  showRewardMsg ? "animate-reward-pulse" : ""
                }`
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {surpriseUnlocked
            ? "🎁 Pokaż niespodziankę"
            : `🔒 Niespodzianka (jeszcze ${3 - correct})`}
        </button>
      </div>
    </main>
  );
};

export default Index;
