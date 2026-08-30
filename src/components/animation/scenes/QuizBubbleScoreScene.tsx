import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

/**
 * A row of answer bubbles fills in as correct (green), incorrect (red), and
 * blank (gray); only the greens count toward the score.
 * Data: { correct: 13, incorrect: 7, blank: 5 }.
 */
export function QuizBubbleScoreScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const correct = num(data.correct, 0);
  const incorrect = num(data.incorrect, 0);
  const blank = num(data.blank, 0);
  const total = correct + incorrect + blank;
  const isFinal = step >= totalSteps - 1;
  const showCorrect = step >= 1;
  const showRest = step >= 2;
  const showScore = isFinal;

  const cols = 5;
  const R = 11;
  const gapX = 30;
  const gapY = 32;
  const W = cols * gapX + 20;
  const rows = Math.ceil(total / cols);
  const H = rows * gapY + 30;

  const bubbleColor = (i: number) => {
    if (i < correct) return showCorrect ? WIN : "#e2e8f0";
    if (i < correct + incorrect) return showRest ? RED : "#e2e8f0";
    return showRest ? "#cbd5e1" : "#e2e8f0";
  };
  const bubbleLabel = (i: number) => {
    if (i < correct) return "✓";
    if (i < correct + incorrect) return "✗";
    return "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 6 }}>
        {step === 0
          ? "25 questions on the contest"
          : showRest
            ? "only correct answers earn points"
            : "13 correct, marked green"}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 200 }}>
        {Array.from({ length: total }).map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const cx = 26 + c * gapX;
          const cy = 26 + r * gapY;
          return (
            <motion.g
              key={i}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.02 * i, type: "spring", stiffness: 260, damping: 18 }}
            >
              <circle cx={cx} cy={cy} r={R} fill={bubbleColor(i)} stroke={INK} strokeWidth="1.2" />
              <AnimatePresence>
                {((i < correct && showCorrect) || (i >= correct && showRest)) && (
                  <motion.text
                    key="mark"
                    x={cx}
                    y={cy + 4}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="900"
                    fill="#fff"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    {bubbleLabel(i)}
                  </motion.text>
                )}
              </AnimatePresence>
            </motion.g>
          );
        })}
      </svg>

      <div style={{ textAlign: "center", fontSize: 11, fontWeight: 750, color: DIM, fontFamily: FONT, marginTop: 6 }}>
        {correct} correct + {incorrect} incorrect + {blank} blank = {total} questions
      </div>

      <AnimatePresence>
        {showScore && (
          <motion.div
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", fontSize: 15, fontWeight: 900, color: IND, fontFamily: FONT, marginTop: 8 }}
          >
            score = {correct} correct × 1 point = {correct}
          </motion.div>
        )}
      </AnimatePresence>

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 8 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
