import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const HALF = "#ea580c";

type Pt = [number, number];

/** Shoelace area of a simple polygon given as [x,y] pairs. */
function polyArea(pts: Pt[]): number {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    s += x1 * y2 - x2 * y1;
  }
  return Math.abs(s) / 2;
}

/**
 * A twelve-sided pinwheel: a 3×3 core square with a triangular spike on each
 * side, read straight off the grid diagram. The core is counted as nine unit
 * squares appearing one by one; each spike is split at its base's midpoint
 * into two right triangles (half a unit square each), the same cut the
 * written solution uses to turn "8 triangles" into "4 more unit squares".
 * Both counts are derived from the real vertices via the shoelace formula and
 * cross-checked against the stored total.
 * Data: { points, core: [x0,y0,x1,y1], spikes: [apexX,apexY,b1x,b1y,b2x,b2y][] }.
 */
export function PinwheelGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const points = (Array.isArray(data.points) ? data.points : []) as unknown as Pt[];
  const [cx0, cy0, cx1, cy1] = (data.core as unknown as number[]) ?? [0, 0, 0, 0];
  const spikes = ((data.spikes as unknown as number[][]) ?? []).map(([ax, ay, b1x, b1y, b2x, b2y]) => ({
    apex: [ax, ay] as Pt,
    b1: [b1x, b1y] as Pt,
    b2: [b2x, b2y] as Pt,
    mid: [(b1x + b2x) / 2, (b1y + b2y) / 2] as Pt,
  }));

  const coreArea = Math.abs((cx1 - cx0) * (cy1 - cy0));
  const spikeArea = spikes.reduce((a, s) => a + polyArea([s.apex, s.b1, s.b2]), 0);
  const total = coreArea + spikeArea;
  const expected = Number(problem.shortAnswer ?? NaN);
  const mismatch = Number.isFinite(expected) && Math.abs(expected - total) > 1e-6;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showHalves = step >= 1;

  const unit = 38;
  const ox = 18;
  const oy = 14;
  const gridLines = 7;
  const W = ox * 2 + gridLines * unit;
  const gridBottomY = oy + gridLines * unit;
  const H = gridBottomY + 56;
  const px = (x: number) => ox + x * unit;
  const py = (y: number) => oy + y * unit;

  const coreCells: Pt[] = [];
  for (let i = cx0; i < cx1; i++) for (let j = cy0; j < cy1; j++) coreCells.push([i, j]);

  const caption = mismatch
    ? `check: shape area is ${total}, expected ${expected}`
    : isFinal
    ? `9 + 4 = ${total} square centimeters → choice ${problem.answer}`
    : showHalves
    ? "each spike splits at its base's midpoint into 2 right triangles: 8 × ½ = 4"
    : "the middle is a 3 × 3 block of unit squares: 3 × 3 = 9";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
        {Array.from({ length: gridLines + 1 }).map((_, i) => (
          <g key={`grid${i}`}>
            <line x1={px(i)} y1={py(0)} x2={px(i)} y2={py(gridLines)} stroke="#e2e8f0" strokeWidth={1} />
            <line x1={px(0)} y1={py(i)} x2={px(gridLines)} y2={py(i)} stroke="#e2e8f0" strokeWidth={1} />
          </g>
        ))}

        {/* the twelve-sided outline, drawn on */}
        <motion.polygon
          points={points.map(([x, y]) => `${px(x)},${py(y)}`).join(" ")}
          fill="none"
          stroke={INK}
          strokeWidth={2.4}
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* central 3x3 block, counted one unit square at a time */}
        {coreCells.map(([x, y], i) => (
          <motion.rect
            key={`core${x}-${y}`}
            x={px(x)}
            y={py(y)}
            width={unit}
            height={unit}
            fill={MARK}
            stroke="#ffffff"
            strokeWidth={1}
            initial={{ opacity: 0 }}
            animate={{ opacity: isFinal ? 0.4 : 0.55 }}
            transition={{ delay: 0.9 + i * 0.06, duration: 0.3 }}
          />
        ))}

        {/* each spike, split into its two half-unit triangles */}
        <AnimatePresence>
          {showHalves &&
            spikes.flatMap((s, si) => [
              { pts: [s.apex, s.b1, s.mid], key: `s${si}a` },
              { pts: [s.apex, s.mid, s.b2], key: `s${si}b` },
            ]).map((tri, i) => (
              <motion.polygon
                key={tri.key}
                points={tri.pts.map(([x, y]) => `${px(x)},${py(y)}`).join(" ")}
                fill={HALF}
                stroke="#ffffff"
                strokeWidth={1.2}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: isFinal ? 0.45 : 0.65, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: i * 0.1 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            ))}
        </AnimatePresence>

        <AnimatePresence>
          {!isFinal && (
            <motion.text
              key="label-core"
              x={px((cx0 + cx1) / 2)}
              y={py((cy0 + cy1) / 2) + 4}
              textAnchor="middle"
              fontSize="14"
              fontWeight="800"
              fill="#ffffff"
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              9
            </motion.text>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isFinal && (
            <motion.text
              key="total"
              x={px(gridLines / 2)}
              y={gridBottomY + 22}
              textAnchor="middle"
              fontSize="15"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.4 }}
            >
              9 + 4 = {total}
            </motion.text>
          )}
        </AnimatePresence>

        <SvgAnswerBadge show={isFinal} answer={problem.answer ?? null} cx={W / 2} y={gridBottomY + 30} width={92} />
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11.5,
          fontWeight: 800,
          color: mismatch ? "#991b1b" : isFinal ? "#166534" : "#4338ca",
          background: mismatch ? "#fee2e2" : isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${mismatch ? "#fecaca" : isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>
    </div>
  );
}
