import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MUTE = "#94a3b8";
const D_COL = "#0d9488";
const E_COL = "#4338ca";
const F_COL = "#f59e0b";
const WIN = "#16a34a";
const BAD = "#dc2626";

interface P {
  x: number;
  y: number;
}
const mid = (a: P, b: P): P => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const lerp = (a: P, b: P, t: number): P => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
const dist = (a: P, b: P) => Math.hypot(b.x - a.x, b.y - a.y);
const shoelace = (a: P, b: P, c: P) => Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;

// intersection of line p1p2 with line p3p4
function intersect(p1: P, p2: P, p3: P, p4: P): P {
  const d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  const a = p1.x * p2.y - p1.y * p2.x;
  const b = p3.x * p4.y - p3.y * p4.x;
  return {
    x: (a * (p3.x - p4.x) - (p1.x - p2.x) * b) / d,
    y: (a * (p3.y - p4.y) - (p1.y - p2.y) * b) / d,
  };
}

const tidy = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(1))));

/**
 * D splits AC in a fixed ratio, so a mass sits at each end in inverse
 * proportion — heavier at the end with the shorter arm — and D is where those
 * masses balance. E, the midpoint of BD, needs equal masses at B and D, which
 * pins B's mass too. With A, B, C all weighted, F — where line AE meets BC —
 * turns out to be exactly the point where B and C's masses balance: the same
 * few numbers explain every point in the picture. Areas are read off the
 * actual drawn triangle by the shoelace formula and scaled to the given total,
 * not asserted, so [EBF] falls out of the picture rather than a formula.
 * Data: { adNum, dcNum, totalArea }.
 */
