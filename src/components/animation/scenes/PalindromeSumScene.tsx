import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const WARN = "#b45309";

const rev = (n: number) => String(n).split("").reverse().join("");
const isPal = (n: number) => String(n) === rev(n);
const digitsOf = (n: number) => String(n).split("").map(Number);

/**
 * The least k-digit non-palindrome that is a sum of a few **distinct** shorter
 * palindromes. The whole problem turns on a fact the scene *discovers* rather
 * than asserts: sieving every two-digit number through a mirror leaves exactly
 * 11, 22, …, 99, and those are precisely 11 × 1 … 11 × 9 — so adding three of
 * them factors the 11 straight back out, `11a + 11b + 11c = 11(a + b + c)`, and
 * **N can only ever be a multiple of 11**. That collapses the search: climbing
 * from 100, the ten numbers 100–109 are ruled out by *divisibility*, not by any
 * palindrome test (the scene shows each one's remainder, so the one-in-eleven
 * pattern is visible), and the very first candidate, 110, is also the answer —
 * it fails the mirror test, which is exactly what the problem wants. The
 * contrast beat is the payoff: the *next* candidate, 121, passes the mirror and
 * so is disqualified, and its digit sum is normally an answer choice, as is the
 * one after it — the scene walks the later candidates, computes their digit sums
 * and matches them against `problem.choices`, so the distractors are found, not
 * authored. Palindromes, every reachable sum, the ladder, N and the digit sum
 * are all computed by enumeration; data `{ partDigits, addends, targetDigits }`.
 */
