import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",ORANGE="#d97706",RED="#dc2626",DIM="#64748b";
const median=(a:number[])=>{const s=[...a].sort((x,y)=>x-y),m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2;};
const mode=(a:number[])=>{const counts=new Map<number,number>();a.forEach(v=>counts.set(v,(counts.get(v)??0)+1));return [...counts].sort((x,y)=>y[1]-x[1]||x[0]-y[0])[0]?.[0]??NaN;};
const fmt=(v:number)=>Number.isInteger(v)?String(v):v.toFixed(1);

/** Drop a new game onto an ordered score plot and recompute every named statistic. */
export function ScoreStatisticChangeScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem),scores=(Array.isArray(data.scores)?data.scores:[]).map(v=>num(v,NaN)),newScore=num(data.newScore,NaN),after=[...scores,newScore];
  const stats=(a:number[])=>{const min=Math.min(...a),max=Math.max(...a);return{range:max-min,median:median(a),mean:a.reduce((s,v)=>s+v,0)/a.length,mode:mode(a),"mid-range":(min+max)/2};};
  const before=stats(scores),now=stats(after),names=["range","median","mean","mode","mid-range"] as const;
  const increasing=names.filter(k=>now[k]>before[k]+1e-9),answer=increasing[0]??"";
  const choice=problem.choices?.find(c=>c.text.toLowerCase()===answer)?.label,ok=increasing.length===1&&answer===problem.shortAnswer?.toLowerCase()&&choice===problem.answer;
  const failure=increasing.length!==1?`${increasing.length} statistics increase`:`computed ${answer}; stored ${problem.shortAnswer}`;
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1),shown=phase===0?scores:after;
  const lo=Math.min(...after),hi=Math.max(...after),xOf=(v:number)=>55+(v-lo)/(hi-lo)*350;
  const stacks=new Map<number,number>();const dots=shown.map(v=>{const level=stacks.get(v)??0;stacks.set(v,level+1);return{v,level};});
  const min=phase===0?Math.min(...scores):Math.min(...after),max=Math.max(...scores),range=phase===0?before.range:now.range;
  const title=phase===0?"the original scores stretch from 42 to 73":phase===1?"the new 40 becomes the minimum and stretches the range":"recompute every answer choice: only one arrow points up";
  return <div style={{display:"flex",justifyContent:"center",width:"100%",minWidth:0,padding:"6px 4px",boxSizing:"border-box"}}><svg viewBox="0 0 460 330" width="100%" style={{maxWidth:480,minWidth:0,display:"block"}}>
    <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{title}</text>
    <line x1="55" y1="142" x2="405" y2="142" stroke={INK} strokeWidth="2"/>
    {Array.from({length:hi-lo+1},(_,i)=>lo+i).map(v=><line key={v} x1={xOf(v)} y1="138" x2={xOf(v)} y2="147" stroke={v%5===0?INK:"#cbd5e1"} strokeWidth={v%5===0?1.5:1}/>)}
    {dots.map((d,i)=><motion.g key={`${d.v}-${i}`} initial={d.v===newScore&&phase>=1?{y:-65,opacity:0}:{opacity:0,scale:.6}} animate={{y:0,opacity:1,scale:1}} transition={{delay:i*.035}}><circle cx={xOf(d.v)} cy={128-d.level*22} r="10" fill={d.v===newScore&&phase>=1?"#ffedd5":"#e0e7ff"} stroke={d.v===newScore&&phase>=1?ORANGE:IND} strokeWidth="2"/><text x={xOf(d.v)} y={132-d.level*22} textAnchor="middle" fontSize="8.5" fontWeight="900" fill={d.v===newScore&&phase>=1?ORANGE:IND} fontFamily={FONT}>{d.v}</text></motion.g>)}
    {[lo,45,50,55,60,65,70,hi].filter((v,i,a)=>a.indexOf(v)===i).map(v=><text key={v} x={xOf(v)} y="161" textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM} fontFamily={FONT}>{v}</text>)}
    <motion.path d={`M${xOf(min)} 178 v12 H${xOf(max)} v-12`} fill="none" stroke={phase===0?IND:GREEN} strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}}/>
    <text x={(xOf(min)+xOf(max))/2} y="207" textAnchor="middle" fontSize="14" fontWeight="900" fill={phase===0?IND:GREEN} fontFamily={FONT}>{max} − {min} = {range}</text>
    {phase===0&&<><text x={xOf(Math.min(...scores))} y="226" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={IND}>old minimum</text><rect x="142" y="245" width="176" height="39" rx="10" fill="#eef2ff" stroke={IND}/><text x="230" y="270" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>range = {before.range}</text></>}
    {phase===1&&<><motion.path d={`M${xOf(newScore)} 53 V88`} stroke={ORANGE} strokeWidth="2" initial={{pathLength:0}} animate={{pathLength:1}}/><text x={xOf(newScore)+5} y="48" fontSize="11" fontWeight="900" fill={ORANGE} fontFamily={FONT}>new score</text><rect x="136" y="241" width="188" height="45" rx="11" fill="#dcfce7" stroke={GREEN}/><text x="230" y="259" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>the maximum stays 73</text><text x="230" y="278" textAnchor="middle" fontSize="16" fontWeight="900" fill={GREEN} fontFamily={FONT}>31 → 33: increases</text></>}
    {phase===2&&<g transform="translate(34 226)">{names.map((name,i)=>{const x=(i%3)*134,y=Math.floor(i/3)*43,up=now[name]>before[name]+1e-9,equal=Math.abs(now[name]-before[name])<1e-9;return <g key={name} transform={`translate(${x} ${y})`}><motion.g initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*.1}}><rect width="122" height="35" rx="8" fill={up?"#dcfce7":"#f8fafc"} stroke={up?GREEN:"#cbd5e1"}/><text x="8" y="14" fontSize="9.5" fontWeight="900" fill={up?GREEN:INK}>{name}</text><text x="114" y="25" textAnchor="end" fontSize="10" fontWeight="900" fill={up?GREEN:equal?DIM:RED} fontFamily={FONT}>{fmt(before[name])} → {fmt(now[name])} {up?"↑":equal?"=":"↓"}</text></motion.g></g>})}</g>}
    <SvgAnswerBadge show={final&&ok} answer={problem.answer} cx={400} y={296} width={82}/>
    <AnimatePresence>{final&&!ok&&<motion.text x="230" y="326" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
  </svg></div>;
}
