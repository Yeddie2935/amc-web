import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const GOLD = "#d97706";
const WIN = "#16a34a";
const DIM = "#cbd5e1";

type Pt = [number, number];

function vertexList(value: unknown): Pt[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => (Array.isArray(v) ? [Number(v[0]), Number(v[1])] : null))
    .filter((v): v is Pt => v != null && Number.isFinite(v[0]) && Number.isFinite(v[1]));
}

function onSegment(p: Pt, a: Pt, b: Pt): boolean {
  const cross = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
  if (cross !== 0) return false;
  return p[0] >= Math.min(a[0], b[0]) && p[0] <= Math.max(a[0], b[0]) && p[1] >= Math.min(a[1], b[1]) && p[1] <= Math.max(a[1], b[1]);
}

function isBoundary(p: Pt, verts: Pt[]): boolean {
  for (let i = 0; i < verts.length; i++) {
    if (onSegment(p, verts[i], verts[(i + 1) % verts.length])) return true;
  }
  return false;
}

function isInside(p: Pt, verts: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = verts.length - 1; i < verts.length; j = i++) {
    const [xi, yi] = verts[i];
    const [xj, yj] = verts[j];
    const intersect = yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function shoelaceArea(verts: Pt[]): number {
  let sum = 0;
  for (let i = 0; i < verts.length; i++) {
    const [x1, y1] = verts[i];
    const [x2, y2] = verts[(i + 1) % verts.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

/**
 * A lattice polygon's area from Pick's Theorem: interior points plus half
 * the boundary points, minus one. The scene classifies every dot on the
 * geoboard by ray-casting and colinearity, rather than trusting a count —
 * so the interior/boundary tallies are counted off the real polygon. Five
 * beats: (0) the polygon on the board; (1) the formula; (2) the boundary
 * dots found; (3) the interior dots found; (4) the area computed and
 * cross-checked against the shoelace formula. Data: { vertices: [x,y][], gridSize }.
 */
export function PickTheoremGeoboardScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const verts = vertexList(data.vertices);
  const gridSize = Math.round(num(data.gridSize, 10));
  if (verts.length < 3 || gridSize < 2) return null;

  const gridPts: Pt[] = [];
  for (let gy = 0; gy <= gridSize; gy++) for (let gx = 0; gx <= gridSize; gx++) gridPts.push([gx, gy]);

  const boundaryPts = gridPts.filter((p) => isBoundary(p, verts));
  const interiorPts = gridPts.filter((p) => !isBoundary(p, verts) && isInside(p, verts));
  const I = interiorPts.length;
  const B = boundaryPts.length;
  const pickArea = I + B / 2 - 1;
  const shoelace = shoelaceArea(verts);
  const matches = Math.abs(pickArea - shoelace) < 1e-9;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showFormula = step >= 1;
  const showBoundary = step >= 2;
  const showInterior = step >= 3 || isFinal;

  const pitch = 20;
  const x0 = 24;
  const y0 = 20;
  const W = x0 * 2 + gridSize * pitch;
  const H = y0 * 2 + gridSize * pitch;
  const px = (v: number) => x0 + v * pitch;
  const py = (v: number) => y0 + (gridSize - v) * pitch;

  const polyPoints = verts.map(([x, y]) => `${px(x)},${py(y)}`).join(" ");

  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toString().includes(".5") ? `${Math.floor(n)} 1/2` : n.toFixed(1));

  const caption = isFinal
    ? `${I} + ${B}/2 − 1 = ${fmt(pickArea)}`
    : step === 0
    ? "the quadrilateral, drawn on the geoboard"
    : showInterior
    ? `${I} interior dots found`
    : showBoundary
    ? `${B} boundary dots found`
    : "Area = I + B/2 − 1";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 300 }}>
        {gridPts.map(([gx, gy], i) => (
          <circle key={i} cx={px(gx)} cy={py(gy)} r={1.6} fill={DIM} />
        ))}

        <motion.polygon
          points={polyPoints}
          fill={`${MARK}10`}
          stroke={MARK}
          strokeWidth={1.8}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        <AnimatePresence>
          {showBoundary &&
            boundaryPts.map(([gx, gy], i) => (
              <motion.circle
                key={`b${i}`}
                cx={px(gx)}
                cy={py(gy)}
                r={3.4}
                fill={GOLD}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.08 }}
              />
            ))}
        </AnimatePresence>

        <AnimatePresence>
          {showInterior &&
            interiorPts.map(([gx, gy], i) => (
              <motion.circle
                key={`i${i}`}
                cx={px(gx)}
                cy={py(gy)}
                r={2.6}
                fill={WIN}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.035 }}
              />
            ))}
        </AnimatePresence>
      </svg>

      <AnimatePresence>
        {showFormula && !showBoundary && (
          <motion.div key="formula" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 800, color: MARK }}>
            Area = I + B/2 − 1
          </motion.div>
        )}
      </AnimatePresence>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : INK,
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      {isFinal && !matches && (
        <span style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 700, color: "#dc2626" }}>
          check failed: Pick's gives {fmt(pickArea)}, shoelace gives {fmt(shoelace)}
        </span>
      )}

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
