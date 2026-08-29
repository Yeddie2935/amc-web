import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GOLD = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";
type P = { x: number; y: number };
const pts = (...ps: P[]) => ps.map((p) => `${p.x},${p.y}`).join(" ");

/** Rotate a shaded right triangle into an equal triangular gap, completing one square. */
export function TriangleSwapAreaScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const squareCount = Math.round(num(data.squareCount, 0));
  const side = num(data.sideLength, 0);
  const midpointFraction = num(data.midpointFraction, 0);
  const shadedArea = side * side;
  const totalArea = squareCount * side * side;
  const ratioNum = shadedArea, ratioDen = totalArea;
  const expected = `${ratioNum}/${ratioDen}` === "1/3" ? "1/3" : `${ratioNum}/${ratioDen}`;
  const choice = (problem.choices ?? []).find((c) => c.text === expected)?.label;
  const ok = problem.shortAnswer === expected && choice === problem.answer;
  const failure = problem.shortAnswer !== expected ? `computed ${expected}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(Math.max(step, 0), 2);

  const s = 105, E = { x: 48, y: 142 }, F = { x: 48, y: 247 }, G = { x: 153, y: 247 }, H = { x: 153, y: 142 }, I = { x: 258, y: 142 }, J = { x: 258, y: 247 };
  const D = { x: E.x + midpointFraction * s, y: E.y }, C = { x: H.x + midpointFraction * s, y: H.y }, A = { x: D.x, y: D.y - s }, B = { x: C.x, y: C.y - s };
  const K = { x: (A.x + J.x) / 2, y: (A.y + J.y) / 2 };
  const leg = (K.x - D.x) / s, triangleArea = leg / 2;
  const legText = leg === 0.75 ? "3/4" : String(leg);
  const triangleAreaText = triangleArea === 0.375 ? "3/8" : String(triangleArea);
  const label = (name: string, p: P, dx: number, dy: number) => <text x={p.x + dx} y={p.y + dy} fontSize="11" fontWeight="900" fontStyle="italic" fill={INK}>{name}</text>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 410 335" width="100%" style={{ maxWidth: 455, minWidth: 0, display: "block" }}>
      <text x="205" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
        {phase === 0 ? "three equal squares; C and D are midpoints" : phase === 1 ? "AJ crosses the shared edge halfway from A to J" : phase === 2 ? "turn the lower shaded triangle 180° around K" : "the shaded pieces reassemble into one square"}
      </text>

      {phase === 3 && <motion.rect x={A.x} y={A.y} width={s} height={s} fill="#dcfce7" initial={{ opacity: 0 }} animate={{ opacity: .9 }} />}
      {phase >= 1 && phase < 3 && <polygon points={pts(A, J, I, C, B)} fill={phase >= 2 ? "#a5b4fc" : "#e0e7ff"} opacity=".8" />}
      {[{ x: E.x, y: E.y }, { x: H.x, y: H.y }, { x: A.x, y: A.y }].map((q, i) => <motion.rect key={i} x={q.x} y={q.y} width={s} height={s} fill="none" stroke={INK} strokeWidth="2.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * .14 }} />)}
      {phase >= 1 && <motion.line x1={A.x} y1={A.y} x2={J.x} y2={J.y} stroke={IND} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
      {phase >= 1 && <><circle cx={K.x} cy={K.y} r="4" fill={GOLD} /><text x={K.x + 7} y={K.y - 7} fontSize="11" fontWeight="900" fill={GOLD}>K</text></>}

      {phase === 0 && <g stroke={GOLD} strokeWidth="2"><line x1={D.x - 13} y1={D.y - 5} x2={D.x - 13} y2={D.y + 5} /><line x1={D.x + 13} y1={D.y - 5} x2={D.x + 13} y2={D.y + 5} /><line x1={C.x - 13} y1={C.y - 5} x2={C.x - 13} y2={C.y + 5} /><line x1={C.x + 13} y1={C.y - 5} x2={C.x + 13} y2={C.y + 5} /></g>}
      {phase === 1 && <g>
        <line x1={D.x} y1={151} x2={K.x} y2={151} stroke={GOLD} strokeWidth="2" /><line x1={K.x} y1={151} x2={I.x} y2={151} stroke={GOLD} strokeWidth="2" />
        <text x={(D.x + K.x) / 2} y="165" textAnchor="middle" fontSize="10" fontWeight="900" fill={GOLD} fontFamily={FONT}>3/4</text><text x={(K.x + I.x) / 2} y="165" textAnchor="middle" fontSize="10" fontWeight="900" fill={GOLD} fontFamily={FONT}>3/4</text>
        <text x="340" y="79" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>halfway vertically</text><text x="340" y="97" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>K = midpoint of AJ</text>
      </g>}
      {phase === 2 && <g>
        <polygon points={pts(A, D, K)} fill="#fff" stroke={GOLD} strokeWidth="2" strokeDasharray="5 3" />
        <polygon points={pts(K, I, J)} fill="#c7d2fe" stroke={IND} strokeWidth="2" />
        <motion.path d={`M ${K.x + 48} ${K.y + 48} Q ${K.x + 70} ${K.y - 54} ${K.x - 38} ${K.y - 42}`} fill="none" stroke={GREEN} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .8 }} />
        <motion.polygon points={pts(A, D, K)} fill="#86efac" stroke={GREEN} strokeWidth="2.5" initial={{ opacity: 0, scale: .55 }} animate={{ opacity: .85, scale: 1 }} transition={{ type: "spring", stiffness: 180, damping: 17, delay: .45 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        <text x={K.x + 50} y={K.y - 49} fontSize="15" fontWeight="900" fill={GREEN}>↶</text>
      </g>}
      {phase === 3 && <motion.path d={`M ${A.x} ${A.y} H ${B.x} V ${C.y} H ${D.x} Z`} fill="none" stroke={GREEN} strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}

      {label("A", A, -17, -7)}{label("B", B, 7, -7)}{label("C", C, 7, 4)}{label("D", D, -17, 4)}{label("E", E, -17, 4)}{label("F", F, -17, 16)}{label("G", G, -5, 17)}{label("H", H, -6, -8)}{label("I", I, 8, 4)}{label("J", J, 8, 16)}

      {phase === 0 && <g transform="translate(91 277)"><rect width="228" height="39" rx="11" fill="#eef2ff" stroke={IND} /><text x="114" y="25" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>{squareCount} × {side}² = {totalArea} total area</text></g>}
      {phase === 1 && <text x="205" y="299" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>AD = IJ = 1,  DK = KI = {legText}</text>}
      {phase === 2 && <g transform="translate(88 275)"><rect width="234" height="44" rx="11" fill="#fff7ed" stroke={GOLD} /><text x="117" y="18" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>both right triangles</text><text x="117" y="36" textAnchor="middle" fontSize="14" fontWeight="900" fill={GOLD} fontFamily={FONT}>½ × 1 × {legText} = {triangleAreaText}</text></g>}
      {phase === 3 && <g transform="translate(66 270)"><rect width="278" height="46" rx="12" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" /><text x="139" y="18" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>one shaded square ÷ three squares</text><text x="139" y="38" textAnchor="middle" fontSize="17" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{shadedArea} ÷ {totalArea} = {expected}</text></g>}
      <SvgAnswerBadge show={final && ok} answer={problem.answer ?? null} cx={205} y={310} width={78} />
      <AnimatePresence>{final && !ok && <motion.text x="205" y="332" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
