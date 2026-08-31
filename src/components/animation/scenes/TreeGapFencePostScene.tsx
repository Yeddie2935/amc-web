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
 * A classic fence-post trap: N trees have N-1 gaps between them, not N. The
 * scene plants the real number of trees along a road, counts the gaps from
 * the 1st to the 4th tree to find one gap's real length, then has to survive
 * the trap of multiplying by the tree count instead of the gap count before
 * spanning the true full distance. Data: { treeCount, fromTree, toTree,
 * knownDistance, targetTree }.
 */
export function TreeGapFencePostScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const treeCount = Math.max(2, Math.round(num(data.treeCount, 6)));
  const fromTree = Math.max(1, Math.round(num(data.fromTree, 1)));
  const toTree = Math.max(fromTree + 1, Math.round(num(data.toTree, 4)));
  const knownDistance = Math.max(1, num(data.knownDistance, 60));
  const targetTree = Math.max(fromTree + 1, Math.round(num(data.targetTree, treeCount)));

  const knownGaps = toTree - fromTree;
  const gapLength = knownDistance / knownGaps;
  const targetGaps = targetTree - fromTree;
  const total = gapLength * targetGaps;
  const answerOk = problem.shortAnswer == null || `${total} feet` === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${total} feet, stored answer is ${problem.shortAnswer}` : "";

  const trapGaps = targetTree;
  const trapTotal = gapLength * trapGaps;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(trapTotal));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showGapLength = step >= 1;
  const showTrap = step === 2 && !isFinal;
  const showFull = isFinal;

  const W = 300;
  const H = 170;
  const roadY = 110;
  const x0 = 22;
  const x1 = 278;
  const spacing = (x1 - x0) / (treeCount - 1);

  const caption = isFinal
    ? `${targetGaps} × ${gapLength} = ${total} feet`
    : showTrap
    ? trapChoice
      ? `${trapGaps} trees × ${gapLength} = ${trapTotal} — choice ${trapChoice.label}, but there are only ${targetGaps} gaps between tree ${fromTree} and tree ${targetTree}`
      : `counting ${trapGaps} instead of ${targetGaps} gaps gives ${trapTotal}, the wrong count`
    : showGapLength
    ? `${knownDistance} ÷ ${knownGaps} = ${gapLength} feet per gap`
    : `${knownGaps} gaps between tree ${fromTree} and tree ${toTree} span ${knownDistance} feet`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <line x1={x0} y1={roadY} x2={x1} y2={roadY} stroke="#e2e8f0" strokeWidth={4} />

        {Array.from({ length: treeCount }).map((_, i) => {
          const x = x0 + i * spacing;
          const treeNum = i + 1;
          const inKnownRange = treeNum >= fromTree && treeNum <= toTree;
          const inTargetRange = showFull && treeNum >= fromTree && treeNum <= targetTree;
          return (
            <motion.g key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay: i * 0.1 }}>
              <text x={x} y={roadY - 6} textAnchor="middle" fontSize="18">
                🌳
              </text>
              <circle cx={x} cy={roadY} r={3} fill={inTargetRange ? WIN : inKnownRange ? IND : DIM} />
              <text x={x} y={roadY + 20} textAnchor="middle" fontSize="9" fontWeight="800" fill={inTargetRange ? WIN : inKnownRange ? IND : DIM} fontFamily={numberFont}>
                {treeNum}
              </text>
            </motion.g>
          );
        })}

        {showGapLength && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
            <line x1={x0} y1={roadY + 32} x2={x0 + (toTree - fromTree) * spacing} y2={roadY + 32} stroke={IND} strokeWidth={2.5} />
            <text x={x0 + ((toTree - fromTree) * spacing) / 2} y={roadY + 46} textAnchor="middle" fontSize="10" fontWeight="800" fill={IND} fontFamily={numberFont}>
              {knownDistance} ft over {knownGaps} gaps
            </text>
          </motion.g>
        )}

        {showFull && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
            <line x1={x0} y1={roadY - 26} x2={x0 + (targetTree - fromTree) * spacing} y2={roadY - 26} stroke={WIN} strokeWidth={2.5} />
            <text x={x0 + ((targetTree - fromTree) * spacing) / 2} y={roadY - 34} textAnchor="middle" fontSize="10" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              {total} feet total
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
