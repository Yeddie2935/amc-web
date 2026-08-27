import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",TEAL="#0d9488",GOLD="#d97706",GREEN="#16a34a",RED="#dc2626",DIM="#64748b";

/** Equalize four consecutive odd terms at their common center, expose an 8-factor, then sieve the choices. */
export function FourOddSumSieveScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem),count=Math.round(num(data.count,0)),gap=Math.round(num(data.gap,0)),choices=(Array.isArray(data.choices)?data.choices:[]).map(Number);
  const offsets=Array.from({length:count},(_,i)=>i*gap),offsetSum=offsets.reduce((s,v)=>s+v,0),averageOffset=offsetSum/count;
  const remainders=choices.map(v=>((v%8)+8)%8),bad=choices.filter((_,i)=>remainders[i]!==0),answer=bad[0]??NaN,choice=problem.choices?.find(c=>Number(c.text)===answer)?.label;
  const ok=count===4&&gap===2&&averageOffset===3&&bad.length===1&&String(answer)===problem.shortAnswer&&choice===problem.answer;
  const failure=bad.length!==1?`${bad.length} choices fail divisibility by 8`:String(answer)!==problem.shortAnswer?`computed ${answer}; stored ${problem.shortAnswer}`:`choice ${choice??"missing"}; stored ${problem.answer}`;
  const final=step>=totalSteps-1,phase=final?3:Math.min(step,2),cx=(i:number)=>91+i*86;
  const term=(i:number)=>i===0?"n":`n+${offsets[i]}`;
  return <div style={{display:"flex",justifyContent:"center",width:"100%",minWidth:0,padding:"6px 4px",boxSizing:"border-box"}}><svg viewBox="0 0 450 310" width="100%" style={{maxWidth:480,minWidth:0,display:"block"}}>
    <text x="225" y="18" textAnchor="middle" fontSize="11.2" fontWeight="850" fill={INK}>{phase===0?"place four odd numbers two units apart":phase===1?"move equal amounts inward: all four terms balance at n + 3":phase===2?"n + 3 is even, so four equal stacks lock into groups of 8":"send every answer choice through the multiple-of-8 gate"}</text>
    {phase===0&&<>
      <line x1="63" y1="132" x2="387" y2="132" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round"/>
      {offsets.map((off,i)=><motion.g key={off} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:i*.15}} style={{transformBox:"fill-box",transformOrigin:"center"}}><circle cx={cx(i)} cy="132" r="24" fill="#eef2ff" stroke={IND} strokeWidth="2.5"/><text x={cx(i)} y="138" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>{term(i)}</text>{i<count-1&&<motion.path d={`M${cx(i)+27} 103 Q${(cx(i)+cx(i+1))/2} 82 ${cx(i+1)-27} 103`} fill="none" stroke={GOLD} strokeWidth="2" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:.4+i*.12}}/>}<text x={cx(i)} y="171" textAnchor="middle" fontSize="9" fontWeight="850" fill={GOLD}>{i===0?"odd":"odd + even = odd"}</text></motion.g>)}
      <g transform="translate(68 211)"><rect width="314" height="45" rx="11" fill="#f8fafc" stroke={INK}/><text x="157" y="28" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>n + (n+2) + (n+4) + (n+6)</text></g>
      <text x="225" y="282" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>the common difference is {gap}</text>
    </>}
    {phase===1&&<>
      <g transform="translate(55 48)">{offsets.map((off,i)=>{const delta=off-averageOffset;return <motion.g key={off} initial={{x:delta*7,opacity:.5}} animate={{x:0,opacity:1}} transition={{type:"spring",stiffness:130,damping:17,delay:i*.1}}><rect x={i*86} width="68" height="68" rx="11" fill="#ecfeff" stroke={TEAL} strokeWidth="2"/><text x={i*86+34} y="30" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>{term(i)}</text><text x={i*86+34} y="54" textAnchor="middle" fontSize="16" fontWeight="900" fill={TEAL} fontFamily={FONT}>n+3</text>{delta!==0&&<text x={i*86+34} y="88" textAnchor="middle" fontSize="9.5" fontWeight="900" fill={delta<0?GOLD:IND} fontFamily={FONT}>{delta<0?`receive ${-delta}`:`give ${delta}`}</text>}</motion.g>})}</g>
      <motion.path d="M83 151 C83 183 367 183 367 151 M169 151 C169 169 281 169 281 151" fill="none" stroke={GOLD} strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}}/>
      <text x="225" y="198" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>−3, −1, +1, +3 balance to zero</text>
      <g transform="translate(111 218)"><rect width="228" height="50" rx="12" fill="#ecfeff" stroke={TEAL} strokeWidth="2"/><text x="114" y="20" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK} fontFamily={FONT}>same total, four equal terms</text><text x="114" y="41" textAnchor="middle" fontSize="18" fontWeight="900" fill={TEAL} fontFamily={FONT}>= 4(n+3)</text></g>
    </>}
    {phase===2&&<>
      <g transform="translate(44 48)">{Array.from({length:count},(_,i)=><motion.g key={i} initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{delay:i*.12}}><rect x={i*91} width="75" height="76" rx="11" fill="#eef2ff" stroke={IND} strokeWidth="2"/><text x={i*91+37.5} y="23" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK} fontFamily={FONT}>n+3</text><g transform={`translate(${i*91+14} 34)`}>{[0,1].map(j=><g key={j}><circle cx={12+j*25} cy="12" r="10" fill="#dcfce7" stroke={GREEN}/><text x={12+j*25} y="16" textAnchor="middle" fontSize="8" fontWeight="900" fill={GREEN}>k</text></g>)}</g><text x={i*91+37.5} y="69" textAnchor="middle" fontSize="9" fontWeight="900" fill={GREEN} fontFamily={FONT}>= 2k</text></motion.g>)}</g>
      <text x="225" y="148" textAnchor="middle" fontSize="13" fontWeight="900" fill={GOLD} fontFamily={FONT}>n odd  ⇒  n+3 even  ⇒  n+3 = 2k</text>
      <motion.path d="M81 174 C81 211 225 194 225 226 M172 174 C172 202 225 194 225 226 M263 174 C263 202 225 194 225 226 M354 174 C354 211 225 194 225 226" fill="none" stroke={GREEN} strokeWidth="2" initial={{pathLength:0}} animate={{pathLength:1}}/>
      <g transform="translate(116 229)"><rect width="218" height="49" rx="12" fill="#dcfce7" stroke={GREEN} strokeWidth="2"/><text x="109" y="20" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK} fontFamily={FONT}>4(n+3) = 4(2k)</text><text x="109" y="41" textAnchor="middle" fontSize="20" fontWeight="900" fill={GREEN} fontFamily={FONT}>= 8k</text></g>
      <text x="225" y="299" textAnchor="middle" fontSize="10" fontWeight="850" fill={GREEN}>every possible sum is a multiple of 8</text>
    </>}
    {phase===3&&<>
      <g transform="translate(43 49)">{choices.map((v,i)=>{const pass=remainders[i]===0,x=(i%3)*122,y=Math.floor(i/3)*74;return <motion.g key={v} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*.12}}><rect x={x} y={y} width="106" height="59" rx="11" fill={pass?"#dcfce7":"#fee2e2"} stroke={pass?GREEN:RED} strokeWidth="2"/><text x={x+27} y={y+36} textAnchor="middle" fontSize="18" fontWeight="900" fill={pass?GREEN:RED} fontFamily={FONT}>{v}</text><text x={x+75} y={y+23} textAnchor="middle" fontSize="8.5" fontWeight="850" fill={DIM}>÷ 8</text><text x={x+75} y={y+42} textAnchor="middle" fontSize="11" fontWeight="900" fill={pass?GREEN:RED} fontFamily={FONT}>r {remainders[i]} {pass?"✓":"✗"}</text></motion.g>})}</g>
      <text x="225" y="205" textAnchor="middle" fontSize="12" fontWeight="900" fill={RED} fontFamily={FONT}>{answer} = 8 × {Math.floor(answer/8)} + {answer%8}</text>
      <motion.g initial={{scale:.6}} animate={{scale:1}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="126" y="225" width="198" height="52" rx="12" fill={ok?"#dcfce7":"#fee2e2"} stroke={ok?GREEN:RED} strokeWidth="2"/><text x="225" y="246" textAnchor="middle" fontSize="10" fontWeight="850" fill={ok?GREEN:RED}>the only impossible choice</text><text x="225" y="270" textAnchor="middle" fontSize="23" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT}>{answer}</text></motion.g>
      <SvgAnswerBadge show={ok} answer={problem.answer} cx={390} y={245} width={76}/>
    </>}
    <AnimatePresence>{final&&!ok&&<motion.text x="225" y="306" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
  </svg></div>;
}
