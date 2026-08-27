import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", GIRL = "#db2777", BOY = "#2563eb", INDIGO = "#4338ca", GREEN = "#16a34a", RED = "#dc2626", AMBER = "#d97706";

function Student({ x, y, color, delay = 0, faded = false }: { x: number; y: number; color: string; delay?: number; faded?: boolean }) {
  return <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: faded ? 0.22 : 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
    <circle cx={x} cy={y - 5} r="5" fill={color} /><path d={`M ${x - 7} ${y + 11} Q ${x} ${y - 1} ${x + 7} ${y + 11} Z`} fill={color} />
  </motion.g>;
}

/** Remove a known excess, split the remainder equally, restore it, then group to reduce the ratio. Data: { total, difference, labels }. */
export function DifferenceTotalRatioScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = Math.round(num(data.total, 0)), difference = Math.round(num(data.difference, 0));
  const labels = Array.isArray(data.labels) ? data.labels.map(String) : ["Girls", "Boys"];
  const equalPart = (total - difference) / 2;
  const girls = equalPart + difference, boys = equalPart;
  const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);
  const factor = gcd(girls, boys), ratio = `${girls / factor}:${boys / factor}`;
  const final = step >= totalSteps - 1;
  const solved = step >= 1 || final;
  const choice = problem.choices?.find((c) => c.text.replace(/\s/g, "") === ratio)?.label;
  const consistent = Number.isInteger(equalPart) && problem.shortAnswer?.replace(/\s/g, "") === ratio && choice === problem.answer;
  const dot = (i: number, x0: number, y0: number) => ({ x: x0 + (i % 8) * 20, y: y0 + Math.floor(i / 8) * 27 });

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: "100%", padding: "5px 4px" }}>
    <svg viewBox="0 0 360 247" width="100%" style={{ maxWidth: 430 }}>
      {!solved && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x="180" y="17" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748b">THE CLASS HAS TWO MATCHING PARTS + 4 EXTRAS</text>
        <rect x="28" y="38" width="304" height="55" rx="12" fill="#fdf2f8" stroke={GIRL} strokeWidth="2" />
        <rect x="28" y="111" width="238" height="55" rx="12" fill="#eff6ff" stroke={BOY} strokeWidth="2" />
        <rect x="266" y="38" width="66" height="55" rx="12" fill="#fef3c7" stroke={AMBER} strokeWidth="2" />
        <text x="45" y="59" fontSize="11" fontWeight="900" fill={GIRL}>{labels[0]}</text>
        <text x="45" y="132" fontSize="11" fontWeight="900" fill={BOY}>{labels[1]}</text>
        <text x="147" y="74" textAnchor="middle" fontSize="20" fontWeight="900" fill={GIRL} fontFamily={FONT}>b</text>
        <text x="147" y="147" textAnchor="middle" fontSize="20" fontWeight="900" fill={BOY} fontFamily={FONT}>b</text>
        {Array.from({ length: difference }, (_, i) => <Student key={i} x={280 + (i % 2) * 28} y={60 + Math.floor(i / 2) * 23} color={GIRL} delay={i * 0.1} />)}
        <text x="299" y="106" textAnchor="middle" fontSize="11" fontWeight="900" fill={AMBER}>4 extra</text>
        <path d="M 28 188 H 332" stroke={INDIGO} strokeWidth="3" strokeLinecap="round" />
        <text x="180" y="215" textAnchor="middle" fontSize="17" fontWeight="900" fill={INDIGO} fontFamily={FONT}>b + (b + {difference}) = {total}</text>
        <text x="180" y="238" textAnchor="middle" fontSize="11" fontWeight="800" fill="#64748b">same-size blue and pink parts, plus four</text>
      </motion.g>}

      {solved && !final && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x="180" y="17" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748b">SET ASIDE 4, THEN SPLIT THE OTHER 24 EQUALLY</text>
        <rect x="18" y="33" width="154" height="94" rx="12" fill="#fdf2f8" stroke={GIRL} />
        <rect x="188" y="33" width="154" height="94" rx="12" fill="#eff6ff" stroke={BOY} />
        <text x="95" y="51" textAnchor="middle" fontSize="11" fontWeight="900" fill={GIRL}>12 BASE GIRLS</text>
        <text x="265" y="51" textAnchor="middle" fontSize="11" fontWeight="900" fill={BOY}>12 BOYS</text>
        {Array.from({ length: equalPart }, (_, i) => { const p = dot(i, 26, 69); return <Student key={`g${i}`} {...p} color={GIRL} delay={i * 0.025} />; })}
        {Array.from({ length: equalPart }, (_, i) => { const p = dot(i, 196, 69); return <Student key={`b${i}`} {...p} color={BOY} delay={i * 0.025} />; })}
        <motion.path d="M 84 145 Q 84 172 135 172" fill="none" stroke={AMBER} strokeWidth="2.5" markerEnd="url(#classArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <g transform="translate(139 145)">{Array.from({ length: difference }, (_, i) => <Student key={i} x={i * 25} y={11} color={GIRL} delay={0.4 + i * 0.08} />)}</g>
        <text x="180" y="195" textAnchor="middle" fontSize="12" fontWeight="900" fill={AMBER}>return the 4 extra girls</text>
        <rect x="44" y="207" width="116" height="31" rx="10" fill="#fce7f3" stroke={GIRL} /><text x="102" y="228" textAnchor="middle" fontSize="16" fontWeight="900" fill={GIRL} fontFamily={FONT}>12 + 4 = {girls}</text>
        <rect x="200" y="207" width="116" height="31" rx="10" fill="#dbeafe" stroke={BOY} /><text x="258" y="228" textAnchor="middle" fontSize="16" fontWeight="900" fill={BOY} fontFamily={FONT}>{boys} boys</text>
        <defs><marker id="classArrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6z" fill={AMBER} /></marker></defs>
      </motion.g>}

      {final && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x="180" y="17" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748b">BUNDLE EACH ROSTER INTO GROUPS OF {factor}</text>
        <text x="18" y="66" fontSize="11" fontWeight="900" fill={GIRL}>{girls} GIRLS</text>
        {Array.from({ length: girls / factor }, (_, group) => <motion.g key={`g${group}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: group * 0.1 }}>
          <rect x={96 + group * 61} y="39" width="52" height="52" rx="10" fill="#fdf2f8" stroke={GIRL} />
          {Array.from({ length: factor }, (_, i) => <Student key={i} x={109 + group * 61 + (i % 2) * 25} y={58 + Math.floor(i / 2) * 22} color={GIRL} />)}
        </motion.g>)}
        <text x="18" y="147" fontSize="11" fontWeight="900" fill={BOY}>{boys} BOYS</text>
        {Array.from({ length: boys / factor }, (_, group) => <motion.g key={`b${group}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + group * 0.1 }}>
          <rect x={96 + group * 61} y="120" width="52" height="52" rx="10" fill="#eff6ff" stroke={BOY} />
          {Array.from({ length: factor }, (_, i) => <Student key={i} x={109 + group * 61 + (i % 2) * 25} y={139 + Math.floor(i / 2) * 22} color={BOY} />)}
        </motion.g>)}
        <motion.rect x="99" y="192" width="162" height="40" rx="12" fill="#dcfce7" stroke={consistent ? GREEN : RED} strokeWidth="2" initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 210, damping: 15, delay: 0.5 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        <text x="180" y="218" textAnchor="middle" fontSize="20" fontWeight="900" fill={consistent ? GREEN : RED} fontFamily={FONT}>{girls}:{boys} = {ratio}</text>
      </motion.g>}
    </svg>
    <motion.span key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, color: final ? "#166534" : INDIGO, textAlign: "center" }}>
      {final ? `${girls}:${boys} reduces by ${factor} to ${ratio}` : step === 0 ? `girls = b + ${difference}, boys = b` : `${total} − ${difference} = ${total - difference}; split equally gives ${equalPart} and ${equalPart}`}
    </motion.span>
    <AnimatePresence>{final && consistent && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.65 }} style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 800, fontSize: 15 }}>Answer {problem.answer}</motion.div>}</AnimatePresence>
    {final && !consistent && <span style={{ color: RED, fontSize: 11, fontWeight: 800 }}>class counts, ratio, or stored answer check failed</span>}
  </div>;
}