export function PalindromeSumScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const partDigits = Math.max(2, Math.min(3, Math.round(num(data.partDigits, 2))));
  const addends = Math.max(2, Math.min(4, Math.round(num(data.addends, 3))));
  const targetDigits = Math.max(2, Math.min(4, Math.round(num(data.targetDigits, 3))));

  // ---- sieve every part-length number through the mirror ----
  const pLo = Math.pow(10, partDigits - 1);
  const pHi = Math.pow(10, partDigits) - 1;
  const parts: number[] = [];
  const rejects: number[] = [];
  for (let n = pLo; n <= pHi; n++) (isPal(n) ? parts : rejects).push(n);

  // the survivors turn out to share a factor — find it rather than assume 11
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const base = parts.reduce((g, p) => gcd(g, p), 0);
  const mults = parts.map((p) => p / base);

  // ---- every sum of `addends` distinct survivors ----
  const reach = new Map<number, number[]>();
  const pick = (start: number, chosen: number[]) => {
    if (chosen.length === addends) {
      const s = chosen.reduce((a, b) => a + b, 0);
      if (!reach.has(s)) reach.set(s, [...chosen]);
      return;
    }
    for (let i = start; i < parts.length; i++) pick(i + 1, [...chosen, parts[i]]);
  };
  pick(0, []);
  const sums = [...reach.keys()].sort((a, b) => a - b);
  const ks = sums.map((s) => s / base);
  const kMin = ks[0];
  const kMax = ks[ks.length - 1];
  const kSet = new Set(ks);
  let everyK = true;
  for (let k = kMin; k <= kMax; k++) if (!kSet.has(k)) everyK = false;

  // ---- climb to the first target-length candidate that is not a palindrome ----
  const tLo = Math.pow(10, targetDigits - 1);
  const tHi = Math.pow(10, targetDigits) - 1;
  const cands = sums.filter((s) => s >= tLo && s <= tHi);
  const N = cands.find((s) => !isPal(s)) ?? cands[0] ?? tLo;
  const triple = reach.get(N) ?? [];
  const nDigits = digitsOf(N);
  const digitSum = nDigits.reduce((a, b) => a + b, 0);
  const nextPal = cands.find((s) => isPal(s));

  // the ladder of integers from the first target-length number up to N
  const ladderAll: number[] = [];
  for (let n = tLo; n <= N; n++) ladderAll.push(n);
  const ladder = ladderAll.length <= 12 ? ladderAll : [...ladderAll.slice(0, 5), ...ladderAll.slice(-6)];
  const kThree = Math.ceil(tLo / base);

  // ---- price the near misses against the real answer choices ----
  const letterFor = (v: number): string | null => {
    const hit = (problem.choices ?? []).find((c) => {
      const t = String(c.text)
        .replace(/[−–—]/g, "-")
        .replace(/[^\d-]/g, "");
      return t !== "" && Number(t) === v;
    });
    return hit ? String(hit.label) : null;
  };
  const traps = cands
    .filter((s) => s > N)
    .slice(0, 3)
    .map((s) => ({ value: s, sum: digitsOf(s).reduce((a, b) => a + b, 0), pal: isPal(s) }))
    .map((t) => ({ ...t, letter: letterFor(t.sum) }))
    .filter((t) => t.letter);

  // ---- self-check ----
  const partsAreMultiples = parts.every((p, i) => p === base * mults[i]);
  const answerOk = problem.shortAnswer == null || String(digitSum) === String(problem.shortAnswer).trim();
  const failure = !partsAreMultiples
    ? "the palindromes do not share one factor"
    : !cands.length
    ? `no ${targetDigits}-digit sum exists`
    : !answerOk
    ? `digit sum ${digitSum} ≠ stored ${problem.shortAnswer}`
    : null;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 4 : Math.min(beat, 3);

  const W = 470;
  const H = 264;
  const MIRROR = 235;

  /** One digit sitting on a card, with the value drawn as a plain attribute. */
  const Card = ({
    x,
    y,
    w,
    h,
    text,
    fill,
    stroke,
    color,
    size,
  }: {
    x: number;
    y: number;
    w: number;
    h: number;
    text: string;
    fill: string;
    stroke: string;
    color: string;
    size: number;
  }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={fill} stroke={stroke} strokeWidth={1.4} />
      <text
        x={x + w / 2}
        y={y + h / 2 + size * 0.36}
        textAnchor="middle"
        fontSize={size}
        fontWeight="800"
        fill={color}
        fontFamily={numberFont}
      >
        {text}
      </text>
    </g>
  );

  // ---------- phase 0 geometry: the mirror sieve ----------
  const survW = 40;
  const survPitch = 46;
  const survShown = parts.slice(0, 9);
  const survX = (i: number) => MIRROR - (survShown.length * survPitch - (survPitch - survW)) / 2 + i * survPitch;
  const rejShown = [0, 1, 2, 3].map((i) => rejects[Math.floor((i * (rejects.length - 1)) / 3)]);
  const brickOf = parts[parts.length - 1];
  const brickN = brickOf / base;

  // ---------- phase 1 geometry: factoring the base out ----------
  const letters = ["a", "b", "c", "d"].slice(0, addends);
  const grpW = 100;
  const grpPitch = 124;
  const grpX = (i: number) => MIRROR - (addends * grpPitch - (grpPitch - grpW)) / 2 + i * grpPitch;
  const foldText = `= ${base} × (${letters.join(" + ")})`;
  const foldX0 = MIRROR - (foldText.length * 17 * 0.6) / 2;
  const foldBaseCx = foldX0 + (2 + String(base).length / 2) * 17 * 0.6;
  const axX0 = 34;
  const axX1 = 436;
  const kPitch = kMax > kMin ? (axX1 - axX0) / (kMax - kMin) : 0;
  const kX = (k: number) => axX0 + (k - kMin) * kPitch;

  // ---------- phase 2 geometry: the ladder ----------
  const cellW = 36;
  const cellPitch = 40;
  const cellX = (i: number) => MIRROR - (ladder.length * cellPitch - (cellPitch - cellW)) / 2 + i * cellPitch;

  // ---------- phase 3 geometry: holding N up to the mirror ----------
  const bigW = 34;
  const bigPitch = 38;
  const bigLeft = (i: number) => MIRROR - 4 - (nDigits.length - i) * bigPitch;
  const bigRight = (i: number) => MIRROR + 4 + i * bigPitch;
  const palDigits = nextPal != null ? digitsOf(nextPal) : [];
  const smW = 24;
  const smPitch = 27;
  const smLeft = (i: number) => MIRROR - 4 - (palDigits.length - i) * smPitch;
  const smRight = (i: number) => MIRROR + 4 + i * smPitch;

  // ---------- phase 4 geometry: build N, then add its digits ----------
  const tileW = 62;
  const tilePitch = 86;
  const tileX = (i: number) => MIRROR - (triple.length * tilePitch - (tilePitch - tileW)) / 2 + i * tilePitch;
  const resX = (i: number) => MIRROR - (nDigits.length * bigPitch - (bigPitch - bigW)) / 2 + i * bigPitch;
  const dsW = bigW;
  const dsPitch = 54;
  const dsSpan = nDigits.length * dsPitch - (dsPitch - dsW);
  const dsX0 = MIRROR - (dsSpan + 56) / 2;
  const dsX = (i: number) => dsX0 + i * dsPitch;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ================= phase 0: sieve every two-digit number through a mirror ================= */}
        {phase === 0 && (
          <g>
            <text x={MIRROR} y={17} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              hold every {partDigits}-digit number up to a mirror
            </text>

            {/* the ones that fail */}
            {rejShown.map((n, i) => {
              const cx = 82 + i * 106;
              return (
                <motion.g key={`rej-${n}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.12 }}>
                  <text x={cx - 20} y={48} textAnchor="middle" fontSize="15" fontWeight="800" fill={DIM} fontFamily={numberFont}>
                    {n}
                  </text>
                  <line x1={cx} y1={30} x2={cx} y2={54} stroke={DIM} strokeWidth={1.2} strokeDasharray="3 3" />
                  <motion.g initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.3 + i * 0.12 }}>
                    <text x={cx + 20} y={48} textAnchor="middle" fontSize="15" fontWeight="800" fill="#cbd5e1" fontFamily={numberFont}>
                      {rev(n)}
                    </text>
                  </motion.g>
                  <text x={cx} y={66} textAnchor="middle" fontSize="10" fontWeight="800" fill={BAD}>
                    ✗
                  </text>
                </motion.g>
              );
            })}
            <text x={MIRROR} y={82} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM}>
              {rejects.length} of them come back different — only {parts.length} survive
            </text>

            {/* the survivors, each second digit sliding across the mirror line */}
            {survShown.map((p, i) => {
              const x = survX(i);
              return (
                <motion.g
                  key={p}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.7 + i * 0.07 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <rect x={x} y={92} width={survW} height={34} rx={6} fill="#dcfce7" stroke={WIN} strokeWidth={1.4} />
                  <line x1={x + survW / 2} y1={94} x2={x + survW / 2} y2={124} stroke={WIN} strokeWidth={1} strokeDasharray="3 2" />
                  <text x={x + 11} y={115} textAnchor="middle" fontSize="15" fontWeight="800" fill="#166534" fontFamily={numberFont}>
                    {String(p)[0]}
                  </text>
                  <motion.g initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.0 + i * 0.07 }}>
                    <text x={x + survW - 11} y={115} textAnchor="middle" fontSize="15" fontWeight="800" fill="#166534" fontFamily={numberFont}>
                      {String(p)[String(p).length - 1]}
                    </text>
                  </motion.g>
                  <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 + i * 0.05 }}>
                    <rect x={x + 2} y={132} width={survW - 4} height={17} rx={4} fill="#eef2ff" stroke={IND} strokeWidth={1} />
                    <text x={x + survW / 2} y={144} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                      {base}×{mults[i]}
                    </text>
                  </motion.g>
                </motion.g>
              );
            })}

            <motion.text x={MIRROR} y={168} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
              both digits equal means d·10 + d = {base}·d
            </motion.text>

            {/* the largest survivor built out of `base`-bricks */}
            {(() => {
              const bw = 40;
              const bp = 44;
              const x0 = MIRROR - (brickN * bp - (bp - bw)) / 2;
              return (
                <g>
                  {Array.from({ length: brickN }).map((_, i) => (
                    <motion.g
                      key={i}
                      initial={{ opacity: 0, y: -14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 17, delay: 2.1 + i * 0.08 }}
                    >
                      <rect x={x0 + i * bp} y={186} width={bw} height={24} rx={4} fill="#fef3c7" stroke={WARN} strokeWidth={1.2} />
                      <text x={x0 + i * bp + bw / 2} y={202} textAnchor="middle" fontSize="11" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                        {base}
                      </text>
                    </motion.g>
                  ))}
                  <motion.text
                    x={MIRROR}
                    y={230}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="800"
                    fill={IND}
                    fontFamily={numberFont}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.1 + brickN * 0.08 }}
                  >
                    {brickOf} is {brickN} elevens — and each survivor is just {base} × its digit
                  </motion.text>
                </g>
              );
            })()}
            <text x={MIRROR} y={250} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM}>
              so the {partDigits}-digit palindromes are exactly {base}×1 … {base}×{mults[mults.length - 1]}
            </text>
          </g>
        )}

        {/* ================= phase 1: the base factors straight back out ================= */}
        {phase === 1 && (
          <g>
            <text x={MIRROR} y={18} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              add {addends} of them and the {base} comes right back out
            </text>

            {letters.map((L, i) => {
              const x = grpX(i);
              const bx = x + 34;
              return (
                <g key={L}>
                  {i > 0 && (
                    <text x={x - (grpPitch - grpW) / 2} y={68} textAnchor="middle" fontSize="16" fontWeight="800" fill={DIM} fontFamily={numberFont}>
                      +
                    </text>
                  )}
                  <motion.g
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 + i * 0.14 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <rect x={x} y={44} width={grpW} height={44} rx={8} fill="#f8fafc" stroke={DIM} strokeWidth={1.3} />
                  </motion.g>
                  <motion.g
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.2 + i * 0.14 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <text x={bx} y={74} textAnchor="middle" fontSize="17" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                      {base}
                    </text>
                  </motion.g>
                  {/* a copy of the base factor lifts out of every group and lands on one place */}
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      x: [0, 0, foldBaseCx - bx, foldBaseCx - bx],
                      y: [0, 0, 130 - 74, 130 - 74],
                    }}
                    transition={{ duration: 2.2, times: [0, 0.3, 0.68, 0.76], delay: 0.5 + i * 0.14 }}
                  >
                    <text x={bx} y={74} textAnchor="middle" fontSize="17" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                      {base}
                    </text>
                  </motion.g>
                  <text x={x + 58} y={74} textAnchor="middle" fontSize="14" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                    ×
                  </text>
                  <text x={x + 78} y={74} textAnchor="middle" fontSize="17" fontWeight="800" fill={IND} fontFamily={numberFont}>
                    {L}
                  </text>
                </g>
              );
            })}

            <motion.text
              x={MIRROR}
              y={130}
              textAnchor="middle"
              fontSize="17"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.55 }}
            >
              {foldText}
            </motion.text>
            <motion.text x={MIRROR} y={152} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.75 }}>
              {letters.join(", ")} are distinct digits 1–{mults[mults.length - 1]}, so the bracket runs from{" "}
              {mults.slice(0, addends).join("+")} = {kMin} up to {mults.slice(-addends).join("+")} = {kMax}
            </motion.text>

            {/* every reachable multiplier, with the target-length stretch banded */}
            <motion.rect
              x={kX(kThree) - 10}
              y={176}
              width={axX1 - kX(kThree) + 20}
              height={26}
              rx={6}
              fill={WIN}
              fillOpacity={0.14}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            />
            <line x1={axX0 - 10} y1={189} x2={axX1 + 10} y2={189} stroke="#cbd5e1" strokeWidth={1.4} />
            {Array.from({ length: kMax - kMin + 1 }).map((_, i) => {
              const k = kMin + i;
              const big = base * k >= tLo;
              return (
                <motion.g
                  key={k}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 17, delay: 1.95 + i * 0.03 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <circle cx={kX(k)} cy={189} r={big ? 5.5 : 4} fill={big ? WIN : DIM} />
                </motion.g>
              );
            })}
            {Array.from({ length: kMax - kMin + 1 }).map((_, i) => {
              const k = kMin + i;
              if (i % 2 !== 0 && k !== kThree) return null;
              return (
                <text key={k} x={kX(k)} y={214} textAnchor="middle" fontSize="7.5" fontWeight="700" fill={k === kThree ? WIN : DIM} fontFamily={numberFont}>
                  {k}
                </text>
              );
            })}
            <text x={axX0 - 12} y={170} fontSize="9" fontWeight="700" fill={DIM} fontFamily={numberFont}>
              {letters.join(" + ")} =
            </text>
            <motion.text
              x={MIRROR}
              y={236}
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 2.7 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              every sum is {base} × (something from {kMin} to {kMax})
            </motion.text>
            <text x={MIRROR} y={253} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM}>
              {everyK ? `and every value in that range really happens` : `not every value in that range happens`} — so N is a multiple of {base}
            </text>
          </g>
        )}

        {/* ================= phase 2: climb from the first target-length number ================= */}
        {phase === 2 && (
          <g>
            <text x={MIRROR} y={18} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              climb from {tLo} and ask which numbers a sum could even reach
            </text>

            {/* the magnifier walks the ladder */}
            <motion.g
              animate={{ x: ladder.map((_, i) => cellX(i) - cellX(0)) }}
              transition={{ duration: 0.16 * ladder.length, ease: "linear", delay: 0.2 }}
            >
              <text x={cellX(0) + cellW / 2} y={54} textAnchor="middle" fontSize="20">
                🔍
              </text>
            </motion.g>

            {ladder.map((n, i) => {
              const good = reach.has(n);
              const x = cellX(i);
              const t = 0.2 + i * 0.16;
              return (
                <g key={n}>
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <rect x={x} y={64} width={cellW} height={34} rx={6} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1.2} />
                    <text x={x + cellW / 2} y={86} textAnchor="middle" fontSize="13" fontWeight="800" fill={INK} fontFamily={numberFont}>
                      {n}
                    </text>
                  </motion.g>
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: t + 0.1 }}>
                    <rect
                      x={x}
                      y={64}
                      width={cellW}
                      height={34}
                      rx={6}
                      fill={good ? WIN : BAD}
                      fillOpacity={good ? 0.2 : 0.1}
                      stroke={good ? WIN : BAD}
                      strokeWidth={good ? 1.8 : 1.2}
                    />
                    <text x={x + cellW / 2} y={86} textAnchor="middle" fontSize="13" fontWeight="800" fill={good ? "#166534" : INK} fontFamily={numberFont}>
                      {n}
                    </text>
                    <text x={x + cellW / 2} y={114} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={good ? WIN : DIM} fontFamily={numberFont}>
                      r{n % base}
                    </text>
                    <text x={x + cellW / 2} y={132} textAnchor="middle" fontSize="11" fontWeight="800" fill={good ? WIN : BAD}>
                      {good ? "✓" : "✗"}
                    </text>
                  </motion.g>
                </g>
              );
            })}

            <motion.text x={MIRROR} y={162} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + ladder.length * 0.16 }}>
              every one of {tLo}–{N - 1} leaves a remainder, so none of them is {base} × anything
            </motion.text>
            <motion.text
              x={MIRROR}
              y={192}
              textAnchor="middle"
              fontSize="17"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.45 + ladder.length * 0.16 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {N} = {base} × {N / base}
            </motion.text>
            <motion.text
              x={MIRROR}
              y={214}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 + ladder.length * 0.16 }}
            >
              and {N / base} = {triple.map((p) => p / base).join(" + ")}, so the sum {triple.join(" + ")} really hits it
            </motion.text>
            <text x={MIRROR} y={236} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM}>
              so {N} is the first {targetDigits}-digit number a sum can reach —
            </text>
            <text x={MIRROR} y={250} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM}>
              the palindrome question has not even been asked yet
            </text>
          </g>
        )}

        {/* ================= phase 3: hold N up to the mirror ================= */}
        {phase === 3 && (
          <g>
            <text x={MIRROR} y={18} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              the problem wants a number that is <tspan fontWeight="900" fill={BAD}>not</tspan> a palindrome — so test {N}
            </text>

            <line x1={MIRROR} y1={34} x2={MIRROR} y2={124} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 4" />
            <text x={MIRROR} y={30} textAnchor="middle" fontSize="8" fontWeight="700" fill={DIM}>
              mirror
            </text>

            {nDigits.map((d, i) => (
              <motion.g key={`L${i}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.1 + i * 0.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <Card x={bigLeft(i)} y={44} w={bigW} h={40} text={String(d)} fill="#eef2ff" stroke={IND} color={IND} size={20} />
              </motion.g>
            ))}
            {nDigits.map((_, j) => {
              const src = nDigits.length - 1 - j;
              const d = nDigits[src];
              return (
                <motion.g
                  key={`R${j}`}
                  initial={{ opacity: 0, x: bigLeft(src) - bigRight(j) }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 130, damping: 18, delay: 0.6 + j * 0.14 }}
                >
                  <Card x={bigRight(j)} y={44} w={bigW} h={40} text={String(d)} fill="#f1f5f9" stroke={DIM} color="#64748b" size={20} />
                </motion.g>
              );
            })}
            {nDigits.map((d, j) => {
              const same = d === nDigits[nDigits.length - 1 - j];
              return (
                <motion.g key={`C${j}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 + j * 0.12 }}>
                  <text x={bigRight(j) + bigW / 2} y={100} textAnchor="middle" fontSize="12" fontWeight="800" fill={same ? WIN : BAD}>
                    {same ? "✓" : "✗"}
                  </text>
                </motion.g>
              );
            })}
            <text x={bigLeft(0) - 8} y={70} textAnchor="end" fontSize="9" fontWeight="700" fill={DIM}>
              {N}
            </text>
            <text x={bigRight(nDigits.length - 1) + bigW + 8} y={70} fontSize="9" fontWeight="700" fill={DIM}>
              {rev(N)}
            </text>

            <motion.text
              x={MIRROR}
              y={138}
              textAnchor="middle"
              fontSize="13"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.8 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {N} ≠ {rev(N)} — not a palindrome, so N = {N}
            </motion.text>

            {/* the very next candidate does match, which is what disqualifies it */}
            {nextPal != null && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>
                <line x1={30} y1={158} x2={W - 30} y2={158} stroke="#e2e8f0" strokeWidth={1.2} />
                <text x={MIRROR} y={176} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM}>
                  the next candidate, {nextPal}, is the one that fails
                </text>
                <line x1={MIRROR} y1={186} x2={MIRROR} y2={222} stroke="#cbd5e1" strokeWidth={1.6} strokeDasharray="4 3" />
                {palDigits.map((d, i) => (
                  <Card key={`pl${i}`} x={smLeft(i)} y={190} w={smW} h={28} text={String(d)} fill="#fee2e2" stroke={BAD} color={BAD} size={14} />
                ))}
                {palDigits.map((_, j) => (
                  <Card key={`pr${j}`} x={smRight(j)} y={190} w={smW} h={28} text={String(palDigits[palDigits.length - 1 - j])} fill="#fee2e2" stroke={BAD} color={BAD} size={14} />
                ))}
                <text x={MIRROR} y={240} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                  {nextPal} = {rev(nextPal)} — a palindrome, disqualified
                </text>
              </motion.g>
            )}
          </g>
        )}

        {/* ================= phase 4: build N, then add its digits ================= */}
        {phase === 4 && (
          <g>
            <text x={MIRROR} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              {N} really is {addends} distinct {partDigits}-digit palindromes
            </text>

            {triple.map((p, i) => {
              const x = tileX(i);
              return (
                <g key={p}>
                  {i > 0 && (
                    <text x={x - (tilePitch - tileW) / 2} y={62} textAnchor="middle" fontSize="15" fontWeight="800" fill={DIM} fontFamily={numberFont}>
                      +
                    </text>
                  )}
                  <motion.g
                    initial={{ opacity: 0, y: -22, scale: 0.6 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 + i * 0.18 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <rect x={x} y={34} width={tileW} height={38} rx={7} fill="#dcfce7" stroke={WIN} strokeWidth={1.5} />
                    <line x1={x + tileW / 2} y1={36} x2={x + tileW / 2} y2={70} stroke={WIN} strokeWidth={1} strokeDasharray="3 2" />
                    <text x={x + 16} y={59} textAnchor="middle" fontSize="17" fontWeight="800" fill="#166534" fontFamily={numberFont}>
                      {String(p)[0]}
                    </text>
                    <text x={x + tileW - 16} y={59} textAnchor="middle" fontSize="17" fontWeight="800" fill="#166534" fontFamily={numberFont}>
                      {String(p)[String(p).length - 1]}
                    </text>
                  </motion.g>
                </g>
              );
            })}

            <motion.text x={MIRROR} y={88} textAnchor="middle" fontSize="13" fontWeight="800" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              =
            </motion.text>

            {/* the result stays put; a copy of each digit drops into the sum row */}
            {nDigits.map((d, i) => (
              <motion.g
                key={`res${i}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.95 + i * 0.06 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <Card x={resX(i)} y={98} w={bigW} h={38} text={String(d)} fill="#eef2ff" stroke={IND} color={IND} size={20} />
              </motion.g>
            ))}
            {nDigits.map((d, i) => (
              <motion.g
                key={`fly${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0], x: [0, 0, dsX(i) - resX(i), dsX(i) - resX(i)], y: [0, 0, 60, 60] }}
                transition={{ duration: 1.6, times: [0, 0.2, 0.85, 0.95], delay: 1.6 + i * 0.1 }}
              >
                <Card x={resX(i)} y={98} w={bigW} h={38} text={String(d)} fill="#eef2ff" stroke={IND} color={IND} size={20} />
              </motion.g>
            ))}
            {nDigits.map((d, i) => (
              <motion.g
                key={`ds${i}`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 16, delay: 2.9 + i * 0.1 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <Card x={dsX(i)} y={158} w={dsW} h={38} text={String(d)} fill="#eef2ff" stroke={IND} color={IND} size={19} />
              </motion.g>
            ))}

            {nDigits.map((_, i) =>
              i === 0 ? null : (
                <motion.text
                  key={`plus${i}`}
                  x={dsX(i) - (dsPitch - dsW) / 2}
                  y={182}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="800"
                  fill={DIM}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.2 }}
                >
                  +
                </motion.text>
              ),
            )}
            <motion.text
              x={dsX0 + dsSpan + 14}
              y={182}
              fontSize="15"
              fontWeight="800"
              fill={DIM}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.3 }}
            >
              =
            </motion.text>
            <motion.text
              x={dsX0 + dsSpan + 40}
              y={183}
              textAnchor="middle"
              fontSize="24"
              fontWeight="900"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 14, delay: 3.5 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {digitSum}
            </motion.text>
            <motion.text x={MIRROR} y={148} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}>
              now add the digits of {N}
            </motion.text>

            {traps.length > 0 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.8 }}>
                <line x1={30} y1={206} x2={W - 30} y2={206} stroke="#e2e8f0" strokeWidth={1.2} />
                <text x={30} y={224} fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                  climb past {N} by mistake and the later candidates land on real choices:
                </text>
                <text x={30} y={240} fontSize="9.5" fontWeight="700" fill={WARN} fontFamily={numberFont}>
                  {traps.map((t) => `${t.value}${t.pal ? " (a palindrome)" : ""} → ${t.sum}, choice ${t.letter}`).join("  ·  ")}
                </text>
              </motion.g>
            )}
          </g>
        )}
      </svg>

      <motion.span
        key={phase}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: phase === 4 ? "#166534" : "#4338ca",
          background: phase === 4 ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${phase === 4 ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {phase === 0
          ? `${parts.length} palindromes: ${base}×1 … ${base}×${mults[mults.length - 1]}`
          : phase === 1
          ? `${addends} of them add to ${base} × (${kMin}…${kMax})`
          : phase === 2
          ? `${N} is the first ${targetDigits}-digit sum available`
          : phase === 3
          ? `${N} backwards is ${rev(N)} — N = ${N}`
          : `${nDigits.join(" + ")} = ${digitSum}`}
      </motion.span>

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 4.1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
