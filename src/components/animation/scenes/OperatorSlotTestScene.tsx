import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { answerOf, num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

type Op = { sym: string; label: string; fn: (a: number, b: number) => number };
const OPS: Op[] = [
  { sym: "÷", label: "÷", fn: (a, b) => a / b },
  { sym: "×", label: "×", fn: (a, b) => a * b },
  { sym: "+", label: "+", fn: (a, b) => a + b },
  { sym: "−", label: "−", fn: (a, b) => a - b },
];

/**
 * One blank operation sits between two numbers inside an expression whose
 * rest is fixed; every candidate operation is tried in the blank and carried
 * through to the full expression, rather than assuming the written solution's
 * single guess is the only one worth showing. The near-miss is subtraction:
 * it lands one off from the target, which is the natural slip for anyone who
 * skips checking and just guesses a "reasonable" operation.
 * Data: { a, b, tailAdd, tailSub, target }.
 */
export function OperatorSlotTestScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const a = Math.round(num(data.a, 6));
  const b = Math.round(num(data.b, 3));
  const tailAdd = Math.round(num(data.tailAdd, 4));
  const tailSub = Math.round(num(data.tailSub, 1));
  const target = Math.round(num(data.target, 5));

  const rows = OPS.map((op) => {
    const blank = op.fn(a, b);
    const total = blank + tailAdd - tailSub;
    return { ...op, blank, total, hit: total === target };
  });
  const winner = rows.find((r) => r.hit);
  const answer = answerOf(problem);
  const valid = winner != null && winner.sym === "÷";

  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), last);
  // 0: setup, 1: blank values, 2: full expression totals, 3: trap (near miss), 4: conclude
  const showBlank = beat >= 1;
  const showTotal = beat >= 2;
  const showTrap = beat === 3;
  const showConclude = beat >= 4;

  const W = 400;
  const H = 260;
  const rowY = (i: number) => 46 + i * 46;

  const caption =
    beat === 0
      ? `(${a} ? ${b}) + ${tailAdd} − (2 − 1) = ${target}`
      : beat === 1
      ? `try each operation between ${a} and ${b}`
      : beat === 2
      ? `carry each result through the rest of the expression`
      : beat === 3
      ? `subtraction gives ${rows.find((r) => r.sym === "−")!.total} — one off from ${target}, an easy slip`
      : `only division lands exactly on ${target}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px", boxSizing: "border-box" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 430, minWidth: 0, display: "block" }} aria-label="Testing each of the four operations in the blank of an arithmetic expression">
        <text x={W / 2} y="18" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>
          ({a} <tspan fill={IND}>?</tspan> {b}) + {tailAdd} − (2 − 1) = {target}
        </text>

        {rows.map((r, i) => {
          const y = rowY(i);
          const isTrap = showTrap && r.sym === "−";
          const isWinner = showConclude && r.hit;
          const rowColor = isWinner ? GREEN : isTrap ? RED : showTotal && !r.hit ? DIM : INK;
          return (
            <motion.g key={r.sym} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
              <rect x="20" y={y - 20} width={W - 40} height="34" rx="8" fill={isWinner ? "#f0fdf4" : isTrap ? "#fef2f2" : "#f8fafc"} stroke={isWinner ? GREEN : isTrap ? RED : "#cbd5e1"} strokeWidth={isWinner || isTrap ? 2.2 : 1.2} />
              <text x="40" y={y + 2} fontSize="15" fontWeight="950" fill={rowColor} fontFamily={FONT}>
                {r.sym}
              </text>
              {showBlank && (
                <motion.text x="90" y={y + 2} fontSize="12.5" fontWeight="850" fill={rowColor} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {a} {r.sym} {b} = {Number.isInteger(r.blank) ? r.blank : r.blank.toFixed(2)}
                </motion.text>
              )}
              {showTotal && (
                <motion.text x="255" y={y + 2} fontSize="13" fontWeight="900" fill={rowColor} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                  {Number.isInteger(r.blank) ? r.blank : r.blank.toFixed(2)} + {tailAdd} − 1 = {r.total}
                </motion.text>
              )}
              {isWinner && (
                <motion.text x={W - 32} y={y + 2} textAnchor="middle" fontSize="15" fontWeight="950" fill={GREEN} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }}>
                  ✓
                </motion.text>
              )}
              {isTrap && (
                <motion.text x={W - 32} y={y + 2} textAnchor="middle" fontSize="15" fontWeight="950" fill={RED} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }}>
                  ✕
                </motion.text>
              )}
            </motion.g>
          );
        })}

        <SvgAnswerBadge show={showConclude} answer={answer} cx={W / 2} y={228} width={100} />
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 11.5,
          fontWeight: 800,
          color: showTrap ? RED : showConclude ? (valid ? "#166534" : RED) : INK,
          background: showTrap ? "#fef2f2" : showConclude ? (valid ? "#dcfce7" : "#fef2f2") : "#eef2ff",
          border: `1px solid ${showTrap ? "#fecaca" : showConclude ? (valid ? "#bbf7d0" : "#fecaca") : "#c7d2fe"}`,
          padding: "5px 12px",
          borderRadius: 10,
          textAlign: "center",
          maxWidth: 380,
        }}
      >
        {caption}
      </motion.span>
    </div>
  );
}
