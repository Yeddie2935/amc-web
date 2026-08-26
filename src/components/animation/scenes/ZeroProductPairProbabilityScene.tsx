import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);

/** Draw the complete graph of unordered selections and keep exactly the edges incident to zero. */
export function ZeroProductPairProbabilityScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const values = (Array.isArray(data.values) ? data.values : []).map(Number);
  const pairs: [number, number][] = [];
  for (let i = 0; i < values.length; i++) for (let j = i + 1; j < values.length; j++) pairs.push([i, j]);
  const favorable = pairs.filter(([i, j]) => values[i] * values[j] === 0);
  const divisor = gcd(favorable.length, pairs.length);
  const answer = `${favorable.length / divisor}/${pairs.length / divisor}`;
  const choice = (problem.choices ?? []).find((item) => item.text === answer)?.label;
  const zeroIndex = values.indexOf(0);
  const ok = zeroIndex >= 0 && values.filter((v) => v === 0).length === 1 && favorable.length === values.length - 1 && problem.shortAnswer === answer && choice === problem.answer;
  const failure = zeroIndex < 0 ? "zero is missing" : favorable.length !== values.length - 1 ? `counted ${favorable.length} favorable pairs` : problem.shortAnswer !== answer ? `computed ${answer}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);
  const center = { x: 230, y: 139 }, radius = 91;
  const point = (i: number) => ({ x: center.x + radius * Math.cos(-Math.PI / 2 + i * 2 * Math.PI / values.length), y: center.y + radius * Math.sin(-Math.PI / 2 + i * 2 * Math.PI / values.length) });

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 300" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "zero is the only number that can switch any product to 0" : phase === 1 ? "connect 0 to each different number: every green edge is favorable" : phase === 2 ? "add every remaining edge to reveal the complete sample space" : "compare the five green edges with all fifteen selection edges"}</text>

      {phase === 0 && <><g transform="translate(43 53)">{values.map((value, i) => <motion.g key={value} initial={{ opacity: 0, y: -10 }} animate={{ opacity: value === 0 ? 1 : 0.75, y: 0 }} transition={{ delay: i * 0.08 }}><rect x={i * 65} y="0" width="48" height="50" rx="10" fill={value === 0 ? "#dcfce7" : "#eef2ff"} stroke={value === 0 ? GREEN : IND} strokeWidth={value === 0 ? 2.5 : 1.4} /><text x={i * 65 + 24} y="32" textAnchor="middle" fontSize="18" fontWeight="900" fill={value === 0 ? GREEN : IND} fontFamily={FONT}>{String(value).replace("-", "−")}</text></motion.g>)}</g><motion.path d="M 197 112 V 143" stroke={GREEN} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><g transform="translate(91 150)"><rect width="278" height="66" rx="13" fill="#f0fdf4" stroke={GREEN} /><text x="139" y="23" textAnchor="middle" fontSize="11" fontWeight="850" fill={GREEN}>zero-product rule</text><text x="139" y="49" textAnchor="middle" fontSize="18" fontWeight="900" fill={INK} fontFamily={FONT}>0 × any other number = 0</text></g><text x="230" y="249" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>so every winning pair must contain the single 0</text></>}

      {(phase === 1 || phase === 2) && <>{pairs.map(([i, j], index) => { const a = point(i), b = point(j), fav = values[i] * values[j] === 0, visible = phase === 2 || fav; return visible ? <motion.line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={fav ? GREEN : "#cbd5e1"} strokeWidth={fav ? 3 : 1.3} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: index * 0.035 }} /> : null; })}{values.map((value, i) => { const p = point(i), zero = value === 0; return <motion.g key={value} initial={{ scale: 0.5 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><circle cx={p.x} cy={p.y} r="22" fill={zero ? "#dcfce7" : "#fff"} stroke={zero ? GREEN : IND} strokeWidth={zero ? 2.8 : 1.8} /><text x={p.x} y={p.y + 6} textAnchor="middle" fontSize="15" fontWeight="900" fill={zero ? GREEN : IND} fontFamily={FONT}>{String(value).replace("-", "−")}</text></motion.g>; })}<g transform="translate(125 246)"><rect width="210" height="38" rx="10" fill={phase === 1 ? "#f0fdf4" : "#f8fafc"} stroke={phase === 1 ? GREEN : "#cbd5e1"} /><text x="105" y="16" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={phase === 1 ? GREEN : DIM}>{phase === 1 ? "favorable edges from zero" : "all unordered pairs"}</text><text x="105" y="32" textAnchor="middle" fontSize="14" fontWeight="900" fill={phase === 1 ? GREEN : IND} fontFamily={FONT}>{phase === 1 ? `${favorable.length} winning pairs` : `C(${values.length}, 2) = ${pairs.length}`}</text></g></>}

      {phase === 3 && <><g transform="translate(58 53)"><rect width="344" height="72" rx="14" fill="#f8fafc" stroke="#cbd5e1" /><text x="92" y="23" textAnchor="middle" fontSize="10" fontWeight="850" fill={GREEN}>favorable</text><text x="92" y="53" textAnchor="middle" fontSize="22" fontWeight="900" fill={GREEN} fontFamily={FONT}>{favorable.length}</text><text x="172" y="45" textAnchor="middle" fontSize="20" fontWeight="900" fill={DIM}>out of</text><text x="263" y="23" textAnchor="middle" fontSize="10" fontWeight="850" fill={IND}>all pairs</text><text x="263" y="53" textAnchor="middle" fontSize="22" fontWeight="900" fill={IND} fontFamily={FONT}>{pairs.length}</text></g><g transform="translate(80 151)"><text x="58" y="26" textAnchor="middle" fontSize="22" fontWeight="900" fill={INK} fontFamily={FONT}>{favorable.length}</text><line x1="36" y1="34" x2="80" y2="34" stroke={INK} strokeWidth="2" /><text x="58" y="57" textAnchor="middle" fontSize="22" fontWeight="900" fill={INK} fontFamily={FONT}>{pairs.length}</text><text x="116" y="43" textAnchor="middle" fontSize="20" fontWeight="900" fill={DIM}>=</text><motion.rect x="150" y="0" width="112" height="65" rx="13" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="206" y="43" textAnchor="middle" fontSize="24" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{answer}</text></g><text x="172" y="265" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? `${favorable.length} ÷ ${divisor} over ${pairs.length} ÷ ${divisor}` : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={240} width={78} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="295" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
