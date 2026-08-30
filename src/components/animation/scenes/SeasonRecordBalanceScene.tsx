import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", RED = "#dc2626", AMBER = "#d97706", DIM = "#64748b";

function Ball({ x, y, tone, delay = 0 }: { x: number; y: number; tone: string; delay?: number }) {
  return <motion.g initial={{ opacity: 0, scale: .45 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 230, damping: 16, delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
    <circle cx={x} cy={y} r="12" fill="#fff" stroke={tone} strokeWidth="2" /><path d={`M${x-10} ${y-3}Q${x} ${y+1} ${x+10} ${y-3}M${x-10} ${y+4}Q${x} ${y+8} ${x+10} ${y+4}M${x} ${y-12}Q${x-4} ${y} ${x} ${y+12}M${x} ${y-12}Q${x+4} ${y} ${x} ${y+12}`} fill="none" stroke={tone} strokeWidth="1" />
  </motion.g>;
}

/** Balance a pre-district win/loss deficit against the district record's net swing. */
export function SeasonRecordBalanceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const preWinPercent = num(data.preWinPercent, 0), districtWins = num(data.districtWins, 0), districtLosses = num(data.districtLosses, 0), finalWinPercent = num(data.finalWinPercent, 0);
  const preLossPercent = 100 - preWinPercent;
  const deficitPercent = preLossPercent - preWinPercent;
  const districtSwing = districtWins - districtLosses;
  const preGames = districtSwing / (deficitPercent / 100);
  const districtGames = districtWins + districtLosses;
  const totalGames = preGames + districtGames;
  const preWins = preGames * preWinPercent / 100, preLosses = preGames - preWins;
  const finalWins = preWins + districtWins, finalLosses = preLosses + districtLosses;
  const choice = problem.choices?.find(item => Number(item.text) === totalGames)?.label;
  const ok = preWinPercent === 45 && finalWinPercent === 50 && districtWins === 6 && districtLosses === 2 && deficitPercent === 10 && districtSwing === 4 &&
    Number.isInteger(preGames) && preGames === 40 && finalWins === finalLosses && totalGames === 48 && String(totalGames) === problem.shortAnswer && choice === problem.answer;
  const failure = deficitPercent <= 0 ? `loss lead is ${deficitPercent}%` : districtSwing <= 0 ? `district swing is ${districtSwing}` :
    !Number.isInteger(preGames) ? `pre-district games compute to ${preGames}` : finalWins !== finalLosses ? `final record is ${finalWins}-${finalLosses}` :
    String(totalGames) !== problem.shortAnswer ? `computed ${totalGames}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);
  const barX = 74, barW = 322;
  const winW = barW * preWinPercent / 100;

  return <div style={{ width: "100%", display: "flex", justifyContent: "center", minWidth: 0, padding: "5px 2px", boxSizing: "border-box", overflow: "hidden" }}>
    <svg viewBox="0 0 470 315" width="100%" style={{ maxWidth: 500, display: "block" }} aria-label="The Unicorns' loss lead is balanced by four extra district wins">
      <text x="235" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "before districts, losses lead wins by ten percentage points" : phase === 1 ? "district play gives four more wins than losses" : phase === 2 ? "the four-game swing exactly erases the earlier ten-percent gap" : "add the eight district games to the forty earlier games"}</text>

      {phase === 0 && <>
        <text x={barX} y="54" fontSize="10" fontWeight="900" fill={DIM}>BEFORE DISTRICTS: x games</text>
        <motion.rect x={barX} y="68" width={winW} height="62" rx="10" fill="#dcfce7" stroke={GREEN} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformBox: "fill-box", transformOrigin: "left center" }} />
        <motion.rect x={barX + winW} y="68" width={barW - winW} height="62" rx="10" fill="#fee2e2" stroke={RED} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .25 }} style={{ transformBox: "fill-box", transformOrigin: "left center" }} />
        <text x={barX + winW / 2} y="95" textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN}>WINS</text><text x={barX + winW / 2} y="116" textAnchor="middle" fontSize="20" fontWeight="950" fill={GREEN} fontFamily={FONT}>{preWinPercent}%</text>
        <text x={barX + winW + (barW - winW) / 2} y="95" textAnchor="middle" fontSize="12" fontWeight="900" fill={RED}>LOSSES</text><text x={barX + winW + (barW - winW) / 2} y="116" textAnchor="middle" fontSize="20" fontWeight="950" fill={RED} fontFamily={FONT}>{preLossPercent}%</text>
        <g transform="translate(105 171)"><rect width="260" height="77" rx="14" fill="#fff7ed" stroke={AMBER} strokeWidth="2" /><text x="130" y="24" textAnchor="middle" fontSize="10" fontWeight="900" fill={AMBER}>LOSS LEAD</text><text x="130" y="53" textAnchor="middle" fontSize="20" fontWeight="950" fill={INK} fontFamily={FONT}>{preLossPercent}% − {preWinPercent}% = {deficitPercent}% of x</text><text x="130" y="69" textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM}>this is the gap district play must erase</text></g>
      </>}

      {phase === 1 && <>
        <text x="235" y="49" textAnchor="middle" fontSize="10" fontWeight="900" fill={DIM}>DISTRICT RESULTS</text>
        <g transform="translate(59 70)"><rect width="352" height="83" rx="15" fill="#f8fafc" stroke="#cbd5e1" />{Array.from({ length: districtGames }, (_, i) => { const win = i < districtWins; return <g key={i}><Ball x={29 + i * 42} y={35} tone={win ? GREEN : RED} delay={i * .07} /><text x={29 + i * 42} y="69" textAnchor="middle" fontSize="10" fontWeight="950" fill={win ? GREEN : RED} fontFamily={FONT}>{win ? "W" : "L"}</text></g>; })}</g>
        <g transform="translate(103 181)"><rect width="264" height="76" rx="14" fill="#eef2ff" stroke={IND} strokeWidth="2" /><text x="132" y="24" textAnchor="middle" fontSize="10" fontWeight="900" fill={DIM}>RELATIVE GAIN FOR WINS</text><text x="132" y="55" textAnchor="middle" fontSize="24" fontWeight="950" fill={IND} fontFamily={FONT}>{districtWins} − {districtLosses} = {districtSwing} games</text></g>
      </>}

      {phase === 2 && <>
        <g transform="translate(38 55)"><rect width="175" height="92" rx="14" fill="#fff7ed" stroke={AMBER} strokeWidth="2" /><text x="87.5" y="24" textAnchor="middle" fontSize="9.5" fontWeight="900" fill={AMBER}>EARLIER LOSS LEAD</text><text x="87.5" y="58" textAnchor="middle" fontSize="22" fontWeight="950" fill={INK} fontFamily={FONT}>{deficitPercent}% · x</text><text x="87.5" y="79" textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM}>losses ahead</text></g>
        <text x="235" y="108" textAnchor="middle" fontSize="20" fontWeight="950" fill={IND}>=</text>
        <g transform="translate(257 55)"><rect width="175" height="92" rx="14" fill="#f0fdf4" stroke={GREEN} strokeWidth="2" /><text x="87.5" y="24" textAnchor="middle" fontSize="9.5" fontWeight="900" fill={GREEN}>DISTRICT SWING</text><text x="87.5" y="58" textAnchor="middle" fontSize="22" fontWeight="950" fill={INK} fontFamily={FONT}>{districtWins} − {districtLosses} = {districtSwing}</text><text x="87.5" y="79" textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM}>wins catch up</text></g>
        <g transform="translate(102 181)"><rect width="266" height="82" rx="15" fill="#eef2ff" stroke={IND} strokeWidth="2.4" /><text x="133" y="31" textAnchor="middle" fontSize="18" fontWeight="950" fill={INK} fontFamily={FONT}>0.10x = {districtSwing}</text><text x="133" y="64" textAnchor="middle" fontSize="28" fontWeight="950" fill={IND} fontFamily={FONT}>x = {preGames}</text></g>
      </>}

      {phase === 3 && <>
        <g transform="translate(62 49)"><rect width="346" height="70" rx="14" fill="#f8fafc" stroke="#cbd5e1" /><text x="93" y="24" textAnchor="middle" fontSize="9.5" fontWeight="900" fill={DIM}>BEFORE</text><text x="93" y="52" textAnchor="middle" fontSize="23" fontWeight="950" fill={IND} fontFamily={FONT}>{preGames}</text><text x="173" y="44" textAnchor="middle" fontSize="23" fontWeight="950" fill={INK}>+</text><text x="253" y="24" textAnchor="middle" fontSize="9.5" fontWeight="900" fill={DIM}>DISTRICT</text><text x="253" y="52" textAnchor="middle" fontSize="23" fontWeight="950" fill={GREEN} fontFamily={FONT}>{districtWins} + {districtLosses} = {districtGames}</text></g>
        <g transform="translate(91 151)"><rect width="288" height="105" rx="16" fill={ok ? "#f0fdf4" : "#fef2f2"} stroke={ok ? GREEN : RED} strokeWidth="2.6" /><text x="144" y="29" textAnchor="middle" fontSize="10" fontWeight="900" fill={DIM}>FULL SEASON</text><text x="144" y="66" textAnchor="middle" fontSize="29" fontWeight="950" fill={ok ? GREEN : RED} fontFamily={FONT}>{preGames} + {districtGames} = {totalGames}</text><text x="144" y="89" textAnchor="middle" fontSize="9" fontWeight="850" fill={ok ? GREEN : RED}>{ok ? `check: final record ${finalWins}-${finalLosses}` : failure}</text></g>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={419} y={270} width={78} />
      </>}
    </svg>
  </div>;
}
