import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/**
 * A quadrilateral plotted from its own four coordinates turns out to be a
 * trapezoid the moment two sides land on vertical lines — the scene plots
 * the real points, measures those two parallel sides and the horizontal gap
 * between them from the coordinates themselves, then has to survive the
 * trap of treating it like a rectangle (base times height, no averaging)
 * before applying the real trapezoid formula. Data: { ax, ay, bx, by, cx,
 * cy, dx, dy }.
 */
export function CoordinateTrapezoidAreaScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const A = { x: num(data.ax, 3), y: num(data.ay, 2) };
  const B = { x: num(data.bx, 3), y: num(data.by, -2) };
  const C = { x: num(data.cx, -3), y: num(data.cy, -2) };
  const D = { x: num(data.dx, -3), y: num(data.dy, 0) };

  const base1 = Math.abs(A.y - B.y);
  const base2 = Math.abs(C.y - D.y);
  const height = Math.abs(A.x - D.x);
  const area = ((base1 + base2) / 2) * height;
  const answerOk = problem.shortAnswer == null || String(area) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${area}, stored answer is ${problem.shortAnswer}` : "";

  const trapArea = base1 * height;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(trapArea));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showSides = step >= 1;
  const showTrap = step === 2 && !isFinal;

  const unit = 25;
  const ox = 140;
  const oy = 110;
  const px = (x: number) => ox + x * unit;
  const py = (y: number) => oy - y * unit;

  const W = 280;
  const H = 220;

  const caption = isFinal
    ? `((${base1} + ${base2}) ÷ 2) × ${height} = ${area}`
    : showTrap
    ? trapChoice
      ? `${base1} × ${height} = ${trapArea} — choice ${trapChoice.label} treats it like a rectangle`
      : `${base1} × ${height} = ${trapArea}, but the two parallel sides aren't equal`
    : showSides
    ? `AB = ${base1}, CD = ${base2}, both vertical`
    : `plot A, B, C, D from their real coordinates`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 300 }}>
        <line x1={px(-5.5)} y1={py(0)} x2={px(5.5)} y2={py(0)} stroke="#e2e8f0" strokeWidth={1.4} />
        <line x1={px(0)} y1={py(-3.5)} x2={px(0)} y2={py(3.5)} stroke="#e2e8f0" strokeWidth={1.4} />

        <motion.polygon
          points={`${px(A.x)},${py(A.y)} ${px(B.x)},${py(B.y)} ${px(C.x)},${py(C.y)} ${px(D.x)},${py(D.y)}`}
          fill="#eef2ff"
          stroke={INK}
          strokeWidth={2}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />

        {[
          { p: A, l: "A" },
          { p: B, l: "B" },
          { p: C, l: "C" },
          { p: D, l: "D" },
        ].map(({ p, l }, i) => (
          <motion.g key={l} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: i * 0.12 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <circle cx={px(p.x)} cy={py(p.y)} r={4} fill={IND} />
            <text x={px(p.x) + (p.x >= 0 ? 8 : -8)} y={py(p.y) - 6} textAnchor={p.x >= 0 ? "start" : "end"} fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {l}({p.x},{p.y})
            </text>
          </motion.g>
        ))}

        {showSides && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
            <line x1={px(A.x) + 6} y1={py(A.y)} x2={px(B.x) + 6} y2={py(B.y)} stroke={WIN} strokeWidth={2.6} />
            <text x={px(A.x) + 12} y={(py(A.y) + py(B.y)) / 2 + 4} fontSize="10" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              {base1}
            </text>
            <line x1={px(C.x) - 6} y1={py(C.y)} x2={px(D.x) - 6} y2={py(D.y)} stroke={WIN} strokeWidth={2.6} />
            <text x={px(C.x) - 12} y={(py(C.y) + py(D.y)) / 2 + 4} textAnchor="end" fontSize="10" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              {base2}
            </text>
          </motion.g>
        )}

        {(showTrap || isFinal) && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
            <line x1={px(D.x)} y1={py(D.y) + 14} x2={px(A.x)} y2={py(D.y) + 14} stroke={IND} strokeWidth={2} strokeDasharray="4 3" />
            <text x={(px(D.x) + px(A.x)) / 2} y={py(D.y) + 28} textAnchor="middle" fontSize="10" fontWeight="800" fill={IND} fontFamily={numberFont}>
              {height}
            </text>
          </motion.g>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? BAD : IND,
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
      )}

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
