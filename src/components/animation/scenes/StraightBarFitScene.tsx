import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

type Cell = [number, number];
type Figure = { label: string; cells: Cell[]; cols: number; rows: number };

type Run = { length: number; orientation: "h" | "v"; line: number; start: number };

function longestRun(cells: Cell[], cols: number, rows: number): Run {
  const set = new Set(cells.map(([c, r]) => `${c},${r}`));
  let best: Run = { length: 0, orientation: "h", line: 0, start: 0 };
  for (let r = 0; r < rows; r++) {
    let run = 0;
    let start = 0;
    for (let c = 0; c <= cols; c++) {
      if (c < cols && set.has(`${c},${r}`)) {
        if (run === 0) start = c;
        run++;
      } else {
        if (run > best.length) best = { length: run, orientation: "h", line: r, start };
        run = 0;
      }
    }
  }
  for (let c = 0; c < cols; c++) {
    let run = 0;
    let start = 0;
    for (let r = 0; r <= rows; r++) {
      if (r < rows && set.has(`${c},${r}`)) {
        if (run === 0) start = r;
        run++;
      } else {
        if (run > best.length) best = { length: run, orientation: "v", line: c, start };
        run = 0;
      }
    }
  }
  return best;
}

/**
 * Five straight bars (lengths 1–5, 15 unit squares total) must tile four of
 * five candidate figures. The 5-bar needs 5 collinear unit cells somewhere in
 * a figure, so the scene computes each figure's longest straight row or
 * column run rather than searching for a full tiling — the one figure whose
 * longest run falls short of 5 is the one that cannot be built, and a dashed
 * overlay shows the 5-bar overshooting it by one cell.
 * Data: { figures:[{label, cells:[[col,row],...], cols, rows}, ...] }.
 */
