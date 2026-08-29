import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", RED = "#dc2626";

const parseFraction = (value: unknown) => {
  const [a, b] = String(value ?? "").split("/").map(Number);
  return b ? a / b : a;
};

/** A unit circle caught between a circumscribed square and an inscribed square.
 * The diagonal measures the inner square, then the two requested regions peel
 * into area bars for the final nearest-choice comparison.
 * Data: { radius, diameter, outerSide, innerDiagonal }.
 */
export function CircleBetweenSquaresRatioScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const radius = num(data.radius, 0), diameter = num(data.diameter, 0);
  const outerSide = num(data.outerSide, 0), innerDiagonal = num(data.innerDiagonal, 0);
  const innerArea = innerDiagonal * innerDiagonal / 2;
  const circleArea = Math.PI * radius * radius;
  const outerArea = outerSide * outerSide;
  const shadedArea = circleArea - innerArea;
  const betweenArea = outerArea - innerArea;
  const ratio = shadedArea / betweenArea;
  const choices = (problem.choices ?? []).map(c => ({ label: c.label, value: parseFraction(c.text) }));
  const nearest = choices.reduce((best, c) => Math.abs(c.value - ratio) < Math.abs(best.value - ratio) ? c : best, choices[0]);
  const ok = radius > 0 && diameter === 2 * radius && outerSide === diameter && innerDiagonal === diameter &&
    Math.abs(innerArea - 2) < 1e-9 && Math.abs(betweenArea - 2) < 1e-9 && nearest?.label === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);

  const x = 24, y = 18, s = 214, cx = x + s / 2, cy = y + s / 2, r = s / 2;
  const diamond = `${cx},${y} ${x+s},${cy} ${cx},${y+s} ${x},${cy}`;
  const cornerPath = `M${x},${y}H${x+s}V${y+s}H${x}Z M${cx},${y}L${x+s},${cy}L${cx},${y+s}L${x},${cy}Z`;
  const barScale = 76;

  return <div style={{ width:"100%", display:"flex", flexDirection:"column", alignItems:"center", gap:7, padding:"5px 2px", boxSizing:"border-box" }}>
    <svg viewBox="0 0 470 280" width="100%" style={{ maxWidth:500, display:"block" }} aria-label="A circle nested between two squares, with their areas compared">
      <rect x={x} y={y} width={s} height={s} fill="#f8fafc" stroke={INK} strokeWidth="2.5" />
      {phase >= 2 && <motion.path d={cornerPath} fill="#fef3c7" fillRule="evenodd" initial={{opacity:0}} animate={{opacity:.9}} />}
      <circle cx={cx} cy={cy} r={r} fill={phase >= 1 ? "#c7d2fe" : "#fff"} stroke={IND} strokeWidth="2.5" />
      <polygon points={diamond} fill="#fff" stroke={INK} strokeWidth="2.5" />

      {phase === 0 && <g>
        <motion.line x1={x} y1={cy} x2={x+s} y2={cy} stroke={IND} strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}} />
        <circle cx={cx} cy={cy} r="3" fill={IND}/>
        <text x={cx} y={cy-9} textAnchor="middle" fontFamily={FONT} fontSize="14" fontWeight="900" fill={IND}>diagonal = diameter = {innerDiagonal}</text>
        <text x={cx} y="254" textAnchor="middle" fontFamily={FONT} fontSize="16" fontWeight="900" fill={INK}>inner area = d²/2 = {innerArea}</text>
      </g>}
      {phase === 1 && <g>
        <text x={cx} y={cy-5} textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>remove the inner square</text>
        <text x="352" y="83" textAnchor="middle" fontFamily={FONT} fontSize="18" fontWeight="900" fill={IND}>π·{radius}² − {innerArea}</text>
        <motion.text x="352" y="116" textAnchor="middle" fontFamily={FONT} fontSize="24" fontWeight="900" fill={IND} initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}}>= π − 2</motion.text>
        <text x="352" y="139" textAnchor="middle" fontSize="11" fontWeight="800" fill="#64748b">circle's shaded area</text>
      </g>}
      {phase === 2 && <g>
        <text x={cx} y={cy-5} textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>all area between the squares</text>
        <text x="352" y="83" textAnchor="middle" fontFamily={FONT} fontSize="18" fontWeight="900" fill={INK}>{outerSide}² − {innerArea}</text>
        <motion.text x="352" y="116" textAnchor="middle" fontFamily={FONT} fontSize="24" fontWeight="900" fill={IND} initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}}>= {betweenArea}</motion.text>
        <text x="352" y="139" textAnchor="middle" fontSize="11" fontWeight="800" fill="#64748b">outer square minus inner square</text>
      </g>}
      {phase === 3 && <g>
        <rect x="278" y="35" width={shadedArea*barScale} height="25" rx="5" fill="#818cf8"/>
        <text x="272" y="52" textAnchor="end" fontSize="11" fontWeight="850" fill={INK}>shaded</text>
        <text x={283+shadedArea*barScale} y="52" fontFamily={FONT} fontSize="12" fontWeight="900" fill={IND}>π−2</text>
        <rect x="278" y="78" width={betweenArea*barScale} height="25" rx="5" fill="#fbbf24"/>
        <text x="272" y="95" textAnchor="end" fontSize="11" fontWeight="850" fill={INK}>between</text>
        <text x={283+betweenArea*barScale} y="95" fontFamily={FONT} fontSize="12" fontWeight="900" fill={INK}>{betweenArea}</text>
        <text x="355" y="139" textAnchor="middle" fontFamily={FONT} fontSize="17" fontWeight="900" fill={INK}>(π−2)/2 ≈ {ratio.toFixed(2)}</text>
        <motion.text x="355" y="171" textAnchor="middle" fontFamily={FONT} fontSize="21" fontWeight="900" fill={ok?GREEN:RED} initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}}>closest to 1/2</motion.text>
        <motion.g initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.55,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}>
          <rect x="309" y="195" width="92" height="27" rx="14" fill={ok?GREEN:RED}/><text x="355" y="213" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">{ok ? `Answer ${problem.answer}` : "check failed"}</text>
        </motion.g>
      </g>}
    </svg>
    <AnimatePresence mode="wait"><motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(ok?"#166534":RED):IND,background:final?(ok?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center"}}>
      {phase===0?"the diamond's diagonal is the circle's diameter":phase===1?"circle minus diamond gives the shaded region":phase===2?"outer square minus diamond gives the comparison region":ok?"0.57 is nearer 0.50 than any other choice":"stored-answer or geometry check failed"}
    </motion.span></AnimatePresence>
  </div>;
}
