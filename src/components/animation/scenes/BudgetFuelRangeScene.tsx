import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", INDIGO = "#4338ca", TEAL = "#0d9488", AMBER = "#d97706", GREEN = "#16a34a", RED = "#dc2626";

function GasCan({ x, y, index }: { x: number; y: number; index: number }) {
  return <motion.g initial={{ opacity: 0, y: -22, scale: 0.6 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 230, damping: 17, delay: 0.18 + index * 0.12 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
    <path d={`M ${x + 6} ${y + 5} h 20 l 5 7 v 29 h -30 v -31 z`} fill="#fef3c7" stroke={AMBER} strokeWidth="2" />
    <path d={`M ${x + 9} ${y + 5} v -5 h 13 v 8`} fill="none" stroke={AMBER} strokeWidth="2" />
    <path d={`M ${x + 26} ${y + 4} h 8`} stroke={AMBER} strokeWidth="3" strokeLinecap="round" />
    <text x={x + 16} y={y + 31} textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>1 gal</text>
  </motion.g>;
}

/** Money becomes gallon cans, then each can powers one equal road segment. Data: { budget, pricePerGallon, milesPerGallon }. */
export function BudgetFuelRangeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const budget = num(data.budget, 0), price = num(data.pricePerGallon, 0), mpg = num(data.milesPerGallon, 0);
  const gallons = budget / price;
  const miles = gallons * mpg;
  const final = step >= totalSteps - 1;
  const choice = problem.choices?.find((c) => Number(c.text) === miles)?.label;
  const consistent = Number.isInteger(gallons) && gallons > 0 && gallons <= 8 && miles === Number(problem.shortAnswer) && choice === problem.answer;
  const n = Math.round(gallons);
  const canX = (i: number) => 68 + i * 54;
  const roadX = 28, roadW = 304, segW = roadW / n;

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: "100%", padding: "5px 4px" }}>
    <svg viewBox="0 0 360 235" width="100%" style={{ maxWidth: 430 }}>
      {!final && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x="180" y="16" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748b">TRADE MONEY FOR GAS</text>
        <rect x="24" y="32" width="86" height="52" rx="9" fill="#dcfce7" stroke={GREEN} strokeWidth="2" />
        <text x="67" y="55" textAnchor="middle" fontSize="18" fontWeight="900" fill={GREEN} fontFamily={FONT}>${budget}</text>
        <text x="67" y="72" textAnchor="middle" fontSize="10" fontWeight="800" fill="#64748b">Margie's money</text>
        <motion.path d="M 119 58 H 165" stroke={INDIGO} strokeWidth="2.5" markerEnd="url(#fuelArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25 }} />
        <text x="142" y="48" textAnchor="middle" fontSize="11" fontWeight="900" fill={INDIGO} fontFamily={FONT}>÷ ${price}</text>
        <g transform="translate(178 29)">
          <rect x="0" y="0" width="54" height="69" rx="7" fill="#eef2ff" stroke={INDIGO} strokeWidth="2" />
          <rect x="10" y="10" width="34" height="20" rx="3" fill="#fff" stroke="#c7d2fe" />
          <text x="27" y="25" textAnchor="middle" fontSize="11" fontWeight="900" fill={INDIGO} fontFamily={FONT}>${price}</text>
          <path d="M 44 39 q 14 2 10 18 v 8" fill="none" stroke={INK} strokeWidth="2" />
          <circle cx="27" cy="48" r="8" fill="#fef3c7" stroke={AMBER} />
          <text x="27" y="52" textAnchor="middle" fontSize="8" fontWeight="900" fill={AMBER}>GAS</text>
        </g>
        <text x="269" y="51" textAnchor="middle" fontSize="11" fontWeight="900" fill={INK}>one payment</text>
        <text x="269" y="68" textAnchor="middle" fontSize="11" fontWeight="900" fill={TEAL}>buys 1 gallon</text>
        <defs><marker id="fuelArrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6z" fill={INDIGO} /></marker></defs>
        <path d="M 32 124 H 328" stroke="#cbd5e1" strokeWidth="2" />
        {Array.from({ length: n }, (_, i) => <g key={i}><rect x={canX(i) - 15} y="108" width="34" height="18" rx="4" fill="#dcfce7" stroke={GREEN} /><text x={canX(i) + 2} y="121" textAnchor="middle" fontSize="10" fontWeight="900" fill={GREEN} fontFamily={FONT}>${price}</text><GasCan x={canX(i) - 14} y={139} index={i} /></g>)}
        <motion.path d="M 42 198 H 318" stroke={GREEN} strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7 }} />
        <text x="180" y="221" textAnchor="middle" fontSize="16" fontWeight="900" fill={GREEN} fontFamily={FONT}>${budget} ÷ ${price} = {gallons} gallons</text>
      </motion.g>}

      {final && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x="180" y="16" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748b">EACH GALLON POWERS 32 MILES</text>
        {Array.from({ length: n }, (_, i) => <GasCan key={i} x={32 + i * 61} y={31} index={i} />)}
        <motion.g initial={{ x: -36 }} animate={{ x: 265 }} transition={{ duration: 1.25, delay: 0.25 }}>
          <path d="M 28 111 h 38 l 10 13 h 14 v 19 h -67 v -25 z" fill="#e0e7ff" stroke={INDIGO} strokeWidth="2" />
          <circle cx="39" cy="143" r="7" fill={INK} /><circle cx="75" cy="143" r="7" fill={INK} />
          <rect x="47" y="114" width="17" height="10" fill="#bfdbfe" stroke={INDIGO} />
        </motion.g>
        <line x1={roadX} y1="153" x2={roadX + roadW} y2="153" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        {Array.from({ length: n }, (_, i) => <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.12 }}>
          <line x1={roadX + i * segW} y1="145" x2={roadX + i * segW} y2="162" stroke={TEAL} strokeWidth="2" />
          <rect x={roadX + i * segW + 5} y="169" width={segW - 10} height="24" rx="7" fill="#ccfbf1" stroke={TEAL} />
          <text x={roadX + (i + 0.5) * segW} y="185" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={TEAL} fontFamily={FONT}>{mpg} mi</text>
        </motion.g>)}
        <line x1={roadX + roadW} y1="145" x2={roadX + roadW} y2="162" stroke={TEAL} strokeWidth="2" />
        <text x="180" y="222" textAnchor="middle" fontSize="19" fontWeight="900" fill={consistent ? GREEN : RED} fontFamily={FONT}>{gallons} × {mpg} = {miles} miles</text>
      </motion.g>}
    </svg>
    <motion.span key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, color: final ? "#166534" : INDIGO, textAlign: "center" }}>
      {final ? `${gallons} gallons × ${mpg} miles/gallon = ${miles} miles` : `$${budget} buys ${gallons} gallons at $${price} each`}
    </motion.span>
    <AnimatePresence>{final && consistent && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.6 }} style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 800, fontSize: 15 }}>Answer {problem.answer}</motion.div>}</AnimatePresence>
    {final && !consistent && <span style={{ color: RED, fontSize: 11, fontWeight: 800 }}>fuel conversion or stored answer check failed</span>}
  </div>;
}
