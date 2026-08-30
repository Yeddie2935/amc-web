import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const NAVY = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const DIM = "#94a3b8";

const PIPS: Record<number, [number, number][]> = {
  1: [[0, 0]],
  2: [[-1, -1], [1, 1]],
  3: [[-1, -1], [0, 0], [1, 1]],
  4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  6: [[-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1]],
};

function Die({ n, cx, cy, size, dim = false }: { n: number; cx: number; cy: number; size: number; dim?: boolean }) {
  const r = size * 0.09;
  const d = size * 0.27;
  return (
    <g opacity={dim ? 0.3 : 1}>
      <rect x={cx - size / 2} y={cy - size / 2} width={size} height={size} rx={size * 0.2} fill="#fff" stroke={dim ? "#cbd5e1" : "#94a3b8"} strokeWidth={1.4} />
      {(PIPS[n] ?? []).map(([px, py], i) => (
        <circle key={i} cx={cx + px * d} cy={cy + py * d} r={r} fill={dim ? "#cbd5e1" : NAVY} />
      ))}
    </g>
  );
}

// One die has six faces; whichever lands on the bottom, the other five stay
// visible. Every possible hidden face is checked in turn: the visible
// product is 6!/hidden, and every one of the six cases turns out divisible
// by 6, so the probability is certain. Data: { faces: [1,2,3,4,5,6] }.
export function HiddenFaceProductScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const faces = (Array.isArray(data.faces) ? data.faces : [1, 2, 3, 4, 5, 6]).map(Number);
  const total = faces.reduce((a, b) => a * b, 1);

  const last = totalSteps - 1;
  const revealedRows = Math.max(0, Math.min(faces.length, step));
  const isFinal = step >= last;
  const successCount = faces.slice(0, revealedRows).filter((h) => (total / h) % 6 === 0).length;

  const topY = 22;
  const dieSize = 26;
  const spacing = 44;
  const rowH = 20;
  const tableY0 = 84;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 300 ${tableY0 + faces.length * rowH + 30}`} width="100%" style={{ maxWidth: 300 }}>
        {faces.map((f, i) => (
          <g key={f}>
            <Die n={f} cx={20 + i * spacing + spacing / 2} cy={topY} size={dieSize} dim={i === revealedRows - 1} />
            {i < revealedRows - 1 && (
              <text x={20 + i * spacing + spacing / 2} y={topY - dieSize / 2 - 4} textAnchor="middle" fontSize="10" fontWeight="900" fill={GREEN} fontFamily={FONT}>
                ✓
              </text>
            )}
          </g>
        ))}
        <text x={150} y={topY + dieSize / 2 + 14} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={FONT}>
          6! = {total}
        </text>

        <text x={8} y={tableY0 - 8} fontSize="9" fontWeight="800" fill={DIM} fontFamily={FONT}>
          hidden
        </text>
        <text x={90} y={tableY0 - 8} fontSize="9" fontWeight="800" fill={DIM} fontFamily={FONT}>
          visible product
        </text>
        <text x={230} y={tableY0 - 8} fontSize="9" fontWeight="800" fill={DIM} fontFamily={FONT}>
          ÷6?
        </text>

        {faces.map((f, i) => {
          const show = i < revealedRows;
          const visible = total / f;
          const divisible = visible % 6 === 0;
          const y = tableY0 + i * rowH;
          return (
            <AnimatePresence key={f}>
              {show && (
                <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 240, damping: 20 }}>
                  <text x={8} y={y + 12} fontSize="10.5" fontWeight="800" fill={NAVY} fontFamily={FONT}>
                    {f}
                  </text>
                  <text x={90} y={y + 12} fontSize="10.5" fontWeight="800" fill={INDIGO} fontFamily={FONT}>
                    {total} ÷ {f} = {visible}
                  </text>
                  <text x={235} y={y + 12} textAnchor="middle" fontSize="11" fontWeight="900" fill={divisible ? GREEN : "#dc2626"} fontFamily={FONT}>
                    {divisible ? "✓" : "✗"}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          );
        })}
      </svg>

      <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 700, color: NAVY, textAlign: "center", maxWidth: 300 }}>
        {revealedRows === 0
          ? `the die has faces ${faces.join(", ")} — product of all six is ${total}`
          : isFinal
          ? `${successCount}/${faces.length} hidden faces give a multiple of 6 — probability ${successCount}/${faces.length}`
          : `hide face ${faces[revealedRows - 1]}: ${total}/${faces[revealedRows - 1]} = ${total / faces[revealedRows - 1]}, divisible by 6`}
      </motion.div>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
