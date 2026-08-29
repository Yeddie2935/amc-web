import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const A_COLOR = "#4338ca";
const B_COLOR = "#d97706";
const DIAG_COLORS = ["#4338ca", "#0d9488", "#d97706", "#7c3aed", "#dc2626", "#0891b2", "#65a30d"];

function Chip({ n, cx, cy, size, color }: { n: number; cx: number; cy: number; size: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={size / 2} fill="#fff" stroke={color} strokeWidth={2.4} />
      <circle cx={cx} cy={cy} r={size / 2 - 4} fill="none" stroke={color} strokeWidth={1} strokeDasharray="2 2" opacity={0.6} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={size * 0.36} fontWeight="800" fill={color} fontFamily={FONT}>
        {n}
      </text>
    </g>
  );
}

/**
 * One chip drawn from each of two bags, every pair's sum landing in a grid
 * cell — but because both bags step by 2 (odd values in one, even in the
 * other), the sum of cell (i, j) depends only on i + j, so equal sums fall
 * on the exact same anti-diagonals a dice-sum table would use. The scene
 * leans on that: it fills all 9 cells first (matching the "9" answer choice
 * exactly, the real trap here), then groups cells by diagonal to show which
 * sums repeat, and only counts the diagonals — not the cells — for the
 * final total.
 *
 * data: { aValues: [1,3,5], bValues: [2,4,6], aLabel?, bLabel? }
 */
export function ChipSumGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const aValues = (Array.isArray(data.aValues) ? data.aValues : [1, 3, 5]).map((v) => Math.round(num(v, 0)));
  const bValues = (Array.isArray(data.bValues) ? data.bValues : [2, 4, 6]).map((v) => Math.round(num(v, 0)));
  const aLabel = data.aLabel != null ? String(data.aLabel) : "Bag A";
  const bLabel = data.bLabel != null ? String(data.bLabel) : "Bag B";
  const n = Math.min(aValues.length, bValues.length);

  const sums: number[][] = aValues.map((a) => bValues.map((b) => a + b));
  const distinct = Array.from(new Set(sums.flat())).sort((x, y) => x - y);
  const totalCells = n * n;

  const trapChoice = (problem.choices ?? []).find(
    (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === totalCells && String(c.label) !== problem.answer
  );
  const ok = String(distinct.length) === (problem.shortAnswer ?? "").trim();

  // ---- diagonals: cells with the same i+j share a sum, since both bags step evenly ----
  const diagIndexOf = (s: number) => distinct.indexOf(s);

  // ---- beats: 0 setup, 1 build grid, 2 the trap, 3 group by sum, 4 count distinct, 5 land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 5));
  const isFinal = step >= last;

  // ---- geometry, borrowed proportions from the grid-plus-diagonal convention ----
  const c = 44;
  const X0 = 64;
  const Y0 = 70;
  const W = 340;
  const H = Y0 + n * c + 60;
  const cxOf = (bi: number) => X0 + (bi + 0.5) * c;
  const cyOf = (ai: number) => Y0 + (ai + 0.5) * c;

  const showGrid = beat >= 1;
  const showDiags = beat >= 3;

  const caption =
    beat === 0
      ? `${aLabel}: ${aValues.join(", ")}   ${bLabel}: ${bValues.join(", ")}`
      : beat === 1
      ? `${n} × ${n} = ${totalCells} possible draws, each with a sum`
      : beat === 2
      ? `${totalCells} draws — but are all ${totalCells} sums different?`
      : beat === 3
      ? `cells on the same diagonal share a sum`
      : beat === 4
      ? `${distinct.length} distinct sums: ${distinct.join(", ")}`
      : `${distinct.length} different values`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* bag headers: column = bag B, row = bag A */}
        {bValues.map((b, bi) => (
          <motion.g key={`ch${bi}`} initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: bi * 0.06 }}>
            <Chip n={b} cx={cxOf(bi)} cy={28} size={26} color={B_COLOR} />
          </motion.g>
        ))}
        {aValues.map((a, ai) => (
          <motion.g key={`rh${ai}`} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 + ai * 0.06 }}>
            <Chip n={a} cx={X0 - 26} cy={cyOf(ai)} size={26} color={A_COLOR} />
          </motion.g>
        ))}
        <text x={X0 + (n * c) / 2} y={9} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={FONT}>
          {bLabel}
        </text>

        {/* the sum grid */}
        {showGrid &&
          aValues.map((a, ai) =>
            bValues.map((b, bi) => {
              const sum = a + b;
              const di = diagIndexOf(sum);
              const color = showDiags ? DIAG_COLORS[di % DIAG_COLORS.length] : IND;
              return (
                <motion.g
                  key={`${ai}-${bi}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.15 + (ai + bi) * 0.05 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <rect
                    x={cxOf(bi) - c / 2 + 4}
                    y={cyOf(ai) - c / 2 + 4}
                    width={c - 8}
                    height={c - 8}
                    rx={7}
                    fill={showDiags ? color : "#eef2ff"}
                    fillOpacity={showDiags ? 0.18 : 1}
                    stroke={color}
                    strokeWidth={showDiags ? 2 : 1.2}
                  />
                  <text x={cxOf(bi)} y={cyOf(ai) + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill={color} fontFamily={FONT}>
                    {sum}
                  </text>
                </motion.g>
              );
            })
          )}

        {/* beat 4-5: the distinct sums, pulled out and counted */}
        {beat >= 4 && (
          <g>
            {distinct.map((s, i) => {
              const dx = X0 + 10 + i * ((W - 2 * X0 - 20) / Math.max(1, distinct.length - 1));
              const dy = Y0 + n * c + 34;
              return (
                <motion.g key={s} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <circle cx={dx} cy={dy} r={13} fill={DIAG_COLORS[i % DIAG_COLORS.length]} fillOpacity={0.85} />
                  <text x={dx} y={dy + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily={FONT}>
                    {s}
                  </text>
                </motion.g>
              );
            })}
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
          color: isFinal ? "#166534" : beat === 2 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 2 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 2 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 2 && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 270 }}>
            {trapChoice ? `choice ${trapChoice.label} (${totalCells}) counts every draw, not every distinct sum` : `not every draw gives a different sum`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${distinct.length} but stored answer reads "${problem.shortAnswer}"`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
