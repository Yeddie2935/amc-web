import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

type Pt={x:number;y:number};
const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",AMBER="#d97706",TEAL="#0d9488",DIM="#94a3b8",RED="#dc2626";
const poly=(ps:Pt[])=>ps.map(p=>`${p.x},${p.y}`).join(" ");
const triangle=(cx:number,top:number,side:number)=>{const h=side*Math.sqrt(3)/2;return [{x:cx,y:top},{x:cx+side/2,y:top+h},{x:cx-side/2,y:top+h}]};

/** Pair an equilateral triangle's three sides with a regular hexagon's six,
 * quarter the triangle by its midsegments, then build the hexagon from six of
 * those half-side pieces. */
export function EqualPerimeterTriangleHexagonScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem),triArea=num(data.triangleArea,0),triSides=Math.round(num(data.triangleSides,0)),hexSides=Math.round(num(data.hexagonSides,0));
  const scale=triSides/hexSides,pieceArea=triArea*scale*scale,hexArea=hexSides*pieceArea;
  const answer=Number(problem.shortAnswer),choice=problem.choices?.find(c=>Number(c.text)===hexArea)?.label;
  const ok=triSides===3&&hexSides===6&&scale===.5&&pieceArea===1&&hexArea===answer&&choice===problem.answer;
  const final=step>=totalSteps-1,phase=final?3:Math.min(step,2);
  const big=triangle(128,55,176),A=big[0],B=big[1],C=big[2],mid=(p:Pt,q:Pt)=>({x:(p.x+q.x)/2,y:(p.y+q.y)/2});
  const AB=mid(A,B),BC=mid(B,C),CA=mid(C,A),pieces=[[A,AB,CA],[AB,B,BC],[CA,BC,C],[AB,BC,CA]];
  const hc={x:348,y:145},hr=82,verts=Array.from({length:6},(_,i)=>({x:hc.x+hr*Math.cos(i*Math.PI/3),y:hc.y+hr*Math.sin(i*Math.PI/3)}));
  const hexPieces=verts.map((v,i)=>[hc,v,verts[(i+1)%6]]);
  const colors=["#fde68a","#bfdbfe","#ddd6fe","#fecdd3","#99f6e4","#fed7aa"];
  return <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 470 310" width="100%" style={{maxWidth:500,display:"block"}} aria-label="An equal-perimeter triangle and hexagon decomposed into equilateral triangles">
      {phase===0&&<g>
        <polygon points={poly(big)} fill="#eef2ff" stroke={INK} strokeWidth="2.5"/>
        {[0,1,2].map(i=>{const p=big[i],q=big[(i+1)%3];return <g key={i}><line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={IND} strokeWidth="5"/><circle cx={(2*p.x+q.x)/3} cy={(2*p.y+q.y)/3} r="5" fill="#fff" stroke={IND} strokeWidth="2"/><circle cx={(p.x+2*q.x)/3} cy={(p.y+2*q.y)/3} r="5" fill="#fff" stroke={IND} strokeWidth="2"/></g>})}
        {hexPieces.map((ps,i)=><polygon key={i} points={poly(ps)} fill={colors[i]} fillOpacity=".45" stroke={i%2?AMBER:TEAL} strokeWidth="2"/>)}
        <text x="128" y="246" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>{triSides}s</text><text x="348" y="246" textAnchor="middle" fontSize="15" fontWeight="900" fill={TEAL} fontFamily={FONT}>{hexSides}h</text>
        <motion.path d="M195 263H283" stroke={AMBER} strokeWidth="2" initial={{pathLength:0}} animate={{pathLength:1}}/><text x="239" y="284" textAnchor="middle" fontSize="17" fontWeight="900" fill={INK} fontFamily={FONT}>{triSides}s = {hexSides}h → h = s/2</text>
      </g>}
      {phase>=1&&<g>
        {pieces.map((ps,i)=><motion.polygon key={i} points={poly(ps)} fill={colors[i]} fillOpacity={phase===1?.8:.25} stroke={phase===1?IND:DIM} strokeWidth="2" initial={{opacity:0,scale:.55}} animate={{opacity:1,scale:1}} transition={{delay:i*.14,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}/>)}
        <text x="128" y="240" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>area {triArea}</text>
        {phase===1&&<g><text x="345" y="81" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>halve both dimensions</text><text x="345" y="116" textAnchor="middle" fontSize="19" fontWeight="900" fill={IND} fontFamily={FONT}>area × (1/2)²</text><motion.text x="345" y="155" textAnchor="middle" fontSize="23" fontWeight="900" fill={GREEN} fontFamily={FONT} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:.65,type:"spring"}}>{triArea} ÷ 4 = {pieceArea}</motion.text><text x="345" y="183" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM}>each small triangle</text></g>}
      </g>}
      {phase>=2&&<g>
        {hexPieces.map((ps,i)=><motion.polygon key={i} points={poly(ps)} fill={colors[i]} fillOpacity={phase===3?.72:.9} stroke={phase===3?GREEN:IND} strokeWidth="2" initial={{x:-220+(i%3)*8,y:(i-2.5)*10,opacity:0}} animate={{x:0,y:0,opacity:1}} transition={{delay:i*.12,type:"spring",stiffness:130,damping:16}}/>)}
        <circle cx={hc.x} cy={hc.y} r="4" fill={INK}/>
        {hexPieces.map((ps,i)=>{const p={x:(ps[0].x+ps[1].x+ps[2].x)/3,y:(ps[0].y+ps[1].y+ps[2].y)/3};return <motion.text key={i} x={p.x} y={p.y+5} textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT} initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} transition={{delay:.55+i*.1}} style={{transformBox:"fill-box",transformOrigin:"center"}}>1</motion.text>})}
        {phase===2&&<g><text x="348" y="250" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>6 congruent pieces</text><text x="128" y="274" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM}>one extra copy appears for each</text><text x="128" y="288" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM}>of the hexagon's six sectors</text></g>}
      </g>}
      {phase===3&&<g><rect x="42" y="65" width="172" height="146" rx="15" fill={ok?"#f0fdf4":"#fef2f2"} stroke={ok?GREEN:RED} strokeWidth="1.8"/><text x="128" y="94" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>HEXAGON AREA</text><text x="128" y="132" textAnchor="middle" fontSize="21" fontWeight="900" fill={IND} fontFamily={FONT}>{hexSides} × {pieceArea}</text><motion.text x="128" y="174" textAnchor="middle" fontSize="30" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:.55,type:"spring"}}>= {hexArea}</motion.text><motion.g initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} transition={{delay:.9,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="82" y="253" width="92" height="27" rx="14" fill={ok?GREEN:RED}/><text x="128" y="271" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">Answer {ok?problem.answer:"failed"}</text></motion.g></g>}
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(ok?"#166534":RED):IND,background:final?(ok?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)"}}>{phase===0?"one triangle side equals two hexagon sides":phase===1?"half the side means one quarter the area":phase===2?"six unit-area triangles meet at the hexagon's center":ok?"6 × 1 = 6":"decomposition, stored answer, or choice check failed"}</motion.span>
  </div>;
}
