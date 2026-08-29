import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GOLD = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Count the two edge families of a rectangular toothpick grid using boundary lines. */
export function ToothpickBoundaryCountScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const length = Math.round(num(data.lengthToothpicks, 0));
  const width = Math.round(num(data.widthToothpicks, 0));
  const verticalColumns = length + 1, horizontalRows = width + 1;
  const verticalCount = verticalColumns * width, horizontalCount = horizontalRows * length;
  const total = verticalCount + horizontalCount;
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d.-]/g, ""));
  const choice = (problem.choices ?? []).find((c) => Number(c.text) === total)?.label;
  const ok = stored === total && choice === problem.answer;
  const failure = stored !== total ? `computed ${total}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(Math.max(step, 0), 1);

  const x0 = 62, y0 = 48, dx = 43, dy = 30, shownCols = 8, shownRows = 6;
  const vActive = phase === 0 || phase === 2, hActive = phase >= 1;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 430 315" width="100%" style={{ maxWidth: 470, minWidth: 0, display: "block" }}>
      <text x="215" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
        {phase === 0 ? "60 spaces need 61 vertical boundary lines" : phase === 1 ? "32 spaces need 33 horizontal boundary lines" : "combine the two toothpick families"}
      </text>
      <text x="215" y="32" textAnchor="middle" fontSize="9" fontWeight="800" fill={DIM}>representative window of the 60-by-32 grid</text>

      {Array.from({ length: shownRows }, (_, r) => Array.from({ length: shownCols - 1 }, (_, c) => <motion.line key={`h${r}-${c}`} x1={x0 + c * dx + 4} y1={y0 + r * dy} x2={x0 + (c + 1) * dx - 4} y2={y0 + r * dy} stroke={hActive ? GOLD : "#cbd5e1"} strokeWidth={hActive ? 4 : 2} strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: .02 * (r + c) }} />))}
      {Array.from({ length: shownCols }, (_, c) => Array.from({ length: shownRows - 1 }, (_, r) => <motion.line key={`v${c}-${r}`} x1={x0 + c * dx} y1={y0 + r * dy + 4} x2={x0 + c * dx} y2={y0 + (r + 1) * dy - 4} stroke={vActive ? IND : "#cbd5e1"} strokeWidth={vActive ? 4 : 2} strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: .02 * (r + c) }} />))}

      <g fill={DIM} fontFamily={FONT} fontWeight="900">
        <text x="213" y="115" textAnchor="middle" fontSize="17">⋯</text><text x="213" y="145" textAnchor="middle" fontSize="17">⋯</text>
        <text x="122" y="132" textAnchor="middle" fontSize="17">⋮</text><text x="294" y="132" textAnchor="middle" fontSize="17">⋮</text>
      </g>
      <path d={`M ${x0} 219 v7 H ${x0 + (shownCols - 1) * dx} v-7`} fill="none" stroke={INK} strokeWidth="1.4" />
      <text x="212" y="242" textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>{length} toothpick spaces → {verticalColumns} vertical lines</text>
      <path d={`M 34 ${y0} h-7 V ${y0 + (shownRows - 1) * dy} h7`} fill="none" stroke={INK} strokeWidth="1.4" />
      <text x="18" y="127" textAnchor="middle" fontSize="10" fontWeight="900" fill={INK} fontFamily={FONT} transform="rotate(-90 18 127)">{width} spaces → {horizontalRows} rows</text>

      {phase === 0 && <g transform="translate(88 257)"><rect width="254" height="42" rx="11" fill="#eef2ff" stroke={IND} /><text x="127" y="17" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>vertical toothpicks</text><text x="127" y="35" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>{verticalColumns} × {width} = {verticalCount}</text></g>}
      {phase === 1 && <g transform="translate(88 257)"><rect width="254" height="42" rx="11" fill="#fff7ed" stroke={GOLD} /><text x="127" y="17" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>horizontal toothpicks</text><text x="127" y="35" textAnchor="middle" fontSize="16" fontWeight="900" fill={GOLD} fontFamily={FONT}>{horizontalRows} × {length} = {horizontalCount}</text></g>}
      {phase === 2 && <g transform="translate(54 253)"><motion.rect width="322" height="48" rx="12" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: .8 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="161" y="19" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>vertical + horizontal</text><text x="161" y="40" textAnchor="middle" fontSize="16" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{verticalCount} + {horizontalCount} = {total}</text></g>}
      <SvgAnswerBadge show={final && ok} answer={problem.answer ?? null} cx={215} y={292} width={78} />
      <AnimatePresence>{final && !ok && <motion.text x="215" y="314" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
