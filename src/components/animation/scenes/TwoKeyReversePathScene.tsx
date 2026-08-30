import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",RED="#dc2626",AMBER="#d97706",DIM="#94a3b8";

/** Run a +1/×2 calculator backward along its forced inverse path, then reverse
 * every arrow to exhibit the shortest forward keystroke sequence. */
export function TwoKeyReversePathScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem);
  const path=(Array.isArray(data.reversePath)?data.reversePath:[]).map(Number);
  const start=Number(data.start),target=Number(data.target);
  const reverseOps=path.slice(0,-1).map((value,i)=>value%2===0?"÷2":"−1");
  const transitionsOk=path.slice(0,-1).every((value,i)=>(value%2===0?value/2:value-1)===path[i+1]);
  const strokes=path.length-1;
  const choice=problem.choices?.find(item=>Number(item.text)===strokes)?.label;
  const valid=start===1&&target===200&&path[0]===target&&path[path.length-1]===start&&transitionsOk&&strokes===Number(problem.shortAnswer)&&choice===problem.answer;
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1);
  const points=path.map((_,i)=>i<5?{x:39+i*82,y:75}:{x:367-(i-5)*82,y:166});

  return <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:7,padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 470 255" width="100%" style={{maxWidth:500,display:"block"}} aria-label="A calculator path reversing from 200 to 1 and then running forward in nine keystrokes">
      <defs><marker id="reverse-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill={phase===2?GREEN:IND}/></marker></defs>
      <text x="235" y="16" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"invert each calculator key":phase===1?"follow the forced reverse path":"flip every arrow: these are the real keystrokes"}</text>

      {phase===0?<>
        <g transform="translate(24 42)"><rect width="174" height="161" rx="17" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2"/><rect x="20" y="17" width="134" height="40" rx="7" fill="#e2e8f0"/><text x="144" y="45" textAnchor="end" fontSize="24" fontWeight="900" fill={INK} fontFamily={FONT}>{target}</text>
          <g transform="translate(20 78)"><rect width="58" height="43" rx="9" fill="#eef2ff" stroke={IND}/><text x="29" y="27" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>+1</text></g>
          <g transform="translate(96 78)"><rect width="58" height="43" rx="9" fill="#eef2ff" stroke={IND}/><text x="29" y="27" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>×2</text></g>
          <text x="87" y="145" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM}>start at {start} · reach {target}</text>
        </g>
        <g transform="translate(229 47)"><rect width="216" height="151" rx="15" fill="#eef2ff" stroke="#c7d2fe"/>
          <text x="108" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={INK}>BACKWARD RULE</text>
          <text x="108" y="58" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>even → ÷2</text>
          <text x="108" y="85" textAnchor="middle" fontSize="16" fontWeight="900" fill={AMBER} fontFamily={FONT}>odd → −1</text>
          <motion.text x="108" y="119" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:.35}}>200 → 100 → 50 → 25</motion.text>
          <text x="108" y="140" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM}>at 25, division is impossible</text>
        </g>
      </>:<>
        {points.slice(0,-1).map((p,i)=>{const q=points[i+1];const forward=phase===2;const a=forward?q:p,b=forward?p:q;const op=forward?(reverseOps[i]==="÷2"?"×2":"+1"):reverseOps[i];const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;return <motion.g key={`edge-${i}`} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*.07}}>
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={forward?GREEN:IND} strokeWidth="2" markerEnd="url(#reverse-arrow)"/>
          <rect x={mx-13} y={my-10} width="26" height="17" rx="8" fill="#fff"/>
          <text x={mx} y={my+2} textAnchor="middle" fontSize="9.5" fontWeight="900" fill={op==="+1"||op==="−1"?AMBER:forward?GREEN:IND} fontFamily={FONT}>{op}</text>
        </motion.g>})}
        {points.map((p,i)=><motion.g key={`node-${i}`} initial={{scale:.4,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:i*.06,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}>
          <circle cx={p.x} cy={p.y} r="19" fill={phase===2&&path[i]===target?GREEN:path[i]===start?"#f0fdf4":"#fff"} stroke={phase===2?GREEN:IND} strokeWidth="2"/>
          <text x={p.x} y={p.y+5} textAnchor="middle" fontSize={path[i]>=100?"11":"13"} fontWeight="900" fill={phase===2&&path[i]===target?"#fff":INK} fontFamily={FONT}>{path[i]}</text>
        </motion.g>)}
        <text x="235" y="216" textAnchor="middle" fontSize="12" fontWeight="900" fill={phase===2?GREEN:IND} fontFamily={FONT}>{phase===1?`${path.join(" → ")}`:`${strokes} arrows = ${strokes} keystrokes`}</text>
        {phase===2&&<motion.g initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.75,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="189" y="225" width="92" height="26" rx="13" fill={valid?GREEN:RED}/><text x="235" y="243" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#fff">{valid?`Answer ${problem.answer}`:"check failed"}</text></motion.g>}
      </>}
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(valid?"#166534":RED):IND,background:final?(valid?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)"}}>{phase===0?"undo ×2 with ÷2; undo +1 with −1":phase===1?`${path.length} displays create ${strokes} forced moves`:valid?`reverse the path to reach ${target} from ${start} in ${strokes} keys`:`path, transition, stored-answer, or choice check failed`}</motion.span>
  </div>;
}
