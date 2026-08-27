import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const GREEN = "#16a34a";
const RED = "#dc2626";

/**
 * Seven daily page stacks form three subtotal blocks, then bind into one book.
 * Data: { dayCounts:[3,3,1], pagesPerDay:[36,44,10] }.
 */
export function WeekReadingStacksScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const counts = Array.isArray(data.dayCounts) ? data.dayCounts.map((v) => Math.round(num(v, 0))) : [];
  const rates = Array.isArray(data.pagesPerDay) ? data.pagesPerDay.map((v) => Math.round(num(v, 0))) : [];
  const subtotals = counts.map((count, i) => count * (rates[i] ?? 0));
  const total = subtotals.reduce((a, b) => a + b, 0);
  const final = step >= totalSteps - 1;
  const showSecond = step >= 1 || final;
  const stored = Number(problem.shortAnswer);
  const choice = problem.choices?.find((c) => Number(c.text) === total)?.label;
  const consistent = total === stored && choice === problem.answer;
  const days = counts.flatMap((count, group) => Array.from({ length: count }, (_, index) => ({ group, index, pages: rates[group] })));
  const colors = [INDIGO, TEAL, AMBER];
  const fills = ["#e0e7ff", "#ccfbf1", "#fef3c7"];
  const xAt = (i: number) => 32 + i * 46;
  const h = (pages: number) => 20 + pages * 0.72;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: "100%", padding: "5px 4px" }}>
      <svg viewBox="0 0 360 245" width="100%" style={{ maxWidth: 430 }}>
        <text x="180" y="16" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748b">ISABELLA'S READING WEEK</text>
        <line x1="18" y1="137" x2="342" y2="137" stroke="#cbd5e1" strokeWidth="2" />
        {days.map((day, i) => {
          const visible = day.group === 0 || (day.group === 1 && showSecond) || final;
          const height = h(day.pages);
          return (
            <motion.g key={i} initial={{ opacity: 0, y: -18 }} animate={{ opacity: visible ? 1 : 0.15, y: 0 }}
              transition={{ type: "spring", stiffness: 230, damping: 18, delay: visible ? day.index * 0.1 : 0 }}>
              <rect x={xAt(i) - 17} y={137 - height} width="34" height={height} rx="4" fill={fills[day.group]} stroke={colors[day.group]} strokeWidth="1.7" />
              {Array.from({ length: 4 }, (_, line) => <line key={line} x1={xAt(i) - 12} y1={129 - line * (height - 12) / 4} x2={xAt(i) + 11} y2={129 - line * (height - 12) / 4} stroke={colors[day.group]} opacity="0.28" />)}
              <text x={xAt(i)} y={111 - height} textAnchor="middle" fontSize="11" fontWeight="900" fill={colors[day.group]} fontFamily={FONT}>{day.pages}</text>
              <text x={xAt(i)} y="153" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#64748b">D{i + 1}</text>
            </motion.g>
          );
        })}

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
          <path d="M 15 163 V 170 H 141 V 163" fill="none" stroke={INDIGO} strokeWidth="2" />
          <text x="78" y="185" textAnchor="middle" fontSize="12" fontWeight="900" fill={INDIGO} fontFamily={FONT}>{counts[0]} × {rates[0]} = {subtotals[0]}</text>
        </motion.g>
        <AnimatePresence>{showSecond && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <path d="M 153 163 V 170 H 279 V 163" fill="none" stroke={TEAL} strokeWidth="2" />
          <text x="216" y="185" textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>{counts[1]} × {rates[1]} = {subtotals[1]}</text>
        </motion.g>}</AnimatePresence>
        <AnimatePresence>{final && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <path d="M 291 163 V 170 H 325 V 163" fill="none" stroke={AMBER} strokeWidth="2" />
          <text x="308" y="185" textAnchor="middle" fontSize="11" fontWeight="900" fill={AMBER} fontFamily={FONT}>+{subtotals[2]}</text>
          <motion.g initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, delay: 0.55 }} style={{ transformOrigin: "18px 205px" }}>
            <rect x="18" y="198" width="324" height="29" rx="5" fill="#dcfce7" stroke={GREEN} strokeWidth="2" />
            <rect x="18" y="198" width={324 * subtotals[0] / total} height="29" rx="5" fill="#e0e7ff" />
            <rect x={18 + 324 * subtotals[0] / total} y="198" width={324 * subtotals[1] / total} height="29" fill="#ccfbf1" />
            <line x1={18 + 324 * subtotals[0] / total} y1="198" x2={18 + 324 * subtotals[0] / total} y2="227" stroke={GREEN} />
            <line x1={18 + 324 * (subtotals[0] + subtotals[1]) / total} y1="198" x2={18 + 324 * (subtotals[0] + subtotals[1]) / total} y2="227" stroke={GREEN} />
          </motion.g>
          <text x="180" y="217" textAnchor="middle" fontSize="15" fontWeight="900" fill={consistent ? GREEN : RED} fontFamily={FONT}>{subtotals.join(" + ")} = {total} pages</text>
        </motion.g>}</AnimatePresence>
      </svg>
      <motion.span key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, color: final ? "#166534" : INDIGO, textAlign: "center" }}>
        {final ? `${subtotals[0]} + ${subtotals[1]} + ${subtotals[2]} = ${total} pages` : step === 0 ? `3 days at ${rates[0]} pages/day build ${subtotals[0]} pages` : `the next 3 days add ${subtotals[1]} pages`}
      </motion.span>
      <AnimatePresence>{final && consistent && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
        style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 800, fontSize: 15 }}>Answer {problem.answer}</motion.div>}</AnimatePresence>
      {final && !consistent && <span style={{ color: RED, fontSize: 11, fontWeight: 800 }}>computed page total does not match the stored answer</span>}
    </div>
  );
}
