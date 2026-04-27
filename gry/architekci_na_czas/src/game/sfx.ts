// Lekkie dźwięki generowane WebAudio — bez plików.
let ctx: AudioContext | null = null;
function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType = "sine", gain = 0.15, when = 0) {
  const a = ac();
  if (!a) return;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = gain;
  o.connect(g).connect(a.destination);
  const t0 = a.currentTime + when;
  o.start(t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.stop(t0 + dur + 0.02);
}

export const sfx = {
  ding() {
    tone(880, 0.12, "triangle", 0.18);
    tone(1320, 0.18, "triangle", 0.14, 0.05);
  },
  boing() {
    const a = ac();
    if (!a) return;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(440, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(110, a.currentTime + 0.35);
    g.gain.value = 0.15;
    o.connect(g).connect(a.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.4);
    o.stop(a.currentTime + 0.42);
  },
  /** CLICK — idealne dopasowanie: krótkie wznoszące "tik-tik". */
  click() {
    tone(880, 0.05, "square", 0.16);
    tone(1760, 0.10, "triangle", 0.16, 0.04);
  },
  /** OK — neutralne dopasowanie: jeden suchy "tap". */
  tap() {
    tone(440, 0.06, "sine", 0.14);
  },
  /** WOBBLE — chwianie: wibrujący niski dźwięk. */
  creak() {
    const a = ac();
    if (!a) return;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(180, a.currentTime);
    o.frequency.linearRampToValueAtTime(140, a.currentTime + 0.25);
    o.frequency.linearRampToValueAtTime(200, a.currentTime + 0.5);
    g.gain.value = 0.12;
    o.connect(g).connect(a.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.55);
    o.stop(a.currentTime + 0.6);
  },
  crash() {
    const a = ac();
    if (!a) return;
    const buf = a.createBuffer(1, a.sampleRate * 0.4, a.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = a.createBufferSource();
    const g = a.createGain();
    g.gain.value = 0.2;
    src.buffer = buf;
    src.connect(g).connect(a.destination);
    src.start();
  },
  countdown() {
    tone(660, 0.15, "sine", 0.18);
  },
  freeze() {
    tone(220, 0.4, "sawtooth", 0.18);
  },
  win() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, "triangle", 0.18, i * 0.12));
  },
  /** LOCKED — sztywne złącze: szybki, satysfakcjonujący "KLIK!". */
  lock() {
    tone(1200, 0.04, "square", 0.18);
    tone(2400, 0.06, "triangle", 0.14, 0.03);
    tone(1800, 0.05, "square", 0.10, 0.06);
  },
  /** PIVOT — sprężynowy "boing!" przy złym dopasowaniu. */
  spring() {
    const a = ac();
    if (!a) return;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(880, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(180, a.currentTime + 0.5);
    const lfo = a.createOscillator();
    const lfoGain = a.createGain();
    lfo.frequency.value = 22;
    lfoGain.gain.value = 80;
    lfo.connect(lfoGain).connect(o.frequency);
    g.gain.value = 0.18;
    o.connect(g).connect(a.destination);
    o.start();
    lfo.start();
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.55);
    o.stop(a.currentTime + 0.6);
    lfo.stop(a.currentTime + 0.6);
  },
  /** Komiczne „aaaaaaa!" przy upadku — opadające tony jak kreskówkowy krzyk. */
  aaaa() {
    const a = ac();
    if (!a) return;
    // Zstępujący glissando + wibrato → komiczny krzyk
    const o = a.createOscillator();
    const g = a.createGain();
    const lfo = a.createOscillator();
    const lfoGain = a.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(660, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(180, a.currentTime + 0.65);
    lfo.frequency.value = 14;
    lfoGain.gain.value = 30;
    lfo.connect(lfoGain).connect(o.frequency);
    g.gain.value = 0.18;
    o.connect(g).connect(a.destination);
    o.start();
    lfo.start();
    g.gain.setValueAtTime(0.18, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.7);
    o.stop(a.currentTime + 0.72);
    lfo.stop(a.currentTime + 0.72);
  },
};
