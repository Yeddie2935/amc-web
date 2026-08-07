import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

// Area model for a shaded border/frame: an outer rectangle with a uniform
// reachable band around an unreachable inner rectangle. Draws the real figure to
// scale and finds reachable = outer − inner and the fraction. Reusable for
// "shaded border" / "path around a garden" area problems.
// Data: { outerW, outerH, border, unit?, icon? }.
export function BorderAreaScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const W = num(data.outerW, 0);
  const H = num(data.outerH, 0);
  const b = num(data.border, 0);
  const unit = data.unit != null ? String(data.unit) : "";
  const icon = data.icon != null ? String(data.icon) : "";

  const total = W * H;
  const iW = W - 2 * b;
  const iH = H - 2 * b;
  const inner = iW * iH;
  const reachable = total - inner;
  const g = gcd(reachable, total);
  const fn = reachable / g;
  const fd = total / g;

  const last = totalSteps - 1;
  const final = step >= last;
  const answer = problem.answer ?? null;

  // Scale the field to fit, then lay it out with room for dimension labels.
  const s = Math.min(280 / W, 200 / H);
  const ox = 46;
  const oy = 26;
  const opW = W * s;
  const opH = H * s;
  const bs = b * s;
  const svgW = ox + opW + 16;
  const svgH = oy + opH + 30;

  // A light sprinkle of themed icons in the reachable band.
  const berries = icon
    ? [
        [ox + opW * 0.32, oy + bs / 2], [ox + opW * 0.68, oy + bs / 2],
        [ox + opW * 0.32, oy + opH - bs / 2], [ox + opW * 0.68, oy + opH - bs / 2],
        [ox + bs / 2, oy + opH * 0.5], [ox + opW - bs / 2, oy + opH * 0.5],
      ]
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "6px 4px" }}>
      <div style={{ fontFamily: numberFont, fontSize: 14, fontWeight: 700, color: "#475569", background: "#f1f5f9", padding: "3px 12px", borderRadius: 999 }}>
        Field = {W} × {H} = {total} {unit}²
      </div>

      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ maxWidth: "100%" }}>
        {/* Outer field = reachable band (green) */}
        <motion.rect
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          x={ox} y={oy} width={opW} height={opH} rx={4}
          fill="#bbf7d0" stroke="#16a34a" strokeWidth={2}
        />
        {/* Inner rectangle = unreachable */}
        <rect x={ox + bs} y={oy + bs} width={iW * s} height={iH * s} fill="#f8fafc" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" />

        {berries.map(([x, y], i) => (
          <motion.text
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 14, delay: 0.2 + i * 0.08 }}
            x={x} y={y} fontSize={14} textAnchor="middle" dominantBaseline="central"
          >
            {icon}
          </motion.text>
        ))}

        {/* Inner area label */}
        <text x={ox + bs + (iW * s) / 2} y={oy + bs + (iH * s) / 2 - 6} fontSize={11} textAnchor="middle" fill="#64748b" fontWeight={700}>
          unreachable
        </text>
        <text x={ox + bs + (iW * s) / 2} y={oy + bs + (iH * s) / 2 + 12} fontSize={13} textAnchor="middle" fill="#334155" fontWeight={800} fontFamily={numberFont}>
          {iW} × {iH} = {inner}
        </text>

        {/* Dimension labels */}
        <text x={ox + opW / 2} y={oy + opH + 20} fontSize={12} textAnchor="middle" fill="#334155" fontWeight={700}>{W} {unit}</text>
        <text x={ox - 16} y={oy + opH / 2} fontSize={12} textAnchor="middle" fill="#334155" fontWeight={700} transform={`rotate(-90 ${ox - 16} ${oy + opH / 2})`}>{H} {unit}</text>
        {/* border width marker (top-left band) */}
        <line x1={ox + 10} y1={oy} x2={ox + 10} y2={oy + bs} stroke="#16a34a" strokeWidth={1.5} />
        <text x={ox + 18} y={oy + bs / 2 + 4} fontSize={10} fill="#16a34a" fontWeight={700}>{b} {unit}</text>
      </svg>

      <AnimatePresence>
        {final && (
          <motion.div
            key="calc"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
          >
            <span style={{ fontFamily: numberFont, fontSize: 16, fontWeight: 800, color: "#16a34a" }}>
              reachable = {total} − {inner} = {reachable}
            </span>
            <span style={{ fontFamily: numberFont, fontSize: 20, fontWeight: 800, color: "#1f2a44" }}>
              {reachable}/{total} = {fn}/{fd}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {final && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
