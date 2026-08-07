import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const SEG_COLORS = ["#818cf8", "#fb923c", "#f472b6", "#38bdf8"];

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}
function strList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}

// Battery-gauge proportion: a whole battery of `denom` bars; the used bars
// (colored per trip) correspond to a known `amount`, so each bar = amount/used
// and the full battery = denom × that. Reusable for "a fraction of the whole is
// this much, find the whole" problems. Data: { amount, unit?, denom,
// segLabels?, segFracs?, segNums:[5,3] }.
export function BatteryScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const amount = num(data.amount, 0);
  const unit = data.unit != null ? String(data.unit) : "";
  const denom = Math.max(1, num(data.denom, 10));
  const segNums = Array.isArray(data.segNums) ? data.segNums.map((v) => num(v, 0)) : [];
  const segFracs = strList(data.segFracs);
  const used = segNums.reduce((a, b) => a + b, 0);
  const perBar = used ? amount / used : 0;
  const full = perBar * denom;
  const g = gcd(used, denom);
  const simp = `${used / g}/${denom / g}`;

  const last = totalSteps - 1;
  const final = step >= last;
  const answer = problem.answer ?? null;

  // Battery geometry.
  const bx = 46, by = 24, bw = 280, bh = 64, pad = 6, gap = 3;
  const cellW = (bw - 2 * pad - (denom - 1) * gap) / denom;
  const cellH = bh - 2 * pad;
  const cellX = (i: number) => bx + pad + i * (cellW + gap);
  const cellY = by + pad;
  const svgW = bx + bw + 12 + 12;
  const svgH = by + bh + 30;

  // Which segment (by color) each used bar belongs to.
  const segOf = (i: number) => {
    let acc = 0;
    for (let s = 0; s < segNums.length; s++) {
      acc += segNums[s];
      if (i < acc) return s;
    }
    return -1;
  };
  const usedEndX = cellX(used - 1) + cellW;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "6px 4px" }}>
      <div style={{ fontFamily: numberFont, fontSize: 15, fontWeight: 700, color: "#475569" }}>
        {segFracs.length ? `${segFracs.join(" + ")} = ${simp}` : `${simp}`} of battery = {amount} {unit}
      </div>

      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ maxWidth: "100%" }}>
        <text x={18} y={by + bh / 2} fontSize={24} textAnchor="middle" dominantBaseline="central">🚲</text>
        {/* battery shell + nub */}
        <rect x={bx} y={by} width={bw} height={bh} rx={10} fill="#fff" stroke="#1f2a44" strokeWidth={2.5} />
        <rect x={bx + bw} y={by + 18} width={10} height={28} rx={3} fill="#1f2a44" />
        {/* empty cells */}
        {Array.from({ length: denom }).map((_, i) => (
          <rect key={`b${i}`} x={cellX(i)} y={cellY} width={cellW} height={cellH} rx={3} fill="#eef2ff" />
        ))}
        {/* filled cells: used bars in per-trip colors; remaining bars fill green on the final step */}
        {Array.from({ length: denom }).map((_, i) => {
          const isUsed = i < used;
          const show = isUsed || final;
          if (!show) return null;
          const fill = isUsed ? SEG_COLORS[segOf(i) % SEG_COLORS.length] : "#22c55e";
          return (
            <motion.rect
              key={`f${i}`}
              initial={{ opacity: 0, scaleY: 0.4 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 16, delay: isUsed ? i * 0.1 : 0.15 + (i - used) * 0.12 }}
              style={{ transformOrigin: `${cellX(i) + cellW / 2}px ${cellY + cellH}px` }}
              x={cellX(i)} y={cellY} width={cellW} height={cellH} rx={3} fill={fill}
            />
          );
        })}
        {/* bracket under the used bars */}
        <line x1={cellX(0)} y1={by + bh + 8} x2={usedEndX} y2={by + bh + 8} stroke="#475569" strokeWidth={1.5} />
        <text x={(cellX(0) + usedEndX) / 2} y={by + bh + 24} fontSize={12} textAnchor="middle" fill="#475569" fontWeight={700} fontFamily={numberFont}>
          {used} bars = {amount} {unit}
        </text>
      </svg>

      <AnimatePresence>
        {final && (
          <motion.div
            key="calc"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: numberFont, fontSize: 17, fontWeight: 800, color: "#1f2a44", textAlign: "center" }}
          >
            each bar = {amount} ÷ {used} = {perBar} {unit} → full = {denom} × {perBar} = {full} {unit}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {final && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.45 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
