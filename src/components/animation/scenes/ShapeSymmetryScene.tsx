import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

type Kind = "triangle" | "rhombus" | "rectangle" | "trapezoid" | "square";

/** Each shape's own vertices and its true symmetry-axis angles (degrees), centered at 0,0. */
const SHAPES: Record<Kind, { poly: [number, number][]; axesDeg: number[]; trapAxisDeg?: number[] }> = {
  triangle: {
    poly: [
      [0, -50],
      [43.3, 25],
      [-43.3, 25],
    ],
    axesDeg: [-90, 30, 150],
  },
  rhombus: {
    poly: [
      [0, -46],
      [34, 0],
      [0, 46],
      [-34, 0],
    ],
    axesDeg: [0, 90],
  },
  rectangle: {
    poly: [
      [-50, -32],
      [50, -32],
      [50, 32],
      [-50, 32],
    ],
    axesDeg: [0, 90],
    // the real diagonal corner-to-corner, (atan(32/50)) — looks like it should be a mirror, but is not
    trapAxisDeg: [(Math.atan2(32, 50) * 180) / Math.PI],
  },
  trapezoid: {
    poly: [
      [-24, -30],
      [24, -30],
      [42, 30],
      [-42, 30],
    ],
    axesDeg: [90],
  },
  square: {
    poly: [
      [-40, -40],
      [40, -40],
      [40, 40],
      [-40, 40],
    ],
    axesDeg: [0, 90, 45, 135],
  },
};

const NAMES: Record<Kind, string> = {
  triangle: "equilateral triangle",
  rhombus: "non-square rhombus",
  rectangle: "non-square rectangle",
  trapezoid: "isosceles trapezoid",
  square: "square",
};
const ORDER: Kind[] = ["triangle", "rhombus", "rectangle", "trapezoid", "square"];

function axisLine(cx: number, cy: number, deg: number, len: number) {
  const rad = (deg * Math.PI) / 180;
  const dx = Math.cos(rad) * len;
  const dy = Math.sin(rad) * len;
  return { x1: cx - dx, y1: cy - dy, x2: cx + dx, y2: cy + dy };
}

/**
 * Five named shapes, each tested for how many lines fold it onto itself. The
 * real trap sits inside the rectangle: a square's diagonals are mirror
 * lines, so it's tempting to assume a plain rectangle's are too — the scene
 * draws that diagonal, then visibly fails it (the two halves don't match)
 * before settling on the rectangle's real two axes. Every shape gets its own
 * beat with its true axis count, and the closing beat lines up all five so
 * the square's 4 is seen beating every other total, not just stated.
 *
 * data: { counts: [3,2,2,1,4] } — one count per shape in ORDER, used only to
 * self-check against the hardcoded geometry above.
 */
