import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const TERM_COLORS = ["#4338ca", "#0d9488", "#ea580c", "#16a34a", "#a855f7"];

/**
 * A sliding window can clip the tail of one term and the head of another
 * without containing either in full, so counting only whole terms that fit
 * undercounts how many *different* people the window can touch. The scene
 * lines up real consecutive terms, first slides the window aligned to a
 * term boundary (a beat on that trap, since it only reaches whole terms),
 * then slides it to straddle a boundary at both ends and counts every term
 * it overlaps at all. Data: { termLength, windowLength, termCount }.
 */
export function PrincipalTermWindowScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const termLength = Math.max(1, num(data.termLength, 3));
  const windowLength = Math.max(1, num(data.windowLength, 8));
  const termCount = Math.max(2, Math.round(num(data.termCount, 6)));

  const terms = Array.from({ length: termCount }, (_, i) => ({ start: i * termLength, end: (i + 1) * termLength }));

  // trap: window aligned exactly to a term boundary — only counts whole terms it fully contains, plus edges it barely touches
  const trapStart = 0;
  const trapEnd = trapStart + windowLength;
  const trapTouched = terms.filter((t) => t.start < trapEnd && t.end > trapStart);
  const trapFullyContained = terms.filter((t) => t.start >= trapStart && t.end <= trapEnd);
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(trapFullyContained.length));

  // optimal: shift so window clips 1 year off the front term and 1 year into a later term
  const offset = termLength - 1;
  const bestStart = offset > 0 ? offset : 0;
  const bestEnd = bestStart + windowLength;
  const bestTouched = terms.filter((t) => t.start < bestEnd && t.end > bestStart);
  const answerOk = problem.shortAnswer == null || String(bestTouched.length) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${bestTouched.length}, stored answer is ${problem.shortAnswer}` : "";

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showBest = step >= 2 || isFinal;

  const W = 300;
  const H = 170;
  const unit = 18;
  const x0 = 20;
  const y0 = 70;

  const winStart = showBest ? bestStart : showTrap ? trapStart : null;
  const winEnd = showBest ? bestEnd : showTrap ? trapEnd : null;
  const touched = showBest ? bestTouched : showTrap ? trapTouched : [];

  const caption = isFinal
    ? `the 8-year window overlaps ${bestTouched.length} different terms`
    : showBest
    ? `clip 1 year off the front term and 1 year into a later one`
    : showTrap
    ? trapChoice
      ? `aligned to a boundary, only ${trapFullyContained.length} whole terms fit — choice ${trapChoice.label}, but the window can touch partial terms too`
      : `aligned to a boundary, only ${trapFullyContained.length} whole terms fit fully inside`
    : `${termCount} consecutive ${termLength}-year terms, an ${windowLength}-year window`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <line x1={x0} y1={y0 + 40} x2={x0 + termCount * termLength * unit} y2={y0 + 40} stroke="#e2e8f0" strokeWidth={2} />
        {terms.map((t, i) => {
          const isTouched = touched.includes(t);
          const color = TERM_COLORS[i % TERM_COLORS.length];
          return (
            <motion.g key={i} initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: i * 0.08 }} style={{ transformBox: "fill-box", transformOrigin: "bottom" }}>
              <rect x={x0 + t.start * unit} y={y0} width={termLength * unit - 2} height={30} rx={4} fill={isTouched ? color : "#f1f5f9"} fillOpacity={isTouched ? 0.35 : 1} stroke={isTouched ? color : "#cbd5e1"} strokeWidth={isTouched ? 2 : 1.2} />
              <text x={x0 + t.start * unit + (termLength * unit - 2) / 2} y={y0 + 19} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={isTouched ? color : DIM} fontFamily={numberFont}>
                P{i + 1}
              </text>
            </motion.g>
          );
        })}

        {winStart != null && winEnd != null && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: "spring", stiffness: 180, damping: 20 }}>
            <rect x={x0 + winStart * unit} y={y0 - 14} width={(winEnd - winStart) * unit} height={58} rx={6} fill="none" stroke={showTrap ? BAD : WIN} strokeWidth={2.6} strokeDasharray={showTrap ? "5 3" : undefined} />
            <text x={x0 + winStart * unit + ((winEnd - winStart) * unit) / 2} y={y0 - 20} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={showTrap ? BAD : WIN} fontFamily={numberFont}>
              {windowLength}-year window
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
          fontSize: 11.5,
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
