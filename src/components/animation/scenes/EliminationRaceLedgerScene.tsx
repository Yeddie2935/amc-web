import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", RED = "#dc2626", AMBER = "#d97706", DIM = "#64748b";

/** Race six, return one winner, and ledger the five permanent eliminations per heat. */
export function EliminationRaceLedgerScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const competitors = Math.round(num(data.competitors, 0)), lanes = Math.round(num(data.lanes, 0));
  const eliminatedPerRace = lanes - 1, totalEliminated = competitors - 1;
  const races = totalEliminated / eliminatedPerRace;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d.]/g, ""));
  const choice = problem.choices?.find(c => Number(c.text) === races)?.label;
  const ok = Number.isInteger(races) && races * eliminatedPerRace === totalEliminated && stored === races && choice === problem.answer;
  const failure = !Number.isInteger(races) ? `${totalEliminated} removals do not split into groups of ${eliminatedPerRace}` : stored !== races ? `computed ${races}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 305" width="100%" style={{ width: "100%", maxWidth: "100%", minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "one six-lane heat returns one winner and removes five" : phase === 1 ? "the tournament must remove everyone except one champion" : "pack all 215 removals into five-runner race blocks"}</text>
      {phase === 0 && <><g transform="translate(48 39)">{Array.from({ length: lanes }, (_, i) => <g key={i}><rect x="0" y={i*27} width="315" height="22" rx="3" fill={i===0 ? "#dcfce7" : "#f8fafc"} stroke={i===0 ? GREEN : "#cbd5e1"} /><text x="-10" y={i*27+15} textAnchor="end" fontSize="9" fontWeight="800" fill={DIM}>{i+1}</text><motion.g initial={{ x: 16 }} animate={{ x: i===0 ? 275 : 249-i*4 }} transition={{ duration: .9+i*.08 }}><circle cy={i*27+11} r="8" fill={i===0 ? GREEN : IND} /><text y={i*27+15} textAnchor="middle" fontSize="9">🏃</text></motion.g><line x1="270" y1={i*27} x2="270" y2={i*27+22} stroke={RED} strokeWidth="1.5" /></g>)}</g>
        <motion.path d="M350 52 C414 52 414 214 355 214" fill="none" stroke={GREEN} strokeWidth="2.5" initial={{ pathLength:0 }} animate={{pathLength:1}} transition={{delay:1}} /><text x="390" y="126" textAnchor="middle" fontSize="10" fontWeight="850" fill={GREEN}>winner returns</text>
        <g transform="translate(77 225)"><motion.circle cx="25" cy="18" r="16" fill="#dcfce7" stroke={GREEN} strokeWidth="2" initial={{scale:0}} animate={{scale:1}} /><text x="25" y="22" textAnchor="middle" fontSize="10" fontWeight="900" fill={GREEN}>1 in</text><text x="73" y="24" fontSize="20" fill={INK}>+</text>{Array.from({length:eliminatedPerRace},(_,i)=><motion.g key={i} initial={{opacity:1,y:0}} animate={{opacity:.28,y:13}} transition={{delay:.7+i*.08}}><circle cx={118+i*42} cy="18" r="14" fill="#fee2e2" stroke={RED}/><text x={118+i*42} y="22" textAnchor="middle" fontSize="9" fontWeight="900" fill={RED}>OUT</text></motion.g>)}</g><text x="230" y="292" textAnchor="middle" fontSize="15" fontWeight="900" fill={RED} fontFamily={FONT}>each race eliminates {eliminatedPerRace}</text></>}
      {phase === 1 && <><g transform="translate(63 42)">{Array.from({length:competitors},(_,i)=>{const survivor=i===0; return <motion.circle key={i} cx={(i%24)*14} cy={Math.floor(i/24)*14} r="4.2" fill={survivor?GREEN:IND} initial={{opacity:1,scale:1}} animate={{opacity:survivor?1:.14,scale:survivor?1.8:.7}} transition={{delay:survivor?.8:(i%25)*.012}} style={{transformBox:"fill-box",transformOrigin:"center"}}/>})}</g><text x="230" y="190" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>216 starters → 1 champion</text><motion.rect x="120" y="211" width="220" height="47" rx="12" fill="#fee2e2" stroke={RED} strokeWidth="2" initial={{scale:.7}} animate={{scale:1}} style={{transformBox:"fill-box",transformOrigin:"center"}}/><text x="230" y="240" textAnchor="middle" fontSize="20" fontWeight="900" fill={RED} fontFamily={FONT}>{competitors} − 1 = {totalEliminated}</text><text x="230" y="280" textAnchor="middle" fontSize="11" fontWeight="850" fill={GREEN}>the last green dot is the champion</text></>}
      {phase === 2 && <><g transform="translate(42 43)">{Array.from({length:races},(_,i)=>{const col=i%11,row=Math.floor(i/11); return <motion.g key={i} initial={{opacity:0,scale:.3}} animate={{opacity:1,scale:1}} transition={{delay:i*.018}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x={col*35} y={row*38} width="29" height="30" rx="5" fill="#eef2ff" stroke={IND}/><text x={col*35+14.5} y={row*38+13} textAnchor="middle" fontSize="7" fontWeight="850" fill={DIM}>race</text><text x={col*35+14.5} y={row*38+24} textAnchor="middle" fontSize="9" fontWeight="900" fill={IND} fontFamily={FONT}>{i+1}</text></motion.g>})}</g><text x="230" y="211" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>{races} boxes × {eliminatedPerRace} removals = {races*eliminatedPerRace}</text><motion.rect x="121" y="220" width="218" height="43" rx="13" fill="#dcfce7" stroke={ok?GREEN:RED} strokeWidth="2.3" initial={{scale:.65}} animate={{scale:1}} style={{transformBox:"fill-box",transformOrigin:"center"}}/><text x="230" y="248" textAnchor="middle" fontSize="20" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT}>{totalEliminated} ÷ {eliminatedPerRace} = {races} races</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={271} width={78}/></>}
      <AnimatePresence>{final&&!ok&&<motion.text x="230" y="299" textAnchor="middle" fill={RED} fontSize="10">{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
