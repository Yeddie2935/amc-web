import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

function factorPairs(area: number) {
  const pairs: { w: number; l: number }[] = [];
  for (let w = 1; w <= area; w++) {
    if (area % w === 0) pairs.push({ w, l: area / w });
  }
  return pairs;
}

/**
 * The width/length pairs for a fixed rectangle area plot as a decreasing,
 * curved (hyperbola-shaped) scatter — contrasted with straight-line and flat
 * trap shapes to show why only the true inverse curve is correct.
 * Data: { area: 12 }.
 */
export function FactorPairCurveScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const area = num(data.area, 12);
  const pairs = factorPairs(area);
  const maxW = pairs[pairs.length - 1].w;
  const maxL = pairs[0].l;

  const isFinal = step >= totalSteps - 1;
  const showPlot = step >= 1;
  const showTraps = step === 2;

  const X0 = 40;
  const Y0 = 140;
  const PW = 180;
  const PH = 110;
  const px = (w: number) => X0 + (w / maxW) * PW;
  const py = (l: number) => Y0 - (l / maxL) * PH;

  const trapShapes = [
    { key: "B", label: "B: up", points: pairs.map((p, i) => ({ x: p.w, y: i + 1 })), verdict: "wrong direction" },
    { key: "C", label: "C: straight", points: pairs.map((p) => ({ x: p.w, y: maxL - ((maxL - 1) / maxW) * p.w })), verdict: "not curved" },
    { key: "D", label: "D: flat", points: pairs.map((p) => ({ x: p.w, y: maxL / 2 })), verdict: "not decreasing" },
  ];

  const miniPlot = (cx: number, points: { x: number; y: number }[], color: string, label: string, verdict: string) => (
    <g transform={`translate(${cx}, 0)`}>
      <line x1="0" y1="60" x2="66" y2="60" stroke="#cbd5e1" strokeWidth="1.4" />
      <line x1="0" y1="0" x2="0" y2="60" stroke="#cbd5e1" strokeWidth="1.4" />
      {points.map((p, i) => (
        <circle key={i} cx={(p.x / maxW) * 56} cy={60 - (p.y / maxL) * 55} r="2.6" fill={color} />
      ))}
      <text x="33" y="76" textAnchor="middle" fontSize="9" fontWeight="800" fill={color} fontFamily={FONT}>
        {label}
      </text>
      <text x="33" y="88" textAnchor="middle" fontSize="7.5" fontWeight="700" fill={DIM} fontFamily={FONT}>
        {verdict}
      </text>
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? `every whole-number (w, l) pair with area ${area}`
          : showTraps
            ? "the other graphs don't match this shape"
            : isFinal
              ? "graph A matches this curve"
              : "plot the pairs — width up, length down"}
      </div>

      {!showTraps && (
        <svg viewBox="0 0 260 170" width="100%" style={{ maxWidth: 280 }}>
          <line x1={X0} y1={Y0} x2={X0 + PW + 10} y2={Y0} stroke={INK} strokeWidth="1.6" />
          <line x1={X0} y1={Y0 - PH - 10} x2={X0} y2={Y0} stroke={INK} strokeWidth="1.6" />
          <text x={X0 + PW + 10} y={Y0 + 14} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>w</text>
          <text x={X0 - 14} y={Y0 - PH - 6} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>l</text>

          {step === 0 &&
            pairs.map((p, i) => (
              <motion.text
                key={i}
                x="130"
                y={30 + i * 16}
                textAnchor="middle"
                fontSize="11"
                fontWeight="800"
                fill={IND}
                fontFamily={FONT}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 * i }}
              >
                ({p.w}, {p.l})
              </motion.text>
            ))}

          {showPlot &&
            pairs.map((p, i) => (
              <motion.circle
                key={i}
                cx={px(p.w)}
                cy={py(p.l)}
                r="4.5"
                fill={WIN}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.12 * i, type: "spring", stiffness: 260, damping: 18 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            ))}
          {showPlot && (
            <motion.path
              d={`M ${pairs.map((p) => `${px(p.w)} ${py(p.l)}`).join(" L ")}`}
              fill="none"
              stroke={WIN}
              strokeWidth="1.6"
              strokeOpacity="0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            />
          )}
        </svg>
      )}

      {showTraps && (
        <svg viewBox="0 0 300 100" width="100%" style={{ maxWidth: 320 }}>
          {miniPlot(15, trapShapes[0].points, RED, trapShapes[0].label, trapShapes[0].verdict)}
          {miniPlot(115, trapShapes[1].points, RED, trapShapes[1].label, trapShapes[1].verdict)}
          {miniPlot(215, trapShapes[2].points, RED, trapShapes[2].label, trapShapes[2].verdict)}
        </svg>
      )}

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 4 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
