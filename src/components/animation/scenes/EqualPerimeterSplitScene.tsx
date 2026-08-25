import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", ORANGE = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";
type Point = { x: number; y: number };

const fractionValue = (text: string) => {
  const [a, b] = text.split("/").map(Number);
  return Number.isFinite(b) && b !== 0 ? a / b : Number(text);
};

/** Equal perimeters locate a point on a side; the same split then gives an area ratio. */
export function EqualPerimeterSplitScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const legs = Array.isArray(data.legs) ? data.legs.map((v) => num(v, 0)) : [3, 4];
  const ac = legs[0] ?? 0, ab = legs[1] ?? 0, bc = num(data.hypotenuse, 0);
  const cd = (bc + ab - ac) / 2, bd = bc - cd;
  const wholeArea = ac * ab / 2, targetArea = wholeArea * bd / bc;
  const stored = fractionValue(String(problem.shortAnswer ?? ""));
  const choice = (problem.choices ?? []).find((c) => Math.abs(fractionValue(c.text) - targetArea) < 1e-9)?.label;
  const ok = [ac, ab, bc, cd, bd].every((v) => v > 0) && Math.abs(ac * ac + ab * ab - bc * bc) < 1e-9 && Math.abs((ac + cd) - (ab + bd)) < 1e-9 && Math.abs(targetArea - stored) < 1e-9 && choice === problem.answer;
  const failure = Math.abs(ac * ac + ab * ab - bc * bc) >= 1e-9 ? "side lengths are not a right triangle" : Math.abs((ac + cd) - (ab + bd)) >= 1e-9 ? "perimeters do not match" : `computed ${targetArea}, stored ${problem.shortAnswer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 4 : Math.min(step, 3);

  const A: Point = { x: 48, y: 232 }, C: Point = { x: 48, y: 52 }, B: Point = { x: 288, y: 232 };
  const split = cd / bc;
  const D: Point = { x: C.x + (B.x - C.x) * split, y: C.y + (B.y - C.y) * split };
  const footT = ((A.x - C.x) * (B.x - C.x) + (A.y - C.y) * (B.y - C.y)) / ((B.x - C.x) ** 2 + (B.y - C.y) ** 2);
  const H: Point = { x: C.x + (B.x - C.x) * footT, y: C.y + (B.y - C.y) * footT };
  const pts = (ps: Point[]) => ps.map((p) => `${p.x},${p.y}`).join(" ");
  const label = (p: Point, text: string, dx: number, dy: number) => <text x={p.x + dx} y={p.y + dy} fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{text}</text>;

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "min(100%, calc(100vw - 48px))", maxWidth: 490, minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 310" width="100%" style={{ maxWidth: 490, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "trace the two perimeters around the shared cut" : phase === 1 ? "AD appears on both sides — cancel it" : phase === 2 ? "use the sum and difference to place D" : phase === 3 ? "both pieces use the same altitude to BC" : "the 2-unit base gets 2/5 of the whole area"}</text>

      {phase >= 3 && <><motion.polygon points={pts([A, D, B])} fill={GREEN} fillOpacity="0.28" initial={{ opacity: 0 }} animate={{ opacity: 1 }} /><polygon points={pts([A, C, D])} fill={ORANGE} fillOpacity="0.16" /></>}
      <path d={`M ${A.x} ${A.y} L ${C.x} ${C.y} L ${B.x} ${B.y} Z`} fill="none" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <motion.line x1={A.x} y1={A.y} x2={D.x} y2={D.y} stroke={IND} strokeWidth="2.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />

      {phase === 0 && <><motion.path d={`M ${A.x} ${A.y} L ${C.x} ${C.y} L ${D.x} ${D.y} L ${A.x} ${A.y}`} fill="none" stroke={ORANGE} strokeWidth="5" strokeOpacity="0.55" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} /><motion.path d={`M ${A.x} ${A.y} L ${B.x} ${B.y} L ${D.x} ${D.y} L ${A.x} ${A.y}`} fill="none" stroke={TEAL} strokeWidth="5" strokeOpacity="0.55" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.35 }} /></>}
      {phase >= 3 && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}><line x1={A.x} y1={A.y} x2={H.x} y2={H.y} stroke={IND} strokeWidth="1.8" strokeDasharray="5 4" /><path d={`M ${H.x - 5} ${H.y + 6} L ${H.x + 1} ${H.y + 11} L ${H.x + 7} ${H.y + 4}`} fill="none" stroke={IND} strokeWidth="1.4" /><text x={H.x - 29} y={H.y + 17} fontSize="10" fontWeight="850" fill={IND}>same h</text></motion.g>}

      {label(A, "A", -18, 18)}{label(B, "B", 8, 16)}{label(C, "C", -17, -8)}{label(D, "D", 8, -5)}
      <text x="34" y="145" textAnchor="end" fontSize="13" fontWeight="900" fill={ORANGE} fontFamily={FONT}>{ac}</text>
      <text x="168" y="251" textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={FONT}>{ab}</text>
      <text x="185" y="126" transform="rotate(36.87 185 126)" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{bc}</text>
      {phase >= 2 && <><text x={(C.x + D.x) / 2 - 9} y={(C.y + D.y) / 2 - 8} fontSize="12" fontWeight="900" fill={ORANGE} fontFamily={FONT}>CD={cd}</text><text x={(D.x + B.x) / 2 + 3} y={(D.y + B.y) / 2 - 7} fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>BD={bd}</text></>}

      <g transform="translate(315 48)">
        {phase === 0 && <><text x="62" y="25" textAnchor="middle" fontSize="12" fontWeight="900" fill={ORANGE} fontFamily={FONT}>{ac} + CD + AD</text><text x="62" y="55" textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>{ab} + BD + AD</text><text x="62" y="85" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND}>= equal</text></>}
        {phase === 1 && <><text x="62" y="25" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>{ac} + CD + <tspan fill={DIM} textDecoration="line-through">AD</tspan></text><text x="62" y="52" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>{ab} + BD + <tspan fill={DIM} textDecoration="line-through">AD</tspan></text><motion.text x="62" y="87" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>CD − BD = {ab - ac}</motion.text></>}
        {phase === 2 && <><text x="62" y="25" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>CD + BD = {bc}</text><text x="62" y="52" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>CD − BD = {ab - ac}</text><line x1="10" y1="63" x2="114" y2="63" stroke={DIM} /><motion.text x="62" y="91" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>CD={cd}, BD={bd}</motion.text></>}
        {phase === 3 && <><text x="62" y="28" textAnchor="middle" fontSize="12" fontWeight="900" fill={ORANGE} fontFamily={FONT}>[ACD] ∝ CD={cd}</text><text x="62" y="58" textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN} fontFamily={FONT}>[ABD] ∝ BD={bd}</text><text x="62" y="91" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>[ABD]/[ABC] = {bd}/{bc}</text></>}
        {phase === 4 && <><text x="62" y="25" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>[ABC] = ½·{ac}·{ab} = {wholeArea}</text><text x="62" y="58" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>[ABD] = {bd}/{bc} · {wholeArea}</text><motion.rect x="5" y="76" width="114" height="36" rx="10" fill="#dcfce7" stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="62" y="100" textAnchor="middle" fontSize="17" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>= {problem.shortAnswer}</text></>}
      </g>
      {phase >= 3 && <text x="168" y="279" textAnchor="middle" fontSize="11" fontWeight="850" fill={phase === 4 ? GREEN : IND} fontFamily={FONT}>{phase === 3 ? `${cd}:${bd} bases → ${cd}:${bd} areas` : `${bd}/${bc} of ${wholeArea} = ${problem.shortAnswer}`}</text>}
      {phase === 4 && <><text x="170" y="302" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? "perimeters, area ratio, and choice all verified" : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={390} y={270} width={78} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="302" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
