import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
type Pt = { x: number; y: number };

const radical = (n: number) => {
  for (let k = Math.floor(Math.sqrt(n)); k >= 2; k--) {
    if (n % (k * k) === 0) {
      const inside = n / (k * k);
      return inside === 1 ? `${k}` : `${k}√${inside}`;
    }
  }
  return `√${n}`;
};

const pointOn = (center: Pt, radius: number, degrees: number): Pt => {
  const angle = (degrees * Math.PI) / 180;
  return { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) };
};

const sector = (center: Pt, radius: number, start: number, end: number) => {
  const a = pointOn(center, radius, start);
  const b = pointOn(center, radius, end);
  return `M ${center.x} ${center.y} L ${a.x} ${a.y} A ${radius} ${radius} 0 ${end - start > 180 ? 1 : 0} 1 ${b.x} ${b.y} Z`;
};

const Line = ({ a, b, color = "#334155", width = 3, dashed = false }: { a: Pt; b: Pt; color?: string; width?: number; dashed?: boolean }) => (
  <motion.line
    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
    stroke={color} strokeWidth={width} strokeLinecap="round"
    strokeDasharray={dashed ? "7 6" : undefined}
    initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
    transition={{ duration: 0.55 }}
  />
);

export function ConstructedRightTriangleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const areas = (data.squareAreas as unknown[]).map((v) => num(v));
  const [smallArea, largeArea] = areas;
  const smallSide = radical(smallArea);
  const largeSide = radical(largeArea);
  const last = totalSteps - 1;
  const phase = Math.min(step, last);

  const B = { x: 218, y: 132 };
  const J = { x: 218, y: 42 };
  const A = { x: 128, y: 132 };
  const I = { x: 128, y: 42 };
  const K = pointOn(B, 90, -30);
  const C = pointOn(B, 120, 60);
  const label = (p: Pt, value: string, dx = 0, dy = 0, color = "#334155") => (
    <text x={p.x + dx} y={p.y + dy} textAnchor="middle" fontSize="13" fontWeight="850" fill={color} fontFamily={mono}>{value}</text>
  );

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 9, padding: "4px 2px" }}>
      <svg viewBox="0 0 470 292" width="100%" style={{ maxWidth: 500, overflow: "visible" }} aria-label="Square and equilateral-triangle construction proving triangle KBC is right">
        <defs>
          <marker id="transfer-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#7c3aed" /></marker>
        </defs>

        {/* The area-18 square is kept in its exact place in the construction. */}
        <motion.polygon points={`${I.x},${I.y} ${J.x},${J.y} ${B.x},${B.y} ${A.x},${A.y}`} fill="#dbeafe" stroke="#2563eb" strokeWidth="2.5" initial={{ opacity: 0 }} animate={{ opacity: phase === last ? 0.22 : 0.85 }} />
        {phase < 2 && label({ x: 173, y: 88 }, `area ${smallArea}`, 0, 0, "#1d4ed8")}
        {label(I, "I", -9, -6)}{label(J, "J", 9, -6)}{label(A, "A", -10, 17)}

        {/* Only the relevant sides of the equiangular hexagon are needed locally. */}
        <Line a={A} b={B} />
        {phase >= 1 && <>
          <Line a={B} b={C} color={phase === last ? "#16a34a" : "#334155"} width={phase === last ? 5 : 3} />
          <Line a={J} b={K} color="#f59e0b" />
          <Line a={K} b={B} color="#7c3aed" width={phase === last ? 5 : 3} />
          <Line a={K} b={C} color={phase === last ? "#16a34a" : "#94a3b8"} dashed={phase < last} />
          {label(K, "K", 12, -5)}{label(C, "C", 10, 15)}
        </>}
        {label(B, "B", -9, 18)}

        {/* A faithful miniature of the second source square supplies FE. */}
        <g transform="translate(32 185) rotate(-22 39 39)">
          <motion.rect width="78" height="78" rx="2" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.5" initial={{ opacity: 0 }} animate={{ opacity: phase === last ? 0.22 : 0.9 }} />
          <text x="39" y="43" textAnchor="middle" fontSize="13" fontWeight="850" fill="#15803d" fontFamily={mono}>area {largeArea}</text>
          <text x="-8" y="5" fontSize="12" fontWeight="800" fill="#334155">F</text>
          <text x="82" y="5" fontSize="12" fontWeight="800" fill="#334155">E</text>
          <motion.line x1="0" y1="0" x2="78" y2="0" stroke="#16a34a" strokeWidth="5" animate={{ opacity: phase >= 1 ? 1 : 0.35 }} />
        </g>

        {phase === 0 && (
          <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <rect x="274" y="178" width="170" height="76" rx="12" fill="#fff" stroke="#cbd5e1" />
            <text x="359" y="205" textAnchor="middle" fontSize="14" fontWeight="850" fill="#1d4ed8" fontFamily={mono}>JB = √{smallArea} = {smallSide}</text>
            <text x="359" y="233" textAnchor="middle" fontSize="14" fontWeight="850" fill="#15803d" fontFamily={mono}>FE = √{largeArea} = {largeSide}</text>
          </motion.g>
        )}

        {phase === 1 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <path d="M 212 78 C 175 60, 178 28, 225 27" fill="none" stroke="#7c3aed" strokeWidth="2" markerEnd="url(#transfer-arrow)" />
            <text x="155" y="55" fontSize="12" fontWeight="850" fill="#7c3aed" fontFamily={mono}>JB = BK</text>
            <path d="M 112 217 C 180 260, 246 250, 260 209" fill="none" stroke="#7c3aed" strokeWidth="2" markerEnd="url(#transfer-arrow)" />
            <text x="181" y="270" textAnchor="middle" fontSize="12" fontWeight="850" fill="#7c3aed" fontFamily={mono}>FE = BC</text>
            {label({ x: 255, y: 96 }, smallSide, 0, 0, "#7c3aed")}
            {label({ x: 257, y: 188 }, largeSide, 0, 0, "#15803d")}
          </motion.g>
        )}

        {phase === 2 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <path d={sector(B, 31, -180, -90)} fill="#93c5fd" fillOpacity=".72" />
            <path d={sector(B, 39, -90, -30)} fill="#fde68a" fillOpacity=".86" />
            <path d={sector(B, 35, -30, 60)} fill="#ddd6fe" fillOpacity=".86" />
            <path d={sector(B, 28, 60, 180)} fill="#bbf7d0" fillOpacity=".82" />
            {label(pointOn(B, 51, -135), "90°", 0, 4, "#1d4ed8")}
            {label(pointOn(B, 58, -60), "60°", 0, 3, "#b45309")}
            {label(pointOn(B, 57, 15), "?", 0, 4, "#6d28d9")}
            {label(pointOn(B, 51, 120), "120°", 0, 4, "#15803d")}
          </motion.g>
        )}

        {phase === last && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.polygon points={`${K.x},${K.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="#dcfce7" fillOpacity=".52" stroke="none" initial={{ scale: .9, transformOrigin: `${B.x}px ${B.y}px` }} animate={{ scale: 1 }} />
            <polyline points="235,122 245,139 228,149" fill="none" stroke="#16a34a" strokeWidth="2.5" />
            {label({ x: 255, y: 96 }, smallSide, 0, 0, "#7c3aed")}
            {label({ x: 257, y: 188 }, largeSide, 0, 0, "#15803d")}
            <text x="280" y="131" fontSize="12" fontWeight="850" fill="#15803d" fontFamily={mono}>90°</text>
          </motion.g>
        )}
      </svg>

      <AnimatePresence mode="wait">
        {phase === 2 && (
          <motion.div key="angle" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ fontFamily: mono, fontSize: "clamp(11px, 3.2vw, 14px)", fontWeight: 850, color: "#6d28d9", textAlign: "center", lineHeight: 1.55 }}>
            <div>60° + 90° + 120° = 270°</div>
            <div>∠KBC = 360° − 270° = 90°</div>
          </motion.div>
        )}
        {phase === last && (
          <motion.div key="area" initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontFamily: mono, fontSize: "clamp(11px, 3.4vw, 15px)", fontWeight: 900, color: "#166534", textAlign: "center", lineHeight: 1.45 }}>
              <div>½({smallSide})({largeSide})</div>
              <div>= ½ · 12 · 2 = 12</div>
            </div>
            <div style={{ padding: "5px 15px", borderRadius: 999, background: "#16a34a", color: "white", fontWeight: 850, fontSize: 14 }}>Area 12 → Answer {problem.answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
