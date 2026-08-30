import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const BLACK = "#334155";
const DIM = "#94a3b8";

const FACE_POSITIONS: Array<[number, number]> = [
  [88, 19], [18, 89], [88, 89], [158, 89], [228, 89], [88, 159],
];

/** Unfold the cube into six 3×3 faces, mark the four black corner squares on
 * every face, and count the remaining exposed white unit squares. */
export function CubeCornerSurfaceFractionScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const edge = Math.round(num(data.edgeLength, 0));
  const faces = Math.round(num(data.faceCount, 0));
  const corners = Math.round(num(data.cornerCubes, 0));
  const exposed = Math.round(num(data.exposedFacesPerCorner, 0));
  const total = faces * edge * edge;
  const black = corners * exposed;
  const white = total - black;
  const divisor = gcd(white, total);
  const fraction = `${white / divisor}/${total / divisor}`;
  const choice = problem.choices?.find((item) => item.text === fraction)?.label;
  const valid = total === 54 && black === 24 && fraction === problem.shortAnswer && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const cell = 21;

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 7, padding: "5px 2px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 390 255" width="100%" style={{ maxWidth: 470, display: "block" }} aria-label="Six three by three cube faces with black corner squares and white surface squares">
        <text x="195" y="14" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>
          {phase === 0 ? "unfold all 6 outside faces" : phase === 1 ? "each black corner cube exposes 3 faces" : "count the white surface"}
        </text>

        {FACE_POSITIONS.map(([fx, fy], faceIndex) => (
          <motion.g
            key={faceIndex}
            initial={{ opacity: 0, scale: 0.65 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: faceIndex * 0.07, type: "spring", stiffness: 190, damping: 17 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            {Array.from({ length: edge * edge }, (_, index) => {
              const col = index % edge;
              const row = Math.floor(index / edge);
              const corner = (col === 0 || col === edge - 1) && (row === 0 || row === edge - 1);
              const blackSquare = phase >= 1 && corner;
              return (
                <motion.rect
                  key={index}
                  x={fx + col * cell}
                  y={fy + row * cell}
                  width={cell}
                  height={cell}
                  fill={blackSquare ? BLACK : phase === 2 ? "#dcfce7" : "#f8fafc"}
                  stroke={phase === 2 && !blackSquare ? GREEN : INDIGO}
                  strokeWidth="1.35"
                  animate={blackSquare ? { scale: [0.6, 1] } : { scale: 1 }}
                  transition={{ delay: faceIndex * 0.04 + index * 0.015, type: "spring" }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              );
            })}
          </motion.g>
        ))}

        <g transform="translate(308 36)">
          <rect width="72" height="155" rx="12" fill={phase === 2 ? "#f0fdf4" : "#eef2ff"} stroke={phase === 2 ? "#86efac" : "#c7d2fe"} />
          <text x="36" y="24" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={INK}>SURFACE</text>
          <text x="36" y="49" textAnchor="middle" fontSize="16" fontWeight="900" fill={INDIGO} fontFamily={FONT}>{faces}×{edge}×{edge}</text>
          <text x="36" y="70" textAnchor="middle" fontSize="18" fontWeight="900" fill={INDIGO} fontFamily={FONT}>= {total}</text>
          {phase >= 1 && <>
            <line x1="13" y1="82" x2="59" y2="82" stroke={DIM} />
            <text x="36" y="101" textAnchor="middle" fontSize="9" fontWeight="850" fill={BLACK}>BLACK</text>
            <text x="36" y="122" textAnchor="middle" fontSize="15" fontWeight="900" fill={BLACK} fontFamily={FONT}>{corners}×{exposed}={black}</text>
          </>}
          {phase === 2 && <text x="36" y="146" textAnchor="middle" fontSize="14" fontWeight="900" fill={GREEN} fontFamily={FONT}>{total}−{black}={white}</text>}
        </g>

        {phase === 1 && <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <path d="M28 221h44v20H28z" fill={BLACK} rx="4" />
          <text x="80" y="235" fontSize="10.5" fontWeight="800" fill={INK}>4 black corners on each face</text>
        </motion.g>}

        {phase === 2 && <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, type: "spring" }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <text x="195" y="226" textAnchor="middle" fontSize="19" fontWeight="900" fill={GREEN} fontFamily={FONT}>{white}/{total} = {fraction}</text>
          <rect x="151" y="232" width="88" height="22" rx="11" fill={valid ? GREEN : "#dc2626"} />
          <text x="195" y="247" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff">Answer {valid ? problem.answer : "failed"}</text>
        </motion.g>}
      </svg>

      <motion.span key={phase} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: FONT, fontSize: 12, fontWeight: 850, color: final ? "#166534" : INDIGO, background: final ? "#dcfce7" : "#eef2ff", borderRadius: 999, padding: "4px 12px", textAlign: "center", maxWidth: "calc(100% - 16px)" }}>
        {phase === 0 ? `${faces} faces × ${edge * edge} squares = ${total} exposed squares` : phase === 1 ? `${corners} corner cubes × ${exposed} exposed faces = ${black} black squares` : valid ? `${white} of ${total} surface squares are white: ${fraction}` : "surface-count or stored-answer check failed"}
      </motion.span>
    </div>
  );
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a), y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
}
