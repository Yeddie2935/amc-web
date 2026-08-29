import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", INDIGO = "#4338ca", TEAL = "#0d9488", GOLD = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";
const COLORS = [GOLD, TEAL, INDIGO];

/** Apply one common positive root to several powers, then order their simpler values. Data: { bases, exponents, rootDegree }. */
export function CommonRootOrderScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const bases = (Array.isArray(data.bases) ? data.bases : []).map((v) => num(v, 0));
  const exponents = (Array.isArray(data.exponents) ? data.exponents : []).map((v) => num(v, 0));
  const root = num(data.rootDegree, 0);
  const reduced = exponents.map((e) => e / root);
  const values = bases.map((b, i) => b ** reduced[i]);
  const order = values.map((value, i) => ({ value, i })).sort((a,b) => a.value-b.value);
  const expression = (i: number) => `${bases[i]}^${exponents[i]}`;
  const ordering = order.map((o) => expression(o.i)).join(" < ");
  const final = step >= totalSteps - 1;
  const choice = problem.choices?.find((c) => c.text.replace(/\s/g, "") === ordering.replace(/\s/g, ""))?.label;
  const ok = values.every(Number.isInteger) && ordering.replace(/\s/g, "") === String(problem.shortAnswer).replace(/\s/g, "") && choice === problem.answer;
  const fail = `ordered ${ordering}; stored ${problem.shortAnswer ?? "missing"}`;

  const min = Math.floor((Math.min(...values)-10)/10)*10, max = Math.ceil((Math.max(...values)+10)/10)*10;
  const X = (v: number) => 45 + ((v-min)/(max-min))*370;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 310" width="100%" style={{ maxWidth: 490, display: "block" }}>
      <text x="230" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
        {!final ? `the ${root}th-root elevator lowers every exponent by the same factor` : "the simpler values land on one number line"}
      </text>

      {!final && <>
        <rect x="43" y="39" width="374" height="196" rx="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        <text x="230" y="59" textAnchor="middle" fontSize="10" fontWeight="900" fill={DIM}>SAME INCREASING FUNCTION FOR ALL THREE</text>
        {bases.map((base, i) => {
          const x=68+i*126;
          return <motion.g key={base} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*.18 }}>
            <rect x={x} y="75" width="72" height="45" rx="11" fill="#fff" stroke={COLORS[i]} strokeWidth="2.3" />
            <text x={x+36} y="104" textAnchor="middle" fontSize="18" fontWeight="950" fill={COLORS[i]} fontFamily={FONT}>{base}^{exponents[i]}</text>
            <motion.path d={`M ${x+36} 124 V 158`} stroke={COLORS[i]} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .25+i*.18 }} />
            <path d={`M ${x+30} 151 l 6 8 6-8`} fill="none" stroke={COLORS[i]} strokeWidth="2" />
            <rect x={x+12} y="130" width="48" height="20" rx="8" fill="#fff" stroke={COLORS[i]} />
            <text x={x+36} y="144" textAnchor="middle" fontSize="10" fontWeight="900" fill={COLORS[i]} fontFamily={FONT}>⁴√</text>
            <motion.g initial={{ opacity: 0, scale: .6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .55+i*.18 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={x} y="169" width="72" height="46" rx="11" fill={i===2 ? "#eef2ff" : i===1 ? "#f0fdfa" : "#fef3c7"} stroke={COLORS[i]} strokeWidth="2.3" />
              <text x={x+36} y="198" textAnchor="middle" fontSize="18" fontWeight="950" fill={COLORS[i]} fontFamily={FONT}>{base}^{reduced[i]}</text>
            </motion.g>
          </motion.g>;
        })}
        <text x="230" y="263" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>a &lt; b  ⇔  ⁴√a &lt; ⁴√b</text>
        <text x="230" y="286" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>taking the same positive root preserves the order</text>
      </>}

      {final && <>
        <line x1="45" y1="155" x2="415" y2="155" stroke={INK} strokeWidth="2.2" />
        <path d="M 415 155 l -9 -5 v 10 z" fill={INK} />
        {Array.from({ length: (max-min)/10+1 }, (_,i)=>min+i*10).map((v)=><g key={v}><line x1={X(v)} y1="149" x2={X(v)} y2="162" stroke="#94a3b8" /><text x={X(v)} y="177" textAnchor="middle" fontSize="9" fontWeight="800" fill={DIM} fontFamily={FONT}>{v}</text></g>)}
        {order.map((o, rank) => {
          const x=X(o.value), y=112-rank*25;
          return <motion.g key={o.i} initial={{ opacity: 0, x: 230-x }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 140, damping: 18, delay: rank*.22 }}>
            <line x1={x} y1={y+8} x2={x} y2="151" stroke={COLORS[o.i]} strokeWidth="2" strokeDasharray="4 3" />
            <circle cx={x} cy="155" r="7" fill={COLORS[o.i]} stroke="#fff" strokeWidth="2" />
            <rect x={x-43} y={y-17} width="86" height="28" rx="9" fill="#fff" stroke={COLORS[o.i]} strokeWidth="2" />
            <text x={x} y={y+2} textAnchor="middle" fontSize="12" fontWeight="950" fill={COLORS[o.i]} fontFamily={FONT}>{bases[o.i]}^{reduced[o.i]} = {o.value}</text>
          </motion.g>;
        })}
        <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .75 }}>
          <rect x="42" y="207" width="376" height="57" rx="13" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2.5" />
          <text x="230" y="242" textAnchor="middle" fontSize="16" fontWeight="950" fill={ok ? GREEN : RED} fontFamily={FONT}>{ordering}</text>
        </motion.g>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={278} width={78} />
        {!ok && <text x="230" y="307" textAnchor="middle" fontSize="9" fill={RED}>{fail}</text>}
      </>}
    </svg>
  </div>;
}
