import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",INDIGO="#4338ca",TEAL="#0d9488",GOLD="#d97706",GREEN="#16a34a",RED="#dc2626",DIM="#64748b";

/** Reverse three digit cards, cancel common place-value parts, and read the difference's units digit. Data: { base, outerGap }. */
export function OuterDigitReverseScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem),base=Math.round(num(data.base,0)),gap=Math.round(num(data.outerGap,0));
  const placeFactor=base*base-1,difference=placeFactor*gap,units=((difference%base)+base)%base;
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1);
  const choice=problem.choices?.find((c)=>Number(c.text)===units)?.label;
  const ok=String(units)===problem.shortAnswer&&choice===problem.answer;
  const fail=`computed ${difference}, units ${units}; stored ${problem.shortAnswer ?? "missing"}`;

  const Card=({x,y,text,color}:{x:number;y:number;text:string;color:string})=><g><rect x={x} y={y} width="74" height="67" rx="12" fill={`${color}12`} stroke={color} strokeWidth="2.3"/><text x={x+37} y={y+42} textAnchor="middle" fontSize={text.length>2?21:28} fontWeight="950" fill={color} fontFamily={FONT}>{text}</text></g>;
  const Slots=({y,reversed,label}:{y:number;reversed:boolean;label:string})=><g>
    <text x="28" y={y+40} fontSize="12" fontWeight="900" fill={reversed?TEAL:INDIGO}>{label}</text>
    {["hundreds","tens","units"].map((p,i)=><text key={p} x={137+i*96} y={y-8} textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM}>{p.toUpperCase()}</text>)}
    <motion.g initial={reversed?{x:-192}:{y:-14,opacity:0}} animate={{x:0,y:0,opacity:1}} transition={{type:"spring",stiffness:150,damping:18}}><Card x={100} y={y} text={reversed?"c":"c+2"} color={reversed?TEAL:INDIGO}/></motion.g>
    <Card x={196} y={y} text="b" color={GOLD}/>
    <motion.g initial={reversed?{x:192}:{y:-14,opacity:0}} animate={{x:0,y:0,opacity:1}} transition={{type:"spring",stiffness:150,damping:18,delay:.12}}><Card x={292} y={y} text={reversed?"c+2":"c"} color={reversed?INDIGO:TEAL}/></motion.g>
  </g>;

  return <div style={{display:"flex",justifyContent:"center",width:"100%",minWidth:0,padding:"6px 4px",boxSizing:"border-box"}}><svg viewBox="0 0 460 330" width="100%" style={{maxWidth:490,display:"block"}}>
    <text x="230" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"reverse by swapping only the two outer digit cards":phase===1?"cancel what both numbers share in each place":"two extra hundreds minus two extra ones"}</text>

    {phase===0&&<>
      <Slots y={55} reversed={false} label="original"/>
      <motion.path d="M 137 132 C 137 170 329 170 329 208 M 329 132 C 329 162 137 178 137 208" fill="none" stroke={TEAL} strokeWidth="2.4" strokeDasharray="5 4" initial={{pathLength:0}} animate={{pathLength:1}}/>
      <Slots y={213} reversed label="reversed"/>
      <text x="233" y="305" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>the middle digit b never moves</text>
    </>}

    {phase===1&&<>
      <g fontFamily={FONT}>
        <text x="40" y="57" fontSize="11" fontWeight="850" fill={DIM}>ORIGINAL</text><text x="40" y="84" fontSize="17" fontWeight="950" fill={INDIGO}>100(c+{gap})</text><text x="183" y="84" fontSize="17" fontWeight="950" fill={GOLD}>+ 10b</text><text x="272" y="84" fontSize="17" fontWeight="950" fill={TEAL}>+ c</text>
        <text x="40" y="126" fontSize="11" fontWeight="850" fill={DIM}>REVERSED</text><text x="40" y="153" fontSize="17" fontWeight="950" fill={TEAL}>− 100c</text><text x="157" y="153" fontSize="17" fontWeight="950" fill={GOLD}>− 10b</text><text x="248" y="153" fontSize="17" fontWeight="950" fill={INDIGO}>− (c+{gap})</text>
      </g>
      <motion.line x1="174" y1="72" x2="231" y2="72" stroke={RED} strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}}/><motion.line x1="157" y1="141" x2="222" y2="141" stroke={RED} strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:.1}}/>
      <text x="360" y="116" textAnchor="middle" fontSize="10" fontWeight="900" fill={RED}>10b cancels</text>
      <motion.path d="M 88 164 C 88 200 129 202 151 222 M 301 164 C 301 199 273 206 253 222" fill="none" stroke={GOLD} strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:.25}}/>
      <motion.g initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.5}}>
        <rect x="78" y="220" width="304" height="70" rx="14" fill="#fef3c7" stroke={GOLD} strokeWidth="2.3"/>
        <text x="230" y="244" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>MATCHING c-PARTS CANCEL TOO</text>
        <text x="230" y="274" textAnchor="middle" fontSize="21" fontWeight="950" fill={GOLD} fontFamily={FONT}>100·{gap} − {gap} = {placeFactor}·{gap}</text>
      </motion.g>
      <text x="230" y="314" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>b and the actual value of c never affect the difference</text>
    </>}

    {phase===2&&<>
      <g transform="translate(62 51)"><rect width="336" height="67" rx="15" fill="#fef3c7" stroke={GOLD} strokeWidth="2.5"/><text x="168" y="25" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>PLACE-VALUE CHANGE</text><text x="168" y="53" textAnchor="middle" fontSize="23" fontWeight="950" fill={GOLD} fontFamily={FONT}>{base*base*gap} − {gap} = {difference}</text></g>
      <motion.path d="M 230 125 V 151" stroke={INDIGO} strokeWidth="3" initial={{pathLength:0}} animate={{pathLength:1}}/>
      <g transform="translate(101 162)">{String(difference).split("").map((d,i)=><motion.g key={i} initial={{opacity:0,y:-13}} animate={{opacity:1,y:0}} transition={{delay:i*.15}}><rect x={i*88} width="74" height="76" rx="13" fill={i===String(difference).length-1?"#dcfce7":"#eef2ff"} stroke={i===String(difference).length-1?GREEN:INDIGO} strokeWidth="2.5"/><text x={i*88+37} y="48" textAnchor="middle" fontSize="33" fontWeight="950" fill={i===String(difference).length-1?GREEN:INDIGO} fontFamily={FONT}>{d}</text><text x={i*88+37} y="68" textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM}>{["hundreds","tens","units"][i]}</text></motion.g>)}</g>
      <text x="230" y="268" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK}>units digit of {difference}</text><text x="230" y="299" textAnchor="middle" fontSize="26" fontWeight="950" fill={ok?GREEN:RED} fontFamily={FONT}>= {units}</text>
      <SvgAnswerBadge show={ok} answer={problem.answer} cx={412} y={297} width={72}/>{!ok&&<text x="230" y="326" textAnchor="middle" fontSize="9" fill={RED}>{fail}</text>}
    </>}
  </svg></div>;
}
