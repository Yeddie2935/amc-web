import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const SHADE = "#94a3b8";
const WIN = "#16a34a";

/**
 * A square inscribed in a circle leaves four congruent corner pieces. Their
 * total area, πr² − 2r², scales with r², so shading only part of the big
 * circle's leftover and matching it to all of the small one's forces
 * R = r·√(leftParts / rightParts). Both circles are drawn to the same scale so
 * the size difference is visible; R is computed, and kept exact when it is.
 * Data: { r, leftShaded, rightShaded, unit? }.
 */
export function CircleSquareShadeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const r = Math.max(0.001, num(data.r, 1));
  const leftShaded = Math.max(0, Math.round(num(data.leftShaded, 4)));
  const rightShaded = Math.max(1, Math.round(num(data.rightShaded, 1)));
  const ratio = leftShaded / rightShaded;
  const R = r * Math.sqrt(ratio);
  const exact = Number.isInteger(R);
  const Rstr = exact ? `${R}` : R.toFixed(3);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showLeft = step >= 0;
  const showRight = step >= 1 || isFinal;
  const showEq = step >= 2 || isFinal;

  // ---- geometry: both circles at one scale ----
  const S = 42; // px per unit
  const lR = r * S;
  const rR = R * S;
  const W = 340;
  const lc = { x: 20 + lR, y: 112 };
  const rc = { x: W - 16 - rR, y: 112 };
  const H = 2 * Math.max(lR, rR) + 40;

  // the four corner pieces, each a chord-and-arc segment
  const seg = (cx: number, cy: number, rad: number, k: number) => {
    const a1 = (-45 + 90 * k) * (Math.PI / 180);
    const a2 = (45 + 90 * k) * (Math.PI / 180);
    const p = (a: number) => `${(cx + rad * Math.cos(a)).toFixed(2)},${(cy - rad * Math.sin(a)).toFixed(2)}`;
    return `M ${p(a1)} A ${rad},${rad} 0 0 0 ${p(a2)} Z`;
  };
  const sq = (cx: number, cy: number, rad: number) => {
    const h = (rad / Math.SQRT2).toFixed(2);
    return `M ${cx - +h},${cy - +h} L ${cx + +h},${cy - +h} L ${cx + +h},${cy + +h} L ${cx - +h},${cy + +h} Z`;
  };

  const Circle = ({ c, rad, shaded, label }: { c: { x: number; y: number }; rad: number; shaded: number; label: string }) => (
    <g>
      {Array.from({ length: 4 }).map((_, k) => (
        <motion.path
          key={k}
          d={seg(c.x, c.y, rad, k)}
          fill={k < shaded ? SHADE : "transparent"}
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 + k * 0.08 }}
        />
      ))}
      <circle cx={c.x} cy={c.y} r={rad} fill="none" stroke={INK} strokeWidth={1.8} />
      <path d={sq(c.x, c.y, rad)} fill="none" stroke={INK} strokeWidth={1.6} />
      <line x1={c.x} y1={c.y} x2={c.x + rad / Math.SQRT2} y2={c.y - rad / Math.SQRT2} stroke={INK} strokeWidth={1.3} />
      <circle cx={c.x} cy={c.y} r={2.4} fill={INK} />
      <text x={c.x + rad / 2.6} y={c.y - rad / 5} fontSize="13" fontWeight="800" fill={INK} fontFamily={numberFont}>
        {label}
      </text>
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {showLeft && <Circle c={lc} rad={lR} shaded={leftShaded} label={`${r}`} />}
        <AnimatePresence>
          {showRight && (
            <motion.g key="right" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 120, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <Circle c={rc} rad={rR} shaded={rightShaded} label="R" />
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
          color: isFinal ? "#166534" : "#4338ca",
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {!showRight
          ? `left: all ${leftShaded} pieces = π·${r}² − 2·${r}² = π − 2`
          : !showEq
          ? `right: ${rightShaded} of 4 pieces = R²(π − 2)/${4 / rightShaded === Math.round(4 / rightShaded) ? 4 / rightShaded : 4}`
          : !isFinal
          ? `π − 2 = R²(π − 2)/${ratio} → R² = ${ratio}`
          : `R = √${ratio} = ${Rstr}`}
      </motion.span>

      <AnimatePresence>
        {showEq && (
          <motion.span
            key="why"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            the leftover area scales with r², so π − 2 cancels
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
