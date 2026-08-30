import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/** Both real roots of |P1 + t(P2-P1) - C| = r, sorted, or [] if the line misses the circle. */
function circleLineHits(x1: number, y1: number, x2: number, y2: number, cx: number, cy: number, r: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const fx = x1 - cx;
  const fy = y1 - cy;
  const a = dx * dx + dy * dy;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - r * r;
  const disc = b * b - 4 * a * c;
  if (disc < 0 || a === 0) return [];
  const sq = Math.sqrt(disc);
  return [(-b - sq) / (2 * a), (-b + sq) / (2 * a)].sort((p, q) => p - q);
}

/** Where two infinite lines cross, or null if they're parallel. */
function lineLineHit(ax1: number, ay1: number, ax2: number, ay2: number, bx1: number, by1: number, bx2: number, by2: number) {
  const d1x = ax2 - ax1;
  const d1y = ay2 - ay1;
  const d2x = bx2 - bx1;
  const d2y = by2 - by1;
  const denom = d1x * d2y - d1y * d2x;
  if (Math.abs(denom) < 1e-9) return null;
  const t = ((bx1 - ax1) * d2y - (by1 - ay1) * d2x) / denom;
  return { x: ax1 + t * d1x, y: ay1 + t * d1y };
}

const at = (x1: number, y1: number, x2: number, y2: number, t: number) => ({ x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) });

/**
 * The largest intersection count is built, not asserted: a circle and two full
 * lines are laid down (`lineA`/`lineB` as raw endpoints, well outside the
 * circle so each is free to cross it), and the scene solves the actual
 * quadratic for where each line meets the circle and the actual linear system
 * for where the two lines meet each other — the 2 + 2 + 1 = 5 count falls out
 * of real coordinates rather than being stated. A beat is spent on the trap of
 * stopping at 4 (matching choice C) by treating the lines as if they'd never
 * cross. Data: { cx, cy, r, lineA: [x1,y1,x2,y2], lineB: [x1,y1,x2,y2] }.
 */
export function CircleLineMaxIntersectScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const cx = num(data.cx, 150);
  const cy = num(data.cy, 110);
  const r = num(data.r, 70);
  const lineA = (Array.isArray(data.lineA) ? data.lineA : [20, 150, 280, 60]).map((v) => num(v, 0));
  const lineB = (Array.isArray(data.lineB) ? data.lineB : [280, 170, 20, 50]).map((v) => num(v, 0));
  const [ax1, ay1, ax2, ay2] = lineA;
  const [bx1, by1, bx2, by2] = lineB;

  const hitsA = circleLineHits(ax1, ay1, ax2, ay2, cx, cy, r).map((t) => at(ax1, ay1, ax2, ay2, t));
  const hitsB = circleLineHits(bx1, by1, bx2, by2, cx, cy, r).map((t) => at(bx1, by1, bx2, by2, t));
  const crossing = lineLineHit(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2);

  const circleHits = hitsA.length + hitsB.length;
  const total = circleHits + (crossing ? 1 : 0);
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(circleHits));
  const ok = hitsA.length === 2 && hitsB.length === 2 && crossing != null;
  const failure = !ok ? `expected 2 circle hits per line and one crossing, got ${hitsA.length}+${hitsB.length} hits and crossing=${crossing ? "yes" : "no"}` : "";

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showCircleHits = step >= 1;
  const showTrap = step === 2 && !isFinal;
  const showCrossing = step >= 3 || isFinal;

  const W = 300;
  const H = 236;
  const Dot = ({ x, y, color, delay }: { x: number; y: number; color: string; delay: number }) => (
    <motion.circle
      cx={x}
      cy={y}
      r={6.5}
      fill={color}
      stroke="#fff"
      strokeWidth={1.6}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 15, delay }}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    />
  );

  const caption = isFinal
    ? `${circleHits} + 1 = ${total} — the largest possible is ${total}`
    : showCrossing
    ? `${circleHits} + 1 = ${total}: the lines cross once more`
    : showTrap
    ? trapChoice
      ? `stop here and you'd get ${circleHits} — choice ${trapChoice.label}, but the lines still cross each other`
      : `stop here and you'd get only ${circleHits}, missing the lines' own crossing`
    : showCircleHits
    ? `each line meets the circle twice: ${hitsA.length} + ${hitsB.length} = ${circleHits}`
    : "a circle and two distinct lines";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <motion.circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={INK}
          strokeWidth={2}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.line
          x1={ax1}
          y1={ay1}
          x2={ax2}
          y2={ay2}
          stroke={IND}
          strokeWidth={2}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
        <motion.line
          x1={bx1}
          y1={by1}
          x2={bx2}
          y2={by2}
          stroke="#0d9488"
          strokeWidth={2}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.85 }}
        />

        {showCircleHits &&
          [...hitsA, ...hitsB].map((p, i) => <Dot key={i} x={p.x} y={p.y} color={IND} delay={0.1 + i * 0.15} />)}

        {showTrap && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <rect x={W - 118} y={8} width={110} height={44} rx={8} fill="#fef3c7" stroke="#b45309" strokeWidth={1.2} />
            <text x={W - 63} y={26} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#b45309">
              if they never crossed
            </text>
            <text x={W - 63} y={42} textAnchor="middle" fontSize="12" fontWeight="800" fill="#b45309" fontFamily={numberFont}>
              only {circleHits} points
            </text>
          </motion.g>
        )}

        {showCrossing && crossing && <Dot x={crossing.x} y={crossing.y} color={WIN} delay={0.15} />}
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
