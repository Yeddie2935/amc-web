import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace",INK="#1f2a44",IND="#4338ca",BLUE="#2563eb",GOLD="#d97706",GREEN="#16a34a",RED="#dc2626",DIM="#94a3b8";
const C={x:112,y:110},R=82;
const at=(deg:number,r:number)=>{const t=deg*Math.PI/180;return{x:C.x+r*Math.sin(t),y:C.y-r*Math.cos(t)}};

/** Use the hour-mark sector as a ruler for the hour hand's fractional drift. */
export function ClockHandDriftAngleScene({problem,step,totalSteps}:AnimatedSceneProps){
 const d=sceneData(problem),hour=Math.round(num(d.hour,4))%12,minute=Math.round(num(d.minute,20));
 const minuteAngle=minute*6,hourStart=hour*30,hourAngle=hourStart+minute/2,raw=Math.abs(hourAngle-minuteAngle),angle=Math.min(raw,360-raw);
 const final=step>=totalSteps-1,showHour=step>=1;
 const minuteP=at(minuteAngle,66),hourP=at(hourAngle,48),ghostP=at(hourStart,48);
 const a0=Math.min(minuteAngle,hourAngle),a1=Math.max(minuteAngle,hourAngle),w0=at(a0,34),w1=at(a1,34),wedge=`M${C.x},${C.y} L${w0.x},${w0.y} A34,34 0 0 1 ${w1.x},${w1.y} Z`;
 const choice=problem.choices?.find(c=>Number(c.text)===angle)?.label, agrees=`${angle}°`===problem.shortAnswer&&choice===problem.answer;
 const caption=final?(agrees?`${minute}/60 of one 30° hour mark = ${angle}°`:`clock geometry or stored-answer check failed`):showHour?`the hour hand moves ${minute}/60 = 1/3 of the way from ${hour} to ${hour+1}`:`${minute} minutes puts the minute hand exactly on ${hour}`;
 return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:7,width:"100%",maxWidth:"calc(100vw - 48px)",minWidth:0,padding:"6px 2px",boxSizing:"border-box"}}>
  <svg viewBox="-75 0 520 230" width="100%" style={{width:"100%",maxWidth:440,minWidth:0,display:"block"}} aria-label={`Clock at ${hour}:${String(minute).padStart(2,"0")} showing an angle of ${angle} degrees`}>
   <circle cx={C.x} cy={C.y} r={R} fill="#fff" stroke={INK} strokeWidth="2.5"/>
   {Array.from({length:60}).map((_,i)=>{const p1=at(i*6,i%5===0?R-8:R-4),p2=at(i*6,R);return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={i%5===0?INK:"#cbd5e1"} strokeWidth={i%5===0?1.8:.8}/>})}
   {Array.from({length:12}).map((_,i)=>{const n=i===0?12:i,p=at(i*30,66);return <text key={n} x={p.x} y={p.y+4} textAnchor="middle" fontSize="10" fontWeight={n===hour||n===hour+1?900:650} fill={n===hour?IND:n===hour+1?GOLD:DIM}>{n}</text>})}
   {final&&<motion.path d={wedge} fill="#a5b4fc" fillOpacity=".55" stroke={IND} strokeWidth="1.5" initial={{opacity:0,pathLength:0}} animate={{opacity:1,pathLength:1}}/>}
   <motion.line x1={C.x} y1={C.y} x2={minuteP.x} y2={minuteP.y} stroke={BLUE} strokeWidth="4" strokeLinecap="round" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:.65}}/>
   {showHour&&<><motion.line x1={C.x} y1={C.y} x2={ghostP.x} y2={ghostP.y} stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeDasharray="4 3" initial={{opacity:0}} animate={{opacity:.4}}/><motion.line x1={C.x} y1={C.y} x2={hourP.x} y2={hourP.y} stroke={GOLD} strokeWidth="6" strokeLinecap="round" initial={{x2:ghostP.x,y2:ghostP.y}} animate={{x2:hourP.x,y2:hourP.y}} transition={{duration:.8,ease:"easeInOut"}}/></>}
   <circle cx={C.x} cy={C.y} r="5" fill={INK}/>
   <text x="112" y="213" textAnchor="middle" fontSize="10" fontWeight="900" fill={BLUE} fontFamily={FONT}>minute hand: {minuteAngle}°</text>

   <g transform="translate(225 28)">
    <text x="72" y="0" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM} fontFamily={FONT}>ONE HOUR-MARK = 30°</text>
    <path d="M8 55 Q72 12 136 55" fill="none" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round"/>
    {[0,1,2,3].map(i=>{const t=i/3,x=8+128*t,y=55-43*4*t*(1-t);return <g key={i}><circle cx={x} cy={y} r={i===1&&showHour?6:4} fill={i===1&&showHour?GOLD:DIM}/><text x={x} y={y+17} textAnchor="middle" fontSize="9" fontWeight="900" fill={i===1&&showHour?GOLD:DIM} fontFamily={FONT}>{i===0?hour:i===3?hour+1:`+${i*10}°`}</text></g>})}
    {showHour&&<motion.path d="M8 55 Q29 41 50.7 35.9" fill="none" stroke={GOLD} strokeWidth="7" strokeLinecap="round" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:.7}}/>}
    <text x="72" y="99" textAnchor="middle" fontSize="11" fontWeight="900" fill={showHour?GOLD:DIM} fontFamily={FONT}>{showHour?`${minute}/60 × 30° = ${angle}°`:"hour hand starts at 4:00"}</text>
    {final&&<motion.g initial={{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} transition={{delay:.35,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="4" y="119" width="136" height="45" rx="11" fill={agrees?"#dcfce7":"#fee2e2"} stroke={agrees?GREEN:RED} strokeWidth="2"/><text x="72" y="138" textAnchor="middle" fontSize="10" fontWeight="850" fill={INK} fontFamily={FONT}>hour − minute</text><text x="72" y="157" textAnchor="middle" fontSize="14" fontWeight="950" fill={agrees?GREEN:RED} fontFamily={FONT}>{hourAngle}° − {minuteAngle}° = {angle}°</text></motion.g>}
   </g>
  </svg>
  <motion.div key={step} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} style={{width:300,maxWidth:"calc(100vw - 60px)",overflowWrap:"anywhere",textAlign:"center",fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(agrees?"#166534":"#991b1b"):showHour?GOLD:BLUE}}>{caption}</motion.div>
  {final&&<svg viewBox="0 0 200 32" width="130"><SvgAnswerBadge show answer={problem.answer??null} cx={100} y={3}/></svg>}
 </div>
}
