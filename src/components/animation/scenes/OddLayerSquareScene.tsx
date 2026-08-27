import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",TEAL="#0d9488",GOLD="#d97706",GREEN="#16a34a",RED="#dc2626",DIM="#64748b";

/** Add each odd daily widget count as the next L-border, growing an n×n square. */
export function OddLayerSquareScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem),days=Math.round(num(data.days,0)),first=Math.round(num(data.first,0)),increment=Math.round(num(data.increment,0));
  const terms=Array.from({length:days},(_,i)=>first+i*increment),last=terms.at(-1)??0,total=terms.reduce((s,v)=>s+v,0),square=days*days;
  const choice=problem.choices?.find(c=>Number(c.text)===total)?.label;
  const ok=first===1&&increment===2&&total===square&&String(total)===problem.shortAnswer&&choice===problem.answer;
  const failure=total!==square?`odd sum ${total} does not equal ${days}²=${square}`:String(total)!==problem.shortAnswer?`computed ${total}; stored ${problem.shortAnswer}`:`choice ${choice??"missing"}; stored ${problem.answer}`;
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1);
  const grid=180,cell=grid/days,gx=130,gy=48;
  const shown=[0,1,2,3,4,days-1].filter((v,i,a)=>a.indexOf(v)===i);
  const colors=["#c7d2fe","#99f6e4","#fde68a","#bfdbfe"];
  return <div style={{display:"flex",justifyContent:"center",width:"100%",minWidth:0,padding:"6px 4px",boxSizing:"border-box"}}><svg viewBox="0 0 440 300" width="100%" style={{maxWidth:470,minWidth:0,display:"block"}}>
    <text x="220" y="18" textAnchor="middle" fontSize="11.2" fontWeight="850" fill={INK}>{phase===0?`daily piles are the first ${days} odd numbers`:phase===1?"each odd pile wraps around as one new L-shaped border":`${days} odd layers have become a ${days} × ${days} square`}</text>
    {phase===0&&<>
      <line x1="35" y1="215" x2="405" y2="215" stroke="#cbd5e1" strokeWidth="2"/>
      {shown.map((index,k)=>{const value=terms[index],x=44+k*66,h=28+value/last*105;return <motion.g key={index} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:k*.1}}><rect x={x} y={215-h} width="42" height={h} rx="7" fill={index===days-1?"#fff7ed":"#eef2ff"} stroke={index===days-1?GOLD:IND} strokeWidth="2"/><text x={x+21} y={207} textAnchor="middle" fontSize="15" fontWeight="900" fill={index===days-1?GOLD:IND} fontFamily={FONT}>{value}</text><text x={x+21} y="235" textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM}>day {index+1}</text>{k===4&&<text x={x+53} y="180" textAnchor="middle" fontSize="20" fontWeight="900" fill={DIM}>…</text>}</motion.g>})}
      <g transform="translate(74 253)"><rect width="292" height="34" rx="10" fill="#f8fafc" stroke="#cbd5e1"/><text x="146" y="22" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>1, 3, 5, …, {last} = 2({days}) − 1</text></g>
    </>}
    {phase>=1&&<>
      <g>{Array.from({length:days},(_,r)=>Array.from({length:days},(_,c)=>{const layer=Math.max(r,c);return <motion.rect key={`${r}-${c}`} x={gx+c*cell} y={gy+r*cell} width={cell-.35} height={cell-.35} fill={colors[layer%colors.length]} stroke="#fff" strokeWidth=".25" initial={{opacity:0,scale:.25}} animate={{opacity:1,scale:1}} transition={{delay:layer*.035}} style={{transformBox:"fill-box",transformOrigin:"center"}}/>}))}</g>
      <rect x={gx} y={gy} width={grid} height={grid} fill="none" stroke={INK} strokeWidth="2"/>
      {phase===1&&<>
        <motion.path d={`M${gx+grid-cell/2} ${gy+2}V${gy+grid-cell/2}H${gx+2}`} fill="none" stroke={GOLD} strokeWidth="3" initial={{pathLength:0}} animate={{pathLength:1}}/>
        <rect x="24" y="76" width="86" height="82" rx="11" fill="#fff7ed" stroke={GOLD}/><text x="67" y="97" textAnchor="middle" fontSize="10" fontWeight="850" fill={GOLD}>day {days}</text><text x="67" y="124" textAnchor="middle" fontSize="22" fontWeight="900" fill={GOLD} fontFamily={FONT}>{last}</text><text x="67" y="145" textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM}>new tiles</text>
        <path d={`M110 117 C120 117 117 ${gy+grid-cell/2} ${gx-5} ${gy+grid-cell/2}`} fill="none" stroke={GOLD} strokeWidth="2"/>
        <text x="220" y="252" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>border n has n tiles across + (n − 1) down</text><text x="220" y="274" textAnchor="middle" fontSize="15" fontWeight="900" fill={GOLD} fontFamily={FONT}>{days} + {days-1} = {last}</text>
      </>}
      {phase===2&&<>
        <motion.path d={`M${gx} 244v11h${grid}v-11`} fill="none" stroke={TEAL} strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}}/><text x={gx+grid/2} y="272" textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={FONT}>{days} widgets wide</text>
        <motion.path d={`M322 ${gy}h11v${grid}h-11`} fill="none" stroke={IND} strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}}/><text x="351" y={gy+grid/2} textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT} transform={`rotate(90 351 ${gy+grid/2})`}>{days} high</text>
        <g transform="translate(22 85)"><motion.rect width="91" height="75" rx="12" fill={ok?"#dcfce7":"#fee2e2"} stroke={ok?GREEN:RED} strokeWidth="2" initial={{scale:.6}} animate={{scale:1}} style={{transformBox:"fill-box",transformOrigin:"center"}}/><text x="45.5" y="23" textAnchor="middle" fontSize="10" fontWeight="850" fill={ok?GREEN:RED}>all widgets</text><text x="45.5" y="49" textAnchor="middle" fontSize="18" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT}>{days}²</text><text x="45.5" y="67" textAnchor="middle" fontSize="14" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT}>= {total}</text></g>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={70} y={176} width={76}/>
      </>}
    </>}
    <AnimatePresence>{final&&!ok&&<motion.text x="220" y="295" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
  </svg></div>;
}
