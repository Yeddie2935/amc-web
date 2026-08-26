import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", ORANGE = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

/** Generate two-digit candidates from the last digit, sieve by one modulus, then pack by the final modulus. */
export function DigitModCandidateSieveScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const min = Math.round(num(data.minValue, 0)), max = Math.round(num(data.maxValue, 0));
  const lastDigit = Math.round(num(data.lastDigit, 0)), filterMod = Math.round(num(data.filterModulus, 0));
  const filterRem = Math.round(num(data.filterRemainder, 0)), finalMod = Math.round(num(data.finalModulus, 0));
  const candidates = Array.from({ length: Math.max(0, max - min + 1) }, (_, i) => min + i).filter((value) => value % 10 === lastDigit);
  const winners = candidates.filter((value) => value % filterMod === filterRem);
  const winner = winners[0] ?? 0;
  const quotient = Math.floor(winner / finalMod), remainder = winner % finalMod;
  const choice = (problem.choices ?? []).find((item) => Number(item.text) === remainder)?.label;
  const stored = Number(problem.shortAnswer);
  const ok = winners.length === 1 && remainder === stored && choice === problem.answer;
  const failure = winners.length !== 1 ? `filter produced ${winners.length} candidates` : remainder !== stored ? `computed remainder ${remainder}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 295" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "the mod-10 lock opens only for two-digit numbers ending in 3" : phase === 1 ? "the mod-9 sieve keeps the candidate whose value minus 1 is divisible" : "pack 73 into complete rows of 11; seven blocks remain"}</text>

      {phase <= 1 && <g transform="translate(32 49)">{candidates.map((value, i) => { const kept = value === winner, struck = phase === 1 && !kept, x = (i % 5) * 82, y = Math.floor(i / 5) * 67; return <motion.g key={value} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: struck ? 0.35 : 1, scale: kept && phase === 1 ? 1.08 : 1 }} transition={{ delay: i * 0.07 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x={x} y={y} width="68" height="48" rx="9" fill={kept && phase === 1 ? "#dcfce7" : "#eef2ff"} stroke={kept && phase === 1 ? GREEN : IND} strokeWidth={kept && phase === 1 ? 2 : 1.3} /><text x={x + 34} y={y + 22} textAnchor="middle" fontSize="17" fontWeight="900" fill={kept && phase === 1 ? GREEN : IND} fontFamily={FONT}>{value}</text><text x={x + 34} y={y + 39} textAnchor="middle" fontSize="8" fontWeight="850" fill={phase === 1 ? (kept ? GREEN : RED) : DIM} fontFamily={FONT}>{phase === 0 ? `ends in ${lastDigit}` : kept ? `${value - filterRem} = ${filterMod}×${(value - filterRem) / filterMod}` : `rem ${value % filterMod}`}</text>{struck && <motion.line x1={x + 8} y1={y + 24} x2={x + 60} y2={y + 24} stroke={RED} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}</motion.g>; })}</g>}

      {phase === 0 && <><g transform="translate(163 205)"><rect x="0" y="0" width="134" height="43" rx="10" fill="#f8fafc" stroke="#cbd5e1" /><text x="67" y="17" textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM}>ones digit lock</text><text x="67" y="34" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>N mod 10 = {lastDigit}</text></g><text x="230" y="275" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>{candidates.length} candidates survive the first condition</text></>}

      {phase === 1 && <><motion.path d="M 148 164 C 148 190 190 193 230 207" fill="none" stroke={GREEN} strokeWidth="2.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><g transform="translate(125 207)"><rect x="0" y="0" width="210" height="45" rx="11" fill="#dcfce7" stroke={GREEN} /><text x="105" y="18" textAnchor="middle" fontSize="10" fontWeight="850" fill={GREEN}>unique survivor</text><text x="105" y="36" textAnchor="middle" fontSize="14" fontWeight="900" fill={GREEN} fontFamily={FONT}>{winner} − {filterRem} = {winner - filterRem} = {filterMod} × {(winner - filterRem) / filterMod}</text></g><text x="230" y="278" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>so N = {winner}</text></>}

      {phase === 2 && <><g transform="translate(38 50)">{Array.from({ length: quotient }, (_, row) => <motion.g key={row} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: row * 0.1 }}>{Array.from({ length: finalMod }, (_, col) => <rect key={col} x={col * 16} y={row * 24} width="12" height="12" rx="2" fill="#cbd5e1" stroke="#94a3b8" />)}<text x="192" y={row * 24 + 10} fontSize="9" fontWeight="850" fill={DIM} fontFamily={FONT}>row {row + 1}: {finalMod}</text></motion.g>)}<g transform={`translate(0 ${quotient * 24 + 5})`}>{Array.from({ length: remainder }, (_, col) => <motion.rect key={col} x={col * 16} y="0" width="12" height="12" rx="2" fill={ORANGE} stroke="#f59e0b" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + col * 0.08 }} />)}<text x={remainder * 16 + 8} y="10" fontSize="10" fontWeight="900" fill={ORANGE} fontFamily={FONT}>{remainder} left</text></g></g><g transform="translate(285 65)"><text x="75" y="15" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>division by {finalMod}</text><text x="75" y="48" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>{winner} = {finalMod} × {quotient} + {remainder}</text><text x="75" y="77" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{winner} − {finalMod * quotient} = {remainder}</text><motion.rect x="5" y="96" width="140" height="42" rx="11" fill="#dcfce7" stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="75" y="124" textAnchor="middle" fontSize="17" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>remainder {remainder}</text></g><text x="172" y="282" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? "candidate, sieve, division, and choice verified" : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={257} width={78} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="292" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
