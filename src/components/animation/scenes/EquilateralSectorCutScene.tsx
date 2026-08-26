import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", ORANGE = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";
type Point = { x: number; y: number };

/** Reveal the enclosing equilateral triangle, then peel off its two 60° corner sectors. */
export function EquilateralSectorCutScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const segment = num(data.segmentLength, 0);
  const radius = num(data.arcRadius, 0);
  const angle = num(data.centralAngle, 0);
  const outerSide = segment + radius;
  const triangleRadicalCoefficient = outerSide * outerSide / 4;
  const sectorPiCoefficient = angle * radius * radius / 360;
  const removedPiNumerator = Math.round(2 * sectorPiCoefficient * 3);
  const result = `${triangleRadicalCoefficient}√3 − ${removedPiNumerator}π/3`;
  const normalized = (value: string) => value.replace(/[−–—]/g, "-").replace(/\s/g, "");
  const choice = (problem.choices ?? []).find((item) => normalized(item.text) === normalized(result))?.label;
  const geometricCheck = segment === radius && angle === 60 && outerSide === 4;
  const ok = geometricCheck && normalized(result) === normalized(problem.shortAnswer ?? "") && choice === problem.answer;
  const failure = !geometricCheck ? `need equal 2-unit halves and a 60° sector` : `computed ${result}, stored ${problem.shortAnswer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);

  const U: Point = { x: 132, y: 38 };
  const L: Point = { x: 42, y: 194 };
  const V: Point = { x: 222, y: 194 };
  const S: Point = { x: 87, y: 116 };
  const T: Point = { x: 177, y: 116 };
  const R: Point = { x: 132, y: 194 };
  const regionPath = `M ${U.x} ${U.y} L ${S.x} ${S.y} A 90 90 0 0 1 ${R.x} ${R.y} A 90 90 0 0 1 ${T.x} ${T.y} Z`;
  const leftSector = `M ${L.x} ${L.y} L ${S.x} ${S.y} A 90 90 0 0 1 ${R.x} ${R.y} Z`;
  const rightSector = `M ${V.x} ${V.y} L ${R.x} ${R.y} A 90 90 0 0 1 ${T.x} ${T.y} Z`;
  const label = (p: Point, text: string, dx: number, dy: number) => <text x={p.x + dx} y={p.y + dy} fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{text}</text>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 300" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "extend the two 2-unit sides to reveal an equilateral triangle" : phase === 1 ? "the completed side-4 equilateral triangle has area 4√3" : phase === 2 ? "each missing corner is a radius-2, 60° sector" : "peel off both equal sectors from the whole triangle"}</text>

      <motion.polygon points={`${U.x},${U.y} ${L.x},${L.y} ${V.x},${V.y}`} fill="#eef2ff" fillOpacity={phase === 0 ? 0.42 : 0.7} stroke={IND} strokeWidth="2.2" strokeLinejoin="round" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      {phase >= 2 && <><motion.path d={leftSector} fill={ORANGE} fillOpacity="0.48" stroke={ORANGE} strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} /><motion.path d={rightSector} fill={ORANGE} fillOpacity="0.48" stroke={ORANGE} strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }} /></>}
      <path d={regionPath} fill={phase === 3 ? "#dcfce7" : "#fff"} fillOpacity={phase === 3 ? 0.95 : 1} stroke={INK} strokeWidth="2.7" strokeLinejoin="round" />
      {phase === 0 && <><motion.line x1={S.x} y1={S.y} x2={L.x} y2={L.y} stroke={IND} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><motion.line x1={T.x} y1={T.y} x2={V.x} y2={V.y} stroke={IND} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.18 }} /><motion.line x1={L.x} y1={L.y} x2={V.x} y2={V.y} stroke={IND} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.36 }} /></>}
      {phase === 3 && <><motion.path d={leftSector} fill={ORANGE} fillOpacity="0.55" stroke={ORANGE} initial={{ x: 0, y: 0 }} animate={{ x: -22, y: 18, opacity: 0.28 }} transition={{ delay: 0.2 }} /><motion.path d={rightSector} fill={ORANGE} fillOpacity="0.55" stroke={ORANGE} initial={{ x: 0, y: 0 }} animate={{ x: 22, y: 18, opacity: 0.28 }} transition={{ delay: 0.35 }} /></>}

      {label(U, "U", -5, -8)}{label(S, "S", -19, 2)}{label(T, "T", 9, 2)}{label(R, "R", -5, 19)}
      <text x="105" y="81" textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>{segment}</text><text x="159" y="81" textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>{segment}</text>
      {phase === 0 && <><text x="61" y="154" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>{radius}</text><text x="203" y="154" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>{radius}</text><text x="132" y="230" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>side = {segment} + {radius} = {outerSide}</text></>}
      {phase >= 2 && <><path d="M 55 187 A 15 15 0 0 1 49 174" fill="none" stroke={ORANGE} strokeWidth="1.7" /><path d="M 209 174 A 15 15 0 0 1 203 187" fill="none" stroke={ORANGE} strokeWidth="1.7" /><text x="59" y="180" fontSize="8.5" fontWeight="900" fill={ORANGE}>60°</text><text x="187" y="180" fontSize="8.5" fontWeight="900" fill={ORANGE}>60°</text></>}

      <g transform="translate(266 48)">
        {phase === 0 && <><text x="82" y="22" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND}>three equal sides</text><text x="82" y="48" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{outerSide}, {outerSide}, {outerSide}</text><text x="82" y="77" textAnchor="middle" fontSize="12" fontWeight="850" fill={DIM}>hidden whole found</text></>}
        {phase === 1 && <><text x="82" y="20" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>equilateral triangle</text><text x="82" y="48" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>√3/4 · {outerSide}²</text><motion.text x="82" y="82" textAnchor="middle" fontSize="21" fontWeight="900" fill={GREEN} fontFamily={FONT} initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>= {triangleRadicalCoefficient}√3</motion.text></>}
        {phase === 2 && <><text x="82" y="18" textAnchor="middle" fontSize="11" fontWeight="850" fill={ORANGE}>one corner sector</text><text x="82" y="47" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>{angle}/360 · π · {radius}²</text><text x="82" y="78" textAnchor="middle" fontSize="19" fontWeight="900" fill={ORANGE} fontFamily={FONT}>= 2π/3</text><text x="82" y="108" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>there are two</text></>}
        {phase === 3 && <><text x="82" y="18" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>whole − two corners</text><text x="82" y="48" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>{triangleRadicalCoefficient}√3 − 2(2π/3)</text><motion.rect x="3" y="68" width="158" height="42" rx="11" fill="#dcfce7" stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="82" y="96" textAnchor="middle" fontSize="17" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{result}</text></>}
      </g>
      {phase === 3 && <><text x="176" y="282" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? "side lengths, sector angles, expression, and choice verified" : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={258} width={78} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="294" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
