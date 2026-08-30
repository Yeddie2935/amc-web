import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",RED="#dc2626",DIM="#64748b";
const COLORS:Record<string,string>={A:"#4338ca",B:"#d97706",C:"#0d9488"};
type Grid=string[][];

const permutations=<T,>(values:T[]):T[][]=>values.length===0?[[]]:values.flatMap((v,i)=>permutations([...values.slice(0,i),...values.slice(i+1)]).map(rest=>[v,...rest]));

function MiniGrid({x,y,grid,size=88,delay=0,highlight=""}:{x:number;y:number;grid:(string|null)[][];size?:number;delay?:number;highlight?:string}){
  const cell=size/3;
  return <motion.g initial={{opacity:0,scale:.72}} animate={{opacity:1,scale:1}} transition={{delay,type:"spring",stiffness:190,damping:16}} style={{transformBox:"fill-box",transformOrigin:"center"}}>
    <rect x={x} y={y} width={size} height={size} rx="5" fill="#fff" stroke={INK} strokeWidth="1.8"/>
    {[1,2].map(i=><g key={i}><line x1={x+i*cell} y1={y} x2={x+i*cell} y2={y+size} stroke="#94a3b8"/><line x1={x} y1={y+i*cell} x2={x+size} y2={y+i*cell} stroke="#94a3b8"/></g>)}
    {grid.flatMap((row,r)=>row.map((value,c)=>value?<motion.g key={`${r}-${c}`} initial={{scale:0}} animate={{scale:1}} transition={{delay:delay+(r*3+c)*.035,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><circle cx={x+(c+.5)*cell} cy={y+(r+.5)*cell} r={cell*.3} fill={`${COLORS[value]}18`} stroke={value===highlight?COLORS[value]:"none"} strokeWidth="1.5"/><text x={x+(c+.5)*cell} y={y+(r+.5)*cell+cell*.17} textAnchor="middle" fontSize={cell*.48} fontWeight="950" fill={COLORS[value]} fontFamily={FONT}>{value}</text></motion.g>:null))}
  </motion.g>;
}

export function LatinGridBranchScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem);
  const letters=(Array.isArray(data.letters)?data.letters:[]).map(String);
  const size=Number(data.size);
  const fixed=String(data.fixedCell??"");
  const rows=permutations(letters);
  const solutions:Grid[]=Array.from({length:size},()=>rows).reduce<Grid[]>((partials,rowOptions,r)=>partials.flatMap(grid=>rowOptions.filter(row=>r>0||row[0]===letters[0]).filter(row=>row.every((value,c)=>grid.every(previous=>previous[c]!==value))).map(row=>[...grid,row])),[[]]);
  const valid=solutions.filter(grid=>grid[0][0]===letters[0]);
  const aPatterns=Array.from(new Map(valid.map(grid=>[grid.map(row=>row.indexOf("A")).join(","),grid.map(row=>row.map(v=>v==="A"?v:null))])).values());
  const bSkeletons=valid.map(grid=>grid.map(row=>row.map(v=>v==="C"?null:v)));
  const choice=problem.choices?.find(c=>Number(c.text)===valid.length)?.label;
  const ok=size===3&&letters.join("")==="ABC"&&fixed==="A@0,0"&&valid.length===4&&aPatterns.length===2&&String(valid.length)===problem.shortAnswer&&choice===problem.answer;
  const failure=valid.length!==4?`enumeration found ${valid.length} grids`:aPatterns.length!==2?`found ${aPatterns.length} A patterns`:String(valid.length)!==problem.shortAnswer?`computed ${valid.length}, stored ${problem.shortAnswer}`:`choice ${choice??"missing"}, stored ${problem.answer}`;
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1);
  const blank=Array.from({length:3},()=>Array<string|null>(3).fill(null));blank[0][0]="A";

  return <div style={{width:"100%",display:"flex",justifyContent:"center",minWidth:0,padding:"5px 2px",boxSizing:"border-box",overflow:"hidden"}}><svg viewBox="0 0 470 320" width="100%" style={{maxWidth:500,display:"block"}} aria-label="Three by three letter grids branch through two A placements and two B placements into four valid arrangements">
    <defs><marker id="latin-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={IND}/></marker></defs>
    <text x="235" y="19" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"the fixed A leaves exactly two ways to place the other A’s":phase===1?"each A pattern branches into two legal B placements":"fill every leftover square with C: four complete grids"}</text>
    {phase===0&&<g>
      <MiniGrid x={30} y={79} grid={blank} size={104}/><text x="82" y="201" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>A fixed here</text>
      <motion.path d="M145 131 C181 131 180 80 211 80 M145 131 C181 131 180 218 211 218" fill="none" stroke={IND} strokeWidth="2.5" markerEnd="url(#latin-arrow)" initial={{pathLength:0}} animate={{pathLength:1}}/>
      {aPatterns.map((grid,i)=><g key={i}><MiniGrid x={229} y={40+i*137} grid={grid} size={103} delay={.2+i*.16} highlight="A"/><rect x="351" y={70+i*137} width="88" height="43" rx="11" fill="#eef2ff" stroke="#c7d2fe"/><text x="395" y={88+i*137} textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM}>A PATTERN</text><text x="395" y={105+i*137} textAnchor="middle" fontSize="15" fontWeight="950" fill={IND} fontFamily={FONT}>{i+1} of {aPatterns.length}</text></g>)}
    </g>}
    {phase===1&&<g>
      {bSkeletons.map((grid,i)=>{const col=i%2,row=Math.floor(i/2),x=63+col*237,y=47+row*130;return <g key={i}><MiniGrid x={x} y={y} grid={grid} size={91} delay={i*.1} highlight="B"/><text x={x+45.5} y={y+108} textAnchor="middle" fontSize="9.5" fontWeight="900" fill={COLORS.B}>A pattern {row+1} · B way {col+1}</text></g>;})}
      <motion.path d="M235 38 V286" stroke="#cbd5e1" strokeWidth="1.5" initial={{pathLength:0}} animate={{pathLength:1}}/><text x="235" y="307" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{aPatterns.length} A patterns × 2 B choices = {bSkeletons.length} branches</text>
    </g>}
    {phase===2&&<g>
      {valid.map((grid,i)=>{const col=i%2,row=Math.floor(i/2),x=55+col*242,y=39+row*126;return <g key={i}><MiniGrid x={x} y={y} grid={grid} size={96} delay={i*.1} highlight="C"/><circle cx={x+106} cy={y+12} r="11" fill="#dcfce7" stroke={GREEN}/><text x={x+106} y={y+16} textAnchor="middle" fontSize="10" fontWeight="950" fill={GREEN}>✓</text></g>;})}
      <motion.g initial={{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} transition={{delay:.55,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="111" y="276" width="248" height="38" rx="13" fill={ok?"#f0fdf4":"#fef2f2"} stroke={ok?GREEN:RED} strokeWidth="2"/><text x="235" y="301" textAnchor="middle" fontSize="17" fontWeight="950" fill={ok?GREEN:RED} fontFamily={FONT}>{ok?`${aPatterns.length} × 2 = ${valid.length} arrangements`:failure}</text></motion.g><SvgAnswerBadge show={ok} answer={problem.answer} cx={420} y={278} width={76}/>
    </g>}
  </svg></div>;
}
