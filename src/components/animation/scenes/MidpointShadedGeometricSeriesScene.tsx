import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", AMBER = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";
type P = { x: number; y: number };
const pts = (...ps: P[]) => ps.map((p) => `${p.x},${p.y}`).join(" ");
const tidy = (value: number) => Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)));

/** Repeat midpoint cuts in a right triangle, turning nested shaded triangles into a geometric area series. */
export function MidpointShadedGeometricSeriesScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const legs = (Array.isArray(data.legs) ? data.legs : []).map((value) => num(value, 0));
  const iterations = Math.round(num(data.iterations, 0)), midpoint = num(data.midpointFactor, 0);
  const outerArea = legs[0] * legs[1] / 2;
  const firstArea = outerArea * midpoint * midpoint;
  const ratio = midpoint * midpoint;
  const limit = firstArea / (1 - ratio);
  const finiteSum = firstArea * (1 - Math.pow(ratio, iterations)) / (1 - ratio);
  const remainder = limit - finiteSum;
  const nearest = Math.round(finiteSum);
  const choice = problem.choices?.find((item) => Number(item.text) === nearest)?.label;
  const stored = Number(problem.shortAnswer);
  const ok = legs.length === 2 && legs[0] === 6 && legs[1] === 6 && iterations === 100 && midpoint === .5 && firstArea === 4.5 && ratio === .25 && limit === 6 && remainder < .5 && nearest === stored && choice === problem.answer;
  const failure = legs.length !== 2 ? "need exactly two legs" : firstArea !== 4.5 ? `first area is ${firstArea}` : ratio !== .25 ? `area ratio is ${ratio}` : limit !== 6 ? `limit is ${limit}` : remainder >= .5 ? `remainder ${remainder} is not below 1/2` : nearest !== stored ? `nearest ${nearest}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(Math.max(step, 0), 2);

  const A = { x: 35, y: 250 }, C = { x: 265, y: 250 }, G = { x: 265, y: 20 };
  const levels: { left: P; corner: P; top: P; midBase: P; midSide: P; midHyp: P; shaded: P[] }[] = [];
  let left = A, corner = C, top = G;
  for (let i = 0; i < 5; i++) {
    const midBase = { x: (left.x + corner.x) / 2, y: (left.y + corner.y) / 2 };
    const midSide = { x: (corner.x + top.x) / 2, y: (corner.y + top.y) / 2 };
    const midHyp = { x: (left.x + top.x) / 2, y: (left.y + top.y) / 2 };
    levels.push({ left, corner, top, midBase, midSide, midHyp, shaded: [midBase, corner, midSide] });
    left = midHyp; corner = midSide; top = top;
  }
  const names = [["A", A, -18, 18], ["B", levels[0].midBase, -5, 20], ["C", C, 8, 18], ["D", levels[0].midSide, 8, 5], ["G", G, 8, 16], ["J", levels[0].midHyp, -20, 5]] as const;
  const shownLevels = phase === 0 ? 1 : 4;
  const termAreas = Array.from({ length: 4 }, (_, i) => firstArea * Math.pow(ratio, i));

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 480 330" width="100%" style={{ maxWidth: 510, minWidth: 0, display: "block" }} aria-label="Nested midpoint triangles whose shaded areas form a geometric series">
      <text x="240" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "the first midpoint cut makes a 3 by 3 shaded triangle" : phase === 1 ? "repeat inside JDG: every new triangle is half as long" : phase === 2 ? "read the nested black pieces as an area series" : "100 terms stop invisibly close to the limiting area 6"}</text>

      <polygon points={pts(A, C, G)} fill="#f8fafc" stroke={INK} strokeWidth="2.5" />
      {levels.slice(0, shownLevels).map((level, i) => <g key={i}>
        <motion.line x1={level.midBase.x} y1={level.midBase.y} x2={level.midHyp.x} y2={level.midHyp.y} stroke={i === 0 ? IND : TEAL} strokeWidth={i === 0 ? 2.4 : 1.8} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * .16 }} />
        <motion.line x1={level.midHyp.x} y1={level.midHyp.y} x2={level.midSide.x} y2={level.midSide.y} stroke={i === 0 ? IND : TEAL} strokeWidth={i === 0 ? 2.4 : 1.8} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * .16 + .08 }} />
        <motion.polygon points={pts(...level.shaded)} fill={i === 0 ? INK : i === 1 ? IND : i === 2 ? TEAL : AMBER} fillOpacity={i === 0 ? .96 : .84} stroke="#fff" strokeWidth="1" initial={{ opacity: 0, scale: .55 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * .18, type: "spring", stiffness: 180, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      </g>)}
      {names.map(([name, p, dx, dy]) => <g key={name}><circle cx={p.x} cy={p.y} r="3.3" fill={INK} /><text x={p.x + dx} y={p.y + dy} fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>{name}</text></g>)}

      {phase === 0 && <g><line x1={A.x} y1="266" x2={C.x} y2="266" stroke={AMBER} strokeWidth="2" /><text x="150" y="282" textAnchor="middle" fontSize="12" fontWeight="900" fill={AMBER} fontFamily={FONT}>AC = {legs[0]}</text><line x1="280" y1={C.y} x2="280" y2={G.y} stroke={AMBER} strokeWidth="2" /><text x="288" y="139" fontSize="12" fontWeight="900" fill={AMBER} fontFamily={FONT}>CG = {legs[1]}</text><g transform="translate(319 66)"><rect width="139" height="142" rx="14" fill="#eef2ff" stroke={IND} strokeWidth="2" /><text x="69.5" y="26" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>FIRST SHADED △</text><text x="69.5" y="58" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>BC = CD = 3</text><text x="69.5" y="90" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>½ × 3 × 3</text><motion.text x="69.5" y="126" textAnchor="middle" fontSize="24" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ scale: .5 }} animate={{ scale: 1 }}>= {firstArea}</motion.text></g></g>}

      {phase === 1 && <g transform="translate(316 56)"><rect width="145" height="175" rx="14" fill="#ecfeff" stroke={TEAL} strokeWidth="2" /><text x="72.5" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>MIDPOINT SHRINK</text><text x="72.5" y="54" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>side × {midpoint}</text><text x="72.5" y="82" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>side × {midpoint}</text><path d="M24 97h97" stroke="#cbd5e1" /><text x="72.5" y="120" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>AREA MULTIPLIER</text><motion.text x="72.5" y="151" textAnchor="middle" fontSize="21" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{ scale: .5 }} animate={{ scale: 1 }}>{midpoint}² = {ratio}</motion.text></g>}

      {phase === 2 && <g><g transform="translate(307 47)"><rect width="158" height="197" rx="14" fill="#eef2ff" stroke={IND} strokeWidth="2" /><text x="79" y="24" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>SHADED AREAS</text>{termAreas.slice(0, 3).map((area, i) => <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .15 }}><rect x="18" y={38 + i * 42} width={122 * Math.pow(.78, i)} height="27" rx="7" fill={i === 0 ? INK : i === 1 ? IND : TEAL} /><text x="79" y={57 + i * 42} textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#fff" fontFamily={FONT}>{tidy(area)}</text></motion.g>)}<text x="79" y="172" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>4.5(1 + 1/4 + …)</text><text x="79" y="190" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>{iterations} terms</text></g></g>}

      {phase === 3 && <g transform="translate(302 43)"><rect width="166" height="207" rx="15" fill={ok ? "#f0fdf4" : "#fef2f2"} stroke={ok ? GREEN : RED} strokeWidth="2.4" /><text x="83" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>GEOMETRIC TOTAL</text><text x="83" y="55" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>4.5 ÷ (1 − 1/4)</text><motion.text x="83" y="91" textAnchor="middle" fontSize="27" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT} initial={{ scale: .5 }} animate={{ scale: 1 }}>= {limit}</motion.text><path d="M24 108h118" stroke="#cbd5e1" /><text x="83" y="132" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>100-TERM GAP</text><text x="83" y="158" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>6(1/4)¹⁰⁰ &lt; 1/2</text><text x="83" y="187" textAnchor="middle" fontSize="11" fontWeight="900" fill={ok ? GREEN : RED}>{ok ? `nearest is ${nearest}, choice ${choice}` : failure}</text></g>}

      <text x="158" y={phase === 0 ? 310 : 285} textAnchor="middle" fontSize="9.8" fontWeight="850" fill={phase === 3 ? GREEN : DIM}>{phase === 0 ? "B and D are midpoints, so both shaded legs are 3" : phase === 1 ? "halving both dimensions quarters every area" : phase === 2 ? "each visible piece supplies the next series term" : ok ? "the omitted tail is far below the half-unit rounding boundary" : failure}</text>
      <SvgAnswerBadge show={final && ok} answer={problem.answer} cx={158} y={296} width={78} />
      <AnimatePresence>{final && !ok && <motion.text x="240" y="329" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
