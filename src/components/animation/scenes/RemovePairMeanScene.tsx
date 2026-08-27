import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",TEAL="#0d9488",GOLD="#d97706",GREEN="#16a34a",RED="#dc2626",DIM="#64748b";

/** Balance the source set around its mean, expose the removed-sum gap, then enumerate the distinct pairs that fill it. */
export function RemovePairMeanScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem),values=(Array.isArray(data.values)?data.values:[]).map(Number),remain=Math.round(num(data.remainingCount,0)),mean=num(data.targetMean,0);
  const original=values.reduce((s,v)=>s+v,0),remaining=remain*mean,removed=original-remaining;
  const pairs:Array<[number,number]>=[];for(let i=0;i<values.length;i++)for(let j=i+1;j<values.length;j++)if(values[i]+values[j]===removed)pairs.push([values[i],values[j]]);
  const choice=problem.choices?.find(c=>Number(c.text)===pairs.length)?.label;
  const ok=original===66&&remaining===54&&removed===12&&pairs.length===5&&String(pairs.length)===problem.shortAnswer&&choice===problem.answer;
  const failure=removed!==12?`removed target is ${removed}, expected 12`:String(pairs.length)!==problem.shortAnswer?`found ${pairs.length}; stored ${problem.shortAnswer}`:`choice ${choice??"missing"}; stored ${problem.answer}`;
  const final=step>=totalSteps-1,phase=final?3:Math.min(step,2),x=(i:number)=>45+i*35;
  const Token=({cx,cy,v,active=false,muted=false}:{cx:number;cy:number;v:number;active?:boolean;muted?:boolean})=><g opacity={muted ? 0.28 : 1}><circle cx={cx} cy={cy} r="14" fill={active?"#dcfce7":"#eef2ff"} stroke={active?GREEN:IND} strokeWidth="2"/><text x={cx} y={cy+5} textAnchor="middle" fontSize="12" fontWeight="900" fill={active?GREEN:IND} fontFamily={FONT}>{v}</text></g>;
  return <div style={{display:"flex",justifyContent:"center",width:"100%",minWidth:0,padding:"6px 4px",boxSizing:"border-box"}}><svg viewBox="0 0 440 310" width="100%" style={{maxWidth:470,minWidth:0,display:"block"}}>
    <text x="220" y="18" textAnchor="middle" fontSize="11.2" fontWeight="850" fill={INK}>{phase===0?"pair the original set around its center value 6":phase===1?"nine remaining numbers with mean 6 must fill nine equal slots":phase===2?"the removed pair must fill the gap between the two totals":"deal distinct tokens into every pair that sums to 12"}</text>
    {phase===0&&<>
      <g>{values.map((v,i)=><motion.g key={v} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*.06}}><Token cx={x(i)} cy={128} v={v} active={v===mean}/></motion.g>)}</g>
      {Array.from({length:5},(_,i)=>{const a=i,b=10-i;return <motion.path key={i} d={`M${x(a)} 108 Q${(x(a)+x(b))/2} ${48+i*8} ${x(b)} 108`} fill="none" stroke={i%2?TEAL:GOLD} strokeWidth="2" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:.5+i*.1}}/>})}
      <text x="220" y="51" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>five balanced pairs, each averaging 6</text>
      <g transform="translate(96 171)"><rect width="248" height="44" rx="11" fill="#f8fafc" stroke={INK}/><text x="124" y="28" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>11 numbers × mean 6 = {original}</text></g>
      <text x="220" y="245" textAnchor="middle" fontSize="11" fontWeight="850" fill={TEAL}>the center token 6 balances itself</text>
    </>}
    {phase===1&&<>
      <g transform="translate(57 59)">{Array.from({length:remain},(_,i)=><motion.g key={i} initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{delay:i*.07}}><rect x={(i%5)*67} y={Math.floor(i/5)*64} width="54" height="48" rx="9" fill="#ecfeff" stroke={TEAL} strokeWidth="2"/><text x={(i%5)*67+27} y={Math.floor(i/5)*64+20} textAnchor="middle" fontSize="8.5" fontWeight="850" fill={DIM}>slot {i+1}</text><text x={(i%5)*67+27} y={Math.floor(i/5)*64+39} textAnchor="middle" fontSize="17" fontWeight="900" fill={TEAL} fontFamily={FONT}>{mean}</text></motion.g>)}</g>
      <motion.path d="M84 193 C84 224 220 207 220 239 M151 193 C151 224 220 207 220 239 M218 193V239 M285 193 C285 224 220 207 220 239" fill="none" stroke={TEAL} strokeWidth="1.8" initial={{pathLength:0}} animate={{pathLength:1}}/>
      <g transform="translate(119 241)"><rect width="202" height="43" rx="11" fill="#ecfeff" stroke={TEAL} strokeWidth="2"/><text x="101" y="27" textAnchor="middle" fontSize="17" fontWeight="900" fill={TEAL} fontFamily={FONT}>{remain} × {mean} = {remaining}</text></g>
    </>}
    {phase===2&&<>
      <g transform="translate(50 56)"><rect width="142" height="66" rx="12" fill="#eef2ff" stroke={IND} strokeWidth="2"/><text x="71" y="22" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>original set</text><text x="71" y="50" textAnchor="middle" fontSize="24" fontWeight="900" fill={IND} fontFamily={FONT}>{original}</text><rect x="198" width="142" height="66" rx="12" fill="#ecfeff" stroke={TEAL} strokeWidth="2"/><text x="269" y="22" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>remaining total</text><text x="269" y="50" textAnchor="middle" fontSize="24" fontWeight="900" fill={TEAL} fontFamily={FONT}>{remaining}</text></g>
      <motion.g initial={{x:-55,opacity:0}} animate={{x:0,opacity:1}} transition={{type:"spring",stiffness:150,damping:18}}><path d="M114 154H326" stroke={INK} strokeWidth="4" strokeLinecap="round"/><path d="M326 154l-10-6v12z" fill={INK}/><text x="220" y="145" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>{original} − {remaining}</text></motion.g>
      <g transform="translate(134 184)"><rect width="172" height="64" rx="13" fill="#fff7ed" stroke={GOLD} strokeWidth="2.5"/><text x="86" y="23" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>removed pair must total</text><text x="86" y="50" textAnchor="middle" fontSize="25" fontWeight="900" fill={GOLD} fontFamily={FONT}>{removed}</text></g>
      <text x="220" y="277" textAnchor="middle" fontSize="11" fontWeight="850" fill={GOLD}>now the subset search has one exact target</text>
    </>}
    {phase===3&&<>
      <g transform="translate(46 48)">{pairs.map(([a,b],i)=>{const px=(i%3)*121,py=Math.floor(i/3)*66;return <motion.g key={a} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*.13}}><rect x={px} y={py} width="105" height="52" rx="10" fill="#dcfce7" stroke={GREEN} strokeWidth="2"/><Token cx={px+27} cy={py+26} v={a} active/><text x={px+52} y={py+31} textAnchor="middle" fontSize="14" fontWeight="900" fill={DIM}>+</text><Token cx={px+78} cy={py+26} v={b} active/></motion.g>})}</g>
      <g transform="translate(288 114)"><rect width="105" height="52" rx="10" fill="#f8fafc" stroke="#cbd5e1"/><Token cx={27} cy={26} v={6} muted/><text x="52" y="31" textAnchor="middle" fontSize="14" fontWeight="900" fill={DIM}>+</text><Token cx={78} cy={26} v={6} muted/><motion.line x1="8" y1="45" x2="97" y2="7" stroke={RED} strokeWidth="3" initial={{pathLength:0}} animate={{pathLength:1}}/><text x="52" y="69" textAnchor="middle" fontSize="8.5" fontWeight="850" fill={RED}>only one 6 token</text></g>
      <text x="220" y="209" textAnchor="middle" fontSize="12" fontWeight="900" fill={GOLD} fontFamily={FONT}>each green pair totals {removed}</text>
      <motion.g initial={{scale:.6}} animate={{scale:1}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="126" y="228" width="188" height="49" rx="12" fill={ok?"#dcfce7":"#fee2e2"} stroke={ok?GREEN:RED} strokeWidth="2"/><text x="220" y="248" textAnchor="middle" fontSize="10" fontWeight="850" fill={ok?GREEN:RED}>valid two-element subsets</text><text x="220" y="270" textAnchor="middle" fontSize="22" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT}>{pairs.length}</text></motion.g>
      <SvgAnswerBadge show={ok} answer={problem.answer} cx={381} y={244} width={76}/>
    </>}
    <AnimatePresence>{final&&!ok&&<motion.text x="220" y="306" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
  </svg></div>;
}
