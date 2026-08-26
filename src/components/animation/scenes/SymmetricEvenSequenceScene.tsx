import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", AMBER = "#d97706", RED = "#dc2626", DIM = "#64748b";

/** Fold an odd arithmetic sequence around its average, then hop from center to its largest term. */
export function SymmetricEvenSequenceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = num(data.total, 0), count = Math.round(num(data.count, 0)), stepSize = num(data.stepSize, 0);
  const middle = total / count, half = (count - 1) / 2, largest = middle + half * stepSize;
  const first = middle - half * stepSize;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const choice = problem.choices?.find(c => Number(c.text) === largest)?.label;
  const ok = Number.isInteger(middle) && Number.isInteger(largest) && String(largest) === problem.shortAnswer && choice === problem.answer;
  const failure = !Number.isInteger(middle) ? `${total} ÷ ${count} is not an integer` : String(largest) !== problem.shortAnswer ? `computed ${largest}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const tileW = 14, gap = 2, x0 = 30, y = 102, center = Math.floor(count / 2);
  const tx = (i: number) => x0 + i * (tileW + gap);

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 300" width="100%" style={{ width: "100%", maxWidth: "100%", minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "fold the equally spaced row: opposite terms balance at the center" : phase === 1 ? "the sum spreads evenly, so the middle tile is the average" : "unfold the right half as twelve +2 hops"}</text>
      {phase < 2 && <><g>{Array.from({length:count},(_,i)=>{const isCenter=i===center; return <motion.g key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*.025}}><rect x={tx(i)} y={y} width={tileW} height="31" rx="3" fill={isCenter?"#dcfce7":"#eef2ff"} stroke={isCenter?GREEN:IND} strokeWidth={isCenter?2:1}/>{(i===0||i===center||i===count-1)&&<text x={tx(i)+tileW/2} y={y+20} textAnchor="middle" fontSize="7" fontWeight="900" fill={isCenter?GREEN:IND} fontFamily={FONT}>{phase===1?(i===0?first:i===center?"★":largest):(isCenter?"mid":"•")}</text>}<text x={tx(i)+tileW/2} y={y+45} textAnchor="middle" fontSize="6.5" fontWeight="800" fill={DIM}>{i+1}</text></motion.g>})}</g>
        {phase===0&&<>{Array.from({length:half},(_,i)=>{const left=i,right=count-1-i; const lx=tx(left)+tileW/2,rx=tx(right)+tileW/2,height=20+(half-1-i)*3.5; return <motion.path key={i} d={`M${lx} ${y-3} Q${(lx+rx)/2} ${y-height} ${rx} ${y-3}`} fill="none" stroke={i%2?"#a5b4fc":"#fbbf24"} strokeWidth="1.2" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:i*.05}}/>})}<text x="230" y="61" textAnchor="middle" fontSize="11" fontWeight="850" fill={AMBER}>12 balanced pairs + 1 middle term</text><motion.rect x="125" y="176" width="210" height="44" rx="12" fill="#f8fafc" stroke={INK} initial={{scale:.7}} animate={{scale:1}} style={{transformBox:"fill-box",transformOrigin:"center"}}/><text x="230" y="203" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>average = middle (term 13)</text><text x="230" y="247" textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM}>each pair is equally far below and above</text></>}
        {phase===1&&<><motion.path d="M230 48 V91" stroke={GREEN} strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}}/><rect x="115" y="39" width="230" height="41" rx="11" fill="#dcfce7" stroke={GREEN} strokeWidth="2"/><text x="230" y="65" textAnchor="middle" fontSize="17" fontWeight="900" fill={GREEN} fontFamily={FONT}>{total} ÷ {count} = {middle}</text><text x="230" y="175" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>term 13 = {middle}</text><text x="230" y="203" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>the row runs from {first} to {largest}</text></>}
      </>}
      {phase===2&&<><line x1="50" y1="125" x2="410" y2="125" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round"/>{Array.from({length:half+1},(_,i)=>{const x=50+i*(360/half),value=middle+i*stepSize; return <motion.g key={i} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:i*.07}} style={{transformBox:"fill-box",transformOrigin:"center"}}><line x1={x} y1="116" x2={x} y2="134" stroke={i===half?GREEN:IND} strokeWidth={i===half?3:1.5}/>{(i===0||i===half||i%3===0)&&<text x={x} y="153" textAnchor="middle" fontSize="9" fontWeight="900" fill={i===half?GREEN:IND} fontFamily={FONT}>{value}</text>}{i<half&&<motion.path d={`M${x+3} 109 Q${x+15} 89 ${x+27} 109`} fill="none" stroke={AMBER} strokeWidth="1.8" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:i*.07}}/>}</motion.g>})}<motion.text x="230" y="190" textAnchor="middle" fontSize="14" fontWeight="900" fill={AMBER} fontFamily={FONT} initial={{opacity:0}} animate={{opacity:1}}>12 hops × +{stepSize} = +{half*stepSize}</motion.text><motion.rect x="115" y="211" width="230" height="48" rx="13" fill="#dcfce7" stroke={ok?GREEN:RED} strokeWidth="2.3" initial={{scale:.65}} animate={{scale:1}} style={{transformBox:"fill-box",transformOrigin:"center"}}/><text x="230" y="241" textAnchor="middle" fontSize="20" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT}>{middle} + {half} × {stepSize} = {largest}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={270} width={80}/></>}
      <AnimatePresence>{final&&!ok&&<motion.text x="230" y="298" textAnchor="middle" fill={RED} fontSize="10">{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
