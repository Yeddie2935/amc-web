import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);

/** Form the ordered outcome grid from two chip boxes and light every cell whose product is even. */
export function OutcomeProductGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const values = (Array.isArray(data.values) ? data.values : []).map(Number);
  const outcomes = values.flatMap(a => values.map(b => ({ a, b, product: a * b })));
  const favorable = outcomes.filter(o => o.product % 2 === 0);
  const divisor = gcd(favorable.length, outcomes.length) || 1;
  const answer = `${favorable.length / divisor}/${outcomes.length / divisor}`;
  const choice = problem.choices?.find(c => c.text === answer)?.label;
  const ok = outcomes.length > 0 && favorable.length === 5 && answer === problem.shortAnswer && choice === problem.answer;
  const failure = outcomes.length === 0 ? "no outcomes were generated" : answer !== problem.shortAnswer ? `computed ${answer}; stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}; stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  const cell = 60, gx = 124, gy = 65;
  const chip = (x: number, y: number, value: number, active: boolean) => <g><circle cx={x} cy={y} r="18" fill={active ? "#ccfbf1" : "#eef2ff"} stroke={active ? TEAL : IND} strokeWidth="2" /><text x={x} y={y + 6} textAnchor="middle" fontSize="17" fontWeight="900" fill={active ? TEAL : IND} fontFamily={FONT}>{value}</text></g>;
  const title = phase === 0 ? "one chip from each box makes 3 × 3 ordered outcomes" : phase === 1 ? "an even product needs at least one chip numbered 2" : `${favorable.length} favorable cells out of ${outcomes.length} equally likely cells`;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 440 310" width="100%" style={{ maxWidth: 470, minWidth: 0, display: "block" }}>
      <text x="220" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{title}</text>

      <g transform="translate(28 46)"><rect width="65" height="176" rx="13" fill="#f8fafc" stroke="#cbd5e1" /><text x="32.5" y="20" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>BOX A</text>{values.map((v,i)=><motion.g key={`a${v}`} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: phase === 0 ? 0 : 45.5 }} transition={{ delay: i * .1 }}>{chip(32.5, 49 + i * 60, v, v % 2 === 0 && phase >= 1)}</motion.g>)}</g>
      <g transform="translate(115 29)"><text x="90" y="13" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>BOX B → COLUMNS</text>{values.map((v,i)=><motion.g key={`b${v}`} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 + i * .1 }}>{chip(30 + i * cell, 31, v, v % 2 === 0 && phase >= 1)}</motion.g>)}</g>

      {values.map((a,r) => values.map((b,c) => {
        const product = a * b, even = product % 2 === 0, x = gx + c * cell, y = gy + r * cell;
        return <motion.g key={`${a}-${b}`} initial={{ opacity: 0, scale: .6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .35 + (r * values.length + c) * .06 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x={x} y={y} width={cell - 5} height={cell - 5} rx="10" fill={phase >= 1 && even ? "#dcfce7" : "#f8fafc"} stroke={phase >= 1 && even ? GREEN : "#cbd5e1"} strokeWidth={phase >= 1 && even ? 2.4 : 1.4} />
          <text x={x + 27.5} y={y + 23} textAnchor="middle" fontSize="9" fontWeight="800" fill={DIM} fontFamily={FONT}>{a} × {b}</text>
          <text x={x + 27.5} y={y + 43} textAnchor="middle" fontSize="17" fontWeight="900" fill={phase >= 1 && even ? GREEN : IND} fontFamily={FONT}>= {product}</text>
        </motion.g>;
      }))}

      {phase === 0 && <g transform="translate(115 256)"><rect width="200" height="38" rx="10" fill="#eef2ff" stroke={IND} /><text x="100" y="24" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>{values.length} × {values.length} = {outcomes.length} outcomes</text></g>}
      {phase === 1 && <g transform="translate(100 256)"><rect width="230" height="38" rx="10" fill="#dcfce7" stroke={GREEN} /><text x="115" y="16" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={GREEN}>green cross: row 2 or column 2</text><text x="115" y="31" textAnchor="middle" fontSize="14" fontWeight="900" fill={GREEN} fontFamily={FONT}>{favorable.length} even products</text></g>}
      {phase === 2 && <>
        <g transform="translate(92 251)"><text x="30" y="18" textAnchor="middle" fontSize="18" fontWeight="900" fill={GREEN} fontFamily={FONT}>{favorable.length}</text><line x1="14" y1="25" x2="46" y2="25" stroke={INK} strokeWidth="2" /><text x="30" y="44" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>{outcomes.length}</text><text x="70" y="31" fontSize="18" fontWeight="900" fill={DIM}>=</text><motion.rect x="96" y="0" width="102" height="48" rx="11" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: .6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="147" y="32" textAnchor="middle" fontSize="22" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{answer}</text></g>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={374} y={263} width={78} />
      </>}
      <AnimatePresence>{final && !ok && <motion.text x="220" y="307" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
