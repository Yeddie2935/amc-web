import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const AMBER = "#f59e0b";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

/** A product divided by the sum of the same consecutive integers. Pair the
 * sum, factor it, then cancel those factors from the product. Data: { from,to }. */
export function ProductSumCancelScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const from = Math.round(num(data.from, 1));
  const to = Math.round(num(data.to, 8));
  const terms = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  const denominator = terms.reduce((a, b) => a + b, 0);
  const numerator = terms.reduce((a, b) => a * b, 1);
  const result = numerator / denominator;
  const pairs = terms.slice(0, Math.floor(terms.length / 2)).map((v, i) => [v, terms[terms.length - 1 - i]]);
  const pairSums = pairs.map(([a, b]) => a + b);
  const stated = Number(String(problem.shortAnswer ?? "").replace(/[^0-9.-]/g, ""));
  const final = step >= totalSteps - 1;

  // For 1..8, 36 = 4·3·3 cancels the whole 4, the whole 3, and one factor 3
  // from 6, leaving 2. Compute the survivors from those real divisor factors.
  const divisors = [4, 3, 3];
  const survivors = [...terms];
  for (const d of divisors) {
    const idx = survivors.findIndex((v) => v % d === 0);
    if (idx >= 0) survivors[idx] /= d;
  }
  const survivorProduct = survivors.reduce((a, b) => a * b, 1);
  const pairsValid = pairs.length * 2 === terms.length && pairSums.every((v) => v === pairSums[0]);
  const cancellationValid = divisors.reduce((a, b) => a * b, 1) === denominator && survivorProduct === result;
  const answerMatches = problem.shortAnswer == null || stated === result;
  const consistent = pairsValid && cancellationValid && answerMatches;

  const x = (i: number) => 33 + i * 45;
  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
    <svg viewBox="0 0 390 230" width="100%" style={{ maxWidth: 430 }}>
      {!final ? <>
        <text x="195" y="20" textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM}>PAIR THE OUTSIDE TERMS</text>
        {terms.map((v, i) => <motion.g key={v} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
          <circle cx={x(i)} cy="62" r="16" fill="#eef2ff" stroke={INDIGO} strokeWidth="1.5" />
          <text x={x(i)} y="67" textAnchor="middle" fontSize="14" fontWeight="900" fill={INDIGO} fontFamily={mono}>{v}</text>
        </motion.g>)}
        {pairs.map(([a, b], i) => {
          const ia = terms.indexOf(a), ib = terms.indexOf(b);
          const y = 93 + i * 25;
          return <motion.g key={a} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 + i * 0.16 }}>
            <path d={`M ${x(ia)} 80 Q ${(x(ia) + x(ib)) / 2} ${y + 10} ${x(ib)} 80`} fill="none" stroke={AMBER} strokeWidth="1.8" />
            <rect x="162" y={y} width="66" height="20" rx="10" fill="#fffbeb" stroke={AMBER} />
            <text x="195" y={y + 14} textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#b45309" fontFamily={mono}>{a}+{b}={a + b}</text>
          </motion.g>;
        })}
        <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 210, damping: 15, delay: 1.2 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x="111" y="199" width="168" height="27" rx="13" fill="#eef2ff" stroke={INDIGO} />
          <text x="195" y="217" textAnchor="middle" fontSize="13" fontWeight="900" fill={INDIGO} fontFamily={mono}>{pairs.length} × {pairSums[0]} = {denominator}</text>
        </motion.g>
      </> : <>
        <text x="195" y="18" textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM}>FACTOR 36, THEN CANCEL</text>
        {terms.map((v, i) => {
          const cancelled = v === 3 || v === 4;
          const splitSix = v === 6;
          return <g key={v}>
            <motion.rect x={x(i) - 16} y="35" width="32" height="31" rx="7" animate={{ fill: cancelled ? "#f1f5f9" : splitSix ? "#fffbeb" : "#eef2ff", stroke: cancelled ? DIM : splitSix ? AMBER : INDIGO }} strokeWidth="1.5" />
            <text x={x(i)} y="55" textAnchor="middle" fontSize="14" fontWeight="900" fill={cancelled ? DIM : splitSix ? "#b45309" : INK} fontFamily={mono}>{splitSix ? "2·3" : v}</text>
            {cancelled && <motion.line x1={x(i) - 11} y1="59" x2={x(i) + 11} y2="42" stroke={RED} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 + i * 0.05 }} />}
            {splitSix && <motion.line x1={x(i) + 3} y1="59" x2={x(i) + 13} y2="42" stroke={RED} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8 }} />}
          </g>;
        })}
        <line x1="16" y1="77" x2="374" y2="77" stroke={INK} strokeWidth="2" />
        {divisors.map((v, i) => <motion.g key={i} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 190, damping: 17, delay: 0.2 + i * 0.16 }}>
          <rect x={133 + i * 45} y="88" width="34" height="28" rx="7" fill="#fee2e2" stroke={RED} />
          <text x={150 + i * 45} y="107" textAnchor="middle" fontSize="13" fontWeight="900" fill={RED} fontFamily={mono}>{v}</text>
          <motion.line x1={138 + i * 45} y1="110" x2={162 + i * 45} y2="94" stroke={RED} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.65 + i * 0.12 }} />
        </motion.g>)}
        <text x="195" y="135" textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM} fontFamily={mono}>36 = 4 × 3 × 3</text>
        <motion.g initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
          <rect x="37" y="151" width="316" height="31" rx="10" fill="#dcfce7" stroke={GREEN} />
          <text x="195" y="171" textAnchor="middle" fontSize="13" fontWeight="900" fill={GREEN} fontFamily={mono}>{survivors.filter((v) => v !== 1).join(" × ")} = {survivorProduct.toLocaleString()}</text>
        </motion.g>
        {consistent && <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 14, delay: 1.25 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <circle cx="195" cy="210" r="18" fill={GREEN} />
          <text x="195" y="215" textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff">✓</text>
        </motion.g>}
      </>}
    </svg>
    <motion.span key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: mono, fontSize: 12, fontWeight: 800, color: final ? "#166534" : INDIGO, textAlign: "center" }}>
      {final ? "the denominator disappears into matching numerator factors" : `four equal pairs make the denominator ${denominator}`}
    </motion.span>
    {!consistent && final && <span style={{ color: RED, fontFamily: mono, fontSize: 11, fontWeight: 800 }}>{!pairsValid ? "the sum does not form equal pairs" : !cancellationValid ? "the divisor factors do not reproduce the quotient" : `computed ${result}, stored ${problem.shortAnswer}`}</span>}
    <AnimatePresence>{final && consistent && problem.answer && <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.4 }} style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 700, fontSize: 15 }}>Answer {problem.answer}</motion.div>}</AnimatePresence>
  </div>;
}
