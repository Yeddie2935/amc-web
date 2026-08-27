import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", INDIGO = "#4338ca", TEAL = "#0d9488", AMBER = "#d97706", GREEN = "#16a34a", RED = "#dc2626";
const COLORS = ["#c7d2fe", "#bfdbfe", "#bae6fd", "#a5f3fc", "#99f6e4", "#bbf7d0"];

/** Equal-width rectangles join end-to-end, turning a sum of areas into one area. Data: { commonWidth, lengths }. */
export function CommonWidthJoinScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const width = num(data.commonWidth, 0);
  const lengths = Array.isArray(data.lengths) ? data.lengths.map((v) => num(v, 0)) : [];
  const lengthSum = lengths.reduce((a, b) => a + b, 0);
  const area = width * lengthSum;
  const final = step >= totalSteps - 1;
  const joined = step >= 1 || final;
  const choice = problem.choices?.find((c) => Number(c.text) === area)?.label;
  const consistent = area === Number(problem.shortAnswer) && choice === problem.answer;
  const barX = 27, barW = 306, unit = barW / lengthSum;
  const starts = lengths.reduce<number[]>((xs, value) => [...xs, xs[xs.length - 1] + value], [0]);

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: "100%", padding: "5px 4px" }}>
    <svg viewBox="0 0 360 244" width="100%" style={{ maxWidth: 430 }}>
      {!joined && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x="180" y="16" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748b">SIX RECTANGLES — EVERY WIDTH IS {width}</text>
        {lengths.map((length, i) => {
          const col = i % 2, row = Math.floor(i / 2), x = 25 + col * 174, y = 37 + row * 58;
          const w = Math.max(12, length * 4.1);
          return <motion.g key={length} initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: i * 0.1 }} style={{ transformOrigin: `${x}px ${y}px` }}>
            <rect x={x} y={y} width={w} height="22" rx="3" fill={COLORS[i]} stroke={i < 3 ? INDIGO : TEAL} strokeWidth="1.6" />
            <line x1={x} y1={y + 11} x2={x + w} y2={y + 11} stroke="#fff" strokeWidth="1" opacity="0.8" />
            <text x={x + w / 2} y={y - 5} textAnchor="middle" fontSize="10.5" fontWeight="900" fill={INK} fontFamily={FONT}>length {length}</text>
            <text x={x + w + 7} y={y + 15} fontSize="9.5" fontWeight="900" fill={AMBER} fontFamily={FONT}>× {width}</text>
          </motion.g>;
        })}
        <path d="M 38 218 H 322" stroke={AMBER} strokeWidth="3" strokeLinecap="round" />
        <text x="180" y="239" textAnchor="middle" fontSize="13" fontWeight="900" fill={INDIGO} fontFamily={FONT}>{width}(1 + 4 + 9 + 16 + 25 + 36)</text>
      </motion.g>}

      {joined && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x="180" y="17" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748b">MATCHING WIDTHS LET THE PIECES JOIN END-TO-END</text>
        <text x="13" y="90" textAnchor="middle" fontSize="11" fontWeight="900" fill={AMBER} fontFamily={FONT} transform="rotate(-90 13 90)">width {width}</text>
        {lengths.map((length, i) => {
          const x = barX + starts[i] * unit, w = length * unit;
          return <motion.g key={length} initial={{ opacity: 0, x: i % 2 ? 30 : -30 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 160, damping: 18, delay: i * 0.09 }}>
            <rect x={x} y="49" width={w} height="82" fill={COLORS[i]} stroke={i < 3 ? INDIGO : TEAL} strokeWidth="1.4" />
            {w >= 24 && !final && <text x={x + w / 2} y="94" textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>{length}</text>}
          </motion.g>;
        })}
        <rect x={barX} y="49" width={barW} height="82" fill="none" stroke={INK} strokeWidth="2" />
        {lengths[0] * unit < 24 && <g><path d={`M ${barX + lengths[0] * unit / 2} 48 V 34 H 47`} fill="none" stroke={INDIGO} /><text x="51" y="37" fontSize="10" fontWeight="900" fill={INDIGO} fontFamily={FONT}>1</text></g>}
        <path d={`M ${barX} 143 V 151 H ${barX + barW} V 143`} fill="none" stroke={joined ? GREEN : INDIGO} strokeWidth="2.5" />
        <text x="180" y="170" textAnchor="middle" fontSize="14" fontWeight="900" fill={GREEN} fontFamily={FONT}>1 + 4 + 9 + 16 + 25 + 36 = {lengthSum}</text>

        <AnimatePresence>{final && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.line x1={barX} y1="90" x2={barX + barW} y2="90" stroke="#fff" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 }} />
          <text x="180" y="75" textAnchor="middle" fontSize="12" fontWeight="900" fill={INDIGO} fontFamily={FONT}>1 row × {lengthSum}</text>
          <text x="180" y="118" textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>1 row × {lengthSum}</text>
          <motion.rect x="85" y="188" width="190" height="38" rx="10" fill="#dcfce7" stroke={consistent ? GREEN : RED} strokeWidth="2" initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 210, damping: 15, delay: 0.55 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          <text x="180" y="213" textAnchor="middle" fontSize="20" fontWeight="900" fill={consistent ? GREEN : RED} fontFamily={FONT}>{width} × {lengthSum} = {area}</text>
        </motion.g>}</AnimatePresence>
        {!final && <text x="180" y="213" textAnchor="middle" fontSize="13" fontWeight="900" fill={INDIGO}>one rectangle: width {width}, length {lengthSum}</text>}
      </motion.g>}
    </svg>
    <motion.span key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, color: final ? "#166534" : INDIGO, textAlign: "center" }}>
      {final ? `total area = ${width} × ${lengthSum} = ${area}` : step === 0 ? `factor out the shared width ${width}` : `the joined length is ${lengthSum}`}
    </motion.span>
    <AnimatePresence>{final && consistent && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.65 }} style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 800, fontSize: 15 }}>Answer {problem.answer}</motion.div>}</AnimatePresence>
    {final && !consistent && <span style={{ color: RED, fontSize: 11, fontWeight: 800 }}>area total or stored answer check failed</span>}
  </div>;
}
