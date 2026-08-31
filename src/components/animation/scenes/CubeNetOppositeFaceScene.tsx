import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const DIM = "#94a3b8";

type Cell = { id: string; label: string; color: string; col: number; row: number };
type Dir = "N" | "S" | "E" | "W";
type Die = { T: string | null; Bo: string | null; N: string | null; S: string | null; E: string | null; W: string | null };

const OPP: Record<Dir, Dir> = { N: "S", S: "N", E: "W", W: "E" };

function roll(dir: Dir, s: Die): Die {
  switch (dir) {
    case "N":
      return { T: s.S, S: s.Bo, Bo: s.N, N: s.T, E: s.E, W: s.W };
    case "S":
      return { T: s.N, N: s.Bo, Bo: s.S, S: s.T, E: s.E, W: s.W };
    case "E":
      return { T: s.W, W: s.Bo, Bo: s.E, E: s.T, N: s.N, S: s.S };
    case "W":
      return { T: s.E, E: s.Bo, Bo: s.W, W: s.T, N: s.N, S: s.S };
  }
}

function parseCells(raw: unknown): Cell[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const o = (r ?? {}) as Record<string, unknown>;
    return {
      id: String(o.id ?? o.label ?? "?"),
      label: String(o.label ?? "?"),
      color: String(o.color ?? "#94a3b8"),
      col: Number(o.col ?? 0),
      row: Number(o.row ?? 0),
    };
  });
}

/**
 * A cube net's opposite-face pairing is found the way you'd physically roll
 * a die across the net: starting at one square with its top face known, each
 * step to a grid-neighbor permutes which face is top/bottom/north/south/
 * east/west, and — because rolling always keeps top opposite bottom, north
 * opposite south, east opposite west — a full walk across every square (with
 * backtracking restoring the die's state when returning to a branch point)
 * ends with the root square's die state fully resolved into three opposite
 * pairs. Nothing here is asserted: the net's actual grid layout drives the
 * roll simulation, and the answer is read off the resolved state.
 * Data: { cells: [{id,label,color,col,row}, ...], target: "W" }.
 */
