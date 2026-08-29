import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const COLORS = ["#4338ca", "#0d9488", "#d97706", "#7c3aed", "#dc2626"];

/** A small standing figure, so a headcount reads as real students, not dots. */
function Student({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy - r * 0.55} r={r * 0.42} fill={color} />
      <path d={`M ${cx - r * 0.75},${cy + r * 0.65} a ${r * 0.75} ${r * 0.7} 0 0 1 ${r * 1.5} 0 Z`} fill={color} />
    </g>
  );
}

/**
 * Several teachers' class counts, each a separate group of students, that
 * simply add up to the school's total contest takers. There's no trap here
 * — the whole solution is one addition — so the scene draws every student
 * as a real standing figure, one classroom's row at a time, then walks the
 * running total across the groups so the arithmetic is watched happening
 * rather than just stated.
 *
 * data: { classes: ["Mrs. Germain|11", "Mr. Newton|8", "Mrs. Young|9"] }
 */
export function ClassroomTallyScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const classes = (Array.isArray(data.classes) ? data.classes : []).map((raw) => {
    const [name, countStr] = String(raw).split("|");
    return { name: name ?? "class", count: Math.round(num(countStr, 0)) };
  });
  const n = classes.length;

  const runningTotals: number[] = [];
  classes.reduce((acc, c) => {
    const t = acc + c.count;
    runningTotals.push(t);
    return t;
  }, 0);
  const total = runningTotals[runningTotals.length - 1] ?? 0;
  const ok = String(total) === (problem.shortAnswer ?? "").trim();

  // ---- beats: 0..n-1 reveal each classroom, n..2n-2 fold each new class into the running total ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), last);
  const isFinal = step >= last;

  const inReveal = beat < n;
  const revealCount = inReveal ? beat + 1 : n;
  // addBeat k (0-indexed) folds classes[k+1] into the total, landing on runningTotals[k+1]
  const addBeat = beat - n;
  const summingIndex = inReveal ? -1 : Math.min(n - 1, addBeat + 1);

  // ---- geometry: one row per classroom, students laid out left to right ----
  const W = 360;
  const rowH = 46;
  const topPad = 30;
  const H = topPad + n * rowH + 76;
  const iconR = 12;
  const rowX0 = 90;
  const pitch = 20;

  const caption = inReveal
    ? `${classes[beat]?.name}: ${classes[beat]?.count} students`
    : isFinal
    ? `${classes.map((c) => c.count).join(" + ")} = ${total} students`
    : `+ ${classes[summingIndex]?.count} → ${runningTotals[summingIndex]}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {classes.map((c, ci) => {
          const rowY = topPad + ci * rowH;
          const revealed = ci < revealCount;
          const color = COLORS[ci % COLORS.length];
          return (
            <g key={c.name}>
              <text x={8} y={rowY + 5} fontSize="9.5" fontWeight="800" fill={color} fontFamily={FONT}>
                {c.name}
              </text>
              {revealed &&
                Array.from({ length: c.count }).map((_, si) => (
                  <motion.g
                    key={si}
                    initial={{ opacity: 0, y: -12, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18, delay: ci === beat ? si * 0.05 : 0 }}
                  >
                    <Student cx={rowX0 + si * pitch} cy={rowY} r={iconR} color={color} />
                  </motion.g>
                ))}
            </g>
          );
        })}

        {/* the running-total ledger, once we start adding */}
        {!inReveal && (
          <g>
            <line x1={20} y1={topPad + n * rowH + 10} x2={W - 20} y2={topPad + n * rowH + 10} stroke="#cbd5e1" strokeWidth={1.2} />
            {classes.map((c, ci) => {
              const shown = ci <= summingIndex;
              if (!shown) return null;
              return (
                <motion.text
                  key={c.name}
                  x={20 + ci * 40}
                  y={topPad + n * rowH + 32}
                  fontSize="12"
                  fontWeight="800"
                  fill={COLORS[ci % COLORS.length]}
                  fontFamily={FONT}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16 }}
                >
                  {ci === 0 ? c.count : `+ ${c.count}`}
                </motion.text>
              );
            })}
            {summingIndex >= 0 && (
              <motion.text
                x={W - 20}
                y={topPad + n * rowH + 32}
                textAnchor="end"
                fontSize="14"
                fontWeight="800"
                fill={isFinal ? WIN : IND}
                fontFamily={FONT}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.2 }}
              >
                = {runningTotals[summingIndex]}
              </motion.text>
            )}
          </g>
        )}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : IND,
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${total} but stored answer reads "${problem.shortAnswer}"`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.9 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
