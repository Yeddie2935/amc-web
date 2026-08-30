import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",RED="#dc2626",AMBER="#d97706",DIM="#64748b",TEAL="#0d9488";
type P={x:number;y:number};
const paths:Record<string,string>={A:"M0 38L50 2",B:"M0 25V5H12V12H23V32H50",C:"M0 38C8 3 16 6 24 20C31 4 40 2 50 38",D:"M0 38L12 18L25 2L36 10L50 38",E:"M0 38L12 16H29L40 2H50"};

/** Tess runs the block while a tether from home and a synchronized qualitative
 * graph expose the required start, unique maximum, and return-to-zero shape. */
export function RectangleHomeDistanceScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem);
  const route=Array.isArray(data.route)?data.route.map(String):[];
  const trends=Array.isArray(data.cornerTrends)?data.cornerTrends.map(String):[];
  const graph=String(data.correctGraph??"");
  const labels=problem.choices?.map(c=>c.label)??[];
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1);
  const ok=route.join(",")==="J,K,L,M,J"&&trends.join(",")==="zero,up,max,down,zero"&&graph===problem.answer&&problem.shortAnswer===`Graph ${graph}`&&labels.join(",")==="A,B,C,D,E";

  const J={x:52,y:45},K={x:52,y:185},L={x:244,y:185},M={x:244,y:45};
  const runner:P=phase===0?K:phase===1?M:J;
  const routePath=phase===0?`M${J.x} ${J.y}L${K.x} ${K.y}`:phase===1?`M${J.x} ${J.y}L${K.x} ${K.y}L${L.x} ${L.y}L${M.x} ${M.y}`:`M${J.x} ${J.y}L${K.x} ${K.y}L${L.x} ${L.y}L${M.x} ${M.y}Z`;
  const trace=phase===0?"M0 38L12 18":phase===1?"M0 38L12 18L25 2L36 10":paths.D;
  const cornerDots=phase===0?[[0,38],[12,18]]:phase===1?[[0,38],[12,18],[25,2],[36,10]]:[[0,38],[12,18],[25,2],[36,10],[50,38]];

  return <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 470 290" width="100%" style={{maxWidth:500,minWidth:0,display:"block"}} aria-label="Tess running around block JKLM while her straight-line distance from home is graphed">
      <defs><marker id="rhd-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={TEAL}/></marker></defs>
      <text x="235" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"leave J: the distance string grows":phase===1?"the string is longest at opposite corner L":"finish at J: the string shrinks to zero"}</text>
      <g>
        <rect x={J.x} y={J.y} width={M.x-J.x} height={K.y-J.y} rx="2" fill="#f8fafc" stroke={INK} strokeWidth="2.3"/>
        <motion.path d={routePath} fill="none" stroke={TEAL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#rhd-arrow)" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1.1}}/>
        <motion.line x1={J.x} y1={J.y} x2={runner.x} y2={runner.y} stroke={AMBER} strokeWidth="2.6" strokeDasharray="5 3" initial={{pathLength:0}} animate={{pathLength:1}}/>
        <circle cx={J.x} cy={J.y} r="7" fill={IND}/><path d={`M${J.x-3} ${J.y+1}v-5h6v5M${J.x-5} ${J.y-3}l5-5l5 5`} fill="none" stroke="#fff" strokeWidth="1.4"/><text x={J.x+11} y={J.y-12} fontSize="9.5" fontWeight="850" fill={IND}>HOME</text>
        <motion.g animate={{x:[-2,2,-2]}} transition={{duration:.45,repeat:2}}><circle cx={runner.x} cy={runner.y} r="8" fill={RED}/><circle cx={runner.x-2.5} cy={runner.y-2} r="1.2" fill="#fff"/><circle cx={runner.x+2.5} cy={runner.y-2} r="1.2" fill="#fff"/><path d={`M${runner.x-3} ${runner.y+3}q3 3 6 0`} fill="none" stroke="#fff" strokeWidth="1.2"/></motion.g>
        {[{p:J,t:"J",dx:-18,dy:-9},{p:K,t:"K",dx:-18,dy:18},{p:L,t:"L",dx:8,dy:18},{p:M,t:"M",dx:8,dy:-9}].map(v=><text key={v.t} x={v.p.x+v.dx} y={v.p.y+v.dy} fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{v.t}</text>)}
        {phase===1&&<motion.g initial={{scale:.4,opacity:0}} animate={{scale:1,opacity:1}} style={{transformBox:"fill-box",transformOrigin:"center"}}><circle cx={L.x} cy={L.y} r="14" fill="none" stroke={AMBER} strokeWidth="3"/><text x={L.x-8} y={L.y-18} textAnchor="end" fontSize="10" fontWeight="900" fill={AMBER}>farthest</text></motion.g>}
      </g>

      <g transform="translate(292 50)">
        <rect width="160" height="145" rx="14" fill="#fff" stroke="#cbd5e1"/>
        <text x="80" y="21" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>STRAIGHT-LINE DISTANCE</text>
        <line x1="25" y1="112" x2="140" y2="112" stroke={INK} strokeWidth="1.8"/><line x1="25" y1="112" x2="25" y2="37" stroke={INK} strokeWidth="1.8"/>
        <g transform="translate(31 48) scale(2.05 1.55)"><motion.path d={trace} fill="none" stroke={IND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1}}/>{cornerDots.map(([x,y],i)=><motion.circle key={i} cx={x} cy={y} r="2" fill={i===2?AMBER:IND} initial={{scale:0}} animate={{scale:1}} transition={{delay:.15*i}}/>)}</g>
        <text x="82" y="134" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>time →</text><text transform="translate(13 77) rotate(-90)" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>distance</text>
      </g>

      {phase===0&&<g transform="translate(75 221)"><rect width="190" height="38" rx="10" fill="#eef2ff" stroke="#c7d2fe"/><text x="95" y="16" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>CORNER CHECK</text><text x="95" y="31" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>J: 0  →  K: farther</text></g>}
      {phase===1&&<g transform="translate(67 218)"><rect width="206" height="43" rx="10" fill="#fff7ed" stroke="#fed7aa"/><text x="103" y="17" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>CORNER CHECK</text><text x="103" y="34" textAnchor="middle" fontSize="12.5" fontWeight="900" fill={AMBER} fontFamily={FONT}>K ↑  L: maximum  ↓ M</text></g>}
      {phase===2&&<g transform="translate(28 209)">
        {labels.map((label,i)=>{const gx=i*76;return <g key={label} transform={`translate(${gx} 0)`}><rect width="66" height="51" rx="8" fill={label===graph?(ok?"#f0fdf4":"#fef2f2"):"#f8fafc"} stroke={label===graph?(ok?GREEN:RED):"#cbd5e1"} strokeWidth={label===graph?2:1}/><text x="8" y="14" fontSize="9" fontWeight="900" fill={label===graph?(ok?GREEN:RED):DIM}>{label}</text><g transform="translate(8 8) scale(.9 .75)"><path d={paths[label]} fill="none" stroke={label===graph?(ok?GREEN:RED):DIM} strokeWidth="2"/></g>{label===graph&&<motion.circle cx="57" cy="10" r="7" fill={ok?GREEN:RED} initial={{scale:0}} animate={{scale:1}}/>}</g>})}
        <SvgAnswerBadge show={final} answer={ok?problem.answer:"check failed"} cx={190} y={55} width={ok?88:124}/>
      </g>}
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(ok?"#166534":RED):IND,background:final?(ok?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)"}}>{phase===0?"distance starts at 0 and rises along JK":phase===1?"one maximum at L; at M the distance is still positive":ok?"only graph D starts at 0, peaks once, and returns to 0":"route, trend, choices, or stored-answer check failed"}</motion.span>
  </div>;
}
