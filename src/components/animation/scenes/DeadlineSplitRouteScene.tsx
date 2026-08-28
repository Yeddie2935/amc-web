import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", ORANGE = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Compare a normal route clock with a slower first segment and solve the remaining segment's speed. */
export function DeadlineSplitRouteScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const distance = num(data.distanceMiles, 0), normalSpeed = num(data.normalSpeedMph, 0);
  const firstDistance = num(data.firstDistanceMiles, 0), firstSpeed = num(data.firstSpeedMph, 0);
  const minutesPerHour = Math.round(num(data.minutesPerHour, 60));
  const remainingDistance = distance - firstDistance;
  const normalMinutes = distance / normalSpeed * minutesPerHour;
  const firstMinutes = firstDistance / firstSpeed * minutesPerHour;
  const remainingMinutes = normalMinutes - firstMinutes;
  const neededSpeed = remainingDistance / (remainingMinutes / minutesPerHour);
  const choice = (problem.choices ?? []).find((item) => Number(item.text) === neededSpeed)?.label;
  const integral = [normalMinutes, firstMinutes, remainingMinutes, neededSpeed].every(Number.isInteger);
  const ok = integral && String(neededSpeed) === problem.shortAnswer && choice === problem.answer;
  const failure = !integral ? "route times or speed are not whole numbers" : String(neededSpeed) !== problem.shortAnswer ? `computed ${neededSpeed}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1, phase = final ? 3 : Math.min(step, 2);
  const x0 = 58, roadW = 344, mid = x0 + roadW * firstDistance / distance;
  const clockX = 92, clockW = 276, minuteW = clockW / normalMinutes;

  const House = () => <g transform="translate(27 45)"><path d="M0 18 L16 4 L32 18 V42 H0 Z" fill="#fef3c7" stroke={INK} strokeWidth="1.8"/><path d="M-2 19 L16 1 L34 19" fill="none" stroke={RED} strokeWidth="3"/><rect x="12" y="28" width="8" height="14" fill="#fff" stroke={INK}/><text x="16" y="56" textAnchor="middle" fontSize="8.5" fontWeight="900" fill={DIM}>HOME</text></g>;
  const School = () => <g transform="translate(402 45)"><rect x="0" y="12" width="32" height="31" fill="#dbeafe" stroke={INK} strokeWidth="1.8"/><path d="M-3 13 L16 1 L35 13" fill="#93c5fd" stroke={INK} strokeWidth="1.8"/><rect x="12" y="28" width="8" height="15" fill="#fff" stroke={INK}/><text x="16" y="56" textAnchor="middle" fontSize="8.5" fontWeight="900" fill={DIM}>SCHOOL</text></g>;
  const Runner = ({ x, y, color }: { x:number; y:number; color:string }) => <g transform={`translate(${x} ${y})`}><circle cy="-10" r="4.5" fill={color}/><path d="M0 -5 V7 M0 0 L-8 5 M0 0 L8 3 M0 7 L-8 17 M0 7 L9 14" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round"/></g>;

  return <div style={{ display:"flex", justifyContent:"center", width:"100%", maxWidth:480, minWidth:0, padding:"6px 4px", boxSizing:"border-box", overflow:"hidden" }}><svg viewBox="0 0 460 310" width="100%" style={{flex:"1 1 0",maxWidth:"100%",minWidth:0,display:"block"}}>
    <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"the usual one-mile trip sets a 20-minute deadline":phase===1?"today's slower first half-mile uses 15 of those minutes":phase===2?"subtract on the same clock to expose the five-minute slot":"fit the last half-mile exactly into the five minutes left"}</text>
    <House/><School/>
    <line x1={x0} y1="79" x2={x0+roadW} y2="79" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round"/><line x1={mid} y1="70" x2={mid} y2="89" stroke={INK} strokeWidth="2"/><text x={(x0+mid)/2} y="104" textAnchor="middle" fontSize="10" fontWeight="900" fill={phase>=1?ORANGE:DIM} fontFamily={FONT}>{firstDistance} mile</text><text x={(mid+x0+roadW)/2} y="104" textAnchor="middle" fontSize="10" fontWeight="900" fill={phase===3?GREEN:DIM} fontFamily={FONT}>{remainingDistance} mile</text>
    {phase===0?<motion.g initial={{x:x0}} animate={{x:x0+roadW}} transition={{duration:1.5,ease:"linear"}}><Runner x={0} y={70} color={IND}/></motion.g>:<><motion.g initial={{x:x0}} animate={{x:mid}} transition={{duration:1.2,ease:"linear"}}><Runner x={0} y={70} color={ORANGE}/></motion.g>{phase===3&&<motion.g initial={{x:mid}} animate={{x:x0+roadW}} transition={{duration:.55,ease:"linear",delay:.25}}><Runner x={0} y={70} color={GREEN}/></motion.g>}</>}

    <g transform={`translate(${clockX} 132)`}><text x={clockW/2} y="0" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>minutes from leaving home</text><line x1="0" y1="28" x2={clockW} y2="28" stroke={INK} strokeWidth="2"/>{Array.from({length:normalMinutes+1},(_,i)=><g key={i}><line x1={i*minuteW} y1="22" x2={i*minuteW} y2="34" stroke={i%5===0?INK:"#cbd5e1"}/>{i%5===0&&<text x={i*minuteW} y="48" textAnchor="middle" fontSize="9" fontWeight="900" fill={INK} fontFamily={FONT}>{i}</text>}</g>)}
      {phase===0&&<motion.rect x="0" y="12" width={clockW} height="14" rx="5" fill="#c7d2fe" initial={{scaleX:0}} animate={{scaleX:1}} style={{transformBox:"fill-box",transformOrigin:"left center"}}/>}
      {phase>=1&&<motion.rect x="0" y="12" width={firstMinutes*minuteW} height="14" rx="5" fill="#fed7aa" initial={{scaleX:0}} animate={{scaleX:1}} style={{transformBox:"fill-box",transformOrigin:"left center"}}/>}
      {phase>=2&&<motion.rect x={firstMinutes*minuteW} y="12" width={remainingMinutes*minuteW} height="14" rx="5" fill="#bbf7d0" initial={{scaleX:0}} animate={{scaleX:1}} style={{transformBox:"fill-box",transformOrigin:"left center"}}/>}
      <path d={`M ${clockW} 7 V 34`} stroke={RED} strokeWidth="3"/><text x={clockW} y="-8" textAnchor="middle" fontSize="9" fontWeight="900" fill={RED}>BELL</text>
    </g>

    {phase===0&&<g transform="translate(116 213)"><rect width="228" height="54" rx="12" fill="#eef2ff" stroke={IND}/><text x="114" y="21" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>normal trip</text><text x="114" y="43" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{distance} mi ÷ {normalSpeed} mph = {normalMinutes} min</text></g>}
    {phase===1&&<g transform="translate(106 213)"><rect width="248" height="54" rx="12" fill="#fff7ed" stroke={ORANGE}/><text x="124" y="21" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>slow first half</text><text x="124" y="43" textAnchor="middle" fontSize="14" fontWeight="900" fill={ORANGE} fontFamily={FONT}>{firstDistance} mi ÷ {firstSpeed} mph = {firstMinutes} min</text></g>}
    {phase===2&&<g transform="translate(123 213)"><rect width="214" height="58" rx="12" fill="#f0fdf4" stroke={GREEN}/><text x="107" y="22" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>time still available</text><text x="107" y="47" textAnchor="middle" fontSize="19" fontWeight="900" fill={GREEN} fontFamily={FONT}>{normalMinutes} − {firstMinutes} = {remainingMinutes} min</text></g>}
    {phase===3&&<><g transform="translate(106 211)"><rect width="248" height="66" rx="13" fill={ok?"#dcfce7":"#fee2e2"} stroke={ok?GREEN:RED} strokeWidth="2"/><text x="124" y="23" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>distance ÷ time</text><text x="124" y="49" textAnchor="middle" fontSize="18" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT}>{remainingDistance} ÷ ({remainingMinutes}/{minutesPerHour}) = {neededSpeed} mph</text></g><text x="172" y="298" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={ok?GREEN:RED} fontFamily={FONT}>{ok?`${firstMinutes} + ${remainingMinutes} = ${normalMinutes} minutes — exactly on time`:failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={282} width={78}/></>}
    <AnimatePresence>{final&&!ok&&<motion.text x="230" y="307" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
  </svg></div>;
}
