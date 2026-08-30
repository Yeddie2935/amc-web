import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace", INK="#1f2a44", CAT="#d97706", MOUSE="#64748b", IND="#4338ca", GREEN="#16a34a", RED="#dc2626", DIM="#94a3b8";
type P={x:number;y:number};
const catPts:P[]=[{x:95,y:62},{x:145,y:62},{x:145,y:112},{x:95,y:112}];
const mousePts:P[]=[{x:145,y:151},{x:174,y:112},{x:174,y:62},{x:145,y:23},{x:95,y:23},{x:66,y:62},{x:66,y:112},{x:95,y:151}];

function Cat({x,y,small=false}:{x:number;y:number;small?:boolean}){const s=small?.7:1;return <g transform={`translate(${x} ${y}) scale(${s})`}><ellipse cx="0" cy="2" rx="10" ry="7" fill="#fdba74" stroke={INK}/><circle cx="-7" cy="-5" r="6" fill="#fb923c" stroke={INK}/><path d="M-12-9l2-6 4 5M-5-10l3-5 1 7" fill="#fb923c" stroke={INK}/><circle cx="-9" cy="-5" r="1"/><circle cx="-5" cy="-5" r="1"/><path d="M9 0q10-8 9 2" fill="none" stroke={INK} strokeWidth="2"/></g>}
function Mouse({x,y,small=false}:{x:number;y:number;small?:boolean}){const s=small?.7:1;return <g transform={`translate(${x} ${y}) scale(${s})`}><ellipse rx="9" ry="6" fill="#cbd5e1" stroke={INK}/><circle cx="-7" cy="-5" r="4" fill="#e2e8f0" stroke={INK}/><circle cx="-11" cy="-9" r="3" fill="#fda4af" stroke={INK}/><circle cx="-8" cy="-5" r="1"/><path d="M8 1q12 7 14-2" fill="none" stroke={INK} strokeWidth="1.5"/><path d="M-11 0l-5-2m5 5l-5 1" stroke={INK}/></g>}
function Board({ox=0,oy=0,scale=1}:{ox?:number;oy?:number;scale?:number}){return <g transform={`translate(${ox} ${oy}) scale(${scale})`}><rect x="70" y="37" width="100" height="100" fill="#fff" stroke={INK} strokeWidth="3"/><line x1="120" y1="37" x2="120" y2="137" stroke={INK} strokeWidth="3"/><line x1="70" y1="87" x2="170" y2="87" stroke={INK} strokeWidth="3"/></g>}
const arc=(a:P,b:P,curve=0)=>`M${a.x},${a.y} Q${(a.x+b.x)/2+curve},${(a.y+b.y)/2+curve} ${b.x},${b.y}`;

