import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", GREEN = "#16a34a", GOLD = "#d97706", RED = "#dc2626", DIM = "#94a3b8";
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);
const lcm = (values: number[]) => values.reduce((a, b) => Math.abs(a * b) / gcd(a, b), 1);
const list = (value: unknown) => Array.isArray(value) ? value.map((v) => Math.round(num(v, 0))) : [];

function Coin({ x, y, helper = false, delay = 0 }: { x: number; y: number; helper?: boolean; delay?: number }) {
  return <motion.g initial={{ opacity: 0, scale: 0.3, y: helper ? -16 : 0 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
    <circle cx={x} cy={y} r="8" fill={helper ? "#eef2ff" : "#fef3c7"} stroke={helper ? IND : GOLD} strokeWidth="1.6" />
    <circle cx={x} cy={y} r="4.5" fill="none" stroke={helper ? IND : GOLD} strokeWidth="0.8" />
  </motion.g>;
}

/** Two remainder rows share one shortfall; fill them, meet at the LCM, then remove the helpers. Data: { divisors, remainders, finalDivisor }. */
export function SharedShortfallCoinScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const divisors = list(data.divisors), remainders = list(data.remainders);
  const finalDivisor = Math.round(num(data.finalDivisor, 1));
  const shortfalls = divisors.map((d, i) => d - remainders[i]);
  const shift = shortfalls[0] ?? 0;
  const period = lcm(divisors);
  const count = period - shift;
  const quotient = Math.floor(count / finalDivisor), remainder = count % finalDivisor;
  const choice = problem.choices?.find((c) => Number(c.text) === remainder)?.label;
  const aligned = divisors.length === 2 && remainders.length === 2 && shortfalls.every((v) => v === shift);
  const smallest = Array.from({ length: Math.max(0, count - 1) }, (_, i) => i + 1).every((n) => !divisors.every((d, j) => n % d === remainders[j]));
  const ok = aligned && smallest && count > 0 && period % divisors[0] === 0 && period % divisors[1] === 0
    && String(remainder) === String(problem.shortAnswer) && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "5px 3px" }}>
    <svg viewBox="0 0 420 310" width="100%" style={{ maxWidth: 450 }}>
      <text x="210" y="18" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>
        {phase === 0 ? "both leftover rows are two coins short" : phase === 1 ? "the first shared full-group stop is 30" : `deal all ${count} coins into groups of ${finalDivisor}`}
      </text>

      {phase === 0 && <>
        {divisors.map((d, row) => {
          const y = 74 + row * 93, x0 = 65;
          return <g key={d}>
            <text x="10" y={y + 5} fontSize="13" fontWeight="900" fill={row ? TEAL : IND} fontFamily={FONT}>÷  {d}</text>
            <rect x="53" y={y - 23} width={d * 39 + 12} height="48" rx="10" fill="#f8fafc" stroke={row ? TEAL : IND} strokeWidth="1.5" />
            {Array.from({ length: d }, (_, i) => i < remainders[row]
              ? <Coin key={i} x={x0 + i * 39} y={y} delay={i * 0.08} />
              : <Coin key={i} x={x0 + i * 39} y={y} helper delay={0.55 + (i - remainders[row]) * 0.15} />)}
            <text x={53 + d * 39 + 21} y={y + 5} fontSize="10" fontWeight="850" fill={row ? TEAL : IND} fontFamily={FONT}>{remainders[row]} left</text>
            <motion.text x={x0 + (d - shift / 2 - 0.5) * 39} y={y - 34} textAnchor="middle" fontSize="10" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>+{shift}</motion.text>
          </g>;
        })}
        <motion.text x="210" y="269" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          n + {shift} is divisible by {divisors.join(" and ")}
        </motion.text>
      </>}

      {phase === 1 && <>
        {divisors.map((d, row) => {
          const y = 76 + row * 67, maxK = period / d;
          return <g key={d}>
            <text x="18" y={y + 4} fontSize="10.5" fontWeight="900" fill={row ? TEAL : IND} fontFamily={FONT}>multiples of {d}</text>
            <line x1="128" y1={y} x2="375" y2={y} stroke="#cbd5e1" strokeWidth="2" />
            {Array.from({ length: maxK + 1 }, (_, k) => <motion.circle key={k} cx={128 + (247 * k) / maxK} cy={y} r={k === maxK ? 7 : 3.5} fill={k === maxK ? GREEN : row ? TEAL : IND} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: k * 0.05 + row * 0.12 }} />)}
            <text x="385" y={y + 4} fontSize="11" fontWeight="900" fill={GREEN} fontFamily={FONT}>{period}</text>
          </g>;
        })}
        <motion.path d="M 375 56 V 164" stroke={GREEN} strokeWidth="2" strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
        <text x="210" y="194" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>LCM({divisors.join(", ")}) = {period}</text>
        <motion.g initial={{ x: 28, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", delay: 0.75 }}>
          <path d="M 260 218 H 183" stroke={GOLD} strokeWidth="3" />
          <path d="M 183 218 l 9 -6 v 12 z" fill={GOLD} />
          <text x="222" y="210" textAnchor="middle" fontSize="10" fontWeight="900" fill={GOLD} fontFamily={FONT}>remove {shift}</text>
        </motion.g>
        <rect x="143" y="231" width="134" height="38" rx="11" fill="#fef3c7" stroke={GOLD} strokeWidth="1.8" />
        <text x="210" y="256" textAnchor="middle" fontSize="20" fontWeight="950" fill={GOLD} fontFamily={FONT}>{period} − {shift} = {count}</text>
      </>}

      {phase === 2 && <>
        <g transform="translate(40 47)">
          {Array.from({ length: count }, (_, i) => {
            const row = Math.floor(i / finalDivisor), col = i % finalDivisor;
            return <Coin key={i} x={18 + col * 47} y={18 + row * 39} delay={i * 0.025} />;
          })}
        </g>
        <motion.path d="M 47 225 H 373" stroke={GREEN} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.65 }} />
        <text x="210" y="246" textAnchor="middle" fontSize="18" fontWeight="950" fill={ok ? GREEN : RED} fontFamily={FONT}>{count} = {quotient} × {finalDivisor} + {remainder}</text>
        <text x="210" y="266" textAnchor="middle" fontSize="10" fontWeight="850" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? `${quotient} full rows, no coins left ✓` : "minimum/remainder self-check failed"}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer == null ? null : String(problem.answer)} cx={210} y={278} width={86} />
      </>}
    </svg>
  </div>;
}
