import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", ORANGE = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";
const COLORS = [IND, TEAL, ORANGE];

/** Build the total demanded by an average, load known scores, and expose the remaining gap. */
export function MissingScoreTotalGapScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const count = Math.round(num(data.studentCount, 0));
  const average = num(data.average, 0);
  const known = (Array.isArray(data.knownScores) ? data.knownScores : []).map((value) => num(value, 0));
  const required = count * average;
  const knownTotal = known.reduce((sum, value) => sum + value, 0);
  const missing = required - knownTotal;
  const choice = (problem.choices ?? []).find((item) => Number(item.text) === missing)?.label;
  const stored = Number(problem.shortAnswer);
  const ok = known.length === count - 1 && missing >= 0 && missing === stored && choice === problem.answer;
  const failure = known.length !== count - 1 ? `need ${count - 1} known scores, received ${known.length}` : missing !== stored ? `computed ${missing}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const barWidth = 310;
  const knownWidth = required > 0 ? barWidth * knownTotal / required : 0;
  const gapWidth = barWidth - knownWidth;

  const Paper = ({ x, value, index }: { x: number; value: number | null; index: number }) => <motion.g initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 170, damping: 15, delay: index * 0.12 }}>
    <rect x={x} y="50" width="78" height="70" rx="9" fill={value == null ? "#f8fafc" : `${COLORS[index % 3]}12`} stroke={value == null ? "#94a3b8" : COLORS[index % 3]} strokeWidth="1.7" strokeDasharray={value == null ? "4 3" : undefined} />
    <path d={`M ${x + 13} 68 H ${x + 65} M ${x + 13} 78 H ${x + 55}`} stroke="#cbd5e1" strokeWidth="2" />
    <text x={x + 39} y="105" textAnchor="middle" fontSize="19" fontWeight="900" fill={value == null ? DIM : COLORS[index % 3]} fontFamily={FONT}>{value == null ? "?" : value}</text>
  </motion.g>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 285" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "four average-sized shares of 70 set the required class total" : phase === 1 ? "the three known exam papers contribute 240 points" : "the uncovered part of the 280-point tray is the missing score"}</text>

      {phase === 0 && <><g transform="translate(42 50)">{Array.from({ length: count }, (_, i) => <motion.g key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.13 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x={i * 94} y="0" width="82" height="68" rx="10" fill="#eef2ff" stroke={IND} /><circle cx={i * 94 + 41} cy="17" r="7" fill="#c7d2fe" /><path d={`M ${i * 94 + 28} 35 Q ${i * 94 + 41} 24 ${i * 94 + 54} 35`} fill="none" stroke={IND} strokeWidth="2" /><text x={i * 94 + 41} y="57" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>{average}</text></motion.g>)}</g><motion.path d="M 82 135 V 151 H 378 V 135" fill="none" stroke={IND} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><text x="230" y="174" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>{count} × {average} = {required}</text><text x="230" y="200" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>the average fixes the total before the missing score is known</text></>}

      {phase >= 1 && <><g>{known.map((value, i) => <Paper key={i} x={42 + i * 94} value={value} index={i} />)}<Paper x={42 + known.length * 94} value={null} index={known.length} /></g><text x="183" y="140" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{known.join(" + ")} = {knownTotal}</text></>}

      {phase === 1 && <><motion.path d="M 82 154 C 82 174 130 178 155 190 M 176 154 C 176 174 185 178 205 190 M 270 154 C 270 174 250 178 255 190" fill="none" stroke={TEAL} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><rect x="75" y="196" width="310" height="38" rx="10" fill="#f1f5f9" stroke="#cbd5e1" /><motion.rect x="75" y="196" width={knownWidth} height="38" rx="10" fill="#ccfbf1" stroke={TEAL} initial={{ width: 0 }} animate={{ width: knownWidth }} /><text x={75 + knownWidth / 2} y="221" textAnchor="middle" fontSize="15" fontWeight="900" fill={TEAL} fontFamily={FONT}>{knownTotal} known</text><text x="230" y="259" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>{required} required points in all</text></>}

      {phase === 2 && <><g transform="translate(75 166)"><rect x="0" y="0" width={barWidth} height="43" rx="11" fill="#f1f5f9" stroke="#cbd5e1" /><motion.rect x="0" y="0" width={knownWidth} height="43" rx="11" fill="#ccfbf1" stroke={TEAL} initial={{ width: 0 }} animate={{ width: knownWidth }} /><motion.rect x={knownWidth} y="0" width={gapWidth} height="43" rx="9" fill="#dcfce7" stroke={GREEN} strokeWidth="2" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x={knownWidth / 2} y="27" textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={FONT}>{knownTotal}</text><text x={knownWidth + gapWidth / 2} y="27" textAnchor="middle" fontSize="14" fontWeight="900" fill={GREEN} fontFamily={FONT}>{missing}</text></g><text x="230" y="232" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>{required} − {knownTotal} = <tspan fill={GREEN}>{missing}</tspan></text><text x="172" y="270" textAnchor="middle" fontSize="9.3" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? "required total, known total, gap, and choice verified" : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={247} width={78} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="281" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
