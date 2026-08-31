import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", AMBER = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

function modPow(base: number, exponent: number, modulus: number) {
  let result = 1 % modulus, value = ((base % modulus) + modulus) % modulus, power = exponent;
  while (power > 0) {
    if (power % 2 === 1) result = (result * value) % modulus;
    value = (value * value) % modulus;
    power = Math.floor(power / 2);
  }
  return result;
}

/** Replace a divisor-minus-one remainder by −1, pair an even number of factors, and land on the final remainder. */
export function NegativeOnePowerRemainderScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const base = Math.round(num(data.base, 0)), exponent = Math.round(num(data.exponent, 0)), divisor = Math.round(num(data.divisor, 0));
  const quotient = Math.floor(base / divisor), remainder = ((base % divisor) + divisor) % divisor;
  const nextMultiple = (quotient + 1) * divisor, shortfall = nextMultiple - base;
  const pairCount = exponent / 2;
  const result = modPow(base, exponent, divisor);
  const choice = problem.choices?.find((item) => Number(item.text) === result)?.label;
  const ok = base === 1999 && exponent === 2000 && divisor === 5 && remainder === divisor - 1 && shortfall === 1 && Number.isInteger(pairCount) && result === Number(problem.shortAnswer) && choice === problem.answer;
  const failure = remainder !== divisor - 1 ? `remainder ${remainder} is not −1 mod ${divisor}` : !Number.isInteger(pairCount) ? `exponent ${exponent} is not even` : result !== Number(problem.shortAnswer) ? `computed ${result}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(Math.max(step, 0), 1);

  const Chip = ({ x, y, text, color, delay = 0 }: { x: number; y: number; text: string; color: string; delay?: number }) => <motion.g initial={{ opacity: 0, scale: .45 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, type: "spring", stiffness: 220, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><circle cx={x} cy={y} r="16" fill="#fff" stroke={color} strokeWidth="2.3" /><text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="900" fill={color} fontFamily={FONT}>{text}</text></motion.g>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 470 305" width="100%" style={{ maxWidth: 500, minWidth: 0, display: "block" }} aria-label="Remainder four rewritten as negative one, then 2000 negative-one factors paired into positive ones">
      <text x="235" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "1999 is one step before the next multiple of 5" : phase === 1 ? "pair all 2000 copies of −1: every pair becomes +1" : "the product lands on remainder 1"}</text>

      {phase === 0 && <>
        <g transform="translate(30 54)"><rect width="180" height="116" rx="14" fill="#f8fafc" stroke="#cbd5e1" /><text x="90" y="24" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>GROUPS OF FIVE</text><text x="90" y="55" textAnchor="middle" fontSize="17" fontWeight="900" fill={INK} fontFamily={FONT}>{quotient} × {divisor} = {quotient * divisor}</text><g transform="translate(36 73)">{Array.from({ length: remainder }, (_, i) => <motion.circle key={i} cx={i * 35} cy="12" r="10" fill={IND} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * .1, type: "spring" }} />)}</g><text x="90" y="108" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>remainder {remainder}</text></g>
        <motion.path d="M220 113 H254" stroke={AMBER} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><path d="M254 113l-9-5v10z" fill={AMBER} />
        <g transform="translate(267 54)"><rect width="174" height="116" rx="14" fill="#fff7ed" stroke={AMBER} strokeWidth="2" /><text x="87" y="24" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>ONE BEFORE {nextMultiple}</text><text x="87" y="55" textAnchor="middle" fontSize="17" fontWeight="900" fill={INK} fontFamily={FONT}>{base} = {nextMultiple} − {shortfall}</text><motion.text x="87" y="88" textAnchor="middle" fontSize="20" fontWeight="900" fill={AMBER} fontFamily={FONT} initial={{ scale: .55 }} animate={{ scale: 1 }}>≡ −1 (mod {divisor})</motion.text></g>
        <g transform="translate(72 207)"><rect width="326" height="53" rx="13" fill="#eef2ff" stroke={IND} strokeWidth="2" /><text x="163" y="21" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>SAME POSITION ON THE MOD-5 CLOCK</text><text x="163" y="43" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>{base} ≡ {remainder} ≡ −1 (mod {divisor})</text></g>
      </>}

      {phase === 1 && <>
        <text x="235" y="48" textAnchor="middle" fontSize="19" fontWeight="900" fill={IND} fontFamily={FONT}>(−1)^{exponent}</text>
        {Array.from({ length: 4 }, (_, i) => { const x = 48 + i * 106; return <motion.g key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .1 }}><rect x={x - 34} y="68" width="90" height="82" rx="12" fill="#f8fafc" stroke="#cbd5e1" /><Chip x={x - 5} y={96} text="−1" color={IND} delay={.15 + i * .1} /><text x={x + 21} y="101" fontSize="14" fontWeight="900" fill={DIM}>×</text><Chip x={x + 47} y={96} text="−1" color={TEAL} delay={.22 + i * .1} /><motion.text x={x + 21} y="138" textAnchor="middle" fontSize="15" fontWeight="900" fill={GREEN} fontFamily={FONT} initial={{ scale: .5 }} animate={{ scale: 1 }} transition={{ delay: .35 + i * .1 }}>= +1</motion.text></motion.g>; })}
        <text x="235" y="176" textAnchor="middle" fontSize="18" fontWeight="900" fill={DIM}>⋯</text>
        <g transform="translate(65 195)"><rect width="340" height="66" rx="14" fill="#ecfdf5" stroke={GREEN} strokeWidth="2" /><text x="170" y="24" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>{exponent} FACTORS ÷ 2 PER PAIR = {pairCount} PAIRS</text><text x="170" y="50" textAnchor="middle" fontSize="18" fontWeight="900" fill={GREEN} fontFamily={FONT}>[(−1)²]^{pairCount} = 1^{pairCount} = 1</text></g>
      </>}

      {phase === 2 && <>
        <text x="235" y="48" textAnchor="middle" fontSize="19" fontWeight="900" fill={INK} fontFamily={FONT}>{base}^{exponent} mod {divisor}</text>
        <g transform="translate(43 73)">{Array.from({ length: divisor }, (_, i) => { const active = i === result, x = i * 96; return <motion.g key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .1 }}><circle cx={x} cy="28" r="25" fill={active ? "#dcfce7" : "#f8fafc"} stroke={active ? GREEN : "#cbd5e1"} strokeWidth={active ? 3 : 1.5} /><text x={x} y="35" textAnchor="middle" fontSize="19" fontWeight="900" fill={active ? GREEN : DIM} fontFamily={FONT}>{i}</text>{active && <motion.path d={`M${x - 13} 62h26`} stroke={GREEN} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}</motion.g>; })}</g>
        <motion.path d="M139 156 C163 181 195 188 220 190" fill="none" stroke={GREEN} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><path d="M220 190l-9-7-2 11z" fill={GREEN} />
        <g transform="translate(93 185)"><rect width="284" height="70" rx="15" fill={ok ? "#f0fdf4" : "#fef2f2"} stroke={ok ? GREEN : RED} strokeWidth="2.5" /><text x="142" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>FINAL REMAINDER</text><motion.text x="142" y="56" textAnchor="middle" fontSize="26" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT} initial={{ scale: .5 }} animate={{ scale: 1 }}>{result}</motion.text></g>
        <text x="188" y="280" textAnchor="middle" fontSize="9.7" fontWeight="850" fill={ok ? GREEN : RED}>{ok ? `modular power and choice ${choice} agree` : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={419} y={267} width={76} />
      </>}
      <AnimatePresence>{final && !ok && <motion.text x="235" y="302" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
