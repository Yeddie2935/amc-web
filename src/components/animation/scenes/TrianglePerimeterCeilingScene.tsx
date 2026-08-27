import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", GOLD = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Hinge two fixed sides almost flat, then transfer the strict third-side bound to the perimeter. */
export function TrianglePerimeterCeilingScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const sideA = num(data.sideA, 0), sideB = num(data.sideB, 0);
  const thirdLimit = sideA + sideB, perimeterLimit = sideA + sideB + thirdLimit;
  const ceiling = Math.ceil(perimeterLimit);
  const choice = problem.choices?.find(c => Number(c.text) === ceiling)?.label;
  const ok = Number.isInteger(perimeterLimit) && ceiling === Number(problem.shortAnswer) && choice === problem.answer;
  const failure = ceiling !== Number(problem.shortAnswer) ? `computed ${ceiling}; stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}; stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  const A = { x: 58, y: 170 }, B = { x: 148, y: 72 }, C = { x: 382, y: 170 };
  const token = (x:number,w:number,color:string,label:string) => <g><rect x={x} y="0" width={w} height="34" rx="8" fill={`${color}18`} stroke={color} strokeWidth="2" /><text x={x+w/2} y="22" textAnchor="middle" fontSize="13" fontWeight="900" fill={color} fontFamily={FONT}>{label}</text></g>;

  return <div style={{ display:"flex", justifyContent:"center", width:"100%", minWidth:0, padding:"6px 4px", boxSizing:"border-box" }}>
    <svg viewBox="0 0 440 300" width="100%" style={{ maxWidth:470, minWidth:0, display:"block" }}>
      <text x="220" y="16" textAnchor="middle" fontSize="10.8" fontWeight="850" fill={INK}>
        <tspan x="220">{phase === 0 ? "open the hinge: the third side approaches 5 + 19" : phase === 1 ? "carry the strict side bound into the perimeter" : "48 is the first whole-number ceiling"}</tspan>
        {phase !== 1 && <tspan x="220" dy="13">{phase === 0 ? "but never reaches it" : "above every possible perimeter"}</tspan>}
      </text>

      {phase === 0 && <>
        <line x1="58" y1="198" x2="382" y2="198" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5 4" />
        <motion.g initial={{ opacity:0 }} animate={{ opacity:1 }}>
          <motion.line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={TEAL} strokeWidth="5" strokeLinecap="round" animate={{ x2:[B.x, 112], y2:[B.y, 160] }} transition={{ duration:1.6, ease:"easeInOut" }} />
          <motion.line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={IND} strokeWidth="5" strokeLinecap="round" animate={{ x1:[B.x,112], y1:[B.y,160] }} transition={{ duration:1.6, ease:"easeInOut" }} />
          <motion.circle cx={B.x} cy={B.y} r="7" fill={GOLD} animate={{ cx:[B.x,112], cy:[B.y,160] }} transition={{ duration:1.6, ease:"easeInOut" }} />
        </motion.g>
        <text x="91" y="118" textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={FONT}>{sideA}</text><text x="277" y="112" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{sideB}</text>
        <motion.line x1={A.x} y1="207" x2={C.x} y2="207" stroke={GOLD} strokeWidth="3" initial={{ pathLength:0 }} animate={{ pathLength:.96 }} transition={{ duration:1.5, delay:.5 }} />
        <circle cx={C.x} cy="207" r="5" fill="#fff" stroke={GOLD} strokeWidth="2.5" />
        <text x="220" y="232" textAnchor="middle" fontSize="16" fontWeight="900" fill={GOLD} fontFamily={FONT}>s &lt; {sideA} + {sideB} = {thirdLimit}</text>
        <text x="220" y="252" textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM}>equality would flatten the triangle, so the endpoint stays open</text>
      </>}

      {phase === 1 && <>
        <g transform="translate(55 60)">{token(0,70,TEAL,String(sideA))}{token(82,174,IND,String(sideB))}<text x="76" y="23" fontSize="16" fontWeight="900" fill={DIM}>+</text><text x="266" y="23" fontSize="16" fontWeight="900" fill={DIM}>+</text>{token(282,88,GOLD,"s < 24")}</g>
        <motion.path d="M74 112 C74 143 220 136 220 163 M224 112 C224 143 220 136 220 163 M381 112 C381 143 220 136 220 163" fill="none" stroke={IND} strokeWidth="2" initial={{ pathLength:0 }} animate={{ pathLength:1 }} />
        <g transform="translate(76 166)"><rect width="288" height="51" rx="12" fill="#eef2ff" stroke={IND} strokeWidth="2" /><text x="144" y="20" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>P = {sideA} + {sideB} + s</text><text x="144" y="41" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>P &lt; {sideA} + {sideB} + {thirdLimit} = {perimeterLimit}</text></g>
        <text x="220" y="250" textAnchor="middle" fontSize="11" fontWeight="850" fill={GOLD}>perimeters can get arbitrarily close to {perimeterLimit} from below</text>
      </>}

      {phase === 2 && <>
        <line x1="55" y1="122" x2="390" y2="122" stroke={INK} strokeWidth="3" /><path d="M390 122l-9-5v10z" fill={INK} />
        {[45,46,47,48,49].map(v=>{const x=75+(v-45)*78;return <g key={v}><line x1={x} y1="113" x2={x} y2="131" stroke={v===perimeterLimit?GREEN:INK} strokeWidth="2" /><text x={x} y="151" textAnchor="middle" fontSize="13" fontWeight="900" fill={v===perimeterLimit?GREEN:INK} fontFamily={FONT}>{v}</text></g>})}
        <motion.line x1="55" y1="122" x2="309" y2="122" stroke={GOLD} strokeWidth="7" strokeLinecap="round" initial={{ pathLength:0 }} animate={{ pathLength:1 }} />
        <circle cx="309" cy="122" r="9" fill="#fff" stroke={GOLD} strokeWidth="3" />
        <text x="182" y="96" textAnchor="middle" fontSize="13" fontWeight="900" fill={GOLD} fontFamily={FONT}>every P is below {perimeterLimit}</text>
        <motion.path d="M309 164v35" stroke={GREEN} strokeWidth="3" initial={{ pathLength:0 }} animate={{ pathLength:1 }} /><path d="M303 191l6 9 6-9" fill="none" stroke={GREEN} strokeWidth="3" />
        <g transform="translate(131 205)"><motion.rect width="178" height="48" rx="12" fill={ok?"#dcfce7":"#fee2e2"} stroke={ok?GREEN:RED} strokeWidth="2" initial={{ scale:.6 }} animate={{ scale:1 }} style={{ transformBox:"fill-box", transformOrigin:"center" }} /><text x="89" y="19" textAnchor="middle" fontSize="10" fontWeight="850" fill={ok?GREEN:RED}>smallest whole ceiling</text><text x="89" y="40" textAnchor="middle" fontSize="22" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT}>{ceiling}</text></g>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={380} y={217} width={76} />
      </>}
      <AnimatePresence>{final&&!ok&&<motion.text x="220" y="292" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
