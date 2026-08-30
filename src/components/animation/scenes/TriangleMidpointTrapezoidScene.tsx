import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";
const SHADE = "#a5b4fc";
const TOP = "#fde68a";

/** Split an isosceles triangle, apply the midpoint area scale, and subtract the top triangle from the shaded half. */
export function TriangleMidpointTrapezoidScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const totalArea = num(data.totalArea, 8);
  const midpointFraction = num(data.midpointFraction, 0.5);
  const halfArea = totalArea / 2;
  const smallArea = halfArea * midpointFraction ** 2;
  const shadedArea = halfArea - smallArea;
  const choice = (problem.choices ?? []).find((c) => Number(String(c.text).replace(/[^\d.-]/g, "")) === shadedArea)?.label;
  const valid = String(shadedArea) === problem.shortAnswer && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  const X = [230, 35], Y = [35, 245], Z = [425, 245], C = [230, 245];
  const A = [132.5, 140], B = [327.5, 140], D = [230, 140];

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "5px 3px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 460 315" width="100%" style={{ maxWidth: 490, minWidth: 0, display: "block" }} aria-label="An altitude halves the triangle, and a midpoint cut removes a one-square-inch triangle from the four-square-inch left half">
        <text x="230" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "altitude XC splits the whole triangle into equal-area halves" : phase === 1 ? "A and D are halfway along the side and altitude" : "lift out the small top triangle from the left half"}
        </text>

        <polygon points={`${X} ${Y} ${Z}`} fill="#fff" stroke={INK} strokeWidth="2.4" />
        <motion.polygon points={`${X} ${Y} ${C}`} fill={phase === 0 ? "#dcfce7" : SHADE} fillOpacity="0.82" stroke="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
        {phase >= 1 && <polygon points={`${X} ${A} ${D}`} fill={TOP} stroke="#d97706" strokeWidth="1.7" />}
        {phase >= 1 && <polygon points={`${Y} ${A} ${D} ${C}`} fill={SHADE} stroke={IND} strokeWidth="1.7" />}

        <motion.line x1={X[0]} y1={X[1]} x2={C[0]} y2={C[1]} stroke={IND} strokeWidth="2.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        {phase >= 1 && <motion.line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke={IND} strokeWidth="2.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
        {phase >= 1 && <path d={`M ${C[0] - 9} ${C[1]} v -9 h 9`} fill="none" stroke={INK} strokeWidth="1.5" />}

        {[[X, "X", 0, -10], [Y, "Y", -14, 8], [Z, "Z", 12, 8], [C, "C", 0, 21]].map(([p, label, dx, dy]) => {
          const point = p as number[];
          return <text key={String(label)} x={point[0] + Number(dx)} y={point[1] + Number(dy)} textAnchor="middle" fontSize="13" fontWeight="900" fill={INK}>{String(label)}</text>;
        })}
        {phase >= 1 && <><text x={A[0] - 10} y={A[1] - 7} fontSize="12" fontWeight="900" fill={INK}>A</text><text x={B[0] + 8} y={B[1] - 7} fontSize="12" fontWeight="900" fill={INK}>B</text><text x={D[0] + 7} y={D[1] - 7} fontSize="12" fontWeight="900" fill={INK}>D</text></>}

        {phase === 0 && (
          <>
            <motion.text x="151" y="209" textAnchor="middle" fontSize="23" fontWeight="950" fill={GREEN} fontFamily={FONT} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ delay: 0.45, type: "spring" }}>4</motion.text>
            <motion.text x="309" y="209" textAnchor="middle" fontSize="23" fontWeight="950" fill={DIM} fontFamily={FONT} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: "spring" }}>4</motion.text>
            <text x="230" y="278" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>{totalArea} ÷ 2 = {halfArea}</text>
          </>
        )}

        {phase === 1 && (
          <>
            <motion.path d="M 121 92 Q 155 65 197 78" fill="none" stroke="#d97706" strokeWidth="1.7" markerEnd="url(#amberArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <text x="118" y="76" textAnchor="middle" fontSize="10" fontWeight="900" fill="#b45309" fontFamily={FONT}>side × 1/2</text>
            <motion.path d="M 250 83 H 276" fill="none" stroke="#d97706" strokeWidth="1.7" markerEnd="url(#amberArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <text x="322" y="87" textAnchor="middle" fontSize="10" fontWeight="900" fill="#b45309" fontFamily={FONT}>height × 1/2</text>
            <rect x="116" y="265" width="228" height="34" rx="11" fill="#fffbeb" stroke="#d97706" />
            <text x="230" y="287" textAnchor="middle" fontSize="14" fontWeight="950" fill="#b45309" fontFamily={FONT}>{halfArea} × 1/2 × 1/2 = {smallArea}</text>
          </>
        )}

        <AnimatePresence>
          {phase === 2 && (
            <motion.g key="subtract" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.g initial={{ x: 0, y: 0 }} animate={{ x: 164, y: 42 }} transition={{ delay: 0.25, type: "spring", stiffness: 130, damping: 18 }}>
                <polygon points={`${X} ${A} ${D}`} fill={TOP} stroke="#d97706" strokeWidth="1.7" />
                <text x="198" y="112" textAnchor="middle" fontSize="15" fontWeight="950" fill="#b45309" fontFamily={FONT}>1</text>
              </motion.g>
              <text x="151" y="204" textAnchor="middle" fontSize="23" fontWeight="950" fill={IND} fontFamily={FONT}>3</text>
              <rect x="90" y="263" width="280" height="38" rx="12" fill={valid ? "#dcfce7" : "#fee2e2"} stroke={valid ? GREEN : RED} strokeWidth="2" />
              <text x="230" y="288" textAnchor="middle" fontSize="18" fontWeight="950" fill={valid ? GREEN : RED} fontFamily={FONT}>{halfArea} − {smallArea} = {shadedArea} in²</text>
              <text x="190" y="311" textAnchor="middle" fontSize="9" fontWeight="800" fill={valid ? GREEN : RED} fontFamily={FONT}>{valid ? "equal half, midpoint scale, and choice verified" : `check failed: computed ${shadedArea}, stored ${problem.shortAnswer}`}</text>
              <SvgAnswerBadge show={valid} answer={problem.answer} cx={416} y={291} width={72} />
            </motion.g>
          )}
        </AnimatePresence>

        <defs><marker id="amberArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#d97706" /></marker></defs>
      </svg>
    </div>
  );
}
