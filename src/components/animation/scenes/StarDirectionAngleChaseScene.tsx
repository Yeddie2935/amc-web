import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", AMBER = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";
type P = { x: number; y: number };

/** Carry direction angles through a star's supplements, tip turn, and central crossing. */
export function StarDirectionAngleChaseScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const tip = num(data.tipAngle, 0), crossings = (Array.isArray(data.crossingAngles) ? data.crossingAngles : []).map((v) => num(v, 0)), straight = num(data.straightAngle, 0);
  const acuteFirst = straight - crossings[0], acuteSecond = straight - crossings[1];
  const risingDirection = acuteFirst, middleDirection = risingDirection - tip, target = acuteSecond - middleDirection;
  const choice = problem.choices?.find((item) => Number(item.text) === target)?.label;
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d.-]/g, ""));
  const final = step >= totalSteps - 1, phase = final ? 2 : Math.min(Math.max(step, 0), 1);
  const ok = tip === 40 && crossings.join(",") === "100,110" && straight === 180 && acuteFirst === 80 && acuteSecond === 70 && middleDirection === 40 && target === 30 && target === stored && choice === problem.answer;
  const failure = crossings.length !== 2 ? "need exactly two crossings" : acuteFirst !== 80 || acuteSecond !== 70 ? `supplements are ${acuteFirst}°, ${acuteSecond}°` : middleDirection !== 40 ? `middle direction is ${middleDirection}°` : target !== stored ? `computed ${target}°, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;

  const A = { x: 37, y: 93 }, R = { x: 293, y: 93 }, T = { x: 165, y: 24 }, L = { x: 62, y: 250 }, D = { x: 260, y: 207 };
  const P = { x: 128, y: 93 }, Q = { x: 184, y: 158 };
  const lines: [P,P][] = [[A,R],[L,T],[T,D],[D,A],[A,D],[L,R]];
  const uniqueLines: [P,P][] = [[A,R],[L,T],[T,D],[D,A],[L,R]];

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 470 315" width="100%" style={{ maxWidth: 500, minWidth: 0, display: "block" }} aria-label="Star diagram whose line directions are chased through 100, 110, and 40 degree angles to find angle A">
      <text x="235" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "replace each obtuse crossing by its useful acute turn" : phase === 1 ? "follow the rising line, then turn 40° at the lower tip" : "the 70° crossing carries the last line 30° below horizontal"}</text>
      {uniqueLines.map(([p,q],i) => <motion.line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={phase === 1 && (i === 1 || i === 4) ? (i === 1 ? IND : AMBER) : phase === 2 && i === 3 ? GREEN : INK} strokeWidth={phase === 1 && (i === 1 || i === 4) || phase === 2 && i === 3 ? 3.4 : 2.1} opacity={phase === 1 ? (i === 1 || i === 4 || i === 0 ? 1 : .24) : phase === 2 ? (i === 3 || i === 4 || i === 0 ? 1 : .24) : 1} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i*.08}} />)}

      <text x={A.x-18} y={A.y-7} fontSize="15" fontWeight="900" fill={phase === 2 ? GREEN : INK} fontFamily={FONT}>A</text>
      <circle cx={P.x} cy={P.y} r="3.3" fill={INK}/><circle cx={Q.x} cy={Q.y} r="3.3" fill={INK}/>
      <path d={`M${L.x+10} ${L.y-3} A20 20 0 0 1 ${L.x+25} ${L.y-16}`} fill="none" stroke={AMBER} strokeWidth="3"/><text x={L.x+29} y={L.y-11} fontSize="11" fontWeight="900" fill={AMBER} fontFamily={FONT}>{tip}°</text>

      {phase === 0 && <g>
        <motion.path d={`M${P.x-17} ${P.y+1} A23 23 0 0 0 ${P.x+3} ${P.y+24}`} fill="none" stroke={IND} strokeWidth="4" initial={{pathLength:0}} animate={{pathLength:1}}/><rect x={P.x+3} y={P.y+7} width="50" height="25" rx="8" fill="#fff" stroke={IND}/><text x={P.x+28} y={P.y+24} textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{crossings[0]}°</text>
        <motion.path d={`M${Q.x-25} ${Q.y-2} A27 27 0 0 1 ${Q.x+24} ${Q.y-2}`} fill="none" stroke={TEAL} strokeWidth="4" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:.2}}/><rect x={Q.x-25} y={Q.y-46} width="52" height="25" rx="8" fill="#fff" stroke={TEAL}/><text x={Q.x+1} y={Q.y-29} textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>{crossings[1]}°</text>
      </g>}

      {phase === 1 && <g>
        <motion.line x1={L.x} y1={L.y} x2={L.x+102} y2={L.y} stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="5 4" initial={{pathLength:0}} animate={{pathLength:1}}/><text x={L.x+92} y={L.y+16} fontSize="9" fontWeight="850" fill={DIM}>horizontal guide</text>
        <path d={`M${L.x+34} ${L.y} A34 34 0 0 0 ${L.x+6} ${L.y-33}`} fill="none" stroke={IND} strokeWidth="4"/><rect x={L.x-8} y={L.y-65} width="48" height="25" rx="8" fill="#fff" stroke={IND}/><text x={L.x+16} y={L.y-48} textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{risingDirection}°</text>
        <path d={`M${L.x+39} ${L.y} A39 39 0 0 0 ${L.x+30} ${L.y-25}`} fill="none" stroke={AMBER} strokeWidth="4"/><rect x={L.x+41} y={L.y-37} width="48" height="25" rx="8" fill="#fff" stroke={AMBER}/><text x={L.x+65} y={L.y-20} textAnchor="middle" fontSize="12" fontWeight="900" fill={AMBER} fontFamily={FONT}>{middleDirection}°</text>
      </g>}

      {phase === 2 && <g>
        <motion.line x1={A.x} y1={A.y} x2={A.x+100} y2={A.y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 4" initial={{pathLength:0}} animate={{pathLength:1}}/>
        <path d={`M${A.x+37} ${A.y} A37 37 0 0 1 ${A.x+32} ${A.y+18}`} fill="none" stroke={GREEN} strokeWidth="4"/><rect x={A.x+42} y={A.y+7} width="48" height="25" rx="8" fill="#fff" stroke={GREEN}/><text x={A.x+66} y={A.y+24} textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN} fontFamily={FONT}>{target}°</text>
        <path d={`M${Q.x-21} ${Q.y-5} A24 24 0 0 1 ${Q.x+17} ${Q.y-15}`} fill="none" stroke={TEAL} strokeWidth="4"/><rect x={Q.x-14} y={Q.y-48} width="48" height="25" rx="8" fill="#fff" stroke={TEAL}/><text x={Q.x+10} y={Q.y-31} textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>{acuteSecond}°</text>
      </g>}

      <g transform="translate(316 48)"><rect width="140" height="184" rx="14" fill={phase===2?(ok?"#f0fdf4":"#fef2f2"):phase===1?"#fff7ed":"#eef2ff"} stroke={phase===2?(ok?GREEN:RED):phase===1?AMBER:IND} strokeWidth="2.2"/>
        {phase===0&&<><text x="70" y="26" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>SUPPLEMENTS</text><text x="70" y="61" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{straight}° − {crossings[0]}°</text><text x="70" y="87" textAnchor="middle" fontSize="19" fontWeight="900" fill={IND} fontFamily={FONT}>= {acuteFirst}°</text><text x="70" y="123" textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={FONT}>{straight}° − {crossings[1]}°</text><text x="70" y="149" textAnchor="middle" fontSize="19" fontWeight="900" fill={TEAL} fontFamily={FONT}>= {acuteSecond}°</text></>}
        {phase===1&&<><text x="70" y="26" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>DIRECTION AT TIP</text><text x="70" y="58" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>{risingDirection}°</text><text x="70" y="85" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK}>turn down {tip}°</text><text x="70" y="121" textAnchor="middle" fontSize="19" fontWeight="900" fill={AMBER} fontFamily={FONT}>{risingDirection}° − {tip}°</text><motion.text x="70" y="157" textAnchor="middle" fontSize="24" fontWeight="900" fill={AMBER} fontFamily={FONT} initial={{scale:.5}} animate={{scale:1}}>= {middleDirection}°</motion.text></>}
        {phase===2&&<><text x="70" y="26" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>FINAL DIRECTION</text><text x="70" y="61" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>{acuteSecond}° − {middleDirection}°</text><motion.text x="70" y="101" textAnchor="middle" fontSize="27" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT} initial={{scale:.5}} animate={{scale:1}}>= {target}°</motion.text><text x="70" y="131" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>below horizontal</text><text x="70" y="160" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={ok?GREEN:RED}>{ok?`choice ${choice} matches`:failure}</text></>}
      </g>
      <text x="158" y="278" textAnchor="middle" fontSize="9.8" fontWeight="850" fill={phase===2?GREEN:DIM}>{phase===0?"obtuse labels become the acute turns between the same lines":phase===1?"the lower tip subtracts 40° from the 80° direction":ok?"the resulting downward tilt is exactly angle A":failure}</text><SvgAnswerBadge show={final&&ok} answer={problem.answer} cx={158} y={289} width={76}/><AnimatePresence>{final&&!ok&&<motion.text x="235" y="313" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
