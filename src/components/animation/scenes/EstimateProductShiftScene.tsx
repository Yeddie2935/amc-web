import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const AMBER = "#f59e0b";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const sup = (n: number) => (n < 0 ? "⁻" : "") + String(Math.abs(n)).split("").map((c) => SUP[Number(c)]).join("");
const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 8 });

function scientific(n: number) {
  const exponent = Math.floor(Math.log10(Math.abs(n)));
  const coefficient = Math.round((n / 10 ** exponent) * 1e10) / 1e10;
  return { coefficient, exponent };
}

/** Two awkward factors round to one significant digit, then their coefficient
 * and exponent parts physically recombine. Data: { exactFactors, roundedFactors }. */
export function EstimateProductShiftScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const exact = Array.isArray(data.exactFactors) ? data.exactFactors.map((v) => num(v, 0)) : [];
  const rounded = Array.isArray(data.roundedFactors) ? data.roundedFactors.map((v) => num(v, 0)) : [];
  const [a, b] = rounded.map(scientific);
  const coefficient = Math.round(a.coefficient * b.coefficient * 1e10) / 1e10;
  const exponent = a.exponent + b.exponent;
  const estimate = coefficient * 10 ** exponent;
  const actual = exact[0] * exact[1];
  const choices = (problem.choices ?? []).map((c) => ({ label: c.label, value: Number(String(c.text).replace(/[^0-9.-]/g, "")) }));
  const nearest = [...choices].sort((x, y) => Math.abs(x.value - actual) - Math.abs(y.value - actual))[0];
  const stated = Number(String(problem.shortAnswer ?? "").replace(/[^0-9.-]/g, ""));
  const consistent = rounded.length === 2 && estimate === stated && nearest?.label === problem.answer;
  const final = step >= totalSteps - 1;

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
    <svg viewBox="0 0 390 230" width="100%" style={{ maxWidth: 440 }}>
      {!final ? <>
        {[0, 1].map((i) => {
          const y = 38 + i * 78;
          return <g key={i}>
            <rect x="16" y={y - 20} width="145" height="41" rx="10" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="88" y={y + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill={INK} fontFamily={mono}>{fmt(exact[i])}</text>
            <motion.path d={`M 171 ${y} H 213`} stroke={AMBER} strokeWidth="2" markerEnd="url(#epArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25 + i * 0.2 }} />
            <motion.g initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 180, damping: 17, delay: 0.55 + i * 0.2 }}>
              <rect x="221" y={y - 20} width="150" height="41" rx="10" fill="#eef2ff" stroke={INDIGO} strokeWidth="1.6" />
              <text x="296" y={y + 5} textAnchor="middle" fontSize="16" fontWeight="900" fill={INDIGO} fontFamily={mono}>≈ {fmt(rounded[i])}</text>
            </motion.g>
          </g>;
        })}
        <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }}>
          <rect x="76" y="177" width="238" height="36" rx="18" fill="#fffbeb" stroke={AMBER} />
          <text x="195" y="200" textAnchor="middle" fontSize="14" fontWeight="900" fill="#b45309" fontFamily={mono}>{fmt(rounded[0])} × {fmt(rounded[1])}</text>
        </motion.g>
      </> : <>
        <text x="195" y="27" textAnchor="middle" fontSize="13" fontWeight="800" fill={DIM} fontFamily={mono}>split digits from place value</text>
        {[a, b].map((s, i) => <motion.g key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.18 }}>
          <rect x={55 + i * 195} y="43" width="85" height="43" rx="10" fill="#eef2ff" stroke={INDIGO} />
          <text x={97.5 + i * 195} y="70" textAnchor="middle" fontSize="17" fontWeight="900" fill={INDIGO} fontFamily={mono}>{s.coefficient} × 10{sup(s.exponent)}</text>
        </motion.g>)}
        <text x="195" y="70" textAnchor="middle" fontSize="19" fontWeight="900" fill={INK}>×</text>

        <motion.path d="M 90 94 Q 110 121 145 124" fill="none" stroke={AMBER} strokeWidth="2" markerEnd="url(#epArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 }} />
        <motion.path d="M 290 94 Q 270 121 236 124" fill="none" stroke={AMBER} strokeWidth="2" markerEnd="url(#epArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }} />
        <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 210, damping: 15, delay: 0.65 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x="100" y="111" width="190" height="40" rx="12" fill="#fffbeb" stroke={AMBER} />
          <text x="195" y="136" textAnchor="middle" fontSize="15" fontWeight="900" fill="#b45309" fontFamily={mono}>{a.coefficient} × {b.coefficient} × 10{sup(a.exponent + b.exponent)} = {coefficient} × 10{sup(exponent)}</text>
        </motion.g>
        {consistent && <motion.g initial={{ opacity: 0, scale: 0.35 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 14, delay: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x="119" y="169" width="152" height="43" rx="21" fill="#dcfce7" stroke={GREEN} strokeWidth="1.5" />
          <text x="195" y="197" textAnchor="middle" fontSize="21" fontWeight="900" fill={GREEN} fontFamily={mono}>{fmt(estimate)}</text>
        </motion.g>}
      </>}
      <defs><marker id="epArrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6z" fill={AMBER} /></marker></defs>
    </svg>

    <motion.span key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: mono, fontSize: 12, fontWeight: 800, color: final ? "#166534" : INDIGO, textAlign: "center" }}>
      {final ? `${a.coefficient} × ${b.coefficient} = ${coefficient}, and ${a.exponent} + ${b.exponent} = ${exponent}` : "round each factor to one easy leading digit"}
    </motion.span>
    {final && <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color: consistent ? DIM : RED, textAlign: "center" }}>
      {consistent ? `exact product ${fmt(actual)} is closest to ${fmt(nearest.value)}` : `estimate ${estimate} or nearest choice ${nearest?.label} does not match the stored answer`}
    </span>}
    <AnimatePresence>{final && consistent && problem.answer && <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.2 }} style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 700, fontSize: 15 }}>Answer {problem.answer}</motion.div>}</AnimatePresence>
  </div>;
}
