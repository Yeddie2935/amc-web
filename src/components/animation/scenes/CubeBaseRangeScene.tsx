import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";
const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", WIN = "#16a34a", ORANGE = "#f59e0b", DIM = "#94a3b8";

/** Converts the numerical interval into its inclusive interval of cube bases.
 * Data: { lower, upper, firstBase, lastBase, firstCube, lastCube, answer }. */
export function CubeBaseRangeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem); const lower = Math.round(num(data.lower, 0)); const upper = Math.round(num(data.upper, 0));
  const first = Math.round(num(data.firstBase, 0)); const last = Math.round(num(data.lastBase, 0));
  const firstCube = Math.round(num(data.firstCube, 0)); const lastCube = Math.round(num(data.lastCube, 0)); const answer = Math.round(num(data.answer, 0));
  const count = last - first + 1; const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d]/g, ""));
  const ok = lower === 257 && upper === 262145 && first === 7 && last === 64 && firstCube === first ** 3 && lastCube === last ** 3 && count === answer && stored === count;
  const final = step >= totalSteps - 1; const W = 460;
  return <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:"100%", padding:"8px 4px" }}><svg viewBox={`0 0 ${W} 270`} width="100%" style={{maxWidth:470}}>
    <text x={W/2} y="18" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>{step===0 ? "find the first and last perfect cubes inside the interval" : final ? "every whole base from 7 through 64 contributes one cube" : "the cube values collapse the huge interval into a base interval"}</text>
    <AnimatePresence mode="wait">
      {step===0 && <motion.g key="bounds" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
        <rect x="35" y="55" width="390" height="72" rx="12" fill="#f8fafc" stroke="#cbd5e1"/>
        <text x="230" y="79" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>2⁸ + 1 = {lower}</text>
        <text x="230" y="108" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>2¹⁸ + 1 = {upper}</text>
        <motion.path d="M 68 177 H 392" stroke={DIM} strokeWidth="2" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:.6}}/>
        <motion.circle cx="122" cy="177" r="8" fill={ORANGE} initial={{scale:0}} animate={{scale:1}} transition={{type:"spring", stiffness:220, damping:15, delay:.35}}/><text x="122" y="158" textAnchor="middle" fontSize="13" fontWeight="900" fill={ORANGE} fontFamily={FONT}>{first}³ = {firstCube}</text>
        <motion.circle cx="350" cy="177" r="8" fill={WIN} initial={{scale:0}} animate={{scale:1}} transition={{type:"spring", stiffness:220, damping:15, delay:.55}}/><text x="350" y="158" textAnchor="middle" fontSize="13" fontWeight="900" fill={WIN} fontFamily={FONT}>{last}³ = {lastCube}</text>
        <text x="122" y="203" textAnchor="middle" fontSize="10" fontWeight="750" fill={DIM}>first cube ≥ {lower}</text><text x="350" y="203" textAnchor="middle" fontSize="10" fontWeight="750" fill={DIM}>last cube ≤ {upper}</text>
      </motion.g>}
      {step===1 && <motion.g key="bases" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
        <text x="230" y="56" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>cube bases</text><motion.line x1="48" y1="130" x2="412" y2="130" stroke={DIM} strokeWidth="3" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:.55}}/>
        {Array.from({length:count},(_,i)=>{const x=48+364*i/(count-1); return <motion.circle key={i} cx={x} cy="130" r={i===0||i===count-1?7:3.3} fill={i===0?ORANGE:i===count-1?WIN:IND} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.2+i*.018}}/>})}
        <text x="48" y="157" textAnchor="middle" fontSize="15" fontWeight="900" fill={ORANGE} fontFamily={FONT}>{first}</text><text x="412" y="157" textAnchor="middle" fontSize="15" fontWeight="900" fill={WIN} fontFamily={FONT}>{last}</text>
        <text x="230" y="202" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>{first}³, {first+1}³, …, {last-1}³, {last}³</text><text x="230" y="226" textAnchor="middle" fontSize="11" fontWeight="750" fill={DIM}>one perfect cube for every marked base</text>
      </motion.g>}
      {final && <motion.g key="count" initial={{opacity:0}} animate={{opacity:1}}>
        <text x="230" y="52" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>bases {first} through {last}</text>
        {Array.from({length:count},(_,i)=>{const col=i%10,row=Math.floor(i/10);return <motion.g key={i} initial={{opacity:0,scale:.4}} animate={{opacity:1,scale:1}} transition={{type:"spring",stiffness:260,damping:16,delay:i*.025}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x={75+col*31} y={72+row*25} width="24" height="19" rx="5" fill={i===0?ORANGE:i===count-1?WIN:"#e0e7ff"}/><text x={87+col*31} y={86+row*25} textAnchor="middle" fontSize="8" fontWeight="900" fill={i===0||i===count-1?"#fff":IND} fontFamily={FONT}>{first+i}</text></motion.g>})}
        <motion.text x="230" y="237" textAnchor="middle" fontSize="20" fontWeight="900" fill={IND} fontFamily={FONT} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:1.1}}>{last} − {first} + 1 = {count}</motion.text>
        <motion.g initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",stiffness:200,damping:14,delay:1.25}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="181" y="246" width="98" height="22" rx="11" fill={ok?WIN:"#dc2626"}/><text x="230" y="261" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#fff">Answer {ok?problem.answer:"check data"}</text></motion.g>
      </motion.g>}
    </AnimatePresence>
  </svg></div>;
}
