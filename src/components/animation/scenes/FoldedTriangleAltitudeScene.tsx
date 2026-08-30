import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const TEAL = "#0d9488";
const GOLD = "#f59e0b";
const GREEN = "#16a34a";
const DIM = "#94a3b8";

const fractionValue = (value: string | null | undefined) => {
  if (!value) return NaN;
  const [a, b] = value.split("/").map(Number);
  return b === undefined ? a : a / b;
};

/**
 * Builds the notched square around the fold line, measures the centre's offset,
 * and reflects O across BC to expose the triangle's altitude.
 * Data: { squareArea, smallSide }.
 */
export function FoldedTriangleAltitudeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const squareArea = num(data.squareArea, 25);
  const unit = num(data.smallSide, 1);
  const side = Math.sqrt(squareArea);
  const base = side - 2 * unit;
  const offset = 2 * unit + side / 2;
  const area = base * offset / 2;
  const agrees = Math.abs(area - fractionValue(problem.shortAnswer)) < 1e-9;

  const final = step >= totalSteps - 1;
  const showMeasure = step >= 1;
  const showFold = step >= 2;

  const s = 26;
  const hingeX = 122;
  const squareX = hingeX + 2 * unit * s;
  const top = 48;
  const bottom = top + side * s;
  const B = top + unit * s;
  const C = bottom - unit * s;
  const OX = squareX + side * s / 2;
  const OY = (top + bottom) / 2;
  const AX = hingeX - offset * s;
  const segments = [
    { x1: hingeX, x2: hingeX + unit * s, label: "1" },
    { x1: hingeX + unit * s, x2: squareX, label: "1" },
    { x1: squareX, x2: OX, label: `${side}/2` },
  ];

  const caption = final
    ? `area = ½ × ${base} × ${offset} = ${area}`
    : step === 0
      ? `side WXYZ = √${squareArea} = ${side}; BC = ${side} − ${unit} − ${unit} = ${base}`
      : step === 1
        ? `BC to O = ${unit} + ${unit} + ${side}/2 = ${offset}`
        : `the fold reflects O to A, so the triangle's altitude is also ${offset}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: "100%", minWidth: 0, boxSizing: "border-box", padding: "6px 2px" }}>
      <svg viewBox="0 0 340 238" width="100%" style={{ width: "100%", maxWidth: 430, display: "block" }} aria-label="Triangle ABC folding across BC onto the center of square WXYZ">
        <rect x={squareX} y={top} width={side * s} height={side * s} fill="#f8fafc" stroke={INK} strokeWidth="2" />
        <line x1={squareX} y1={top} x2={squareX} y2={bottom} stroke={DIM} strokeWidth="1.2" />

        {/* Four real 1-by-1 corner squares form the two-step offset. */}
        {[
          [hingeX, top], [hingeX + unit * s, top - unit * s],
          [hingeX, bottom - unit * s], [hingeX + unit * s, bottom],
        ].map(([x, y], i) => (
          <motion.rect key={i} x={x} y={y} width={unit * s} height={unit * s} fill="#fef3c7" stroke={GOLD} strokeWidth="1.7"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.08, type: "spring" }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        ))}

        <line x1={hingeX} y1={B} x2={hingeX} y2={C} stroke={TEAL} strokeWidth="4" strokeLinecap="round" />
        <motion.line x1={hingeX} y1={B} x2={hingeX} y2={C} stroke="#2dd4bf" strokeWidth="7" strokeLinecap="round" opacity="0.28"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.55 }} />

        <AnimatePresence>
          {showFold && (
            <motion.g key="folded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <polygon points={`${hingeX},${B} ${hingeX},${C} ${OX},${OY}`} fill="#c7d2fe" fillOpacity="0.5" stroke={INDIGO} strokeWidth="2" strokeDasharray="5 4" />
              <motion.path d={`M ${OX - 12} ${OY - 30} Q ${hingeX + 15} ${OY - 58} ${AX + 18} ${OY - 22}`} fill="none" stroke={INDIGO} strokeWidth="2.5"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />
              <path d={`M ${AX + 18} ${OY - 22} l 11 -1 l -5 10`} fill="none" stroke={INDIGO} strokeWidth="2.5" />
              <motion.polygon points={`${hingeX},${B} ${hingeX},${C} ${AX},${OY}`} fill="#ddd6fe" fillOpacity="0.7" stroke={INDIGO} strokeWidth="2.4"
                initial={{ opacity: 0, scaleX: -1 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.35, duration: 0.6 }}
                style={{ transformBox: "fill-box", transformOrigin: `${hingeX}px center` }} />
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showMeasure && (
            <motion.g key="measure" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={hingeX} y1={OY + 18} x2={OX} y2={OY + 18} stroke={GOLD} strokeWidth="2" />
              {segments.map((seg, i) => (
                <g key={i}>
                  <line x1={seg.x1} y1={OY + 13} x2={seg.x1} y2={OY + 23} stroke={GOLD} />
                  <text x={(seg.x1 + seg.x2) / 2} y={OY + 34} textAnchor="middle" fontSize="10" fontWeight="900" fill="#92400e" fontFamily={FONT}>{seg.label}</text>
                </g>
              ))}
              <line x1={OX} y1={OY + 13} x2={OX} y2={OY + 23} stroke={GOLD} />
            </motion.g>
          )}
        </AnimatePresence>

        <circle cx={OX} cy={OY} r="4" fill={INK} />
        {showFold && <circle cx={AX} cy={OY} r="4" fill={INDIGO} />}
        {[
          ["W", squareX, top - 7], ["X", squareX + side * s, top - 7], ["Y", squareX + side * s, bottom + 15], ["Z", squareX, bottom + 15],
          ["B", hingeX - 9, B + 3], ["C", hingeX - 9, C + 4], ["O", OX + 10, OY - 7],
        ].map(([label, x, y]) => <text key={String(label)} x={Number(x)} y={Number(y)} textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>{label}</text>)}
        {showFold && <text x={AX - 9} y={OY + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill={INDIGO} fontFamily={FONT}>A</text>}

        <rect x={hingeX - 15} y={(B + C) / 2 - 10} width="30" height="18" rx="8" fill="#ccfbf1" />
        <text x={hingeX} y={(B + C) / 2 + 3} textAnchor="middle" fontSize="11" fontWeight="900" fill="#0f766e" fontFamily={FONT}>{base}</text>

        {final && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <rect x="91" y="204" width="158" height="26" rx="10" fill={agrees ? "#dcfce7" : "#fee2e2"} stroke={agrees ? GREEN : "#dc2626"} />
            <text x="170" y="221" textAnchor="middle" fontSize="12" fontWeight="900" fill={agrees ? "#166534" : "#991b1b"} fontFamily={FONT}>
              {agrees ? `½·${base}·${offset} = ${problem.shortAnswer}` : "area check failed"}
            </text>
          </motion.g>
        )}
      </svg>

      <div style={{ maxWidth: "100%", overflowWrap: "anywhere", fontFamily: FONT, fontSize: 12, fontWeight: 850, color: final ? "#166534" : step === 0 ? "#0f766e" : step === 1 ? "#92400e" : INDIGO, textAlign: "center" }}>{caption}</div>
      {final && <svg viewBox="0 0 200 32" width="130"><SvgAnswerBadge show answer={problem.answer ?? null} cx={100} y={3} /></svg>}
    </div>
  );
}
