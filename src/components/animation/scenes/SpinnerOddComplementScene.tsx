import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",RED="#dc2626",AMBER="#d97706",DIM="#64748b";
const polar=(cx:number,cy:number,r:number,a:number)=>({x:cx+r*Math.cos(a-Math.PI/2),y:cy+r*Math.sin(a-Math.PI/2)});
const wedge=(cx:number,cy:number,r:number,i:number,n:number)=>{const a=polar(cx,cy,r,2*Math.PI*i/n),b=polar(cx,cy,r,2*Math.PI*(i+1)/n);return `M${cx} ${cy}L${a.x} ${a.y}A${r} ${r} 0 0 1 ${b.x} ${b.y}Z`};

function Spinner({cx,cy,values,showOdds,delay=0}:{cx:number;cy:number;values:number[];showOdds:boolean;delay?:number}){
  const r=60,n=values.length;
  return <g>{values.map((v,i)=>{const odd=v%2===1,mid=2*Math.PI*(i+.5)/n,p=polar(cx,cy,37,mid);return <motion.g key={v} initial={{opacity:0,scale:.75}} animate={{opacity:1,scale:1}} transition={{delay:delay+i*.08}} style={{transformBox:"fill-box",transformOrigin:"center"}}><path d={wedge(cx,cy,r,i,n)} fill={showOdds&&odd?"#fef3c7":"#f8fafc"} stroke={showOdds&&odd?AMBER:INK} strokeWidth={showOdds&&odd?2.8:1.7}/><text x={p.x} y={p.y+5} textAnchor="middle" fontSize="17" fontWeight="900" fill={showOdds&&odd?AMBER:INK} fontFamily={FONT}>{v}</text></motion.g>})}<circle cx={cx} cy={cy} r="5" fill={IND}/><motion.path d={`M${cx} ${cy}L${cx+8} ${cy-r+13}`} stroke={IND} strokeWidth="3" strokeLinecap="round" initial={{rotate:-55}} animate={{rotate:20}} transition={{duration:.8,delay}} style={{transformBox:"fill-box",transformOrigin:`${cx}px ${cy}px`}}/></g>;
}

/** Highlight the real odd sectors, enumerate the odd×odd complement, then
 * recolor the other cells in the complete 4-by-3 outcome grid as even. */
export function SpinnerOddComplementScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem);
  const A=Array.isArray(data.spinnerA)?data.spinnerA.map(Number):[],B=Array.isArray(data.spinnerB)?data.spinnerB.map(Number):[];
  const oddsA=A.filter(v=>v%2),oddsB=B.filter(v=>v%2),outcomes=A.flatMap(a=>B.map(b=>({a,b,p:a*b,even:(a*b)%2===0})));
  const oddCount=outcomes.filter(o=>!o.even).length,evenCount=outcomes.length-oddCount;
  const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a),d=gcd(evenCount,outcomes.length),result=`${evenCount/d}/${outcomes.length/d}`;
  const choice=problem.choices?.find(c=>c.text===result)?.label;
  const ok=A.join(",")==="1,2,3,4"&&B.join(",")==="1,2,3"&&oddCount===4&&evenCount===8&&result===problem.shortAnswer&&choice===problem.answer;
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1);

  return <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 470 300" width="342" style={{maxWidth:"100%",minWidth:0,display:"block"}} aria-label="Two numbered spinners and a twelve-cell product grid using the odd-product complement">
      <text x="235" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"an odd product requires odd × odd":phase===1?"count the odd sectors on each spinner":"everything outside odd × odd is even"}</text>
      {phase<2&&<g><Spinner cx={118} cy={104} values={A} showOdds={phase===1}/><Spinner cx={338} cy={104} values={B} showOdds={phase===1} delay={.2}/><text x="118" y="180" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK}>Spinner A</text><text x="338" y="180" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK}>Spinner B</text></g>}

      {phase===0&&<g transform="translate(77 207)"><rect width="316" height="58" rx="14" fill="#fff7ed" stroke="#fed7aa"/><text x="158" y="22" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>THE ONLY WAY TO MISS AN EVEN PRODUCT</text><text x="158" y="46" textAnchor="middle" fontSize="19" fontWeight="900" fill={AMBER} fontFamily={FONT}>odd × odd = odd</text></g>}
      {phase===1&&<g>
        <g transform="translate(51 207)"><rect width="164" height="60" rx="13" fill="#fff7ed" stroke="#fed7aa"/><text x="82" y="22" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>A LANDS ODD</text><text x="82" y="47" textAnchor="middle" fontSize="19" fontWeight="900" fill={AMBER} fontFamily={FONT}>{oddsA.length}/{A.length} = 1/2</text></g>
        <g transform="translate(255 207)"><rect width="164" height="60" rx="13" fill="#fff7ed" stroke="#fed7aa"/><text x="82" y="22" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>B LANDS ODD</text><text x="82" y="47" textAnchor="middle" fontSize="19" fontWeight="900" fill={AMBER} fontFamily={FONT}>{oddsB.length}/{B.length} = 2/3</text></g>
      </g>}

      {phase===2&&<g>
        <text x="95" y="50" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>all {A.length} × {B.length} outcomes</text>
        <g transform="translate(28 61)">{A.map((a,r)=>B.map((b,c)=>{const o=outcomes[r*B.length+c],x=c*45,y=r*45;return <motion.g key={`${a}-${b}`} initial={{opacity:0,scale:.45}} animate={{opacity:1,scale:1}} transition={{delay:(r*B.length+c)*.035}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x={x} y={y} width="39" height="39" rx="7" fill={o.even?"#dcfce7":"#fef3c7"} stroke={o.even?GREEN:AMBER}/><text x={x+19.5} y={y+16} textAnchor="middle" fontSize="8.5" fontWeight="850" fill={DIM} fontFamily={FONT}>{a}×{b}</text><text x={x+19.5} y={y+31} textAnchor="middle" fontSize="13" fontWeight="900" fill={o.even?GREEN:AMBER} fontFamily={FONT}>{o.p}</text></motion.g>}) )}</g>
        <g transform="translate(192 50)"><rect width="252" height="174" rx="15" fill={ok?"#f0fdf4":"#fef2f2"} stroke={ok?"#86efac":"#fecaca"}/><text x="126" y="24" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>COMPLEMENT COUNT</text><text x="126" y="53" textAnchor="middle" fontSize="15" fontWeight="900" fill={AMBER} fontFamily={FONT}>P(odd) = 1/2 · 2/3 = 1/3</text><line x1="25" y1="70" x2="227" y2="70" stroke="#bbf7d0"/><text x="126" y="99" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>P(even) = 1 − 1/3</text><motion.text x="126" y="136" textAnchor="middle" fontSize="25" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT} initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.55,type:"spring"}}>= {result}</motion.text><text x="126" y="158" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>{evenCount} green cells out of {outcomes.length}</text></g>
        <SvgAnswerBadge show={final} answer={ok?problem.answer:"check failed"} cx={319} y={244} width={ok?84:122}/>
      </g>}
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(ok?"#166534":RED):IND,background:final?(ok?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)"}}>{phase===0?"use the smaller odd-product complement":phase===1?`odd × odd has probability ${oddsA.length}/${A.length} × ${oddsB.length}/${B.length}`:ok?`${evenCount}/${outcomes.length} = ${result}, so choice ${problem.answer}`:"spinner sectors, outcome count, or stored-answer check failed"}</motion.span>
  </div>;
}
