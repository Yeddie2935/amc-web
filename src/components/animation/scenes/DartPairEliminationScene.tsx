import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",RED="#dc2626",AMBER="#d97706",DIM="#64748b";
const COLORS=["#0ea5e9","#f97316","#a855f7","#0d9488","#db2777"];
const polar=(cx:number,cy:number,r:number,a:number)=>({x:cx+r*Math.cos(a-Math.PI/2),y:cy+r*Math.sin(a-Math.PI/2)});
const wedge=(cx:number,cy:number,r0:number,r1:number,i:number,n:number)=>{const a0=2*Math.PI*i/n,a1=2*Math.PI*(i+1)/n,p1=polar(cx,cy,r1,a0),p2=polar(cx,cy,r1,a1),p3=polar(cx,cy,r0,a1),p4=polar(cx,cy,r0,a0);return `M${p1.x} ${p1.y}A${r1} ${r1} 0 0 1 ${p2.x} ${p2.y}L${p3.x} ${p3.y}A${r0} ${r0} 0 0 0 ${p4.x} ${p4.y}Z`};

type Pair={name:string;score:number;values:[number,number]};
function solvePairs(regions:number[],names:string[],scores:number[]):Pair[][]{
  const walk=(i:number,left:number[],pairs:Pair[]):Pair[][]=>{if(i===names.length)return left.length?[]:[pairs];const out:Pair[][]=[];for(let a=0;a<left.length;a++)for(let b=a+1;b<left.length;b++)if(left[a]+left[b]===scores[i]){const rest=left.filter((_,k)=>k!==a&&k!==b);out.push(...walk(i+1,rest,[...pairs,{name:names[i],score:scores[i],values:[left[a],left[b]]}]))}return out};return walk(0,regions,[]);
}

/** Fire each forced two-dart pair into the actual 1–10 target sectors, removing
 * claimed values until the owner of region 6 is forced. */
export function DartPairEliminationScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem);
  const regions=Array.isArray(data.regions)?data.regions.map(Number):[],names=Array.isArray(data.deductionOrder)?data.deductionOrder.map(String):[],scores=Array.isArray(data.scores)?data.scores.map(Number):[];
  const query=num(data.queryRegion,0),solutions=solvePairs(regions,names,scores),pairs=solutions[0]??[];
  const owner=pairs.find(p=>p.values.includes(query))?.name,choice=problem.choices?.find(c=>c.text===owner)?.label;
  const unique=solutions.length===1;
  const ok=regions.join(",")==="1,2,3,4,5,6,7,8,9,10"&&names.join(",")==="Ben,Cindy,Dave,Alice,Ellen"&&scores.join(",")==="4,7,11,16,17"&&unique&&owner===problem.shortAnswer&&choice===problem.answer;
  const final=step>=totalSteps-1,phase=final?3:Math.min(step,2),shown=phase===0?1:phase===1?2:phase===2?3:pairs.length;
  const claimed=new Map<number,number>();pairs.slice(0,shown).forEach((p,i)=>p.values.forEach(v=>claimed.set(v,i)));
  const cx=126,cy=144,r0=35,r1=104;

  return <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 470 310" width="342" style={{maxWidth:"100%",display:"block"}} aria-label="Ten dartboard sectors are claimed in forced score pairs until Alice owns region six">
      <text x="235" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"score 4 has only one distinct pair":phase===1?"remove Ben's regions; score 7 is forced":phase===2?"remove four regions; score 11 is forced":"the last four regions split between Alice and Ellen"}</text>
      <g>
        {regions.map((v,i)=>{const who=claimed.get(v),active=who!=null,mid=2*Math.PI*(i+.5)/regions.length,p=polar(cx,cy,72,mid),tone=active?COLORS[who]:"#cbd5e1";return <motion.g key={v} initial={{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} transition={{delay:i*.035}} style={{transformBox:"fill-box",transformOrigin:"center"}}><path d={wedge(cx,cy,r0,r1,i,regions.length)} fill={active?`${tone}28`:"#f8fafc"} stroke={tone} strokeWidth={active?2.5:1.4}/><text x={p.x} y={p.y+5} textAnchor="middle" fontSize="13" fontWeight="900" fill={active?tone:INK} fontFamily={FONT}>{v}</text>{v===query&&<motion.circle cx={p.x} cy={p.y} r="15" fill="none" stroke={final?GREEN:AMBER} strokeWidth="2.5" initial={{scale:.4}} animate={{scale:1}}/>}</motion.g>})}
        <circle cx={cx} cy={cy} r={r0} fill="#eef2ff" stroke={IND} strokeWidth="2"/><text x={cx} y={cy-2} textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM}>FIND</text><text x={cx} y={cy+17} textAnchor="middle" fontSize="22" fontWeight="900" fill={final?GREEN:IND} fontFamily={FONT}>{query}</text>
      </g>

      <g transform="translate(251 43)">
        <rect width="201" height="222" rx="15" fill="#f8fafc" stroke="#cbd5e1"/><text x="100.5" y="22" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>TWO DARTS · NO REGION REPEATS</text>
        {pairs.map((p,i)=>{const visible=i<shown,tone=COLORS[i];return <motion.g key={p.name} initial={{opacity:0,x:18}} animate={{opacity:visible?1:.18,x:0}} transition={{delay:i*.12}}><rect x="13" y={35+i*36} width="175" height="29" rx="8" fill={visible?`${tone}18`:"#fff"} stroke={visible?tone:"#cbd5e1"}/><text x="22" y={54+i*36} fontSize="10" fontWeight="900" fill={tone}>{p.name}</text><text x="177" y={55+i*36} textAnchor="end" fontSize="13" fontWeight="900" fill={visible?tone:DIM} fontFamily={FONT}>{visible?`${p.values[0]} + ${p.values[1]} = ${p.score}`:`score ${p.score}`}</text></motion.g>})}
      </g>
      <g transform="translate(43 267)"><rect width="384" height="32" rx="10" fill={final?(ok?"#f0fdf4":"#fef2f2"):"#eef2ff"} stroke={final?(ok?"#86efac":"#fecaca"):"#c7d2fe"}/><text x="192" y="21" textAnchor="middle" fontSize="12" fontWeight="900" fill={final?(ok?GREEN:RED):IND} fontFamily={FONT}>{phase===0?"Ben: 1+3 is the only distinct pair totaling 4":phase===1?"Cindy: 2+5 is now the only pair totaling 7":phase===2?"Dave: 4+7 is now the only pair totaling 11":ok?"Alice takes 6+10; Ellen takes 8+9":"pair assignment or stored-answer check failed"}</text></g>
      <SvgAnswerBadge show={final} answer={ok?problem.answer:"check failed"} cx={408} y={276} width={ok?80:116}/>
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(ok?"#166534":RED):IND,background:final?(ok?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)"}}>{phase===0?"claim regions 1 and 3":phase===1?"claim regions 2 and 5":phase===2?"claim regions 4 and 7":ok?`region ${query} belongs to ${owner} — choice ${problem.answer}`:"unique-pair or answer verification failed"}</motion.span>
  </div>;
}
