interface FinalScreenProps {
  onMirrorDuel: () => void;
  onQuit: () => void;
}

const FinalScreen = ({ onMirrorDuel, onQuit }: FinalScreenProps) => {
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      {/* Main header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-4">🧠 Odkryliście Tajemnicę!</h1>
        <div
          className="inline-block px-8 py-3 rounded-2xl text-xl font-extrabold"
          style={{
            background: "#FFB800",
            color: "hsl(var(--foreground))",
            border: "2px solid hsl(var(--foreground))",
          }}
        >
          Wszyscy macie Supermoc — poznajcie Neurony Lustrzane!
        </div>
      </div>

      {/* Explanation card */}
      <div className="card-bordered p-8 bg-white text-base font-semibold leading-relaxed space-y-4">
        <p>
          To Wasze wewnętrzne Lusterka. Specjalne komórki w mózgu, które sprawiają,
          że kiedy patrzycie na smutną osobę — Wam też robi się smutno.
          Gdy ktoś się śmieje — Wasze lusterka chcą, żebyście też się uśmiechali!
        </p>
        <p>
          <strong>Przykład:</strong> Czy zdarzyło Wam się kiedyś ziewnąć, bo zobaczyliście jak ziewa ktoś inny?
          To właśnie Wasze Neurony Lustrzane włączyły empatyczną odpowiedź!
        </p>
      </div>

      {/* Image — place your file as: public/neurony.png (or .jpg) */}
      <div
        className="rounded-2xl mx-auto overflow-hidden"
        style={{
          width: "100%",
          maxWidth: 500,
          border: "2px solid hsl(var(--foreground))",
        }}
      >
        <img
          src="neurony.png"
          alt="Neurony Lustrzane"
          className="w-full h-auto block"
          onError={(e) => {
            // fallback gradient if image not found
            const el = e.currentTarget.parentElement!;
            el.style.height = "250px";
            el.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
            el.style.display = "flex";
            el.style.alignItems = "center";
            el.style.justifyContent = "center";
            el.innerHTML = '<div style="text-align:center;color:white"><div style="font-size:64px">🧠</div><div style="font-weight:800;font-size:1.2rem;margin-top:8px">Neurony Lustrzane</div><div style="font-size:0.85rem;margin-top:4px;opacity:0.8">Wstaw plik: public/neurony.png</div></div>';
          }}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onMirrorDuel}
          className="btn-pill text-lg px-8 py-4 hover:scale-105 font-extrabold"
          style={{
            background: "#FFB800",
            color: "hsl(var(--foreground))",
            border: "2px solid hsl(var(--foreground))",
          }}
        >
          🪞 Zagrajmy w Pojedynek Luster!
        </button>
        <button
          onClick={onQuit}
          className="btn-primary-dark text-lg px-8 py-4 hover:scale-105"
        >
          🏠 Koniec — Wróć do menu
        </button>
      </div>
    </div>
  );
};

export default FinalScreen;
