import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GOLD="#d97706",GREEN="#16a34a",RED="#dc2626",DIM="#64748b";
type Point={x:number;y:number};

/** Count equal arcs, solve two radius-isosceles base angles, and add them. Data: { arcCount, xEndpoints, yEndpoints, labels }. */
export function EqualArcBaseAnglesScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem),count=Math.round(num(data.arcCount,0));
  const labels=(Array.isArray(data.labels)?data.labels:[]).map(String);
  const xEnds=(Array.isArray(data.xEndpoints)?data.xEndpoints:[]).map(v=>Math.round(num(v,0))),yEnds=(Array.isArray(data.yEndpoints)?data.yEndpoints:[]).map(v=>Math.round(num(v,0)));
  const oneArc=360/count,span=(ends:number[])=>{const d=Math.abs(ends[1]-ends[0]);return Math.min(d,count-d)};
  const xCentral=span(xEnds)*oneArc,yCentral=span(yEnds)*oneArc,xAngle=(180-xCentral)/2,yAngle=(180-yCentral)/2,sum=xAngle+yAngle;
  const final=step>=totalSteps-1,phase=final?3:Math.min(step,2),stored=Number(String(problem.shortAnswer??"").replace(/[^\d.-]/g,"")),choice=problem.choices?.find(c=>Number(c.text)===sum)?.label;
  const ok=oneArc===30&&xCentral===120&&yCentral===60&&xAngle===30&&yAngle===60&&sum===stored&&choice===problem.answer;
  const failure=sum!==stored?`computed ${sum}°; stored ${problem.shortAnswer}`:`choice ${choice??"missing"}; stored ${problem.answer}`;
  const O={x:215,y:130},r=97,point=(i:number):Point=>{const a=(-120+i*360/count)*Math.PI/180;return{x:O.x+r*Math.cos(a),y:O.y+r*Math.sin(a)}};
  const pts=labels.map((_,i)=>point(i));
  const arc=(a:number,b:number,rad=r)=>{const p=point(a),q=point(b),steps=(b-a+count)%count,large=steps>count/2?1:0;return`M ${p.x} ${p.y} A ${rad} ${rad} 0 ${large} 1 ${q.x} ${q.y}`};
  const wedge=(a:number,b:number,rad:number)=>{const p=point(a),q=point(b),pa={x:O.x+(p.x-O.x)*rad/r,y:O.y+(p.y-O.y)*rad/r},qa={x:O.x+(q.x-O.x)*rad/r,y:O.y+(q.y-O.y)*rad/r};return`M ${O.x} ${O.y} L ${pa.x} ${pa.y} A ${rad} ${rad} 0 0 1 ${qa.x} ${qa.y} Z`};
  const Triangle=({ends,color}:{ends:number[];color:string})=><g><motion.polygon points={`${O.x},${O.y} ${pts[ends[0]].x},${pts[ends[0]].y} ${pts[ends[1]].x},${pts[ends[1]].y}`} fill={`${color}18`} stroke={color} strokeWidth="2.5" initial={{opacity:0}} animate={{opacity:1}}/><line x1={O.x} y1={O.y} x2={pts[ends[0]].x} y2={pts[ends[0]].y} stroke={color} strokeWidth="2.4"/><line x1={O.x} y1={O.y} x2={pts[ends[1]].x} y2={pts[ends[1]].y} stroke={color} strokeWidth="2.4"/></g>;

  return <div style={{display:"flex",justifyContent:"center",width:"100%",minWidth:0,padding:"6px 4px",boxSizing:"border-box"}}><svg viewBox="0 0 430 340" width="100%" style={{maxWidth:465,minWidth:0,display:"block"}}>
    <text x="215" y="16" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"12 equal arcs divide the full turn equally":phase===1?"A to E spans 4 arc-steps":phase===2?"G to I spans 2 arc-steps":"bring the two base angles together"}</text>
    <circle cx={O.x} cy={O.y} r={r} fill="#fff" stroke={INK} strokeWidth="2"/>
    {phase===0&&Array.from({length:count},(_,i)=><motion.path key={i} d={arc(i,(i+1)%count)} fill="none" stroke={i%2?"#0d9488":IND} strokeWidth="5" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:i*.06}}/>)}
    {phase===1&&<><motion.path d={arc(xEnds[0],xEnds[1])} fill="none" stroke={IND} strokeWidth="7" initial={{pathLength:0}} animate={{pathLength:1}}/><Triangle ends={xEnds} color={IND}/><path d={wedge(xEnds[0],xEnds[1],34)} fill="#c7d2fe" stroke={IND}/><text x="225" y="102" fontSize="11" fontWeight="900" fill={IND}>{xCentral}°</text></>}
    {phase===2&&<><motion.path d={arc(yEnds[0],yEnds[1])} fill="none" stroke={GOLD} strokeWidth="7" initial={{pathLength:0}} animate={{pathLength:1}}/><Triangle ends={yEnds} color={GOLD}/><path d={wedge(yEnds[0],yEnds[1],34)} fill="#fef3c7" stroke={GOLD}/><text x="199" y="159" fontSize="11" fontWeight="900" fill={GOLD}>{yCentral}°</text></>}
    {phase===3&&<><g opacity=".8"><Triangle ends={xEnds} color={IND}/><Triangle ends={yEnds} color={GOLD}/></g><motion.path d={arc(xEnds[0],xEnds[1])} fill="none" stroke={IND} strokeWidth="5" initial={{pathLength:0}} animate={{pathLength:1}}/><motion.path d={arc(yEnds[0],yEnds[1])} fill="none" stroke={GOLD} strokeWidth="5" initial={{pathLength:0}} animate={{pathLength:1}}/></>}
    {pts.map((p,i)=>{const vx=(p.x-O.x)/r,vy=(p.y-O.y)/r;return <g key={labels[i]}><circle cx={p.x} cy={p.y} r="3.5" fill={INK}/><text x={p.x+vx*15} y={p.y+vy*15+4} textAnchor="middle" fontSize="11" fontWeight="900" fill={INK}>{labels[i]}</text></g>})}
    <circle cx={O.x} cy={O.y} r="3.7" fill={INK}/><text x={O.x+8} y={O.y-7} fontSize="11" fontWeight="900" fill={INK}>O</text>
    {phase===0&&<g><rect x="103" y="252" width="224" height="44" rx="12" fill="#eef2ff" stroke={IND}/><text x="215" y="280" textAnchor="middle" fontSize="19" fontWeight="900" fill={IND} fontFamily={FONT}>360° ÷ {count} = {oneArc}°</text></g>}
    {phase===1&&<g><rect x="66" y="248" width="298" height="58" rx="12" fill="#eef2ff" stroke={IND}/><text x="215" y="269" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>∠AOE = 4 × {oneArc}° = {xCentral}°</text><text x="215" y="294" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>x = (180° − {xCentral}°) ÷ 2 = {xAngle}°</text></g>}
    {phase===2&&<g><rect x="66" y="248" width="298" height="58" rx="12" fill="#fff7ed" stroke={GOLD}/><text x="215" y="269" textAnchor="middle" fontSize="12" fontWeight="900" fill={GOLD} fontFamily={FONT}>∠GOI = 2 × {oneArc}° = {yCentral}°</text><text x="215" y="294" textAnchor="middle" fontSize="17" fontWeight="900" fill={GOLD} fontFamily={FONT}>y = (180° − {yCentral}°) ÷ 2 = {yAngle}°</text></g>}
    {phase===3&&<><motion.g initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}><rect x="74" y="247" width="282" height="57" rx="13" fill={ok?"#dcfce7":"#fee2e2"} stroke={ok?GREEN:RED} strokeWidth="2.5"/><text x="215" y="270" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>the two requested base angles</text><text x="215" y="294" textAnchor="middle" fontSize="16" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT}>x + y = {xAngle}° + {yAngle}° = {sum}°</text></motion.g><SvgAnswerBadge show={ok} answer={problem.answer} cx={215} y={311} width={78}/></>}
    <AnimatePresence>{final&&!ok&&<motion.text x="215" y="339" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
  </svg></div>;
}
