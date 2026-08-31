import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", AMBER = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";
type P = { x: number; y: number };
const points = (...ps: P[]) => ps.map((p) => `${p.x},${p.y}`).join(" ");

/** Peel three right-triangle corners from a rectangle to expose the triangle through two side midpoints. */
export function RectangleMidpointTriangleAreaScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const rectangleArea = num(data.rectangleArea, 0);
  const bcFraction = num(data.bcMidpointFraction, 0);
  const cdFraction = num(data.cdMidpointFraction, 0);
  const cornerFractions = [
    (1 - bcFraction) / 2,
    bcFraction * (1 - cdFraction) / 2,
    cdFraction / 2,
  ];
  const outsideFraction = cornerFractions.reduce((sum, value) => sum + value, 0);
  const triangleFraction = 1 - outsideFraction;
  const targetArea = rectangleArea * triangleFraction;
  const choice = problem.choices?.find((item) => Number(item.text) === targetArea)?.label;
  const ok = bcFraction === 0.5 && cdFraction === 0.5 && triangleFraction === 3 / 8 && targetArea === Number(problem.shortAnswer) && choice === problem.answer;
  const failure = bcFraction !== 0.5 || cdFraction !== 0.5
    ? `midpoint fractions are ${bcFraction} and ${cdFraction}`
    : triangleFraction !== 3 / 8
    ? `computed fraction ${triangleFraction}`
    : targetArea !== Number(problem.shortAnswer)
    ? `computed ${targetArea}, stored ${problem.shortAnswer}`
    : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(Math.max(step, 0), 2);

  const A = { x: 45, y: 46 }, B = { x: 270, y: 46 }, C = { x: 270, y: 230 }, D = { x: 45, y: 230 };
  const M = { x: B.x, y: B.y + bcFraction * (C.y - B.y) };
  const N = { x: C.x - cdFraction * (C.x - D.x), y: C.y };
  const corners = [[A, B, M], [M, C, N], [A, N, D]];
  const fills = ["#fde68a", "#bae6fd", "#ddd6fe"], strokes = [AMBER, TEAL, IND];
  const labels = [["A", A, -18, -8], ["B", B, 8, -8], ["C", C, 8, 17], ["D", D, -18, 17], ["M", M, 8, 4], ["N", N, -4, 20]] as const;
  const fractionText = ["1/4", "1/8", "1/4"];
  const areaText = cornerFractions.map((value) => rectangleArea * value);

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 470 320" width="100%" style={{ maxWidth: 500, minWidth: 0, display: "block" }} aria-label="Rectangle ABCD with a triangle joining A to the midpoints of BC and CD">
      <text x="235" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
        {phase === 0 ? "join A to the midpoints M and N" : phase === 1 ? "the triangle leaves three corner right triangles" : phase === 2 ? "add the three easy outside fractions" : "subtract the outside area, then use the rectangle's area"}
      </text>

      <rect x={A.x} y={A.y} width={B.x - A.x} height={D.y - A.y} fill="#f8fafc" stroke={INK} strokeWidth="2.4" />
      {phase >= 1 && corners.map((triangle, i) => <motion.polygon key={i} points={points(...triangle)} fill={fills[i]} stroke={strokes[i]} strokeWidth="1.7" initial={{ opacity: 0, scale: .72 }} animate={{ opacity: phase === 3 ? .18 : .78, scale: 1 }} transition={{ delay: i * .14, type: "spring", stiffness: 180, damping: 17 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />)}
      <motion.polygon points={points(A, M, N)} fill={phase === 3 ? "#dcfce7" : "#eef2ff"} fillOpacity=".9" stroke={phase === 3 ? GREEN : IND} strokeWidth={phase === 3 ? 3.2 : 2.4} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />

      <g stroke={AMBER} strokeWidth="2">
        <line x1={M.x - 6} y1={(B.y + M.y) / 2 - 5} x2={M.x + 6} y2={(B.y + M.y) / 2 + 5} /><line x1={M.x - 6} y1={(M.y + C.y) / 2 - 5} x2={M.x + 6} y2={(M.y + C.y) / 2 + 5} />
        <line x1={(D.x + N.x) / 2 - 5} y1={N.y - 6} x2={(D.x + N.x) / 2 + 5} y2={N.y + 6} /><line x1={(N.x + C.x) / 2 - 5} y1={N.y - 6} x2={(N.x + C.x) / 2 + 5} y2={N.y + 6} />
      </g>
      {labels.map(([label, p, dx, dy]) => <g key={label}><circle cx={p.x} cy={p.y} r="3.4" fill={INK} /><text x={p.x + dx} y={p.y + dy} fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>{label}</text></g>)}

      {phase === 0 && <g transform="translate(312 70)"><rect width="132" height="116" rx="13" fill="#f8fafc" stroke="#cbd5e1" /><text x="66" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>GIVEN</text><text x="66" y="55" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>area = {rectangleArea}</text><text x="66" y="83" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>BM = MC</text><text x="66" y="104" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>DN = NC</text></g>}
      {phase === 1 && <g>{[[181,79],[226,194],[82,184]].map(([x,y],i) => <motion.g key={i} initial={{ scale: .6 }} animate={{ scale: 1 }} transition={{ delay: .28 + i * .14 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x={x - 27} y={y - 13} width="54" height="26" rx="8" fill="#fff" fillOpacity=".94" stroke={strokes[i]} /><text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill={strokes[i]} fontFamily={FONT}>{fractionText[i]}</text></motion.g>)}<g transform="translate(311 67)"><rect width="134" height="151" rx="13" fill="#f8fafc" stroke="#cbd5e1" /><text x="67" y="24" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>CORNER AREAS</text>{fractionText.map((value, i) => <text key={value + i} x="67" y={55 + i * 31} textAnchor="middle" fontSize="13" fontWeight="900" fill={strokes[i]} fontFamily={FONT}>{value} × {rectangleArea} = {areaText[i]}</text>)}</g></g>}
      {phase === 2 && <g transform="translate(305 62)"><rect width="145" height="174" rx="14" fill="#eef2ff" stroke={IND} strokeWidth="2" /><text x="72.5" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>OUTSIDE FRACTION</text><text x="72.5" y="57" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>1/4 + 1/8 + 1/4</text><motion.text x="72.5" y="88" textAnchor="middle" fontSize="21" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ scale: .6 }} animate={{ scale: 1 }}>= 5/8</motion.text><path d="M21 107h103" stroke="#cbd5e1" /><text x="72.5" y="132" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>TRIANGLE FRACTION</text><text x="72.5" y="159" textAnchor="middle" fontSize="18" fontWeight="900" fill={TEAL} fontFamily={FONT}>1 − 5/8 = 3/8</text></g>}
      {phase === 3 && <g transform="translate(302 59)"><rect width="151" height="181" rx="14" fill={ok ? "#f0fdf4" : "#fef2f2"} stroke={ok ? GREEN : RED} strokeWidth="2" /><text x="75.5" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>TRIANGLE AREA</text><text x="75.5" y="61" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>3/8 × {rectangleArea}</text><motion.text x="75.5" y="101" textAnchor="middle" fontSize="27" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT} initial={{ scale: .5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 190, damping: 15 }}>= {targetArea}</motion.text><path d="M25 120h101" stroke="#cbd5e1" /><text x="75.5" y="146" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>CHECK</text><text x="75.5" y="169" textAnchor="middle" fontSize="11" fontWeight="900" fill={ok ? GREEN : RED}>{ok ? `choice ${choice} matches` : failure}</text></g>}
      <text x="158" y="273" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={phase === 3 ? GREEN : DIM}>{phase === 0 ? "the two midpoint marks are the only needed lengths" : phase === 1 ? "each corner has perpendicular sides" : phase === 2 ? "the green triangle is the rectangle minus these corners" : ok ? "all three corner areas and the stored answer agree" : failure}</text>
      <SvgAnswerBadge show={final && ok} answer={problem.answer} cx={158} y={286} width={78} />
      <AnimatePresence>{final && !ok && <motion.text x="235" y="313" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
