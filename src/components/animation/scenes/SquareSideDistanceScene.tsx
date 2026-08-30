import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",TEAL="#0d9488",ORANGE="#d97706",RED="#dc2626",DIM="#64748b";
const tidy=(v:number)=>Number.isInteger(v)?String(v):v.toFixed(2).replace(/0+$/g,"").replace(/\.$/,"");

function Lemming({x,y}:{x:number;y:number}){return <g transform={`translate(${x} ${y})`}><ellipse cx="0" cy="0" rx="14" ry="9" fill="#a16207"/><circle cx="11" cy="-4" r="6" fill="#d97706"/><circle cx="13" cy="-5" r="1.3" fill={INK}/><path d="M-13-2Q-24-11-27-2" fill="none" stroke="#a16207" strokeWidth="3" strokeLinecap="round"/><path d="M-7 7l-4 7M6 7l4 7" stroke="#78350f" strokeWidth="2.3" strokeLinecap="round"/></g>}

export function SquareSideDistanceScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem),side=num(data.squareSide,0),diag=num(data.diagonalRun,0),turn=num(data.turnRun,0),direction=String(data.turnDirection??"");
  const root2=Math.sqrt(2),cornerToTurn=diag/root2;
  const endpoint={x:cornerToTurn+turn/root2,y:cornerToTurn-turn/root2};
  const distances={left:endpoint.x,right:side-endpoint.x,bottom:endpoint.y,top:side-endpoint.y};
  const horizontal=distances.left+distances.right,vertical=distances.bottom+distances.top,total=horizontal+vertical,average=total/4;
  const dot=(1/root2)*(1/root2)+(1/root2)*(-1/root2);
  const choice=problem.choices?.find(c=>Number(c.text)===average)?.label;
  const ok=side===10&&diag===6.2&&turn===2&&direction==="right"&&Math.abs(dot)<1e-12&&Object.values(distances).every(v=>v>0)&&horizontal===side&&vertical===side&&average===5&&String(average)===problem.shortAnswer&&choice===problem.answer;
  const failure=Object.values(distances).some(v=>v<=0)?"route endpoint is not inside the square":Math.abs(dot)>=1e-12?`turn dot product is ${dot}`:average!==Number(problem.shortAnswer)?`computed ${average}, stored ${problem.shortAnswer}`:`choice ${choice??"missing"}, stored ${problem.answer}`;
  const final=step>=totalSteps-1,phase=final?3:Math.min(step,2);
  const ox=45,oy=42,size=226,scale=size/side,px=(x:number)=>ox+x*scale,py=(y:number)=>oy+size-y*scale;
  const sx=px(0),sy=py(0),tx=px(cornerToTurn),ty=py(cornerToTurn),ex=px(endpoint.x),ey=py(endpoint.y);

  return <div style={{width:"100%",display:"flex",justifyContent:"center",minWidth:0,padding:"5px 2px",boxSizing:"border-box",overflow:"hidden"}}><svg viewBox="0 0 470 325" width="100%" style={{maxWidth:500,display:"block"}} aria-label="A lemming runs inside a ten-meter square and perpendicular distances pair to opposite sides">
    <defs><marker id="distance-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={IND}/></marker></defs>
    <text x="235" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"follow the stated route to one point inside the square":phase===1?"the left and right perpendiculars span the full width":phase===2?"the bottom and top perpendiculars span the full height":"both opposite-side pairs are fixed, wherever the lemming stops"}</text>
    <rect x={ox} y={oy} width={size} height={size} fill="#f8fafc" stroke={INK} strokeWidth="2.5"/>
    <line x1={sx} y1={sy} x2={px(side)} y2={py(side)} stroke="#cbd5e1" strokeWidth="1.8" strokeDasharray="5 5"/>
    <text x={ox+size/2} y={oy-9} textAnchor="middle" fontSize="11" fontWeight="900" fill={DIM}>side length {side} m</text>
    {phase===0&&<g>
      <motion.path d={`M${sx} ${sy}L${tx} ${ty}L${ex} ${ey}`} fill="none" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#distance-arrow)" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1.2}}/>
      <circle cx={tx} cy={ty} r="4" fill={ORANGE}/><path d={`M${tx-10/root2} ${ty-10/root2}L${tx} ${ty}L${tx+10/root2} ${ty+10/root2}`} fill="none" stroke={INK} strokeWidth="1.5"/>
      <rect x={(sx+tx)/2-21} y={(sy+ty)/2-18} width="42" height="20" rx="8" fill="#fff"/><text x={(sx+tx)/2} y={(sy+ty)/2-4} textAnchor="middle" fontSize="11" fontWeight="950" fill={ORANGE} fontFamily={FONT}>{diag} m</text>
      <rect x={(tx+ex)/2-18} y={(ty+ey)/2+3} width="38" height="20" rx="8" fill="#fff"/><text x={(tx+ex)/2+1} y={(ty+ey)/2+17} textAnchor="middle" fontSize="11" fontWeight="950" fill={ORANGE} fontFamily={FONT}>{turn} m</text>
      <Lemming x={ex} y={ey}/><g transform="translate(297 80)"><rect width="145" height="120" rx="14" fill="#fff7ed" stroke="#fdba74"/><text x="72.5" y="24" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>ROUTE CHECK</text><text x="72.5" y="50" textAnchor="middle" fontSize="13" fontWeight="950" fill={ORANGE} fontFamily={FONT}>diagonal {diag}</text><text x="72.5" y="75" textAnchor="middle" fontSize="13" fontWeight="950" fill={ORANGE} fontFamily={FONT}>right turn {turn}</text><text x="72.5" y="102" textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN}>endpoint stays inside ✓</text></g>
    </g>}
    {phase>=1&&<g>
      <circle cx={ex} cy={ey} r="7" fill={phase===3?GREEN:ORANGE} stroke="#fff" strokeWidth="2"/><Lemming x={ex} y={ey-13}/>
      <motion.line x1={ox} y1={ey} x2={ex} y2={ey} stroke={phase===1?IND:"#94a3b8"} strokeWidth={phase===1?5:2.5} initial={{pathLength:0}} animate={{pathLength:1}}/><motion.line x1={ex} y1={ey} x2={ox+size} y2={ey} stroke={phase===1?TEAL:"#94a3b8"} strokeWidth={phase===1?5:2.5} initial={{pathLength:0}} animate={{pathLength:1}}/>
      <motion.line x1={ex} y1={oy+size} x2={ex} y2={ey} stroke={phase===2?IND:"#94a3b8"} strokeWidth={phase===2?5:2.5} initial={{pathLength:0}} animate={{pathLength:1}}/><motion.line x1={ex} y1={ey} x2={ex} y2={oy} stroke={phase===2?TEAL:"#94a3b8"} strokeWidth={phase===2?5:2.5} initial={{pathLength:0}} animate={{pathLength:1}}/>
      <text x={(ox+ex)/2} y={ey-8} textAnchor="middle" fontSize="10" fontWeight="950" fill={phase===1?IND:DIM} fontFamily={FONT}>{tidy(distances.left)}</text><text x={(ex+ox+size)/2} y={ey-8} textAnchor="middle" fontSize="10" fontWeight="950" fill={phase===1?TEAL:DIM} fontFamily={FONT}>{tidy(distances.right)}</text>
      <text x={ex+10} y={(ey+oy+size)/2+4} fontSize="10" fontWeight="950" fill={phase===2?IND:DIM} fontFamily={FONT}>{tidy(distances.bottom)}</text><text x={ex+10} y={(ey+oy)/2+4} fontSize="10" fontWeight="950" fill={phase===2?TEAL:DIM} fontFamily={FONT}>{tidy(distances.top)}</text>
    </g>}
    {phase===1&&<g transform="translate(293 79)"><rect width="154" height="105" rx="14" fill="#eef2ff" stroke={IND} strokeWidth="2"/><text x="77" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>LEFT + RIGHT</text><text x="77" y="56" textAnchor="middle" fontSize="17" fontWeight="950" fill={INK} fontFamily={FONT}>{tidy(distances.left)} + {tidy(distances.right)}</text><text x="77" y="86" textAnchor="middle" fontSize="24" fontWeight="950" fill={IND} fontFamily={FONT}>= {horizontal}</text></g>}
    {phase===2&&<g transform="translate(293 79)"><rect width="154" height="105" rx="14" fill="#ecfeff" stroke={TEAL} strokeWidth="2"/><text x="77" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>BOTTOM + TOP</text><text x="77" y="56" textAnchor="middle" fontSize="17" fontWeight="950" fill={INK} fontFamily={FONT}>{tidy(distances.bottom)} + {tidy(distances.top)}</text><text x="77" y="86" textAnchor="middle" fontSize="24" fontWeight="950" fill={TEAL} fontFamily={FONT}>= {vertical}</text></g>}
    {phase===3&&<><g transform="translate(287 62)"><rect width="166" height="177" rx="15" fill={ok?"#f0fdf4":"#fef2f2"} stroke={ok?GREEN:RED} strokeWidth="2.4"/><text x="83" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>FOUR DISTANCES</text><text x="83" y="53" textAnchor="middle" fontSize="15" fontWeight="950" fill={IND} fontFamily={FONT}>horizontal = {horizontal}</text><text x="83" y="79" textAnchor="middle" fontSize="15" fontWeight="950" fill={TEAL} fontFamily={FONT}>vertical = {vertical}</text><line x1="25" y1="95" x2="141" y2="95" stroke="#bbf7d0"/><text x="83" y="120" textAnchor="middle" fontSize="16" fontWeight="950" fill={INK} fontFamily={FONT}>total {total} ÷ 4</text><text x="83" y="151" textAnchor="middle" fontSize="27" fontWeight="950" fill={ok?GREEN:RED} fontFamily={FONT}>= {average}</text><text x="83" y="169" textAnchor="middle" fontSize="8.5" fontWeight="850" fill={ok?GREEN:RED}>{ok?"route and choice verified":failure}</text></g><SvgAnswerBadge show={ok} answer={problem.answer} cx={395} y={270} width={78}/></>} 
    <text x={ox+size/2} y="303" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>opposite-side distances always add to the side length</text>
  </svg></div>;
}
