import { AnimatePresence, motion } from "motion/react";
import type { Problem } from "../../../types/amc";

/** Preferred short answer for a badge: shortAnswer, else the answer label. */
export function answerOf(problem: Problem): string | null {
  return problem.shortAnswer ?? (problem.answer != null ? String(problem.answer) : null);
}

/** Read the problem's sparse animation data without per-scene boilerplate. */
export function sceneData(problem: Problem): Record<string, unknown> {
  return problem.animation?.data ?? {};
}

/** Coerce a possibly-missing data field to a finite number, else fallback. */
export function num(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Shared answer badge for SVG-based scenes, popping in on the final step. */
export function SvgAnswerBadge({
  show,
  answer,
  cx = 100,
  y = 192,
  width = 92,
}: {
  show: boolean;
  answer: string | null;
  cx?: number;
  y?: number;
  width?: number;
}) {
  return (
    <AnimatePresence>
      {show && answer && (
        <motion.g
          key="answer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
        >
          <rect x={cx - width / 2} y={y} width={width} height="24" rx="12" fill="#16a34a" />
          <text x={cx} y={y + 16} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">
            Answer {answer}
          </text>
        </motion.g>
      )}
    </AnimatePresence>
  );
}
