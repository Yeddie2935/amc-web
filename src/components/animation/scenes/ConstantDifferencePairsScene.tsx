import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", ORANGE = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

/** Wrap a descending alternating series into adjacent differences, then collect their equal results. */
export function ConstantDifferencePairsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const start = Math.round(num(data.start, 0)), end = Math.round(num(data.end, 0)), termStep = Math.round(num(data.termStep, 0));
  const terms: number[] = [];
  for (let value = start; value >= end && terms.length <= 100; value -= termStep) terms.push(value);
  const pairs = Array.from({ length: Math.floor(terms.length / 2) }, (_, i) => [terms[2 * i], terms[2 * i + 1]] as const);
  const pairValues = pairs.map(([a, b]) => a - b);
  const pairValue = pairValues[0] ?? 0;
  const total = pairValues.reduce((sum, value) => sum + value, 0);
  const choice = (problem.choices ?? []).find((item) => Number(item.text) === total)?.label;
  const stored = Number(problem.shortAnswer);
  const ok = terms.length % 2 === 0 && pairValues.every((value) => value === pairValue) && total === stored && choice === problem.answer;
  const failure = terms.length % 2 !== 0 ? `${terms.length} terms leave one unpaired` : !pairValues.every((value) => value === pairValue) ? `pair differences are not constant` : total !== stored ? `computed ${total}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const shown = [pairs[0], pairs[1], null, pairs[pairs.length - 2], pairs[pairs.length - 1]];

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 295" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "wrap each positive term together with the subtraction after it" : phase === 1 ? "every adjacent difference collapses to the same value: 2" : "collect the 25 identical 2-tiles to total 50"}</text>

      {phase <= 1 && <g transform="translate(27 62)">{shown.map((pair, i) => { const x = i * 84; if (!pair) return <text key="dots" x={x + 35} y="32" textAnchor="middle" fontSize="20" fontWeight="900" fill={DIM}>⋯</text>; return <motion.g key={pair[0]} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.12 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x={x} y="0" width="72" height="58" rx="10" fill={phase === 1 ? "#dcfce7" : "#eef2ff"} stroke={phase === 1 ? GREEN : IND} strokeWidth="1.8" />{phase === 0 ? <><text x={x + 36} y="27" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>{pair[0]} − {pair[1]}</text><motion.path d={`M ${x + 9} 39 Q ${x + 36} 53 ${x + 63} 39`} fill="none" stroke={IND} strokeWidth="1.8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /></> : <motion.text x={x + 36} y="37" textAnchor="middle" fontSize="22" fontWeight="900" fill={GREEN} fontFamily={FONT} initial={{ scale: 0.4 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>{pair[0] - pair[1]}</motion.text>}</motion.g>; })}</g>}

      {phase === 0 && <><text x="230" y="151" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>({terms[0]} − {terms[1]}) + ({terms[2]} − {terms[3]}) + ⋯ + ({terms.at(-2)} − {terms.at(-1)})</text><g transform="translate(137 181)"><rect x="0" y="0" width="186" height="48" rx="11" fill="#f8fafc" stroke="#cbd5e1" /><text x="93" y="19" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>all {terms.length} terms are used</text><text x="93" y="39" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{terms.length} ÷ 2 = {pairs.length} pairs</text></g></>}

      {phase === 1 && <><motion.path d="M 55 137 C 80 169 165 161 185 184 M 139 137 C 158 166 183 164 205 184 M 307 137 C 285 166 250 164 245 184 M 391 137 C 365 169 280 161 265 184" fill="none" stroke={GREEN} strokeWidth="1.8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><g transform="translate(96 188)">{Array.from({ length: pairs.length }, (_, i) => <motion.rect key={i} x={(i % 13) * 21} y={Math.floor(i / 13) * 31} width="17" height="24" rx="5" fill="#dcfce7" stroke={GREEN} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.025 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />)}{Array.from({ length: pairs.length }, (_, i) => <text key={`t${i}`} x={(i % 13) * 21 + 8.5} y={Math.floor(i / 13) * 31 + 17} textAnchor="middle" fontSize="9" fontWeight="900" fill={GREEN} fontFamily={FONT}>{pairValue}</text>)}</g><text x="230" y="275" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>{pairs.length} equal pair-results</text></>}

      {phase === 2 && <><g transform="translate(92 52)">{Array.from({ length: pairs.length }, (_, i) => <motion.g key={i} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.035 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x={(i % 5) * 58} y={Math.floor(i / 5) * 37} width="48" height="29" rx="7" fill="#dcfce7" stroke={GREEN} /><text x={(i % 5) * 58 + 24} y={Math.floor(i / 5) * 37 + 20} textAnchor="middle" fontSize="14" fontWeight="900" fill={GREEN} fontFamily={FONT}>{pairValue}</text></motion.g>)}</g><motion.path d="M 81 245 H 379" stroke={IND} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><text x="230" y="265" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>{pairs.length} × {pairValue} = <tspan fill={GREEN}>{total}</tspan></text><text x="172" y="287" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? "term count, pair values, total, and choice verified" : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={263} width={78} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="292" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
