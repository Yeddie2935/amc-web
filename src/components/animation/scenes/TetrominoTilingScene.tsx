import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const WIN = "#16a34a";
const PIECE_COLORS = ["#0d9488", "#4338ca", "#7c3aed", "#b45309", "#be123c"];

type Cell = [number, number];

/** The five tetrominoes, in a wide orientation for the legend strip. */
const LEGEND: Record<string, Cell[]> = {
  I: [[0, 0], [1, 0], [2, 0], [3, 0]],
  O: [[0, 0], [1, 0], [0, 1], [1, 1]],
  L: [[0, 0], [1, 0], [2, 0], [2, 1]],
  T: [[0, 0], [1, 0], [2, 0], [1, 1]],
  S: [[1, 0], [2, 0], [0, 1], [1, 1]],
};

function readCells(v: unknown): Cell[] {
  return Array.isArray(v)
    ? v.filter((c) => Array.isArray(c) && c.length >= 2).map((c) => [num((c as number[])[0], 0), num((c as number[])[1], 0)] as Cell)
    : [];
}

/** Outline of a polyomino: every cell edge not shared with another of its cells. */
function outline(cells: Cell[], S: number, X: (c: number) => number, Y: (r: number) => number): string {
  const has = new Set(cells.map(([x, y]) => `${x},${y}`));
  const seg: string[] = [];
  for (const [x, y] of cells) {
    const x0 = X(x);
    const y0 = Y(y);
    if (!has.has(`${x},${y - 1}`)) seg.push(`M ${x0},${y0} h ${S}`);
    if (!has.has(`${x},${y + 1}`)) seg.push(`M ${x0},${y0 + S} h ${S}`);
    if (!has.has(`${x - 1},${y}`)) seg.push(`M ${x0},${y0} v ${S}`);
    if (!has.has(`${x + 1},${y}`)) seg.push(`M ${x0 + S},${y0} v ${S}`);
  }
  return seg.join(" ");
}

/**
 * Tiling a rectangle with tetrominoes. Pieces fly into the grid one per step and
 * a counter tracks the squares still uncovered, so the fit is watched rather than
 * asserted. The scene checks the supplied tiling really covers every cell exactly
 * once and flags it if not.
 * Data: { cols, rows, pieces:[{type,cells:[[x,y],...]}], legend?:["I","O",...] }.
 */
export function TetrominoTilingScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const cols = Math.max(1, Math.round(num(data.cols, 4)));
  const rows = Math.max(1, Math.round(num(data.rows, 3)));
  const legend = Array.isArray(data.legend) ? data.legend.map((l) => String(l)) : Object.keys(LEGEND);
  const pieces = (Array.isArray(data.pieces) ? data.pieces : []).map((p, i) => {
    const o = (p ?? {}) as Record<string, unknown>;
    return {
      type: o.type != null ? String(o.type) : "?",
      cells: readCells(o.cells),
      color: PIECE_COLORS[i % PIECE_COLORS.length],
    };
  });

  // self-check: does the tiling cover every cell exactly once?
  const cover = new Map<string, number>();
  pieces.forEach((p) => p.cells.forEach(([x, y]) => cover.set(`${x},${y}`, (cover.get(`${x},${y}`) ?? 0) + 1)));
  const exact = cover.size === cols * rows && [...cover.values()].every((v) => v === 1);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const placed = isFinal ? pieces.length : Math.min(pieces.length, Math.max(0, step));
  const remaining = cols * rows - pieces.slice(0, placed).reduce((s, p) => s + p.cells.length, 0);

  // ---- geometry ----
  const S = 38;
  const W = 300;
  const legendTop = 12;
  const legendCell = 9;
  const gridTop = 66;
  const gridX = (W - cols * S) / 2;
  const X = (c: number) => gridX + c * S;
  const Y = (r: number) => gridTop + r * S;
  const H = gridTop + rows * S + 14;

  // pieces enter from off-grid so the placement is visible
  const entry = (i: number): { x: number; y: number } =>
    [{ x: -70, y: 0 }, { x: 0, y: 70 }, { x: 70, y: 0 }, { x: 0, y: -70 }][i % 4];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
        {/* the five shapes, for reference */}
        {legend.map((name, i) => {
          const shape = LEGEND[name] ?? [];
          const bx = 14 + i * 56;
          const used = pieces.some((p) => p.type === name && placed > pieces.indexOf(p));
          return (
            <g key={name} opacity={used ? 1 : 0.55}>
              {shape.map(([x, y], j) => (
                <rect
                  key={j}
                  x={bx + x * legendCell}
                  y={legendTop + y * legendCell}
                  width={legendCell}
                  height={legendCell}
                  fill={used ? "#c7d2fe" : "#e2e8f0"}
                  stroke="#94a3b8"
                  strokeWidth={0.7}
                />
              ))}
              <text x={bx + 18} y={legendTop + 40} textAnchor="middle" fontSize="11" fontWeight="800" fill={used ? INK : "#94a3b8"} fontFamily={numberFont}>
                {name}
              </text>
            </g>
          );
        })}

        {/* the empty rectangle */}
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((__, c) => (
            <rect key={`${r}-${c}`} x={X(c)} y={Y(r)} width={S} height={S} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1} />
          ))
        )}

        {/* pieces snap into place, one per step */}
        {pieces.slice(0, placed).map((p, i) => {
          const e = entry(i);
          return (
            <motion.g
              key={i}
              initial={{ x: e.x, y: e.y, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0.15 }}
            >
              {p.cells.map(([x, y], j) => (
                <rect key={j} x={X(x)} y={Y(y)} width={S} height={S} fill={p.color} fillOpacity={0.85} />
              ))}
              <path d={outline(p.cells, S, X, Y)} stroke="#fff" strokeWidth={2.5} fill="none" strokeLinecap="round" />
              <path d={outline(p.cells, S, X, Y)} stroke={p.color} strokeWidth={1.2} fill="none" strokeLinecap="round" />
              <text
                x={X(p.cells[0][0]) + S / 2}
                y={Y(p.cells[0][1]) + S / 2 + 5}
                textAnchor="middle"
                fontSize="15"
                fontWeight="800"
                fill="#fff"
                fontFamily={numberFont}
              >
                {p.type}
              </text>
            </motion.g>
          );
        })}
      </svg>

      {/* caption */}
      <motion.span
        key={`${placed}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 13,
          fontWeight: 800,
          color: isFinal ? "#166534" : "#4338ca",
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {placed === 0
          ? `${pieces.length} tiles × 4 = ${cols * rows} squares`
          : isFinal
          ? `filled — the other two tiles are ${pieces.slice(1).map((p) => p.type).join(" and ")}`
          : `${pieces[placed - 1].type} placed — ${remaining} squares left`}
      </motion.span>

      {!exact && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: "#dc2626" }}>
          tiling data does not cover the rectangle exactly
        </span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
