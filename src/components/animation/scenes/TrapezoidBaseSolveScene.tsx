import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace",INK="#1f2a44",IND="#4338ca",BLUE="#2563eb",GOLD="#d97706",GREEN="#16a34a",RED="#dc2626",DIM="#94a3b8";
/** Split off both right triangles, build the long base, and combine it with the area-derived base sum. */
export function TrapezoidBaseSolveScene({problem,step,totalSteps}:AnimatedSceneProps){
 const d=sceneData(problem),area=num(d.area,164),h=num(d.height,8),left=num(d.leftLeg,10),right=num(d.rightLeg,17);
 const x=Math.sqrt(left*left-h*h),y=Math.sqrt(right*right-h*h),baseSum=2*area/h,top=(baseSum-x-y)/2,bottom=top+x+y;
 const choice=problem.choices?.find(c=>Number(c.text)===top)?.label, agrees=[x,y,baseSum,top,bottom].every(Number.isInteger)&&String(top)===problem.shortAnswer&&choice===problem.answer;
 const final=step>=totalSteps-1,phase=final?3:Math.min(step,2);
 const s=5.1,A={x:24,y:154},B={x:24+x*s,y:154-h*s},C={x:24+(x+top)*s,y:154-h*s},D={x:24+(x+top+y)*s,y:154},E={x:B.x,y:154},F={x:C.x,y:154};
 const pts=(p:{x:number;y:number}[])=>p.map(q=>`${q.x},${q.y}`).join(" ");
 const caption=phase===0?`area ${area} and height ${h} give BC + AD = ${baseSum}`:phase===1?`the ${left}-${h} and ${right}-${h} right triangles have offsets ${x} and ${y}`:phase===2?`AD = ${x} + BC + ${y} = BC + ${x+y}`:agrees?`BC + (BC + ${x+y}) = ${baseSum}, so BC = ${top}`:`geometry, arithmetic, or stored-answer check failed`;
 return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:7,width:"100%",minWidth:0,padding:"6px 2px",boxSizing:"border-box"}}>
  <svg viewBox="-52 0 470 250" width="100%" style={{width:"100%",maxWidth:440,minWidth:0,display:"block"}} aria-label="Trapezoid split into two right triangles and a central rectangle to solve its top base">
   <polygon points={pts([A,B,C,D])} fill="#f8fafc" stroke={INK} strokeWidth="2.4"/>
   <line x1={B.x} y1={B.y} x2={E.x} y2={E.y} stroke={DIM} strokeWidth="1.7" strokeDasharray="4 3"/><line x1={C.x} y1={C.y} x2={F.x} y2={F.y} stroke={DIM} strokeWidth="1.7" strokeDasharray="4 3"/>
   <path d={`M${E.x} ${E.y-7}h7v7M${F.x-7} ${F.y}v-7h7`} fill="none" stroke={DIM}/>
   {[["A",A.x-8,A.y+15],["B",B.x-5,B.y-8],["C",C.x+5,C.y-8],["D",D.x+8,D.y+15]].map(([t,px,py])=><text key={String(t)} x={Number(px)} y={Number(py)} textAnchor="middle" fontSize="11" fontWeight="900" fill={INK}>{t}</text>)}
   <text x={(A.x+B.x)/2-11} y={(A.y+B.y)/2-4} textAnchor="middle" fontSize="11" fontWeight="900" fill={BLUE} fontFamily={FONT}>{left}</text><text x={(C.x+D.x)/2+12} y={(C.y+D.y)/2-4} textAnchor="middle" fontSize="11" fontWeight="900" fill={GOLD} fontFamily={FONT}>{right}</text><text x={B.x+10} y={(B.y+E.y)/2+4} fontSize="10" fontWeight="900" fill={IND} fontFamily={FONT}>{h}</text>
   <text x={(B.x+C.x)/2} y={B.y-10} textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>{final?`BC = ${top}`:"BC = ?"}</text>

   {phase===0&&<>
    <motion.line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={IND} strokeWidth="4" initial={{pathLength:0}} animate={{pathLength:1}}/><motion.line x1={A.x} y1={A.y} x2={D.x} y2={D.y} stroke={IND} strokeWidth="4" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:.2}}/>
    <rect x="68" y="184" width="244" height="47" rx="11" fill="#eef2ff" stroke={IND}/><text x="190" y="202" textAnchor="middle" fontSize="11" fontWeight="850" fill={IND} fontFamily={FONT}>{area} = ½·{h}·(BC + AD)</text><text x="190" y="222" textAnchor="middle" fontSize="16" fontWeight="950" fill={IND} fontFamily={FONT}>BC + AD = {baseSum}</text>
   </>}
   {phase===1&&<>
    <motion.polygon points={pts([A,B,E])} fill="#dbeafe" stroke={BLUE} strokeWidth="2" initial={{opacity:0}} animate={{opacity:.8}}/><motion.polygon points={pts([F,C,D])} fill="#fef3c7" stroke={GOLD} strokeWidth="2" initial={{opacity:0}} animate={{opacity:.8}} transition={{delay:.2}}/>
    <text x="92" y="193" textAnchor="middle" fontSize="12" fontWeight="900" fill={BLUE} fontFamily={FONT}>x² + {h}² = {left}²</text><text x="92" y="214" textAnchor="middle" fontSize="17" fontWeight="950" fill={BLUE} fontFamily={FONT}>x = {x}</text><text x="285" y="193" textAnchor="middle" fontSize="12" fontWeight="900" fill={GOLD} fontFamily={FONT}>y² + {h}² = {right}²</text><text x="285" y="214" textAnchor="middle" fontSize="17" fontWeight="950" fill={GOLD} fontFamily={FONT}>y = {y}</text>
   </>}
   {phase===2&&<>
    <motion.line x1={A.x} y1="174" x2={D.x} y2="174" stroke={IND} strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}}/>
    {[{a:A.x,b:E.x,t:String(x),c:BLUE},{a:E.x,b:F.x,t:"BC",c:IND},{a:F.x,b:D.x,t:String(y),c:GOLD}].map(o=><g key={o.t}><line x1={o.a} y1="169" x2={o.a} y2="179" stroke={o.c}/><text x={(o.a+o.b)/2} y="190" textAnchor="middle" fontSize="11" fontWeight="950" fill={o.c} fontFamily={FONT}>{o.t}</text></g>)}<line x1={D.x} y1="169" x2={D.x} y2="179" stroke={GOLD}/>
    <rect x="75" y="205" width="230" height="33" rx="10" fill="#eef2ff" stroke={IND}/><text x="190" y="227" textAnchor="middle" fontSize="16" fontWeight="950" fill={IND} fontFamily={FONT}>AD = BC + {x+y}</text>
   </>}
   {phase===3&&<>
    <motion.rect x="58" y="181" width="264" height="55" rx="12" fill={agrees?"#dcfce7":"#fee2e2"} stroke={agrees?GREEN:RED} strokeWidth="2" initial={{scale:.7}} animate={{scale:1}} style={{transformBox:"fill-box",transformOrigin:"center"}}/><text x="190" y="201" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>BC + (BC + {x+y}) = {baseSum}</text><text x="190" y="225" textAnchor="middle" fontSize="20" fontWeight="950" fill={agrees?GREEN:RED} fontFamily={FONT}>2BC = {baseSum-x-y}  ⇒  BC = {top}</text>
   </>}
  </svg>
  <motion.div key={step} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} style={{width:"min(350px, calc(100vw - 48px))",maxWidth:"100%",overflowWrap:"anywhere",textAlign:"center",fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(agrees?"#166534":"#991b1b"):phase===1?BLUE:IND}}>{caption}</motion.div>
  {final&&<svg viewBox="0 0 200 32" width="130"><SvgAnswerBadge show answer={problem.answer??null} cx={100} y={3}/></svg>}
 </div>
}
