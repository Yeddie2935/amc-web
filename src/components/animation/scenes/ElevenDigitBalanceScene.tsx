import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", INDIGO = "#4338ca", TEAL = "#0d9488", AMBER = "#d97706", GREEN = "#16a34a", RED = "#dc2626";

function Digit({ x, y, value, color }: { x: number; y: number; value: string | number; color: string }) {
  return <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 230, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
    <rect x={x - 23} y={y - 27} width="46" height="54" rx="9" fill={`${color}14`} stroke={color} strokeWidth="2" />
    <text x={x} y={y + 8} textAnchor="middle" fontSize="26" fontWeight="900" fill={color} fontFamily={FONT}>{value}</text>
  </motion.g>;
}

/** Equal payment by 11 invokes the alternating-digit balance and reveals the missing digit. Data: { members, hundredsDigit, onesDigit }. */
export function ElevenDigitBalanceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const members = Math.round(num(data.members, 0)), hundreds = Math.round(num(data.hundredsDigit, 0)), ones = Math.round(num(data.onesDigit, 0));
  const candidates = Array.from({ length: 10 }, (_, a) => a).filter((a) => (100 * hundreds + 10 * a + ones) % members === 0);
  const answer = candidates[0] ?? -1;
  const number = 100 * hundreds + 10 * answer + ones;
  const share = number / members;
  const diffMin = hundreds + ones - 9, diffMax = hundreds + ones;
  const final = step >= totalSteps - 1;
  const balance = step >= 1 || final;
  const choice = problem.choices?.find((c) => Number(c.text) === answer)?.label;
  const consistent = candidates.length === 1 && Number.isInteger(share) && answer === Number(problem.shortAnswer) && choice === problem.answer;

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: "100%", padding: "5px 4px" }}>
    <svg viewBox="0 0 360 245" width="100%" style={{ maxWidth: 430 }}>
      {!balance && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x="180" y="16" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748b">11 MEMBERS PAY EQUAL SHARES</text>
        <rect x="119" y="29" width="122" height="54" rx="11" fill="#dcfce7" stroke={GREEN} strokeWidth="2" />
        <text x="180" y="64" textAnchor="middle" fontSize="27" fontWeight="900" fill={GREEN} fontFamily={FONT}>${hundreds}A{ones}</text>
        <motion.path d="M 180 88 V 116" stroke={INDIGO} strokeWidth="2.5" markerEnd="url(#payArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        {Array.from({ length: members }, (_, i) => {
          const x = 30 + (i % 6) * 60, y = 140 + Math.floor(i / 6) * 51;
          return <motion.g key={i} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <circle cx={x} cy={y} r="7" fill={INDIGO} /><path d={`M ${x - 10} ${y + 20} Q ${x} ${y + 3} ${x + 10} ${y + 20} Z`} fill="#c7d2fe" stroke={INDIGO} />
            <text x={x} y={y + 35} textAnchor="middle" fontSize="8" fontWeight="900" fill="#64748b">same $</text>
          </motion.g>;
        })}
        <text x="180" y="239" textAnchor="middle" fontSize="14" fontWeight="900" fill={INDIGO} fontFamily={FONT}>${hundreds}A{ones} must be divisible by {members}</text>
        <defs><marker id="payArrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6z" fill={INDIGO} /></marker></defs>
      </motion.g>}

      {balance && !final && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x="180" y="16" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748b">THE 11-RULE ALTERNATES +, −, +</text>
        <Digit x={76} y={65} value={hundreds} color={TEAL} /><Digit x={180} y={65} value="A" color={AMBER} /><Digit x={284} y={65} value={ones} color={TEAL} />
        <text x="128" y="72" textAnchor="middle" fontSize="23" fontWeight="900" fill={TEAL}>+</text><text x="232" y="72" textAnchor="middle" fontSize="23" fontWeight="900" fill={AMBER}>−</text>
        <motion.path d="M 45 111 H 315" stroke={INK} strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <path d="M 180 111 V 178 M 129 178 H 231" stroke={INK} strokeWidth="3" fill="none" />
        <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <circle cx="111" cy="144" r="29" fill="#ccfbf1" stroke={TEAL} strokeWidth="2" /><text x="111" y="151" textAnchor="middle" fontSize="18" fontWeight="900" fill={TEAL} fontFamily={FONT}>{hundreds}+{ones}</text>
          <circle cx="249" cy="144" r="29" fill="#fef3c7" stroke={AMBER} strokeWidth="2" /><text x="249" y="151" textAnchor="middle" fontSize="21" fontWeight="900" fill={AMBER} fontFamily={FONT}>A</text>
        </motion.g>
        <rect x="80" y="194" width="200" height="37" rx="10" fill="#eef2ff" stroke={INDIGO} />
        <text x="180" y="218" textAnchor="middle" fontSize="18" fontWeight="900" fill={INDIGO} fontFamily={FONT}>{hundreds} + {ones} − A = {hundreds + ones} − A</text>
      </motion.g>}

      {final && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x="180" y="16" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748b">ONLY 0 IS A MULTIPLE OF 11 IN THE POSSIBLE RANGE</text>
        <line x1="38" y1="54" x2="322" y2="54" stroke="#cbd5e1" strokeWidth="2" />
        {Array.from({ length: diffMax - diffMin + 1 }, (_, i) => diffMin + i).map((v) => {
          const x = 48 + (v - diffMin) * (264 / (diffMax - diffMin));
          return <g key={v}><line x1={x} y1="48" x2={x} y2="60" stroke={v === 0 ? GREEN : "#94a3b8"} strokeWidth={v === 0 ? 3 : 1} />{(v === diffMin || v === 0 || v === diffMax) && <text x={x} y="74" textAnchor="middle" fontSize="10" fontWeight="900" fill={v === 0 ? GREEN : "#64748b"} fontFamily={FONT}>{v}</text>}</g>;
        })}
        <text x="180" y="95" textAnchor="middle" fontSize="17" fontWeight="900" fill={GREEN} fontFamily={FONT}>{hundreds + ones} − A = 0  →  A = {answer}</text>
        <Digit x={180} y={137} value={answer} color={GREEN} />
        <motion.path d="M 180 169 V 188" stroke={INDIGO} strokeWidth="2.5" markerEnd="url(#checkArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 }} />
        <rect x="45" y="191" width="270" height="39" rx="11" fill="#dcfce7" stroke={consistent ? GREEN : RED} strokeWidth="2" />
        <text x="180" y="216" textAnchor="middle" fontSize="17" fontWeight="900" fill={consistent ? GREEN : RED} fontFamily={FONT}>{number} ÷ {members} = ${share} each</text>
        <defs><marker id="checkArrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6z" fill={INDIGO} /></marker></defs>
      </motion.g>}
    </svg>
    <motion.span key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, color: final ? "#166534" : INDIGO, textAlign: "center" }}>
      {final ? `3 − A = 0, so A = ${answer}` : step === 0 ? `equal shares make the total a multiple of ${members}` : `alternating difference: ${hundreds} + ${ones} − A = ${hundreds + ones} − A`}
    </motion.span>
    <AnimatePresence>{final && consistent && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.65 }} style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 800, fontSize: 15 }}>Answer {problem.answer}</motion.div>}</AnimatePresence>
    {final && !consistent && <span style={{ color: RED, fontSize: 11, fontWeight: 800 }}>digit candidate, division, or stored answer check failed</span>}
  </div>;
}
