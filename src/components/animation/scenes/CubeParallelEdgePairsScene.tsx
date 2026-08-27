import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",TEAL="#0d9488",GOLD="#d97706",GREEN="#16a34a",RED="#dc2626",DIM="#64748b";
type Point={x:number;y:number};

/** Sort the labeled cube's twelve edges by direction, then pair the four edges in each family. */
export function CubeParallelEdgePairsScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem),groups=(Array.isArray(data.groups)?data.groups:[]).map(v=>String(v).split("|"));
  const directions=Math.round(num(data.directions,0)),perGroup=groups[0]?.length??0,pairsPer=perGroup*(perGroup-1)/2,total=directions*pairsPer;
  const choice=problem.choices?.find(c=>Number(c.text)===total)?.label;
  const ok=directions===groups.length&&groups.every(g=>g.length===perGroup)&&new Set(groups.flat()).size===12&&total===Number(problem.shortAnswer)&&choice===problem.answer;
  const failure=total!==Number(problem.shortAnswer)?`computed ${total}; stored ${problem.shortAnswer}`:`choice ${choice??"missing"}; stored ${problem.answer}`;
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1),colors=[TEAL,IND,GOLD];
  const pts:Record<string,Point>={A:{x:74,y:92},B:{x:224,y:92},C:{x:224,y:222},D:{x:74,y:222},E:{x:130,y:48},F:{x:280,y:48},G:{x:280,y:178},H:{x:130,y:178}};
  const edge=(id:string)=>[pts[id[0]],pts[id[1]]] as [Point,Point];
  const labelOffsets:Record<string,[number,number]>={A:[-14,4],B:[-5,18],C:[8,18],D:[-14,18],E:[-14,-7],F:[8,-7],G:[8,17],H:[8,17]};
  const pairList:Array<[number,number]>=[];for(let i=0;i<perGroup;i++)for(let j=i+1;j<perGroup;j++)pairList.push([i,j]);
  return <div style={{display:"flex",justifyContent:"center",width:"100%",minWidth:0,padding:"6px 4px",boxSizing:"border-box"}}><svg viewBox="0 0 450 310" width="100%" style={{maxWidth:480,minWidth:0,display:"block"}}>
    <text x="225" y="18" textAnchor="middle" fontSize="11.2" fontWeight="850" fill={INK}>{phase===0?"sort the cube's 12 edges into three parallel directions":phase===1?"within one direction, choose any two of the four edges":"the same six-pair count occurs in all three directions"}</text>
    {phase===0&&<>
      {groups.flatMap((g,gi)=>g.map((id,ei)=>{const [a,b]=edge(id);return <motion.line key={id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={colors[gi]} strokeWidth="5" strokeLinecap="round" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:gi*.18+ei*.06}}/>}))}
      {Object.entries(pts).map(([id,p])=><g key={id}><circle cx={p.x} cy={p.y} r="4" fill={INK}/><text x={p.x+labelOffsets[id][0]} y={p.y+labelOffsets[id][1]} fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>{id}</text></g>)}
      <g transform="translate(314 48)">{groups.map((g,i)=><motion.g key={i} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} transition={{delay:.5+i*.16}}><rect y={i*59} width="116" height="46" rx="9" fill={`${colors[i]}14`} stroke={colors[i]} strokeWidth="2"/><text x="58" y={i*59+17} textAnchor="middle" fontSize="8.5" fontWeight="850" fill={DIM}>direction {i+1}</text><text x="58" y={i*59+35} textAnchor="middle" fontSize="11" fontWeight="900" fill={colors[i]} fontFamily={FONT}>{g.join("  ")}</text></motion.g>)}</g>
      <g transform="translate(91 263)"><rect width="268" height="34" rx="10" fill="#f8fafc" stroke="#cbd5e1"/><text x="134" y="22" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{directions} directions × {perGroup} edges = {groups.flat().length} edges</text></g>
    </>}
    {phase===1&&<>
      <text x="225" y="44" textAnchor="middle" fontSize="10" fontWeight="850" fill={TEAL}>use the horizontal family: {groups[0]?.join(", ")}</text>
      <g transform="translate(57 62)">{groups[0]?.map((id,i)=><motion.g key={id} initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{delay:i*.12}}><rect x={i*88} width="70" height="42" rx="9" fill="#ecfeff" stroke={TEAL} strokeWidth="2"/><line x1={i*88+12} y1="14" x2={i*88+58} y2="14" stroke={TEAL} strokeWidth="4" strokeLinecap="round"/><text x={i*88+35} y="34" textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>{id}</text></motion.g>)}</g>
      <g transform="translate(65 135)">{pairList.map(([a,b],i)=>{const x=(i%3)*110,y=Math.floor(i/3)*57;return <motion.g key={i} initial={{opacity:0,scale:.6}} animate={{opacity:1,scale:1}} transition={{delay:.35+i*.1}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x={x} y={y} width="94" height="43" rx="9" fill="#eef2ff" stroke={IND}/><text x={x+47} y={y+18} textAnchor="middle" fontSize="8.5" fontWeight="850" fill={DIM}>parallel pair {i+1}</text><text x={x+47} y={y+35} textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{groups[0][a]} + {groups[0][b]}</text></motion.g>})}</g>
      <g transform="translate(126 256)"><rect width="198" height="40" rx="11" fill="#eef2ff" stroke={IND} strokeWidth="2"/><text x="99" y="26" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>C({perGroup}, 2) = {pairsPer} pairs</text></g>
    </>}
    {phase===2&&<>
      <g transform="translate(48 53)">{groups.map((g,i)=><motion.g key={i} initial={{opacity:0,x:-15}} animate={{opacity:1,x:0}} transition={{delay:i*.16}}><rect x={i*121} width="104" height="109" rx="12" fill={`${colors[i]}12`} stroke={colors[i]} strokeWidth="2"/><text x={i*121+52} y="22" textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM}>direction {i+1}</text>{g.map((id,j)=><g key={id}><line x1={i*121+22} y1={39+j*14} x2={i*121+57} y2={39+j*14} stroke={colors[i]} strokeWidth="3"/><text x={i*121+72} y={43+j*14} textAnchor="middle" fontSize="9" fontWeight="900" fill={colors[i]} fontFamily={FONT}>{id}</text></g>)}<text x={i*121+52} y="98" textAnchor="middle" fontSize="13" fontWeight="900" fill={colors[i]} fontFamily={FONT}>{pairsPer} pairs</text></motion.g>)}</g>
      <motion.path d="M100 178 C100 208 225 194 225 225 M221 178 C221 208 225 194 225 225 M342 178 C342 208 225 194 225 225" fill="none" stroke={GREEN} strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}}/>
      <motion.g initial={{scale:.6}} animate={{scale:1}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="126" y="229" width="198" height="49" rx="12" fill={ok?"#dcfce7":"#fee2e2"} stroke={ok?GREEN:RED} strokeWidth="2"/><text x="225" y="249" textAnchor="middle" fontSize="11" fontWeight="850" fill={ok?GREEN:RED} fontFamily={FONT}>{directions} × C({perGroup},2)</text><text x="225" y="270" textAnchor="middle" fontSize="20" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT}>= {total}</text></motion.g>
      <SvgAnswerBadge show={ok} answer={problem.answer} cx={390} y={245} width={76}/>
    </>}
    <AnimatePresence>{final&&!ok&&<motion.text x="225" y="306" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
  </svg></div>;
}
