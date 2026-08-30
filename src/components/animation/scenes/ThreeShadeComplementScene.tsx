import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace",INK="#1f2a44",IND="#4338ca",TEAL="#0d9488",GOLD="#d97706",GREEN="#16a34a",RED="#dc2626",DIM="#94a3b8",SHADE="#cbd5e1";

/** Regroup four small circles into one equal-area circle, then compare complements. */
export function ThreeShadeComplementScene({problem,step,totalSteps}:AnimatedSceneProps){
 const d=sceneData(problem), side=num(d.side,2), smallCount=Math.round(num(d.smallCircleCount,4));
 const radius=side/2, smallRadius=side/4, squareArea=side*side, circleArea=Math.PI*radius*radius, smallTotal=smallCount*Math.PI*smallRadius*smallRadius;
 const abShade=squareArea-circleArea, cSquareArea=side*side/2, cShade=circleArea-cSquareArea;
 const abEqual=Math.abs(circleArea-smallTotal)<1e-9, cLargest=cShade>abShade, expected=cLargest?"C only":"";
 const agrees=abEqual&&expected===problem.shortAnswer&&problem.answer==="C";
 const final=step>=totalSteps-1, showC=step>=1;
 const caption=final?(agrees?`π−2 > 4−π because π > 3 — figure C is largest`:`area identity or stored-answer check failed`):showC?`diagonal 2 ⇒ square area = 2; shaded C = π − 2`:`A and B each remove circle area π from square area 4`;
 const S=72,Y=37, xs=[30,144,258];
 const square=(x:number)=><rect x={x} y={Y} width={S} height={S} fill={SHADE} stroke={INK} strokeWidth="2"/>;
 return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:7,width:"100%",minWidth:0,padding:"6px 2px",boxSizing:"border-box"}}>
  <svg viewBox="-35 0 430 250" width="100%" style={{width:"100%",maxWidth:440,minWidth:0,display:"block"}} aria-label="Three shaded square and circle figures with their areas compared">
   <text x="66" y="20" textAnchor="middle" fontSize="13" fontWeight="950" fill={INK}>A</text><text x="180" y="20" textAnchor="middle" fontSize="13" fontWeight="950" fill={INK}>B</text><text x="294" y="20" textAnchor="middle" fontSize="13" fontWeight="950" fill={INK}>C</text>
   {square(xs[0])}<circle cx={xs[0]+S/2} cy={Y+S/2} r={S/2} fill="#fff" stroke={INK} strokeWidth="1.8"/>
   {square(xs[1])}{[0,1].flatMap(r=>[0,1].map(c=><circle key={`${r}${c}`} cx={xs[1]+S/4+c*S/2} cy={Y+S/4+r*S/2} r={S/4} fill="#fff" stroke={INK} strokeWidth="1.6"/>))}
   <circle cx={xs[2]+S/2} cy={Y+S/2} r={S/2} fill={SHADE} stroke={INK} strokeWidth="2"/><rect x={xs[2]+S/2-S/(2*Math.sqrt(2))} y={Y+S/2-S/(2*Math.sqrt(2))} width={S/Math.sqrt(2)} height={S/Math.sqrt(2)} fill="#fff" stroke={INK} strokeWidth="1.8"/>
   {[0,1,2].map(i=><g key={i}><line x1={xs[i]} y1={Y+S+10} x2={xs[i]+S} y2={Y+S+10} stroke={DIM}/><line x1={xs[i]} y1={Y+S+6} x2={xs[i]} y2={Y+S+14} stroke={DIM}/><line x1={xs[i]+S} y1={Y+S+6} x2={xs[i]+S} y2={Y+S+14} stroke={DIM}/><text x={xs[i]+S/2} y={Y+S+25} textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM} fontFamily={FONT}>{side} cm</text></g>)}

   {!showC&&!final&&<>
    <motion.path d="M180 84 C180 145 66 145 66 117" fill="none" stroke={GOLD} strokeWidth="2.2" markerEnd="url(#shadeArrow)" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:.8}}/>
    <rect x="25" y="162" width="310" height="47" rx="11" fill="#fffbeb" stroke="#f59e0b"/>
    <text x="180" y="180" textAnchor="middle" fontSize="10" fontWeight="850" fill="#92400e" fontFamily={FONT}>4·π({smallRadius})² = π({radius})² = π</text>
    <text x="180" y="198" textAnchor="middle" fontSize="12" fontWeight="950" fill={GOLD} fontFamily={FONT}>A = B = {squareArea} − π</text>
   </>}
   {showC&&!final&&<>
    <motion.line x1={xs[2]+S/2-S/(2*Math.sqrt(2))} y1={Y+S/2-S/(2*Math.sqrt(2))} x2={xs[2]+S/2+S/(2*Math.sqrt(2))} y2={Y+S/2+S/(2*Math.sqrt(2))} stroke={TEAL} strokeWidth="2.3" initial={{pathLength:0}} animate={{pathLength:1}}/>
    <text x={xs[2]+S/2+7} y={Y+S/2-5} fontSize="10" fontWeight="900" fill={TEAL} fontFamily={FONT}>diagonal {side}</text>
    <rect x="67" y="162" width="226" height="47" rx="11" fill="#ecfeff" stroke={TEAL}/><text x="180" y="180" textAnchor="middle" fontSize="10" fontWeight="850" fill="#0f766e" fontFamily={FONT}>square = d²/2 = {side}²/2 = {cSquareArea}</text><text x="180" y="199" textAnchor="middle" fontSize="13" fontWeight="950" fill={TEAL} fontFamily={FONT}>C = π − {cSquareArea}</text>
   </>}
   {final&&<>
    {[{x:84,v:abShade,l:"A=B",c:GOLD},{x:230,v:cShade,l:"C",c:GREEN}].map((b,i)=>{const h=65*b.v/Math.max(cShade,abShade);return <g key={b.l}><motion.rect x={b.x} y={225-h} width="48" height={h} fill={b.c} fillOpacity=".25" stroke={b.c} strokeWidth="2" initial={{scaleY:0}} animate={{scaleY:1}} transition={{delay:.2+i*.18,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"bottom"}}/><text x={b.x+24} y={241} textAnchor="middle" fontSize="10" fontWeight="900" fill={b.c} fontFamily={FONT}>{b.l}</text><text x={b.x+24} y={225-h/2+4} textAnchor="middle" fontSize="10" fontWeight="950" fill={b.c} fontFamily={FONT}>{b.l==="C"?"π−2":"4−π"}</text></g>})}
    <motion.text x="180" y="151" textAnchor="middle" fontSize="11" fontWeight="900" fill={agrees?GREEN:RED} fontFamily={FONT} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.7}}>{agrees?"π−2 > 4−π  ⇔  π > 3":"self-check failed"}</motion.text>
   </>}
   <defs><marker id="shadeArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={GOLD}/></marker></defs>
  </svg>
  <motion.div key={step} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} style={{width:"min(340px, calc(100vw - 48px))",maxWidth:"100%",overflowWrap:"anywhere",textAlign:"center",fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(agrees?"#166534":"#991b1b"):showC?TEAL:GOLD}}>{caption}</motion.div>
  {final&&<svg viewBox="0 0 200 32" width="130"><SvgAnswerBadge show answer={problem.answer??null} cx={100} y={3}/></svg>}
 </div>
}
