import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

function sectorPath(cx: number, cy: number, r: number, i: number, count: number): string {
  const a0 = -Math.PI / 2 + (2 * Math.PI * i) / count;
  const a1 = -Math.PI / 2 + (2 * Math.PI * (i + 1)) / count;
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  return `M ${cx},${cy} L ${x0},${y0} A ${r} ${r} 0 0 1 ${x1},${y1} Z`;
}

function sectorLabelPos(cx: number, cy: number, r: number, i: number, count: number): [number, number] {
  const mid = -Math.PI / 2 + (2 * Math.PI * (i + 0.5)) / count;
  return [cx + r * 0.6 * Math.cos(mid), cy + r * 0.6 * Math.sin(mid)];
}

const SECTOR_FILLS = ["#eef2ff", "#f8fafc", "#ecfdf5"];

/**
 * Two spinners, each divided into labeled sectors, spun together. The scene
 * draws both wheels for real, then lays out the sum of every sector pairing
 * as a 3×3 grid and colors each cell by whether that sum is prime — the
 * count of green cells over all nine is the probability.
 * Data: { valuesA:[1,3,5], valuesB:[2,4,6] }.
 */
export function TwoSpinnerPrimeSumScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const valuesA = (Array.isArray(data.valuesA) ? data.valuesA : [1, 3, 5]).map((v) => Math.round(Number(v) || 0));
  const valuesB = (Array.isArray(data.valuesB) ? data.valuesB : [2, 4, 6]).map((v) => Math.round(Number(v) || 0));

  const total = valuesA.length * valuesB.length;
  let primeCount = 0;
  const cells = valuesA.flatMap((a, ai) =>
    valuesB.map((b, bi) => {
      const sum = a + b;
      const prime = isPrime(sum);
      if (prime) primeCount++;
      return { ai, bi, a, b, sum, prime };
    }),
  );
  const nonPrime = cells.filter((c) => !c.prime);

  const matches = problem.shortAnswer == null || `${primeCount}/${total}` === String(problem.shortAnswer);
  const failure = !matches ? `check failed: ${primeCount}/${total}, stored answer is ${problem.shortAnswer}` : "";

  const lastStep = totalSteps - 1;
  const showGrid = step >= 1;
  const showColor = step >= 2;
  const showNonPrime = step >= 3;
  const isFinal = step >= lastStep;

  // ---- geometry ----
  const rSp = 30;
  const cxA = 62;
  const cxB = 172;
  const cySp = 42;
  const cell = 32;
  const gx0 = 42;
  const gy0 = 96;
  const W = 234;
  const H = gy0 + valuesA.length * cell + 30;

  const caption = isFinal
    ? `${primeCount}/${total} sums are prime`
    : showNonPrime
    ? `only ${nonPrime.length} sums are not prime: ${nonPrime.map((c) => `${c.a}+${c.b}=${c.sum}`).join(", ")}`
    : showColor
    ? `${primeCount} of the ${total} sums are prime`
    : showGrid
    ? `${total} equally likely sums, one per pair of sectors`
    : `spinner 1: ${valuesA.join(", ")} — spinner 2: ${valuesB.join(", ")}`;

  const note = failure || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 300 }}>
        {[
          { cx: cxA, values: valuesA },
          { cx: cxB, values: valuesB },
        ].map((sp, si) => (
          <motion.g
            key={si}
            initial={{ opacity: 0, rotate: -30 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: si * 0.15 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            {sp.values.map((v, i) => (
              <g key={i}>
                <path d={sectorPath(sp.cx, cySp, rSp, i, sp.values.length)} fill={SECTOR_FILLS[i % SECTOR_FILLS.length]} stroke={INK} strokeWidth={1.2} />
                <text
                  x={sectorLabelPos(sp.cx, cySp, rSp, i, sp.values.length)[0]}
                  y={sectorLabelPos(sp.cx, cySp, rSp, i, sp.values.length)[1] + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="800"
                  fill={INK}
                  fontFamily={numberFont}
                >
                  {v}
                </text>
              </g>
            ))}
            <circle cx={sp.cx} cy={cySp} r={2.6} fill={INK} />
          </motion.g>
        ))}

        {/* the outcome grid: one cell per pair of sectors */}
        <AnimatePresence>
          {showGrid &&
            cells.map((c) => {
              const x = gx0 + c.bi * cell;
              const y = gy0 + c.ai * cell;
              const wash = showColor ? (c.prime ? "#dcfce7" : "#fee2e2") : "#eef2ff";
              const stroke = showColor ? (c.prime ? WIN : BAD) : IND;
              const flagged = showNonPrime && !c.prime;
              return (
                <motion.g
                  key={`${c.a}-${c.b}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18, delay: (c.ai * 3 + c.bi) * 0.05 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <rect x={x + 3} y={y + 3} width={cell - 6} height={cell - 6} rx={6} fill={wash} stroke={stroke} strokeWidth={flagged ? 2.4 : 1.4} />
                  <text x={x + cell / 2} y={y + cell / 2 + 4} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={showColor ? (c.prime ? "#166534" : BAD) : INK} fontFamily={numberFont}>
                    {c.sum}
                  </text>
                </motion.g>
              );
            })}
        </AnimatePresence>

        {/* column/row headers on the grid */}
        <AnimatePresence>
          {showGrid && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {valuesB.map((b, bi) => (
                <text key={`b${bi}`} x={gx0 + bi * cell + cell / 2} y={gy0 - 6} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                  {b}
                </text>
              ))}
              {valuesA.map((a, ai) => (
                <text key={`a${ai}`} x={gx0 - 8} y={gy0 + ai * cell + cell / 2 + 4} textAnchor="end" fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                  {a}
                </text>
              ))}
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : showNonPrime ? "#dc2626" : "#4338ca",
          background: isFinal ? "#dcfce7" : showNonPrime ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showNonPrime ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {note && (
          <motion.span
            key={`note-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: BAD, textAlign: "center" }}
          >
            {note}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.9 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
