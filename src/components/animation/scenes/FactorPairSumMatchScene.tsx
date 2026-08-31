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
 * Two whole numbers with a given product could be any of several factor
 * pairs, so the scene draws every whole-number factor pair of the product as
 * a real w×h rectangle, tests each pair's sum against the target sum, and
 * keeps only the one that survives — then spends a beat on the trap of
 * reporting the smaller number in that pair instead of the larger one the
 * question actually asks for. Data: { product, targetSum }.
 */
export function FactorPairSumMatchScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const product = Math.max(2, Math.round(num(data.product, 24)));
  const targetSum = Math.round(num(data.targetSum, 11));

  const pairs: { a: number; b: number }[] = [];
  for (let a = 1; a * a <= product; a++) {
    if (product % a === 0) pairs.push({ a, b: product / a });
  }
  const valid = pairs.find((p) => p.a + p.b === targetSum);
  const larger = valid ? valid.b : 0;
  const smaller = valid ? valid.a : 0;
  const answerOk = problem.shortAnswer == null || String(larger) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed larger number ${larger}, stored answer is ${problem.shortAnswer}` : "";
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(smaller));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showCheck = step >= 1;
  const showTrap = step === 2 && !isFinal;

  const W = 300;
  const H = 236;
  const rowH = 44;
  const x0 = 20;
  const cardW = 96;
  const cardH = 30;

  const caption = isFinal
    ? `the larger number is ${larger}`
    : showTrap
    ? trapChoice
      ? `the smaller number, ${smaller}, is tempting — choice ${trapChoice.label} — but the question asks for the larger`
      : `${smaller} is the smaller of the pair, not what's asked`
    : showCheck
    ? `only ${valid?.a} + ${valid?.b} = ${targetSum}`
    : `factor pairs of ${product}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {pairs.map((p, i) => {
          const y = 10 + i * rowH;
          const isValid = p.a + p.b === targetSum;
          const dim = showTrap || isFinal ? isValid : true;
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: dim ? 1 : 0.25, x: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: i * 0.15 }}
            >
              <rect x={x0} y={y} width={cardW} height={cardH} rx={6} fill={showCheck ? (isValid ? "#dcfce7" : "#f8fafc") : "#eef2ff"} stroke={showCheck && isValid ? WIN : showCheck ? "#e2e8f0" : IND} strokeWidth={1.3} />
              <text x={x0 + cardW / 2} y={y + 19} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={showCheck && isValid ? WIN : INK} fontFamily={numberFont}>
                {p.a} × {p.b} = {product}
              </text>
              {showCheck && (
                <text x={x0 + cardW + 10} y={y + 20} fontSize="11" fontWeight="700" fill={isValid ? WIN : BAD} fontFamily={numberFont}>
                  {p.a} + {p.b} = {p.a + p.b}{isValid ? " ✓" : " ✗"}
                </text>
              )}
            </motion.g>
          );
        })}

        {(showTrap || isFinal) && valid && (
          <motion.g
            key={showTrap ? "trap-pick" : "final-pick"}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.3 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <rect x={x0} y={200} width={cardW + 90} height={30} rx={8} fill={showTrap ? "#fee2e2" : "#dcfce7"} stroke={showTrap ? BAD : WIN} strokeWidth={1.4} />
            <text x={x0 + (cardW + 90) / 2} y={220} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={showTrap ? BAD : WIN} fontFamily={numberFont}>
              {showTrap ? `smaller: ${smaller}` : `larger: ${larger}`}
            </text>
          </motion.g>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? BAD : IND,
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
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
