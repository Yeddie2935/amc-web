import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const SMALL = "#f59e0b";
const LARGE = "#db2777";
const DIM = "#94a3b8";

type Point = { x: number; y: number };

/**
 * A triangle with its base split into two parts. Parallels through the split
 * point cut off 1/3- and 2/3-scale corner triangles. On the final beat the
 * entire triangle becomes a nine-tile triangular mosaic and the four tiles in
 * the middle quadrilateral are painted. Data: { baseParts: [1, 2] }.
 */
export function ParallelTriangleAreaScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const parts = (Array.isArray(data.baseParts) ? data.baseParts : [1, 2]).map((v) => Math.max(0, num(v, 0)));
  const left = parts[0] ?? 1;
  const right = parts[1] ?? 2;
  const total = left + right;
  const smallScale = left / total;
  const largeScale = right / total;
  const smallArea = smallScale * smallScale;
  const largeArea = largeScale * largeScale;
  const targetArea = 1 - smallArea - largeArea;
  const expected = `${Math.round(targetArea * 9)}/9`;
  const ok = Math.abs(targetArea - 4 / 9) < 1e-9 && (problem.shortAnswer == null || String(problem.shortAnswer).replace(/\s/g, "") === "4/9");
  const isFinal = step >= totalSteps - 1;

  const W = 460;
  const A: Point = { x: 42, y: 210 };
  const B: Point = { x: 418, y: 210 };
  const C: Point = { x: 92, y: 34 };
  const mix = (p: Point, q: Point, t: number): Point => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t });
  const E = mix(A, B, smallScale);
  const D = mix(A, C, smallScale);
  const F = { x: E.x + (C.x - A.x) * largeScale, y: E.y + (C.y - A.y) * largeScale };
  const xy = (x: number, y: number): Point => ({
    x: A.x + (B.x - A.x) * (x / 3) + (C.x - A.x) * (y / 3),
    y: A.y + (B.y - A.y) * (x / 3) + (C.y - A.y) * (y / 3),
  });

  type Tile = { points: Point[]; region: "small" | "large" | "target"; index: number };
  const tiles: Tile[] = [];
  let tileIndex = 0;
  for (let i = 0; i <= 2; i += 1) {
    for (let j = 0; j <= 2 - i; j += 1) {
      const upCoords = [[i, j], [i + 1, j], [i, j + 1]];
      const ucx = (3 * i + 1) / 3;
      const ucy = (3 * j + 1) / 3;
      const region = ucx + ucy < 1 ? "small" : ucx > 1 ? "large" : "target";
      tiles.push({ points: upCoords.map(([x, y]) => xy(x, y)), region, index: tileIndex++ });
      if (i + j <= 1) {
        const downCoords = [[i + 1, j], [i + 1, j + 1], [i, j + 1]];
        const dcx = (3 * i + 2) / 3;
        const dcy = (3 * j + 2) / 3;
        const downRegion = dcx + dcy < 1 ? "small" : dcx > 1 ? "large" : "target";
        tiles.push({ points: downCoords.map(([x, y]) => xy(x, y)), region: downRegion, index: tileIndex++ });
      }
    }
  }
  const regionCount = (region: Tile["region"]) => tiles.filter((t) => t.region === region).length;

  const polygon = (points: Point[]) => points.map((p) => `${p.x},${p.y}`).join(" ");
  const Label = ({ p, text, dx = 0, dy = 0 }: { p: Point; text: string; dx?: number; dy?: number }) => (
    <text x={p.x + dx} y={p.y + dy} textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{text}</text>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} 285`} width="100%" style={{ maxWidth: 470 }}>
        <text x={W / 2} y="18" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>
          {step === 0 ? "the two parallels create scaled copies of ABC" : isFinal ? "paint the four equal-area tiles left in CDEF" : "side scale squares to become area scale"}
        </text>

        {isFinal && tiles.map((tile) => {
          const fill = tile.region === "small" ? SMALL : tile.region === "large" ? LARGE : WIN;
          return (
            <motion.polygon
              key={tile.index}
              points={polygon(tile.points)}
              fill={fill}
              fillOpacity={tile.region === "target" ? 0.58 : 0.16}
              stroke="#fff"
              strokeWidth="2"
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 210, damping: 17, delay: tile.index * 0.07 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          );
        })}

        {!isFinal && (
          <>
            <motion.polygon points={polygon([A, D, E])} fill={step >= 1 ? SMALL : "#fff7ed"} fillOpacity={step >= 1 ? 0.3 : 0.12} initial={false} animate={{ opacity: 1 }} />
            <motion.polygon points={polygon([E, F, B])} fill={step >= 1 ? LARGE : "#fdf2f8"} fillOpacity={step >= 1 ? 0.24 : 0.1} initial={false} animate={{ opacity: 1 }} />
          </>
        )}

        <path d={`M ${A.x} ${A.y} L ${B.x} ${B.y} L ${C.x} ${C.y} Z`} fill="none" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <motion.line x1={D.x} y1={D.y} x2={E.x} y2={E.y} stroke={IND} strokeWidth="2.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />
        <motion.line x1={E.x} y1={E.y} x2={F.x} y2={F.y} stroke={IND} strokeWidth="2.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.25 }} />

        <Label p={A} text="A" dx={-10} dy={17} />
        <Label p={B} text="B" dx={10} dy={17} />
        <Label p={C} text="C" dy={-8} />
        <Label p={D} text="D" dx={-13} dy={3} />
        <Label p={E} text="E" dy={18} />
        <Label p={F} text="F" dx={14} dy={-2} />

        <text x={(A.x + E.x) / 2} y="230" textAnchor="middle" fontSize="11" fontWeight="900" fill={SMALL} fontFamily={FONT}>{left}</text>
        <text x={(E.x + B.x) / 2} y="230" textAnchor="middle" fontSize="11" fontWeight="900" fill={LARGE} fontFamily={FONT}>{right}</text>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.g key="parallel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.6 }}>
              <text x="275" y="77" fontSize="10" fontWeight="850" fill={IND}>DE ∥ BC</text>
              <text x="278" y="94" fontSize="10" fontWeight="850" fill={IND}>EF ∥ AC</text>
              <text x={W / 2} y="260" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>AE : AB = 1 : 3</text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g key="scale" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.text x="112" y="112" textAnchor="middle" fontSize="12" fontWeight="900" fill={SMALL} fontFamily={FONT} initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>ADE: (1/3)² = 1/9</motion.text>
              <motion.text x="327" y="170" textAnchor="middle" fontSize="12" fontWeight="900" fill={LARGE} fontFamily={FONT} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ delay: 0.25 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>EFB: (2/3)² = 4/9</motion.text>
              <text x={W / 2} y="263" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>parallel sides preserve the shape</text>
            </motion.g>
          )}
          {isFinal && (
            <motion.g key="paint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.text x="160" y="124" fontSize="24" initial={{ x: -42, y: 35, rotate: -20 }} animate={{ x: 0, y: 0, rotate: 8 }} transition={{ type: "spring", stiffness: 110, damping: 14, delay: 0.7 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>🖌️</motion.text>
              <rect x="104" y="238" width="252" height="26" rx="8" fill="#fff" fillOpacity="0.92" stroke="#bbf7d0" />
              <text x={W / 2} y="256" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>
                9 − {regionCount("small")} − {regionCount("large")} = {regionCount("target")} tiles = {expected}
              </text>
              <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <rect x="181" y="266" width="98" height="19" rx="9.5" fill={ok ? WIN : "#dc2626"} />
                <text x={W / 2} y="280" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">Answer {ok ? problem.answer : "check data"}</text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
