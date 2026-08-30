import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const DIM = "#94a3b8";
const COLORS = ["#2563eb", "#f59e0b", "#a855f7"];

/**
 * Three tests each fill to their percent-correct, then combine into one bar
 * whose correct count is the sum, converted to an overall percent.
 * Data: { tests: [{ count: 10, pct: 70 }, { count: 20, pct: 80 }, { count: 30, pct: 90 }] }.
 */
export function CombinedTestPercentScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const rawTests = Array.isArray(data.tests) ? (data.tests as { count: number; pct: number }[]) : [
    { count: 10, pct: 70 },
    { count: 20, pct: 80 },
    { count: 30, pct: 90 },
  ];
  const tests = rawTests.map((t) => ({ count: num(t.count, 0), pct: num(t.pct, 0) }));
  const correct = tests.map((t) => Math.round((t.count * t.pct) / 100));
  const totalCount = tests.reduce((a, t) => a + t.count, 0);
  const totalCorrect = correct.reduce((a, c) => a + c, 0);
  const overallPct = Math.round((totalCorrect / totalCount) * 1000) / 10;

  const isFinal = step >= totalSteps - 1;
  const showCorrect = step >= 1;
  const showCombined = step >= 2;

  const barW = 200;
  const barH = 20;
  const rowY = [50, 90, 130];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? "three tests, each with a percent score"
          : isFinal
            ? "convert to an overall percent"
            : showCombined
              ? "combine into one 60-problem test"
              : "find how many correct on each test"}
      </div>

      {!showCombined && (
        <svg viewBox="0 0 360 160" width="100%" style={{ maxWidth: 380 }}>
          {tests.map((t, i) => (
            <g key={i} transform={`translate(80, ${rowY[i]})`}>
              <text x="-10" y={barH / 2 + 4} textAnchor="end" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>
                {t.count} Q
              </text>
              <rect x="0" y="0" width={barW} height={barH} rx="4" fill="#f1f5f9" />
              <motion.rect
                x="0"
                y="0"
                height={barH}
                rx="4"
                fill={COLORS[i]}
                initial={{ width: 0 }}
                animate={{ width: (t.pct / 100) * barW }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              />
              <text x={barW + 8} y={barH / 2 + 4} fontSize="11" fontWeight="800" fill={COLORS[i]} fontFamily={FONT}>
                {t.pct}%
              </text>
              <AnimatePresence>
                {showCorrect && (
                  <motion.text
                    key="c"
                    x={barW + 44}
                    y={barH / 2 + 4}
                    fontSize="11"
                    fontWeight="900"
                    fill={IND}
                    fontFamily={FONT}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    → {correct[i]}
                  </motion.text>
                )}
              </AnimatePresence>
            </g>
          ))}
        </svg>
      )}

      {showCombined && (
        <svg viewBox="0 0 320 90" width="100%" style={{ maxWidth: 340 }}>
          <text x="30" y="24" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>
            {totalCount} Q total
          </text>
          <rect x="30" y="34" width={barW + 40} height="26" rx="5" fill="#f1f5f9" stroke={INK} strokeWidth="1.2" />
          {(() => {
            let acc = 0;
            return tests.map((t, i) => {
              const segW = (correct[i] / totalCount) * (barW + 40);
              const x = 30 + acc;
              acc += segW;
              return <motion.rect key={i} x={x} y="34" width={segW} height="26" fill={COLORS[i]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 * i }} />;
            });
          })()}
          <text x="30" y="78" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>
            {correct.join(" + ")} = {totalCorrect} correct
          </text>
        </svg>
      )}

      {isFinal && (
        <div style={{ textAlign: "center", fontSize: 13, fontWeight: 900, color: IND, fontFamily: FONT, marginTop: 4 }}>
          {totalCorrect}/{totalCount} ≈ {overallPct}%
        </div>
      )}

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 4 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
