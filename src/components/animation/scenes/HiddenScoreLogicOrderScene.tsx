import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/**
 * Each hidden student can only compare their own score to Kaleana's visible
 * one, so each thought pins down exactly one relationship to K — Quay must
 * tie K (it's the only way he could know of a duplicate), Marty must beat K,
 * Shana must trail K. Rather than asserting the final order, the scene tests
 * every real answer choice (M, Q, S letters, this problem's own) against
 * those three derived constraints directly and keeps only the one that
 * survives all three. No configurable data — the puzzle's own three named
 * students are fixed by the problem.
 */
export function HiddenScoreLogicOrderScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  // constraint: Quay = K, Marty > K, Shana < K
  const rank = (letter: string) => (letter === "Q" ? 0 : letter === "M" ? 1 : letter === "S" ? -1 : 0);
  const satisfies = (order: string[]) => {
    for (let i = 0; i < order.length - 1; i++) {
      if (rank(order[i]) > rank(order[i + 1])) return false;
    }
    // Q must equal K conceptually: any order with Q strictly above M or below S is invalid too
    return true;
  };

  const choiceOrders = (problem.choices ?? []).map((c) => ({
    label: c.label,
    order: String(c.text).replace(/\s/g, "").split(","),
  }));
  const valid = choiceOrders.filter((c) => satisfies(c.order));
  const winner = valid[0] ?? choiceOrders[0];
  const answerOk = problem.answer == null || winner.label === problem.answer;
  const failure = valid.length !== 1 ? `${valid.length} choices satisfy all three constraints, expected exactly 1` : !answerOk ? `winning choice ${winner.label}, stored answer is ${problem.answer}` : "";

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showDerive = step >= 1;
  const showTest = step >= 2 || isFinal;

  const W = 300;
  const H = 220;
  const cx = 150;
  const cy = 60;

  const dotFor = (letter: string) => (letter === "Q" ? 0 : letter === "M" ? -34 : 34);

  const caption = isFinal
    ? `${winner.order.join(", ")} is the only order that fits`
    : showTest
    ? `check every choice against S < K = Q < M`
    : showDerive
    ? `Quay = K, Marty > K, Shana < K`
    : `Kaleana's score, K, is the one thing everyone can see`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {!showTest && (
          <g>
            <line x1={40} y1={cy} x2={260} y2={cy} stroke="#e2e8f0" strokeWidth={4} strokeLinecap="round" />
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <circle cx={cx} cy={cy} r={16} fill={INK} />
              <text x={cx} y={cy + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                K
              </text>
            </motion.g>

            {showDerive &&
              ["Q", "M", "S"].map((letter, i) => {
                const dx = dotFor(letter);
                const color = letter === "Q" ? IND : letter === "M" ? WIN : BAD;
                return (
                  <motion.g key={letter} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: i * 0.2 }}>
                    <circle cx={cx + dx} cy={cy} r={13} fill={color} fillOpacity={0.85} />
                    <text x={cx + dx} y={cy + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                      {letter}
                    </text>
                    <text x={cx + dx} y={cy + 30} textAnchor="middle" fontSize="9" fontWeight="700" fill={color} fontFamily={numberFont}>
                      {letter === "Q" ? "= K" : letter === "M" ? "> K" : "< K"}
                    </text>
                  </motion.g>
                );
              })}

            {!showDerive && (
              <text x={cx} y={cy + 40} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM}>
                Marty, Quay, and Shana each think about their own score
              </text>
            )}
          </g>
        )}

        {showTest && (
          <g>
            <text x={W / 2} y={16} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK}>
              test every choice against S &lt; K = Q &lt; M
            </text>
            {choiceOrders.map((c, i) => {
              const ok = satisfies(c.order);
              const isWinner = isFinal && c.label === winner.label;
              const y = 40 + i * 32;
              return (
                <motion.g key={c.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: i * 0.15 }}>
                  <rect x={40} y={y} width={220} height={24} rx={6} fill={isWinner ? "#dcfce7" : ok ? "#eef2ff" : "#f8fafc"} stroke={isWinner ? WIN : ok ? IND : "#e2e8f0"} strokeWidth={isWinner ? 2 : 1.3} />
                  <text x={52} y={y + 16} fontSize="10.5" fontWeight="800" fill={isWinner ? WIN : ok ? IND : DIM} fontFamily={numberFont}>
                    {c.label}: {c.order.join(", ")}
                  </text>
                  <text x={230} y={y + 16} fontSize="12" fontWeight="800" fill={ok ? WIN : BAD}>
                    {ok ? "✓" : "✗"}
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
          fontSize: 11.5,
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
