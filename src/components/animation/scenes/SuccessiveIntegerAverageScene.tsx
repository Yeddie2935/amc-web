import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", RED = "#dc2626", ORANGE = "#d97706", DIM = "#64748b";

function Ball({ x, y, value, active = false, delay = 0 }: { x: number; y: number; value: number; active?: boolean; delay?: number }) {
  const color = active ? GREEN : ORANGE;
  return <motion.g initial={{ opacity: 0, scale: .45 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, type: "spring", stiffness: 190, damping: 15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
    <circle cx={x} cy={y} r="21" fill={active ? "#dcfce7" : "#ffedd5"} stroke={color} strokeWidth="2"/>
    <path d={`M${x-19} ${y-7}Q${x} ${y+3} ${x+19} ${y-7}M${x-19} ${y+7}Q${x} ${y-3} ${x+19} ${y+7}M${x} ${y-21}Q${x-8} ${y} ${x} ${y+21}M${x} ${y-21}Q${x+8} ${y} ${x} ${y+21}`} fill="none" stroke={color} strokeWidth="1" opacity=".55"/>
    <text x={x} y={y+5} textAnchor="middle" fontSize="14" fontWeight="950" fill={active ? GREEN : INK} fontFamily={FONT}>{value}</text>
  </motion.g>;
}

function CandidateSweep({ startTotal, divisor, score, y }: { startTotal: number; divisor: number; score: number; y: number }) {
  return <g>{Array.from({ length: 10 }, (_, i) => { const total=startTotal+i, valid=total%divisor===0, x=40+i*43; return <motion.g key={i} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*.045 }}><circle cx={x} cy={y} r="17" fill={valid ? "#dcfce7" : "#f8fafc"} stroke={valid ? GREEN : "#cbd5e1"} strokeWidth={valid ? 2.4 : 1.2}/><text x={x} y={y+4} textAnchor="middle" fontSize="10.5" fontWeight="900" fill={valid ? GREEN : DIM} fontFamily={FONT}>{total}</text><text x={x} y={y+32} textAnchor="middle" fontSize="8.5" fontWeight="850" fill={i===score ? GREEN : DIM} fontFamily={FONT}>+{i}</text>{!valid&&<motion.line x1={x-10} y1={y-10} x2={x+10} y2={y+10} stroke="#fca5a5" strokeWidth="1.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .35+i*.035 }}/>}</motion.g>; })}</g>;
}

export function SuccessiveIntegerAverageScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const scores = (Array.isArray(data.initialScores) ? data.initialScores : []).map((v) => num(v, 0));
  const scoreLimit = Math.round(num(data.scoreLimitExclusive, 0));
  const firstGame = Math.round(num(data.firstAddedGame, 0));
  const secondGame = Math.round(num(data.secondAddedGame, 0));
  const initialTotal = scores.reduce((a,b)=>a+b,0);
  const allowed = Array.from({ length: scoreLimit }, (_,i)=>i);
  const ninthCandidates = allowed.filter(v=>(initialTotal+v)%firstGame===0);
  const ninth = ninthCandidates[0];
  const ninthTotal = initialTotal+ninth;
  const tenthCandidates = allowed.filter(v=>(ninthTotal+v)%secondGame===0);
  const tenth = tenthCandidates[0];
  const finalTotal = ninthTotal+tenth;
  const product = ninth*tenth;
  const choice = problem.choices?.find(c=>Number(c.text)===product)?.label;
  const ok = scores.join(",")==="7,4,3,6,8,3,1,5" && ninthCandidates.length===1 && tenthCandidates.length===1 && ninth===8 && tenth===5 && finalTotal===50 && String(product)===problem.shortAnswer && choice===problem.answer;
  const failure = ninthCandidates.length!==1 ? `${ninthCandidates.length} ninth-game scores work` : tenthCandidates.length!==1 ? `${tenthCandidates.length} tenth-game scores work` : product!==Number(problem.shortAnswer) ? `computed ${product}, stored ${problem.shortAnswer}` : `choice ${choice??"missing"}, stored ${problem.answer}`;
  const final=step>=totalSteps-1,phase=final?3:Math.min(step,2);

  return <div style={{ width:"100%",display:"flex",justifyContent:"center",minWidth:0,padding:"5px 2px",boxSizing:"border-box",overflow:"hidden" }}><svg viewBox="0 0 470 310" width="100%" style={{maxWidth:500,display:"block"}} aria-label="Basketball scores sweep to totals with integer averages after games nine and ten">
    <text x="235" y="19" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"load the first eight game scores onto the scoreboard":phase===1?"try 0 through 9: the nine-game total must land on a multiple of 9":phase===2?"start at 45 and land on a multiple of 10":"multiply the two uniquely determined new scores"}</text>
    {phase===0&&<g>
      {scores.map((v,i)=><g key={i}><Ball x={50+(i%4)*120} y={67+Math.floor(i/4)*69} value={v} delay={i*.07}/><text x={50+(i%4)*120} y={98+Math.floor(i/4)*69} textAnchor="middle" fontSize="8.5" fontWeight="850" fill={DIM}>game {i+1}</text></g>)}
      <motion.path d="M58 202 C92 222 146 222 177 240 M412 202 C378 222 324 222 293 240" fill="none" stroke="#cbd5e1" strokeWidth="2" initial={{pathLength:0}} animate={{pathLength:1}}/>
      <g transform="translate(110 227)"><rect width="250" height="60" rx="13" fill="#eef2ff" stroke={IND} strokeWidth="2"/><text x="125" y="23" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>FIRST 8 GAMES</text><text x="125" y="47" textAnchor="middle" fontSize="17" fontWeight="950" fill={IND} fontFamily={FONT}>{scores.join("+")} = {initialTotal}</text></g>
    </g>}
    {phase===1&&<g>
      <g transform="translate(101 37)"><rect width="268" height="65" rx="13" fill="#eef2ff" stroke={IND}/><text x="134" y="18" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>TOTAL AFTER GAME 9</text><text x="134" y="40" textAnchor="middle" fontSize="15" fontWeight="950" fill={IND} fontFamily={FONT}>{initialTotal} + score = total</text><text x="134" y="57" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>total divisible by {firstGame}</text></g>
      <CandidateSweep startTotal={initialTotal} divisor={firstGame} score={ninth} y={145}/>
      <motion.g initial={{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} transition={{delay:.8,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="112" y="216" width="246" height="61" rx="14" fill="#dcfce7" stroke={GREEN} strokeWidth="2"/><text x="235" y="239" textAnchor="middle" fontSize="11" fontWeight="850" fill="#166534">only {ninthTotal} is a multiple of {firstGame}</text><text x="235" y="263" textAnchor="middle" fontSize="19" fontWeight="950" fill={GREEN} fontFamily={FONT}>game 9: {ninthTotal} − {initialTotal} = {ninth}</text></motion.g>
    </g>}
    {phase===2&&<g>
      <g transform="translate(101 37)"><rect width="268" height="65" rx="13" fill="#fff7ed" stroke="#fdba74"/><text x="134" y="18" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>TOTAL AFTER GAME 10</text><text x="134" y="40" textAnchor="middle" fontSize="15" fontWeight="950" fill={ORANGE} fontFamily={FONT}>{ninthTotal} + score = total</text><text x="134" y="57" textAnchor="middle" fontSize="11" fontWeight="900" fill={ORANGE} fontFamily={FONT}>total divisible by {secondGame}</text></g>
      <CandidateSweep startTotal={ninthTotal} divisor={secondGame} score={tenth} y={145}/>
      <motion.g initial={{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} transition={{delay:.8,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="112" y="216" width="246" height="61" rx="14" fill="#dcfce7" stroke={GREEN} strokeWidth="2"/><text x="235" y="239" textAnchor="middle" fontSize="11" fontWeight="850" fill="#166534">only {finalTotal} is a multiple of {secondGame}</text><text x="235" y="263" textAnchor="middle" fontSize="19" fontWeight="950" fill={GREEN} fontFamily={FONT}>game 10: {finalTotal} − {ninthTotal} = {tenth}</text></motion.g>
    </g>}
    {phase===3&&<g>
      <g transform="translate(64 58)"><Ball x={55} y={48} value={ninth} active/><text x="55" y="88" textAnchor="middle" fontSize="10" fontWeight="900" fill={DIM}>GAME 9</text></g><text x="235" y="111" textAnchor="middle" fontSize="29" fontWeight="950" fill={INK}>×</text><g transform="translate(296 58)"><Ball x={55} y={48} value={tenth} active/><text x="55" y="88" textAnchor="middle" fontSize="10" fontWeight="900" fill={DIM}>GAME 10</text></g>
      <motion.g initial={{opacity:0,scale:.68}} animate={{opacity:1,scale:1}} transition={{delay:.25,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="98" y="181" width="274" height="78" rx="17" fill={ok?"#f0fdf4":"#fef2f2"} stroke={ok?GREEN:RED} strokeWidth="2.5"/><text x="235" y="209" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>PRODUCT OF THE TWO SCORES</text><text x="235" y="244" textAnchor="middle" fontSize="27" fontWeight="950" fill={ok?GREEN:RED} fontFamily={FONT}>{ninth} × {tenth} = {product}</text></motion.g>
      <text x="183" y="300" textAnchor="middle" fontSize="9" fontWeight="850" fill={ok?GREEN:RED}>{ok?"both integer averages and choice B verified":failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={415} y={280} width={78}/>
    </g>}
  </svg></div>;
}
