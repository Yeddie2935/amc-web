import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",TEAL="#0d9488",GOLD="#d97706",GREEN="#16a34a",RED="#dc2626",DIM="#64748b";

/** Feed constrained symbol bins into a four-slot plate factory, then isolate the one named target plate. */
export function LicensePlateFactoryScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem),counts=(Array.isArray(data.counts)?data.counts:[]).map(Number),target=String(data.target??"");
  const total=counts.reduce((p,v)=>p*v,1),answer=`1/${total}`,choice=problem.choices?.find(c=>c.text===answer)?.label;
  const ok=counts.join(",")==="5,21,20,10"&&target==="AMC8"&&answer===problem.shortAnswer&&choice===problem.answer;
  const failure=answer!==problem.shortAnswer?`computed ${answer}; stored ${problem.shortAnswer}`:`choice ${choice??"missing"}; stored ${problem.answer}`;
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1);
  const labels=["vowels","non-vowels","different non-vowels","digits"],examples=["A E I O U","21 letters","20 left","0 1 … 9"],slotX=(i:number)=>69+i*82;
  const Plate=({x,y,text,active=false}:{x:number,y:number,text:string,active?:boolean})=><g><rect x={x} y={y} width="164" height="54" rx="9" fill={active?"#fff7ed":"#f8fafc"} stroke={active?GOLD:INK} strokeWidth={active?3:2}/><circle cx={x+15} cy={y+27} r="4" fill="none" stroke={DIM}/><circle cx={x+149} cy={y+27} r="4" fill="none" stroke={DIM}/><text x={x+82} y={y+36} textAnchor="middle" fontSize="27" fontWeight="900" fill={active?GOLD:IND} fontFamily={FONT} letterSpacing="7">{text}</text></g>;
  return <div style={{display:"flex",justifyContent:"center",width:"100%",minWidth:0,padding:"6px 4px",boxSizing:"border-box"}}><svg viewBox="0 0 440 310" width="100%" style={{maxWidth:470,minWidth:0,display:"block"}}>
    <text x="220" y="18" textAnchor="middle" fontSize="11.2" fontWeight="850" fill={INK}>{phase===0?"four symbol bins feed the four plate positions":phase===1?"every path through the bins makes one valid plate":"only one path through the factory spells AMC8"}</text>
    {phase===0&&<>
      {counts.map((count,i)=><motion.g key={i} initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{delay:i*.12}}><rect x={slotX(i)} y="48" width="66" height="72" rx="11" fill={i===2?"#ecfeff":"#eef2ff"} stroke={i===2?TEAL:IND} strokeWidth="2"/><text x={slotX(i)+33} y="78" textAnchor="middle" fontSize="23" fontWeight="900" fill={i===2?TEAL:IND} fontFamily={FONT}>{count}</text><text x={slotX(i)+33} y="101" textAnchor="middle" fontSize="7.8" fontWeight="850" fill={INK}>{labels[i]}</text><text x={slotX(i)+33} y="136" textAnchor="middle" fontSize="8.5" fontWeight="850" fill={DIM} fontFamily={FONT}>{examples[i]}</text><motion.path d={`M${slotX(i)+33} 145V178`} stroke={i===2?TEAL:IND} strokeWidth="2" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:.4+i*.1}}/></motion.g>)}
      <g transform="translate(53 181)"><rect width="334" height="60" rx="13" fill="#f8fafc" stroke={INK} strokeWidth="2"/>{counts.map((count,i)=><g key={i}><rect x={21+i*78} y="11" width="58" height="38" rx="7" fill="#fff" stroke={IND}/><text x={50+i*78} y="37" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>?</text></g>)}</g>
      <text x="220" y="267" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={TEAL}>the third bin has 20 because the second consonant must differ</text>
    </>}
    {phase===1&&<>
      <g transform="translate(44 51)">{counts.map((count,i)=><g key={i}><motion.circle cx={36+i*89} cy="30" r="25" fill="#eef2ff" stroke={IND} strokeWidth="2" initial={{scale:.5}} animate={{scale:1}} transition={{delay:i*.1}} style={{transformBox:"fill-box",transformOrigin:"center"}}/><text x={36+i*89} y="37" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>{count}</text>{i<3&&<text x={80+i*89} y="37" textAnchor="middle" fontSize="17" fontWeight="900" fill={DIM}>×</text>}</g>)}</g>
      <motion.path d="M79 98 C79 135 220 124 220 159 M168 98 C168 135 220 124 220 159 M257 98 C257 135 220 124 220 159 M346 98 C346 135 220 124 220 159" fill="none" stroke={TEAL} strokeWidth="2" initial={{pathLength:0}} animate={{pathLength:1}}/>
      <g transform="translate(96 164)"><rect width="248" height="61" rx="13" fill="#ecfeff" stroke={TEAL} strokeWidth="2"/><text x="124" y="24" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK} fontFamily={FONT}>{counts.join(" × ")}</text><text x="124" y="49" textAnchor="middle" fontSize="22" fontWeight="900" fill={TEAL} fontFamily={FONT}>= {total}</text></g>
      <g transform="translate(67 244)">{[0,1,2].map(i=><motion.g key={i} initial={{opacity:0,x:-12}} animate={{opacity:.28+i*.22,x:0}} transition={{delay:.4+i*.12}}><rect x={i*108} width="94" height="34" rx="6" fill="#f8fafc" stroke={INK}/><text x={47+i*108} y="22" textAnchor="middle" fontSize="11" fontWeight="900" fill={DIM} fontFamily={FONT}>••••</text></motion.g>)}</g><text x="220" y="299" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>a stack representing all {total.toLocaleString()} valid plates</text>
    </>}
    {phase===2&&<>
      <g opacity=".24">{[0,1,2,3].map(i=><g key={i} transform={`translate(${117+i*5} ${49+i*5})`}><Plate x={0} y={0} text="••••"/></g>)}</g>
      <motion.g initial={{opacity:0,y:-25,scale:.7}} animate={{opacity:1,y:0,scale:1}} transition={{type:"spring",stiffness:180,damping:15}} style={{transformBox:"fill-box",transformOrigin:"center"}}><Plate x={138} y={81} text={target} active/></motion.g>
      <text x="220" y="158" textAnchor="middle" fontSize="11" fontWeight="850" fill={GOLD}>1 favorable plate</text>
      <g transform="translate(86 179)"><text x="41" y="25" textAnchor="middle" fontSize="22" fontWeight="900" fill={GOLD} fontFamily={FONT}>1</text><line x1="9" y1="34" x2="73" y2="34" stroke={INK} strokeWidth="2.5"/><text x="41" y="60" textAnchor="middle" fontSize="17" fontWeight="900" fill={INK} fontFamily={FONT}>{total}</text><text x="103" y="44" textAnchor="middle" fontSize="19" fontWeight="900" fill={DIM}>=</text><motion.rect x="132" width="143" height="66" rx="13" fill={ok?"#dcfce7":"#fee2e2"} stroke={ok?GREEN:RED} strokeWidth="2" initial={{scale:.6}} animate={{scale:1}} style={{transformBox:"fill-box",transformOrigin:"center"}}/><text x="203.5" y="42" textAnchor="middle" fontSize="20" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT}>{answer}</text></g>
      <SvgAnswerBadge show={ok} answer={problem.answer} cx={379} y={264} width={78}/><text x="194" y="284" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={ok?GREEN:RED}>{ok?"slot product, target count, fraction, and choice verified":failure}</text>
    </>}
    <AnimatePresence>{final&&!ok&&<motion.text x="220" y="307" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
  </svg></div>;
}
