import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", ORANGE = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";
const COLORS = [IND, TEAL, ORANGE];

function factorize(value: number) {
  const factors: number[] = [];
  let remaining = value;
  for (let p = 2; p * p <= remaining; p += 1) while (remaining % p === 0) { factors.push(p); remaining /= p; }
  if (remaining > 1) factors.push(remaining);
  return factors;
}

/** Divide a number into prime tokens, funnel duplicates into bins, then sum one token per bin. */
export function DistinctPrimeTokenSumScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const number = Math.round(num(data.number, 0));
  const factors = factorize(number);
  const primes = [...new Set(factors)];
  const exponents = primes.map((prime) => factors.filter((factor) => factor === prime).length);
  const factorText = primes.map((prime, i) => exponents[i] === 1 ? `${prime}` : `${prime}^${exponents[i]}`).join(" × ");
  const reconstructed = factors.reduce((product, factor) => product * factor, 1);
  const sum = primes.reduce((total, prime) => total + prime, 0);
  const choice = (problem.choices ?? []).find((item) => Number(item.text) === sum)?.label;
  const stored = Number(problem.shortAnswer);
  const ok = reconstructed === number && primes.every((prime) => factorize(prime).length === 1) && sum === stored && choice === problem.answer;
  const failure = reconstructed !== number ? `factors multiply to ${reconstructed}, not ${number}` : sum !== stored ? `computed ${sum}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const chain = [number];
  factors.forEach((factor) => chain.push(chain[chain.length - 1] / factor));

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 295" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "divide primes out of 2016 until only 1 remains" : phase === 1 ? "funnel repeated tokens together and keep each prime once" : "send one token from each distinct-prime bin into the sum"}</text>

      {phase === 0 && <><g transform="translate(95 38)"><line x1="72" y1="4" x2="72" y2={factors.length * 27 + 8} stroke="#cbd5e1" strokeWidth="1.5" />{chain.map((value, i) => <motion.text key={i} x="88" y={i * 27 + 9} fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.13 }}>{value}</motion.text>)}{factors.map((factor, i) => { const pi = primes.indexOf(factor); return <motion.g key={i} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.07 + i * 0.13 }}><text x="50" y={i * 27 + 21} textAnchor="end" fontSize="11" fontWeight="900" fill={COLORS[pi]} fontFamily={FONT}>÷ {factor}</text><circle cx="62" cy={i * 27 + 17} r="5" fill={COLORS[pi]} /></motion.g>; })}</g><g transform="translate(265 55)"><text x="80" y="0" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>prime tokens collected</text>{factors.map((factor, i) => { const pi = primes.indexOf(factor); return <motion.g key={i} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><circle cx={(i % 4) * 39 + 22} cy={Math.floor(i / 4) * 40 + 34} r="14" fill={`${COLORS[pi]}18`} stroke={COLORS[pi]} strokeWidth="2" /><text x={(i % 4) * 39 + 22} y={Math.floor(i / 4) * 40 + 39} textAnchor="middle" fontSize="13" fontWeight="900" fill={COLORS[pi]} fontFamily={FONT}>{factor}</text></motion.g>; })}<text x="80" y="132" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{number} = {factorText}</text></g></>}

      {phase >= 1 && <g transform="translate(32 55)">{primes.map((prime, i) => <motion.g key={prime} initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.18 }}><rect x={i * 137} y="0" width="116" height="142" rx="13" fill={`${COLORS[i]}0f`} stroke={COLORS[i]} strokeWidth="1.8" /><text x={i * 137 + 58} y="24" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>prime {prime} bin</text>{Array.from({ length: exponents[i] }, (_, j) => <motion.g key={j} animate={phase === 1 && j > 0 ? { opacity: 0.28, y: 5 } : { opacity: 1, y: 0 }}><circle cx={i * 137 + 58 + (j - (exponents[i] - 1) / 2) * 17} cy="62" r="12" fill={j === 0 ? COLORS[i] : "#fff"} stroke={COLORS[i]} strokeWidth="1.7" /><text x={i * 137 + 58 + (j - (exponents[i] - 1) / 2) * 17} y="67" textAnchor="middle" fontSize="12" fontWeight="900" fill={j === 0 ? "#fff" : COLORS[i]} fontFamily={FONT}>{prime}</text>{phase === 1 && j > 0 && <line x1={i * 137 + 48 + (j - (exponents[i] - 1) / 2) * 17} y1="62" x2={i * 137 + 68 + (j - (exponents[i] - 1) / 2) * 17} y2="62" stroke={RED} strokeWidth="1.7" />}</motion.g>)}<text x={i * 137 + 58} y="98" textAnchor="middle" fontSize="11" fontWeight="900" fill={COLORS[i]} fontFamily={FONT}>{exponents[i]} copies</text><motion.rect x={i * 137 + 31} y="110" width="54" height="24" rx="8" fill="#dcfce7" stroke={GREEN} initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x={i * 137 + 58} y="127" textAnchor="middle" fontSize="10" fontWeight="900" fill={GREEN}>keep 1</text></motion.g>)}</g>}

      {phase === 1 && <text x="230" y="233" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>distinct prime divisors: {primes.join(", ")}</text>}
      {phase === 2 && <><g transform="translate(114 224)">{primes.map((prime, i) => <motion.g key={prime} initial={{ x: i * 137 - 82, y: -88, opacity: 0 }} animate={{ x: i * 66, y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 110, damping: 15, delay: i * 0.15 }}><circle cx="16" cy="16" r="15" fill={COLORS[i]} /><text x="16" y="21" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff" fontFamily={FONT}>{prime}</text>{i < primes.length - 1 && <text x="48" y="21" textAnchor="middle" fontSize="18" fontWeight="900" fill={INK}>+</text>}</motion.g>)}</g><text x="230" y="276" textAnchor="middle" fontSize="17" fontWeight="900" fill={INK} fontFamily={FONT}>{primes.join(" + ")} = <tspan fill={GREEN}>{sum}</tspan></text><SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={263} width={78} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="292" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
