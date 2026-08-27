import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace"; const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",AMBER="#d97706",RED="#dc2626",DIM="#64748b";

/** Fill trapezoid CBFE, lift out its two white crossing triangles, and leave the bat wings. */
export function BatWingAreaSubtractScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem); const width=num(data.width,0),height=num(data.height,0),segment=num(data.segment,0);
  const topBase=width-2*segment,bottomBase=width; const trapezoid=(topBase+bottomBase)*height/2;
  const topHeight=height*(width-2*segment)/(2*(width-segment)); const bottomHeight=height-topHeight;
  const small=topBase*topHeight/2,large=bottomBase*bottomHeight/2,wings=trapezoid-small-large;
  const halfText=(value:number)=>Number.isInteger(value)?String(value):`${Math.round(value*2)}/2`;
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1); const choice=problem.choices?.find(c=>Number(String(c.text).replace(/\s.*\/.*$/, ""))===wings)?.label;
  const ok=Math.abs(topHeight-1)<1e-9&&Math.abs(wings-Number(problem.shortAnswer))<1e-9&&choice===problem.answer;
  const failure=Math.abs(topHeight-1)>1e-9?`diagonal intersection height is ${topHeight}, not 1`:wings!==Number(problem.shortAnswer)?`computed ${wings}, stored ${problem.shortAnswer}`:`choice ${choice??"missing"}, stored ${problem.answer}`;
  const D=[72,40],C=[162,40],B=[252,40],A=[342,40],E=[72,250],F=[342,250],X=[207,92.5]; const pts=(p:number[][])=>p.map(q=>q.join(",")).join(" ");
  return <div style={{display:"flex",justifyContent:"center",width:"100%",minWidth:0,padding:"6px 4px",boxSizing:"border-box"}}><svg viewBox="0 0 460 350" width="100%" style={{width:"100%",maxWidth:"100%",minWidth:0,display:"block"}}>
    <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"fill the larger trapezoid CBFE around both wings":phase===1?"lift out the two white triangles made by the crossing diagonals":"only the two bat-wing triangles remain"}</text>
    <g><rect x={D[0]} y={D[1]} width={A[0]-D[0]} height={E[1]-D[1]} fill="#fff" stroke={INK} strokeWidth="2.3"/>
      {phase===0&&<motion.polygon points={pts([C,B,F,E])} fill="#e0e7ff" stroke={IND} strokeWidth="2.8" initial={{opacity:0}} animate={{opacity:.88}}/>}
      {phase>=1&&<><polygon points={pts([C,X,E])} fill="#1f2a44"/><polygon points={pts([B,X,F])} fill="#1f2a44"/><motion.polygon points={pts([C,B,X])} fill="#fff" stroke={AMBER} strokeWidth="2.3" initial={{opacity:.2,scale:.85}} animate={{opacity:phase===2?.12:1,scale:phase===2?.85:1,y:phase===2?-20:0}} transition={{duration:.8}} style={{transformBox:"fill-box",transformOrigin:"center"}}/><motion.polygon points={pts([E,F,X])} fill="#fff" stroke={AMBER} strokeWidth="2.3" initial={{opacity:.2,scale:.85}} animate={{opacity:phase===2?.12:1,scale:phase===2?.88:1,y:phase===2?22:0}} transition={{duration:.8}} style={{transformBox:"fill-box",transformOrigin:"center"}}/></>}
      <line x1={C[0]} y1={C[1]} x2={F[0]} y2={F[1]} stroke={phase===0?IND:INK} strokeWidth="1.5"/><line x1={B[0]} y1={B[1]} x2={E[0]} y2={E[1]} stroke={phase===0?IND:INK} strokeWidth="1.5"/>
      {[[D,"D"],[C,"C"],[B,"B"],[A,"A"],[E,"E"],[F,"F"]].map(([p,label])=>{const q=p as number[];return <text key={label as string} x={q[0]} y={q[1]+(q[1]<100?-9:18)} textAnchor="middle" fontSize="12" fontWeight="900" fill={INK}>{label as string}</text>})}
      {[117,207,297].map((x,i)=><g key={x}><line x1={x} y1="35" x2={x} y2="45" stroke={INK}/><text x={x} y="31" textAnchor="middle" fontSize="10" fontWeight="900" fill={DIM} fontFamily={FONT}>{segment}</text></g>)}<text x="358" y="149" fontSize="12" fontWeight="900" fill={DIM} fontFamily={FONT}>{height}</text>
    </g>
    {phase===0&&<><g transform="translate(24 270)"><line x1="48" y1="0" x2="318" y2="0" stroke={IND} strokeWidth="2"/><text x="183" y="18" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>parallel bases {topBase} and {bottomBase}, height {height}</text></g><text x="230" y="312" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>(({topBase}+{bottomBase}) ÷ 2) × {height} = {trapezoid}</text></>}
    {phase===1&&<><rect x="9" y="78" width="55" height="47" rx="9" fill="#fff7ed" stroke={AMBER}/><text x="36.5" y="96" textAnchor="middle" fontSize="8.5" fontWeight="850" fill={DIM}>TOP WHITE</text><text x="36.5" y="116" textAnchor="middle" fontSize="13" fontWeight="900" fill={AMBER} fontFamily={FONT}>½·1·1=½</text><rect x="361" y="181" width="91" height="49" rx="9" fill="#fff7ed" stroke={AMBER}/><text x="406.5" y="199" textAnchor="middle" fontSize="8.5" fontWeight="850" fill={DIM}>BOTTOM WHITE</text><text x="406.5" y="220" textAnchor="middle" fontSize="13" fontWeight="900" fill={AMBER} fontFamily={FONT}>½·3·3=9/2</text><text x="230" y="295" textAnchor="middle" fontSize="12" fontWeight="850" fill={DIM}>the intersection is 1 below the top, leaving height 3 below</text></>}
    {phase===2&&<><motion.rect x="91" y="267" width="278" height="43" rx="12" fill="#dcfce7" stroke={ok?GREEN:RED} strokeWidth="2.3" initial={{scale:.65}} animate={{scale:1}} style={{transformBox:"fill-box",transformOrigin:"center"}}/><text x="230" y="294" textAnchor="middle" fontSize="18" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT}>{trapezoid} − {halfText(small)} − {halfText(large)} = {wings}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={317} width={76}/></>}
    <AnimatePresence>{final&&!ok&&<motion.text x="230" y="348" textAnchor="middle" fill={RED} fontSize="10">{failure}</motion.text>}</AnimatePresence>
  </svg></div>;
}
