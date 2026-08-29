import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

function factorize(nInput: number): Map<number, number> {
  const factors = new Map<number, number>();
  let n = nInput;
  for (let p = 2; p * p <= n; p++) {
    while (n % p === 0) {
      factors.set(p, (factors.get(p) ?? 0) + 1);
      n /= p;
    }
  }
  if (n > 1) factors.set(n, (factors.get(n) ?? 0) + 1);
  return factors;
}

function expNotation(factors: Map<number, number>): string {
  return [...factors.entries()].sort((x, y) => x[0] - y[0]).map(([p, e]) => (e > 1 ? `${p}^${e}` : `${p}`)).join(" × ");
}

function Tile({ x, y, p, delay }: { x: number; y: number; p: number; delay: number }) {
  return (
    <motion.g initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 18, delay }}>
      <rect x={x - 13} y={y - 11} width="26" height="22" rx="5" fill="#eef2ff" stroke={IND} strokeWidth="1.4" />
      <text x={x} y={y + 5} textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{p}</text>
    </motion.g>
  );
}

// Prime factors of each number are drawn as tiles; the two numbers become
// overlapping circles where shared prime tiles fall in the overlap (the GCF)
// and each number's extra tiles fall in its own crescent — the LCM is every
// tile together, and their ratio is what's left after the shared part cancels.
// Data: { a, b } — the two numbers to compare.
export function PrimeFactorVennScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const a = Math.round(num(data.a, 0));
  const b = Math.round(num(data.b, 0));

  const factorsA = factorize(a);
  const factorsB = factorize(b);
  const primes = [...new Set([...factorsA.keys(), ...factorsB.keys()])].sort((x, y) => x - y);

  const overlapTiles: number[] = [], onlyATiles: number[] = [], onlyBTiles: number[] = [];
  let gcf = 1, lcm = 1;
  for (const p of primes) {
    const eA = factorsA.get(p) ?? 0, eB = factorsB.get(p) ?? 0;
    const shared = Math.min(eA, eB);
    for (let i = 0; i < shared; i++) overlapTiles.push(p);
    for (let i = 0; i < eA - shared; i++) onlyATiles.push(p);
    for (let i = 0; i < eB - shared; i++) onlyBTiles.push(p);
    gcf *= p ** shared;
    lcm *= p ** Math.max(eA, eB);
  }
  const ratio = lcm / gcf;

  const gcfOk = a % gcf === 0 && b % gcf === 0;
  const lcmOk = lcm % a === 0 && lcm % b === 0;
  const choiceLabel = (problem.choices ?? []).find((c) => String(c.text).trim() === String(ratio))?.label;
  const answerOk = String(ratio) === String(problem.shortAnswer ?? "").trim();
  const ok = gcfOk && lcmOk && answerOk && choiceLabel === problem.answer;
  const failure = !gcfOk ? `${gcf} does not divide both ${a} and ${b}` : !lcmOk ? `${lcm} is not a multiple of both ${a} and ${b}` : !answerOk ? `computed ${ratio}, stored ${problem.shortAnswer}` : `choice ${choiceLabel ?? "missing"}, stored ${problem.answer}`;

  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  const tilesOfA = [...factorsA.entries()].sort((x, y) => x[0] - y[0]).flatMap(([p, e]) => Array(e).fill(p));
  const tilesOfB = [...factorsB.entries()].sort((x, y) => x[0] - y[0]).flatMap(([p, e]) => Array(e).fill(p));

  const row = (tiles: number[], cx: number, y: number) => {
    const w = tiles.length * 30;
    return tiles.map((p, i) => <Tile key={i} x={cx - w / 2 + 15 + i * 30} y={y} p={p} delay={0.15 + i * 0.12} />);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 460 350" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
        <text x="230" y="16" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "break both numbers into prime factors" : phase === 1 ? "shared factors fall in the overlap — that's the GCF" : "LCM over GCF is what's outside the overlap"}
        </text>

        {phase === 0 && (
          <>
            <text x="140" y="50" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>{a}</text>
            <text x="320" y="50" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>{b}</text>
            {row(tilesOfA, 140, 90)}
            {row(tilesOfB, 320, 90)}
            <motion.text x="140" y="140" textAnchor="middle" fontSize="11" fontWeight="800" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + tilesOfA.length * 0.12 + 0.2 }}>
              {a} = {expNotation(factorsA)}
            </motion.text>
            <motion.text x="320" y="140" textAnchor="middle" fontSize="11" fontWeight="800" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + tilesOfB.length * 0.12 + 0.2 }}>
              {b} = {expNotation(factorsB)}
            </motion.text>
          </>
        )}

        {phase >= 1 && (
          <>
            <circle cx="165" cy="150" r="95" fill={`${IND}10`} stroke={IND} strokeWidth="1.6" />
            <circle cx="295" cy="150" r="95" fill={`${TEAL}10`} stroke={TEAL} strokeWidth="1.6" />
            <text x="95" y="65" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{a}</text>
            <text x="365" y="65" textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={FONT}>{b}</text>

            {row(onlyATiles, 100, 150)}
            {row(overlapTiles, 230, 150)}
            {row(onlyBTiles, 360, 150)}

            <text x="230" y="255" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={FONT}>overlap</text>
            <motion.text x="230" y="272" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              GCF = {overlapTiles.length ? overlapTiles.join(" × ") + " = " : ""}{gcf}
            </motion.text>
            {phase === 1 && (
              <motion.text x="230" y="292" textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                LCM = {a} × {b} ÷ {gcf} = {lcm}
              </motion.text>
            )}
          </>
        )}

        {phase === 2 && (
          <>
            <motion.text x="230" y="292" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 210, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              {lcm} ÷ {gcf} = <tspan fill={GREEN}>{ratio}</tspan>
            </motion.text>
            <text x="230" y="309" textAnchor="middle" fontSize="9.3" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>
              {ok ? "GCF, LCM, and choice verified" : failure}
            </text>
            <SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={316} width={100} />
          </>
        )}
      </svg>
    </div>
  );
}
