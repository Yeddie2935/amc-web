import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", ORANGE = "#d97706", RED = "#dc2626", DIM = "#64748b";

/** Run two travelers down the same route, then measure the interval between arrival flags. */
export function SharedRouteArrivalGapScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const distance = num(data.distanceMiles, 0);
  const speeds = (Array.isArray(data.speedsMph) ? data.speedsMph : []).map(v => num(v, 0));
  const names = (Array.isArray(data.names) ? data.names : []).map(String);
  const times = speeds.map(v => distance / v * 60), gap = Math.abs(times[1] - times[0]);
  const fast = times[0] <= times[1] ? 0 : 1, slow = 1-fast;
  const choice = problem.choices?.find(c => Number(c.text) === gap)?.label;
  const stored = parseFloat(String(problem.shortAnswer ?? ""));
  const ok = times.every(Number.isInteger) && gap === stored && choice === problem.answer;
  const failure = !times.every(Number.isInteger) ? `arrival times are ${times.join(", ")}` : `computed ${gap}; stored ${problem.shortAnswer}`;
  const final = step >= totalSteps - 1, phase = final ? 2 : Math.min(step, 1);
  const roadX = 68, roadW = 324, maxTime = Math.max(...times), tickW = 300 / maxTime;
  const title = phase === 0 ? `${names[fast]} rides the one-mile road in ${times[fast]} minutes` : phase === 1 ? `${names[slow]} walks the same road in ${times[slow]} minutes` : `count the minutes between the two arrival flags`;

  const House = () => <g transform="translate(34 67)"><path d="M0 20 L18 5 L36 20 V45 H0 Z" fill="#fef3c7" stroke={INK} strokeWidth="2"/><path d="M-3 21 L18 1 L39 21" fill="none" stroke={RED} strokeWidth="4"/><rect x="14" y="29" width="9" height="16" fill="#fff" stroke={INK}/><text x="18" y="60" textAnchor="middle" fontSize="10" fontWeight="900" fill={INK}>HOME</text></g>;
  const Pool = () => <g transform="translate(393 67)"><rect x="0" y="15" width="38" height="28" rx="6" fill="#bae6fd" stroke="#0284c7" strokeWidth="2"/><path d="M5 24 q7-6 14 0 t14 0 M5 33 q7-6 14 0 t14 0" fill="none" stroke="#0284c7"/><text x="19" y="58" textAnchor="middle" fontSize="10" fontWeight="900" fill={INK}>POOL</text></g>;
  const Bike = ({ x, y, color }: { x:number; y:number; color:string }) => <g transform={`translate(${x} ${y})`}><circle cx="-10" cy="8" r="7" fill="none" stroke={color} strokeWidth="2"/><circle cx="10" cy="8" r="7" fill="none" stroke={color} strokeWidth="2"/><path d="M-10 8 L-2 -2 L5 8 L-5 8 L2 -8 M2 -8 L9 -8" fill="none" stroke={color} strokeWidth="2"/><circle cx="2" cy="-14" r="4" fill={color}/></g>;
  const Walker = ({ x, y, color }: { x:number; y:number; color:string }) => <g transform={`translate(${x} ${y})`}><circle cy="-12" r="5" fill={color}/><path d="M0 -7 V8 M0 -1 L-9 5 M0 -1 L8 4 M0 8 L-7 19 M0 8 L8 18" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></g>;

  return <div style={{ display:"flex", justifyContent:"center", width:"100%", minWidth:0, padding:"6px 4px", boxSizing:"border-box" }}><svg viewBox="0 0 460 310" width="100%" style={{maxWidth:480,minWidth:0,display:"block"}}>
    <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{title}</text>
    <House/><Pool/>
    <line x1={roadX} y1="92" x2={roadX+roadW} y2="92" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round"/><text x="230" y="83" textAnchor="middle" fontSize="11" fontWeight="900" fill={DIM} fontFamily={FONT}>{distance} mile</text>

    <text x="42" y="144" fontSize="11" fontWeight="900" fill={IND}>{names[fast]}</text><line x1={roadX} y1="139" x2={roadX+roadW} y2="139" stroke="#c7d2fe" strokeWidth="3"/>
    <motion.g initial={{x:roadX}} animate={{x:roadX+roadW}} transition={{duration:1.3}}><Bike x={0} y={128} color={IND}/></motion.g>
    <text x="42" y="191" fontSize="11" fontWeight="900" fill={ORANGE}>{names[slow]}</text><line x1={roadX} y1="186" x2={roadX+roadW} y2="186" stroke="#fed7aa" strokeWidth="3"/>
    <motion.g initial={{x:roadX}} animate={{x:phase >= 1 ? roadX+roadW : roadX+roadW*(times[fast]/times[slow])}} transition={{duration:1.8}}><Walker x={0} y={174} color={ORANGE}/></motion.g>
    <text x="230" y="216" textAnchor="middle" fontSize="11" fontWeight="900" fill={phase===0?IND:INK} fontFamily={FONT}>{phase===0?`${distance} mi ÷ ${speeds[fast]} mph = ${times[fast]} min`:`${distance} mi ÷ ${speeds[slow]} mph = ${times[slow]} min`}</text>

    <g transform="translate(80 238)"><line x1="0" y1="18" x2="300" y2="18" stroke={INK} strokeWidth="2"/>{Array.from({length:maxTime+1},(_,i)=><g key={i}><line x1={i*tickW} y1="12" x2={i*tickW} y2="24" stroke={INK}/>{(i===0||i===times[fast]||i===maxTime)&&<text x={i*tickW} y="38" textAnchor="middle" fontSize="10" fontWeight="900" fill={INK} fontFamily={FONT}>{i}</text>}</g>)}
      {phase >= 0 && <motion.path d={`M${times[fast]*tickW} 2 v16`} stroke={IND} strokeWidth="4" initial={{pathLength:0}} animate={{pathLength:1}}/>}{phase>=1&&<motion.path d={`M${times[slow]*tickW} 2 v16`} stroke={ORANGE} strokeWidth="4" initial={{pathLength:0}} animate={{pathLength:1}}/>}
      {final&&Array.from({length:gap},(_,i)=><motion.rect key={i} x={(times[fast]+i)*tickW+1} y="5" width={tickW-2} height="11" rx="2" fill="#bbf7d0" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} transition={{delay:i*.06}}/>)}
      <text x="150" y="55" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>shared clock (minutes)</text>
    </g>
    {final&&<motion.g initial={{scale:.6}} animate={{scale:1}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="154" y="287" width="152" height="22" rx="11" fill="#dcfce7" stroke={ok?GREEN:RED}/><text x="230" y="303" textAnchor="middle" fontSize="13" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT}>{times[slow]} − {times[fast]} = {gap} minutes</text></motion.g>}
    <SvgAnswerBadge show={final&&ok} answer={problem.answer} cx={403} y={282} width={82}/>
    <AnimatePresence>{final&&!ok&&<motion.text x="230" y="308" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
  </svg></div>;
}
