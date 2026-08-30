import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0d9488";
const WIN = "#16a34a";
const BAD = "#dc2626";

function factorsOf(n: number): number[] {
  const out: number[] = [];
  for (let i = 1; i <= n; i++) if (n % i === 0) out.push(i);
  return out;
}

/**
 * Two stacked factor "collectors": the inner one sums n's own factors into
 * a bucket, and that result becomes the input to a second collector below
 * it. A beat is spent on the trap of dropping one real factor from the
 * second sum before every chip is counted.
 * Data: { n }.
 */
export function NestedFactorSumScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.max(2, Math.round(num(data.n, 11)));

  const innerFactors = factorsOf(n);
  const innerSum = innerFactors.reduce((a, b) => a + b, 0);
  const outerFactors = factorsOf(innerSum);
  const outerSum = outerFactors.reduce((a, b) => a + b, 0);

  const matches = problem.shortAnswer == null || String(outerSum) === String(problem.shortAnswer);
  const failure = !matches ? `check failed: sum of factors of ${innerSum} = ${outerSum}, stored answer is ${problem.shortAnswer}` : "";

  const dropped = outerFactors.find((f) => {
    if (f === 1 || f === innerSum) return false;
    const candidate = outerSum - f;
    return (problem.choices ?? []).some((c) => Number(c.text) === candidate);
  });
  const trapSum = dropped != null ? outerSum - dropped : null;
  const trapChoice = dropped != null ? (problem.choices ?? []).find((c) => Number(c.text) === trapSum) : null;

  const lastStep = totalSteps - 1;
  const showInnerChips = step >= 1;
  const showInnerSum = step >= 1;
  const showOuterSetup = step >= 2;
  const showTrap = step === 3;
  const showOuterChips = step >= 4;
  const isFinal = step >= lastStep;

  const outerVisibleCount = showOuterChips ? outerFactors.length : showTrap ? outerFactors.length : 0;

  const caption = isFinal
    ? `${outerFactors.join("+")} = ${outerSum}`
    : showOuterChips
    ? `[${innerSum}] = ${outerFactors.join("+")} = ${outerSum}`
    : showTrap && trapChoice
    ? `skipping ${dropped}: ${outerSum}−${dropped} = ${trapSum} — choice ${trapChoice.label}, but ${dropped} really divides ${innerSum}`
    : showOuterSetup
    ? `[[${n}]] means [${innerSum}]`
    : `[${n}] = sum of ${n}'s factors`;

  const note = failure || "";

  // ---- geometry: two stacked rows ----
  const W = 300;
  const chipW = 28;
  const chipGap = 6;
  const rowY1 = 30;
  const rowY2 = 140;
  const H = 210;

  const rowOf = (factors: number[], y: number, visibleCount: number, color: string) => {
    const totalW = factors.length * chipW + (factors.length - 1) * chipGap;
    const startX = (W - totalW) / 2;
    return factors.slice(0, visibleCount).map((f, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: y - 20 }} animate={{ opacity: 1, y }} transition={{ type: "spring", stiffness: 240, damping: 18, delay: i * 0.12 }}>
        <rect x={startX + i * (chipW + chipGap)} width={chipW} height={22} rx={5} fill={color} fillOpacity={0.7} stroke={color} strokeWidth={1.4} />
        <text x={startX + i * (chipW + chipGap) + chipW / 2} y={14} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily={numberFont}>
          {f}
        </text>
      </motion.g>
    ));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <text x={W / 2} y={16} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          factors of {n}
        </text>
        {showInnerChips && rowOf(innerFactors, rowY1, innerFactors.length, IND)}

        <AnimatePresence>
          {showInnerSum && (
            <motion.g key="innersum" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={W / 2 - 30} y={rowY1 + 34} width={60} height={22} rx={6} fill="#dcfce7" stroke={WIN} strokeWidth={1.4} />
              <text x={W / 2} y={rowY1 + 49} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#166534" fontFamily={numberFont}>
                [{n}] = {innerSum}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showOuterSetup && (
            <motion.g key="outersetup" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={W / 2} y={rowY1 + 78} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                factors of {innerSum}
              </text>
              {rowOf(outerFactors, rowY2, outerVisibleCount, TEAL)}
            </motion.g>
          )}
        </AnimatePresence>

        {/* trap: cross out the dropped chip */}
        <AnimatePresence>
          {showTrap && dropped != null && (
            <motion.g key="trap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {(() => {
                const idx = outerFactors.indexOf(dropped);
                const totalW = outerFactors.length * chipW + (outerFactors.length - 1) * chipGap;
                const startX = (W - totalW) / 2 + idx * (chipW + chipGap);
                return (
                  <>
                    <line x1={startX} y1={rowY2 - 6} x2={startX + chipW} y2={rowY2 + 22 + 6} stroke={BAD} strokeWidth={2} />
                    <line x1={startX + chipW} y1={rowY2 - 6} x2={startX} y2={rowY2 + 22 + 6} stroke={BAD} strokeWidth={2} />
                  </>
                );
              })()}
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isFinal && (
            <motion.g key="outersum" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={W / 2 - 34} y={rowY2 + 34} width={68} height={22} rx={6} fill="#dcfce7" stroke={WIN} strokeWidth={1.4} />
              <text x={W / 2} y={rowY2 + 49} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#166534" fontFamily={numberFont}>
                [{innerSum}] = {outerSum}
              </text>
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
          color: isFinal ? "#166534" : showTrap ? BAD : "#4338ca",
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
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
