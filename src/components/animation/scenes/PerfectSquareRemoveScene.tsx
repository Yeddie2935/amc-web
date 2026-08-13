import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const TILE = "#eef2ff";
const EDGE = "#c7d2fe";
const WIN = "#16a34a";
const BAD = "#dc2626";

/**
 * Leave one number out of a run so the rest adds to a perfect square. Removing a
 * single term can only land the total in a narrow window, and usually just one
 * square sits inside it — so instead of testing every case the scene shows the
 * window and the squares near it, then packs the winning total into a real
 * square array of dots. Total, window, squares and the removed value are all
 * computed.
 * Data: { from, to }.
 */
export function PerfectSquareRemoveScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const from = Math.round(num(data.from, 1));
  const to = Math.round(num(data.to, 9));
  const nums: number[] = [];
  for (let i = from; i <= to; i++) nums.push(i);
  const total = nums.reduce((a, b) => a + b, 0);

  const lo = total - to; // remove the biggest
  const hi = total - from; // remove the smallest
  const squares: number[] = [];
  for (let r = 1; r * r <= hi + 12; r++) if (r * r >= lo - 12) squares.push(r * r);
  const inWindow = squares.filter((v) => v >= lo && v <= hi);
  const winner = inWindow.length ? inWindow[0] : null;
  const removed = winner != null ? total - winner : null;
  const root = winner != null ? Math.round(Math.sqrt(winner)) : 0;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showWindow = step >= 1 || isFinal;
  const showSquares = step >= 2 || isFinal;

  // ---- geometry ----
  const W = 340;
  const tw = Math.min(32, (W - 24) / nums.length);
  const tileY = 22;
  const winY = 92;
  const cw = Math.min(30, (W - 40) / (hi - lo + 1));
  const winX = (W - (hi - lo + 1) * cw) / 2;
  const dot = 11;
  const gridY = 150;
  const H = isFinal ? gridY + root * dot + 26 : 150;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 370 }}>
        {/* the numbers being added */}
        {nums.map((n, i) => {
          const gone = isFinal && n === removed;
          const x = (W - nums.length * tw) / 2 + i * tw;
          return (
            <motion.g
              key={n}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: gone ? 0.4 : 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 17, delay: i * 0.04 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect x={x + 2} y={tileY} width={tw - 4} height={26} rx={5} fill={gone ? "#fee2e2" : TILE} stroke={gone ? BAD : EDGE} strokeWidth={gone ? 2 : 1.3} />
              <text x={x + tw / 2} y={tileY + 18} textAnchor="middle" fontSize="13" fontWeight="800" fill={gone ? BAD : INK} fontFamily={numberFont}>
                {n}
              </text>
              {gone && <line x1={x + 3} y1={tileY + 13} x2={x + tw - 3} y2={tileY + 13} stroke={BAD} strokeWidth={2} />}
            </motion.g>
          );
        })}
        <text x={W / 2} y={tileY + 44} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
          sum = {total}
        </text>

        {/* what is left after removing one number */}
        <AnimatePresence>
          {showWindow && (
            <motion.g key="win" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
              {Array.from({ length: hi - lo + 1 }).map((_, i) => {
                const v = lo + i;
                const isSq = showSquares && v === winner;
                return (
                  <g key={v}>
                    <rect
                      x={winX + i * cw + 1}
                      y={winY}
                      width={cw - 2}
                      height={24}
                      rx={4}
                      fill={isSq ? "#dcfce7" : "#f8fafc"}
                      stroke={isSq ? WIN : "#e2e8f0"}
                      strokeWidth={isSq ? 2.2 : 1.1}
                    />
                    <text x={winX + i * cw + cw / 2} y={winY + 16} textAnchor="middle" fontSize="11" fontWeight="800" fill={isSq ? "#166534" : "#64748b"} fontFamily={numberFont}>
                      {v}
                    </text>
                  </g>
                );
              })}
              <text x={W / 2} y={winY - 6} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                what is left: {lo} to {hi}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the winning total packed into a real square */}
        <AnimatePresence>
          {isFinal && winner != null && (
            <motion.g key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
              {Array.from({ length: root }).map((_, r) =>
                Array.from({ length: root }).map((__, c) => (
                  <motion.circle
                    key={`${r}-${c}`}
                    cx={W / 2 - (root * dot) / 2 + c * dot + dot / 2}
                    cy={gridY + r * dot + dot / 2}
                    r={dot / 2 - 1.6}
                    fill={WIN}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.3 + (r * root + c) * 0.008 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  />
                ))
              )}
              <text x={W / 2 + (root * dot) / 2 + 12} y={gridY + (root * dot) / 2 + 4} fontSize="12" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {root} × {root}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : showSquares ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : showSquares ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showSquares ? "#fde68a" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {!showWindow
          ? `${from} + ⋯ + ${to} = ${total}`
          : !showSquares
          ? `taking one away leaves ${lo} to ${hi}`
          : !isFinal
          ? `the only square in that range is ${winner} = ${root}²`
          : `left out ${total} − ${winner} = ${removed}`}
      </motion.span>

      <AnimatePresence>
        {showSquares && (
          <motion.span
            key="near"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            nearby squares: {squares.map((v) => `${Math.round(Math.sqrt(v))}²=${v}`).join("  ")}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.45 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