export function ShapeSymmetryScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const counts = (Array.isArray(data.counts) ? data.counts : [3, 2, 2, 1, 4]).map((v) => Math.round(Number(v)));

  const trueCounts = ORDER.map((k) => SHAPES[k].axesDeg.length);
  const ok = trueCounts.every((c, i) => c === counts[i]);
  const maxCount = Math.max(...trueCounts);
  const winnerIdx = trueCounts.indexOf(maxCount);
  const answerMatches = NAMES[ORDER[winnerIdx]] === (problem.shortAnswer ?? "").trim();

  // ---- beats: 0..4 one shape each (rectangle at index 2 includes the trap), 5 the comparison ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 5));
  const isFinal = step >= last;
  const shapeBeat = beat < 5 ? beat : -1;
  const kind = shapeBeat >= 0 ? ORDER[shapeBeat] : null;

  const W = 340;
  const H = 260;
  const cx = W / 2;
  const cy = 110;

  const caption =
    kind === "rectangle"
      ? `only ${SHAPES.rectangle.axesDeg.length} lines fold it onto itself — not the diagonal`
      : kind
      ? `${NAMES[kind]}: ${SHAPES[kind].axesDeg.length} line${SHAPES[kind].axesDeg.length === 1 ? "" : "s"} of symmetry`
      : `the square wins with ${maxCount} lines of symmetry`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {kind && (
          <g>
            <text x={cx} y={20} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>
              {NAMES[kind]}
            </text>
            <polygon
              points={SHAPES[kind].poly.map(([x, y]) => `${cx + x},${cy + y}`).join(" ")}
              fill={IND}
              fillOpacity={0.12}
              stroke={IND}
              strokeWidth={2}
            />
            {/* the trap: the rectangle's diagonal, drawn then flagged as not a mirror */}
            {kind === "rectangle" &&
              SHAPES.rectangle.trapAxisDeg!.map((deg, i) => {
                const l = axisLine(cx, cy, deg, 60);
                return (
                  <motion.g key={`trap${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <motion.line
                      x1={l.x1}
                      y1={l.y1}
                      x2={l.x2}
                      y2={l.y2}
                      stroke={BAD}
                      strokeWidth={2}
                      strokeDasharray="4 3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <motion.text x={cx + 30} y={cy - 40} fontSize="14" fontWeight="800" fill={BAD} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 15, delay: 1.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                      ✗
                    </motion.text>
                  </motion.g>
                );
              })}
            {SHAPES[kind].axesDeg.map((deg, i) => {
              const l = axisLine(cx, cy, deg, 60);
              return (
                <motion.line
                  key={deg}
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke={WIN}
                  strokeWidth={2.2}
                  strokeDasharray="3 3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: (kind === "rectangle" ? 1.6 : 0.4) + i * 0.35 }}
                />
              );
            })}
            <motion.text
              x={cx}
              y={H - 20}
              textAnchor="middle"
              fontSize="16"
              fontWeight="800"
              fill={WIN}
              fontFamily={FONT}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 15, delay: (kind === "rectangle" ? 1.6 : 0.4) + SHAPES[kind].axesDeg.length * 0.35 + 0.2 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {SHAPES[kind].axesDeg.length} line{SHAPES[kind].axesDeg.length === 1 ? "" : "s"}
            </motion.text>
          </g>
        )}

        {/* the final comparison, all five shapes side by side */}
        {beat === 5 && (
          <g>
            <text x={cx} y={16} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>
              lines of symmetry, compared
            </text>
            {ORDER.map((k, i) => {
              const bx = 30 + i * 62;
              const by = 60;
              const scale = 0.45;
              const isWinner = i === winnerIdx;
              return (
                <motion.g key={k} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: i * 0.18 }}>
                  <polygon
                    points={SHAPES[k].poly.map(([x, y]) => `${bx + x * scale},${by + y * scale}`).join(" ")}
                    fill={isWinner ? WIN : DIM}
                    fillOpacity={isWinner ? 0.25 : 0.15}
                    stroke={isWinner ? WIN : DIM}
                    strokeWidth={isWinner ? 2 : 1.4}
                  />
                  <rect x={bx - 16} y={by + 40} width={32} height={20} rx={6} fill={isWinner ? "#dcfce7" : "#f1f5f9"} stroke={isWinner ? WIN : DIM} strokeWidth={1.2} />
                  <text x={bx} y={by + 54} textAnchor="middle" fontSize="11" fontWeight="800" fill={isWinner ? WIN : DIM} fontFamily={FONT}>
                    {trueCounts[i]}
                  </text>
                </motion.g>
              );
            })}
            <motion.text x={cx} y={155} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={WIN} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              square: {maxCount} — the most of the five
            </motion.text>
          </g>
        )}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : kind === "rectangle" ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : kind === "rectangle" ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : kind === "rectangle" ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {kind === "rectangle" && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 260 }}>
            folding along the diagonal, the two halves don't line up
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !(ok && answerMatches) && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {!ok ? `check failed: data counts ${counts.join(",")} don't match geometry ${trueCounts.join(",")}` : `check failed: winner "${NAMES[ORDER[winnerIdx]]}" doesn't match stored answer "${problem.shortAnswer}"`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
