import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);
type Point = { x: number; y: number };

/** Connect all boundary-dot pairs, separating unit lattice edges from longer chords. */
export function BoundaryUnitPairGraphScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const side = num(data.squareSide, 0), unit = num(data.unitDistance, 0);
  const points: Point[] = (Array.isArray(data.points) ? data.points : []).map(value => { const [x, y] = String(value).split("|").map(Number); return { x, y }; });
  const pairs: { a: number; b: number; distance: number }[] = [];
  for (let a = 0; a < points.length; a++) for (let b = a + 1; b < points.length; b++) pairs.push({ a, b, distance: Math.hypot(points[a].x - points[b].x, points[a].y - points[b].y) });
  const favorable = pairs.filter(pair => Math.abs(pair.distance - unit) < 1e-9);
  const divisor = gcd(favorable.length, pairs.length) || 1;
  const answer = `${favorable.length / divisor}/${pairs.length / divisor}`;
  const choice = problem.choices?.find(c => c.text === answer)?.label;
  const expected = ["0|0","1|0","2|0","0|1","2|1","0|2","1|2","2|2"];
  const coordinateCheck = points.map(p => `${p.x}|${p.y}`).sort().join(",") === expected.sort().join(",");
  const ok = coordinateCheck && favorable.length === 8 && pairs.length === 28 && answer === problem.shortAnswer && choice === problem.answer;
  const failure = !coordinateCheck ? "point coordinates do not match the source figure" : favorable.length !== 8 ? `found ${favorable.length} unit pairs` : pairs.length !== 28 ? `generated ${pairs.length} total pairs` : answer !== problem.shortAnswer ? `computed ${answer}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const ox = 80, oy = 53, scale = 88, X = (p: Point) => ox + p.x * scale, Y = (p: Point) => oy + p.y * scale;
  const Dot = ({ p, i }: { p: Point; i: number }) => <motion.g initial={{ scale: .4 }} animate={{ scale: 1 }} transition={{ delay: i * .08, type: "spring", stiffness: 230 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><circle cx={X(p)} cy={Y(p)} r="8" fill="#fff" stroke={IND} strokeWidth="3"/><text x={X(p)} y={Y(p) + 3} textAnchor="middle" fontSize="7" fontWeight="900" fill={IND} fontFamily={FONT}>{i + 1}</text></motion.g>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: 500, minWidth: 0, padding: "6px 4px", boxSizing: "border-box", overflow: "hidden" }}><svg viewBox="0 0 460 320" width="100%" style={{ maxWidth: "100%", display: "block" }} aria-label="Eight square-boundary points with unit-distance edges and every unordered pair">
    <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "a one-unit ruler reaches only neighboring boundary dots" : phase === 1 ? "every two-dot choice is one edge of the complete pair graph" : "compare the eight green unit edges with all twenty-eight pairs"}</text>
    {phase < 2 && <g>
      {phase === 1 && pairs.filter(pair => Math.abs(pair.distance - unit) >= 1e-9).map((pair, i) => <motion.line key={`${pair.a}-${pair.b}`} x1={X(points[pair.a])} y1={Y(points[pair.a])} x2={X(points[pair.b])} y2={Y(points[pair.b])} stroke="#cbd5e1" strokeWidth="1.2" strokeOpacity=".65" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * .025 }}/>) }
      <rect x={ox} y={oy} width={side * scale} height={side * scale} fill="#f8fafc" fillOpacity=".65" stroke={INK} strokeWidth="2"/>
      <line x1={ox + scale} y1={oy} x2={ox + scale} y2={oy + side * scale} stroke="#e2e8f0"/><line x1={ox} y1={oy + scale} x2={ox + side * scale} y2={oy + scale} stroke="#e2e8f0"/>
      {favorable.map((pair, i) => <motion.line key={`${pair.a}-${pair.b}`} x1={X(points[pair.a])} y1={Y(points[pair.a])} x2={X(points[pair.b])} y2={Y(points[pair.b])} stroke={GREEN} strokeWidth={phase === 0 ? 7 : 4} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * .09 }}/>) }
      {points.map((p, i) => <Dot key={i} p={p} i={i}/>)}
      {phase === 0 && <g><g><line x1={ox + 4} y1="38" x2={ox + scale - 4} y2="38" stroke={IND} strokeWidth="2"/><line x1={ox + 4} y1="33" x2={ox + 4} y2="43" stroke={IND} strokeWidth="2"/><line x1={ox + scale - 4} y1="33" x2={ox + scale - 4} y2="43" stroke={IND} strokeWidth="2"/><text x={ox + scale / 2} y="32" textAnchor="middle" fontSize="9.5" fontWeight="900" fill={IND} fontFamily={FONT}>1 unit</text></g><g transform="translate(298 67)"><rect width="132" height="132" rx="14" fill="#f0fdf4" stroke={GREEN}/><text x="66" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>UNIT-PAIR WALK</text><text x="66" y="57" textAnchor="middle" fontSize="14" fontWeight="900" fill={GREEN} fontFamily={FONT}>2 per side</text><text x="66" y="84" textAnchor="middle" fontSize="14" fontWeight="900" fill={GREEN} fontFamily={FONT}>4 sides</text><path d="M24 98h84" stroke="#bbf7d0"/><text x="66" y="120" textAnchor="middle" fontSize="19" fontWeight="950" fill={GREEN} fontFamily={FONT}>= {favorable.length} pairs</text></g></g>}
      {phase === 1 && <g transform="translate(299 67)"><rect width="131" height="141" rx="14" fill="#eef2ff" stroke={IND}/><text x="65.5" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>ALL PAIRS</text><text x="65.5" y="56" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>8 choices</text><text x="65.5" y="83" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>C(8,2)</text><motion.text x="65.5" y="119" textAnchor="middle" fontSize="23" fontWeight="950" fill={IND} fontFamily={FONT} initial={{ scale: .55 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>= {pairs.length}</motion.text></g>}
      <text x="180" y="272" textAnchor="middle" fontSize="10" fontWeight="850" fill={phase === 0 ? GREEN : DIM}>{phase === 0 ? "the missing center prevents any extra unit segment" : `${pairs.length - favorable.length} gray chords are longer than one unit`}</text>
    </g>}
    {phase === 2 && <g>
      <g transform="translate(50 55)"><rect width="360" height="77" rx="14" fill="#f8fafc" stroke="#cbd5e1"/><text x="91" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={GREEN}>FAVORABLE</text><text x="91" y="56" textAnchor="middle" fontSize="25" fontWeight="950" fill={GREEN} fontFamily={FONT}>{favorable.length}</text><text x="180" y="48" textAnchor="middle" fontSize="16" fontWeight="900" fill={DIM}>out of</text><text x="269" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={IND}>ALL PAIRS</text><text x="269" y="56" textAnchor="middle" fontSize="25" fontWeight="950" fill={IND} fontFamily={FONT}>{pairs.length}</text></g>
      <g transform="translate(87 161)"><text x="38" y="25" textAnchor="middle" fontSize="21" fontWeight="900" fill={GREEN} fontFamily={FONT}>{favorable.length}</text><line x1="17" y1="33" x2="59" y2="33" stroke={INK} strokeWidth="2"/><text x="38" y="58" textAnchor="middle" fontSize="21" fontWeight="900" fill={IND} fontFamily={FONT}>{pairs.length}</text><text x="91" y="44" textAnchor="middle" fontSize="20" fontWeight="900" fill={DIM}>=</text><motion.rect x="126" width="135" height="66" rx="13" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: .6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}/><text x="193.5" y="43" textAnchor="middle" fontSize="25" fontWeight="950" fill={ok ? GREEN : RED} fontFamily={FONT}>{answer}</text></g>
      <text x="180" y="276" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={ok ? GREEN : RED}>{ok ? `${favorable.length} ÷ ${divisor} over ${pairs.length} ÷ ${divisor}` : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={404} y={253} width={78}/>
    </g>}
  </svg></div>;
}
