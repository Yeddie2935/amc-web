import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", ORANGE = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

/** Divide two timed journeys into equal one-mile road blocks, then compare one block from each. */
export function TwoPaceMileCompareScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const boyHours = num(data.boyHours, 0), boyExtra = num(data.boyExtraMinutes, 0), boyMiles = Math.round(num(data.boyMiles, 0));
  const currentHours = num(data.currentHours, 0), currentMiles = Math.round(num(data.currentMiles, 0)), perHour = Math.round(num(data.minutesPerHour, 0));
  const boyMinutes = boyHours * perHour + boyExtra;
  const currentMinutes = currentHours * perHour;
  const boyPace = boyMinutes / boyMiles;
  const currentPace = currentMinutes / currentMiles;
  const difference = currentPace - boyPace;
  const choice = (problem.choices ?? []).find((item) => Number(item.text) === difference)?.label;
  const stored = Number(String(problem.shortAnswer ?? "").match(/-?\d+(?:\.\d+)?/)?.[0]);
  const ok = Number.isInteger(boyPace) && Number.isInteger(currentPace) && difference === stored && choice === problem.answer;
  const failure = !Number.isInteger(boyPace) || !Number.isInteger(currentPace) ? `journeys do not split into whole-minute miles` : difference !== stored ? `computed ${difference}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  const Road = ({ y, miles, pace, color, icon, dim = false }: { y: number; miles: number; pace: number; color: string; icon: string; dim?: boolean }) => {
    const x0 = 34, roadW = 250, blockW = roadW / miles;
    return <g opacity={dim ? 0.42 : 1}>
      {Array.from({ length: miles }, (_, i) => <motion.g key={i} initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: i * 0.035 }} style={{ transformBox: "fill-box", transformOrigin: "left center" }}><rect x={x0 + i * blockW} y={y} width={blockW - 1.2} height="24" rx="2.5" fill="#f1f5f9" stroke={color} strokeWidth="1" />{blockW >= 20 && <text x={x0 + i * blockW + blockW / 2} y={y + 39} textAnchor="middle" fontSize="6.7" fontWeight="800" fill={color} fontFamily={FONT}>1 mi</text>}</motion.g>)}
      <motion.text x="0" y="0" fontSize="15" initial={{ x: x0, y: y + 18 }} animate={{ x: x0 + roadW - 8, y: y + 18 }} transition={{ duration: 1.1, ease: "linear" }}>{icon}</motion.text>
      <text x={x0 + roadW / 2} y={y - 7} textAnchor="middle" fontSize="10.5" fontWeight="900" fill={color} fontFamily={FONT}>{miles} equal miles × {pace} min</text>
    </g>;
  };

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 290" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "split the boyhood running time evenly across 15 mile blocks" : phase === 1 ? "split the current walking time evenly across 10 mile blocks" : "align one mile from each trip and measure the extra time"}</text>

      <Road y={phase === 2 ? 67 : 83} miles={boyMiles} pace={boyPace} color={IND} icon="🏃" dim={phase === 1} />
      {phase >= 1 && <Road y={phase === 2 ? 134 : 164} miles={currentMiles} pace={currentPace} color={TEAL} icon="🚶" dim={false} />}

      {phase < 2 && <g transform="translate(310 54)">
        {phase === 0 && <><rect x="0" y="0" width="122" height="105" rx="12" fill="#eef2ff" stroke={IND} /><text x="61" y="21" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>boyhood time</text><text x="61" y="44" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>{boyHours}·{perHour} + {boyExtra} = {boyMinutes}</text><text x="61" y="68" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{boyMinutes} ÷ {boyMiles}</text><motion.text x="61" y="94" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>= {boyPace} min/mi</motion.text></>}
        {phase === 1 && <><rect x="0" y="65" width="122" height="105" rx="12" fill="#ecfeff" stroke={TEAL} /><text x="61" y="87" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>current time</text><text x="61" y="110" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>{currentHours}·{perHour} = {currentMinutes}</text><text x="61" y="134" textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>{currentMinutes} ÷ {currentMiles}</text><motion.text x="61" y="160" textAnchor="middle" fontSize="18" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>= {currentPace} min/mi</motion.text></>}
      </g>}

      {phase === 0 && <text x="230" y="258" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>{boyMinutes} minutes shared by {boyMiles} one-mile blocks</text>}
      {phase === 1 && <text x="230" y="258" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>{currentMinutes} minutes shared by {currentMiles} one-mile blocks</text>}

      {phase === 2 && <><g transform="translate(315 52)"><text x="60" y="14" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>one-mile clocks</text><rect x="7" y="30" width="106" height="34" rx="9" fill="#eef2ff" stroke={IND} /><text x="60" y="52" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>run {boyPace} min</text><rect x="7" y="74" width="106" height="34" rx="9" fill="#ccfbf1" stroke={TEAL} /><text x="60" y="96" textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={FONT}>walk {currentPace} min</text><motion.path d="M 21 126 H 99" stroke={GREEN} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><text x="60" y="151" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>{currentPace} − {boyPace}</text><motion.rect x="10" y="165" width="100" height="42" rx="11" fill="#dcfce7" stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="60" y="193" textAnchor="middle" fontSize="18" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>= {difference} min</text></g><text x="172" y="278" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? "time totals, mile paces, difference, and choice verified" : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={263} width={78} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="286" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
