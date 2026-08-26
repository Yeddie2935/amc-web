import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", GIRL = "#7c3aed", BOY = "#0d9488", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);

/** Select fractional shares from equal student rosters, then merge only the trip students. */
export function EqualGroupsTripFractionScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const groupSize = Math.round(num(data.groupSize, 0));
  const girlsNum = Math.round(num(data.girlsNumerator, 0)), girlsDen = Math.round(num(data.girlsDenominator, 1));
  const boysNum = Math.round(num(data.boysNumerator, 0)), boysDen = Math.round(num(data.boysDenominator, 1));
  const girlsTrip = groupSize * girlsNum / girlsDen, boysTrip = groupSize * boysNum / boysDen;
  const totalTrip = girlsTrip + boysTrip;
  const divisor = gcd(girlsTrip, totalTrip);
  const answer = `${girlsTrip / divisor}/${totalTrip / divisor}`;
  const choice = (problem.choices ?? []).find((item) => item.text === answer)?.label;
  const ok = Number.isInteger(girlsTrip) && Number.isInteger(boysTrip) && problem.shortAnswer === answer && choice === problem.answer;
  const failure = !Number.isInteger(girlsTrip) || !Number.isInteger(boysTrip) ? "fractional student count" : problem.shortAnswer !== answer ? `computed ${answer}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);

  const Student = ({ x, y, color, selected, delay }: { x: number; y: number; color: string; selected: boolean; delay: number }) => <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: selected ? 1 : 0.25, y: 0 }} transition={{ delay }}><circle cx={x} cy={y - 5} r="5" fill={selected ? color : "#cbd5e1"} /><path d={`M ${x - 7} ${y + 13} Q ${x} ${y - 1} ${x + 7} ${y + 13} Z`} fill={selected ? color : "#cbd5e1"} /></motion.g>;
  const Roster = ({ x, color, selected, label }: { x: number; color: string; selected: number; label: string }) => <g><text x={x + 78} y="43" textAnchor="middle" fontSize="12" fontWeight="900" fill={color}>{label}</text><rect x={x} y="53" width="156" height="102" rx="13" fill={`${color}0d`} stroke={color} strokeWidth="1.6" />{Array.from({ length: groupSize }, (_, i) => <Student key={i} x={x + 22 + (i % 4) * 37} y={75 + Math.floor(i / 4) * 31} color={color} selected={selected === groupSize || (color === GIRL ? i % 4 < girlsNum : Math.floor(i / 4) < boysNum)} delay={i * 0.035} />)}<text x={x + 78} y="174" textAnchor="middle" fontSize="11" fontWeight="900" fill={selected === groupSize ? DIM : color} fontFamily={FONT}>{selected === groupSize ? `${groupSize} students` : `${selected} of ${groupSize} going`}</text></g>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 300" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "use 12 in each equal group so fourths and thirds are whole students" : phase === 1 ? "send three of the four equal girl columns on the trip" : phase === 2 ? "send two of the three equal boy rows, then combine both groups" : "inside the trip group, count girls over all trip students"}</text>

      {phase <= 2 && <><Roster x={55} color={GIRL} selected={phase === 0 ? groupSize : girlsTrip} label="GIRLS" /><Roster x={249} color={BOY} selected={phase < 2 ? groupSize : boysTrip} label="BOYS" />{phase === 0 && <g transform="translate(114 210)"><rect width="232" height="44" rx="11" fill="#f8fafc" stroke="#cbd5e1" /><text x="116" y="18" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>common whole-number model</text><text x="116" y="36" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>LCM({girlsDen}, {boysDen}) = {groupSize}</text></g>}{phase === 1 && <><motion.path d="M 133 186 V 211" stroke={GIRL} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><g transform="translate(69 216)"><rect width="128" height="42" rx="11" fill="#f5f3ff" stroke={GIRL} /><text x="64" y="17" textAnchor="middle" fontSize="10" fontWeight="850" fill={GIRL}>{girlsNum}/{girlsDen} of {groupSize}</text><text x="64" y="35" textAnchor="middle" fontSize="15" fontWeight="900" fill={GIRL} fontFamily={FONT}>= {girlsTrip} girls</text></g><text x="346" y="235" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>boys counted next</text></>}{phase === 2 && <><motion.path d="M 133 187 C 133 211 181 216 218 227 M 327 187 C 327 211 279 216 242 227" fill="none" stroke="#64748b" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><g transform="translate(136 225)"><rect width="188" height="46" rx="12" fill="#ecfdf5" stroke={GREEN} strokeWidth="2" /><text x="94" y="18" textAnchor="middle" fontSize="10" fontWeight="850" fill={GREEN}>trip group</text><text x="94" y="38" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>{girlsTrip} + {boysTrip} = {totalTrip}</text></g></>}</>}

      {phase === 3 && <><g transform="translate(40 46)"><rect x="0" y="0" width="380" height="125" rx="15" fill="#f8fafc" stroke="#cbd5e1" /><text x="190" y="21" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>THE {totalTrip} STUDENTS ON THE TRIP</text>{Array.from({ length: totalTrip }, (_, i) => { const color = i < girlsTrip ? GIRL : BOY; return <motion.g key={i} initial={{ opacity: 0, x: i < girlsTrip ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.035 }}><Student x={22 + (i % 9) * 42} y={51 + Math.floor(i / 9) * 39} color={color} selected delay={0} /></motion.g>; })}</g><g transform="translate(118 190)"><text x="61" y="18" textAnchor="middle" fontSize="11" fontWeight="850" fill={GIRL}>{girlsTrip} girls</text><text x="61" y="43" textAnchor="middle" fontSize="21" fontWeight="900" fill={GIRL} fontFamily={FONT}>{girlsTrip}</text><line x1="34" y1="50" x2="88" y2="50" stroke={INK} strokeWidth="2" /><text x="61" y="70" textAnchor="middle" fontSize="21" fontWeight="900" fill={INK} fontFamily={FONT}>{totalTrip}</text><text x="140" y="50" textAnchor="middle" fontSize="19" fontWeight="900" fill={DIM}>→</text><rect x="170" y="14" width="104" height="58" rx="12" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" /><text x="222" y="51" textAnchor="middle" fontSize="22" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{answer}</text></g><text x="168" y="287" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? `${girlsTrip} girls + ${boysTrip} boys = ${totalTrip} trip students` : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={263} width={78} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="298" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
