import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",RED="#dc2626",DIM="#64748b";
const FILLS=["#fbbf24","#60a5fa","#a78bfa"];

/** Clip corner-centered circles to a rectangle, sum the three quarters, and subtract. */
export function CornerQuarterCircleSubtractScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem),width=num(data.rectangleWidth,0),height=num(data.rectangleHeight,0);
  const radii=(Array.isArray(data.radii)?data.radii:[]).map(v=>num(v,0));
  const labels=(Array.isArray(data.cornerLabels)?data.cornerLabels:[]).map(String);
  const rectangleArea=width*height,quarterSquareSum=radii.reduce((s,r)=>s+r*r,0),circleArea=Math.PI/4*quarterSquareSum,leftover=rectangleArea-circleArea;
  const nearest=Math.round(leftover*2)/2,choice=problem.choices?.find(c=>Number(c.text)===nearest)?.label;
  const tangent=radii[0]+radii[1]===height&&radii[1]+radii[2]===width;
  const ok=tangent&&Math.abs(leftover-4.0044)<.01&&nearest===Number(problem.shortAnswer)&&choice===problem.answer;
  const failure=!tangent?"adjacent quarter-circles are not tangent":nearest!==Number(problem.shortAnswer)?`nearest half is ${nearest}, stored ${problem.shortAnswer}`:`choice ${choice??"missing"}, stored ${problem.answer}`;
  const final=step>=totalSteps-1,phase=final?3:Math.min(step,2);
  const k=42,x=85,top=124,w=width*k,h=height*k,bottom=top+h;
  const centers=[{x,y:bottom},{x,y:top},{x:x+w,y:top}];

  const Diagram=({showCircles,showArea=false}:{showCircles:boolean;showArea?:boolean})=><g>
    {showArea&&<rect x={x} y={top} width={w} height={h} fill="#dcfce7"/>}
    {showCircles&&radii.map((r,i)=><motion.circle key={`full-${i}`} cx={centers[i].x} cy={centers[i].y} r={r*k} fill="none" stroke={FILLS[i]} strokeWidth="1.8" strokeOpacity=".45" initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",stiffness:150,damping:17,delay:i*.14}} style={{transformBox:"fill-box",transformOrigin:"center"}}/>)}
    {showCircles&&<g clipPath="url(#inside-rect)">{radii.map((r,i)=><motion.circle key={`inside-${i}`} cx={centers[i].x} cy={centers[i].y} r={r*k} fill={FILLS[i]} fillOpacity={showArea?.7:.5} initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:150,damping:17,delay:.15+i*.14}} style={{transformBox:"fill-box",transformOrigin:"center"}}/>)}</g>}
    <rect x={x} y={top} width={w} height={h} fill="none" stroke={INK} strokeWidth="2.3"/>
    {labels.map((label,i)=><text key={label} x={centers[i].x+(i===2?9:-10)} y={centers[i].y+(i===0?17:-9)} fontSize="13" fontWeight="900" fill={INK}>{label}</text>)}<text x={x+w+9} y={bottom+17} fontSize="13" fontWeight="900" fill={INK}>D</text>
    <line x1={x} y1={bottom+8} x2={x+w} y2={bottom+8} stroke={DIM}/><text x={x+w/2} y={bottom+23} textAnchor="middle" fontSize="11" fontWeight="900" fill={DIM} fontFamily={FONT}>{width}</text>
    <line x1={x-8} y1={top} x2={x-8} y2={bottom} stroke={DIM}/><text x={x-16} y={top+h/2+4} textAnchor="middle" fontSize="11" fontWeight="900" fill={DIM} fontFamily={FONT}>{height}</text>
    {showCircles&&<><circle cx={x} cy={top+radii[1]*k} r="3" fill={GREEN}/><circle cx={x+radii[1]*k} cy={top} r="3" fill={GREEN}/></>}
  </g>;

  return <div style={{display:"flex",justifyContent:"center",width:"100%",maxWidth:480,minWidth:0,padding:"6px 4px",boxSizing:"border-box",overflow:"hidden"}}><svg viewBox="0 0 460 330" width="100%" style={{flex:"1 1 0",maxWidth:"100%",minWidth:0,display:"block"}}>
    <defs><clipPath id="inside-rect"><rect x={x} y={top} width={w} height={h}/></clipPath></defs>
    <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"start with the full 3-by-5 rectangle":phase===1?"clipping each corner circle leaves one quarter inside":""}{phase===2?"the three colored quarters are tangent, so their areas simply add":phase===3?"subtract the colored quarters; the green region is left":""}</text>
    <Diagram showCircles={phase>=1} showArea={phase===3}/>
    {phase===0&&<g transform="translate(123 280)"><rect width="214" height="39" rx="11" fill="#eef2ff" stroke={IND}/><text x="107" y="26" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>{height} · {width} = {rectangleArea}</text></g>}
    {phase===1&&<><g transform="translate(95 279)"><rect width="270" height="42" rx="11" fill="#f8fafc" stroke="#cbd5e1"/><text x="135" y="18" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>centers A, B, C are rectangle corners</text><text x="135" y="34" textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN}>each inside angle is 90° → one quarter</text></g></>}
    {phase===2&&<g transform="translate(72 278)"><rect width="316" height="44" rx="11" fill="#f5f3ff" stroke={IND}/><text x="158" y="17" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>quarter-circle area</text><text x="158" y="35" textAnchor="middle" fontSize="14.5" fontWeight="900" fill={IND} fontFamily={FONT}>π/4 · ({radii.map(r=>`${r}²`).join(" + ")}) = {quarterSquareSum}π/4 = 7π/2</text></g>}
    {phase===3&&<><g transform="translate(74 276)"><rect width="312" height="45" rx="11" fill={ok?"#dcfce7":"#fee2e2"} stroke={ok?GREEN:RED} strokeWidth="2"/><text x="156" y="19" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>uncovered area</text><text x="156" y="37" textAnchor="middle" fontSize="15" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT}>{rectangleArea} − 7π/2 ≈ {leftover.toFixed(2)} → {nearest.toFixed(1)}</text></g><SvgAnswerBadge show={ok} answer={problem.answer} cx={414} y={296} width={78}/></>}
    <AnimatePresence>{final&&!ok&&<motion.text x="230" y="328" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
  </svg></div>;
}
