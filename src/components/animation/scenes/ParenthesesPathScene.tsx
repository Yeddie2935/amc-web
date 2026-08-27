import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const AMBER = "#f59e0b";
const GREEN = "#16a34a";
const RED = "#dc2626";

/**
 * The same three numbers travel down two evaluation lanes. Harry's parentheses
 * gather the last two numbers before subtraction; Terry instead takes one
 * left-to-right hop at a time. The final number line performs H - T as an
 * eleven-unit leftward move. Data: { start, subtract, add }.
 */
export function ParenthesesPathScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const start = num(data.start, 0);
  const subtract = num(data.subtract, 0);
  const add = num(data.add, 0);
  const grouped = subtract + add;
  const harry = start - grouped;
  const afterSubtract = start - subtract;
  const terry = afterSubtract + add;
  const difference = harry - terry;
  const final = step >= totalSteps - 1;
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[−–—]/g, "-"));
  const consistent = Number.isFinite(stored) && stored === difference;

  const chip = (x: number, y: number, text: string, fill = "#eef2ff", stroke = INDIGO) => (
    <g>
      <rect x={x - 18} y={y - 14} width="36" height="28" rx="8" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <text x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={mono}>{text}</text>
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: "100%", padding: "5px 4px" }}>
      <svg viewBox="0 0 360 250" width="100%" style={{ maxWidth: 430 }}>
        <text x="12" y="17" fontSize="11" fontWeight="900" fill={INDIGO}>HARRY — PARENTHESES FIRST</text>
        {chip(34, 48, String(start))}
        <motion.path d="M 56 48 H 272" fill="none" stroke="#c7d2fe" strokeWidth="3" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />
        <motion.g initial={{ opacity: 0, y: -7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <path d="M 91 42 Q 91 29 104 29 H 176 Q 189 29 189 42" fill="none" stroke={AMBER} strokeWidth="2.5" />
          <text x="140" y="24" textAnchor="middle" fontSize="12" fontWeight="900" fill={AMBER} fontFamily={mono}>{subtract} + {add} = {grouped}</text>
        </motion.g>
        <motion.g initial={{ x: -92, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.55 }}>
          {chip(290, 48, String(harry), "#dcfce7", GREEN)}
        </motion.g>
        <text x="205" y="43" textAnchor="middle" fontSize="13" fontWeight="900" fill={INDIGO} fontFamily={mono}>{start} − {grouped}</text>
        <text x="205" y="59" textAnchor="middle" fontSize="10" fontWeight="800" fill="#64748b">subtract the whole group</text>

        <g opacity={step >= 1 || final ? 1 : 0.25}>
          <text x="12" y="91" fontSize="11" fontWeight="900" fill={step >= 1 ? INDIGO : "#94a3b8"}>TERRY — LEFT TO RIGHT</text>
          {chip(34, 122, String(start))}
          <line x1="56" y1="122" x2="136" y2="122" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
          <line x1="174" y1="122" x2="254" y2="122" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
          <text x="96" y="113" textAnchor="middle" fontSize="12" fontWeight="900" fill={RED} fontFamily={mono}>− {subtract}</text>
          <text x="214" y="113" textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN} fontFamily={mono}>+ {add}</text>
          <motion.g initial={false} animate={{ scale: step >= 1 || final ? 1 : 0 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            {chip(155, 122, String(afterSubtract), "#fff7ed", AMBER)}
            {chip(273, 122, String(terry), "#eef2ff", INDIGO)}
          </motion.g>
          <text x="155" y="148" textAnchor="middle" fontSize="10" fontWeight="800" fill="#64748b" fontFamily={mono}>{start} − {subtract} = {afterSubtract}</text>
          <text x="273" y="148" textAnchor="middle" fontSize="10" fontWeight="800" fill="#64748b" fontFamily={mono}>{afterSubtract} + {add} = {terry}</text>
        </g>

        <AnimatePresence>
          {final && (
            <motion.g key="difference" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <line x1="32" y1="194" x2="328" y2="194" stroke={INK} strokeWidth="2" />
              {[-10, -5, 0, 1].map((value) => {
                const x = 50 + (value + 10) * 21;
                return <g key={value}><line x1={x} y1="189" x2={x} y2="199" stroke={INK} /><text x={x} y="212" textAnchor="middle" fontSize="10" fill={INK} fontFamily={mono}>{value}</text></g>;
              })}
              <motion.path d="M 281 180 Q 166 154 50 180" fill="none" stroke={RED} strokeWidth="3" markerEnd="url(#parenArrow)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.3 }} />
              <text x="165" y="164" textAnchor="middle" fontSize="13" fontWeight="900" fill={RED} fontFamily={mono}>{harry} − {terry}: move {terry} left</text>
              <circle cx="281" cy="194" r="6" fill={INDIGO} /><circle cx="50" cy="194" r="7" fill={consistent ? GREEN : RED} />
              <defs><marker id="parenArrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6z" fill={RED} /></marker></defs>
              {!consistent && <text x="180" y="232" textAnchor="middle" fontSize="11" fontWeight="800" fill={RED}>computed result does not match the stored answer</text>}
            </motion.g>
          )}
        </AnimatePresence>
        <SvgAnswerBadge show={final && consistent} answer={problem.answer} cx={304} y={220} width={94} />
      </svg>
      <motion.span key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: mono, fontSize: 12, fontWeight: 800, color: final ? "#166534" : INDIGO, textAlign: "center" }}>
        {final ? `H − T = ${harry} − ${terry} = ${difference}` : step === 0 ? `H = ${start} − (${subtract} + ${add}) = ${harry}` : `T = ${start} − ${subtract} + ${add} = ${terry}`}
      </motion.span>
    </div>
  );
}
