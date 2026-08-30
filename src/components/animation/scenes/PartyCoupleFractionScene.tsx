import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",RED="#dc2626",PINK="#db2777",TEAL="#0d9488",DIM="#64748b";
const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a);

function Person({x,y,tone,label,delay=0}:{x:number;y:number;tone:string;label?:string;delay?:number}){
  return <motion.g initial={{opacity:0,y:-12,scale:.7}} animate={{opacity:1,y:0,scale:1}} transition={{delay,type:"spring",stiffness:190,damping:16}} style={{transformBox:"fill-box",transformOrigin:"center"}}>
    <circle cx={x} cy={y} r="10" fill={tone}/><path d={`M${x-15} ${y+29}q0-18 15-18t15 18Z`} fill={tone}/><circle cx={x-3.5} cy={y-2} r="1.3" fill="#fff"/><circle cx={x+3.5} cy={y-2} r="1.3" fill="#fff"/><path d={`M${x-4} ${y+3}q4 4 8 0`} fill="none" stroke="#fff" strokeWidth="1.4"/>{label&&<text x={x} y={y+43} textAnchor="middle" fontSize="9.5" fontWeight="850" fill={tone}>{label}</text>}
  </motion.g>;
}

/** Materialize the 2/5 probability as five women, pair every wife with her
 * present husband, then regroup the resulting eight people to count the men. */
export function PartyCoupleFractionScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem);
  const singles=num(data.singleNumerator,0),women=num(data.womenDenominator,0);
  const wives=women-singles,men=wives,total=women+men,d=gcd(men,total);
  const result=`${men/d}/${total/d}`;
  const choice=problem.choices?.find(c=>c.text===result)?.label;
  const ok=singles===2&&women===5&&wives===3&&men===3&&total===8&&result===problem.shortAnswer&&choice===problem.answer;
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1);
  const wx=[68,138,238,308,378];
  const wifeXs=wx.slice(singles);

  return <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 470 285" width="100%" style={{maxWidth:500,minWidth:0,display:"block"}} aria-label="Five women split into two singles and three wives, each joined by a husband">
      <text x="235" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"make 2/5 concrete with five women":phase===1?"each wife has her husband at the party":"regroup everyone and count the married men"}</text>

      {phase<2&&<g>
        <rect x="31" y="40" width="142" height="116" rx="16" fill="#fdf2f8" stroke="#f9a8d4"/><text x="102" y="59" textAnchor="middle" fontSize="10" fontWeight="850" fill={PINK}>SINGLE WOMEN</text>
        <rect x="190" y="40" width="254" height={phase===1?190:116} rx="16" fill="#ecfeff" stroke="#99f6e4"/><text x="317" y="59" textAnchor="middle" fontSize="10" fontWeight="850" fill={TEAL}>{phase===0?"MARRIED WOMEN":"MARRIED COUPLES"}</text>
        {wx.map((x,i)=><Person key={`w${i}`} x={x} y="91" tone={i<singles?PINK:TEAL} label={i<singles?"single":"wife"} delay={i*.1}/>)}
        {phase===1&&wifeXs.map((x,i)=><g key={`pair${i}`}><motion.path d={`M${x} 135V158`} stroke={IND} strokeWidth="2" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:.12*i}}/><motion.path d={`M${x-7} 148l7 8l7-8`} fill="none" stroke={IND} strokeWidth="2"/><Person x={x} y={184} tone={IND} label="husband" delay={.25+i*.16}/></g>)}
      </g>}

      {phase===0&&<g transform="translate(92 185)"><rect width="286" height="59" rx="13" fill="#eef2ff" stroke="#c7d2fe"/><text x="143" y="22" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>RANDOMLY CHOOSE A WOMAN</text><text x="143" y="45" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>{singles} single out of {women} women = {singles}/{women}</text></g>}
      {phase===1&&<g transform="translate(31 244)"><text x="206" y="17" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{wives} wives  →  {men} husbands</text></g>}

      {phase===2&&<g>
        <rect x="30" y="39" width="410" height="151" rx="17" fill="#f8fafc" stroke="#cbd5e1"/>
        <text x="235" y="60" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>EVERYONE IN THE ROOM</text>
        {[...Array(women)].map((_,i)=><Person key={`allw${i}`} x={70+i*72} y={103} tone={i<singles?PINK:TEAL} delay={i*.07}/>)}
        {[...Array(men)].map((_,i)=><Person key={`allm${i}`} x={142+i*72} y={155} tone={IND} delay={.25+i*.1}/>)}
        <motion.path d="M122 124Q235 205 354 124" fill="none" stroke={IND} strokeWidth="2" strokeDasharray="4 3" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:.5}}/>
        <g transform="translate(77 207)"><rect width="316" height="49" rx="13" fill={ok?"#f0fdf4":"#fef2f2"} stroke={ok?"#86efac":"#fecaca"}/><text x="158" y="18" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>MARRIED MEN ÷ ALL PEOPLE</text><motion.text x="158" y="40" textAnchor="middle" fontSize="20" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT} initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.6,type:"spring"}}>{men} ÷ {total} = {result}</motion.text></g>
        <SvgAnswerBadge show={final} answer={ok?problem.answer:"check failed"} cx={411} y={250} width={ok?78:116}/>
      </g>}
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(ok?"#166534":RED):IND,background:final?(ok?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)"}}>{phase===0?`${singles} single + ${wives} married = ${women} women`:phase===1?`${wives} married women bring ${men} married men`:ok?`${men} married men among ${total} people gives ${result} — choice ${problem.answer}`:"party counts, fraction, or stored-answer check failed"}</motion.span>
  </div>;
}
