import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", INDIGO = "#4338ca", AMBER = "#d97706", GREEN = "#16a34a", RED = "#dc2626";

function isPrime(n: number) {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let d = 2; d * d <= n; d += 1) if (n % d === 0) return false;
  return true;
}

function Token({ cx, cy, value, color, delay = 0 }: { cx: number; cy: number; value: string | number; color: string; delay?: number }) {
  return <motion.g initial={{ opacity: 0, scale: 0.45 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 230, damping: 15, delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
    <circle cx={cx} cy={cy} r="27" fill={`${color}18`} stroke={color} strokeWidth="2.5" />
    <circle cx={cx} cy={cy} r="20" fill="#fff" stroke={color} strokeWidth="1" />
    <text x={cx} y={cy + 6} textAnchor="middle" fontSize="18" fontWeight="900" fill={color} fontFamily={FONT}>{value}</text>
  </motion.g>;
}

/** An odd target sum forces the unique even prime 2; the remainder is its prime partner. Data: { targetSum }. */
export function OddPrimePairScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const target = Math.round(num(sceneData(problem).targetSum, 0));
  const evenPrime = 2;
  const partner = target - evenPrime;
  const product = evenPrime * partner;
  const final = step >= totalSteps - 1;
  const showPartner = step >= 1 || final;
  const divisors = [2, 3, 5, 7].filter((d) => d * d <= partner);
  const choice = problem.choices?.find((c) => Number(c.text) === product)?.label;
  const stored = Number(problem.shortAnswer);
  const consistent = target % 2 === 1 && isPrime(partner) && product === stored && choice === problem.answer;

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: "100%", padding: "5px 4px" }}>
    <svg viewBox="0 0 360 240" width="100%" style={{ maxWidth: 430 }}>
      <rect x="124" y="8" width="112" height="32" rx="16" fill="#eef2ff" stroke="#c7d2fe" />
      <text x="180" y="29" textAnchor="middle" fontSize="16" fontWeight="900" fill={INDIGO} fontFamily={FONT}>prime + prime = {target}</text>

      {step === 0 && !final && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x="93" y="63" textAnchor="middle" fontSize="10" fontWeight="900" fill="#64748b">TRY TWO ODD PRIMES</text>
        <Token cx={54} cy={98} value="odd" color={INDIGO} />
        <text x="93" y="104" textAnchor="middle" fontSize="20" fontWeight="900" fill={INK}>+</text>
        <Token cx={132} cy={98} value="odd" color={INDIGO} delay={0.12} />
        <motion.path d="M 36 135 H 150" stroke={RED} strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 }} />
        <text x="93" y="154" textAnchor="middle" fontSize="12" fontWeight="900" fill={RED} fontFamily={FONT}>odd + odd = even</text>

        <motion.path d="M 178 98 H 211" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#primeArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
        <text x="272" y="63" textAnchor="middle" fontSize="10" fontWeight="900" fill={GREEN}>ODD TARGET NEEDS 2</text>
        <Token cx={233} cy={98} value={evenPrime} color={AMBER} delay={0.55} />
        <text x="272" y="104" textAnchor="middle" fontSize="20" fontWeight="900" fill={INK}>+</text>
        <Token cx={311} cy={98} value="odd" color={GREEN} delay={0.68} />
        <text x="272" y="144" textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN}>even + odd = odd ✓</text>
        <text x="180" y="190" textAnchor="middle" fontSize="13" fontWeight="900" fill={AMBER}>2 is the only even prime</text>
        <rect x="108" y="202" width="144" height="26" rx="9" fill="#fef3c7" stroke="#fbbf24" />
        <text x="180" y="220" textAnchor="middle" fontSize="13" fontWeight="900" fill={AMBER} fontFamily={FONT}>one prime is 2</text>
        <defs><marker id="primeArrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6z" fill="#94a3b8" /></marker></defs>
      </motion.g>}

      {showPartner && !final && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x="180" y="66" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748b">REMOVE THE FORCED 2 FROM THE SUM</text>
        <rect x="28" y="82" width="304" height="47" rx="10" fill="#ecfdf5" stroke={GREEN} strokeWidth="2" />
        <motion.rect x="28" y="82" width={304 * evenPrime / target} height="47" rx="10" fill="#fef3c7" stroke={AMBER} strokeWidth="2" initial={{ width: 0 }} animate={{ width: 304 * evenPrime / target }} />
        <text x="43" y="111" textAnchor="middle" fontSize="12" fontWeight="900" fill={AMBER} fontFamily={FONT}>{evenPrime}</text>
        <text x="184" y="111" textAnchor="middle" fontSize="17" fontWeight="900" fill={GREEN} fontFamily={FONT}>{target} − {evenPrime} = {partner}</text>
        <Token cx={110} cy={176} value={evenPrime} color={AMBER} delay={0.2} />
        <text x="180" y="182" textAnchor="middle" fontSize="22" fontWeight="900" fill={INK}>+</text>
        <Token cx={250} cy={176} value={partner} color={GREEN} delay={0.35} />
        <text x="250" y="218" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={GREEN} fontFamily={FONT}>not ÷ {divisors.join(", ")} → prime</text>
      </motion.g>}

      {final && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x="180" y="67" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748b">THE PRIME PAIR IS FIXED</text>
        <Token cx={89} cy={116} value={evenPrime} color={AMBER} />
        <motion.text x="180" y="125" textAnchor="middle" fontSize="30" fontWeight="900" fill={INDIGO} initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 180, damping: 14 }}>×</motion.text>
        <Token cx={271} cy={116} value={partner} color={GREEN} delay={0.12} />
        <motion.path d="M 64 158 Q 180 194 296 158" fill="none" stroke={INDIGO} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 }} />
        <text x="180" y="190" textAnchor="middle" fontSize="22" fontWeight="900" fill={consistent ? GREEN : RED} fontFamily={FONT}>{evenPrime} × {partner} = {product}</text>
        <text x="180" y="214" textAnchor="middle" fontSize="11" fontWeight="800" fill="#64748b" fontFamily={FONT}>check: {evenPrime} + {partner} = {target}</text>
      </motion.g>}
    </svg>
    <motion.span key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, color: final ? "#166534" : INDIGO, textAlign: "center" }}>
      {final ? `${evenPrime} · ${partner} = ${product}` : step === 0 ? `an odd prime sum must include 2` : `the other prime is ${target} − 2 = ${partner}`}
    </motion.span>
    <AnimatePresence>{final && consistent && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }} style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 800, fontSize: 15 }}>Answer {problem.answer}</motion.div>}</AnimatePresence>
    {final && !consistent && <span style={{ color: RED, fontSize: 11, fontWeight: 800 }}>prime pair or stored answer check failed</span>}
  </div>;
}
