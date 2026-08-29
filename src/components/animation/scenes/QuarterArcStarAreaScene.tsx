import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",AMBER="#d97706",DIM="#94a3b8",RED="#dc2626";
const parseRatio=(s:unknown)=>String(s??"").replace(/\s/g,"").replace(/[−–—]/g,"-");

/** Cut a circle into four quarter-arcs, rearrange those arcs into a star inside
 * a diameter-square, then subtract the four corner quarter-disks. */
export function QuarterArcStarAreaScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem),r=num(data.radius,0),arcCount=Math.round(num(data.arcCount,0));
  const side=2*r,squareArea=side*side,circleArea=Math.PI*r*r,starArea=squareArea-circleArea;
  const ratio=`(${squareArea/r/r}−π)/π`,stored=parseRatio(problem.shortAnswer),choice=problem.choices?.find(c=>parseRatio(c.text)===parseRatio(ratio))?.label;
  const ok=r>0&&arcCount===4&&Math.abs(starArea/circleArea-(4-Math.PI)/Math.PI)<1e-10&&stored===parseRatio(ratio)&&choice===problem.answer;
  const final=step>=totalSteps-1,phase=final?3:Math.min(step,2);
  const cx=116,cy=145,R=82,sx=258,sy=63,S=164;
  const star=`M ${sx+S/2} ${sy} A ${S/2} ${S/2} 0 0 0 ${sx+S} ${sy+S/2} A ${S/2} ${S/2} 0 0 0 ${sx+S/2} ${sy+S} A ${S/2} ${S/2} 0 0 0 ${sx} ${sy+S/2} A ${S/2} ${S/2} 0 0 0 ${sx+S/2} ${sy} Z`;
  const quarterPaths=[
    `M${sx} ${sy}H${sx+S/2}A${S/2} ${S/2} 0 0 0 ${sx} ${sy+S/2}Z`,
    `M${sx+S} ${sy}V${sy+S/2}A${S/2} ${S/2} 0 0 0 ${sx+S/2} ${sy}Z`,
    `M${sx+S} ${sy+S}H${sx+S/2}A${S/2} ${S/2} 0 0 0 ${sx+S} ${sy+S/2}Z`,
    `M${sx} ${sy+S}V${sy+S/2}A${S/2} ${S/2} 0 0 0 ${sx+S/2} ${sy+S}Z`,
  ];
  const circleArc=(i:number)=>{const a=i*Math.PI/2-Math.PI/2,b=a+Math.PI/2;return `M ${cx+R*Math.cos(a)} ${cy+R*Math.sin(a)} A ${R} ${R} 0 0 1 ${cx+R*Math.cos(b)} ${cy+R*Math.sin(b)}`};
  return <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 460 310" width="100%" style={{maxWidth:500,display:"block"}} aria-label="Four quarter-circle arcs rearranged to form a star inside a square">
      {phase===0&&<g>
        <circle cx={cx} cy={cy} r={R} fill="#eef2ff" stroke={INK} strokeWidth="2"/>
        {[0,1,2,3].map(i=><motion.path key={i} d={circleArc(i)} fill="none" stroke={[IND,AMBER,"#0d9488","#db2777"][i]} strokeWidth="5" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:i*.18,duration:.55}}/>)}
        {[[-1,0],[0,1],[1,0],[0,-1]].map(([dx,dy],i)=><motion.circle key={i} cx={cx+dx*R} cy={cy+dy*R} r="4.5" fill={INK} initial={{scale:0}} animate={{scale:1}} transition={{delay:.5+i*.12}} style={{transformBox:"fill-box",transformOrigin:"center"}}/>)}
        <line x1={cx} y1={cy} x2={cx+R} y2={cy} stroke={DIM} strokeWidth="1.5"/><text x={cx+R/2} y={cy-8} textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>r = {r}</text>
        <text x="332" y="105" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>4 equal cuts</text><text x="332" y="137" textAnchor="middle" fontSize="20" fontWeight="900" fill={IND} fontFamily={FONT}>90° each</text><text x="332" y="168" textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM}>the colored arcs</text><text x="332" y="184" textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM}>are congruent</text>
      </g>}
      {phase>=1&&<g>
        <rect x={sx} y={sy} width={S} height={S} fill="#f8fafc" stroke={INK} strokeWidth="2.2"/>
        {phase>=2&&quarterPaths.map((d,i)=><motion.path key={i} d={d} fill={["#fde68a","#bfdbfe","#ddd6fe","#fecdd3"][i]} fillOpacity=".8" stroke={[AMBER,"#2563eb","#7c3aed","#db2777"][i]} strokeWidth="1.2" initial={{opacity:0,scale:.65}} animate={{opacity:1,scale:1}} transition={{delay:i*.12,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}/>)}
        <motion.path d={star} fill={phase===3?"#dcfce7":"#eef2ff"} stroke={phase===3?GREEN:IND} strokeWidth="3" initial={{pathLength:0,opacity:.2}} animate={{pathLength:1,opacity:1}} transition={{duration:1}}/>
        {[0,1,2,3].map(i=>{const p=[[sx+S/2,sy],[sx+S,sy+S/2],[sx+S/2,sy+S],[sx,sy+S/2]][i];return <circle key={i} cx={p[0]} cy={p[1]} r="4" fill={INK}/>})}
        <line x1={sx} y1={sy+S+11} x2={sx+S} y2={sy+S+11} stroke={DIM}/><text x={sx+S/2} y={sy+S+27} textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>diameter = {side}</text>
      </g>}
      {phase===1&&<g>
        {[0,1,2,3].map(i=><motion.path key={i} d={circleArc(i)} fill="none" stroke={[IND,AMBER,"#0d9488","#db2777"][i]} strokeWidth="4" initial={{x:0,y:0,opacity:1}} animate={{x:150,y:(i-1.5)*18,opacity:0}} transition={{delay:i*.12,duration:.75}}/>)}
        <text x="116" y="116" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>same 4 arcs</text><path d="M172 145 C205 122 220 122 246 139" fill="none" stroke={AMBER} strokeWidth="2" markerEnd="url(#qas-arrow)"/><defs><marker id="qas-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={AMBER}/></marker></defs>
      </g>}
      {phase===2&&<g><text x="111" y="88" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>4 corner quarters</text><text x="111" y="120" textAnchor="middle" fontSize="17" fontWeight="900" fill={AMBER} fontFamily={FONT}>4 × π·{r}²/4</text><motion.text x="111" y="155" textAnchor="middle" fontSize="22" fontWeight="900" fill={IND} fontFamily={FONT} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:.7,type:"spring"}}>= {r*r}π</motion.text><text x="111" y="180" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM}>one whole original circle</text><text x="111" y="223" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>square: {side} × {side} = {squareArea}</text></g>}
      {phase===3&&<g><rect x="24" y="53" width="190" height="192" rx="15" fill={ok?"#f0fdf4":"#fef2f2"} stroke={ok?GREEN:RED} strokeWidth="1.8"/><text x="119" y="82" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>STAR AREA</text><text x="119" y="111" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>{squareArea} − {r*r}π</text><text x="119" y="143" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>divide by circle area {r*r}π</text><text x="119" y="174" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>({squareArea}−{r*r}π)/{r*r}π</text><motion.text x="119" y="208" textAnchor="middle" fontSize="21" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:.55,type:"spring"}}>= {ratio}</motion.text><motion.g initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} transition={{delay:.9,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="73" y="259" width="92" height="27" rx="14" fill={ok?GREEN:RED}/><text x="119" y="277" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">Answer {ok?problem.answer:"failed"}</text></motion.g></g>}
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(ok?"#166534":RED):IND,background:final?(ok?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)"}}>{phase===0?"four marked points split the circle into four quarter-arcs":phase===1?"rejoin the same arcs: their endpoints span a 4 × 4 square":phase===2?"the four excluded quarters have the area of the original circle":ok?"(16 − 4π) ÷ 4π = (4 − π)/π":"area, stored answer, or choice check failed"}</motion.span>
  </div>;
}
