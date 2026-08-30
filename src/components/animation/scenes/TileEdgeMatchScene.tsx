import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

type Dir = "top" | "right" | "bottom" | "left";
type Tile = { top: number; right: number; bottom: number; left: number };
type Corner = "A" | "B" | "C" | "D";

const CORNERS: Corner[] = ["A", "B", "C", "D"];
const OUTSIDE: Record<Corner, Dir[]> = { A: ["top", "left"], B: ["top", "right"], C: ["bottom", "left"], D: ["bottom", "right"] };
const OPPOSITE: Record<Dir, Dir> = { top: "bottom", bottom: "top", left: "right", right: "left" };
const EDGES: { c1: Corner; d1: Dir; c2: Corner; d2: Dir }[] = [
  { c1: "A", d1: "right", c2: "B", d2: "left" },
  { c1: "A", d1: "bottom", c2: "C", d2: "top" },
  { c1: "B", d1: "bottom", c2: "D", d2: "top" },
  { c1: "C", d1: "right", c2: "D", d2: "left" },
];

function permutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr];
  const out: T[][] = [];
  arr.forEach((item, i) => {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const p of permutations(rest)) out.push([item, ...p]);
  });
  return out;
}

/**
 * Four numbered tiles must fill a 2x2 grid so every shared edge matches.
 * The tile with digits that appear nowhere else is placed first (its
 * unmatched edges are forced to the outside), then the target rectangle's
 * tile is found from the one shared edge that borders it — a beat is
 * spent on the trap of matching the wrong pair of edges (top/bottom
 * instead of left/right, or vice versa).
 * Data: { tiles: {I,II,III,IV -> {top,right,bottom,left}}, target }.
 */
