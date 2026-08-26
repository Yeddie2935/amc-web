import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

/** Turn frequency bars into ordered people-dots and walk the cumulative count to the median position. */
export function CumulativeMedianStacksScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const lengths = (Array.isArray(data.lengths) ? data.lengths : []).map((value) => num(value, 0));
  const frequencies = (Array.isArray(data.frequencies) ? data.frequencies : []).map((value) => Math.round(num(value, 0)));
  const total = frequencies.reduce((sum, value) => sum + value, 0);
  const medianPosition = (total + 1) / 2;
  let running = 0, medianIndex = -1;
  for (let i = 0; i < frequencies.length && medianIndex < 0; i += 1) { running += frequencies[i]; if (running >= medianPosition) medianIndex = i; }
  const median = lengths[medianIndex];
  const beforeMedianGroup = frequencies.slice(0, medianIndex).reduce((sum, value) => sum + value, 0);
  const withinGroup = medianPosition - beforeMedianGroup;
  const choice = (problem.choices ?? []).find((item) => Number(item.text) === median)?.label;
  const stored = Number(problem.shortAnswer);
  const ok = Number.isInteger(medianPosition) && median === stored && choice === problem.answer;
  const failure = !Number.isInteger(medianPosition) ? `${total} values do not have one middle position` : median !== stored ? `computed median ${median}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  const flat = lengths.flatMap((length, i) => Array.from({ length: frequencies[i] }, (_, j) => ({ length, group: i, level: j })));
  const cx = (group: number) => 72 + group * 66;
  const cy = (level: number) => 222 - level * 22;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 295" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "an odd list of 19 names has one middle position: number 10" : phase === 1 ? "count upward through each length stack in sorted order" : "the 10th person is the third dot in the length-4 stack"}</text>

      {phase === 0 && <><g transform="translate(43 55)">{flat.map((_, i) => { const target = i + 1 === medianPosition, x = (i % 10) * 38, y = Math.floor(i / 10) * 45; return <motion.g key={i} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: target ? 1.18 : 1 }} transition={{ delay: i * 0.045 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><circle cx={x} cy={y} r="12" fill={target ? "#dcfce7" : "#eef2ff"} stroke={target ? GREEN : IND} strokeWidth={target ? 2.3 : 1.2} /><text x={x} y={y + 3.5} textAnchor="middle" fontSize="8" fontWeight="900" fill={target ? GREEN : IND} fontFamily={FONT}>{i + 1}</text></motion.g>; })}</g><g transform="translate(128 174)"><rect x="0" y="0" width="204" height="48" rx="11" fill="#f8fafc" stroke="#cbd5e1" /><text x="102" y="19" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>middle position</text><text x="102" y="39" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>({total} + 1) ÷ 2 = {medianPosition}</text></g></>}

      {phase >= 1 && <><line x1="43" y1="234" x2="401" y2="234" stroke={INK} strokeWidth="1.7" /><text x="222" y="270" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>name length</text>{lengths.map((length, i) => <g key={length}><text x={cx(i)} y="251" textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>{length}</text><text x={cx(i)} y={cy(frequencies[i] - 1) - 12} textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM} fontFamily={FONT}>{frequencies[i]}</text></g>)}{flat.map((item, i) => { const order = i + 1, counted = order <= medianPosition, target = order === medianPosition; return <motion.g key={i} initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.055 }}><circle cx={cx(item.group)} cy={cy(item.level)} r="9" fill={target && phase === 2 ? GREEN : counted ? (item.group === medianIndex ? TEAL : IND) : "#e2e8f0"} stroke={target && phase === 2 ? "#15803d" : counted ? "#fff" : "#cbd5e1"} strokeWidth={target && phase === 2 ? 2.2 : 1} /><text x={cx(item.group)} y={cy(item.level) + 3} textAnchor="middle" fontSize="6.7" fontWeight="900" fill={counted ? "#fff" : DIM} fontFamily={FONT}>{order}</text></motion.g>; })}</>}

      {phase === 1 && <g transform="translate(292 61)"><rect x="0" y="0" width="132" height="62" rx="10" fill="#ecfeff" stroke={TEAL} /><text x="66" y="20" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>cumulative count</text><text x="66" y="43" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{frequencies[0]} + {withinGroup} = {medianPosition}</text><text x="66" y="56" textAnchor="middle" fontSize="8.5" fontWeight="850" fill={TEAL}>stop in length {median}</text></g>}

      {phase === 2 && <><motion.path d={`M ${cx(medianIndex)} ${cy(withinGroup - 1) - 34} V ${cy(withinGroup - 1) - 13}`} stroke={GREEN} strokeWidth="2.5" markerEnd="url(#median-arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><defs><marker id="median-arrow" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill={GREEN} /></marker></defs><g transform="translate(300 63)"><text x="62" y="15" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>10th ordered value</text><text x="62" y="45" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>positions 8–10</text><text x="62" y="68" textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={FONT}>all have length {median}</text><motion.rect x="13" y="84" width="98" height="40" rx="11" fill="#dcfce7" stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="62" y="111" textAnchor="middle" fontSize="18" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>median {median}</text></g><text x="172" y="285" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? "total, middle position, landing, and choice verified" : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={260} width={78} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="292" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
