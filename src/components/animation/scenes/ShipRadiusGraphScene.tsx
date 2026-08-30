import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const SEA = "#0ea5e9";
const IND = "#4338ca";
const GOLD = "#f59e0b";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";
type Signature = "hump-dip-rise" | "flat-dip" | "peak" | "flat-hump" | "flat-rise";

const miniPath = (kind: Signature, x: number, y: number) => {
  const p: Record<Signature, string> = {
    "hump-dip-rise": `M${x},${y + 18} Q${x + 14},${y} ${x + 28},${y + 9} Q${x + 35},${y + 26} ${x + 42},${y + 21} L${x + 62},${y + 13}`,
    "flat-dip": `M${x},${y + 9} L${x + 30},${y + 9} Q${x + 45},${y + 34} ${x + 62},${y + 9}`,
    peak: `M${x},${y + 22} L${x + 34},${y + 4} L${x + 62},${y + 24}`,
    "flat-hump": `M${x},${y + 20} L${x + 29},${y + 20} Q${x + 46},${y - 4} ${x + 62},${y + 19}`,
    "flat-rise": `M${x},${y + 21} L${x + 28},${y + 21} L${x + 62},${y + 6}`,
  };
  return p[kind];
};

function Ship({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate})`}><path d="M-9 2 L9 2 L5 7 L-5 7 Z" fill={SEA} stroke={INK} strokeWidth="1"/><path d="M-2 1 L-2 -7 L5 1 Z" fill="#e0f2fe" stroke={INK} strokeWidth="1"/></g>;
}

/** Follow the ship while its radius tether simultaneously draws the distance graph. */
export function ShipRadiusGraphScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const candidates = (Array.isArray(data.candidates) ? data.candidates : []).map(String).map((v) => {
    const [label, signature] = v.split("|");
    return { label, signature: signature as Signature };
  });
  const matches = candidates.filter((c) => c.signature === "flat-dip");
  const agrees = matches.length === 1 && matches[0].label === problem.answer;
  const final = step >= totalSteps - 1;

  const X = { x: 99, y: 84 };
  const A = { x: 39, y: 84 };
  const B = { x: 159, y: 84 };
  const C = { x: 100, y: 25 };
  const foot = { x: 129.5, y: 54.5 };
  const graphX = 205;
  const graphY = 142;
  const caption = final
    ? agrees ? "flat on AB, then down-and-up on BC — only graph B" : "candidate signature or stored-answer check failed"
    : step === 0 ? "AB is centered at X: the radius tether never changes" : "on BC the tether shrinks to the perpendicular foot, then grows";

  return <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:7, width:"100%", minWidth:0, padding:"6px 2px", boxSizing:"border-box" }}>
    <svg viewBox="0 0 360 224" width="100%" style={{ maxWidth:430, display:"block" }} aria-label="A ship route and its distance from Island X traced together">
      {!final ? <>
        <text x="64" y="12" textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM} fontFamily={FONT}>SHIP'S COURSE</text>
        <path d={`M${A.x},${A.y} A60,60 0 0 0 ${B.x},${B.y}`} fill="none" stroke={INK} strokeWidth="2"/>
        <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={INK} strokeWidth="2"/>
        <circle cx={X.x} cy={X.y} r="5" fill="#fbbf24" stroke="#92400e"/><text x={X.x + 9} y={X.y - 7} fontSize="11" fontWeight="900" fill={INK}>X</text>
        {[["A",A.x-9,A.y-3],["B",B.x+9,B.y+3],["C",C.x,C.y-7]].map(([t,x,y])=><text key={String(t)} x={Number(x)} y={Number(y)} textAnchor="middle" fontSize="11" fontWeight="900" fill={INK}>{t}</text>)}

        {step === 0 ? <>
          {[[-42,69,39,84],[0,99,144,129],[42,129,39,84]].map(([ang,sx,sy],i) => {
            const rad=(ang*Math.PI)/180, px=X.x-60*Math.cos(rad), py=X.y+60*Math.sin(rad);
            return <motion.g key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.2+i*.25}}><line x1={X.x} y1={X.y} x2={px} y2={py} stroke={GOLD} strokeWidth="1.7" strokeDasharray="4 3"/><Ship x={px} y={py}/></motion.g>;
          })}
        </> : <>
          <line x1={X.x} y1={X.y} x2={B.x} y2={B.y} stroke={DIM} strokeWidth="1.5" strokeDasharray="4 3"/>
          <line x1={X.x} y1={X.y} x2={foot.x} y2={foot.y} stroke={GOLD} strokeWidth="2.2"/>
          <path d={`M${foot.x-6},${foot.y+6} l6,6 l6,-6`} fill="none" stroke={GOLD} strokeWidth="1.3"/>
          <line x1={X.x} y1={X.y} x2={C.x} y2={C.y} stroke={DIM} strokeWidth="1.5" strokeDasharray="4 3"/>
          <Ship x={B.x} y={B.y}/><Ship x={foot.x} y={foot.y} rotate={-45}/><Ship x={C.x} y={C.y} rotate={-45}/>
          <text x={foot.x-3} y={foot.y-8} fontSize="8.5" fontWeight="850" fill="#92400e" fontFamily={FONT}>closest</text>
        </>}

        <text x="273" y="12" textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM} fontFamily={FONT}>DISTANCE FROM X</text>
        <line x1={graphX} y1="31" x2={graphX} y2={graphY} stroke={INK} strokeWidth="1.5"/><line x1={graphX} y1={graphY} x2="347" y2={graphY} stroke={INK} strokeWidth="1.5"/>
        <text x="276" y="158" textAnchor="middle" fontSize="8" fontWeight="800" fill={DIM} fontFamily={FONT}>distance traveled</text>
        <motion.path d={step===0?`M${graphX+5},70 L${graphX+70},70`:`M${graphX+5},70 L${graphX+70},70 Q${graphX+104},128 ${graphX+137},70`} fill="none" stroke={IND} strokeWidth="3" strokeLinecap="round" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:.8}}/>
        <line x1={graphX+70} y1="64" x2={graphX+70} y2="76" stroke={DIM}/><text x={graphX+70} y="87" textAnchor="middle" fontSize="9" fontWeight="900" fill={DIM}>B</text>
        {step>=1&&<><line x1={graphX+104} y1="113" x2={graphX+104} y2="132" stroke={GOLD} strokeDasharray="3 2"/><text x={graphX+104} y="140" textAnchor="middle" fontSize="8" fontWeight="850" fill="#92400e">closest</text></>}
      </> : <>
        <text x="180" y="15" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM} fontFamily={FONT}>which candidate has the required two-part shape?</text>
        {candidates.map((c,i)=>{const x=13+(i%3)*116,y=42+Math.floor(i/3)*78,good=c.signature==="flat-dip";return <motion.g key={c.label} initial={{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} transition={{delay:i*.1,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}>
          {good&&<rect x={x-5} y={y-14} width="78" height="62" rx="9" fill="#f0fdf4" stroke={GREEN} strokeWidth="1.5"/>}
          <text x={x} y={y-4} fontSize="10" fontWeight="900" fill={good?GREEN:INK}>({c.label})</text><line x1={x} y1={y+31} x2={x+68} y2={y+31} stroke={DIM}/><line x1={x} y1={y-7} x2={x} y2={y+31} stroke={DIM}/><path d={miniPath(c.signature,x+3,y)} fill="none" stroke={good?GREEN:INK} strokeWidth="2"/>
          {!good&&<path d={`M${x+5},${y-5} L${x+63},${y+32}`} stroke={RED} strokeWidth="1.8" opacity=".75"/>}
        </motion.g>})}
        <text x="180" y="198" textAnchor="middle" fontSize="11" fontWeight="900" fill={agrees?GREEN:RED} fontFamily={FONT}>{agrees?"constant → closer → farther":"self-check failed"}</text>
      </>}
    </svg>
    <motion.div key={step} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} style={{maxWidth:"100%",overflowWrap:"anywhere",textAlign:"center",fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(agrees?"#166534":"#991b1b"):IND}}>{caption}</motion.div>
    {final&&<svg viewBox="0 0 200 32" width="130"><SvgAnswerBadge show answer={problem.answer??null} cx={100} y={3}/></svg>}
  </div>;
}
