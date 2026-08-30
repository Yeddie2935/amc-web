import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace",INK="#1f2a44",IND="#4338ca",BLUE="#2563eb",GOLD="#d97706",GREEN="#16a34a",RED="#dc2626",DIM="#94a3b8";
const COLORS:Record<number,string>={2:BLUE,3:GOLD,5:"#7c3aed"};
const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a),lcm=(a:number,b:number)=>a/gcd(a,b)*b;
const factors=(n:number)=>{const out:number[]=[];let r=n;for(let p=2;p*p<=r;p++)while(r%p===0){out.push(p);r/=p}if(r>1)out.push(r);return out};

/** Merge maximum prime stacks into an LCM block, then stamp it across a bounded interval. */
export function LcmIntervalCountScene({problem,step,totalSteps}:AnimatedSceneProps){
 const d=sceneData(problem),divisors=(Array.isArray(d.divisors)?d.divisors:[]).map(Number),lo=Number(d.rangeMin),hi=Number(d.rangeMax);
 const rows=divisors.map(n=>({n,fs:factors(n)})),common=divisors.reduce(lcm,1),first=Math.ceil(lo/common),last=Math.floor(hi/common),hits=Array.from({length:Math.max(0,last-first+1)},(_,i)=>(first+i)*common),count=hits.length;
 const choice=problem.choices?.find(c=>Number(c.text)===count)?.label,agrees=String(count)===problem.shortAnswer&&choice===problem.answer;
 const final=step>=totalSteps-1,phase=final?2:Math.min(step,1),primes=[2,3,5],maxPowers=primes.map(p=>Math.max(...rows.map(r=>r.fs.filter(v=>v===p).length)));
 const caption=phase===0?`break ${divisors.join(", ")} into prime-factor stacks`:phase===1?`take each tallest stack: LCM = ${common}`:agrees?`multipliers ${first} through ${last} give ${count} integers in the interval`:`LCM, bounds, count, or stored-answer check failed`;
 return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:7,width:"calc(100vw - 60px)",maxWidth:440,minWidth:0,padding:"6px 2px",boxSizing:"border-box"}}>
  <svg viewBox="-70 0 520 250" width="100%" style={{width:"100%",maxWidth:440,minWidth:0,display:"block"}} aria-label="Prime factors merge into LCM 300, whose multiples between 1000 and 2000 are counted">
   {phase===0&&<>
    <text x="190" y="18" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM} fontFamily={FONT}>PRIME-FACTOR EACH REQUIREMENT</text>
    {rows.map((r,i)=><motion.g key={r.n} initial={{opacity:0,x:-18}} animate={{opacity:1,x:0}} transition={{delay:i*.15}}><rect x="32" y={42+i*56} width="316" height="42" rx="10" fill="#f8fafc" stroke="#cbd5e1"/><text x="65" y={69+i*56} textAnchor="middle" fontSize="17" fontWeight="950" fill={INK} fontFamily={FONT}>{r.n}</text><text x="93" y={69+i*56} fontSize="14" fontWeight="900" fill={DIM} fontFamily={FONT}>=</text>{r.fs.map((p,j)=><g key={j}><circle cx={132+j*48} cy={63+i*56} r="15" fill={`${COLORS[p]}20`} stroke={COLORS[p]} strokeWidth="2"/><text x={132+j*48} y={68+i*56} textAnchor="middle" fontSize="13" fontWeight="950" fill={COLORS[p]} fontFamily={FONT}>{p}</text>{j<r.fs.length-1&&<text x={156+j*48} y={68+i*56} textAnchor="middle" fontSize="13" fontWeight="900" fill={DIM}>×</text>}</g>)}</motion.g>)}
   </>}
   {phase===1&&<>
    <text x="190" y="18" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM} fontFamily={FONT}>KEEP THE TALLEST STACK OF EACH PRIME</text>
    {primes.map((p,i)=><g key={p}><text x={88+i*104} y="47" textAnchor="middle" fontSize="11" fontWeight="900" fill={COLORS[p]} fontFamily={FONT}>{p}s</text>{Array.from({length:maxPowers[i]}).map((_,j)=><motion.g key={j} initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{delay:.15+i*.16+j*.1,type:"spring"}}><rect x={65+i*104} y={99-j*34} width="46" height="29" rx="7" fill={`${COLORS[p]}20`} stroke={COLORS[p]} strokeWidth="2"/><text x={88+i*104} y={119-j*34} textAnchor="middle" fontSize="14" fontWeight="950" fill={COLORS[p]} fontFamily={FONT}>{p}</text></motion.g>)}</g>)}
    <motion.path d="M88 139 C88 169 190 162 190 183 M192 139 V183 M296 139 C296 169 190 162 190 183" fill="none" stroke={IND} strokeWidth="2" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:.65}}/>
    <motion.g initial={{opacity:0,scale:.65}} animate={{opacity:1,scale:1}} transition={{delay:.85,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="67" y="183" width="246" height="51" rx="12" fill="#eef2ff" stroke={IND} strokeWidth="2"/><text x="190" y="202" textAnchor="middle" fontSize="12" fontWeight="850" fill={DIM} fontFamily={FONT}>2² × 3 × 5²</text><text x="190" y="225" textAnchor="middle" fontSize="20" fontWeight="950" fill={IND} fontFamily={FONT}>LCM = {common}</text></motion.g>
   </>}
   {phase===2&&<>
    <text x="190" y="18" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM} fontFamily={FONT}>STAMP 300s ACROSS THE INTERVAL</text>
    <line x1="30" y1="102" x2="350" y2="102" stroke={INK} strokeWidth="2"/>
    <rect x="70" y="70" width="240" height="64" rx="10" fill="#eef2ff" fillOpacity=".45" stroke={IND} strokeWidth="1.5"/><text x="70" y="61" textAnchor="middle" fontSize="10" fontWeight="900" fill={IND} fontFamily={FONT}>{lo}</text><text x="310" y="61" textAnchor="middle" fontSize="10" fontWeight="900" fill={IND} fontFamily={FONT}>{hi}</text>
    {[first-1,...Array.from({length:last-first+1},(_,i)=>first+i),last+1].map((k,i)=>{const value=k*common,inRange=value>=lo&&value<=hi,x=30+(value-(first-1)*common)/((last-first+2)*common)*320;return <motion.g key={k} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:i*.14,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><line x1={x} y1="94" x2={x} y2="110" stroke={inRange?GREEN:RED} strokeWidth={inRange?3:1.6}/><circle cx={x} cy="102" r={inRange?8:5} fill={inRange?GREEN:"#fee2e2"} stroke={inRange?GREEN:RED}/><text x={x} y="130" textAnchor="middle" fontSize="10" fontWeight="950" fill={inRange?GREEN:RED} fontFamily={FONT}>{value}</text><text x={x} y="146" textAnchor="middle" fontSize="8.5" fontWeight="850" fill={inRange?GREEN:DIM} fontFamily={FONT}>{common}×{k}</text></motion.g>})}
    <motion.g initial={{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} transition={{delay:.75,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="95" y="174" width="190" height="55" rx="12" fill={agrees?"#dcfce7":"#fee2e2"} stroke={agrees?GREEN:RED} strokeWidth="2"/><text x="190" y="194" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM} fontFamily={FONT}>IN RANGE</text><text x="190" y="218" textAnchor="middle" fontSize="19" fontWeight="950" fill={agrees?GREEN:RED} fontFamily={FONT}>{hits.join(", ")} → {count}</text></motion.g>
   </>}
  </svg>
  <motion.div key={step} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} style={{width:260,maxWidth:"calc(100vw - 80px)",overflowWrap:"anywhere",textAlign:"center",fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(agrees?"#166534":"#991b1b"):IND}}>{caption}</motion.div>
  {final&&<svg viewBox="0 0 200 32" width="130"><SvgAnswerBadge show answer={problem.answer??null} cx={100} y={3}/></svg>}
 </div>
}
