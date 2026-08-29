import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44", IND="#4338ca", AMBER="#d97706", GREEN="#16a34a", RED="#dc2626", DIM="#94a3b8";
const isPrime=(n:number)=>{if(!Number.isInteger(n)||n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true};

/** Send possible ages through three literal clue gates: enough lower guesses,
 * exactly two guess cards at ±1, then primality. Data: { guesses, minTooLow,
 * offBy }.
 */
export function AgeClueSieveScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem), guesses=(Array.isArray(data.guesses)?data.guesses:[]).map(v=>Math.round(num(v,-1))).sort((a,b)=>a-b);
  const minLow=Math.round(num(data.minTooLow,0)), offBy=Math.round(num(data.offBy,1));
  const candidates=(problem.choices??[]).map(c=>({label:c.label,age:Number(c.text)})).filter(c=>Number.isInteger(c.age));
  const rows=candidates.map(c=>{const lows=guesses.filter(g=>g<c.age);const near=guesses.filter(g=>Math.abs(g-c.age)===offBy);return{...c,lows,near,lowOk:lows.length>=minLow,nearOk:near.length===2,prime:isPrime(c.age)}});
  const afterLow=rows.filter(r=>r.lowOk), afterNear=afterLow.filter(r=>r.nearOk), winners=afterNear.filter(r=>r.prime);
  const win=winners[0], ok=winners.length===1&&String(win?.age)===problem.shortAnswer&&win?.label===problem.answer;
  const final=step>=totalSteps-1, phase=final?2:Math.min(step,1);
  const gx=(i:number)=>24+i*41;
  return <div style={{width:"100%",minWidth:0,display:"flex",justifyContent:"center",padding:"5px 3px",boxSizing:"border-box"}}><svg viewBox="0 0 440 300" width="100%" style={{maxWidth:470,minWidth:0,display:"block"}} aria-label="Guess cards filtered by lower, off-by-one, and prime-age clues">
    <text x="220" y="18" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>{phase===0?`at least ${minLow} of the 10 guess cards must sit below Norb's age`:phase===1?`each surviving age needs exactly two guess cards ${offBy} away`:"send the last two ages through the prime gate"}</text>
    {phase===0&&<g>
      <line x1="20" y1="104" x2="420" y2="104" stroke={INK} strokeWidth="2"/>
      {guesses.map((g,i)=>{const low=i<minLow;return <motion.g key={g} initial={{opacity:0,y:-9}} animate={{opacity:1,y:0}} transition={{delay:i*.06}}><rect x={gx(i)} y="62" width="34" height="34" rx="6" fill={low?"#eef2ff":"#f8fafc"} stroke={low?IND:"#cbd5e1"}/><text x={gx(i)+17} y="84" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="900" fill={low?IND:INK}>{g}</text><circle cx={gx(i)+17} cy="104" r="4" fill={low?IND:DIM}/></motion.g>})}
      <motion.path d={`M${gx(minLow-1)+17} 119 V151 H${gx(minLow)+17} V119`} fill="none" stroke={AMBER} strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}}/><text x={(gx(minLow-1)+gx(minLow))/2+17} y="171" textAnchor="middle" fontSize="11" fontWeight="900" fill={AMBER}>halfway cut</text>
      <rect x="110" y="191" width="220" height="56" rx="13" fill="#fef3c7" stroke="#fbbf24"/><text x="220" y="214" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={AMBER}>the 5th guess is {guesses[minLow-1]}</text><text x="220" y="237" textAnchor="middle" fontFamily={FONT} fontSize="18" fontWeight="900" fill={INK}>age &gt; {guesses[minLow-1]}</text>
      <text x="220" y="274" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="900" fill={IND}>choice candidates: {afterLow.map(r=>r.age).join(", ")}</text>
    </g>}
    {phase===1&&<g>
      {afterLow.map((r,i)=>{const y=47+i*74;return <motion.g key={r.age} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*.12}}><rect x="33" y={y} width="374" height="60" rx="12" fill={r.nearOk?"#ecfdf5":"#fef2f2"} stroke={r.nearOk?GREEN:RED} strokeWidth="1.8"/><circle cx="77" cy={y+30} r="22" fill="#fff" stroke={r.nearOk?GREEN:RED} strokeWidth="2"/><text x="77" y={y+36} textAnchor="middle" fontFamily={FONT} fontSize="18" fontWeight="900" fill={r.nearOk?GREEN:RED}>{r.age}</text><text x="118" y={y+24} fontSize="9.5" fontWeight="850" fill={DIM}>guess cards exactly ±{offBy}</text><text x="118" y={y+46} fontFamily={FONT} fontSize="15" fontWeight="900" fill={r.nearOk?GREEN:RED}>{r.near.length?r.near.join(" and "):"none"}  → {r.near.length} card{r.near.length===1?"":"s"}</text><text x="387" y={y+36} textAnchor="end" fontSize="17" fontWeight="900" fill={r.nearOk?GREEN:RED}>{r.nearOk?"KEEP":"DROP"}</text></motion.g>})}
      <text x="220" y="282" textAnchor="middle" fontFamily={FONT} fontSize="15" fontWeight="900" fill={GREEN}>exactly two off-by-one guesses → {afterNear.map(r=>r.age).join(" or ")}</text>
    </g>}
    {phase===2&&<g>
      {afterNear.map((r,i)=>{const x=73+i*210;const factors:number[]=[];for(let d=2;d*d<=r.age;d++)if(r.age%d===0){factors.push(d,r.age/d);break}return <motion.g key={r.age} initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{delay:i*.14}}><rect x={x} y="55" width="154" height="132" rx="18" fill={r.prime?"#ecfdf5":"#fef2f2"} stroke={r.prime?GREEN:RED} strokeWidth="2.5"/><text x={x+77} y="91" textAnchor="middle" fontFamily={FONT} fontSize="31" fontWeight="900" fill={r.prime?GREEN:RED}>{r.age}</text><text x={x+77} y="119" textAnchor="middle" fontSize="11" fontWeight="900" fill={r.prime?GREEN:RED}>{r.prime?"PRIME":"COMPOSITE"}</text><text x={x+77} y="148" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="850" fill={INK}>{r.prime?`no divisors 2–${Math.floor(Math.sqrt(r.age))}`:`${factors[0]} × ${factors[1]}`}</text><text x={x+77} y="172" textAnchor="middle" fontSize="18" fontWeight="900" fill={r.prime?GREEN:RED}>{r.prime?"PASS ✓":"DROP ✕"}</text></motion.g>})}
      <motion.path d="M220 198 V221" stroke={GREEN} strokeWidth="2.5" markerEnd="url(#ageArrow)" initial={{pathLength:0}} animate={{pathLength:1}}/><motion.text x="220" y="251" textAnchor="middle" fontFamily={FONT} fontSize="23" fontWeight="900" fill={ok?GREEN:RED} initial={{opacity:0,scale:.6}} animate={{opacity:1,scale:1}}>Norb is {win?.age??"?"}</motion.text>
      <defs><marker id="ageArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={GREEN}/></marker></defs>
      <AnimatePresence>{ok&&<motion.g initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} transition={{delay:.5,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="174" y="265" width="92" height="27" rx="14" fill={GREEN}/><text x="220" y="283" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">Answer {problem.answer}</text></motion.g>}</AnimatePresence>
    </g>}
  </svg></div>;
}