export function CubeNetOppositeFaceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const cells = parseCells(data.cells);
  const target = data.target != null ? String(data.target) : cells[cells.length - 1]?.id ?? "";
  const byId = new Map(cells.map((c) => [c.id, c]));

  // adjacency: two cells are net-neighbors if grid positions differ by 1 in one axis
  const adjacency = new Map<string, { dir: Dir; to: string }[]>();
  for (const a of cells) {
    const list: { dir: Dir; to: string }[] = [];
    for (const b of cells) {
      if (a.id === b.id) continue;
      const dc = b.col - a.col;
      const dr = b.row - a.row;
      if (dc === 1 && dr === 0) list.push({ dir: "E", to: b.id });
      else if (dc === -1 && dr === 0) list.push({ dir: "W", to: b.id });
      else if (dr === 1 && dc === 0) list.push({ dir: "N", to: b.id });
      else if (dr === -1 && dc === 0) list.push({ dir: "S", to: b.id });
    }
    adjacency.set(a.id, list);
  }

  const root = cells[0]?.id ?? "";
  let path: { id: string; dir: Dir | null }[] = [{ id: root, dir: null }];

  const opposite: Record<string, string> = {};
  let rootFinal: Die | null = null;
  if (cells.length >= 2 && root) {
    let cur: Die = { T: byId.get(root)?.label ?? root, Bo: null, N: null, S: null, E: null, W: null };
    const visited = new Set([root]);
    const explore = (cellId: string) => {
      for (const { dir, to } of adjacency.get(cellId) ?? []) {
        if (visited.has(to)) continue;
        visited.add(to);
        cur = roll(dir, cur);
        if (cur.T == null) cur.T = byId.get(to)?.label ?? to;
        explore(to);
        cur = roll(OPP[dir], cur);
      }
    };
    explore(root);
    rootFinal = cur;

    // direct (backtrack-free) path of grid directions from root to every cell
    const dirPath = new Map<string, Dir[]>([[root, []]]);
    const bfsVisited = new Set([root]);
    const queue = [root];
    while (queue.length) {
      const c = queue.shift()!;
      for (const { dir, to } of adjacency.get(c) ?? []) {
        if (bfsVisited.has(to)) continue;
        bfsVisited.add(to);
        dirPath.set(to, [...(dirPath.get(c) ?? []), dir]);
        queue.push(to);
      }
    }

    // re-roll from the fully-resolved root state along each direct path to
    // read off that cell's opposite (bottom) face
    for (const c of cells) {
      let s = rootFinal;
      for (const dir of dirPath.get(c.id) ?? []) s = roll(dir, s);
      if (s.Bo) opposite[byId.get(c.id)?.label ?? c.id] = s.Bo;
    }

    // the displayed fold path: root -> ... -> target, with cell ids filled in
    const filled: { id: string; dir: Dir | null }[] = [{ id: root, dir: null }];
    let cid = root;
    for (const dir of dirPath.get(target) ?? []) {
      const next = (adjacency.get(cid) ?? []).find((n) => n.dir === dir)?.to;
      if (!next) break;
      filled.push({ id: next, dir });
      cid = next;
    }
    path = filled;
  }

  const targetCell = byId.get(target);
  const targetLabel = targetCell?.label ?? target;
  const answerLetter = opposite[targetLabel] ? (problem.choices ?? []).find((c) => c.text.trim() === opposite[targetLabel])?.label : null;
  const valid = answerLetter != null && answerLetter === problem.answer;

  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), last);
  // 0: net, 1: fold path highlighted, 2: rolling readout, 3: all opposite pairs, 4: conclude
  const showPath = beat >= 1;
  const showRoll = beat === 2;
  const showPairs = beat >= 3;
  const showConclude = beat >= 4;

  const S = 40;
  const minCol = Math.min(...cells.map((c) => c.col), 0);
  const maxRow = Math.max(...cells.map((c) => c.row), 0);
  const netX = (c: number) => 20 + (c - minCol) * S;
  const netY = (r: number) => 20 + (maxRow - r) * S;

  const W = 380;
  const H = 260;

  const rollSteps = path.map((p, i) => {
    if (i === 0) return { id: p.id, T: root ? byId.get(root)?.label : "", Bo: "?" };
    // recompute die at this point along the path from rootFinal
    let s = rootFinal;
    for (let k = 1; k <= i; k++) {
      const dir = path[k].dir!;
      s = s ? roll(dir, s) : s;
    }
    return { id: p.id, T: byId.get(p.id)?.label ?? p.id, Bo: s?.Bo ?? "?" };
  });

  const pairs: [string, string][] = [];
  const seen = new Set<string>();
  for (const c of cells) {
    const opp = opposite[c.label];
    if (opp && !seen.has(c.label) && !seen.has(opp)) {
      pairs.push([c.label, opp]);
      seen.add(c.label);
      seen.add(opp);
    }
  }

  const caption =
    beat === 0
      ? "a cube net with six labeled faces"
      : beat === 1
      ? `fold from ${byId.get(root)?.label} through the net toward ${targetLabel}`
      : beat === 2
      ? "roll a die along that path — top and bottom stay opposite the whole way"
      : beat === 3
      ? "the net resolves into three opposite pairs"
      : `${targetLabel} is opposite ${opposite[targetLabel] ?? "?"}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px", boxSizing: "border-box" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400, minWidth: 0, display: "block" }} aria-label="A cube net folding, tracking which face ends up opposite the target face">
        {/* the flat net */}
        {cells.map((c, i) => {
          const x = netX(c.col);
          const y = netY(c.row);
          const onPath = showPath && path.some((p) => p.id === c.id);
          const isTarget = c.id === target;
          return (
            <motion.g key={c.id} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07, type: "spring", stiffness: 240, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={x} y={y} width={S - 4} height={S - 4} rx="6" fill={`${c.color}33`} stroke={isTarget ? IND : onPath ? c.color : "#cbd5e1"} strokeWidth={isTarget ? 2.6 : onPath ? 2 : 1.3} />
              <text x={x + (S - 4) / 2} y={y + (S - 4) / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="950" fill={c.color} fontFamily={FONT}>
                {c.label}
              </text>
            </motion.g>
          );
        })}

        {/* the fold path, drawn as connecting dots between cell centers */}
        <AnimatePresence>
          {showPath &&
            path.slice(1).map((p, i) => {
              const a = byId.get(path[i].id)!;
              const b = byId.get(p.id)!;
              const ax = netX(a.col) + (S - 4) / 2;
              const ay = netY(a.row) + (S - 4) / 2;
              const bx = netX(b.col) + (S - 4) / 2;
              const by = netY(b.row) + (S - 4) / 2;
              return (
                <motion.line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke={IND} strokeWidth="2.4" strokeDasharray="5 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.2, duration: 0.4 }} />
              );
            })}
        </AnimatePresence>

        {/* rolling die readout */}
        <AnimatePresence>
          {showRoll && (
            <motion.g key="readout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transform="translate(20 172)">
              <text x="0" y="0" fontSize="10" fontWeight="850" fill={DIM}>
                ROLLING
              </text>
              {rollSteps.map((r, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.25 }}>
                  <text x={i * 92} y="20" fontSize="11.5" fontWeight="900" fill={IND} fontFamily={FONT}>
                    top {r.T}
                  </text>
                  <text x={i * 92} y="34" fontSize="10" fontWeight="800" fill={DIM} fontFamily={FONT}>
                    bottom {r.Bo}
                  </text>
                  {i < rollSteps.length - 1 && (
                    <text x={i * 92 + 76} y="20" fontSize="12" fontWeight="900" fill={DIM}>
                      →
                    </text>
                  )}
                </motion.g>
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* all three opposite pairs */}
        <AnimatePresence>
          {showPairs && (
            <motion.g key="pairs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transform="translate(20 190)">
              {pairs.map(([x, y], i) => {
                const isAnswer = x === targetLabel || y === targetLabel;
                return (
                  <motion.g key={i} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15, type: "spring" }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <rect x={i * 118} y={-14} width="108" height="24" rx="8" fill={isAnswer ? "#f0fdf4" : "#f8fafc"} stroke={isAnswer ? GREEN : "#cbd5e1"} strokeWidth={isAnswer ? 2 : 1.2} />
                    <text x={i * 118 + 54} y="3" textAnchor="middle" fontSize="12" fontWeight="900" fill={isAnswer ? GREEN : INK} fontFamily={FONT}>
                      {x} ↔ {y}
                    </text>
                  </motion.g>
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>

        <SvgAnswerBadge show={showConclude} answer={problem.answer != null ? String(problem.answer) : null} cx={W / 2} y={216} width={92} />
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 800,
          color: showConclude ? (valid ? "#166534" : "#dc2626") : INK,
          background: showConclude ? (valid ? "#dcfce7" : "#fef2f2") : "#eef2ff",
          border: `1px solid ${showConclude ? (valid ? "#bbf7d0" : "#fecaca") : "#c7d2fe"}`,
          padding: "5px 12px",
          borderRadius: 10,
          textAlign: "center",
          maxWidth: 340,
        }}
      >
        {caption}
      </motion.span>
    </div>
  );
}
