import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

type P3 = [number, number, number];
type P2 = [number, number];

const parsePos = (raw: unknown): P3 => {
  const [x, y, z] = String(raw).split(",").map(Number);
  return [x, y, z];
};
const adjacent = (a: P3, b: P3) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) === 1;
const project = ([x, y, z]: P3, ox = 184, oy = 232): P2 => [ox + (x - y) * 40, oy + (x + y) * 22 - z * 50];

function IsoCube({ p, size = 40, muted = false }: { p: P3; size?: number; muted?: boolean }) {
  const [x, y] = project(p);
  const h = size;
  const dx = size;
  const dy = size * 0.55;
  const opacity = muted ? 0.4 : 1;
  return (
    <g opacity={opacity}>
      <polygon points={`${x},${y - h} ${x + dx},${y - h - dy} ${x},${y - h - 2 * dy} ${x - dx},${y - h - dy}`} fill="#eef2ff" stroke={INK} strokeWidth="1.7" />
      <polygon points={`${x},${y - h} ${x + dx},${y - h - dy} ${x + dx},${y - dy} ${x},${y}`} fill="#c7d2fe" stroke={INK} strokeWidth="1.7" />
      <polygon points={`${x},${y - h} ${x - dx},${y - h - dy} ${x - dx},${y - dy} ${x},${y}`} fill="#ddd6fe" stroke={INK} strokeWidth="1.7" />
    </g>
  );
}

function SmallCube({ x, y, index }: { x: number; y: number; index: number }) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.09, type: "spring", stiffness: 230, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      <rect x={x} y={y} width="48" height="48" rx="7" fill="#eef2ff" stroke={IND} strokeWidth="1.6" />
      <path d={`M ${x + 8} ${y + 16} l 16 -9 16 9 -16 9 Z M ${x + 8} ${y + 16} v 18 l 16 9 16 -9 V ${y + 16} M ${x + 24} ${y + 25} v 18`} fill="none" stroke={IND} strokeWidth="1.3" />
      <text x={x + 24} y={y + 62} textAnchor="middle" fontSize="10.5" fontWeight="900" fill={INK} fontFamily={FONT}>6 faces</text>
    </motion.g>
  );
}

/** Six unit cubes assemble along five joins; every join cancels a pair of faces. */
export function CubeJoinCancellationScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const cubeCount = Math.round(num(data.cubeCount, 6));
  const positions = (Array.isArray(data.positions) ? data.positions : []).map(parsePos);
  const joins: [number, number][] = [];
  positions.forEach((a, i) => positions.slice(i + 1).forEach((b, offset) => { if (adjacent(a, b)) joins.push([i, i + offset + 1]); }));
  const allFaces = cubeCount * 6;
  const hiddenFaces = joins.length * 2;
  const exposed = allFaces - hiddenFaces;
  const choice = (problem.choices ?? []).find((c) => Number(c.text) === exposed)?.label;
  const valid = String(exposed) === problem.shortAnswer && choice === problem.answer && positions.length === cubeCount;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const ordered = positions.map((p, i) => ({ p, i })).sort((a, b) => (b.p[0] + b.p[1] + b.p[2]) - (a.p[0] + a.p[1] + a.p[2]));

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "5px 3px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 470 315" width="100%" style={{ maxWidth: 500, minWidth: 0, display: "block" }} aria-label="Six cubes assemble with five joins, canceling ten hidden faces from thirty-six">
        <text x="235" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "six separate unit cubes: count every face first" : phase === 1 ? "snap the cubes together and mark every shared face" : "remove both hidden faces at each join"}
        </text>

        {phase === 0 && (
          <>
            {Array.from({ length: cubeCount }, (_, i) => <SmallCube key={i} x={64 + (i % 3) * 132} y={48 + Math.floor(i / 3) * 94} index={i} />)}
            <motion.text x="235" y="268" textAnchor="middle" fontSize="20" fontWeight="950" fill={IND} fontFamily={FONT} initial={{ opacity: 0, scale: 0.65 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.65, type: "spring" }}>{cubeCount} × 6 = {allFaces} faces</motion.text>
          </>
        )}

        {phase >= 1 && (
          <>
            <g transform={final ? "translate(-37 10) scale(.78)" : "translate(30 6) scale(.92)"}>
              {ordered.map(({ p, i }, order) => {
                const sepX = 42 + (i % 3) * 92;
                const sepY = 65 + Math.floor(i / 3) * 82;
                const [px, py] = project(p);
                return (
                  <motion.g key={i} initial={{ x: sepX - px, y: sepY - py, opacity: 0.35 }} animate={{ x: 0, y: 0, opacity: 1 }} transition={{ delay: order * 0.12, type: "spring", stiffness: 150, damping: 18 }}>
                    <IsoCube p={p} />
                  </motion.g>
                );
              })}
              {!final && joins.map(([a, b], i) => {
                const pa = project(positions[a]);
                const pb = project(positions[b]);
                const x = (pa[0] + pb[0]) / 2;
                const y = (pa[1] + pb[1]) / 2 - 32;
                return (
                  <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.75 + i * 0.12, type: "spring" }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <circle cx={x} cy={y} r="12" fill="#fee2e2" stroke={RED} strokeWidth="2" />
                    <text x={x} y={y + 4} textAnchor="middle" fontSize="9" fontWeight="950" fill={RED} fontFamily={FONT}>−2</text>
                  </motion.g>
                );
              })}
            </g>
            {!final && <text x="390" y="255" textAnchor="middle" fontSize="13" fontWeight="900" fill={RED} fontFamily={FONT}>{joins.length} joins × 2</text>}
          </>
        )}

        {final && (
          <g transform="translate(250 46)">
            <text x="91" y="0" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>FACE LEDGER</text>
            {Array.from({ length: allFaces }, (_, i) => {
              const removed = i >= exposed;
              const col = i % 6;
              const row = Math.floor(i / 6);
              const x = col * 30;
              const y = 14 + row * 30;
              return (
                <motion.g key={i} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: removed ? 0.55 : 1, scale: 1 }} transition={{ delay: i * 0.025 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <rect x={x} y={y} width="23" height="23" rx="4" fill={removed ? "#fee2e2" : "#dcfce7"} stroke={removed ? RED : GREEN} />
                  {removed && <path d={`M ${x + 4} ${y + 4} l 15 15 M ${x + 19} ${y + 4} l -15 15`} stroke={RED} strokeWidth="1.8" />}
                </motion.g>
              );
            })}
            <text x="91" y="200" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={RED} fontFamily={FONT}>{hiddenFaces} hidden</text>
          </g>
        )}

        {final && (
          <>
            <text x="235" y="270" textAnchor="middle" fontSize="19" fontWeight="950" fill={valid ? GREEN : RED} fontFamily={FONT}>{allFaces} − {joins.length} × 2 = {exposed} in²</text>
            <text x="205" y="289" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={valid ? GREEN : RED} fontFamily={FONT}>{valid ? "six cubes, five joins, and choice verified" : `check failed: computed ${exposed}, stored ${problem.shortAnswer}`}</text>
            <SvgAnswerBadge show={valid} answer={problem.answer} cx={420} y={278} width={72} />
          </>
        )}
      </svg>
    </div>
  );
}
