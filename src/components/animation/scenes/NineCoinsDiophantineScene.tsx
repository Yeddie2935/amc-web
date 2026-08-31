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
 * Nine coins of four types with a fixed total value is a real Diophantine
 * search, not a guess — the scene eliminates pennies by subtracting the
 * coin-count equation from the value equation, then actually tries every
 * legal quarter count (with at least one of each coin required) and shows
 * only one survives, reading the dime count off that unique solution.
 * Data: { coinCount, totalCents, values (cents per coin type, e.g.
 * [1,5,10,25]), labels }.
 */
export function NineCoinsDiophantineScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const coinCount = Math.max(4, Math.round(num(data.coinCount, 9)));
  const totalCents = Math.max(1, Math.round(num(data.totalCents, 102)));
  const values = (Array.isArray(data.values) ? data.values : [1, 5, 10, 25]).map((v) => Math.round(num(v, 1)));
  const labels = (Array.isArray(data.labels) ? data.labels : ["penny", "nickel", "dime", "quarter"]).map(String);
  const [vP, vN, vD, vQ] = values;

  // p + n + d + q = coinCount;  vP p + vN n + vD d + vQ q = totalCents
  // eliminate p: (vN-vP) n + (vD-vP) d + (vQ-vP) q = totalCents - vP*coinCount
  const kN = vN - vP;
  const kD = vD - vP;
  const kQ = vQ - vP;
  const rhs = totalCents - vP * coinCount;

  const solutions: { n: number; d: number; q: number; p: number }[] = [];
  for (let q = 1; q < coinCount; q++) {
    for (let d = 1; d < coinCount; d++) {
      const rem = rhs - kQ * q - kD * d;
      if (rem <= 0 || rem % kN !== 0) continue;
      const n = rem / kN;
      if (n < 1) continue;
      const p = coinCount - n - d - q;
      if (p < 1) continue;
      solutions.push({ n, d, q, p });
    }
  }
  const answer = solutions[0];
  const answerOk = solutions.length === 1 && (problem.shortAnswer == null || String(answer.d) === String(problem.shortAnswer).trim());
  const failure = solutions.length !== 1 ? `found ${solutions.length} solutions, expected exactly 1` : !answerOk ? `dimes computed as ${answer.d}, stored answer is ${problem.shortAnswer}` : "";

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showElim = step >= 1;
  const showSearch = step >= 2 || isFinal;

  const W = 300;
  const H = 220;

  const testedQ = showSearch ? Array.from({ length: Math.min(coinCount - 1, 4) }, (_, i) => i + 1) : [];

  const caption = isFinal
    ? `p=${answer.p}, n=${answer.n}, d=${answer.d}, q=${answer.q} → ${answer.d} dime${answer.d === 1 ? "" : "s"}`
    : showSearch
    ? `testing every quarter count: only one gives a full valid solution`
    : showElim
    ? `${kN}n + ${kD}d + ${kQ}q = ${rhs}`
    : `${coinCount} coins, ${labels.join("/")}, total ${totalCents}¢`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <text x={W / 2} y={20} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
          p + n + d + q = {coinCount}
        </text>
        <text x={W / 2} y={38} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {vP}p + {vN}n + {vD}d + {vQ}q = {totalCents}
        </text>

        {showElim && (
          <motion.text x={W / 2} y={62} textAnchor="middle" fontSize="12" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {kN}n + {kD}d + {kQ}q = {rhs}
          </motion.text>
        )}

        {showSearch && (
          <g>
            {testedQ.map((q, i) => {
              const y = 90 + i * 30;
              const sol = solutions.find((s) => s.q === q);
              const ok = !!sol;
              return (
                <motion.g key={q} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: i * 0.15 }}>
                  <rect x={30} y={y} width={240} height={24} rx={6} fill={ok ? "#dcfce7" : "#f8fafc"} stroke={ok ? WIN : "#e2e8f0"} strokeWidth={ok ? 1.8 : 1.2} />
                  <text x={44} y={y + 16} fontSize="10" fontWeight="800" fill={ok ? WIN : DIM} fontFamily={numberFont}>
                    q={q}: {ok ? `n=${sol!.n}, d=${sol!.d}, p=${sol!.p} ✓` : "no valid n,d,p ✗"}
                  </text>
                </motion.g>
              );
            })}
          </g>
        )}
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
          color: isFinal ? "#166534" : IND,
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
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
