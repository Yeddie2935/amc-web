import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44", IND="#4338ca", TEAL="#0d9488", AMBER="#d97706", WIN="#16a34a", DIM="#94a3b8", BAD="#dc2626";
const tidy=(v:number)=>Number.isInteger(v)?String(v):String(Number(v.toFixed(3)));

/** Fold two boundary arithmetic rows to their middles, then fold the resulting
 * middle column. Data: {size, corners:[topLeft,topRight,bottomLeft,bottomRight]}. */
export function NestedMidpointGridScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem), n=Math.round(num(data.size,5));
  const c=(Array.isArray(data.corners)?data.corners:[1,25,17,81]).map(v=>num(v,0));
  const [tl,tr,bl,br]=c, mid=(n-1)/2;
  const topMid=(tl+tr)/2, bottomMid=(bl+br)/2, center=(topMid+bottomMid)/2;
  const topStep=(tr-tl)/(n-1), bottomStep=(br-bl)/(n-1), verticalStep=(bottomMid-topMid)/(n-1);
  const top=Array.from({length:n},(_,i)=>tl+i*topStep), bottom=Array.from({length:n},(_,i)=>bl+i*bottomStep), column=Array.from({length:n},(_,i)=>topMid+i*verticalStep);
  const stated=problem.shortAnswer==null?null:Number(problem.shortAnswer), choice=problem.choices?.find(x=>Number(x.text)===center)?.label;
  const ok=[topMid,bottomMid,center].every(Number.isFinite)&&(stated==null||stated===center)&&choice===problem.answer;
  const failure=!Number.isFinite(center)?"the nested midpoint is not finite":stated!==null&&stated!==center?`computed ${tidy(center)}, stored ${problem.shortAnswer}`:`choice ${choice??"missing"}, stored ${problem.answer}`;
  const final=step>=totalSteps-1, phase=final?2:Math.min(step,1);
  const W=430,H=350,cell=45,x0=(W-n*cell)/2,y0=43;
  const X=(i:number)=>x0+i*cell, Y=(i:number)=>y0+i*cell;
  const Arc=({x1,x2,y,color,delay=0}:{x1:number,x2:number,y:number,color:string,delay?:number})=><motion.path d={`M ${x1},${y} Q ${(x1+x2)/2},${y-48} ${x2},${y}`} fill="none" stroke={color} strokeWidth={2.2} initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:.8,delay}}/>;

  return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,width:"100%",maxWidth:"100%",minWidth:0,padding:"8px 4px",boxSizing:"border-box"}}>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:"block",maxWidth:450}}>
      <text x={W/2} y={19} textAnchor="middle" fontSize={11.5} fontWeight={850} fill={INK}>{phase===0?"fold the top arithmetic row around its middle":phase===1?"repeat the same fold on the bottom row":"now fold the middle column around X"}</text>
      {Array.from({length:n*n},(_,k)=>{const r=Math.floor(k/n),col=k%n, active=phase===0?r===0:phase===1?(r===0||r===n-1):col===mid||r===0||r===n-1; return <motion.rect key={k} x={X(col)} y={Y(r)} width={cell} height={cell} fill={active?"#f8fafc":"#fff"} stroke={active?INK:"#cbd5e1"} strokeWidth={active?1.5:1} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:k*.012}}/>})}
      <text x={X(0)+cell/2} y={Y(0)+29} textAnchor="middle" fontSize={16} fontWeight={900} fill={IND} fontFamily={FONT}>{tl}</text>
      <text x={X(n-1)+cell/2} y={Y(0)+29} textAnchor="middle" fontSize={16} fontWeight={900} fill={IND} fontFamily={FONT}>{tr}</text>
      <text x={X(0)+cell/2} y={Y(n-1)+29} textAnchor="middle" fontSize={16} fontWeight={900} fill={TEAL} fontFamily={FONT}>{bl}</text>
      <text x={X(n-1)+cell/2} y={Y(n-1)+29} textAnchor="middle" fontSize={16} fontWeight={900} fill={TEAL} fontFamily={FONT}>{br}</text>

      {phase===0&&<g>{top.map((v,i)=><motion.text key={i} x={X(i)+cell/2} y={Y(0)+29} textAnchor="middle" fontSize={16} fontWeight={900} fill={i===mid?AMBER:IND} fontFamily={FONT} initial={{opacity:i===0||i===n-1?1:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:.35+i*.12}} style={{transformBox:"fill-box",transformOrigin:"center"}}>{tidy(v)}</motion.text>)}<Arc x1={X(0)+cell/2} x2={X(n-1)+cell/2} y={Y(0)-3} color={AMBER} delay={.4}/><text x={W/2} y={302} textAnchor="middle" fontSize={16} fontWeight={900} fill={AMBER} fontFamily={FONT}>({tl} + {tr}) ÷ 2 = {tidy(topMid)}</text></g>}

      {phase===1&&<g>{top.map((v,i)=><text key={`t${i}`} x={X(i)+cell/2} y={Y(0)+29} textAnchor="middle" fontSize={13} fontWeight={850} fill={i===mid?AMBER:DIM} fontFamily={FONT}>{tidy(v)}</text>)}{bottom.map((v,i)=><motion.text key={i} x={X(i)+cell/2} y={Y(n-1)+29} textAnchor="middle" fontSize={15} fontWeight={900} fill={i===mid?AMBER:TEAL} fontFamily={FONT} initial={{opacity:i===0||i===n-1?1:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:.3+i*.12}} style={{transformBox:"fill-box",transformOrigin:"center"}}>{tidy(v)}</motion.text>)}<Arc x1={X(0)+cell/2} x2={X(n-1)+cell/2} y={Y(n-1)-3} color={AMBER} delay={.35}/><text x={W/2} y={302} textAnchor="middle" fontSize={16} fontWeight={900} fill={AMBER} fontFamily={FONT}>({bl} + {br}) ÷ 2 = {tidy(bottomMid)}</text></g>}

      {phase===2&&<g>{column.map((v,i)=><motion.g key={i} initial={{opacity:0,scale:.45}} animate={{opacity:1,scale:1}} transition={{delay:.18+i*.12}} style={{transformBox:"fill-box",transformOrigin:"center"}}><circle cx={X(mid)+cell/2} cy={Y(i)+cell/2} r={17} fill={i===mid?"#dcfce7":"#eef2ff"} stroke={i===mid?WIN:IND} strokeWidth={i===mid?2.5:1.4}/><text x={X(mid)+cell/2} y={Y(i)+28} textAnchor="middle" fontSize={14} fontWeight={900} fill={i===mid?WIN:IND} fontFamily={FONT}>{i===mid?tidy(center):tidy(v)}</text></motion.g>)}<motion.path d={`M ${X(mid)-9},${Y(0)+cell/2} Q ${X(mid)-55},${Y(mid)+cell/2} ${X(mid)-9},${Y(n-1)+cell/2}`} fill="none" stroke={AMBER} strokeWidth={2.4} initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:.9,delay:.45}}/><motion.text x={W/2} y={294} textAnchor="middle" fontSize={17} fontWeight={900} fill={WIN} fontFamily={FONT} initial={{opacity:0,scale:.6}} animate={{opacity:1,scale:1}} transition={{type:"spring",stiffness:200,damping:15,delay:.85}}>({tidy(topMid)} + {tidy(bottomMid)}) ÷ 2 = {tidy(center)}</motion.text><text x={W/2} y={315} textAnchor="middle" fontSize={10.5} fontWeight={800} fill={DIM} fontFamily={FONT}>check: ({tl} + {tr} + {bl} + {br}) ÷ 4 = {tidy(center)}</text><motion.g initial={{opacity:0,scale:0}} animate={{opacity:ok?1:0,scale:ok?1:0}} transition={{type:"spring",stiffness:210,damping:14,delay:1.1}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x={W/2-48} y={322} width={96} height={24} rx={12} fill={WIN}/><text x={W/2} y={339} textAnchor="middle" fontSize={13} fontWeight={900} fill="#fff">Answer {problem.answer}</text></motion.g></g>}
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:!ok&&final?BAD:final?"#166534":IND,background:!ok&&final?"#fee2e2":final?"#dcfce7":"#eef2ff",border:`1px solid ${!ok&&final?"#fecaca":final?"#bbf7d0":"#c7d2fe"}`,borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)",boxSizing:"border-box"}}>{!ok&&final?failure:phase===0?`top midpoint = ${tidy(topMid)}`:phase===1?`bottom midpoint = ${tidy(bottomMid)}`:`the center value is ${tidy(center)}`}</motion.span>
  </div>;
}
