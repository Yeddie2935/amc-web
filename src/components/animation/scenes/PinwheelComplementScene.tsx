import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",ORANGE="#d97706",RED="#dc2626",DIM="#64748b";
type Pt=[number,number];
const area=(pts:Pt[])=>Math.abs(pts.reduce((s,[x,y],i)=>{const [nx,ny]=pts[(i+1)%pts.length];return s+x*ny-nx*y;},0))/2;

export function PinwheelComplementScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem),n=Math.round(num(data.gridSize,0)),inset=num(data.sideInset,0),centerRaw=Array.isArray(data.center)?data.center:[],center:[number,number]=[num(centerRaw[0],0),num(centerRaw[1],0)];
  const squareArea=n*n,cornerArea=inset*inset,cornerTotal=4*cornerArea,base=n-2*inset;
  const triangles:Pt[][]=[[[inset,0],[n-inset,0],center],[[n,inset],[n,n-inset],center],[[n-inset,n],[inset,n],center],[[0,n-inset],[0,inset],center]];
  const triangleAreas=triangles.map(area),triangleTotal=triangleAreas.reduce((a,b)=>a+b,0),shaded=squareArea-cornerTotal-triangleTotal;
  const choice=problem.choices?.find(c=>Number(c.text)===shaded)?.label;
  const ok=n===5&&inset===1&&center[0]===2.5&&center[1]===2.5&&triangleAreas.every(v=>v===15/4)&&shaded===6&&String(shaded)===problem.shortAnswer&&choice===problem.answer;
  const failure=triangleAreas.some(v=>v!==15/4)?`triangle areas are ${triangleAreas.join(",")}`:shaded!==Number(problem.shortAnswer)?`computed ${shaded}, stored ${problem.shortAnswer}`:`choice ${choice??"missing"}, stored ${problem.answer}`;
  const final=step>=totalSteps-1,phase=final?3:Math.min(step,2);
  const unit=43,ox=28,oy=39,px=(v:number)=>ox+v*unit,py=(v:number)=>oy+v*unit;
  const cornerSquares:[[number,number],[number,number],[number,number],[number,number]]=[[0,0],[n-inset,0],[0,n-inset],[n-inset,n-inset]];

  return <div style={{width:"100%",display:"flex",justifyContent:"center",minWidth:0,padding:"5px 2px",boxSizing:"border-box",overflow:"hidden"}}><svg viewBox="0 0 470 320" width="100%" style={{maxWidth:500,display:"block"}} aria-label="Five by five grid subtracts four corner squares and four triangles to reveal a shaded pinwheel">
    <text x="235" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"start with all twenty-five unit squares":phase===1?"peel away the four unshaded corner squares":phase===2?"the other unshaded pieces are four congruent side triangles":"the shaded pinwheel is everything not removed"}</text>
    <g>
      <rect x={ox} y={oy} width={n*unit} height={n*unit} fill={phase===3?"#bbf7d0":"#eef2ff"} stroke={INK} strokeWidth="2.5"/>
      {phase>=1&&cornerSquares.map(([x,y],i)=><motion.rect key={i} x={px(x)} y={py(y)} width={inset*unit} height={inset*unit} fill={phase===1?"#ffedd5":"#fff"} stroke={phase===1?ORANGE:INK} strokeWidth="1.8" initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:i*.1,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}/>)}
      {phase>=2&&triangles.map((tri,i)=><motion.polygon key={i} points={tri.map(([x,y])=>`${px(x)},${py(y)}`).join(" ")} fill={phase===2?"#ffedd5":"#fff"} stroke={phase===2?ORANGE:INK} strokeWidth="1.8" initial={{opacity:0,scale:.55}} animate={{opacity:1,scale:1}} transition={{delay:i*.12,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}/>)}
      {Array.from({length:n+1},(_,i)=><g key={i} opacity={phase===3?.45:1}><line x1={px(i)} y1={py(0)} x2={px(i)} y2={py(n)} stroke="#94a3b8" strokeWidth="1"/><line x1={px(0)} y1={py(i)} x2={px(n)} y2={py(i)} stroke="#94a3b8" strokeWidth="1"/></g>)}
      {phase===0&&Array.from({length:n*n},(_,i)=><motion.text key={i} x={px(i%n+.5)} y={py(Math.floor(i/n)+.62)} textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*.025}}>1</motion.text>)}
      {phase===1&&cornerSquares.map(([x,y],i)=><text key={i} x={px(x+.5)} y={py(y+.62)} textAnchor="middle" fontSize="16" fontWeight="950" fill={ORANGE} fontFamily={FONT}>1</text>)}
      {phase===2&&triangles.map((tri,i)=>{const x=tri.reduce((s,p)=>s+p[0],0)/3,y=tri.reduce((s,p)=>s+p[1],0)/3;return <text key={i} x={px(x)} y={py(y)+5} textAnchor="middle" fontSize="12" fontWeight="950" fill={ORANGE} fontFamily={FONT}>15/4</text>;})}
    </g>
    {phase===0&&<g transform="translate(278 76)"><rect width="164" height="90" rx="14" fill="#eef2ff" stroke={IND} strokeWidth="2"/><text x="82" y="26" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>WHOLE GRID</text><text x="82" y="58" textAnchor="middle" fontSize="23" fontWeight="950" fill={IND} fontFamily={FONT}>{n} × {n} = {squareArea}</text><text x="82" y="78" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>square units</text></g>}
    {phase===1&&<g transform="translate(278 76)"><rect width="164" height="106" rx="14" fill="#fff7ed" stroke="#fdba74" strokeWidth="2"/><text x="82" y="26" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>FOUR CORNERS</text><text x="82" y="57" textAnchor="middle" fontSize="19" fontWeight="950" fill={ORANGE} fontFamily={FONT}>{inset} × {inset} = {cornerArea} each</text><text x="82" y="86" textAnchor="middle" fontSize="22" fontWeight="950" fill={ORANGE} fontFamily={FONT}>4 × {cornerArea} = {cornerTotal}</text></g>}
    {phase===2&&<g transform="translate(270 60)"><rect width="180" height="157" rx="14" fill="#fff7ed" stroke="#fdba74" strokeWidth="2"/><text x="90" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>ONE SIDE TRIANGLE</text><text x="90" y="51" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK}>base {base} · height {center[1]}</text><text x="90" y="79" textAnchor="middle" fontSize="17" fontWeight="950" fill={ORANGE} fontFamily={FONT}>½·{base}·{center[1]} = 15/4</text><line x1="25" y1="96" x2="155" y2="96" stroke="#fed7aa"/><text x="90" y="121" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>FOUR TRIANGLES</text><text x="90" y="145" textAnchor="middle" fontSize="20" fontWeight="950" fill={ORANGE} fontFamily={FONT}>4 × 15/4 = {triangleTotal}</text></g>}
    {phase===3&&<><g transform="translate(273 69)"><rect width="174" height="154" rx="15" fill={ok?"#f0fdf4":"#fef2f2"} stroke={ok?GREEN:RED} strokeWidth="2.4"/><text x="87" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>WHOLE − UNSHADED</text><text x="87" y="57" textAnchor="middle" fontSize="18" fontWeight="950" fill={INK} fontFamily={FONT}>{squareArea} − {cornerTotal} − {triangleTotal}</text><line x1="29" y1="75" x2="145" y2="75" stroke="#bbf7d0"/><text x="87" y="108" textAnchor="middle" fontSize="28" fontWeight="950" fill={ok?GREEN:RED} fontFamily={FONT}>= {shaded}</text><text x="87" y="136" textAnchor="middle" fontSize="9" fontWeight="850" fill={ok?GREEN:RED}>{ok?"complement and choice verified":failure}</text></g><SvgAnswerBadge show={ok} answer={problem.answer} cx={388} y={265} width={78}/></>} 
    <text x={ox+n*unit/2} y="294" textAnchor="middle" fontSize="10" fontWeight="850" fill={phase===3?GREEN:DIM}>{phase===3?"shaded pinwheel area = 6":"grid side length 5"}</text>
  </svg></div>;
}
