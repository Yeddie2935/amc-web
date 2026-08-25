import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", ORANGE = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";
type Point = { x: number; y: number };

/** Complete a concave polygon to a right triangle, then lift out its triangular notch. */
export function ConcaveTriangleSubtractScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const ab = num(data.AB, 0), bc = num(data.BC, 0), cd = num(data.CD, 0), ad = num(data.AD, 0);
  const bd = Math.sqrt(bc * bc + cd * cd);
  const bigArea = ab * bd / 2, notchArea = bc * cd / 2, result = bigArea - notchArea;
  const bigRight = Math.abs(ab * ab + bd * bd - ad * ad) < 1e-9;
  const stored = Number(problem.shortAnswer);
  const choice = (problem.choices ?? []).find((c) => Number(c.text) === result)?.label;
  const ok = bigRight && Math.abs(bd - 5) < 1e-9 && result === stored && choice === problem.answer;
  const failure = !bigRight ? `${ab}² + ${bd}² does not equal ${ad}²` : result !== stored ? `computed ${result}, stored ${problem.shortAnswer}` : "answer choice does not match";
  const final = step >= totalSteps - 1;
  const phase = final ? 4 : Math.min(step, 3);

  const S = 20;
  const B: Point = { x: 42, y: 226 }, A: Point = { x: 42 + ab * S, y: 226 }, D: Point = { x: 42, y: 226 - bd * S };
  const along = (bc * bc + bd * bd - cd * cd) / (2 * bd);
  const off = Math.sqrt(Math.max(0, bc * bc - along * along));
  const C: Point = { x: B.x + off * S, y: B.y - along * S };
  const pts = (ps: Point[]) => ps.map((p) => `${p.x},${p.y}`).join(" ");
  const Label = ({ p, text, dx, dy }: { p: Point; text: string; dx: number; dy: number }) => <text x={p.x + dx} y={p.y + dy} fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{text}</text>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 290" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "add BD to complete triangle ABD" : phase === 1 ? "the right-angle notch is a 3–4–5 triangle" : phase === 2 ? "5–12–13 proves the large triangle is right" : phase === 3 ? "measure the large triangle and the notch separately" : "lift out the notch: concave area = large − small"}</text>

      {phase >= 2 && <motion.polygon points={pts([A, B, D])} fill={GREEN} fillOpacity={phase === 2 ? 0.16 : 0.28} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />}
      {phase >= 1 && phase < 4 && <motion.polygon points={pts([B, C, D])} fill={ORANGE} fillOpacity="0.46" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />}
      {phase === 4 && <><polygon points={pts([B, C, D])} fill="#fff" /><motion.polygon points={pts([B, C, D])} fill={ORANGE} fillOpacity="0.55" stroke={ORANGE} strokeWidth="2" initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: 154, y: -34, opacity: 0.72 }} transition={{ type: "spring", stiffness: 85, damping: 15, delay: 0.35 }} /></>}

      <path d={`M ${A.x} ${A.y} L ${B.x} ${B.y} L ${C.x} ${C.y} L ${D.x} ${D.y} Z`} fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <motion.line x1={B.x} y1={B.y} x2={D.x} y2={D.y} stroke={IND} strokeWidth="2.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.75 }} />

      <path d={`M ${C.x - 7} ${C.y + 4} L ${C.x - 3} ${C.y + 12} L ${C.x - 11} ${C.y + 17}`} fill="none" stroke={ORANGE} strokeWidth="1.5" />
      {phase >= 2 && <path d={`M ${B.x} ${B.y - 12} L ${B.x + 12} ${B.y - 12} L ${B.x + 12} ${B.y}`} fill="none" stroke={GREEN} strokeWidth="1.6" />}
      <Label p={A} text="A" dx={8} dy={16} /><Label p={B} text="B" dx={-18} dy={16} /><Label p={C} text="C" dx={8} dy={4} /><Label p={D} text="D" dx={-17} dy={-7} />
      <text x={(A.x + B.x) / 2} y={B.y + 20} textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN} fontFamily={FONT}>{ab}</text>
      <text x={(B.x + C.x) / 2 - 10} y={(B.y + C.y) / 2} fontSize="12" fontWeight="900" fill={ORANGE} fontFamily={FONT}>{bc}</text>
      <text x={(C.x + D.x) / 2 + 8} y={(C.y + D.y) / 2 - 3} fontSize="12" fontWeight="900" fill={ORANGE} fontFamily={FONT}>{cd}</text>
      <text x={(A.x + D.x) / 2 + 7} y={(A.y + D.y) / 2 - 5} transform={`rotate(22.62 ${(A.x + D.x) / 2 + 7} ${(A.y + D.y) / 2 - 5})`} fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{ad}</text>
      {phase >= 1 && <text x={B.x - 15} y={(B.y + D.y) / 2 + 4} textAnchor="end" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>BD={bd}</text>}

      <g transform="translate(312 51)">
        {phase === 0 && <><text x="66" y="26" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND}>new diagonal</text><text x="66" y="52" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>[ABCD] =</text><text x="66" y="72" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>[ABD] − [BCD]</text></>}
        {phase === 1 && <><text x="66" y="25" textAnchor="middle" fontSize="13" fontWeight="900" fill={ORANGE} fontFamily={FONT}>{bc}² + {cd}² = BD²</text><text x="66" y="53" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{bc * bc} + {cd * cd} = {bc * bc + cd * cd}</text><motion.text x="66" y="85" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>BD = {bd}</motion.text></>}
        {phase === 2 && <><text x="66" y="25" textAnchor="middle" fontSize="13" fontWeight="900" fill={GREEN} fontFamily={FONT}>{bd}² + {ab}² = {ad}²</text><text x="66" y="53" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{bd * bd} + {ab * ab} = {ad * ad}</text><motion.text x="66" y="85" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>right angle at B</motion.text></>}
        {phase === 3 && <><text x="66" y="25" textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN} fontFamily={FONT}>[ABD] = ½·{ab}·{bd}</text><text x="66" y="48" textAnchor="middle" fontSize="16" fontWeight="900" fill={GREEN} fontFamily={FONT}>= {bigArea}</text><text x="66" y="78" textAnchor="middle" fontSize="12" fontWeight="900" fill={ORANGE} fontFamily={FONT}>[BCD] = ½·{bc}·{cd}</text><text x="66" y="101" textAnchor="middle" fontSize="16" fontWeight="900" fill={ORANGE} fontFamily={FONT}>= {notchArea}</text></>}
        {phase === 4 && <><text x="66" y="25" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>whole − notch</text><text x="66" y="56" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>{bigArea} − {notchArea}</text><motion.rect x="15" y="72" width="102" height="37" rx="10" fill="#dcfce7" stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="66" y="98" textAnchor="middle" fontSize="20" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>= {result}</text></>}
      </g>
      {phase === 3 && <text x="230" y="276" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>{bigArea} square units before removing the {notchArea}-unit notch</text>}
      {phase === 4 && <><text x="174" y="278" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? "both triples, both areas, and choice verified" : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={252} width={78} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="286" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
