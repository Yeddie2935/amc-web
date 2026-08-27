import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",TEAL="#0d9488",GOLD="#d97706",GREEN="#16a34a",RED="#dc2626",DIM="#64748b";

/** Feed distinct digit cards into a four-place lock, removing each used card from the next pool. */
export function DistinctFourDigitCountScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem),digitCount=Math.round(num(data.digitCount,0)),length=Math.round(num(data.length,0));
  const counts=Array.from({length},(_,i)=>i===0?digitCount-1:digitCount-i);
  const total=counts.reduce((p,v)=>p*v,1),choice=problem.choices?.find(c=>Number(c.text)===total)?.label;
  const ok=digitCount===10&&length===4&&total===Number(problem.shortAnswer)&&choice===problem.answer;
  const failure=total!==Number(problem.shortAnswer)?`computed ${total}; stored ${problem.shortAnswer}`:`choice ${choice??"missing"}; stored ${problem.answer}`;
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1);
  const sx=(i:number)=>91+i*72;
  const names=["thousands","hundreds","tens","ones"];
  return <div style={{display:"flex",justifyContent:"center",width:"100%",minWidth:0,padding:"6px 4px",boxSizing:"border-box"}}><svg viewBox="0 0 440 300" width="100%" style={{maxWidth:470,minWidth:0,display:"block"}}>
    <text x="220" y="18" textAnchor="middle" fontSize="11.3" fontWeight="850" fill={INK}>{phase===0?"the first slot cannot take the 0 card":phase===1?"after each choice, remove that used digit from the next pool":"multiply the independent choices for the four slots"}</text>
    {phase===0&&<>
      <g transform="translate(60 48)">{Array.from({length:digitCount},(_,d)=><motion.g key={d} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} transition={{delay:d*.055}}><rect x={d*33} width="27" height="38" rx="6" fill={d===0?"#f1f5f9":"#eef2ff"} stroke={d===0?DIM:IND} strokeWidth="1.5"/><text x={d*33+13.5} y="25" textAnchor="middle" fontSize="14" fontWeight="900" fill={d===0?DIM:IND} fontFamily={FONT}>{d}</text>{d===0&&<motion.line x1="3" y1="34" x2="24" y2="4" stroke={RED} strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}}/>}</motion.g>)}</g>
      <motion.path d="M220 99V133" stroke={GOLD} strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}}/><path d="M214 126l6 8 6-8" fill="none" stroke={GOLD} strokeWidth="2.5"/>
      <rect x="179" y="141" width="82" height="65" rx="12" fill="#fff7ed" stroke={GOLD} strokeWidth="2.5"/><text x="220" y="163" textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM}>THOUSANDS</text><text x="220" y="193" textAnchor="middle" fontSize="29" fontWeight="900" fill={GOLD} fontFamily={FONT}>{counts[0]}</text>
      <text x="220" y="233" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>{digitCount} digits − 1 blocked = {counts[0]}</text><text x="220" y="255" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>using 0 first would make only a three-digit number</text>
    </>}
    {phase>=1&&<>
      <text x="220" y="43" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>choices remaining in each position</text>
      {counts.map((count,i)=><motion.g key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*.14}}><rect x={sx(i)} y="55" width="58" height="68" rx="11" fill={i===0?"#fff7ed":"#eef2ff"} stroke={i===0?GOLD:IND} strokeWidth="2"/><text x={sx(i)+29} y="94" textAnchor="middle" fontSize="27" fontWeight="900" fill={i===0?GOLD:IND} fontFamily={FONT}>{count}</text><text x={sx(i)+29} y="141" textAnchor="middle" fontSize="8.5" fontWeight="850" fill={INK}>{names[i]}</text></motion.g>)}
      {phase===1&&<>
        <g transform="translate(56 166)">{counts.map((count,i)=>{const excluded=i===0?1:i;return <g key={i} transform={`translate(${i*82} 0)`}><rect width="72" height="53" rx="9" fill="#f8fafc" stroke="#cbd5e1"/><text x="36" y="17" textAnchor="middle" fontSize="8.5" fontWeight="850" fill={DIM}>{i===0?"zero blocked":`${excluded} used`}</text><text x="36" y="38" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={TEAL} fontFamily={FONT}>{digitCount} − {excluded} = {count}</text></g>})}</g>
        <motion.path d="M120 229 C120 251 320 251 320 229" fill="none" stroke={TEAL} strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}}/>
        <text x="220" y="271" textAnchor="middle" fontSize="11" fontWeight="850" fill={TEAL}>each filled slot removes one more digit card</text>
      </>}
      {phase===2&&<>
        <g transform="translate(61 165)">{counts.map((count,i)=><g key={i}><motion.circle cx={34+i*82} cy="27" r="24" fill="#eef2ff" stroke={IND} strokeWidth="2" initial={{scale:.5}} animate={{scale:1}} transition={{delay:i*.1}} style={{transformBox:"fill-box",transformOrigin:"center"}}/><text x={34+i*82} y="33" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>{count}</text>{i<counts.length-1&&<text x={74+i*82} y="33" textAnchor="middle" fontSize="18" fontWeight="900" fill={DIM}>×</text>}</g>)}</g>
        <motion.g initial={{scale:.6,opacity:0}} animate={{scale:1,opacity:1}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="125" y="231" width="190" height="48" rx="12" fill={ok?"#dcfce7":"#fee2e2"} stroke={ok?GREEN:RED} strokeWidth="2"/><text x="220" y="251" textAnchor="middle" fontSize="11" fontWeight="850" fill={ok?GREEN:RED} fontFamily={FONT}>{counts.join(" × ")}</text><text x="220" y="271" textAnchor="middle" fontSize="20" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT}>= {total}</text></motion.g>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={380} y={244} width={76}/>
      </>}
    </>}
    <AnimatePresence>{final&&!ok&&<motion.text x="220" y="297" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
  </svg></div>;
}
