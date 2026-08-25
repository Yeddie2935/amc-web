import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BLUE = "#2563eb";
const ORANGE = "#f59e0b";
const DIM = "#94a3b8";

type Point = { x: number; y: number };
const polygon = (points: Point[]) => points.map((p) => `${p.x},${p.y}`).join(" ");
const triangleArea = (a: Point, b: Point, c: Point) => Math.abs((a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2);

/**
 * A unit square whose diagonal and midpoint-to-corner line meet at F. Splitting
 * AFED along DF makes its 5/12 area visible as 1/3 + 1/12. Data:
 * { fraction: "5/12", givenArea: 45, answer: 108 }.
 */
export function SquareMidpointAreaScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const given = num(data.givenArea, 0);
  const answer = num(data.answer, 0);
  const fraction = String(data.fraction ?? "");
  const W = 460;
  const D: Point = { x: 96, y: 224 };
  const A: Point = { x: 96, y: 50 };
  const B: Point = { x: 270, y: 50 };
  const C: Point = { x: 270, y: 224 };
  const E: Point = { x: 183, y: 224 };
  const F: Point = { x: 212, y: 166 };
  const unit = 174;
  const leftPiece = triangleArea(A, F, D) / (unit * unit);
  const lowerPiece = triangleArea(D, E, F) / (unit * unit);
  const shaded = leftPiece + lowerPiece;
  const computedAnswer = Math.round(given / shaded);
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d]/g, ""));
  const ok = Math.abs(leftPiece - 1 / 3) < 1e-9 && Math.abs(lowerPiece - 1 / 12) < 1e-9 && fraction === "5/12" && computedAnswer === answer && stored === answer;
  const isFinal = step >= totalSteps - 1;
  const label = (p: Point, text: string, dx: number, dy: number) => <text x={p.x + dx} y={p.y + dy} fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>{text}</text>;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} 285`} width="100%" style={{ maxWidth: 470 }}>
        <text x={W / 2} y="19" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>
          {step === 0 ? "put the square on a 1-by-1 coordinate board" : step === 1 ? "the two lines meet at F = (2/3, 1/3)" : "split the shaded quadrilateral into two coordinate triangles"}
        </text>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.g key="board" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <rect x={D.x} y={A.y} width={unit} height={unit} fill="#f8fafc" stroke={INK} strokeWidth="2.4" />
              {[1 / 3, 2 / 3].map((part) => <g key={part}><path d={`M ${D.x + unit * part} ${A.y} V ${D.y}`} stroke="#cbd5e1" strokeDasharray="3 4" /><path d={`M ${D.x} ${D.y - unit * part} H ${C.x}`} stroke="#cbd5e1" strokeDasharray="3 4" /></g>)}
              <circle cx={E.x} cy={E.y} r="4" fill={ORANGE} />
              {label(A, "A (0,1)", -30, -11)} {label(B, "B (1,1)", 8, -11)} {label(C, "C (1,0)", 8, 20)} {label(D, "D (0,0)", -50, 20)}
              <text x={E.x} y={E.y + 21} textAnchor="middle" fontSize="13" fontWeight="900" fill={ORANGE} fontFamily={FONT}>E (1/2,0)</text>
              <motion.text x={W / 2} y="264" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>square area = 1 whole</motion.text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g key="intersect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <rect x={D.x} y={A.y} width={unit} height={unit} fill="#f8fafc" stroke={INK} strokeWidth="2.4" />
              <motion.line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke={BLUE} strokeWidth="2.6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.65 }} />
              <motion.line x1={B.x} y1={B.y} x2={E.x} y2={E.y} stroke={ORANGE} strokeWidth="2.6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.65, delay: 0.25 }} />
              <motion.circle cx={F.x} cy={F.y} r="6" fill={WIN} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 230, damping: 15, delay: 0.8 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              {label(A, "A", -16, -8)} {label(B, "B", 8, -8)} {label(C, "C", 8, 17)} {label(D, "D", -17, 17)} {label(E, "E", -4, 18)}
              <text x={F.x + 10} y={F.y - 9} fontSize="14" fontWeight="900" fill={WIN} fontFamily={FONT}>F (2/3,1/3)</text>
              <text x="302" y="112" fontSize="11" fontWeight="850" fill={BLUE} fontFamily={FONT}>AC: y = 1 − x</text>
              <text x="302" y="131" fontSize="11" fontWeight="850" fill={ORANGE} fontFamily={FONT}>BE: y = 2x − 1</text>
            </motion.g>
          )}

          {isFinal && (
            <motion.g key="area" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={D.x} y={A.y} width={unit} height={unit} fill="#f8fafc" stroke={INK} strokeWidth="2.4" />
              <motion.polygon points={polygon([A, F, D])} fill={BLUE} fillOpacity="0.36" stroke={BLUE} strokeWidth="1.4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
              <motion.polygon points={polygon([D, E, F])} fill={ORANGE} fillOpacity="0.44" stroke={ORANGE} strokeWidth="1.4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} />
              <motion.line x1={D.x} y1={D.y} x2={F.x} y2={F.y} stroke={IND} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.45 }} />
              {label(A, "A", -16, -8)} {label(C, "C", 8, 17)} {label(D, "D", -17, 17)} {label(E, "E", -4, 18)} {label(F, "F", 8, -8)}
              <rect x="289" y="58" width="151" height="126" rx="10" fill="#fff" stroke="#c7d2fe" />
              <text x="364" y="84" textAnchor="middle" fontSize="12" fontWeight="900" fill={BLUE} fontFamily={FONT}>[AFD] = 1/3</text>
              <text x="364" y="111" textAnchor="middle" fontSize="12" fontWeight="900" fill={ORANGE} fontFamily={FONT}>[DFE] = 1/12</text>
              <path d="M 306 125 H 422" stroke="#cbd5e1" />
              <text x="364" y="150" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>[AFED] = 5/12</text>
              <text x="364" y="170" textAnchor="middle" fontSize="10" fontWeight="750" fill={DIM}>of the whole square</text>
              <motion.text x="365" y="211" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>{given} ÷ (5/12) = {computedAnswer}</motion.text>
              <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <rect x="316" y="229" width="98" height="22" rx="11" fill={ok ? WIN : "#dc2626"} />
                <text x="365" y="244" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#fff">Answer {ok ? problem.answer : "check data"}</text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
