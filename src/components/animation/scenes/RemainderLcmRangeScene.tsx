import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",RED="#dc2626",AMBER="#d97706",DIM="#64748b";
const COLORS=["#0ea5e9","#f97316","#a855f7","#0d9488"];
const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a);
const lcm=(a:number,b:number)=>a/gcd(a,b)*b;

/** Slide the common +2 remainder off every division lane, align the first
 * common multiple, then restore +2 and drop the result into its source range. */
export function RemainderLcmRangeScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem);
  const divisors=Array.isArray(data.divisors)?data.divisors.map(Number):[];
  const remainder=num(data.remainder,0),common=divisors.reduce(lcm,1),result=common+remainder;
  const ranges=(problem.choices??[]).map(c=>{const m=c.text.match(/(\d+)\D+(\d+)/);return m?{label:c.label,lo:Number(m[1]),hi:Number(m[2])}:null}).filter((r):r is {label:string;lo:number;hi:number}=>r!=null);
  const hit=ranges.find(r=>result>=r.lo&&result<=r.hi);
  const smallest=Array.from({length:common-1},(_,i)=>i+1).every(n=>!divisors.every(d=>n%d===0));
  const ok=divisors.join(",")==="3,4,5,6"&&remainder===2&&common===60&&result===62&&smallest&&hit?.label===problem.answer&&`${hit.lo} and ${hit.hi}`===problem.shortAnswer;
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1);
  const x0=55,w=350,scale=w/common;

  return <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 470 295" width="342" style={{maxWidth:"100%",display:"block"}} aria-label="Four multiple tracks align at sixty, then a remainder of two shifts the answer to sixty-two and its interval">
      <defs><marker id="rlr-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={IND}/></marker></defs>
      <text x="235" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"remove the same remainder from every division":phase===1?"find the first landing point shared by all four tracks":"put the remainder back, then locate the result"}</text>
      {phase===0&&<g>
        {divisors.map((d,i)=>{const y=48+i*45,c=COLORS[i];return <motion.g key={d} initial={{opacity:0,x:-15}} animate={{opacity:1,x:0}} transition={{delay:i*.12}}><rect x="62" y={y} width="224" height="32" rx="9" fill="#f8fafc" stroke={c}/><text x="174" y={y+21} textAnchor="middle" fontSize="14" fontWeight="900" fill={c} fontFamily={FONT}>x = {d} × whole +</text><motion.g initial={{x:0}} animate={{x:58}} transition={{delay:.25+i*.1,type:"spring",stiffness:180,damping:18}}><rect x="250" y={y+4} width="30" height="24" rx="7" fill="#fff7ed" stroke={AMBER}/><text x="265" y={y+21} textAnchor="middle" fontSize="13" fontWeight="900" fill={AMBER} fontFamily={FONT}>{remainder}</text></motion.g><text x="346" y={y+21} textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>x − {remainder}</text></motion.g>})}
        <motion.path d="M336 226V250" stroke={IND} strokeWidth="2.5" markerEnd="url(#rlr-arrow)" initial={{pathLength:0}} animate={{pathLength:1}}/>
        <text x="235" y="276" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>x − {remainder} is divisible by {divisors.join(", ")}</text>
      </g>}
      {phase>=1&&<g>
        {divisors.map((d,i)=>{const y=48+i*42,c=COLORS[i],multiples=Array.from({length:common/d},(_,k)=>(k+1)*d);return <g key={d}><text x="42" y={y+4} textAnchor="end" fontSize="12" fontWeight="900" fill={c} fontFamily={FONT}>{d}s</text><line x1={x0} y1={y} x2={x0+w} y2={y} stroke="#e2e8f0" strokeWidth="1.5"/>{multiples.map((m,k)=><motion.circle key={m} cx={x0+m*scale} cy={y} r={m===common?5:2.6} fill={m===common?c:`${c}99`} initial={{opacity:0,scale:.35}} animate={{opacity:1,scale:1}} transition={{delay:k*.018+i*.08}}/>)}</g>})}
        <motion.line x1={x0+w} y1="36" x2={x0+w} y2="187" stroke={phase===2?GREEN:IND} strokeWidth="2" strokeDasharray="4 3" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.5}}/>
        {phase===1&&<g transform="translate(105 213)"><rect width="260" height="54" rx="13" fill="#eef2ff" stroke="#c7d2fe"/><text x="130" y="20" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>FIRST COMMON MULTIPLE</text><motion.text x="130" y="43" textAnchor="middle" fontSize="20" fontWeight="900" fill={IND} fontFamily={FONT} initial={{scale:.5}} animate={{scale:1}}>LCM = {common}</motion.text></g>}
      </g>}
      {phase===2&&<g>
        <motion.g initial={{x:-20,opacity:0}} animate={{x:0,opacity:1}} transition={{type:"spring"}}><rect x="309" y="194" width="118" height="48" rx="12" fill="#f0fdf4" stroke="#86efac"/><text x="368" y="213" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>RESTORE +{remainder}</text><text x="368" y="233" textAnchor="middle" fontSize="18" fontWeight="900" fill={GREEN} fontFamily={FONT}>{common}+{remainder}={result}</text></motion.g>
        <g transform="translate(20 205)">{ranges.map((r,i)=>{const active=r.label===hit?.label;return <motion.g key={r.label} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*.08}}><rect x={(i%3)*91} y={Math.floor(i/3)*34} width="83" height="27" rx="7" fill={active?(ok?"#dcfce7":"#fee2e2"):"#f1f5f9"} stroke={active?(ok?GREEN:RED):"#cbd5e1"}/><text x={(i%3)*91+41.5} y={Math.floor(i/3)*34+18} textAnchor="middle" fontSize="9.5" fontWeight="900" fill={active?(ok?GREEN:RED):DIM} fontFamily={FONT}>{r.lo}–{r.hi}</text></motion.g>})}</g>
        <motion.path d="M405 183Q390 191 376 194" fill="none" stroke={GREEN} strokeWidth="2" markerEnd="url(#rlr-arrow)" initial={{pathLength:0}} animate={{pathLength:1}}/>
        <SvgAnswerBadge show={final} answer={ok?problem.answer:"check failed"} cx={387} y={259} width={ok?80:118}/>
      </g>}
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(ok?"#166534":RED):IND,background:final?(ok?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)"}}>{phase===0?`strip off +${remainder}: every divisor must divide x−${remainder}`:phase===1?`the first shared multiple is ${common}`:ok?`${common}+${remainder}=${result}, inside ${hit?.lo}–${hit?.hi} — choice ${problem.answer}`:"LCM, interval, or stored-answer check failed"}</motion.span>
  </div>;
}
