import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

type P={label:string,x:number,y:number};
const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44", IND="#4338ca", TEAL="#0d9488", AMBER="#d97706", WIN="#16a34a", DIM="#94a3b8", BAD="#dc2626";
const fills=["#fde68a","#bfdbfe","#c7d2fe"];
const tidy=(v:number)=>Number.isInteger(v)?String(v):String(Number(v.toFixed(2)));
const area=(pts:P[])=>Math.abs(pts.reduce((s,p,i)=>{const q=pts[(i+1)%pts.length];return s+p.x*q.y-q.x*p.y},0))/2;

/** Frame a lattice triangle in its smallest axis-aligned rectangle, peel off
 * the three outside right triangles, then compare the remainder with the full
 * coordinate grid. Data: {grid:[width,height],vertices:["A|1|3",...]}. */
export function TriangleBoxComplementScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem), grid=(Array.isArray(data.grid)?data.grid:[6,5]).map(v=>Math.round(num(v,0)));
  const gw=grid[0]??0,gh=grid[1]??0;
  const vertices=(Array.isArray(data.vertices)?data.vertices:[]).map(v=>{const [label,x,y]=String(v).split("|");return {label,x:num(x,0),y:num(y,0)}});
  const A=vertices[0]??{label:"A",x:1,y:3},B=vertices[1]??{label:"B",x:5,y:1},C=vertices[2]??{label:"C",x:4,y:4};
  const xmin=Math.min(...vertices.map(p=>p.x)),xmax=Math.max(...vertices.map(p=>p.x)),ymin=Math.min(...vertices.map(p=>p.y)),ymax=Math.max(...vertices.map(p=>p.y));
  const boxW=xmax-xmin,boxH=ymax-ymin,boxArea=boxW*boxH,triArea=area(vertices),gridArea=gw*gh;
  const corners=[
    [{label:"",x:xmin,y:ymax},A,C],
    [{label:"",x:xmax,y:ymax},C,B],
    [{label:"",x:xmin,y:ymin},A,B],
  ];
  const outside=corners.map(area),outsideSum=outside.reduce((a,b)=>a+b,0),remainder=boxArea-outsideSum;
  const rg=gcd(Math.round(triArea*1000),Math.round(gridArea*1000)),result=`${Math.round(triArea*1000)/rg}/${Math.round(gridArea*1000)/rg}`;
  const stated=String(problem.shortAnswer??"").replace(/\s/g,""),choice=problem.choices?.find(c=>String(c.text).replace(/\s/g,"")===result)?.label;
  const ok=Math.abs(remainder-triArea)<1e-9&&(!stated||stated===result)&&choice===problem.answer;
  const failure=Math.abs(remainder-triArea)>=1e-9?`box subtraction gives ${tidy(remainder)}, shoelace gives ${tidy(triArea)}`:stated&&stated!==result?`computed ${result}, stored ${stated}`:`choice ${choice??"missing"}, stored ${problem.answer}`;
  const final=step>=totalSteps-1,phase=final?4:Math.min(step,3);
  const W=470,H=315,cell=46,gx=24,gy=24,X=(x:number)=>gx+x*cell,Y=(y:number)=>gy+(gh-y)*cell,poly=(ps:P[])=>ps.map(p=>`${X(p.x)},${Y(p.y)}`).join(" ");
  return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,width:"100%",maxWidth:"100%",minWidth:0,padding:"8px 4px",boxSizing:"border-box"}}><svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:"block",maxWidth:480}}>
    {phase===3&&Array.from({length:gw*gh},(_,i)=><motion.rect key={i} x={X(i%gw)} y={Y(Math.floor(i/gw)+1)} width={cell} height={cell} fill="#dcfce7" fillOpacity={.48} initial={{opacity:0,scale:.4}} animate={{opacity:1,scale:1}} transition={{delay:i*.025}} style={{transformBox:"fill-box",transformOrigin:"center"}}/>)}
    {phase>=1&&phase<3&&corners.map((ps,i)=><motion.polygon key={i} points={poly(ps)} fill={fills[i]} fillOpacity={.85} stroke={[AMBER,TEAL,IND][i]} strokeWidth={1.5} initial={{opacity:0,scale:.75}} animate={{opacity:1,scale:1}} transition={{type:"spring",stiffness:180,damping:16,delay:.2+i*.2}} style={{transformBox:"fill-box",transformOrigin:"center"}}/>)}
    {Array.from({length:gw+1},(_,i)=><line key={`v${i}`} x1={X(i)} y1={Y(0)} x2={X(i)} y2={Y(gh)} stroke="#94a3b8" strokeWidth={i===0||i===gw?1.5:.8}/>)}
    {Array.from({length:gh+1},(_,i)=><line key={`h${i}`} x1={X(0)} y1={Y(i)} x2={X(gw)} y2={Y(i)} stroke="#94a3b8" strokeWidth={i===0||i===gh?1.5:.8}/>)}
    <motion.polygon points={poly(vertices)} fill={phase>=2?IND:"#c7d2fe"} fillOpacity={phase>=2?.42:.25} stroke={INK} strokeWidth={2.5} initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1}}/>
    {phase<=2&&<motion.rect x={X(xmin)} y={Y(ymax)} width={boxW*cell} height={boxH*cell} fill="none" stroke={AMBER} strokeWidth={2} strokeDasharray="7 4" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.4}}/>}
    {vertices.map((p,i)=><motion.g key={p.label} initial={{opacity:0,scale:.4}} animate={{opacity:1,scale:1}} transition={{delay:.25+i*.15}} style={{transformBox:"fill-box",transformOrigin:"center"}}><circle cx={X(p.x)} cy={Y(p.y)} r={5} fill={INK}/><rect x={X(p.x)+(p===B?7:-39)} y={Y(p.y)+(p===C?-27:7)} width={48} height={19} rx={8} fill="#fff" fillOpacity={.9}/><text x={X(p.x)+(p===B?11:-35)} y={Y(p.y)+(p===C?-14:21)} fontSize={10} fontWeight={900} fill={INK} fontFamily={FONT}>{p.label}({p.x},{p.y})</text></motion.g>)}

    {phase===0&&<g><text x={350} y={58} fontSize={11} fontWeight={850} fill={INK}>smallest frame</text><text x={350} y={84} fontSize={15} fontWeight={900} fill={AMBER} fontFamily={FONT}>{boxW} × {boxH}</text><text x={350} y={107} fontSize={10} fontWeight={800} fill={DIM}>every vertex lies</text><text x={350} y={121} fontSize={10} fontWeight={800} fill={DIM}>on its boundary</text></g>}
    {phase===1&&<g><text x={350} y={52} fontSize={11} fontWeight={850} fill={INK}>outside pieces</text>{outside.map((a,i)=>{const legs=[[3,1],[1,3],[4,2]][i];return <motion.text key={i} x={350} y={82+i*38} fontSize={9.5} fontWeight={900} fill={[AMBER,TEAL,IND][i]} fontFamily={FONT} initial={{opacity:0,x:8}} animate={{opacity:1,x:0}} transition={{delay:.4+i*.2}}>△{i+1}: ½·{legs[0]}·{legs[1]} = {tidy(a)}</motion.text>})}<text x={350} y={214} fontSize={10} fontWeight={800} fill={DIM}>three right triangles</text></g>}
    {phase===2&&<g><text x={350} y={55} fontSize={11} fontWeight={850} fill={INK}>rectangle − corners</text><text x={350} y={86} fontSize={14} fontWeight={900} fill={AMBER} fontFamily={FONT}>{boxW}×{boxH} = {boxArea}</text><text x={350} y={117} fontSize={12} fontWeight={900} fill={DIM} fontFamily={FONT}>− ({outside.map(tidy).join(" + ")})</text><motion.text x={350} y={154} fontSize={20} fontWeight={900} fill={IND} fontFamily={FONT} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{type:"spring",stiffness:200,damping:15,delay:.7}}>= {tidy(remainder)}</motion.text><text x={350} y={174} fontSize={10} fontWeight={800} fill={DIM}>square units remain</text></g>}
    {phase===3&&<g><text x={350} y={58} fontSize={11} fontWeight={850} fill={INK}>the whole grid</text><text x={350} y={91} fontSize={18} fontWeight={900} fill={TEAL} fontFamily={FONT}>{gw} × {gh}</text><motion.text x={350} y={126} fontSize={20} fontWeight={900} fill={TEAL} fontFamily={FONT} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{type:"spring",stiffness:200,damping:15,delay:.7}}>= {gridArea}</motion.text><text x={350} y={153} fontSize={10} fontWeight={800} fill={DIM}>unit squares total</text></g>}
    {phase===4&&<g><rect x={338} y={48} width={120} height={166} rx={14} fill="#f0fdf4" stroke={WIN} strokeWidth={1.7}/><text x={398} y={76} textAnchor="middle" fontSize={11} fontWeight={850} fill={INK}>triangle / grid</text><text x={398} y={113} textAnchor="middle" fontSize={22} fontWeight={900} fill={IND} fontFamily={FONT}>{tidy(triArea)}</text><line x1={370} y1={122} x2={426} y2={122} stroke={INK} strokeWidth={2}/><text x={398} y={151} textAnchor="middle" fontSize={22} fontWeight={900} fill={TEAL} fontFamily={FONT}>{gridArea}</text><motion.text x={398} y={189} textAnchor="middle" fontSize={22} fontWeight={900} fill={WIN} fontFamily={FONT} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{type:"spring",stiffness:210,damping:14,delay:.65}}>= {result}</motion.text><text x={W/2} y={286} textAnchor="middle" fontSize={10.5} fontWeight={800} fill={DIM} fontFamily={FONT}>check: shoelace area = {tidy(triArea)}; box subtraction = {tidy(remainder)}</text><motion.g initial={{opacity:0,scale:0}} animate={{opacity:ok?1:0,scale:ok?1:0}} transition={{type:"spring",stiffness:210,damping:14,delay:1}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x={W/2-48} y={291} width={96} height={24} rx={12} fill={WIN}/><text x={W/2} y={308} textAnchor="middle" fontSize={13} fontWeight={900} fill="#fff">Answer {problem.answer}</text></motion.g></g>}
  </svg><motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:!ok&&final?BAD:final?"#166534":IND,background:!ok&&final?"#fee2e2":final?"#dcfce7":"#eef2ff",border:`1px solid ${!ok&&final?"#fecaca":final?"#bbf7d0":"#c7d2fe"}`,borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)",boxSizing:"border-box"}}>{!ok&&final?failure:phase===0?`the triangle fits inside a ${boxW} × ${boxH} rectangle`:phase===1?`outside area = ${outside.map(tidy).join(" + ")}`:phase===2?`triangle area = ${tidy(triArea)} square units`:phase===3?`full grid area = ${gridArea} square units`:`${tidy(triArea)}/${gridArea} = ${result}`}</motion.span></div>;
}

function gcd(a:number,b:number):number{return b?gcd(b,a%b):Math.abs(a)}
