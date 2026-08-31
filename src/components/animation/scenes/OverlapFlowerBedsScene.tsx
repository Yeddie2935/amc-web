import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { answerOf, num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";
const A_COLOR = "#4338ca";
const B_COLOR = "#0d9488";
const C_COLOR = "#db2777";

/**
 * Three flower beds where A overlaps both B and C but B and C don't touch —
 * a "chain" Venn layout, not a symmetric triple-overlap one, matching the
 * problem's own description. Adding all three plant counts double-counts
 * the two overlap regions, so those get their own highlighted beat before
 * being subtracted back out, rather than the total being asserted directly.
 * Data: { a, b, c, ab, ac, bc }.
 */
export function OverlapFlowerBedsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const a = Math.round(num(data.a, 500));
  const b = Math.round(num(data.b, 450));
  const c = Math.round(num(data.c, 350));
  const ab = Math.round(num(data.ab, 50));
  const ac = Math.round(num(data.ac, 100));
  const bc = Math.round(num(data.bc, 0));
  const rawSum = a + b + c;
  const overlapSum = ab + ac + bc;
  const total = rawSum - overlapSum;
  const answer = answerOf(problem);
  const valid = String(total) === (problem.shortAnswer ?? "").replace(/[^\d]/g, "");

  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), last);
  // 0: three beds, 1: add all three, 2: highlight overlaps, 3: subtract, 4: conclude
  const showSum = beat >= 1;
  const showOverlap = beat >= 2;
  const showSubtract = beat >= 3;
  const showConclude = beat >= 4;

  const W = 380;
  const H = 260;
  const cA = { x: 190, y: 110, r: 62 };
  const cB = { x: 130, y: 110, r: 44 };
  const cC = { x: 250, y: 110, r: 44 };

  const caption =
    beat === 0
      ? `bed A=${a}, B=${b}, C=${c}`
      : beat === 1
      ? `${a} + ${b} + ${c} = ${rawSum}`
      : beat === 2
      ? `A∩B=${ab} and A∩C=${ac} are each counted twice`
      : beat === 3
      ? `${rawSum} − (${ab} + ${ac}) = ${total}`
      : `total plants: ${total}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px", boxSizing: "border-box" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400, minWidth: 0, display: "block" }} aria-label="Three flower beds, A overlapping both B and C, with B and C not touching">
        <motion.circle cx={cB.x} cy={cB.y} r={cB.r} fill={`${B_COLOR}22`} stroke={B_COLOR} strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
        <motion.circle cx={cC.x} cy={cC.y} r={cC.r} fill={`${C_COLOR}22`} stroke={C_COLOR} strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />
        <motion.circle cx={cA.x} cy={cA.y} r={cA.r} fill={`${A_COLOR}18`} stroke={A_COLOR} strokeWidth="2.4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />

        <text x={cB.x - 18} y={cB.y - 4} textAnchor="middle" fontSize="14" fontWeight="950" fill={B_COLOR} fontFamily={FONT}>
          B
        </text>
        <text x={cB.x - 18} y={cB.y + 14} fontSize="10.5" fontWeight="850" fill={B_COLOR} textAnchor="middle" fontFamily={FONT}>
          {b}
        </text>
        <text x={cC.x + 18} y={cC.y - 4} textAnchor="middle" fontSize="14" fontWeight="950" fill={C_COLOR} fontFamily={FONT}>
          C
        </text>
        <text x={cC.x + 18} y={cC.y + 14} fontSize="10.5" fontWeight="850" fill={C_COLOR} textAnchor="middle" fontFamily={FONT}>
          {c}
        </text>
        <text x={cA.x} y={cA.y - 30} textAnchor="middle" fontSize="14" fontWeight="950" fill={A_COLOR} fontFamily={FONT}>
          A
        </text>
        <text x={cA.x} y={cA.y - 14} fontSize="10.5" fontWeight="850" fill={A_COLOR} textAnchor="middle" fontFamily={FONT}>
          {a}
        </text>

        {/* overlap call-outs */}
        <AnimatePresence>
          {showOverlap && (
            <motion.g key="overlaps" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 220, damping: 15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <circle cx={(cA.x + cB.x) / 2 + 8} cy={cA.y} r="15" fill="none" stroke={RED} strokeWidth="2.4" />
              <text x={(cA.x + cB.x) / 2 + 8} y={cA.y + 4} textAnchor="middle" fontSize="11" fontWeight="950" fill={RED} fontFamily={FONT}>
                {ab}
              </text>
              <circle cx={(cA.x + cC.x) / 2 - 8} cy={cA.y} r="15" fill="none" stroke={RED} strokeWidth="2.4" />
              <text x={(cA.x + cC.x) / 2 - 8} y={cA.y + 4} textAnchor="middle" fontSize="11" fontWeight="950" fill={RED} fontFamily={FONT}>
                {ac}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* running ledger */}
        <g transform="translate(20 200)">
          {showSum && (
            <motion.text x="0" y="0" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {a} + {b} + {c} = {rawSum}
            </motion.text>
          )}
          {showSubtract && (
            <motion.text x="0" y="18" fontSize="13" fontWeight="950" fill={showConclude ? (valid ? GREEN : RED) : INK} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {rawSum} − {ab} − {ac} = {total}
            </motion.text>
          )}
        </g>

        <SvgAnswerBadge show={showConclude} answer={answer} cx={W - 60} y={196} width={92} />
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 800,
          color: showConclude ? (valid ? "#166534" : "#dc2626") : INK,
          background: showConclude ? (valid ? "#dcfce7" : "#fef2f2") : "#eef2ff",
          border: `1px solid ${showConclude ? (valid ? "#bbf7d0" : "#fecaca") : "#c7d2fe"}`,
          padding: "5px 12px",
          borderRadius: 10,
          textAlign: "center",
          maxWidth: 320,
        }}
      >
        {caption}
      </motion.span>
    </div>
  );
}
