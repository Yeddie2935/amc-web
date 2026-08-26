import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", ANNIE = "#4338ca", BONNIE = "#0d9488", GREEN = "#16a34a", AMBER = "#f59e0b", RED = "#dc2626", DIM = "#64748b";
const cx = 230, cy = 122, rx = 152, ry = 72;
const point = (turns: number) => { const angle = -Math.PI / 2 + turns * Math.PI * 2; return { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) }; };

function Runner({ color, label }: { color: string; label: string }) {
  return <g><circle r="10" fill={color} stroke="#fff" strokeWidth="2" /><text y="4" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff">{label}</text></g>;
}

/** Let a faster runner's quarter-lap gains accumulate around the real oval until the pass. */
export function LapGainPassScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const trackMeters = num(data.trackMeters, 0), percentFaster = num(data.percentFaster, 0);
  const ratio = 1 + percentFaster / 100;
  const gain = ratio - 1;
  const bonnieLaps = 1 / gain;
  const annieLaps = ratio * bonnieLaps;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d.]/g, ""));
  const choice = problem.choices?.find(c => Number(String(c.text).replace(/[^\d.]/g, "")) === annieLaps)?.label;
  const ok = Number.isInteger(bonnieLaps) && stored === annieLaps && choice === problem.answer;
  const failure = !Number.isInteger(bonnieLaps) ? `one lap is not a whole number of ${gain}-lap gains` : stored !== annieLaps ? `computed ${annieLaps}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const annieTurns = phase === 0 ? ratio : phase === 1 ? ratio : phase === 2 ? annieLaps : annieLaps;
  const bonnieTurns = phase < 2 ? 1 : bonnieLaps;
  const ap = point(annieTurns), bp = point(bonnieTurns);
  const quarterPath = "M230 50 A152 72 0 0 1 382 122 A152 72 0 0 1 230 194 A152 72 0 0 1 78 122 A152 72 0 0 1 230 50";

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 300" width="100%" style={{ width: "100%", maxWidth: "100%", minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "in the time Bonnie runs 1 lap, Annie runs 1¼" : phase === 1 ? "that extra quarter-lap is Annie's gain each round" : phase === 2 ? "four quarter-gains close one whole loop" : "at the first pass, Annie is exactly one lap ahead"}</text>
      <ellipse cx={cx} cy={cy} rx={rx + 10} ry={ry + 10} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="10" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" stroke={INK} strokeWidth="2" />
      {[0,.25,.5,.75].map((t, i) => { const p = point(t); return <g key={t}><line x1={p.x} y1={p.y - 8} x2={p.x} y2={p.y + 8} stroke={i === 0 ? GREEN : "#94a3b8"} strokeWidth={i === 0 ? 3 : 1.5} /><text x={p.x + (i === 1 ? 12 : i === 3 ? -12 : 0)} y={p.y + (i === 0 ? -13 : i === 2 ? 18 : 4)} textAnchor="middle" fontSize="9" fontWeight="800" fill={DIM}>{i === 0 ? "START" : `${i}/4`}</text></g>; })}
      {(phase === 1 || phase === 2) && <motion.path d={quarterPath} fill="none" stroke={AMBER} strokeWidth="8" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: phase === 1 ? .25 : 1 }} transition={{ duration: 1.2 }} />}
      <motion.g key={`b-${phase}`} initial={{ x: point(0).x, y: point(0).y }} animate={{ x: bp.x - (phase >= 2 ? 13 : 0), y: bp.y }} transition={{ duration: 1.2 }}><Runner color={BONNIE} label="B" /></motion.g>
      <motion.g key={`a-${phase}`} initial={{ x: point(0).x, y: point(0).y }} animate={{ x: ap.x + (phase >= 2 ? 13 : 0), y: ap.y }} transition={{ duration: 1.5 }}><Runner color={ANNIE} label="A" /></motion.g>
      {phase < 2 && <g><rect x="113" y="214" width="234" height="42" rx="11" fill="#eef2ff" stroke="#c7d2fe" /><text x="230" y="232" textAnchor="middle" fontSize="11" fontWeight="850" fill={BONNIE} fontFamily={FONT}>Bonnie: 1 lap</text><text x="230" y="249" textAnchor="middle" fontSize="11" fontWeight="900" fill={ANNIE} fontFamily={FONT}>Annie: 1 + {gain} = {ratio} laps</text></g>}
      {phase === 2 && <><g transform="translate(94 215)">{Array.from({ length: Math.round(bonnieLaps) }, (_, i) => <motion.g key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * .13 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><path d={`M${i*70+14} 0 A14 14 0 1 1 ${i*70+13.9} 0`} fill="#fef3c7" stroke={AMBER} strokeWidth="3" /><text x={i*70+14} y="5" textAnchor="middle" fontSize="11" fontWeight="900" fill="#92400e">¼</text>{i < 3 && <text x={i*70+49} y="6" textAnchor="middle" fontSize="15" fill={INK}>+</text>}</motion.g>)}</g><text x="230" y="266" textAnchor="middle" fontSize="16" fontWeight="900" fill={ANNIE} fontFamily={FONT}>1 ÷ {gain} = {bonnieLaps} Bonnie laps</text></>}
      <AnimatePresence>{final && <motion.g initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x="93" y="210" width="274" height="48" rx="12" fill="#dcfce7" stroke={ok ? GREEN : RED} strokeWidth="2" /><text x="230" y="231" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK} fontFamily={FONT}>Bonnie {bonnieLaps} laps · Annie {ratio} × {bonnieLaps}</text><text x="230" y="250" textAnchor="middle" fontSize="17" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>Annie = {annieLaps} laps</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={266} width={84} /></motion.g>}</AnimatePresence>
      {final && !ok && <text x="230" y="294" textAnchor="middle" fill={RED} fontSize="10">{failure}</text>}
      <text x="32" y="291" fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={FONT}>{trackMeters} m per lap</text>
    </svg>
  </div>;
}
