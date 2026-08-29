import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44", IND="#4338ca", PURPLE="#7c3aed", AMBER="#d97706", GREEN="#16a34a", RED="#dc2626", DIM="#94a3b8";
const pad=(n:number)=>String(n).padStart(2,"0");

/** Multiply modulo 100 to build a last-two-digit cycle, use the exponent's
 * remainder to select a cycle car, then separate that car into tens and ones.
 * Data: { base, exponent, modulus }.
 */
export function LastTwoDigitPowerCycleScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem), base=Math.round(num(data.base,0)), exponent=Math.round(num(data.exponent,0)), modulus=Math.round(num(data.modulus,100));
  const cycle:number[]=[];let cur=1;
  for(let i=0;i<20;i++){cur=(cur*base)%modulus;if(cycle.includes(cur))break;cycle.push(cur);if(cur===1)break;}
  const L=cycle.length, rem=exponent%L, index=rem===0?L-1:rem-1, ending=cycle[index]??0;
  const tens=Math.floor(ending/10), ones=ending%10;
  const choice=problem.choices?.find(c=>Number(c.text)===tens)?.label;
  const ok=modulus===100&&L===4&&cycle.join(",")==="7,49,43,1"&&tens===Number(problem.shortAnswer)&&choice===problem.answer;
  const final=step>=totalSteps-1, phase=final?2:Math.min(step,1);
  const pts=[{x:220,y:58},{x:334,y:133},{x:220,y:208},{x:106,y:133}];
  const arc=(a:number,b:number)=>`M${pts[a].x},${pts[a].y} Q${a===0?308:a===1?308:a===2?132:132},${a===0?70:a===1?196:a===2?196:70} ${pts[b].x},${pts[b].y}`;
  return <div style={{width:"100%",minWidth:0,display:"flex",justifyContent:"center",padding:"5px 3px",boxSizing:"border-box"}}><svg viewBox="0 0 440 285" width="100%" style={{maxWidth:470,minWidth:0,display:"block"}} aria-label="A four state carousel of the last two digits of powers of seven">
    <text x="220" y="18" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>{phase===0?"multiply each last-two-digit car by 7; only the last two digits survive":phase===1?"2011 groups into full turns of four, then advances three cars":"open the selected 43 car and read its place values"}</text>
    {phase===0&&<g>
      {[0,1,2,3].map(i=><motion.path key={i} d={arc(i,(i+1)%4)} fill="none" stroke="#c4b5fd" strokeWidth="2.5" markerEnd="url(#cycleArrow)" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:.2+i*.15}}/>)}
      {cycle.map((v,i)=><motion.g key={v} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:.12+i*.15,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><circle cx={pts[i].x} cy={pts[i].y} r="33" fill="#eef2ff" stroke={IND} strokeWidth="2.2"/><text x={pts[i].x} y={pts[i].y+6} textAnchor="middle" fontFamily={FONT} fontSize="20" fontWeight="900" fill={IND}>{pad(v)}</text><text x={pts[i].x} y={pts[i].y+49} textAnchor="middle" fontFamily={FONT} fontSize="10" fontWeight="850" fill={DIM}>7^{i+1}</text></motion.g>)}
      <circle cx="220" cy="133" r="39" fill="#faf5ff" stroke="#ddd6fe"/><text x="220" y="127" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="900" fill={PURPLE}>× 7</text><text x="220" y="148" textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM}>mod 100</text>
      <text x="220" y="268" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="900" fill={PURPLE}>01 × 7 → 07, so the cycle closes</text>
      <defs><marker id="cycleArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#a78bfa"/></marker></defs>
    </g>}
    {phase===1&&<g>
      <rect x="48" y="49" width="344" height="57" rx="14" fill="#f8fafc" stroke="#cbd5e1"/><text x="220" y="73" textAnchor="middle" fontFamily={FONT} fontSize="16" fontWeight="900" fill={INK}>{exponent} = {Math.floor(exponent/L)} × {L} + {rem}</text><text x="220" y="95" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>{Math.floor(exponent/L)} full carousel turns, then remainder {rem}</text>
      {cycle.map((v,i)=>{const hit=i===index;return <motion.g key={v} initial={{opacity:0,y:9}} animate={{opacity:1,y:0}} transition={{delay:i*.1}}><rect x={67+i*80} y="137" width="66" height="63" rx="12" fill={hit?"#fef3c7":"#f1f5f9"} stroke={hit?AMBER:"#cbd5e1"} strokeWidth={hit?2.8:1.5}/><text x={100+i*80} y="163" textAnchor="middle" fontFamily={FONT} fontSize="10" fontWeight="850" fill={hit?AMBER:DIM}>slot {i+1}</text><text x={100+i*80} y="189" textAnchor="middle" fontFamily={FONT} fontSize="20" fontWeight="900" fill={hit?AMBER:INK}>{pad(v)}</text></motion.g>})}
      <motion.path d={`M220 113 Q${100+index*80} 112 ${100+index*80} 132`} fill="none" stroke={AMBER} strokeWidth="2.5" markerEnd="url(#pickArrow)" initial={{pathLength:0}} animate={{pathLength:1}}/><text x="220" y="236" textAnchor="middle" fontFamily={FONT} fontSize="18" fontWeight="900" fill={AMBER}>remainder {rem} → last two digits {pad(ending)}</text>
      <defs><marker id="pickArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={AMBER}/></marker></defs>
    </g>}
    {phase===2&&<g>
      <text x="220" y="55" textAnchor="middle" fontFamily={FONT} fontSize="17" fontWeight="900" fill={IND}>7^{exponent} ends in</text>
      <motion.g initial={{scale:.55,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="117" y="78" width="92" height="104" rx="16" fill="#dcfce7" stroke={GREEN} strokeWidth="3"/><text x="163" y="102" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={GREEN}>TENS</text><text x="163" y="157" textAnchor="middle" fontFamily={FONT} fontSize="48" fontWeight="900" fill={GREEN}>{tens}</text></motion.g>
      <motion.g initial={{scale:.55,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.12,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="231" y="78" width="92" height="104" rx="16" fill="#f1f5f9" stroke={DIM} strokeWidth="2"/><text x="277" y="102" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>ONES</text><text x="277" y="157" textAnchor="middle" fontFamily={FONT} fontSize="48" fontWeight="900" fill={INK}>{ones}</text></motion.g>
      <motion.text x="220" y="218" textAnchor="middle" fontFamily={FONT} fontSize="22" fontWeight="900" fill={ok?GREEN:RED} initial={{opacity:0}} animate={{opacity:1}}>tens digit = {tens}</motion.text>
      <text x="220" y="239" textAnchor="middle" fontSize="10" fontWeight="850" fill={ok?GREEN:RED}>{ok?`43 is cycle slot ${index+1}; choice ${choice} matches`:"cycle or stored-answer check failed"}</text>
      <AnimatePresence>{ok&&<motion.g initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.5,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="174" y="249" width="92" height="27" rx="14" fill={GREEN}/><text x="220" y="267" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">Answer {problem.answer}</text></motion.g>}</AnimatePresence>
    </g>}
  </svg></div>;
}
