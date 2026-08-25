import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", ORANGE = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

const vp = (value: number, prime: number) => {
  let n = Math.round(value), count = 0;
  while (n > 0 && n % prime === 0) { count += 1; n /= prime; }
  return count;
};
const vpFactorialTerms = (n: number, prime: number) => {
  const out: number[] = [];
  for (let power = prime; power <= n; power *= prime) out.push(Math.floor(n / power));
  return out;
};

/** Pull out a common factorial, then collect every factor-of-five token in a ledger. */
export function FactorialFiveLedgerScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const fs = (Array.isArray(data.factorials) ? data.factorials : []).map((v) => Math.round(num(v, 0))).sort((a, b) => a - b);
  const prime = Math.round(num(data.prime, 5));
  const base = fs[0] ?? 0;
  const ratio = (n: number) => Array.from({ length: Math.max(0, n - base) }, (_, i) => base + i + 1).reduce((a, b) => a * b, 1);
  const coefficients = fs.map(ratio);
  const bracket = coefficients.reduce((a, b) => a + b, 0);
  const factTerms = vpFactorialTerms(base, prime);
  const factFives = factTerms.reduce((a, b) => a + b, 0);
  const extra = vp(bracket, prime);
  const answer = factFives + extra;
  const stored = Number(problem.shortAnswer);
  const choice = (problem.choices ?? []).find((c) => Number(c.text) === answer)?.label;
  const ok = fs.length === 3 && coefficients[0] === 1 && bracket === 10000 && factTerms.length === 2 && answer === stored && choice === problem.answer;
  const failure = bracket !== 10000 ? `factored bracket is ${bracket}, expected 10000` : factTerms.length !== 2 ? `${base}! needs ${factTerms.length} floor terms` : `computed ${answer}, stored ${problem.shortAnswer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 4 : Math.min(step, 3);
  const multiples = Array.from({ length: factTerms[0] ?? 0 }, (_, i) => (i + 1) * prime);
  const bonus = multiples.filter((v) => v % (prime * prime) === 0);
  const tokenX = (i: number) => 35 + (i % 10) * 32;
  const tokenY = (i: number) => 92 + Math.floor(i / 10) * 49;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 285" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? `pull the common ${base}! out of all three terms` : phase === 1 ? "merge the bracket, then expose its four factors of 5" : phase === 2 ? `one 5 comes from every multiple of ${prime} in ${base}!` : phase === 3 ? `multiples of ${prime * prime} each hide one extra 5` : "combine the factorial ledger with the bracket's four 5s"}</text>

      {phase === 0 && <><g transform="translate(30 49)">{fs.map((n, i) => <motion.g key={n} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.18 }}><rect x={i * 135} y="0" width="105" height="45" rx="10" fill="#eef2ff" stroke={IND} strokeWidth="2" /><text x={i * 135 + 52.5} y="28" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>{n}!</text></motion.g>)}<text x="187" y="78" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK}>↓ factor out {base}! ↓</text><rect x="16" y="97" width="342" height="49" rx="12" fill="#f8fafc" stroke="#cbd5e1" /><text x="187" y="127" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>{base}! ({coefficients[0]} + {coefficients[1]} + {fs[2]}·{fs[1]})</text><text x="187" y="171" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{base}! (1 + 99 + 9900)</text></g></>}

      {phase === 1 && <><motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><text x="230" y="65" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>{coefficients.join(" + ")} = {bracket}</text><text x="230" y="94" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>{bracket} = 10⁴ = 2⁴ · 5⁴</text></motion.g><text x="230" y="126" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>four green factor tokens come from the bracket</text>{Array.from({ length: extra }).map((_, i) => <motion.g key={i} initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 180, damping: 15, delay: 0.3 + i * 0.13 }}><circle cx={170 + i * 40} cy="168" r="16" fill="#dcfce7" stroke={GREEN} strokeWidth="2" /><text x={170 + i * 40} y="174" textAnchor="middle" fontSize="15" fontWeight="900" fill={GREEN} fontFamily={FONT}>5</text></motion.g>)}<text x="230" y="213" textAnchor="middle" fontSize="15" fontWeight="900" fill={GREEN} fontFamily={FONT}>v₅({bracket}) = {extra}</text></>}

      {(phase === 2 || phase === 3) && <>{multiples.map((value, i) => { const isBonus = phase === 3 && bonus.includes(value); return <motion.g key={value} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.025 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><circle cx={tokenX(i)} cy={tokenY(i)} r="14" fill={isBonus ? "#ffedd5" : "#eef2ff"} stroke={isBonus ? ORANGE : IND} strokeWidth="2" /><text x={tokenX(i)} y={tokenY(i) + 4} textAnchor="middle" fontSize="9.5" fontWeight="900" fill={isBonus ? ORANGE : IND} fontFamily={FONT}>{value}</text>{isBonus && <><circle cx={tokenX(i) + 12} cy={tokenY(i) - 12} r="7" fill={ORANGE} /><text x={tokenX(i) + 12} y={tokenY(i) - 9} textAnchor="middle" fontSize="8" fontWeight="900" fill="#fff">+5</text></>}</motion.g>;})}<text x="230" y="206" textAnchor="middle" fontSize="13" fontWeight="900" fill={phase === 3 ? ORANGE : IND} fontFamily={FONT}>{phase === 2 ? `⌊${base}/${prime}⌋ = ${factTerms[0]} first factors of 5` : `${bonus.join(", ")} each contribute a second 5`}</text>{phase === 3 && <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><rect x="148" y="222" width="164" height="36" rx="10" fill="#fff7ed" stroke="#fed7aa" /><text x="230" y="246" textAnchor="middle" fontSize="16" fontWeight="900" fill={ORANGE} fontFamily={FONT}>{factTerms[0]} + {factTerms[1]} = {factFives}</text></motion.g>}</>}

      {phase === 4 && <><g transform="translate(34 54)"><text x="92" y="15" textAnchor="middle" fontSize="11" fontWeight="850" fill={IND}>{base}! ledger</text>{Array.from({ length: factFives }).map((_, i) => <motion.circle key={i} cx={12 + (i % 11) * 16} cy={38 + Math.floor(i / 11) * 18} r="6" fill={IND} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.018 }} />)}<text x="92" y="92" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>{factFives} fives</text><text x="197" y="57" textAnchor="middle" fontSize="24" fontWeight="900" fill={DIM}>+</text><text x="310" y="15" textAnchor="middle" fontSize="11" fontWeight="850" fill={GREEN}>bracket ledger</text>{Array.from({ length: extra }).map((_, i) => <circle key={i} cx={280 + i * 20} cy="47" r="8" fill={GREEN} />)}<text x="310" y="92" textAnchor="middle" fontSize="16" fontWeight="900" fill={GREEN} fontFamily={FONT}>{extra} fives</text></g><motion.rect x="157" y="172" width="146" height="47" rx="13" fill="#dcfce7" stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="230" y="202" textAnchor="middle" fontSize="20" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{factFives} + {extra} = {answer}</text><text x="190" y="252" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? "bracket, valuation, total, and choice verified" : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={405} y={237} width={78} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="276" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
