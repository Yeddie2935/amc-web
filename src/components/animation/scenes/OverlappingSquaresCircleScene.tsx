import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", RED = "#dc2626";
const AMBER = "#f59e0b", DIM = "#64748b";

/** Reveal the 2-by-2 common square, correct the union's double count, and use
 * that square's diagonal as the removed circle's diameter. */
export function OverlappingSquaresCircleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const side = num(data.squareSide, 0), overlapSide = num(data.overlapSide, 0);
  const squareArea = side ** 2, overlapArea = overlapSide ** 2;
  const unionArea = 2 * squareArea - overlapArea;
  const diameterSquared = 2 * overlapSide ** 2, radiusSquared = diameterSquared / 4;
  const circleCoefficient = radiusSquared;
  const result = `${unionArea} − ${circleCoefficient}π`;
  const choice = problem.choices?.find(c => c.text.replace(/\s/g, "") === result.replace(/\s/g, ""))?.label;
  const ok = side === 4 && overlapSide === 2 && unionArea === 28 && radiusSquared === 2 &&
    result === problem.shortAnswer && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);

  const left = "70,119 150,39 230,119 150,199";
  const right = "190,119 270,39 350,119 270,199";
  const overlap = "190,79 230,119 190,159 150,119";
  const circleR = 40;

  return <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 470 285" style={{width:"min(500px, calc(100vw - 48px))",maxWidth:"100%",minWidth:0,display:"block"}} aria-label="Two overlapping four by four squares and a circle whose diameter is the overlap diagonal">
      <defs>
        <mask id="osc-hole"><rect width="470" height="285" fill="white"/><circle cx="190" cy="119" r={circleR} fill="black"/></mask>
      </defs>
      <text x="235" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
        {phase===0?"find the shared piece":phase===1?"count the union once":phase===2?"the overlap diagonal is the diameter":"remove the circle"}
      </text>

      {phase===3 && <motion.g mask="url(#osc-hole)" initial={{opacity:.15}} animate={{opacity:.92}} transition={{duration:.7}}><polygon points={left} fill="#c7d2fe"/><polygon points={right} fill="#c7d2fe"/></motion.g>}
      <motion.polygon points={left} fill={phase<3?"#e0e7ff":"transparent"} fillOpacity={phase===0?.55:.28} stroke={INK} strokeWidth="2.3" initial={{x:-18,opacity:0}} animate={{x:0,opacity:1}}/>
      <motion.polygon points={right} fill={phase<3?"#dbeafe":"transparent"} fillOpacity={phase===0?.55:.28} stroke={INK} strokeWidth="2.3" initial={{x:18,opacity:0}} animate={{x:0,opacity:1}}/>
      <motion.polygon points={overlap} fill="#fde68a" fillOpacity={phase===3?.12:.95} stroke={phase>=2?AMBER:INK} strokeWidth={phase>=2?2.5:1.5} initial={{scale:.25,opacity:0}} animate={{scale:1,opacity:phase===3?.25:1}} transition={{delay:.25,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}/>
      <circle cx="190" cy="119" r={circleR} fill={phase===3?"#fff":"#fff"} fillOpacity={phase>=2?1:.72} stroke={IND} strokeWidth="2.5"/>

      {phase===0 && <g>
        <text x="190" y="105" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>OVERLAP</text>
        <text x="190" y="129" textAnchor="middle" fontSize="18" fontWeight="900" fill={AMBER} fontFamily={FONT}>{overlapSide} × {overlapSide}</text>
        <text x="190" y="148" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>area {overlapArea}</text>
        <text x="111" y="218" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>side {side}</text><text x="289" y="218" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>side {side}</text>
      </g>}

      {phase===1 && <g transform="translate(365 55)">
        <rect width="96" height="130" rx="13" fill="#f8fafc" stroke="#cbd5e1"/>
        <text x="48" y="25" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>TWO SQUARES</text>
        <text x="48" y="50" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>{squareArea} + {squareArea}</text>
        <text x="48" y="74" textAnchor="middle" fontSize="10" fontWeight="850" fill={RED}>overlap counted twice</text>
        <motion.text x="48" y="101" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.45}}>{2*squareArea} − {overlapArea}</motion.text>
        <motion.text x="48" y="122" textAnchor="middle" fontSize="19" fontWeight="900" fill={GREEN} fontFamily={FONT} initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.7,type:"spring"}}>= {unionArea}</motion.text>
      </g>}

      {phase>=2 && <g>
        <motion.line x1="150" y1="119" x2="230" y2="119" stroke={RED} strokeWidth="3" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:.65}}/>
        <circle cx="150" cy="119" r="3.5" fill={RED}/><circle cx="230" cy="119" r="3.5" fill={RED}/>
      </g>}
      {phase===2 && <g transform="translate(356 43)">
        <rect width="106" height="164" rx="13" fill="#fff7ed" stroke="#fed7aa"/>
        <text x="53" y="23" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>DIAGONAL²</text>
        <text x="53" y="48" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>{overlapSide}² + {overlapSide}² = {diameterSquared}</text>
        <text x="53" y="75" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>d² = {diameterSquared}</text>
        <line x1="13" y1="88" x2="93" y2="88" stroke="#fed7aa"/>
        <text x="53" y="111" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>r² = d² ÷ 4</text>
        <motion.text x="53" y="142" textAnchor="middle" fontSize="23" fontWeight="900" fill={GREEN} fontFamily={FONT} initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.65,type:"spring"}}>r² = {radiusSquared}</motion.text>
      </g>}
      {phase===3 && <g transform="translate(351 48)">
        <rect width="113" height="151" rx="14" fill={ok?"#f0fdf4":"#fef2f2"} stroke={ok?"#86efac":"#fecaca"}/>
        <text x="56.5" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>CIRCLE AREA</text>
        <text x="56.5" y="52" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>πr² = {circleCoefficient}π</text>
        <line x1="13" y1="67" x2="100" y2="67" stroke="#bbf7d0"/>
        <text x="56.5" y="91" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>SHADED AREA</text>
        <motion.text x="56.5" y="122" textAnchor="middle" fontSize="19" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT} initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.45,type:"spring"}}>{result}</motion.text>
      </g>}
      <SvgAnswerBadge show={final} answer={ok ? problem.answer : "check failed"} cx={205} y={244} width={ok?94:128}/>
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(ok?"#166534":RED):IND,background:final?(ok?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)"}}>
      {phase===0?`the bisected sides make a ${overlapSide} × ${overlapSide} overlap`:phase===1?`${squareArea} + ${squareArea} − ${overlapArea} = ${unionArea}`:phase===2?`d² = ${overlapSide}² + ${overlapSide}², so r² = ${radiusSquared}`:ok?`${unionArea} − ${circleCoefficient}π matches choice ${problem.answer}`:"geometry, answer, or choice check failed"}
    </motion.span>
  </div>;
}
