import type { MathQuestion, MathRange, Grade } from "./types";

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

function makeOptions(correct: number): number[] {
  const set = new Set<number>([correct]);
  while (set.size < 3) {
    const delta = rnd(1, 5) * (Math.random() < 0.5 ? -1 : 1);
    const v = correct + delta;
    if (v >= 0 && v !== correct) set.add(v);
  }
  return Array.from(set).sort(() => Math.random() - 0.5);
}

function addQuestion(max: number): MathQuestion {
  const sub = Math.random() < 0.4;
  if (sub) {
    const a = rnd(2, max);
    const b = rnd(1, a);
    return { text: `${a} − ${b} = ?`, answer: a - b, options: makeOptions(a - b) };
  }
  const a = rnd(1, max - 1);
  const b = rnd(1, max - a);
  return { text: `${a} + ${b} = ?`, answer: a + b, options: makeOptions(a + b) };
}

function mulQuestion(): MathQuestion {
  const a = rnd(2, 9);
  const b = rnd(2, Math.min(9, Math.floor(50 / a)));
  return { text: `${a} × ${b} = ?`, answer: a * b, options: makeOptions(a * b) };
}

function divQuestion(): MathQuestion {
  const b = rnd(2, 9);
  const ans = rnd(2, 9);
  const a = ans * b;
  return { text: `${a} : ${b} = ?`, answer: ans, options: makeOptions(ans) };
}

export function generateQuestion(range: MathRange, grade: Grade): MathQuestion {
  if (range === "add20") return addQuestion(20);
  if (range === "mul50") return mulQuestion();
  // mix
  const r = Math.random();
  if (r < 0.4) return addQuestion(grade === "3" ? 30 : 20);
  if (r < 0.8) return mulQuestion();
  return grade === "3" ? divQuestion() : addQuestion(20);
}

export function answerTimeSec(grade: Grade): number {
  return grade === "3" ? 5 : 8;
}
