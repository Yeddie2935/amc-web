import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44", IND="#4338ca", TEAL="#0d9488", AMBER="#d97706", GREEN="#16a34a", RED="#dc2626", DIM="#94a3b8";

/** Split distinct-digit multiples of 5 by their terminal digit, then deal the
 * legal digit cards into four place-value slots. Data: { digits, length,
 * requiredLargest, terminalDigits }.
 */
export function TerminalDigitCaseCountScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem);
  const digits=(Array.isArray(data.digits)?data.digits:[]).map(v=>Math.round(num(v,-1)));
  const length=Math.round(num(data.length,4)), largest=Math.round(num(data.requiredLargest,5));
  const terminals=(Array.isArray(data.terminalDigits)?data.terminalDigits:[]).map(v=>Math.round(num(v,-1)));
  const small=digits.filter(d=>d>0&&d<largest);
  const case5Lead=small.length, case5Middle=digits.length-2, case5Last=digits.length-3;
  const case5=case5Lead*case5Middle*case5Last;
  const case0Pos=length-1, case0First=small.length, case0Second=small.length-1;
  const case0=case0Pos*case0First*case0Second, total=case5+case0;
  const choice=problem.choices?.find(c=>Number(c.text)===total)?.label;
  const ok=digits.join(",")==="0,1,2,3,4,5"&&length===4&&largest===5&&terminals.join(",")==="0,5"&&total===Number(problem.shortAnswer)&&choice===problem.answer;
  const final=step>=totalSteps-1, phase=final?2:Math.min(step,1);
  const slotX=(i:number)=>70+i*76;
  const Slot=({i,label,active=false}:{i:number;label:string;active?:boolean})=><motion.g initial={{opacity:0,scale:.65}} animate={{opacity:1,scale:1}} transition={{delay:i*.08,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x={slotX(i)} y="55" width="58" height="68" rx="10" fill={active?"#fef3c7":"#fff"} stroke={active?AMBER:INK} strokeWidth={active?2.5:1.8}/><text x={slotX(i)+29} y="97" textAnchor="middle" fontFamily={FONT} fontSize="23" fontWeight="900" fill={active?AMBER:IND}>{label}</text></motion.g>;
  const CardRow=({values,y,color}:{values:number[];y:number;color:string})=><g>{values.map((d,i)=><motion.g key={d} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:.15+i*.08}}><rect x={154+i*35} y={y} width="28" height="34" rx="6" fill={`${color}16`} stroke={color}/><text x={168+i*35} y={y+23} textAnchor="middle" fontFamily={FONT} fontSize="14" fontWeight="900" fill={color}>{d}</text></motion.g>)}</g>;

  return <div style={{width:"100%",minWidth:0,display:"flex",justifyContent:"center",padding:"5px 3px",boxSizing:"border-box"}}><svg viewBox="0 0 440 285" width="100%" style={{maxWidth:470,minWidth:0,display:"block"}} aria-label="Four digit slots split into ending five and ending zero cases">
    <text x="220" y="19" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>{phase===0?"ending in 5: keep 5 fixed and deal three different smaller digits":phase===1?"ending in 0: place the required 5 in one of the first three slots":"merge the two disjoint terminal-digit branches"}</text>
    {phase===0&&<g>
      {["?","?","?","5"].map((v,i)=><Slot key={i} i={i} label={v} active={i===3}/>)}
      <text x="220" y="145" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>possible cards for the leading slot</text><CardRow values={small} y={154} color={IND}/>
      <text x="220" y="211" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="900" fill={INK}>leading: {case5Lead} choices</text>
      <motion.text x="220" y="239" textAnchor="middle" fontFamily={FONT} fontSize="20" fontWeight="900" fill={TEAL} initial={{scale:.6,opacity:0}} animate={{scale:1,opacity:1}}>{case5Lead} × {case5Middle} × {case5Last} = {case5}</motion.text>
      <text x="220" y="260" textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM}>then {case5Middle} cards remain, then {case5Last}</text>
    </g>}
    {phase===1&&<g>
      {["?","?","?","0"].map((v,i)=><Slot key={i} i={i} label={v} active={i===3}/>)}
      {[0,1,2].map(i=><motion.g key={i} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:.15+i*.12}} style={{transformBox:"fill-box",transformOrigin:"center"}}><circle cx={slotX(i)+29} cy="89" r="20" fill="#fef3c7" stroke={AMBER} strokeWidth="2"/><text x={slotX(i)+29} y="96" textAnchor="middle" fontFamily={FONT} fontSize="18" fontWeight="900" fill={AMBER}>5</text></motion.g>)}
      <text x="220" y="151" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={AMBER}>3 possible positions for the required 5</text>
      <CardRow values={small} y={165} color={IND}/><text x="220" y="220" textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM}>choose two distinct cards from 1, 2, 3, 4</text>
      <motion.text x="220" y="251" textAnchor="middle" fontFamily={FONT} fontSize="20" fontWeight="900" fill={TEAL} initial={{scale:.6,opacity:0}} animate={{scale:1,opacity:1}}>{case0Pos} × {case0First} × {case0Second} = {case0}</motion.text>
    </g>}
    {phase===2&&<g>
      <motion.g initial={{x:-35,opacity:0}} animate={{x:0,opacity:1}}><rect x="42" y="57" width="142" height="86" rx="15" fill="#eef2ff" stroke={IND} strokeWidth="2"/><text x="113" y="82" textAnchor="middle" fontSize="11" fontWeight="850" fill={IND}>ends in 5</text><text x="113" y="119" textAnchor="middle" fontFamily={FONT} fontSize="27" fontWeight="900" fill={IND}>{case5}</text></motion.g>
      <motion.g initial={{x:35,opacity:0}} animate={{x:0,opacity:1}}><rect x="256" y="57" width="142" height="86" rx="15" fill="#ecfeff" stroke={TEAL} strokeWidth="2"/><text x="327" y="82" textAnchor="middle" fontSize="11" fontWeight="850" fill={TEAL}>ends in 0</text><text x="327" y="119" textAnchor="middle" fontFamily={FONT} fontSize="27" fontWeight="900" fill={TEAL}>{case0}</text></motion.g>
      <motion.path d="M184 100 H256" stroke={AMBER} strokeWidth="3" initial={{pathLength:0}} animate={{pathLength:1}}/><circle cx="220" cy="100" r="15" fill="#fff" stroke={AMBER} strokeWidth="2"/><text x="220" y="106" textAnchor="middle" fontSize="20" fontWeight="900" fill={AMBER}>+</text>
      <motion.text x="220" y="190" textAnchor="middle" fontFamily={FONT} fontSize="27" fontWeight="900" fill={ok?GREEN:RED} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}}>{case5} + {case0} = {total}</motion.text>
      <text x="220" y="214" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={ok?GREEN:RED}>{ok?"every valid number ends in exactly one branch":"digit count or stored-answer check failed"}</text>
      <AnimatePresence>{ok&&<motion.g initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} transition={{delay:.5,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="174" y="231" width="92" height="27" rx="14" fill={GREEN}/><text x="220" y="249" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">Answer {problem.answer}</text></motion.g>}</AnimatePresence>
    </g>}
    <motion.g key={phase} initial={{opacity:0}} animate={{opacity:1}}><rect x="102" y="266" width="236" height="18" rx="9" fill={final?(ok?"#dcfce7":"#fee2e2"):"#eef2ff"}/><text x="220" y="279" textAnchor="middle" fontFamily={FONT} fontSize="9.5" fontWeight="850" fill={final?(ok?GREEN:RED):IND}>{phase===0?"___5 gives 4 · 4 · 3":phase===1?"the 5 moves; two smaller nonzero digits follow":ok?"the two endings cannot overlap":"self-check failed"}</text></motion.g>
  </svg></div>;
}
