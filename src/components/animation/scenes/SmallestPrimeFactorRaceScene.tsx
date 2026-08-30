import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const NAVY = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

/** The smallest prime factor of n among the given test primes, or n if none divide. */
function smallestFactor(n: number, testPrimes: number[]): number {
  for (const p of testPrimes) if (n % p === 0) return p;
  return n;
}

/**
 * Every answer choice races against the same ordered list of small primes;
 * each row stops at the first prime that divides it (its smallest factor),
 * or runs out and is revealed prime. The row with the smallest factor found
 * wins. Data: { testPrimes }.
 */
export function SmallestPrimeFactorRaceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const testPrimes = (Array.isArray(data.testPrimes) ? data.testPrimes : [2, 3, 5, 7]).map(Number);

  const rows = (problem.choices ?? []).map((c) => {
    const n = Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d-]/g, ""));
    const sf = smallestFactor(n, testPrimes);
    const isPrime = sf === n;
    return { label: c.label, n, sf, isPrime };
  });
  const winner = rows.reduce((best, r) => (r.sf < best.sf ? r : best), rows[0]);

  const last = totalSteps - 1;
  // One more prime tested per step: step 0 -> only ÷2, step 1 -> ÷2,÷3, etc.
  const colsShown = Math.min(step + 1, testPrimes.length);
  const isFinal = step >= last;

  const colW = 42;
  const labelW = 34;
  const factorW = 70;
  const W = labelW + testPrimes.length * colW + factorW + 12;
  const rowH = 26;
  const headY = 16;
  const rowsY0 = headY + 16;
  const H = rowsY0 + rows.length * rowH + 8;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W }}>
        <text x={8} y={headY} fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={FONT}>
          n
        </text>
        {testPrimes.map((p, i) => (
          <text key={`h${p}`} x={labelW + i * colW + colW / 2} y={headY} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={FONT}>
            ÷{p}
          </text>
        ))}
        <text x={labelW + testPrimes.length * colW + factorW / 2} y={headY} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={FONT}>
          smallest
        </text>

        {rows.map((r, ri) => {
          const y = rowsY0 + ri * rowH;
          // Index of the test-prime column that found r's factor (or -1 if none yet reached).
          const hitCol = testPrimes.indexOf(r.sf);
          const isWinnerRow = isFinal && r.label === winner.label;
          return (
            <motion.g key={r.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 240, damping: 20, delay: ri * 0.08 }}>
              <text x={8} y={y + 14} fontSize="10.5" fontWeight="900" fill={isWinnerRow ? GREEN : NAVY} fontFamily={FONT}>
                {r.n}
              </text>
              {testPrimes.map((p, ci) => {
                const reached = ci < colsShown;
                const stoppedBefore = hitCol !== -1 && ci > hitCol;
                const cx = labelW + ci * colW + colW / 2;
                if (!reached || stoppedBefore) {
                  return (
                    <text key={`c${ci}`} x={cx} y={y + 14} textAnchor="middle" fontSize="10.5" fill={DIM} fontFamily={FONT}>
                      {stoppedBefore ? "·" : ""}
                    </text>
                  );
                }
                const divides = r.n % p === 0;
                return (
                  <motion.text
                    key={`c${ci}`}
                    x={cx}
                    y={y + 14}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="900"
                    fill={divides ? GREEN : RED}
                    fontFamily={FONT}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 16 }}
                  >
                    {divides ? "✓" : "✗"}
                  </motion.text>
                );
              })}
              <AnimatePresence>
                {(hitCol !== -1 ? hitCol < colsShown : colsShown >= testPrimes.length) && (
                  <motion.text
                    key="factor"
                    x={labelW + testPrimes.length * colW + factorW / 2}
                    y={y + 14}
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="900"
                    fill={isWinnerRow ? GREEN : INDIGO}
                    fontFamily={FONT}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  >
                    {r.isPrime ? `${r.n} (prime)` : r.sf}
                  </motion.text>
                )}
              </AnimatePresence>
              {isWinnerRow && <rect x={2} y={y - 3} width={W - 4} height={20} rx={5} fill="none" stroke={GREEN} strokeWidth={1.8} />}
            </motion.g>
          );
        })}
      </svg>

      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 700, textAlign: "center", maxWidth: W, color: isFinal ? GREEN : NAVY }}
      >
        {isFinal
          ? `${winner.n} has the smallest prime factor: ${winner.sf}`
          : colsShown >= testPrimes.length
          ? "every choice has now found its smallest prime factor (or proven itself prime)"
          : `testing each choice for a factor of ${testPrimes[colsShown - 1]}`}
      </motion.div>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