export function MassPointBalanceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const adNum = Math.max(1, num(data.adNum, 1));
  const dcNum = Math.max(1, num(data.dcNum, 2));
  const totalArea = num(data.totalArea, 360);

  const A: P = { x: 150, y: 22 };
  const B: P = { x: 26, y: 248 };
  const C: P = { x: 312, y: 248 };

  const massA = dcNum;
  const massC = adNum;
  const massD = massA + massC;
  const massB = massD;

  const D = lerp(A, C, adNum / (adNum + dcNum));
  const E = mid(B, D);
  const F = intersect(A, E, B, C);

  const areaABC = shoelace(A, B, C);
  const scale = totalArea / areaABC;
  const areaABD = shoelace(A, B, D) * scale;
  const areaABE = shoelace(A, B, E) * scale;
  const areaABF = shoelace(A, B, F) * scale;
  const areaEBF = shoelace(E, B, F) * scale;

  const bfLen = dist(B, F);
  const fcLen = dist(F, C);
  const bfg = Math.min(bfLen, fcLen);
  const bfRatio = [Math.round(bfLen / bfg), Math.round(fcLen / bfg)];
  const massBF = [massC, massB]; // predicted BF:FC = massC:massB
  const bfMatches = bfRatio[0] * massBF[1] === bfRatio[1] * massBF[0];

  // the classic slip: reading the ratio AD:DC backwards
  const swapD = lerp(A, C, dcNum / (adNum + dcNum));
  const swapE = mid(B, swapD);
  const swapF = intersect(A, swapE, B, C);
  const swapEBF = shoelace(swapE, B, swapF) * scale;
  const trapLetter = problem.choices?.find(
    (c) => Math.abs(Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) - swapEBF) < 0.5
  )?.label;
  const showTrap = trapLetter != null && Math.abs(swapEBF - areaEBF) > 0.5;

  const storedArea = Number(problem.shortAnswer ?? NaN);
  const finalOk = !Number.isFinite(storedArea) || Math.abs(storedArea - areaEBF) < 0.5;

  const stage = step >= totalSteps - 1 ? 3 : Math.min(step, 2);

  const W = 340;
  const H = 270;

  const weight = (p: P, m: number, color: string, dx: number, dy: number, delay = 0) => (
    <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14, delay }}>
      <circle cx={p.x + dx} cy={p.y + dy} r={10} fill={color} stroke="#fff" strokeWidth={1.3} />
      <text x={p.x + dx} y={p.y + dy + 3.5} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#fff" fontFamily={numberFont}>
        {m}
      </text>
    </motion.g>
  );

  const vertex = (p: P, label: string) => (
    <g>
      <circle cx={p.x} cy={p.y} r={3.6} fill={INK} stroke="#fff" strokeWidth={1.2} />
      <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
        {label}
      </text>
    </g>
  );

  const caption =
    stage === 0
      ? `AD : DC = ${adNum} : ${dcNum}, so D balances masses ${massC} at C and ${massA} at A — [ABD] = ${tidy(areaABD)}`
      : stage === 1
      ? `E is the midpoint of BD, so median AE splits △ABD evenly: [ABE] = [ADE] = ${tidy(areaABE)}`
      : stage === 2
      ? `B and C now carry masses ${massB} and ${massC}; F is their balance point, BF : FC = ${bfRatio[0]} : ${bfRatio[1]} — [ABF] = ${tidy(areaABF)}`
      : `A, E, F are one line, so [EBF] = [ABF] − [ABE] = ${tidy(areaABF)} − ${tidy(areaABE)} = ${tidy(areaEBF)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* the base triangle, always visible */}
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="none" stroke={INK} strokeWidth={1.8} />

        {/* ABD, shaded once D exists */}
        <AnimatePresence>
          {stage >= 0 && (
            <motion.polygon
              key="abd"
              points={`${A.x},${A.y} ${B.x},${B.y} ${D.x},${D.y}`}
              fill={stage === 0 ? "rgba(13,148,136,0.22)" : "rgba(13,148,136,0.08)"}
              stroke={D_COL}
              strokeWidth={stage === 0 ? 1.8 : 1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            />
          )}
        </AnimatePresence>

        {/* ADE outline, shown alongside ABE to make the "equal halves" visible */}
        <AnimatePresence>
          {stage === 1 && (
            <motion.polygon
              key="ade"
              points={`${A.x},${A.y} ${D.x},${D.y} ${E.x},${E.y}`}
              fill="rgba(148,163,184,0.18)"
              stroke={MUTE}
              strokeWidth={1.2}
              strokeDasharray="4 3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            />
          )}
        </AnimatePresence>

        {/* ABE, shaded from stage 1 on (kept visible under ABF/EBF as context) */}
        <AnimatePresence>
          {stage >= 1 && (
            <motion.polygon
              key="abe"
              points={`${A.x},${A.y} ${B.x},${B.y} ${E.x},${E.y}`}
              fill={stage === 1 ? "rgba(67,56,202,0.24)" : "rgba(67,56,202,0.10)"}
              stroke={E_COL}
              strokeWidth={stage === 1 ? 1.8 : 1}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 170, damping: 18, delay: 0.55 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          )}
        </AnimatePresence>

        {/* ABF, shaded at stage 2 */}
        <AnimatePresence>
          {stage === 2 && (
            <motion.polygon
              key="abf"
              points={`${A.x},${A.y} ${B.x},${B.y} ${F.x},${F.y}`}
              fill="rgba(245,158,11,0.20)"
              stroke={F_COL}
              strokeWidth={1.8}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 170, damping: 18, delay: 0.65 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          )}
        </AnimatePresence>

        {/* the final target, EBF, isolated */}
        <AnimatePresence>
          {stage === 3 && (
            <motion.polygon
              key="ebf"
              points={`${E.x},${E.y} ${B.x},${B.y} ${F.x},${F.y}`}
              fill="rgba(22,163,74,0.26)"
              stroke={WIN}
              strokeWidth={2.2}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.3 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          )}
        </AnimatePresence>
        {stage === 3 && (
          <>
            <line x1={A.x} y1={A.y} x2={F.x} y2={F.y} stroke={MUTE} strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
            <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${F.x},${F.y}`} fill="none" stroke={F_COL} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
          </>
        )}

        {/* AC and BC sides drawn crisp, then AB */}
        <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke={INK} strokeWidth={1.6} />
        <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={INK} strokeWidth={1.6} />
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={INK} strokeWidth={1.6} />

        {/* BD, drawn once D exists */}
        {stage >= 0 && <line x1={B.x} y1={B.y} x2={D.x} y2={D.y} stroke={D_COL} strokeWidth={1.6} />}

        {/* AE / AF, extended once E and F exist */}
        {stage >= 1 && stage < 2 && <line x1={A.x} y1={A.y} x2={E.x} y2={E.y} stroke={E_COL} strokeWidth={1.8} />}
        {stage >= 2 && (
          <motion.line
            x1={A.x}
            y1={A.y}
            x2={F.x}
            y2={F.y}
            stroke={stage === 3 ? WIN : E_COL}
            strokeWidth={1.8}
            initial={{ pathLength: stage === 2 ? 0 : 1 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          />
        )}

        {/* vertices and named points */}
        {vertex(A, "A")}
        {vertex(B, "B")}
        {vertex(C, "C")}
        {stage >= 0 && vertex(D, "D")}
        {stage >= 1 && vertex(E, "E")}
        {stage >= 2 && vertex(F, "F")}

        {/* masses, appearing as each constraint is introduced */}
        {stage === 0 && weight(A, massA, D_COL, -16, 12, 0.15)}
        {stage === 0 && weight(C, massC, D_COL, 14, -12, 0.3)}
        {stage === 1 && weight(B, massB, E_COL, -16, -10, 0.15)}
        {stage === 1 && weight(D, massD, E_COL, 14, 10, 0.3)}
        {stage === 2 && weight(B, massB, F_COL, -16, -10, 0.1)}
        {stage === 2 && weight(C, massC, F_COL, 14, -12, 0.25)}

        {/* area readouts, pinned near each shaded triangle's centroid */}
        {stage === 0 && (
          <motion.text
            x={(A.x + B.x + D.x) / 3}
            y={(A.y + B.y + D.y) / 3}
            textAnchor="middle"
            fontSize="11"
            fontWeight="800"
            fill={D_COL}
            fontFamily={numberFont}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {tidy(areaABD)}
          </motion.text>
        )}
        {stage === 1 && (
          <>
            <motion.text
              x={(A.x + B.x + E.x) / 3}
              y={(A.y + B.y + E.y) / 3 + 3}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="800"
              fill="#fff"
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05 }}
            >
              {tidy(areaABE)}
            </motion.text>
            <motion.text
              x={(A.x + D.x + E.x) / 3}
              y={(A.y + D.y + E.y) / 3}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill={MUTE}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05 }}
            >
              {tidy(areaABE)}
            </motion.text>
          </>
        )}
        {stage === 2 && (
          <motion.text
            x={(A.x + B.x + F.x) / 3}
            y={(A.y + B.y + F.y) / 3 + 3}
            textAnchor="middle"
            fontSize="10.5"
            fontWeight="800"
            fill="#78350f"
            fontFamily={numberFont}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            {tidy(areaABF)}
          </motion.text>
        )}
        {stage === 3 && (
          <motion.text
            x={(E.x + B.x + F.x) / 3}
            y={(E.y + B.y + F.y) / 3 + 12}
            textAnchor="middle"
            fontSize="11"
            fontWeight="800"
            fill="#166534"
            fontFamily={numberFont}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 14, delay: 0.7 }}
          >
            {tidy(areaEBF)}
          </motion.text>
        )}
      </svg>

      <motion.span
        key={`${step}-${stage}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: stage === 3 ? "#166534" : stage === 2 ? "#92400e" : stage === 1 ? "#3730a3" : "#0f766e",
          background: stage === 3 ? "#dcfce7" : stage === 2 ? "#fef3c7" : stage === 1 ? "#eef2ff" : "#ccfbf1",
          border: `1px solid ${stage === 3 ? "#bbf7d0" : stage === 2 ? "#fde68a" : stage === 1 ? "#c7d2fe" : "#99f6e4"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {stage === 2 && !bfMatches && (
          <motion.span
            key="bfchk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: BAD, textAlign: "center" }}
          >
            F landed at BF:FC = {bfRatio[0]}:{bfRatio[1]}, not the predicted {massBF[0]}:{massBF[1]}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === 3 && showTrap && (
          <motion.span
            key="trap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: BAD, textAlign: "center" }}
          >
            reading the ratio backwards (AD:DC = {dcNum}:{adNum}) gives {tidy(swapEBF)} — choice {trapLetter}, not this problem's D
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === 3 && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.25 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: finalOk ? MUTE : BAD, textAlign: "center" }}
          >
            {finalOk
              ? `check: shoelace on E, B, F scaled to the total gives ${tidy(areaEBF)}`
              : `this picture gives ${tidy(areaEBF)}, not the stored ${tidy(storedArea)}`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === 3 && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.35 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
