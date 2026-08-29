import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", INDIGO = "#4338ca", TEAL = "#0d9488", GOLD = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Split powers into 2/5 tokens, zip them into tens, then count the resulting digit slots. Data: { leftBase, leftExponent, rightBase, rightExponent }. */
export function PowerTenPairingScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const leftBase = num(data.leftBase, 0), leftExponent = num(data.leftExponent, 0);
  const rightBase = num(data.rightBase, 0), rightExponent = num(data.rightExponent, 0);
  let twosPerLeft = 0, power = 1;
  while (power < leftBase && twosPerLeft <= 8) { power *= 2; twosPerLeft += 1; }
  const twoCount = power === leftBase ? twosPerLeft * leftExponent : 0;
  const pairCount = Math.min(twoCount, rightExponent);
  const valueText = `1${"0".repeat(pairCount)}`;
  const digits = valueText.length;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const choice = problem.choices?.find((c) => Number(c.text) === digits)?.label;
  const ok = twoCount === rightExponent && rightBase === 5 && Number(problem.shortAnswer) === digits && choice === problem.answer;
  const fail = `formed ${pairCount} tens → ${digits} digits; stored ${problem.shortAnswer ?? "missing"}`;

  const Chip = ({ x, y, value, color, delay = 0 }: { x: number; y: number; value: number; color: string; delay?: number }) => <motion.g initial={{ opacity: 0, scale: .4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
    <circle cx={x} cy={y} r="13" fill="#fff" stroke={color} strokeWidth="2.2" />
    <text x={x} y={y+5} textAnchor="middle" fontSize="13" fontWeight="950" fill={color} fontFamily={FONT}>{value}</text>
  </motion.g>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 310" width="100%" style={{ maxWidth: 490, display: "block" }}>
      <text x="230" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
        {phase === 0 ? "open each 4 into two 2-tokens" : phase === 1 ? "zip every 2 with a 5 to make a 10" : "ten 10s multiply into a 1 followed by ten zeros"}
      </text>

      {phase === 0 && <>
        <text x="230" y="48" textAnchor="middle" fontSize="20" fontWeight="950" fill={INK} fontFamily={FONT}>{leftBase}^{leftExponent} · {rightBase}^{rightExponent}</text>
        {Array.from({ length: leftExponent }, (_, i) => {
          const x = 44 + i * 73;
          return <motion.g key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .08 }}>
            <rect x={x} y="70" width="54" height="43" rx="10" fill="#eef2ff" stroke={INDIGO} strokeWidth="2" />
            <text x={x+27} y="97" textAnchor="middle" fontSize="18" fontWeight="950" fill={INDIGO} fontFamily={FONT}>4</text>
            <path d={`M ${x+27} 114 v 15 M ${x+27} 129 l -14 12 M ${x+27} 129 l 14 12`} fill="none" stroke={GOLD} strokeWidth="2" />
            <Chip x={x+13} y={155} value={2} color={INDIGO} delay={.25+i*.08} /><Chip x={x+41} y={155} value={2} color={INDIGO} delay={.32+i*.08} />
          </motion.g>;
        })}
        <text x="230" y="193" textAnchor="middle" fontSize="15" fontWeight="900" fill={INDIGO} fontFamily={FONT}>4^{leftExponent} = (2²)^{leftExponent} = 2^{twoCount}</text>
        <rect x="60" y="216" width="340" height="61" rx="12" fill="#f0fdfa" stroke={TEAL} strokeWidth="2" />
        <text x="230" y="240" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>NOW BOTH SIDES HAVE THE SAME TOKEN COUNT</text>
        <text x="230" y="264" textAnchor="middle" fontSize="18" fontWeight="950" fill={TEAL} fontFamily={FONT}>2^{twoCount} · 5^{rightExponent}</text>
      </>}

      {phase === 1 && <>
        <text x="230" y="45" textAnchor="middle" fontSize="16" fontWeight="950" fill={INK} fontFamily={FONT}>2^{twoCount} · 5^{rightExponent}</text>
        {Array.from({ length: pairCount }, (_, i) => {
          const col = i % 5, row = Math.floor(i / 5), x = 60 + col * 85, y = 82 + row * 88;
          return <motion.g key={i} initial={{ opacity: 0, x: i % 2 ? 18 : -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .07 }}>
            <Chip x={x} y={y} value={2} color={INDIGO} /><text x={x+22} y={y+5} fontSize="13" fontWeight="900" fill={DIM}>×</text><Chip x={x+43} y={y} value={5} color={TEAL} />
            <motion.path d={`M ${x+4} ${y+19} Q ${x+22} ${y+34} ${x+39} ${y+19}`} fill="none" stroke={GOLD} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .25+i*.07 }} />
            <text x={x+22} y={y+45} textAnchor="middle" fontSize="15" fontWeight="950" fill={GOLD} fontFamily={FONT}>10</text>
          </motion.g>;
        })}
        <rect x="92" y="255" width="276" height="40" rx="12" fill="#fef3c7" stroke={GOLD} strokeWidth="2" />
        <text x="230" y="281" textAnchor="middle" fontSize="19" fontWeight="950" fill={GOLD} fontFamily={FONT}>(2·5)^{pairCount} = 10^{pairCount}</text>
      </>}

      {phase === 2 && <>
        <text x="230" y="48" textAnchor="middle" fontSize="22" fontWeight="950" fill={INDIGO} fontFamily={FONT}>10^{pairCount}</text>
        <path d="M 230 58 V 79" stroke={GOLD} strokeWidth="2.5" />
        <g transform="translate(21 91)">
          {valueText.split("").map((digit, i) => <motion.g key={i} initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .08 }}>
            <rect x={i*38} y="0" width="34" height="46" rx="7" fill={i === 0 ? "#eef2ff" : "#f0fdfa"} stroke={i === 0 ? INDIGO : TEAL} strokeWidth="2" />
            <text x={i*38+17} y="31" textAnchor="middle" fontSize="22" fontWeight="950" fill={i === 0 ? INDIGO : TEAL} fontFamily={FONT}>{digit}</text>
            <text x={i*38+17} y="62" textAnchor="middle" fontSize="9" fontWeight="800" fill={DIM} fontFamily={FONT}>{i+1}</text>
          </motion.g>)}
        </g>
        <text x="230" y="177" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={DIM}>1 digit + {pairCount} zero digits</text>
        <rect x="85" y="202" width="290" height="63" rx="14" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2.5" />
        <text x="230" y="226" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>digits = 1 + {pairCount}</text>
        <text x="230" y="253" textAnchor="middle" fontSize="24" fontWeight="950" fill={ok ? GREEN : RED} fontFamily={FONT}>= {digits}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={413} y={273} width={74} />
        {!ok && <text x="230" y="295" textAnchor="middle" fontSize="9" fill={RED}>{fail}</text>}
      </>}
    </svg>
  </div>;
}
