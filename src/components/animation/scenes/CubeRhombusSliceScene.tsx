import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const SLICE = "#38bdf8";
const DIM = "#94a3b8";
type P = { x: number; y: number };
const points = (ps: P[]) => ps.map((p) => `${p.x},${p.y}`).join(" ");

/**
 * A projected cube containing the actual cross-section EJCI. Its diagonals EC
 * and JI are the cube's space- and face-diagonal lengths, so the rhombus area
 * gives the area ratio to a face. Data: { diagonal1: "s√3", diagonal2: "s√2",
 * ratio: "√6/2", answer: "3/2" }.
 */
export function CubeRhombusSliceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const d1 = String(data.diagonal1 ?? "");
  const d2 = String(data.diagonal2 ?? "");
  const ratio = String(data.ratio ?? "");
  const result = String(data.answer ?? "");
  const stored = String(problem.shortAnswer ?? "").replace(/\s/g, "");
  const ok = d1 === "s√3" && d2 === "s√2" && ratio === "√6/2" && result === "3/2" && stored === result;
  const isFinal = step >= totalSteps - 1;
  const W = 460;
  const E: P = { x: 225, y: 40 }; const F: P = { x: 44, y: 95 }; const H: P = { x: 367, y: 158 };
  const D: P = { x: 367, y: 222 }; const B: P = { x: 44, y: 222 }; const C: P = { x: 158, y: 258 };
  const G: P = { x: 158, y: 126 }; const A: P = { x: 225, y: 166 };
  const J: P = { x: 44, y: 158 }; const I: P = { x: 367, y: 190 };
  const slice = [E, J, C, I];
  const Label = ({ p, name, dx = 0, dy = 0 }: { p: P; name: string; dx?: number; dy?: number }) => <text x={p.x + dx} y={p.y + dy} fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>{name}</text>;
  const WireCube = () => <g fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round">
    <path d={`M ${F.x} ${F.y} L ${E.x} ${E.y} L ${H.x} ${H.y} L ${D.x} ${D.y} L ${C.x} ${C.y} L ${B.x} ${B.y} L ${F.x} ${F.y}`} />
    <path d={`M ${F.x} ${F.y} L ${G.x} ${G.y} L ${H.x} ${H.y}`} />
    <path d={`M ${G.x} ${G.y} L ${C.x} ${C.y}`} />
    <path d={`M ${E.x} ${E.y} L ${A.x} ${A.y} L ${B.x} ${B.y}`} strokeDasharray="5 5" />
    <path d={`M ${A.x} ${A.y} L ${D.x} ${D.y}`} strokeDasharray="5 5" />
  </g>;

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
    <svg viewBox={`0 0 ${W} 286`} width="100%" style={{ maxWidth: 470 }}>
      <text x={W / 2} y="18" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>{step === 0 ? "the plane through E, J, C, and I cuts a rhombus" : step === 1 ? "the rhombus diagonals are familiar cube distances" : "rhombus area is half the product of its diagonals"}</text>
      <AnimatePresence mode="wait">
        {step === 0 && <motion.g key="slice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <WireCube />
          <motion.polygon points={points(slice)} fill={SLICE} fillOpacity="0.28" stroke={IND} strokeWidth="2.5" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 180, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          {[E, J, C, I].map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4.5" fill={IND} />)}
          <Label p={E} name="E" dx={-4} dy={-10} /><Label p={J} name="J" dx={-20} dy={4} /><Label p={C} name="C" dx={-10} dy={20} /><Label p={I} name="I" dx={10} dy={4} />
          <Label p={F} name="F" dx={-16} dy={-7} /><Label p={H} name="H" dx={10} dy={4} /><Label p={D} name="D" dx={10} dy={15} /><Label p={B} name="B" dx={-18} dy={15} />
          <motion.text x={W / 2} y="280" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>cross-section EJCI is a rhombus</motion.text>
        </motion.g>}
        {step === 1 && <motion.g key="diagonals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <WireCube /><polygon points={points(slice)} fill={SLICE} fillOpacity="0.18" stroke={IND} strokeWidth="2.2" />
          <motion.line x1={E.x} y1={E.y} x2={C.x} y2={C.y} stroke={WIN} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
          <motion.line x1={J.x} y1={J.y} x2={I.x} y2={I.y} stroke="#f59e0b" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.55, delay: 0.3 }} />
          {[E, J, C, I].map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4.5" fill={IND} />)}
          <Label p={E} name="E" dx={-4} dy={-10} /><Label p={J} name="J" dx={-20} dy={4} /><Label p={C} name="C" dx={-10} dy={20} /><Label p={I} name="I" dx={10} dy={4} />
          <rect x="292" y="54" width="143" height="78" rx="9" fill="#fff" stroke="#bbf7d0" />
          <text x="364" y="82" textAnchor="middle" fontSize="15" fontWeight="900" fill={WIN} fontFamily={FONT}>EC = {d1}</text>
          <text x="364" y="110" textAnchor="middle" fontSize="15" fontWeight="900" fill="#d97706" fontFamily={FONT}>JI = {d2}</text>
          <text x="364" y="125" textAnchor="middle" fontSize="9.5" fontWeight="750" fill={DIM}>space and face diagonals</text>
          <text x={W / 2} y="278" textAnchor="middle" fontSize="12" fontWeight="850" fill={IND}>both are diagonals of the cross-section rhombus</text>
        </motion.g>}
        {isFinal && <motion.g key="area" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.polygon points="106,137 228,64 350,137 228,210" fill={SLICE} fillOpacity="0.26" stroke={IND} strokeWidth="2.5" initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 180, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          <motion.line x1="106" y1="137" x2="350" y2="137" stroke="#d97706" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
          <motion.line x1="228" y1="64" x2="228" y2="210" stroke={WIN} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.25 }} />
          <text x="228" y="55" textAnchor="middle" fontSize="14" fontWeight="900" fill={WIN} fontFamily={FONT}>{d1}</text>
          <text x="355" y="133" fontSize="14" fontWeight="900" fill="#d97706" fontFamily={FONT}>{d2}</text>
          <rect x="88" y="225" width="280" height="25" rx="8" fill="#fff" stroke="#c7d2fe" />
          <text x="228" y="243" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>R = (s√3 · s√2)/(2s²) = {ratio}</text>
          <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.85 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x="181" y="258" width="98" height="23" rx="11.5" fill={ok ? WIN : "#dc2626"} />
            <text x={W / 2} y="274" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#fff">R² = {result} · Answer {ok ? problem.answer : "?"}</text>
          </motion.g>
        </motion.g>}
      </AnimatePresence>
    </svg>
  </div>;
}
