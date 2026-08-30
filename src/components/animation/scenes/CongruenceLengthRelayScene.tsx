import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace", INK="#1f2a44", IND="#4338ca", TEAL="#0d9488", GREEN="#16a34a", GOLD="#d97706", RED="#dc2626", DIM="#94a3b8";
type P={x:number;y:number};
const tri=(...p:P[])=>`M ${p.map(q=>`${q.x} ${q.y}`).join(" L ")} Z`;

/** Half-turn congruence transfers a length, isosceles equality relays it, and a midpoint halves it. */
export function CongruenceLengthRelayScene({problem,step,totalSteps}:AnimatedSceneProps){
  const d=sceneData(problem),given=num(d.givenLength,0),ab=given,bc=ab,bd=bc/2;
  const choice=problem.choices?.find(c=>Number(c.text)===bd)?.label;
  const rel=d.congruence==="ABD=ECD"&&d.isosceles==="AB=BC"&&Array.isArray(d.midpoints)&&d.midpoints.map(String).sort().join(",")==="AE,BC"&&d.givenSide==="CE";
  const ok=rel&&given>0&&String(bd)===String(problem.shortAnswer)&&choice===problem.answer;
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1);
  const A={x:62,y:238},B={x:146,y:48},C={x:236,y:238},D={x:191,y:143},E={x:320,y:48};
  const labels:[string,P,number,number][]=[["A",A,-18,20],["B",B,-8,-12],["C",C,4,22],["D",D,-8,20],["E",E,5,-8]];
  return <div style={{display:"flex",justifyContent:"center",width:"100%",padding:"5px 3px"}}><svg viewBox="0 0 440 300" width="100%" style={{maxWidth:470}}>
    <text x="220" y="18" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>{phase===0?"half-turn about D matches ABD with ECD":phase===1?"the isosceles sides relay the same length":"midpoint D cuts BC into equal halves"}</text>
    <g transform="translate(20 0)">
      <path d={tri(A,B,C)} fill="none" stroke={INK} strokeWidth="2.1"/><path d={tri(A,E,C)} fill="none" stroke={INK} strokeWidth="2.1"/><line x1={A.x} y1={A.y} x2={E.x} y2={E.y} stroke={INK}/><line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={INK}/>
      {phase===0&&<><path d={tri(A,B,D)} fill="#eef2ff" stroke={IND} strokeWidth="2.4"/><path d={tri(E,C,D)} fill="#ecfeff" stroke={TEAL} strokeWidth="2.4"/><motion.path d={tri(A,B,D)} fill="#c7d2fe" fillOpacity=".55" stroke={IND} strokeWidth="2" initial={{opacity:.85}} animate={{d:tri(E,C,D),opacity:.2}} transition={{duration:1.25,delay:.35}}/><motion.path d={`M ${D.x-38} ${D.y-25} A 46 46 0 1 1 ${D.x+37} ${D.y+27}`} fill="none" stroke={GOLD} strokeWidth="2.4" initial={{pathLength:0}} animate={{pathLength:1}}/><text x={D.x-51} y={D.y+53} fontSize="10" fontWeight="900" fill={GOLD}>180°</text><Side p1={C} p2={E} text={given} color={GREEN} offset={-13}/><Side p1={A} p2={B} text={ab} color={GREEN} offset={12} delay={1}/></>}
      {phase>=1&&<><line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={GREEN} strokeWidth="4"/><line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={phase===2?GOLD:GREEN} strokeWidth="4"/><Tick p1={A} p2={B} color={GREEN}/><Tick p1={B} p2={C} color={phase===2?GOLD:GREEN}/><Side p1={A} p2={B} text={ab} color={GREEN} offset={13}/><Side p1={B} p2={C} text={bc} color={phase===2?GOLD:GREEN} offset={-13}/></>}
      {phase===2&&<><circle cx={D.x} cy={D.y} r="6" fill={GOLD} stroke="#fff" strokeWidth="2"/><DoubleTick p1={B} p2={D} color={IND}/><DoubleTick p1={D} p2={C} color={TEAL}/><Side p1={B} p2={D} text={bd} color={IND} offset={12}/><Side p1={D} p2={C} text={bd} color={TEAL} offset={12}/></>}
      {labels.map(([n,p,dx,dy])=><g key={n}><circle cx={p.x} cy={p.y} r="3.3" fill={INK}/><text x={p.x+dx} y={p.y+dy} fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>{n}</text></g>)}
    </g>
    <g transform="translate(327 55)"><rect width="101" height={phase===2?165:132} rx="13" fill="#f8fafc" stroke="#cbd5e1"/><text x="50.5" y="23" textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM}>LENGTH RELAY</text><text x="50.5" y="52" textAnchor="middle" fontSize="13" fontWeight="900" fill={GREEN} fontFamily={FONT}>CE = {given}</text><motion.text x="50.5" y="81" textAnchor="middle" fontSize="13" fontWeight="900" fill={GREEN} fontFamily={FONT} initial={{opacity:0}} animate={{opacity:1}}>AB = {ab}</motion.text>{phase>=1&&<text x="50.5" y="110" textAnchor="middle" fontSize="13" fontWeight="900" fill={GOLD} fontFamily={FONT}>BC = {bc}</text>}{phase===2&&<motion.text x="50.5" y="143" textAnchor="middle" fontSize="15" fontWeight="950" fill={ok?GREEN:RED} fontFamily={FONT} initial={{scale:0}} animate={{scale:1}} style={{transformBox:"fill-box",transformOrigin:"center"}}>BD = {bd}</motion.text>}</g>
    {phase===0&&<text x="220" y="284" textAnchor="middle" fontSize="10" fontWeight="850" fill={IND} fontFamily={FONT}>A↔E, B↔C, D↔D   ⇒   AB↔CE</text>}{phase===1&&<text x="220" y="284" textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN} fontFamily={FONT}>CE = AB = BC = {bc}</text>}{phase===2&&<><text x="165" y="284" textAnchor="middle" fontSize="13" fontWeight="950" fill={ok?GREEN:RED} fontFamily={FONT}>BD = {bc} ÷ 2 = {bd}</text><SvgAnswerBadge show={ok} answer={problem.answer==null?null:String(problem.answer)} cx={382} y={267} width={82}/></>}
  </svg></div>;
}
function Side({p1,p2,text,color,offset,delay=0}:{p1:P;p2:P;text:string|number;color:string;offset:number;delay?:number}){const mx=(p1.x+p2.x)/2,my=(p1.y+p2.y)/2,dx=p2.x-p1.x,dy=p2.y-p1.y,l=Math.hypot(dx,dy),x=mx-dy/l*offset,y=my+dx/l*offset;return <motion.g initial={{opacity:0}} animate={{opacity:1}} transition={{delay}}><rect x={x-15} y={y-10} width="30" height="19" rx="6" fill="#fff" stroke={color}/><text x={x} y={y+4} textAnchor="middle" fontSize="11" fontWeight="900" fill={color} fontFamily={FONT}>{text}</text></motion.g>}
function Tick({p1,p2,color}:{p1:P;p2:P;color:string}){const mx=(p1.x+p2.x)/2,my=(p1.y+p2.y)/2,dx=p2.x-p1.x,dy=p2.y-p1.y,l=Math.hypot(dx,dy);return <line x1={mx-dy/l*6} y1={my+dx/l*6} x2={mx+dy/l*6} y2={my-dx/l*6} stroke={color} strokeWidth="3"/>}
function DoubleTick({p1,p2,color}:{p1:P;p2:P;color:string}){const mx=(p1.x+p2.x)/2,my=(p1.y+p2.y)/2,dx=p2.x-p1.x,dy=p2.y-p1.y,l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l;return <g>{[-4,4].map(s=><line key={s} x1={mx+ux*s-dy/l*5} y1={my+uy*s+dx/l*5} x2={mx+ux*s+dy/l*5} y2={my+uy*s-dx/l*5} stroke={color} strokeWidth="2"/>)}</g>}