export function TileEdgeMatchScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const tiles = (data.tiles ?? {}) as Record<string, Tile>;
  const tileIds = Object.keys(tiles);
  const target = (String(data.target ?? "C") as Corner) || "C";

  // solve: find the unique assignment of tiles to corners satisfying every shared edge
  let solution: Record<Corner, string> | null = null;
  for (const perm of permutations(tileIds)) {
    const assign: Record<Corner, string> = { A: perm[0], B: perm[1], C: perm[2], D: perm[3] };
    const ok = EDGES.every((e) => tiles[assign[e.c1]][e.d1] === tiles[assign[e.c2]][e.d2]);
    if (ok) {
      solution = assign;
      break;
    }
  }

  // find the tile whose "unique" edge directions exactly match one corner's outside set
  const uniqueDirs = (id: string): Dir[] =>
    (["top", "right", "bottom", "left"] as Dir[]).filter((d) => {
      const v = tiles[id][d];
      return !tileIds.some((other) => other !== id && (["top", "right", "bottom", "left"] as Dir[]).some((d2) => tiles[other][d2] === v));
    });

  let keyTile = "";
  let keyCorner: Corner | null = null;
  for (const id of tileIds) {
    const u = uniqueDirs(id);
    const match = CORNERS.find((c) => OUTSIDE[c].length === u.length && OUTSIDE[c].every((d) => u.includes(d)));
    if (match) {
      keyTile = id;
      keyCorner = match;
      break;
    }
  }

  const edgeToTarget = keyCorner ? EDGES.find((e) => (e.c1 === keyCorner && e.c2 === target) || (e.c2 === keyCorner && e.c1 === target)) : undefined;
  const correctDir: Dir | null = edgeToTarget ? (edgeToTarget.c1 === keyCorner ? edgeToTarget.d1 : edgeToTarget.d2) : null;
  const targetDir = correctDir ? OPPOSITE[correctDir] : null;
  const targetValue = correctDir ? tiles[keyTile][correctDir] : null;
  const targetTileId = correctDir ? tileIds.find((id) => id !== keyTile && targetDir && tiles[id][targetDir] === targetValue) : undefined;

  const matches = problem.shortAnswer == null || targetTileId === String(problem.shortAnswer).trim();
  const failure = !matches ? `check failed: computed tile for ${target} is ${targetTileId}, stored answer is ${problem.shortAnswer}` : "";

  // trap: match along the wrong axis (top/bottom instead of left/right, or vice versa)
  const trapDir: Dir | null = correctDir === "left" || correctDir === "right" ? "top" : correctDir === "top" || correctDir === "bottom" ? "left" : null;
  const trapValue = trapDir ? tiles[keyTile][trapDir] : null;
  const trapOppositeDir = trapDir ? OPPOSITE[trapDir] : null;
  const trapTileId = trapDir ? tileIds.find((id) => id !== keyTile && trapOppositeDir && tiles[id][trapOppositeDir] === trapValue) : undefined;
  const trapChoice = trapTileId && trapTileId !== targetTileId ? (problem.choices ?? []).find((c) => c.text.trim() === trapTileId) : null;

  const lastStep = totalSteps - 1;
  const showKeyHighlight = step >= 1;
  const showKeyPlaced = step >= 2;
  const showTrap = step === 3;
  const showTargetPlaced = step >= 4;
  const showFullGrid = step >= 5;
  const isFinal = step >= lastStep;

  const caption = isFinal
    ? `${target} is filled by tile ${targetTileId}`
    : showFullGrid
    ? `the rest of the grid falls into place`
    : showTargetPlaced
    ? `tile ${keyTile}'s ${correctDir} edge is ${targetValue}, so ${target} needs a matching ${targetDir} edge → tile ${targetTileId}`
    : showTrap && trapChoice
    ? `matching the ${trapDir} edge (${trapValue}) instead would wrongly suggest ${trapTileId} — choice ${trapChoice.label}`
    : showKeyPlaced
    ? `tile ${keyTile} goes in corner ${keyCorner}`
    : showKeyHighlight
    ? `tile ${keyTile}'s unmatched digits must face outside`
    : `four tiles fill rectangles A, B, C, D so touching edges match`;

  const note = failure || "";

  // ---- geometry: source tiles on the left, target grid on the right ----
  const tileSize = 52;
  const gap = 14;
  const cols = 2;
  const srcX0 = 10;
  const srcY0 = 20;
  const gridX0 = 200;
  const gridY0 = 20;
  const W = gridX0 + tileSize * 2 + 4 + 14;
  const H = 190;

  const srcPos = (i: number) => ({ x: srcX0 + (i % cols) * (tileSize + gap), y: srcY0 + Math.floor(i / cols) * (tileSize + gap) });
  const cornerPos: Record<Corner, { x: number; y: number }> = {
    A: { x: gridX0, y: gridY0 },
    B: { x: gridX0 + tileSize + 4, y: gridY0 },
    C: { x: gridX0, y: gridY0 + tileSize + 4 },
    D: { x: gridX0 + tileSize + 4, y: gridY0 + tileSize + 4 },
  };

  const renderTileFace = (id: string, x: number, y: number, highlight: "none" | "key" | "target", trapDirLocal?: Dir | null) => {
    const t = tiles[id];
    const stroke = highlight === "key" ? IND : highlight === "target" ? WIN : "#94a3b8";
    return (
      <g key={`${id}-${x}-${y}`}>
        <rect x={x} y={y} width={tileSize} height={tileSize} rx={5} fill="#f8fafc" stroke={stroke} strokeWidth={highlight !== "none" ? 2 : 1.2} />
        <text x={x + tileSize / 2} y={y + 12} textAnchor="middle" fontSize="9" fontWeight="800" fill={showTrap && trapDirLocal === "top" ? BAD : INK} fontFamily={numberFont}>
          {t.top}
        </text>
        <text x={x + tileSize - 4} y={y + tileSize / 2 + 3} textAnchor="end" fontSize="9" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {t.right}
        </text>
        <text x={x + tileSize / 2} y={y + tileSize - 4} textAnchor="middle" fontSize="9" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {t.bottom}
        </text>
        <text x={x + 4} y={y + tileSize / 2 + 3} textAnchor="start" fontSize="9" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {t.left}
        </text>
        <text x={x + tileSize / 2} y={y + tileSize / 2 + 3} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#cbd5e1" fontFamily={numberFont}>
          {id}
        </text>
      </g>
    );
  };

  const placedInGrid = new Set<string>();
  if (showKeyPlaced) placedInGrid.add(keyTile);
  if (showTargetPlaced && targetTileId) placedInGrid.add(targetTileId);
  if (showFullGrid && solution) tileIds.forEach((id) => placedInGrid.add(id));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
        <text x={srcX0} y={12} fontSize="8.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          tiles
        </text>
        <text x={gridX0 + tileSize + 2} y={12} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          grid
        </text>

        {/* source tray: tiles not yet placed */}
        {tileIds
          .filter((id) => !placedInGrid.has(id))
          .map((id, i) => renderTileFace(id, srcPos(i).x, srcPos(i).y, id === keyTile && showKeyHighlight ? "key" : "none", id === keyTile ? trapDir : null))}

        {/* empty grid outlines */}
        {CORNERS.map((c) => (
          <rect key={c} x={cornerPos[c].x} y={cornerPos[c].y} width={tileSize} height={tileSize} rx={5} fill="none" stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 2" />
        ))}

        {/* placed tiles in the grid */}
        <AnimatePresence>
          {keyCorner && showKeyPlaced && (
            <motion.g key="keyplaced" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              {renderTileFace(keyTile, cornerPos[keyCorner].x, cornerPos[keyCorner].y, "key")}
            </motion.g>
          )}
          {showTargetPlaced && targetTileId && (
            <motion.g key="targetplaced" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              {renderTileFace(targetTileId, cornerPos[target].x, cornerPos[target].y, "target")}
            </motion.g>
          )}
          {showFullGrid &&
            solution &&
            CORNERS.filter((c) => c !== keyCorner && c !== target).map((c) => (
              <motion.g key={c} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                {renderTileFace(solution[c], cornerPos[c].x, cornerPos[c].y, "none")}
              </motion.g>
            ))}
        </AnimatePresence>

        {/* corner labels */}
        {CORNERS.map((c) => (
          <text key={`lbl-${c}`} x={cornerPos[c].x + tileSize / 2} y={cornerPos[c].y - 4} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
            {c}
          </text>
        ))}
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? BAD : "#4338ca",
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
          maxWidth: 300,
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
