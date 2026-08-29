import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",AMBER="#d97706",DIM="#94a3b8",RED="#dc2626";

/** Lock the middle of nine ordered slots, force its low/high bounds with three
 * unknown cards, then enumerate every integral median whose fixed values fit
 * into four slots on either side. */
export function MedianRangeSlotsScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem),fixed=(Array.isArray(data.fixedValues)?data.fixedValues:[]).map(v=>num(v,NaN)).sort((a,b)=>a-b),total=Math.round(num(data.totalCount,0));
  const unknown=total-fixed.length,mid=Math.floor(total/2),lo=fixed[mid-unknown],hi=fixed[mid];
  const candidates=Array.from({length:hi-lo+1},(_,i)=>lo+i);
  const checks=candidates.map(v=>({v,left:fixed.filter(x=>x<v).length,right:fixed.filter(x=>x>v).length,isFixed:fixed.includes(v)}));
  const possible=checks.filter(c=>c.left<=mid&&c.right<=mid&&(c.isFixed||unknown>0));
  const count=possible.length,answer=Number(problem.shortAnswer),choice=problem.choices?.find(c=>Number(c.text)===count)?.label;
  const ok=total===9&&unknown===3&&fixed.length===6&&new Set(fixed).size===fixed.length&&fixed.every(Number.isInteger)&&lo===3&&hi===9&&count===answer&&choice===problem.answer;
  const final=step>=totalSteps-1,phase=final?3:Math.min(step,2),W=470;
  const row=(values:(number|string)[],y:number,label:string)=><g><text x="235" y={y-17} textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>{label}</text>{values.map((v,i)=>{const x=23+i*48,isMed=i===mid,isUnknown=typeof v==="string";return <motion.g key={`${i}-${v}`} initial={{opacity:0,y:isUnknown?-18:0,scale:.7}} animate={{opacity:1,y:0,scale:1}} transition={{delay:i*.07,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x={x} y={y} width="40" height="38" rx="8" fill={isMed?"#eef2ff":isUnknown?"#fff7ed":"#f8fafc"} stroke={isMed?IND:isUnknown?AMBER:"#cbd5e1"} strokeWidth={isMed?2.5:1.5}/><text x={x+20} y={y+25} textAnchor="middle" fontSize="15" fontWeight="900" fill={isMed?IND:isUnknown?AMBER:INK} fontFamily={FONT}>{v}</text><text x={x+20} y={y+54} textAnchor="middle" fontSize="9" fontWeight="800" fill={isMed?IND:DIM}>{isMed?"5th":`${i+1}`}</text></motion.g>})}</g>;
  const lowRow=["?","?","?",2,3,4,6,9,14],highRow=[2,3,4,6,9,14,"?","?","?"];
  return <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 470 315" width="100%" style={{maxWidth:500,display:"block"}} aria-label="Nine ordered number slots showing the range of possible medians">
      {phase===0&&<g>
        {row(Array.from({length:total},(_,i)=>i===mid?"M":"—"),105,"nine distinct integers, sorted")}
        <motion.path d="M235 72V95" stroke={IND} strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}}/><text x="235" y="52" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND}>median chair</text><text x="235" y="211" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>4 smaller  |  M  |  4 larger</text><text x="235" y="245" textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM}>the fifth position—not the fifth known value—decides</text>
      </g>}
      {phase===1&&<g>{row(lowRow,91,"push all three unknown integers below 2")}<text x="235" y="190" textAnchor="middle" fontSize="13" fontWeight="850" fill={INK}>the fifth card is forced to be</text><motion.text x="235" y="230" textAnchor="middle" fontSize="30" fontWeight="900" fill={IND} fontFamily={FONT} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:.7,type:"spring"}}>3</motion.text><text x="235" y="266" textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM}>anything below 3 leaves at least five fixed values above it</text></g>}
      {phase===2&&<g>{row(highRow,91,"push all three unknown integers above 14")}<text x="235" y="190" textAnchor="middle" fontSize="13" fontWeight="850" fill={INK}>the fifth card is forced to be</text><motion.text x="235" y="230" textAnchor="middle" fontSize="30" fontWeight="900" fill={IND} fontFamily={FONT} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:.7,type:"spring"}}>9</motion.text><text x="235" y="266" textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM}>anything above 9 leaves at least five fixed values below it</text></g>}
      {phase===3&&<g>
        <text x="235" y="29" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>test every integer from the lower bound to the upper bound</text>
        {checks.map((c,i)=>{const x=24+i*62,pass=c.left<=mid&&c.right<=mid;return <motion.g key={c.v} initial={{opacity:0,y:-12,scale:.6}} animate={{opacity:1,y:0,scale:1}} transition={{delay:i*.12,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x={x} y="57" width="50" height="107" rx="10" fill={pass?"#f0fdf4":"#fef2f2"} stroke={pass?GREEN:RED} strokeWidth="1.8"/><text x={x+25} y="87" textAnchor="middle" fontSize="23" fontWeight="900" fill={pass?GREEN:RED} fontFamily={FONT}>{c.v}</text><text x={x+25} y="113" textAnchor="middle" fontSize="9" fontWeight="850" fill={INK} fontFamily={FONT}>L:{c.left} ≤ 4</text><text x={x+25} y="132" textAnchor="middle" fontSize="9" fontWeight="850" fill={INK} fontFamily={FONT}>R:{c.right} ≤ 4</text><text x={x+25} y="153" textAnchor="middle" fontSize="13" fontWeight="900" fill={GREEN}>✓</text></motion.g>})}
        <text x="235" y="195" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM}>unknown integers fill the remaining left/right slots</text><text x="235" y="225" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>{candidates.join(", ")}</text><motion.text x="235" y="263" textAnchor="middle" fontSize="23" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:1,type:"spring"}}>{hi} − {lo} + 1 = {count}</motion.text><motion.g initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} transition={{delay:1.25,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="189" y="280" width="92" height="27" rx="14" fill={ok?GREEN:RED}/><text x="235" y="298" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">Answer {ok?problem.answer:"failed"}</text></motion.g>
      </g>}
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(ok?"#166534":RED):IND,background:final?(ok?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)"}}>{phase===0?"with 9 values, the median occupies slot 5":phase===1?"the smallest possible median is 3":phase===2?"the largest possible median is 9":ok?"every integer 3 through 9 works: 7 possible medians":"range, enumeration, stored answer, or choice check failed"}</motion.span>
  </div>;
}
