import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",RED="#dc2626",AMBER="#d97706",DIM="#64748b";
const COLORS=["#0ea5e9","#a855f7","#0d9488"];
const factorial=(n:number):number=>n<=1?1:n*factorial(n-1);
const choose=(n:number,k:number)=>factorial(n)/(factorial(k)*factorial(n-k));
function Pencil({x,y,tone=AMBER,delay=0}:{x:number;y:number;tone?:string;delay?:number}){return <motion.g initial={{opacity:0,y:-10,rotate:-15}} animate={{opacity:1,y:0,rotate:0}} transition={{delay,type:"spring",stiffness:190,damping:16}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x={x} y={y} width="29" height="7" rx="2" fill="#fde68a" stroke={tone} strokeWidth="1.3"/><path d={`M${x+29} ${y}l8 3.5l-8 3.5Z`} fill="#fed7aa" stroke={tone} strokeWidth="1.1"/><path d={`M${x+35} ${y+2.5}l2 1l-2 1`} stroke={INK}/><rect x={x} y={y} width="5" height="7" rx="1" fill="#f9a8d4"/></motion.g>}
function Friend({x,y,i}:{x:number;y:number;i:number}){const tone=COLORS[i];return <g><circle cx={x} cy={y} r="12" fill={tone}/><circle cx={x-4} cy={y-2} r="1.4" fill="#fff"/><circle cx={x+4} cy={y-2} r="1.4" fill="#fff"/><path d={`M${x-5} ${y+4}q5 5 10 0`} fill="none" stroke="#fff" strokeWidth="1.4"/><text x={x} y={y+30} textAnchor="middle" fontSize="10" fontWeight="900" fill={tone}>friend {i+1}</text></g>}

/** Deal the positive baseline, enumerate every weak composition of the three
 * leftover pencils, then identify each composition with two bar positions. */
export function PencilStarsBarsScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem);
  const total=num(data.totalPencils,0),people=num(data.people,0),minimum=num(data.minimumEach,0);
  const remaining=total-people*minimum,bars=people-1,slots=remaining+bars,ways=choose(slots,bars);
  const extras:number[][]=[];for(let a=0;a<=remaining;a++)for(let b=0;b<=remaining-a;b++)extras.push([a,b,remaining-a-b]);
  const distributions=extras.map(row=>row.map(v=>v+minimum));
  const choice=problem.choices?.find(c=>Number(c.text)===ways)?.label;
  const sumsOk=distributions.every(row=>row.length===people&&row.every(v=>v>=minimum)&&row.reduce((a,b)=>a+b,0)===total)&&new Set(distributions.map(r=>r.join(","))).size===ways;
  const ok=total===6&&people===3&&minimum===1&&remaining===3&&bars===2&&slots===5&&ways===10&&extras.length===ways&&sumsOk&&Number(problem.shortAnswer)===ways&&choice===problem.answer;
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1);

  return <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 470 300" width="342" style={{maxWidth:"100%",display:"block"}} aria-label="Six pencils are shared among three friends using three stars and two bars">
      <text x="235" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"first guarantee one pencil to every friend":phase===1?"move two dividers through the three leftover pencils":"choose the two divider positions"}</text>
      {phase===0&&<g>
        {[0,1,2].map(i=><g key={i}><Friend x={95+i*140} y={73} i={i}/><Pencil x={76+i*140} y={119} tone={COLORS[i]} delay={i*.15}/></g>)}
        <motion.path d="M85 168H385" stroke="#cbd5e1" strokeWidth="2" initial={{pathLength:0}} animate={{pathLength:1}}/>
        {[0,1,2].map(i=><Pencil key={i} x={151+i*58} y={184} delay={.4+i*.15}/>)}
        <text x="235" y="222" textAnchor="middle" fontSize="12" fontWeight="900" fill={AMBER} fontFamily={FONT}>{remaining} pencils remain</text>
        <g transform="translate(104 239)"><rect width="262" height="39" rx="11" fill="#eef2ff" stroke="#c7d2fe"/><text x="131" y="25" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>{total} − {people}·{minimum} = {remaining}</text></g>
      </g>}
      {phase===1&&<g>
        <text x="235" y="43" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>extra pencils → final totals after adding one each</text>
        {distributions.map((row,i)=>{const x=27+(i%5)*87,y=57+Math.floor(i/5)*72;const ex=extras[i];return <motion.g key={row.join("-")} initial={{opacity:0,scale:.55}} animate={{opacity:1,scale:1}} transition={{delay:i*.07,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x={x} y={y} width="78" height="61" rx="10" fill="#f8fafc" stroke="#cbd5e1"/><g transform={`translate(${x+8} ${y+9})`}>{ex.map((count,j)=><g key={j}>{Array.from({length:count}).map((_,k)=><circle key={k} cx={j*22+k*5} cy="4" r="2.2" fill={COLORS[j]}/>)}{j<2&&<rect x={j*22+15} y="-2" width="2.5" height="14" rx="1" fill={AMBER}/>}</g>)}</g><text x={x+39} y={y+43} textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{row.join(" + ")}</text><text x={x+39} y={y+56} textAnchor="middle" fontSize="8" fontWeight="850" fill={DIM}>= {total}</text></motion.g>})}
        <g transform="translate(104 219)"><rect width="262" height="48" rx="12" fill="#fff7ed" stroke="#fed7aa"/><text x="131" y="20" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>ONE STARS-AND-BARS ROW ↔ ONE SHARE</text><text x="131" y="39" textAnchor="middle" fontSize="14" fontWeight="900" fill={AMBER} fontFamily={FONT}>{extras.length} distinct distributions</text></g>
      </g>}
      {phase===2&&<g>
        <g transform="translate(83 56)"><rect width="304" height="75" rx="15" fill="#f8fafc" stroke="#cbd5e1"/><text x="152" y="22" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>3 PENCILS + 2 DIVIDERS = 5 SLOTS</text><g transform="translate(70 36)">{["★","|","★","★","|"].map((v,i)=><motion.text key={i} x={i*40} y="20" textAnchor="middle" fontSize={v==="|"?25:18} fontWeight="900" fill={v==="|"?AMBER:IND} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} transition={{delay:i*.1}}>{v}</motion.text>)}</g></g>
        <motion.path d="M235 141V166" stroke={IND} strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}}/>
        <g transform="translate(96 177)"><rect width="278" height="77" rx="14" fill={ok?"#f0fdf4":"#fef2f2"} stroke={ok?"#86efac":"#fecaca"}/><text x="139" y="24" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>CHOOSE WHICH 2 SLOTS ARE BARS</text><text x="139" y="47" textAnchor="middle" fontSize="17" fontWeight="900" fill={INK} fontFamily={FONT}>C({slots},{bars}) = {slots}! / ({bars}!·{remaining}!)</text><motion.text x="139" y="69" textAnchor="middle" fontSize="22" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT} initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.55,type:"spring"}}>= {ways} ways</motion.text></g>
        <SvgAnswerBadge show={final} answer={ok?problem.answer:"check failed"} cx={407} y={263} width={ok?80:116}/>
      </g>}
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(ok?"#166534":RED):IND,background:final?(ok?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)"}}>{phase===0?`one each leaves ${remaining} pencils free`:phase===1?`${extras.length} bar placements give ${ways} valid shares`:ok?`C(${slots},${bars}) = ${ways} — choice ${problem.answer}`:"enumeration, count, or stored-answer check failed"}</motion.span>
  </div>;
}
