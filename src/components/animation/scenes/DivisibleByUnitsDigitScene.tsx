import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/**
 * A number "works" only when its own units digit divides it evenly — the
 * scene tests every real number in the range row by row (grouped by tens
 * digit), lighting up the ones that pass, with a beat on the trap of
 * overlooking a less-obvious case (a units digit like 8, where the division
 * isn't as immediately visible as by 1, 2, or 5) before the full sweep.
 * Data: { lo, hi }.
 */
export function DivisibleByUnitsDigitScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const lo = Math.max(1, Math.round(num(data.lo, 10)));
  const hi = Math.max(lo + 1, Math.round(num(data.hi, 50)));

  const works = (n: number) => {
    const u = n % 10;
    return u !== 0 && n % u === 0;
  };

  const all: number[] = [];
  for (let n = lo; n < hi; n++) if (works(n)) all.push(n);
  const answerOk = problem.shortAnswer == null || String(all.length) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${all.length}, stored answer is ${problem.shortAnswer}` : "";

  // trap: the least-obvious case (largest units digit among the working numbers) is easy to miss
  const trapMiss = all.reduce((best, n) => (n % 10 > best % 10 ? n : best), all[0]);
  const trapCount = all.length - 1;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(trapCount));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showAll = step >= 2 || isFinal;

  const tens = Array.from(new Set(Array.from({ length: hi - lo }, (_, i) => lo + i).map((n) => Math.floor(n / 10))));
  const W = 300;
  const H = 30 + tens.length * 36;
  const cellW = 24;
  const x0 = 30;

  const caption = isFinal
    ? `${all.length} numbers work: ${all.join(", ")}`
    : showAll
    ? `testing every number from ${lo} to ${hi - 1}`
    : showTrap
    ? trapChoice
      ? `overlooking ${trapMiss} (÷${trapMiss % 10}, less obvious) gives only ${trapCount} — choice ${trapChoice.label}`
      : `overlooking ${trapMiss} gives only ${trapCount}, one short`
    : `test: does the number ÷ its own units digit come out even? (units digit 0 doesn't count)`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {tens.map((t, row) => {
          const rowNums = Array.from({ length: 10 }, (_, u) => t * 10 + u).filter((n) => n >= lo && n < hi);
          return (
            <g key={t}>
              <text x={x0 - 12} y={24 + row * 36 + 15} textAnchor="end" fontSize="9" fontWeight="800" fill={DIM} fontFamily={numberFont}>
                {t}x
              </text>
              {rowNums.map((n, i) => {
                const ok = works(n);
                const isTrapMiss = showTrap && n === trapMiss;
                const visible = showAll || isFinal || showTrap;
                const showOk = ok && (showAll || isFinal || showTrap) && !isTrapMiss;
                return (
                  <motion.g key={n} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: visible ? 1 : 0, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: (row * 10 + i) * 0.015 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <rect x={x0 + i * cellW} y={12 + row * 36} width={cellW - 3} height={26} rx={4} fill={isTrapMiss ? "#fee2e2" : showOk ? "#dcfce7" : "#f8fafc"} stroke={isTrapMiss ? BAD : showOk ? WIN : "#e2e8f0"} strokeWidth={showOk || isTrapMiss ? 1.6 : 1} />
                    <text x={x0 + i * cellW + (cellW - 3) / 2} y={12 + row * 36 + 17} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={isTrapMiss ? BAD : showOk ? WIN : DIM} fontFamily={numberFont}>
                      {n}
                    </text>
                  </motion.g>
                );
              })}
            </g>
          );
        })}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? BAD : IND,
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
          maxWidth: 300,
        }}
      >
        {caption}
      </motion.span>

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
      )}

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
