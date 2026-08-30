import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", RED = "#dc2626";
const AMBER = "#f59e0b", TEAL = "#0d9488", DIM = "#94a3b8";

/** Color the two exclusive regions and their common overlap. Adding that same
 * overlap to each equal remainder turns the comparison into whole-shape areas. */
export function OverlapAreaCancellationScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const side = num(data.squareSide, 0);
  const overlap = String(data.overlapSymbol ?? "");
  const squareArea = side * side;
  const radiusText = `${side}/√π`;
  const choice = problem.choices?.find((item) => item.text === radiusText)?.label;
  const valid = side === 2 && overlap === "a" && squareArea === 4 && radiusText === problem.shortAnswer && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  const cx = 129, cy = 116, sq = 132, sx = cx - sq / 2, sy = cy - sq / 2;
  const radius = sq / Math.sqrt(Math.PI);

  return <div style={{ width:"100%", display:"flex", flexDirection:"column", alignItems:"center", gap:7, padding:"5px 2px", boxSizing:"border-box" }}>
    <svg viewBox="0 0 470 270" width="100%" style={{ maxWidth:500, display:"block" }} aria-label="A square and circle split into their overlap and equal exclusive regions">
      <defs><clipPath id="overlap-circle-clip"><circle cx={cx} cy={cy} r={radius}/></clipPath></defs>
      <text x="235" y="16" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
        {phase===0?"name the shared area":phase===1?"the two leftover regions are equal":"add the overlap back to both sides"}
      </text>

      <g>
        <rect x={sx} y={sy} width={sq} height={sq} fill={phase>=1?"#fef3c7":"#f8fafc"}/>
        <circle cx={cx} cy={cy} r={radius} fill={phase>=1?"#e0e7ff":"#f8fafc"}/>
        <motion.rect x={sx} y={sy} width={sq} height={sq} clipPath="url(#overlap-circle-clip)" fill="#ccfbf1" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.45}}/>
        <rect x={sx} y={sy} width={sq} height={sq} fill="none" stroke={INK} strokeWidth="2.4"/>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke={IND} strokeWidth="2.4"/>
        <line x1={sx} y1={sy+sq+9} x2={sx+sq} y2={sy+sq+9} stroke={INK}/>
        <text x={cx} y={sy+sq+25} textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>side = {side}</text>

        <motion.text x={cx} y={cy+5} textAnchor="middle" fontSize="25" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{scale:.4,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",stiffness:190,damping:15}} style={{transformBox:"fill-box",transformOrigin:"center"}}>{overlap}</motion.text>
        {phase>=1&&<>
          <text x="39" y="70" textAnchor="middle" fontSize="10" fontWeight="850" fill={IND}>CIRCLE ONLY</text>
          <path d="M66 76Q80 88 86 99" fill="none" stroke={IND} strokeWidth="1.5"/>
          <text x="217" y="70" textAnchor="middle" fontSize="10" fontWeight="850" fill="#b45309">SQUARE ONLY</text>
          <path d="M205 76Q195 84 188 96" fill="none" stroke={AMBER} strokeWidth="1.5"/>
        </>}
      </g>

      {phase===0&&<g transform="translate(286 60)">
        <rect width="154" height="113" rx="14" fill="#ecfeff" stroke="#99f6e4"/>
        <text x="77" y="29" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={INK}>COMMON TO BOTH</text>
        <text x="77" y="66" textAnchor="middle" fontSize="30" fontWeight="900" fill={TEAL} fontFamily={FONT}>area = {overlap}</text>
        <text x="77" y="92" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM}>same piece in each whole shape</text>
      </g>}

      {phase===1&&<g transform="translate(277 48)">
        <rect width="175" height="139" rx="14" fill="#f8fafc" stroke="#cbd5e1"/>
        <text x="87.5" y="28" textAnchor="middle" fontSize="10" fontWeight="850" fill={IND}>CIRCLE ONLY</text>
        <text x="87.5" y="52" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>πr² − {overlap}</text>
        <text x="87.5" y="76" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK}>=</text>
        <text x="87.5" y="98" textAnchor="middle" fontSize="10" fontWeight="850" fill="#b45309">SQUARE ONLY</text>
        <text x="87.5" y="124" textAnchor="middle" fontSize="16" fontWeight="900" fill="#b45309" fontFamily={FONT}>{squareArea} − {overlap}</text>
      </g>}

      {phase===2&&<g transform="translate(276 38)">
        <rect width="178" height="181" rx="14" fill={valid?"#f0fdf4":"#fef2f2"} stroke={valid?"#86efac":"#fecaca"}/>
        <text x="89" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={INK}>CANCEL THE SAME {overlap}</text>
        <text x="89" y="50" textAnchor="middle" fontSize="15" fontWeight="900" fill={DIM} fontFamily={FONT}>πr²−{overlap} = {squareArea}−{overlap}</text>
        <motion.line x1="58" y1="44" x2="73" y2="52" stroke={RED} strokeWidth="2" initial={{pathLength:0}} animate={{pathLength:1}}/>
        <motion.line x1="146" y1="44" x2="160" y2="52" stroke={RED} strokeWidth="2" initial={{pathLength:0}} animate={{pathLength:1}}/>
        <text x="89" y="79" textAnchor="middle" fontSize="20" fontWeight="900" fill={IND} fontFamily={FONT}>πr² = {squareArea}</text>
        <text x="89" y="107" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>r² = {squareArea}/π</text>
        <motion.text x="89" y="137" textAnchor="middle" fontSize="22" fontWeight="900" fill={valid?GREEN:RED} fontFamily={FONT} initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.35,type:"spring"}}>r = {radiusText}</motion.text>
        <motion.g initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.7,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}>
          <rect x="43" y="149" width="92" height="25" rx="13" fill={valid?GREEN:RED}/><text x="89" y="166" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#fff">{valid?`Answer ${problem.answer}`:"check failed"}</text>
        </motion.g>
      </g>}
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(valid?"#166534":RED):IND,background:final?(valid?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)"}}>
      {phase===0?`the turquoise overlap has area ${overlap}`:phase===1?`πr² − ${overlap} = ${squareArea} − ${overlap}`:valid?`equal leftovers + the same overlap means equal whole areas`:`side, overlap, stored answer, or choice check failed`}
    </motion.span>
  </div>;
}
