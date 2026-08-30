import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const AMBER = "#b45309";

/**
 * Trapezoid ABCD with a right angle at D, BE parallel to AD. The left
 * square ABED is highlighted first, then the matching square on the right
 * (B, its top-right corner, C, E) — a beat is spent on the trap of taking
 * that whole square as the triangle's area — before the diagonal BC splits
 * it and triangle BEC is revealed as exactly half.
 * Data: { ad, dc }.
 */
export function TrapezoidSquareSplitScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const ad = Math.max(1, num(data.ad, 3));
  const dc = Math.max(ad + 0.5, num(data.dc, 6));
  const ec = dc - ad;
  const area = 0.5 * ec * ad;

  const matches = problem.shortAnswer == null || Math.abs(area - Number(problem.shortAnswer)) < 1e-6;
  const failure = !matches ? `check failed: 0.5×${ec}×${ad} = ${area}, stored answer is ${problem.shortAnswer}` : "";

  const trapArea = ec * ad;
  const trapChoice = trapArea !== area ? (problem.choices ?? []).find((c) => Number(c.text) === trapArea) : null;

  const lastStep = totalSteps - 1;
  const showSquare = step >= 1;
  const showEC = step >= 2;
  const showTrapSquare = step >= 3;
  const showSplit = step >= 4;
  const isFinal = step >= lastStep;

  const caption = isFinal
    ? `½ × ${ec} × ${ad} = ${area}`
    : showSplit
    ? `diagonal BC splits the square — BEC is exactly half`
    : showTrapSquare
    ? trapChoice
      ? `${ec}×${ad} = ${trapArea} — choice ${trapChoice.label}, but that's the whole square, not triangle BEC`
      : `the right square also has area ${trapArea}`
    : showEC
    ? `DC = ${dc}, DE = ${ad}, so EC = ${ec}`
    : showSquare
    ? `ABED is a ${ad}×${ad} square since BE ∥ AD`
    : `trapezoid ABCD: AD ⊥ DC, AD = AB = ${ad}, DC = ${dc}`;

  const note = failure || "";

  // ---- geometry: fixed right-angle scale, unit = 28px ----
  const unit = 28;
  const ox = 20;
  const oy = 20;
  const A = { x: ox, y: oy };
  const D = { x: ox, y: oy + ad * unit };
  const C = { x: ox + dc * unit, y: oy + ad * unit };
  const B = { x: ox + ad * unit, y: oy };
  const E = { x: ox + ad * unit, y: oy + ad * unit };
  const TR = { x: ox + dc * unit, y: oy };

  const W = C.x + 24;
  const H = D.y + 30;

  const pathOf = (pts: { x: number; y: number }[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {/* trapezoid outline */}
        <motion.polygon
          points={pathOf([A, B, C, D])}
          fill="#f8fafc"
          stroke={INK}
          strokeWidth={1.6}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* left square ABED */}
        <AnimatePresence>
          {showSquare && (
            <motion.polygon
              key="sq"
              points={pathOf([A, B, E, D])}
              fill={IND}
              fillOpacity={0.3}
              stroke={IND}
              strokeWidth={1.4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            />
          )}
        </AnimatePresence>

        {/* EC bracket */}
        <AnimatePresence>
          {showEC && !showTrapSquare && (
            <motion.g key="ec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <line x1={E.x} x2={C.x} y1={E.y + 14} y2={C.y + 14} stroke={AMBER} strokeWidth={1.4} />
              <text x={(E.x + C.x) / 2} y={E.y + 28} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={AMBER} fontFamily={numberFont}>
                EC = {ec}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* right square B-TR-C-E, trap phase */}
        <AnimatePresence>
          {showTrapSquare && !showSplit && (
            <motion.polygon
              key="trapsq"
              points={pathOf([B, TR, C, E])}
              fill={BAD}
              fillOpacity={0.25}
              stroke={BAD}
              strokeWidth={1.4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            />
          )}
        </AnimatePresence>

        {/* split phase: diagonal BC, triangle BEC shaded green */}
        <AnimatePresence>
          {showSplit && (
            <motion.g key="split" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <polygon points={pathOf([B, TR, C])} fill="#e2e8f0" fillOpacity={0.6} stroke={INK} strokeWidth={1} />
              <motion.polygon
                points={pathOf([B, E, C])}
                fill={WIN}
                fillOpacity={0.55}
                stroke={WIN}
                strokeWidth={1.6}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
              <motion.line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={INK} strokeWidth={1.6} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
            </motion.g>
          )}
        </AnimatePresence>

        {/* vertex labels */}
        <text x={A.x - 12} y={A.y + 4} fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>A</text>
        <text x={B.x + 4} y={B.y - 4} fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>B</text>
        <text x={C.x + 4} y={C.y + 4} fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>C</text>
        <text x={D.x - 12} y={D.y + 4} fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>D</text>
        <text x={E.x - 4} y={E.y + 16} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>E</text>

        {/* side length labels */}
        <text x={A.x - 14} y={(A.y + D.y) / 2} textAnchor="end" fontSize="9" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>{ad}</text>
        <text x={D.x} y={D.y + 16} fontSize="9" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>DC = {dc}</text>
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
          color: isFinal ? "#166534" : showTrapSquare && !showSplit ? BAD : "#4338ca",
          background: isFinal ? "#dcfce7" : showTrapSquare && !showSplit ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrapSquare && !showSplit ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {note && (
          <motion.span
            key={`note-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: BAD, textAlign: "center" }}
          >
            {note}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.9 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
