import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const AMBER = "#d97706";

type CoinProps = { cx: number; cy: number; value: number; faded?: boolean; delay?: number };

function Coin({ cx, cy, value, faded = false, delay = 0 }: CoinProps) {
  const r = value >= 25 ? 21 : value >= 10 ? 18 : 15;
  const fill = value >= 25 ? "#fde68a" : value >= 10 ? "#e2e8f0" : "#fef3c7";
  const stroke = value >= 25 ? AMBER : value >= 10 ? "#64748b" : "#a16207";
  return (
    <motion.g initial={{ opacity: 0, y: -18, scale: 0.6 }} animate={{ opacity: faded ? 0.25 : 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 17, delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r - 4} fill="none" stroke={stroke} strokeWidth="1" opacity="0.55" />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>{value}¢</text>
    </motion.g>
  );
}

/**
 * One target payment is packed with the largest useful coins and unpacked
 * into the smallest coins. Aligning the two rows makes the count difference
 * literal. Data: { targetCents, denominations:[small,middle,large] }.
 */
export function CoinCountExtremesScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const target = Math.round(num(data.targetCents, 0));
  const denoms = Array.isArray(data.denominations) ? data.denominations.map((v) => Math.round(num(v, 0))).sort((a, b) => a - b) : [];
  const [small, middle, large] = denoms;
  const few = [large, target - large].filter((v) => v > 0);
  const mostCount = target / small;
  const fewCount = few.length;
  const difference = mostCount - fewCount;
  const final = step >= totalSteps - 1;
  const showMost = step >= 1 || final;
  const stored = Number(problem.shortAnswer);
  const choice = problem.choices?.find((c) => Number(c.text) === difference)?.label;
  const validFew = few.every((v) => denoms.includes(v)) && few.reduce((a, b) => a + b, 0) === target;
  const consistent = Number.isInteger(mostCount) && validFew && stored === difference && choice === problem.answer;
  const xs = Array.from({ length: mostCount }, (_, i) => 54 + i * 42);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: "100%", padding: "5px 4px" }}>
      <svg viewBox="0 0 360 246" width="100%" style={{ maxWidth: 430 }}>
        <rect x="18" y="8" width="324" height="38" rx="12" fill="#eef2ff" stroke="#c7d2fe" />
        <text x="180" y="25" textAnchor="middle" fontSize="11" fontWeight="800" fill="#64748b">PAYMENT TRAY</text>
        <text x="180" y="40" textAnchor="middle" fontSize="17" fontWeight="900" fill={INDIGO} fontFamily={FONT}>{target}¢ exactly</text>

        <text x="18" y="70" fontSize="11" fontWeight="900" fill={INDIGO}>FEWEST COINS</text>
        <g>
          <Coin cx={74} cy={103} value={large} delay={0.1} />
          <Coin cx={126} cy={103} value={target - large} delay={0.3} />
          <motion.path d="M 52 132 H 148" stroke={GREEN} strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
          <text x="100" y="148" textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN} fontFamily={FONT}>{large} + {target - large} = {target}</text>
          <rect x="184" y="78" width="158" height="57" rx="10" fill="#fff7ed" stroke="#fed7aa" />
          <text x="263" y="96" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={RED}>1 COIN?</text>
          <text x="263" y="113" textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>{denoms.join("¢, ")}¢ — no {target}¢ coin</text>
          <text x="263" y="129" textAnchor="middle" fontSize="11" fontWeight="900" fill={INDIGO}>so 2 is the minimum</text>
        </g>

        <g opacity={showMost ? 1 : 0.22}>
          <text x="18" y="171" fontSize="11" fontWeight="900" fill={showMost ? INDIGO : "#94a3b8"}>MOST COINS</text>
          {xs.map((x, i) => <Coin key={i} cx={x} cy={199} value={small} delay={showMost ? i * 0.07 : 0} />)}
          <text x="180" y="229" textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN} fontFamily={FONT}>{target} ÷ {small} = {mostCount} coins</text>
          <text x="180" y="243" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#64748b">nothing smaller than {small}¢ is available, so 7 is the maximum</text>
        </g>

        <AnimatePresence>
          {final && (
            <motion.g key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x="15" y="73" width="330" height="172" rx="14" fill="#fff" stroke="#c7d2fe" />
              <text x="180" y="94" textAnchor="middle" fontSize="12" fontWeight="900" fill={INDIGO}>ALIGN THE COIN COUNTS</text>
              <text x="28" y="127" fontSize="11" fontWeight="900" fill={INK}>2</text>
              {xs.map((x, i) => i < fewCount ? <Coin key={`f${i}`} cx={x} cy={122} value={few[i]} delay={i * 0.08} /> : null)}
              <text x="28" y="174" fontSize="11" fontWeight="900" fill={INK}>7</text>
              {xs.map((x, i) => <Coin key={`m${i}`} cx={x} cy={169} value={small} faded={i < fewCount} delay={0.15 + i * 0.06} />)}
              <motion.path d={`M ${xs[fewCount] - 18} 199 H ${xs[xs.length - 1] + 18}`} stroke={GREEN} strokeWidth="3" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.65 }} />
              <text x={(xs[fewCount] + xs[xs.length - 1]) / 2} y="216" textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN}>{difference} extra coins</text>
              <text x="180" y="238" textAnchor="middle" fontSize="16" fontWeight="900" fill={consistent ? GREEN : RED} fontFamily={FONT}>{mostCount} − {fewCount} = {difference}</text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
      <motion.span key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, color: final ? "#166534" : INDIGO, textAlign: "center" }}>
        {final ? `${mostCount} coins − ${fewCount} coins = ${difference}` : step === 0 ? `${large}¢ + ${middle}¢ reaches ${target}¢ in only 2 coins` : `${target}¢ in ${small}¢ coins makes the longest payment: ${mostCount}`}
      </motion.span>
      <AnimatePresence>{final && consistent && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.45 }}
        style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 800, fontSize: 15 }}>Answer {problem.answer}</motion.div>}</AnimatePresence>
      {!consistent && final && <span style={{ color: RED, fontSize: 11, fontWeight: 800 }}>computed coin counts do not match the stored answer</span>}
    </div>
  );
}
