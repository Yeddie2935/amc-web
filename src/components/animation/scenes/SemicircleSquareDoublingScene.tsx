import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",TEAL="#0d9488",GREEN="#16a34a",RED="#dc2626",GOLD="#d97706",DIM="#94a3b8";

/** Complete the tangent semicircle, convert its radius into the equal triangle
 * legs, then reflect the triangle across its hypotenuse to make a square. */
export function SemicircleSquareDoublingScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem);
  const semiCoeff=num(data.semicircleAreaCoefficient,0);
  const kind=String(data.triangleType??"");
  const fullCoeff=2*semiCoeff,radius=Math.sqrt(fullCoeff),diameter=2*radius;
  const squareArea=diameter*diameter,triangleArea=squareArea/2;
  const choice=problem.choices?.find(item=>Number(item.text)===triangleArea)?.label;
  const valid=semiCoeff===2&&kind==="isosceles-right"&&radius===2&&triangleArea===Number(problem.shortAnswer)&&choice===problem.answer;
  const final=step>=totalSteps-1,phase=final?3:Math.min(step,2);

  const C={x:72,y:38},A={x:272,y:38},B={x:72,y:238},D={x:272,y:238},O={x:172,y:138};
  const R=100/Math.SQRT2,e1={x:O.x-R,y:O.y+R},e2={x:O.x+R,y:O.y-R};

  return <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:7,padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 470 285" width="100%" style={{maxWidth:500,display:"block"}} aria-label="An isosceles right triangle with a tangent semicircle reflected into a full circle and then doubled into a square">
      <text x="235" y="16" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"mirror the semicircle to recover the full circle":phase===1?"area reveals radius and diameter":phase===2?"symmetry makes each leg one diameter":"reflect the triangle across its hypotenuse"}</text>

      {phase===3&&<motion.polygon points={`${A.x},${A.y} ${D.x},${D.y} ${B.x},${B.y}`} fill="#dcfce7" stroke={GREEN} strokeWidth="2.5" initial={{opacity:0,scale:.65}} animate={{opacity:.9,scale:1}} transition={{type:"spring",stiffness:150,damping:17}} style={{transformBox:"fill-box",transformOrigin:"center"}}/>}
      <polygon points={`${C.x},${C.y} ${A.x},${A.y} ${B.x},${B.y}`} fill={phase===3?"#e0e7ff":"#f8fafc"} stroke={INK} strokeWidth="2.6" strokeLinejoin="round"/>

      {phase===0&&<motion.circle cx={O.x} cy={O.y} r="100" fill="#ecfeff" fillOpacity=".35" stroke={TEAL} strokeWidth="2" strokeDasharray="6 5" initial={{opacity:0,scale:.45}} animate={{opacity:1,scale:1}} transition={{type:"spring",stiffness:140,damping:18}} style={{transformBox:"fill-box",transformOrigin:"center"}}/>}
      {phase<3&&<motion.path d={`M${e1.x} ${e1.y} A100 100 0 0 1 ${e2.x} ${e2.y} L${e1.x} ${e1.y}Z`} fill="#c7d2fe" fillOpacity=".75" stroke={IND} strokeWidth="2.4" initial={{pathLength:0}} animate={{pathLength:1}}/>}
      {phase<3&&<line x1={e1.x} y1={e1.y} x2={e2.x} y2={e2.y} stroke={IND} strokeWidth="2"/>}
      <circle cx={O.x} cy={O.y} r="4" fill={GOLD}/><text x={O.x+7} y={O.y+14} fontSize="11" fontWeight="900" fill={GOLD}>O</text>
      <text x={C.x-17} y={C.y-5} fontSize="13" fontWeight="900" fill={INK}>C</text><text x={A.x+8} y={A.y+3} fontSize="13" fontWeight="900" fill={INK}>A</text><text x={B.x-17} y={B.y+15} fontSize="13" fontWeight="900" fill={INK}>B</text>

      {phase===0&&<g transform="translate(308 57)"><rect width="142" height="121" rx="14" fill="#ecfeff" stroke="#99f6e4"/><text x="71" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={INK}>DOUBLE THE AREA</text><text x="71" y="57" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>{semiCoeff}π × 2</text><motion.text x="71" y="91" textAnchor="middle" fontSize="24" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.35,type:"spring"}}>= {fullCoeff}π</motion.text><text x="71" y="110" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM}>area of the full circle</text></g>}

      {phase===1&&<>
        <motion.line x1={O.x} y1={O.y} x2={e2.x} y2={e2.y} stroke={GOLD} strokeWidth="3" initial={{pathLength:0}} animate={{pathLength:1}}/><text x="209" y="91" fontSize="13" fontWeight="900" fill={GOLD} fontFamily={FONT}>r</text>
        <g transform="translate(304 51)"><rect width="149" height="149" rx="14" fill="#eef2ff" stroke="#c7d2fe"/><text x="74.5" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={INK}>CIRCLE AREA</text><text x="74.5" y="55" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>πr² = {fullCoeff}π</text><text x="74.5" y="86" textAnchor="middle" fontSize="20" fontWeight="900" fill={TEAL} fontFamily={FONT}>r = {radius}</text><line x1="22" y1="101" x2="127" y2="101" stroke={DIM}/><motion.text x="74.5" y="130" textAnchor="middle" fontSize="20" fontWeight="900" fill={GREEN} fontFamily={FONT} initial={{scale:.5}} animate={{scale:1}}>diameter = {diameter}</motion.text></g>
      </>}

      {phase===2&&<>
        <motion.line x1={O.x} y1={O.y} x2={O.x} y2={C.y} stroke={TEAL} strokeWidth="2.5" strokeDasharray="5 4" initial={{pathLength:0}} animate={{pathLength:1}}/><motion.line x1={O.x} y1={O.y} x2={C.x} y2={O.y} stroke={TEAL} strokeWidth="2.5" strokeDasharray="5 4" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:.15}}/>
        <text x={O.x+9} y="90" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>r={radius}</text><text x="117" y={O.y-8} textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>r={radius}</text>
        <path d={`M${C.x} 252v7H${A.x}v-7`} fill="none" stroke={GOLD} strokeWidth="1.8"/><text x="172" y="277" textAnchor="middle" fontSize="15" fontWeight="900" fill={GOLD} fontFamily={FONT}>leg = r+r = {diameter}</text>
        <g transform="translate(306 69)"><rect width="145" height="104" rx="13" fill="#ecfeff" stroke="#99f6e4"/><text x="72.5" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={INK}>45° SYMMETRY</text><text x="72.5" y="52" textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={FONT}>center is halfway</text><text x="72.5" y="80" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>AC = BC = {diameter}</text></g>
      </>}

      {phase===3&&<>
        <text x="286" y="245" fontSize="12" fontWeight="900" fill={GREEN}>reflected copy</text>
        <line x1={C.x} y1="253" x2={A.x} y2="253" stroke={GOLD}/><text x="172" y="270" textAnchor="middle" fontSize="13" fontWeight="900" fill={GOLD} fontFamily={FONT}>{diameter}</text>
        <g transform="translate(310 49)"><rect width="143" height="167" rx="14" fill={valid?"#f0fdf4":"#fef2f2"} stroke={valid?"#86efac":"#fecaca"}/><text x="71.5" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={INK}>WHOLE SQUARE</text><text x="71.5" y="56" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>{diameter} × {diameter} = {squareArea}</text><text x="71.5" y="86" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>one of two equal halves</text><motion.text x="71.5" y="119" textAnchor="middle" fontSize="22" fontWeight="900" fill={valid?GREEN:RED} fontFamily={FONT} initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.35,type:"spring"}}>{squareArea} ÷ 2 = {triangleArea}</motion.text><motion.g initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.7,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="25.5" y="133" width="92" height="25" rx="13" fill={valid?GREEN:RED}/><text x="71.5" y="150" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#fff">{valid?`Answer ${problem.answer}`:"check failed"}</text></motion.g></g>
      </>}
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(valid?"#166534":RED):IND,background:final?(valid?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)"}}>{phase===0?`semicircle ${semiCoeff}π becomes a full circle of area ${fullCoeff}π`:phase===1?`πr² = ${fullCoeff}π, so r = ${radius} and 2r = ${diameter}`:phase===2?`equal legs each span two tangent radii: ${diameter}`:valid?`two triangles make a ${diameter}×${diameter} square; one triangle has area ${triangleArea}`:`geometry, area, stored-answer, or choice check failed`}</motion.span>
  </div>;
}
