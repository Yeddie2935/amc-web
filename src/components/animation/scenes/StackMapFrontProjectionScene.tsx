import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const BACK = "#cbd5e1";
const FRONT = "#c7d2fe";

function Tower({ x, baseY, height, fill, delay = 0, dim = false, size = 28 }: { x: number; baseY: number; height: number; fill: string; delay?: number; dim?: boolean; size?: number }) {
  return (
    <g opacity={dim ? 0.3 : 1}>
      {Array.from({ length: height }, (_, i) => {
        const y = baseY - (i + 1) * size;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 180, damping: 18, delay: delay + i * 0.07 }}>
            <rect x={x} y={y} width={size} height={size} rx="2" fill={fill} stroke={INK} strokeWidth="1.4" />
            <path d={`M${x + 5} ${y + 7}h18`} stroke="#fff" strokeOpacity=".55" strokeWidth="2" />
          </motion.g>
        );
      })}
      <text x={x + size / 2} y={baseY + 16} textAnchor="middle" fontFamily={FONT} fontSize="14" fontWeight="800" fill={INK}>{height}</text>
    </g>
  );
}

/** Project a 2-by-n stack map to its front view by taking each sightline's maximum. */
export function StackMapFrontProjectionScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const back = (Array.isArray(data.backRow) ? data.backRow : []).map(Number);
  const front = (Array.isArray(data.frontRow) ? data.frontRow : []).map(Number);
  const visible = back.map((h, i) => Math.max(h, front[i]));
  const expected = [2, 3, 4];
  const heightsAgree = visible.length === expected.length && visible.every((h, i) => h === expected[i]);
  const answerAgree = String(problem.answer).trim() === "B";
  const failure = !heightsAgree ? `projection is ${visible.join(", ")}, expected 2, 3, 4` : !answerAgree ? `silhouette matches B, problem says ${problem.answer}` : null;
  const isFinal = step >= totalSteps - 1;
  const phase = isFinal ? 2 : Math.min(step, 1);
  const xs = [116, 226, 336];

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "4px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 460 315" width="100%" style={{ maxWidth: 480, display: "block" }} aria-label="The front view of a two-row stack map is formed from the taller stack in each front-to-back column">
        <defs>
          <marker id="front-projection-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill={INDIGO} /></marker>
        </defs>

        <text x="230" y="24" textAnchor="middle" fontSize="14" fontWeight="800" fill={INK}>LOOKING FROM THE FRONT</text>
        <path d="M230 48v28" stroke={INDIGO} strokeWidth="3" markerEnd="url(#front-projection-arrow)" />
        <text x="245" y="63" fontFamily={FONT} fontSize="10" fontWeight="700" fill={INDIGO}>sightlines</text>

        <AnimatePresence mode="wait" initial={false}>
          {phase === 0 && (
            <motion.g key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x="55" y="119" fontSize="11" fontWeight="800" fill="#64748b">BACK</text>
              <text x="50" y="219" fontSize="11" fontWeight="800" fill={INDIGO}>FRONT</text>
              {back.map((h, i) => <Tower key={`b-${i}`} x={xs[i]} baseY={150} height={h} fill={BACK} delay={i * 0.08} />)}
              {front.map((h, i) => <Tower key={`f-${i}`} x={xs[i]} baseY={250} height={h} fill={FRONT} delay={0.25 + i * 0.08} />)}
              {xs.map((x, i) => <text key={i} x={x + 14} y="284" textAnchor="middle" fontFamily={FONT} fontSize="10" fill="#64748b">column {i + 1}</text>)}
            </motion.g>
          )}

          {phase === 1 && (
            <motion.g key="maximums" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {visible.map((winner, i) => {
                const x = 42 + i * 145;
                const backWins = back[i] >= front[i];
                return (
                  <motion.g key={i} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.15 }}>
                    <rect x={x} y="90" width="124" height="158" rx="12" fill="#f8fafc" stroke="#cbd5e1" />
                    <text x={x + 62} y="112" textAnchor="middle" fontSize="11" fontWeight="800" fill={INK}>COLUMN {i + 1}</text>
                    <Tower x={x + 28} baseY={206} height={back[i]} fill={BACK} dim={!backWins} size={22} />
                    <Tower x={x + 76} baseY={206} height={front[i]} fill={FRONT} dim={backWins} size={22} />
                    <text x={x + 62} y="230" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="800" fill={INDIGO}>max({back[i]}, {front[i]}) = {winner}</text>
                  </motion.g>
                );
              })}
              <text x="230" y="278" textAnchor="middle" fontFamily={FONT} fontSize="15" fontWeight="900" fill={INDIGO}>visible heights: {visible.join("  →  ")}</text>
            </motion.g>
          )}

          {phase === 2 && (
            <motion.g key="silhouette" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x="230" y="91" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>FRONT SILHOUETTE</text>
              {visible.map((h, col) => Array.from({ length: h }, (_, row) => {
                const size = 42;
                const x = 167 + col * size;
                const y = 264 - (row + 1) * size;
                return <motion.rect key={`${col}-${row}`} x={x} y={y} width={size} height={size} fill="#c7d2fe" stroke={INDIGO} strokeWidth="2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 180, damping: 18, delay: col * 0.12 + row * 0.06 }} />;
              }))}
              {visible.map((h, i) => <text key={i} x={188 + i * 42} y="284" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="900" fill={INK}>{h}</text>)}
              <text x="230" y="304" textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="800" fill={failure ? RED : GREEN}>{failure ?? "2, 3, 4 ✓ matches choice B"}</text>
              {!failure && (
                <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.65 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <rect x="352" y="126" width="82" height="28" rx="14" fill={GREEN} />
                  <text x="393" y="145" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">Answer B</text>
                </motion.g>
              )}
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
