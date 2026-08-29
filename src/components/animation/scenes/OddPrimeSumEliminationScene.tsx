import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", AMBER = "#d97706", GREEN = "#16a34a", RED = "#dc2626";

function isPrime(n: number) {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let d = 2; d * d <= n; d += 1) if (n % d === 0) return false;
  return true;
}

function PrimeToken({ x, y, text, color }: { x:number; y:number; text:string; color:string }) {
  return <motion.g initial={{opacity:0,scale:.45}} animate={{opacity:1,scale:1}} transition={{type:"spring",stiffness:220,damping:15}} style={{transformBox:"fill-box",transformOrigin:"center"}}>
    <circle cx={x} cy={y} r="29" fill={`${color}18`} stroke={color} strokeWidth="2.5"/><circle cx={x} cy={y} r="21" fill="#fff" stroke={color}/>
    <text x={x} y={y+5} textAnchor="middle" fontFamily={FONT} fontSize={text.length>3?11:17} fontWeight="900" fill={color}>{text}</text>
  </motion.g>;
}

/** An odd target permits only the even prime 2 as one summand; its forced
 * partner is then split by a supplied real divisor to eliminate the sole case.
 * Data: { target, evenPrime, witnessDivisor }.
 */
export function OddPrimeSumEliminationScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const target = Math.round(num(data.target, 0));
  const evenPrime = Math.round(num(data.evenPrime, 2));
  const divisor = Math.round(num(data.witnessDivisor, 3));
  const partner = target - evenPrime, quotient = partner / divisor;
  const ways = target % 2 === 1 && isPrime(partner) ? 1 : 0;
  const choice = problem.choices?.find(c => Number(c.text) === ways)?.label;
  const ok = evenPrime === 2 && isPrime(evenPrime) && partner % divisor === 0 && divisor > 1 && quotient > 1 && ways === Number(problem.shortAnswer) && choice === problem.answer;
  const final = step >= totalSteps - 1;

  return <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:7,padding:"6px 3px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 440 260" width="100%" style={{maxWidth:470,display:"block"}} aria-label="Parity forces a two, then the remaining summand is shown composite">
      <rect x="139" y="7" width="162" height="31" rx="16" fill="#eef2ff" stroke="#c7d2fe"/><text x="220" y="28" textAnchor="middle" fontFamily={FONT} fontSize="15" fontWeight="900" fill={IND}>prime + prime = {target}</text>
      {!final ? <g>
        <text x="108" y="63" textAnchor="middle" fontSize="10" fontWeight="900" fill="#64748b">TWO ODD PRIMES</text>
        <PrimeToken x={66} y={102} text="odd" color={IND}/><text x="108" y="109" textAnchor="middle" fontSize="22" fontWeight="900" fill={INK}>+</text><PrimeToken x={150} y={102} text="odd" color={IND}/>
        <motion.line x1="38" y1="140" x2="178" y2="140" stroke={RED} strokeWidth="3" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:.25}}/><text x="108" y="158" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="900" fill={RED}>odd + odd = even ✕</text>
        <text x="332" y="63" textAnchor="middle" fontSize="10" fontWeight="900" fill={GREEN}>ODD TARGET</text>
        <PrimeToken x={290} y={102} text="2" color={AMBER}/><text x="332" y="109" textAnchor="middle" fontSize="22" fontWeight="900" fill={INK}>+</text><PrimeToken x={374} y={102} text="odd" color={GREEN}/>
        <text x="332" y="158" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="900" fill={GREEN}>even + odd = odd ✓</text>
        <motion.path d="M220 177 V198" stroke={AMBER} strokeWidth="2.5" markerEnd="url(#arrow)" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:.45}}/>
        <rect x="110" y="207" width="220" height="38" rx="12" fill="#fef3c7" stroke="#fbbf24"/><text x="220" y="231" textAnchor="middle" fontFamily={FONT} fontSize="16" fontWeight="900" fill={AMBER}>{target} − 2 = {partner}</text>
        <defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={AMBER}/></marker></defs>
      </g> : <g>
        <text x="220" y="62" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#64748b">TEST THE ONLY POSSIBLE PARTNER</text>
        <PrimeToken x={78} y={113} text="2" color={AMBER}/><text x="125" y="120" textAnchor="middle" fontSize="22" fontWeight="900" fill={INK}>+</text><PrimeToken x={180} y={113} text={String(partner)} color={RED}/>
        <motion.path d="M180 147 C204 147 226 145 249 145" fill="none" stroke={RED} strokeWidth="2.5" markerEnd="url(#badArrow)" initial={{pathLength:0}} animate={{pathLength:1}}/>
        <rect x="252" y="77" width="160" height="105" rx="14" fill="#fef2f2" stroke={RED} strokeWidth="2"/>
        <text x="332" y="105" textAnchor="middle" fontFamily={FONT} fontSize="16" fontWeight="900" fill={INK}>{partner} ÷ {divisor} = {quotient}</text>
        <g>{Array.from({length:3}).map((_,i)=><motion.rect key={i} x={275+i*39} y="121" width="31" height="22" rx="5" fill="#fecaca" stroke={RED} initial={{y:-12,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:.15+i*.12}}/>)}<text x="332" y="158" textAnchor="middle" fontFamily={FONT} fontSize="10" fontWeight="900" fill={RED}>{divisor} equal groups</text></g>
        <text x="332" y="176" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={RED}>composite — candidate breaks</text>
        <motion.text x="220" y="215" textAnchor="middle" fontFamily={FONT} fontSize="24" fontWeight="900" fill={ok?GREEN:RED} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}}>number of ways = {ways}</motion.text>
        <defs><marker id="badArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={RED}/></marker></defs>
        <AnimatePresence>{ok && <motion.g initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.55,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="174" y="228" width="92" height="27" rx="14" fill={GREEN}/><text x="220" y="246" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">Answer {problem.answer}</text></motion.g>}</AnimatePresence>
      </g>}
    </svg>
    <motion.span key={final?1:0} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(ok?"#166534":RED):IND,background:final?(ok?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center"}}>{!final?"an odd prime sum must include the only even prime, 2":ok?`${partner} = ${divisor} × ${quotient}, so the sole candidate fails`:`parity, divisor, or stored-answer check failed`}</motion.span>
  </div>;
}
