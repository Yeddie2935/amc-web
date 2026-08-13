import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const KEEP = "#16a34a";
const DROP = "#dc2626";

const isPrime = (n: number) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
};

/**
 * Numbers one less than a perfect square factor as (k−1)(k+1), so such a number
 * is a product of exactly two primes only when both of those factors are prime.
 * The scene lists every candidate in range that also ends in the required
 * digits, then tests each factor pair and strikes out the failures — the
 * candidates and the verdicts are generated, not listed by hand.
 * Data: { digits, minValue, maxValue }.
 */
export function CandidateSieveScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const endsWith = Math.max(0, Math.round(num(data.digits, 99)));
  const mod = Math.pow(10, String(endsWith).length);
  const lo = Math.round(num(data.minValue, 1000));
  const hi = Math.round(num(data.maxValue, 9999));

  // every k with k² − 1 in range and ending in the required digits
  const cands: { k: number; v: number; a: number; b: number; ok: boolean }[] = [];
  for (let k = 2; k * k - 1 <= hi; k++) {
    const v = k * k - 1;
    if (v < lo) continue;
    if (v % mod !== endsWith) continue;
    const a = k - 1;
    const b = k + 1;
    cands.push({ k, v, a, b, ok: isPrime(a) && isPrime(b) });
  }
  const winners = cands.filter((c) => c.ok);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showList = step >= 1 || isFinal;
  const showTest = step >= 2 || isFinal;

  const rowH = 24;
  const W = 340;
  const H = 26 + cands.length * rowH + 8;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        <text x={12} y={14} fontSize="10.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          k² − 1 = (k − 1)(k + 1), ending in {endsWith}
        </text>
        {showList &&
          cands.map((c, i) => {
            const y = 26 + i * rowH;
            const struck = showTest && !c.ok;
            const kept = showTest && c.ok;
            return (
              <motion.g
                key={c.k}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: struck ? 0.45 : 1, x: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 18, delay: i * 0.07 }}
              >
                <rect x={12} y={y} width={W - 24} height={rowH - 5} rx={5} fill={kept ? "#dcfce7" : "#f8fafc"} stroke={kept ? KEEP : struck ? "#fecaca" : "#e2e8f0"} strokeWidth={kept ? 2 : 1.2} />
                <text x={22} y={y + 13} fontSize="12" fontWeight="800" fill={kept ? "#166534" : INK} fontFamily={numberFont}>
                  {c.v}
                </text>
                <text x={78} y={y + 13} fontSize="11.5" fontWeight="700" fill={kept ? "#166534" : "#64748b"} fontFamily={numberFont}>
                  = {c.a} × {c.b}
                </text>
                {showTest && (
                  <>
                    <text x={200} y={y + 13} fontSize="10.5" fontWeight="700" fill={isPrime(c.a) ? KEEP : DROP} fontFamily={numberFont}>
                      {c.a}{isPrime(c.a) ? " ✓" : " ✗"}
                    </text>
                    <text x={252} y={y + 13} fontSize="10.5" fontWeight="700" fill={isPrime(c.b) ? KEEP : DROP} fontFamily={numberFont}>
                      {c.b}{isPrime(c.b) ? " ✓" : " ✗"}
                    </text>
                    {struck && <line x1={16} y1={y + 9} x2={W - 30} y2={y + 9} stroke={DROP} strokeWidth={1.6} />}
                  </>
                )}
              </motion.g>
            );
          })}
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
          color: isFinal ? "#166534" : "#4338ca",
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {!showList
          ? `one less than a square factors as (k − 1)(k + 1)`
          : !showTest
          ? `${cands.length} candidates end in ${endsWith}`
          : !isFinal
          ? `keep only those with both factors prime`
          : `${winners.length} number${winners.length === 1 ? "" : "s"} works: ${winners.map((w) => `${w.v} = ${w.a} × ${w.b}`).join(", ")}`}
      </motion.span>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: KEEP, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
