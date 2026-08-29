import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GOLD = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** A tangent chord exposes a right triangle whose leg-square is the annulus coefficient. */
export function TangentChordAnnulusScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const outer = num(data.outerRadius, 1), chord = num(data.chordLength, 0);
  const half = chord / 2;
  const innerSq = outer * outer - half * half;
  const inner = Math.sqrt(innerSq);
  const areaCoeff = outer * outer - innerSq;
  const answerText = `${areaCoeff}π`;
  const choice = problem.choices?.find(c => c.text.replace(/\s/g, "") === answerText)?.label;
  const ok = Number.isInteger(inner) && answerText === problem.shortAnswer?.replace(/\s/g, "") && choice === problem.answer;
  const last = totalSteps - 1, final = step >= last, phase = final ? 2 : Math.min(step, 1);

  const cx = 188, cy = 128, R = 100, scale = R / outer, r = inner * scale;
  const chordY = cy + r, ax = cx - half * scale, dx = cx + half * scale;
  const point = (label:string, x:number, y:number, tx:number, ty:number) => <g><circle cx={x} cy={y} r="4" fill={INK}/><text x={x+tx} y={y+ty} fontFamily={FONT} fontSize="11" fontWeight="900" fill={INK}>{label}</text></g>;

  return <div style={{display:"flex",justifyContent:"center",width:"100%",padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 460 320" width="100%" style={{maxWidth:500,display:"block"}} aria-label="Two concentric circles with a tangent chord forming a right triangle">
      <text x="230" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
        {phase===0?"the tangent radius bisects the chord":phase===1?"the right triangle reveals the inner radius":"subtract the inner disk from the outer disk"}
      </text>

      <circle cx={cx} cy={cy} r={R} fill={final?"#dcfce7":"#f8fafc"} stroke={INK} strokeWidth="2.2"/>
      <circle cx={cx} cy={cy} r={r} fill="white" stroke={IND} strokeWidth="2.2"/>
      <line x1={ax} y1={chordY} x2={dx} y2={chordY} stroke={GOLD} strokeWidth="3" strokeLinecap="round"/>
      <motion.line x1={cx} y1={cy} x2={cx} y2={chordY} stroke={IND} strokeWidth="3" initial={{pathLength:0}} animate={{pathLength:1}}/>
      <line x1={ax} y1={chordY} x2={cx} y2={cy} stroke={INK} strokeWidth="2.2"/>
      <path d={`M ${cx-12} ${chordY} v -12 h 12`} fill="none" stroke={GOLD} strokeWidth="2"/>
      {point("A",ax,chordY,-17,17)}{point("B",cx,chordY,7,17)}{point("C",cx,cy,7,-7)}{point("D",dx,chordY,8,17)}
      <text x={(ax+cx)/2} y={chordY+19} textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="900" fill={GOLD}>{phase===0?`${chord} ÷ 2 = ${half}`:`AB = ${half}`}</text>
      <text x={(ax+cx)/2-6} y={(chordY+cy)/2-7} textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="900" fill={INK}>AC = {outer}</text>
      {phase>=1&&<motion.text x={cx+10} y={(cy+chordY)/2+3} fontFamily={FONT} fontSize="12" fontWeight="900" fill={IND} initial={{opacity:0}} animate={{opacity:1}}>CB = {inner}</motion.text>}

      {phase===0&&<g transform="translate(304 66)"><rect width="132" height="112" rx="13" fill="#fff7ed" stroke={GOLD} strokeWidth="2"/><text x="66" y="24" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>CENTER ⟂ CHORD</text><text x="66" y="52" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>AB = BD</text><text x="66" y="78" textAnchor="middle" fontSize="16" fontWeight="900" fill={GOLD} fontFamily={FONT}>{chord} ÷ 2 = {half}</text><text x="66" y="99" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>two equal halves</text></g>}

      {phase===1&&<g transform="translate(298 58)"><motion.g initial={{opacity:0,x:10}} animate={{opacity:1,x:0}}><rect width="143" height="137" rx="13" fill="#eef2ff" stroke={IND} strokeWidth="2"/><text x="71.5" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>RIGHT △ACB</text><text x="71.5" y="54" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>CB² + {half}² = {outer}²</text><text x="71.5" y="83" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>CB² = {innerSq}</text><motion.text x="71.5" y="116" textAnchor="middle" fontSize="20" fontWeight="950" fill={IND} fontFamily={FONT} initial={{scale:.5}} animate={{scale:1}} transition={{delay:.4,type:"spring"}}>CB = {inner}</motion.text></motion.g></g>}

      {phase===2&&<g transform="translate(292 54)"><motion.g initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect width="158" height="158" rx="14" fill={ok?"#f0fdf4":"#fef2f2"} stroke={ok?GREEN:RED} strokeWidth="2.3"/><text x="79" y="28" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>ANNULUS AREA</text><text x="79" y="58" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>π({outer}² − {inner}²)</text><text x="79" y="88" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>= π({outer*outer} − {innerSq})</text><text x="79" y="121" textAnchor="middle" fontSize="22" fontWeight="950" fill={ok?GREEN:RED} fontFamily={FONT}>= {answerText}</text><text x="79" y="145" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM}>also π · AB² = π · {half}²</text></motion.g></g>}

      {phase===0&&<text x="188" y="286" textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="850" fill={GOLD}>AD = {chord} ⟹ AB = BD = {half}</text>}
      {phase===1&&<text x="188" y="286" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="900" fill={IND}>{inner}² + {half}² = {outer}²</text>}
      {final&&<SvgAnswerBadge show={ok} answer={problem.answer} cx={188} y={278} width={88}/>} 
      {final&&!ok&&<text x="188" y="298" textAnchor="middle" fontSize="9" fill={RED}>check failed: computed {answerText}; stored {problem.shortAnswer ?? "missing"}</text>}
    </svg>
  </div>;
}