/** Two independent position cycles share one board, then their residues are combined. */
export function CatMouseDualCycleScene({problem,step,totalSteps}:AnimatedSceneProps){
 const d=sceneData(problem), move=Math.round(num(d.move,247)), catCycle=Math.round(num(d.catCycle,4)), mouseCycle=Math.round(num(d.mouseCycle,8));
 const choices=(Array.isArray(d.choices)?d.choices:[]).map(String).map(v=>{const [label,c,m]=v.split("|");return {label,cat:Number(c),mouse:Number(m)}});
 const catRem=move%catCycle||catCycle, mouseRem=move%mouseCycle||mouseCycle;
 const winner=choices.filter(c=>c.cat===catRem&&c.mouse===mouseRem), agrees=winner.length===1&&winner[0].label===problem.answer;
 const final=step>=totalSteps-1, showMouse=step>=1;
 const caption=final?(agrees?`cat slot ${catRem} + mouse slot ${mouseRem} matches choice ${winner[0].label}`:"cycle, choices, or stored-answer check failed"):showMouse?`${move} = ${Math.floor(move/mouseCycle)}·${mouseCycle} + ${mouseRem} → mouse slot ${mouseRem}`:`${move} = ${Math.floor(move/catCycle)}·${catCycle} + ${catRem} → cat slot ${catRem}`;
 return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:7,width:"100%",minWidth:0,padding:"6px 2px",boxSizing:"border-box"}}>
  <svg viewBox="-15 0 390 226" width="100%" style={{width:"100%",maxWidth:430,display:"block"}} aria-label="Cat and mouse moving on independent cycles around four squares">
   {!final?<>
    <Board ox={-10}/>
    {!showMouse&&<>{catPts.map((p,i)=><motion.g key={i} initial={{opacity:0,scale:.4}} animate={{opacity:i+1===catRem?1:.25,scale:1}} transition={{delay:i*.12,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><Cat x={p.x-10} y={p.y}/><text x={p.x-10} y={p.y+19} textAnchor="middle" fontSize="9" fontWeight="900" fill={i+1===catRem?CAT:DIM} fontFamily={FONT}>{i+1}</text></motion.g>)}{catPts.map((p,i)=><motion.path key={`a${i}`} d={arc({x:p.x-10,y:p.y},{x:catPts[(i+1)%4].x-10,y:catPts[(i+1)%4].y})} fill="none" stroke={CAT} strokeWidth="1.7" strokeDasharray="3 3" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:.5+i*.1}}/>)}</>}
    {showMouse&&<>{mousePts.map((p,i)=><motion.g key={i} initial={{opacity:0,scale:.4}} animate={{opacity:i+1===mouseRem?1:.22,scale:1}} transition={{delay:i*.08,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><Mouse x={p.x-10} y={p.y}/><text x={p.x-10+(i===6?-18:0)} y={p.y+(i===6?3:i===0||i===7?19:-12)} textAnchor="middle" fontSize="9" fontWeight="900" fill={i+1===mouseRem?MOUSE:DIM} fontFamily={FONT}>{i+1}</text></motion.g>)}{mousePts.map((p,i)=><motion.path key={`m${i}`} d={arc({x:p.x-10,y:p.y},{x:mousePts[(i+1)%8].x-10,y:mousePts[(i+1)%8].y})} fill="none" stroke={MOUSE} strokeWidth="1.5" strokeDasharray="3 3" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:.5+i*.07}}/>)}</>}
    <g transform="translate(205 38)"><text x="65" y="0" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM} fontFamily={FONT}>{showMouse?"MOUSE CLOCK":"CAT CLOCK"}</text>{Array.from({length:showMouse?mouseCycle:catCycle}).map((_,i)=>{const n=showMouse?mouseCycle:catCycle,a=-Math.PI/2+i*2*Math.PI/n,x=65+47*Math.cos(a),y=58+47*Math.sin(a),hit=i+1===(showMouse?mouseRem:catRem);return <motion.g key={i} initial={{opacity:0,scale:.4}} animate={{opacity:1,scale:1}} transition={{delay:i*.08}} style={{transformBox:"fill-box",transformOrigin:"center"}}><circle cx={x} cy={y} r={hit?13:10} fill={hit?"#fef3c7":"#f1f5f9"} stroke={hit?(showMouse?MOUSE:CAT):"#cbd5e1"} strokeWidth={hit?2.5:1.2}/><text x={x} y={y+4} textAnchor="middle" fontSize="9" fontWeight="900" fill={hit?INK:DIM} fontFamily={FONT}>{i+1}</text></motion.g>})}<text x="65" y="62" textAnchor="middle" fontSize="13" fontWeight="950" fill={IND} fontFamily={FONT}>rem {showMouse?mouseRem:catRem}</text></g>
   </>:<>
    <text x="180" y="14" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM} fontFamily={FONT}>combine the two remainder positions</text>
    {choices.map((c,i)=>{const x=7+(i%3)*118,y=34+Math.floor(i/3)*91,good=c.cat===catRem&&c.mouse===mouseRem;return <motion.g key={c.label} initial={{opacity:0,scale:.7}} animate={{opacity:good?1:.42,scale:1}} transition={{delay:i*.1,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}>{good&&<rect x={x} y={y-7} width="110" height="83" rx="10" fill="#f0fdf4" stroke={GREEN} strokeWidth="2"/>}<Board ox={x-35} oy={y-25} scale={.55}/><Cat x={x-35+catPts[c.cat-1].x*.55} y={y-25+catPts[c.cat-1].y*.55} small/><Mouse x={x-35+mousePts[c.mouse-1].x*.55} y={y-25+mousePts[c.mouse-1].y*.55} small/><text x={x+7} y={y+68} textAnchor="middle" fontSize="11" fontWeight="950" fill={good?GREEN:INK}>({c.label})</text>{!good&&<path d={`M${x+14},${y} L${x+91},${y+58}`} stroke={RED} strokeWidth="1.7"/>}</motion.g>})}
    <text x="180" y="211" textAnchor="middle" fontSize="11" fontWeight="900" fill={agrees?GREEN:RED} fontFamily={FONT}>{agrees?`247th move = cat ${catRem}, mouse ${mouseRem}`:"self-check failed"}</text>
   </>}
  </svg>
  <motion.div key={step} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} style={{maxWidth:"100%",overflowWrap:"anywhere",textAlign:"center",fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(agrees?"#166534":"#991b1b"):showMouse?MOUSE:CAT}}>{caption}</motion.div>
  {final&&<svg viewBox="0 0 200 32" width="130"><SvgAnswerBadge show answer={problem.answer??null} cx={100} y={3}/></svg>}
 </div>
}