export function StraightBarFitScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const figures = (Array.isArray(data.figures) ? data.figures : []).map((f) => {
    const o = (f ?? {}) as Record<string, unknown>;
    return {
      label: o.label != null ? String(o.label) : "?",
      cells: (Array.isArray(o.cells) ? o.cells : []) as Cell[],
      cols: Math.max(1, Math.round(Number(o.cols) || 1)),
      rows: Math.max(1, Math.round(Number(o.rows) || 1)),
    } as Figure;
  });

  const runs = figures.map((f) => longestRun(f.cells, f.cols, f.rows));
  const impossible = figures
    .map((f, i) => ({ f, run: runs[i] }))
    .filter((x) => x.run.length < 5);
  const winner = impossible[0]?.f ?? null;
  const matches = problem.answer == null || winner == null || winner.label === String(problem.answer);
  const failure =
    impossible.length !== 1
      ? `check failed: ${impossible.length} figures have a longest run under 5, not exactly one`
      : !matches
      ? `check failed: figure ${winner?.label} has the short run, stored answer is ${problem.answer}`
      : "";

  const lastStep = totalSteps - 1;
  const showRuns = step >= 1;
  const zoomB = step >= 2;
  const showFit = step >= 3;
  const isFinal = step >= lastStep;

  const bIndex = figures.findIndex((f) => f.label === winner?.label);
  const bFig = bIndex >= 0 ? figures[bIndex] : figures[0];
  const bRun = bIndex >= 0 ? runs[bIndex] : runs[0];

  // ---- geometry: a row of small outline grids, one per figure ----
  const cs = 12;
  const slotW = 5 * cs + 16;
  const W = figures.length * slotW + 10;
  const rowTop = 12;
  const gridH = 5 * cs;
  const labelY = rowTop + gridH + 12;
  const badgeY = labelY + 14;
  const zoomTop = badgeY + 20;
  const zoomCs = 22;
  const H = zoomB ? zoomTop + bFig.rows * zoomCs + 34 : badgeY + 12;

  const slotX = (i: number) => 10 + i * slotW + (slotW - 16 - figures[i].cols * cs) / 2;

  const runRect = (fig: Figure, run: Run, x0: number, y0: number, cell: number) => {
    if (run.length === 0) return null;
    if (run.orientation === "h") {
      return { x: x0 + run.start * cell, y: y0 + run.line * cell, w: run.length * cell, h: cell };
    }
    return { x: x0 + run.line * cell, y: y0 + run.start * cell, w: cell, h: run.length * cell };
  };

  const caption = isFinal
    ? `figure ${winner?.label} cannot be formed`
    : showFit
    ? `A, C, D, E each have a run of exactly 5, so the 5-bar fits`
    : zoomB
    ? `figure ${winner?.label}'s longest line is only ${bRun.length} — the 5-bar always sticks out`
    : showRuns
    ? `each figure's longest straight row or column, computed`
    : `5 bars (lengths 1–5) = 15 squares; each figure also has 15 cells`;

  const note = failure || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        {figures.map((fig, i) => {
          const x0 = slotX(i);
          const y0 = rowTop;
          const run = runs[i];
          const isB = fig.label === winner?.label;
          const rect = showRuns ? runRect(fig, run, x0, y0, cs) : null;
          return (
            <g key={fig.label}>
              {fig.cells.map(([c, r], k) => (
                <rect key={k} x={x0 + c * cs} y={y0 + r * cs} width={cs} height={cs} fill="#fff" stroke={INK} strokeWidth={1} />
              ))}
              <AnimatePresence>
                {rect && (
                  <motion.rect
                    key={`run-${step >= 3}`}
                    x={rect.x}
                    y={rect.y}
                    width={rect.w}
                    height={rect.h}
                    fill={isB ? "#fee2e2" : showFit ? "#dcfce7" : "#eef2ff"}
                    stroke={isB ? BAD : showFit ? WIN : IND}
                    strokeWidth={1.6}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.85 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                  />
                )}
              </AnimatePresence>
              <text x={x0 + (fig.cols * cs) / 2} y={labelY} textAnchor="middle" fontSize="10" fontWeight="800" fill="#64748b" fontFamily={numberFont}>
                {fig.label}
              </text>
              <AnimatePresence>
                {showRuns && (
                  <motion.text
                    x={x0 + (fig.cols * cs) / 2}
                    y={badgeY}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="800"
                    fill={isB ? BAD : "#94a3b8"}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.4 + i * 0.08 }}
                  >
                    {run.length}
                  </motion.text>
                )}
              </AnimatePresence>
            </g>
          );
        })}

        {/* zoomed-in view of the impossible figure, with the 5-bar overshooting */}
        <AnimatePresence>
          {zoomB && bIndex >= 0 && (
            <motion.g key="zoom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {(() => {
                const zx0 = (W - bFig.cols * zoomCs) / 2;
                const zy0 = zoomTop;
                const rect = runRect(bFig, bRun, zx0, zy0, zoomCs)!;
                // one extra cell past whichever end of the run stays nearer the shape's own span
                const overCell =
                  bRun.orientation === "h"
                    ? { x: rect.x + rect.w, y: rect.y, w: zoomCs, h: zoomCs }
                    : { x: rect.x, y: rect.y + rect.h, w: zoomCs, h: zoomCs };
                return (
                  <>
                    {bFig.cells.map(([c, r], k) => (
                      <rect key={k} x={zx0 + c * zoomCs} y={zy0 + r * zoomCs} width={zoomCs} height={zoomCs} fill="#fff" stroke={INK} strokeWidth={1.4} />
                    ))}
                    <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} fill="#fee2e2" stroke={BAD} strokeWidth={1.8} opacity={0.85} />
                    <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.5 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                      <rect x={overCell.x} y={overCell.y} width={overCell.w} height={overCell.h} fill="none" stroke={BAD} strokeWidth={2} strokeDasharray="4 3" />
                      <text x={overCell.x + overCell.w / 2} y={overCell.y + overCell.h / 2 + 5} textAnchor="middle" fontSize="16" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                        ✗
                      </text>
                    </motion.g>
                    <text x={W / 2} y={zy0 + bFig.rows * zoomCs + 16} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                      {bRun.length} in a line, the 5-bar needs one more
                    </text>
                  </>
                );
              })()}
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : zoomB && !showFit ? "#dc2626" : "#4338ca",
          background: isFinal ? "#dcfce7" : zoomB && !showFit ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : zoomB && !showFit ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {note && (
          <motion.span
            key={`note-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: BAD, textAlign: "center" }}
          >
            {note}
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
